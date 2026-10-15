"""Add a Table of Contents to course markdown files.

Matches the convention already used in engineering-curriculum/:

    ---

    ## Table of Contents

    1. [Section title](#1-section-title)

    ---

Idempotent - a file that already has a TOC is left alone, so this can be
re-run whenever lessons are added.

Usage:
    python tools/add_toc.py --dry-run      # list what would change
    python tools/add_toc.py                # apply
    python tools/add_toc.py --min 4        # only files with 4+ sections
    python tools/add_toc.py --path data-science-ml
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

SKIP_DIRS = {".git", "node_modules", "__pycache__", ".idea", ".claude", ".kilo",
             "venv", ".venv", "tools"}

HEADING_RE = re.compile(r"^(#{2})\s+(.*?)\s*#*\s*$")
FENCE_RE = re.compile(r"^\s*(```|~~~)")
NUMBERED_RE = re.compile(r"^(\d+)[.)]\s+(.*)$")
TOC_MARKER_RE = re.compile(r"^##\s+(table of contents|contents|toc)\s*$", re.I)


def slugify(text: str) -> str:
    """Replicate GitHub's heading-anchor algorithm.

    Lowercase, drop anything that is not a letter, digit, space, hyphen or
    underscore, then turn spaces into hyphens.  Note that " - " and " em-dash "
    collapse to a double hyphen, which is what GitHub actually produces.
    """
    text = text.strip().lower()
    text = re.sub(r"`([^`]*)`", r"\1", text)          # inline code keeps its text
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)  # links keep their label
    # Emphasis markers only. Underscores are NOT stripped: GitHub keeps them,
    # so `safe_delay` must stay `safe_delay` in the anchor, not `safedelay`.
    text = re.sub(r"[*~]", "", text)
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    return text.replace(" ", "-")


def split_fenced(lines: list[str]) -> list[bool]:
    """Return a per-line mask: True when the line sits inside a code fence."""
    inside = []
    fence: str | None = None
    for line in lines:
        m = FENCE_RE.match(line)
        if m:
            token = m.group(1)
            if fence is None:
                fence = token
                inside.append(True)
                continue
            if token == fence:
                fence = None
                inside.append(True)
                continue
        inside.append(fence is not None)
    return inside


def collect_headings(lines: list[str]) -> list[tuple[int, str]]:
    """H2 headings outside code fences, as (line index, text)."""
    masked = split_fenced(lines)
    out = []
    for i, line in enumerate(lines):
        if masked[i]:
            continue
        m = HEADING_RE.match(line)
        if m and not TOC_MARKER_RE.match(line):
            out.append((i, m.group(2).strip()))
    return out


def has_toc(lines: list[str]) -> bool:
    masked = split_fenced(lines)
    for i, line in enumerate(lines):
        if not masked[i] and TOC_MARKER_RE.match(line):
            return True
    return False


def build_toc(headings: list[tuple[int, str]]) -> list[str]:
    """Render the TOC block, preserving each section's own number."""
    seen: dict[str, int] = {}
    entries = []
    counter = 0
    for _, text in headings:
        anchor = slugify(text)
        n = seen.get(anchor, 0)
        seen[anchor] = n + 1
        if n:
            anchor = f"{anchor}-{n}"           # GitHub's duplicate suffix

        m = NUMBERED_RE.match(text)
        if m:
            marker, label = m.group(1), m.group(2)
            counter = int(marker)
        else:
            counter += 1
            marker, label = str(counter), text

        label = label.replace("[", "").replace("]", "")
        entries.append(f"{marker}. [{label}](#{anchor})")

    return ["---", "", "## Table of Contents", ""] + entries + ["", "---"]


def insertion_point(lines: list[str], first_heading: int) -> tuple[int, bool]:
    """Where to splice the TOC in.

    Returns (index, replaces_rule).  When the intro is already separated from
    the first section by a horizontal rule we splice over that rule - the TOC
    block carries its own - so the file does not end up with two in a row.
    """
    i = first_heading - 1
    while i >= 0 and not lines[i].strip():
        i -= 1
    if i >= 0 and lines[i].strip() in ("---", "***", "___"):
        return i, True
    return first_heading, False


def process(path: Path, min_sections: int, dry_run: bool) -> str | None:
    try:
        # newline="" keeps the file's own line endings visible instead of
        # letting Python translate them; writing them back unchanged matters
        # because most of these files are LF and Windows would rewrite them
        # all to CRLF, turning a 15-line insert into a whole-file diff.
        with open(path, "r", encoding="utf-8", newline="") as fh:
            text = fh.read()
    except (OSError, UnicodeDecodeError):
        return None
    newline = "\r\n" if "\r\n" in text else "\n"
    lines = text.splitlines()

    if has_toc(lines):
        return None
    headings = collect_headings(lines)
    if len(headings) < min_sections:
        return None

    at, replaces_rule = insertion_point(lines, headings[0][0])
    block = build_toc(headings)
    if replaces_rule:
        # lines[at] is the existing rule; the block supplies its own.
        new_lines = lines[:at] + block + lines[at + 1:]
    else:
        new_lines = lines[:at] + block + [""] + lines[at:]
    if not dry_run:
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(newline.join(new_lines) + newline)
    return f"{len(headings):3d} sections  {path.relative_to(REPO)}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--min", type=int, default=3,
                    help="minimum H2 sections before a TOC is worth adding")
    ap.add_argument("--path", default=".", help="limit to a subdirectory")
    args = ap.parse_args()

    root = (REPO / args.path).resolve()
    changed = []
    for md in sorted(root.rglob("*.md")):
        if any(part in SKIP_DIRS for part in md.parts):
            continue
        result = process(md, args.min, args.dry_run)
        if result:
            changed.append(result)

    for line in changed:
        print(line)
    verb = "would update" if args.dry_run else "updated"
    print(f"\n{verb} {len(changed)} file(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
