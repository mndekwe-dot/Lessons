# Application Security

**Weeks 3–4 of [`../CURRICULUM.md`](../CURRICULUM.md). Read in numbered order.**

The code you write, and the code you install. This is the module with the highest
chance of finding a real, exploitable vulnerability in Imboni this week.

| # | File | Week | Level | Core? | What it gives you |
|---|---|---|---|---|---|
| 01 | [01-AUTHENTICATION_AND_ACCESS_CONTROL.md](01-AUTHENTICATION_AND_ACCESS_CONTROL.md) | 3 | intermediate | **core** | Authn vs authz, IDOR, sessions vs tokens, RBAC/ABAC, default deny, MFA's real limits. |
| 02 | [02-WEB_VULNERABILITIES.md](02-WEB_VULNERABILITIES.md) | 4 | intermediate | **core** | OWASP Top 10 against Django and React: injection, SSRF, mass assignment, race conditions. |
| 03 | [03-SUPPLY_CHAIN_AND_SECURE_SDLC.md](03-SUPPLY_CHAIN_AND_SECURE_SDLC.md) | 4 | advanced | **core** | Typosquatting, dependency confusion, lockfiles, secret scanning, SAST/DAST, CI hardening. |

---

## Table of Contents

1. [The one idea to take from this module](#the-one-idea-to-take-from-this-module)
2. [Prerequisites](#prerequisites)
3. [What you should be able to do afterwards](#what-you-should-be-able-to-do-afterwards)

---

## The one idea to take from this module

**Scope the query; never filter afterwards.**

```python
Student.objects.get(pk=pk)                              # then check  -> IDOR waiting
Student.objects.filter(school=request.user.school)      # then narrow -> secure by construction
```

The first is secure only if you remember, every time, in every view, forever. The
second is secure because of how it is built. Broken access control is number one on the
OWASP list because the first pattern is the one that comes naturally.

## Prerequisites

`../00-foundations/` — particularly trust boundaries, which is the concept this whole
module applies.

## What you should be able to do afterwards

- Audit every endpoint that takes an ID and give a verdict per endpoint
- Prove an IDOR with `curl` before fixing it
- Classify every raw SQL call in a codebase as safe or not
- Run `gitleaks` over full history and know what to do with what it finds

Checkpoints 3 and 4 in [`../CURRICULUM.md`](../CURRICULUM.md).
