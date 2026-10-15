"""Verify every relative markdown link points at a file that exists.

check_toc_links.py validates in-page anchors (#section). This one validates
cross-file links (../other/FILE.md), which is what breaks when directories move.

Usage: python tools/check_file_links.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_toc import REPO, SKIP_DIRS, split_fenced  # noqa: E402

LINK_RE = re.compile(r"\[([^\]]*)\]\(([^)]+)\)")
SKIP_PREFIX = ("http://", "https://", "mailto:", "#", "data:")


def main() -> int:
    checked = broken = 0
    report: list[str] = []

    for md in sorted(REPO.rglob("*.md")):
        if any(p in SKIP_DIRS for p in md.parts):
            continue
        try:
            lines = md.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeDecodeError):
            continue
        masked = split_fenced(lines)

        for i, line in enumerate(lines):
            if masked[i]:
                continue
            for m in LINK_RE.finditer(line):
                target = m.group(2).strip()
                if target.startswith(SKIP_PREFIX):
                    continue
                # strip any anchor fragment and surrounding backticks
                path_part = target.split("#", 1)[0].strip().strip("`")
                if not path_part:
                    continue
                checked += 1
                resolved = (md.parent / path_part).resolve()
                if not resolved.exists():
                    broken += 1
                    report.append(
                        f"  {md.relative_to(REPO)}:{i + 1}\n"
                        f"      [{m.group(1)[:40]}]({target})")

    print(f"relative file links checked : {checked}")
    print(f"broken                      : {broken}")
    if report:
        print("\nbroken links:")
        for r in report[:40]:
            print(r)
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main())
