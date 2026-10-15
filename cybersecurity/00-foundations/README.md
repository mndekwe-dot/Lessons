# Foundations

**Weeks 1–2 of [`../CURRICULUM.md`](../CURRICULUM.md). Read in numbered order.**

The vocabulary and mental models everything else depends on. These three files are the
shortest in the curriculum and the ones you will return to most — every later module
assumes their language.

| # | File | Week | Level | Core? | What it gives you |
|---|---|---|---|---|---|
| 01 | [01-SECURITY_FOUNDATIONS.md](01-SECURITY_FOUNDATIONS.md) | 1 | beginner | **core** | CIA, threat modelling, trust boundaries, least privilege, risk ranking, the attacker mindset. |
| 02 | [02-NETWORKING_FOR_SECURITY.md](02-NETWORKING_FOR_SECURITY.md) | 1 | beginner | **core** | TCP/ports/DNS/HTTP read as an attacker. Who can actually see your traffic, and where TLS stops helping. |
| 03 | [03-CRYPTOGRAPHY_ESSENTIALS.md](03-CRYPTOGRAPHY_ESSENTIALS.md) | 2 | beginner | **core** | Which primitive for which job. Password hashing, HMAC, TLS, randomness, key management. |

## The one idea to take from this module

**Trust boundaries.** A trust boundary is any line where data crosses from somewhere
you control to somewhere you do not. All validation happens there. Inside one you may
assume; outside one, never.

Most security bugs in real applications reduce to someone validating on the wrong side
of a boundary — usually in React, where the attacker controls the computer.

## What you should be able to do afterwards

- Draw Imboni's trust boundaries from memory and say what must be validated at each
- Read `ss -tulpn` on a server and justify every line
- Explain why `SHA-256` is wrong for passwords and right for file integrity
- Explain why TLS did nothing for you in September

Checkpoints 1 and 2 in [`../CURRICULUM.md`](../CURRICULUM.md).
