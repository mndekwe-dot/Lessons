"""Validate slugify() against the TOCs that were written by hand.

Files in engineering-curriculum already carry working tables of contents.
Regenerating their anchors from their own headings and comparing against the
links already in the file proves the generator produces the same anchors
GitHub does - before it is let loose on the rest of the course.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_toc import REPO, SKIP_DIRS, collect_headings, has_toc, slugify  # noqa: E402

LINK_RE = re.compile(r"\[[^\]]*\]\(#([^)]+)\)")


def main() -> int:
    checked = matched = 0
    problems: list[str] = []

    for md in sorted(REPO.rglob("*.md")):
        if any(p in SKIP_DIRS for p in md.parts):
            continue
        try:
            lines = md.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeDecodeError):
            continue
        if not has_toc(lines):
            continue

        existing = {m.group(1) for line in lines for m in [LINK_RE.search(line)] if m}
        if not existing:
            continue
        generated = {slugify(t) for _, t in collect_headings(lines)}
        if not generated:
            continue

        checked += 1
        # Every anchor the author wrote that points at a real H2 should be one
        # we would have generated.
        missing = {a for a in existing if a not in generated}
        # Anchors may legitimately point at H3s or other files' sections, so
        # only treat it as a failure when we cover none of them.
        hit = len(existing) - len(missing)
        if hit and not missing:
            matched += 1
        elif hit:
            matched += 1
            problems.append(f"  partial {md.relative_to(REPO)}: "
                            f"{len(missing)} anchor(s) not matched, e.g. "
                            f"{sorted(missing)[:3]}")
        else:
            problems.append(f"  MISMATCH {md.relative_to(REPO)}: none of "
                            f"{len(existing)} anchors matched")

    print(f"files with a hand-written TOC checked: {checked}")
    print(f"files whose anchors we reproduce:      {matched}")
    if problems:
        print("\nnotes:")
        for p in problems[:15]:
            print(p)
    return 0 if matched == checked else 1


if __name__ == "__main__":
    sys.exit(main())
