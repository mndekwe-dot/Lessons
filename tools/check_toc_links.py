"""Verify every in-page TOC link resolves to a real heading.

Checks H2 and H3 (and H1) so that hand-written TOCs pointing at sub-sections
are validated too.  Reports any anchor that would not jump anywhere on GitHub.

Usage: python tools/check_toc_links.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_toc import REPO, SKIP_DIRS, split_fenced, slugify  # noqa: E402

ANY_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
LINK_RE = re.compile(r"\[([^\]]*)\]\(#([^)]+)\)")


def heading_anchors(lines: list[str]) -> set[str]:
    masked = split_fenced(lines)
    seen: dict[str, int] = {}
    anchors = set()
    for i, line in enumerate(lines):
        if masked[i]:
            continue
        m = ANY_HEADING_RE.match(line)
        if not m:
            continue
        base = slugify(m.group(2))
        n = seen.get(base, 0)
        seen[base] = n + 1
        anchors.add(base if not n else f"{base}-{n}")
    return anchors


def main() -> int:
    total_links = broken = files_with_broken = 0
    report: list[str] = []

    for md in sorted(REPO.rglob("*.md")):
        if any(p in SKIP_DIRS for p in md.parts):
            continue
        try:
            lines = md.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeDecodeError):
            continue

        anchors = heading_anchors(lines)
        masked = split_fenced(lines)
        bad: list[str] = []
        for i, line in enumerate(lines):
            if masked[i]:
                continue
            for m in LINK_RE.finditer(line):
                total_links += 1
                if m.group(2) not in anchors:
                    bad.append(f"      line {i + 1}: [{m.group(1)[:40]}](#{m.group(2)})")
        if bad:
            files_with_broken += 1
            broken += len(bad)
            report.append(f"  {md.relative_to(REPO)}  ({len(bad)} broken)")
            report.extend(bad[:4])

    print(f"in-page links checked : {total_links}")
    print(f"broken                : {broken}  in {files_with_broken} file(s)")
    if report:
        print("\nbroken links (pre-existing, hand-written TOCs):")
        for line in report[:40]:
            print(line)
    return 0


if __name__ == "__main__":
    sys.exit(main())
