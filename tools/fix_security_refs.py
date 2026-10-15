"""Repair cross-references after promoting security to a top-level curriculum.

The files moved from engineering-curriculum/10-security/ into cybersecurity/<module>/,
which breaks two things:

  * relative paths to the engineering curriculum (one level deeper now)
  * prose references like "file 07", which referred to the old flat numbering

Run: python tools/fix_security_refs.py [--dry-run]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SEC = REPO / "cybersecurity"

# Old flat number -> new module-qualified path
FILE_MAP = {
    "01": "00-foundations/01-SECURITY_FOUNDATIONS.md",
    "02": "00-foundations/03-CRYPTOGRAPHY_ESSENTIALS.md",
    "03": "01-application-security/01-AUTHENTICATION_AND_ACCESS_CONTROL.md",
    "04": "01-application-security/02-WEB_VULNERABILITIES.md",
    "05": "02-infrastructure/01-INFRASTRUCTURE_HARDENING.md",
    "06": "03-endpoint-and-malware/01-ENDPOINT_SECURITY_AND_MALWARE.md",
    "07": "04-detection-and-response/01-DETECTION_AND_INCIDENT_RESPONSE.md",
    "08": "01-application-security/03-SUPPLY_CHAIN_AND_SECURE_SDLC.md",
    "09": "05-offensive-security/01-OFFENSIVE_SECURITY_BASICS.md",
    "10": "06-governance/01-COMPLIANCE_AND_DATA_PROTECTION.md",
}

# Paths that are now one directory deeper relative to engineering-curriculum.
PATH_FIXES = [
    ("../01-frontend/", "../../engineering-curriculum/01-frontend/"),
    ("../02-backend/", "../../engineering-curriculum/02-backend/"),
    ("../03-async-caching/", "../../engineering-curriculum/03-async-caching/"),
    ("../04-testing/", "../../engineering-curriculum/04-testing/"),
    ("../05-deployment/", "../../engineering-curriculum/05-deployment/"),
    ("../06-system-design/", "../../engineering-curriculum/06-system-design/"),
    ("../00-foundations/01-DSA", "../../engineering-curriculum/00-foundations/01-DSA"),
    ("../CURRICULUM.md", "../CURRICULUM.md"),  # now cybersecurity/CURRICULUM.md - correct
]

FILE_REF_RE = re.compile(r"\bfiles? (\d{2})(?:\s*,\s*(\d{2}))?(?:\s+and\s+(\d{2}))?")


def fix_text(text: str, self_rel: str) -> tuple[str, int]:
    changes = 0

    for old, new in PATH_FIXES:
        if old in text and old != new:
            # Do not rewrite a path that already points at the right place.
            if "../../engineering-curriculum/" + old.lstrip("./") not in text:
                n = text.count(old)
                text = text.replace(old, new)
                changes += n

    def repl(m: re.Match) -> str:
        nonlocal changes
        nums = [g for g in m.groups() if g]
        targets = [FILE_MAP.get(n) for n in nums]
        if any(t is None for t in targets):
            return m.group(0)
        # Drop a self-reference rather than pointing a file at itself.
        targets = [t for t in targets if t != self_rel]
        if not targets:
            return m.group(0)
        changes += 1
        rendered = " and ".join(f"`{t}`" for t in targets)
        return rendered

    text = FILE_REF_RE.sub(repl, text)
    return text, changes


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    total = 0
    for md in sorted(SEC.rglob("*.md")):
        rel = md.relative_to(SEC).as_posix()
        with open(md, "r", encoding="utf-8", newline="") as fh:
            text = fh.read()
        newline = "\r\n" if "\r\n" in text else "\n"
        fixed, n = fix_text(text, rel)
        if n:
            total += n
            print(f"  {n:3d} fix(es)  {rel}")
            if not args.dry_run:
                with open(md, "w", encoding="utf-8", newline="") as fh:
                    fh.write(fixed)
    verb = "would apply" if args.dry_run else "applied"
    print(f"\n{verb} {total} reference fix(es)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
