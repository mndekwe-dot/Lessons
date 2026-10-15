"""Repair broken in-page TOC anchors.

The hand-written TOCs in engineering-curriculum contain anchors that were
shortened by hand (`#2-how-email-works` for a heading that GitHub actually
slugs as `2-how-email-works--the-full-journey`), so those entries jump
nowhere.  This repoints each broken link at the heading it clearly meant,
matching first on the link's own text and then on an unambiguous prefix.

Usage:
    python tools/fix_toc_links.py --dry-run
    python tools/fix_toc_links.py
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from add_toc import REPO, SKIP_DIRS, split_fenced, slugify  # noqa: E402
from check_toc_links import ANY_HEADING_RE, LINK_RE  # noqa: E402


def heading_anchors(lines: list[str]) -> list[str]:
    masked = split_fenced(lines)
    seen: dict[str, int] = {}
    out = []
    for i, line in enumerate(lines):
        if masked[i]:
            continue
        m = ANY_HEADING_RE.match(line)
        if not m:
            continue
        base = slugify(m.group(2))
        n = seen.get(base, 0)
        seen[base] = n + 1
        out.append(base if not n else f"{base}-{n}")
    return out


NUM_PREFIX = re.compile(r"^\d+-")


def _unique(matches: list[str]) -> str | None:
    return matches[0] if len(matches) == 1 else None


def resolve(anchor: str, label: str, anchors: list[str]) -> str | None:
    """Find the heading this link was meant to point at.

    Tried in order of confidence: the label's own slug, then a prefix of the
    written anchor, then a prefix of the label, then a suffix of the label
    (the TOC text often drops the section number the heading carries), then a
    comparison with the leading section number stripped from both sides.
    """
    want = slugify(label)
    if want in anchors:
        return want
    for candidates in (
        [a for a in anchors if a.startswith(anchor)],
        [a for a in anchors if a.startswith(want)],
        [a for a in anchors if want and a.endswith(want)],
    ):
        hit = _unique(candidates)
        if hit:
            return hit

    # Compare with the leading "12-" style number removed from both sides.
    bare_anchor = NUM_PREFIX.sub("", anchor)
    bare = {a: NUM_PREFIX.sub("", a) for a in anchors}
    for candidates in (
        [a for a, b in bare.items() if b == bare_anchor],
        [a for a, b in bare.items() if bare_anchor and b.startswith(bare_anchor)],
    ):
        hit = _unique(candidates)
        if hit:
            return hit
    return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()

    fixed = unresolved = files_changed = 0
    for md in sorted(REPO.rglob("*.md")):
        if any(p in SKIP_DIRS for p in md.parts):
            continue
        try:
            with open(md, "r", encoding="utf-8", newline="") as fh:
                text = fh.read()
        except (OSError, UnicodeDecodeError):
            continue
        newline = "\r\n" if "\r\n" in text else "\n"
        lines = text.splitlines()
        anchors = heading_anchors(lines)
        anchor_set = set(anchors)
        masked = split_fenced(lines)
        changed = False

        for i, line in enumerate(lines):
            if masked[i] or "](#" not in line:
                continue

            def repl(m: re.Match) -> str:
                nonlocal fixed, unresolved, changed
                label, anchor = m.group(1), m.group(2)
                if anchor in anchor_set:
                    return m.group(0)
                target = resolve(anchor, label, anchors)
                if target is None:
                    unresolved += 1
                    print(f"  UNRESOLVED {md.relative_to(REPO)}:{i + 1} "
                          f"[{label[:45]}](#{anchor})")
                    return m.group(0)
                fixed += 1
                changed = True
                if args.verbose or args.dry_run:
                    print(f"  {md.name}:{i + 1}\n"
                          f"      #{anchor}\n"
                          f"   -> #{target}")
                return f"[{label}](#{target})"

            lines[i] = LINK_RE.sub(repl, line)

        if changed:
            files_changed += 1
            if not args.dry_run:
                with open(md, "w", encoding="utf-8", newline="") as fh:
                    fh.write(newline.join(lines) + newline)

    verb = "would fix" if args.dry_run else "fixed"
    print(f"\n{verb} {fixed} link(s) across {files_changed} file(s); "
          f"{unresolved} could not be resolved")
    return 0


if __name__ == "__main__":
    sys.exit(main())
