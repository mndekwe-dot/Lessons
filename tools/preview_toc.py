"""Show the TOC that would be inserted into given files, without writing."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_toc import REPO, build_toc, collect_headings, insertion_point  # noqa: E402


def main() -> int:
    for rel in sys.argv[1:]:
        path = REPO / rel
        lines = path.read_text(encoding="utf-8").splitlines()
        headings = collect_headings(lines)
        if not headings:
            print(f"--- {rel}: no H2 sections ---\n")
            continue
        at, replaces_rule = insertion_point(lines, headings[0][0])
        block = build_toc(headings)
        tail = lines[at + 1:] if replaces_rule else lines[at:]
        print("=" * 72)
        print(f"{rel}   (replaces existing rule: {replaces_rule})")
        print("=" * 72)
        print("... context before insertion ...")
        for line in lines[max(0, at - 3):at]:
            print(f"  | {line}")
        print(">>> INSERTED:")
        for line in block:
            print(f"  + {line}")
        print("... context after ...")
        for line in tail[:3]:
            print(f"  | {line}")
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
