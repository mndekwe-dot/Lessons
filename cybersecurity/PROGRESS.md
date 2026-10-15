# Progress Log — Cybersecurity

You fill in the left. I fill in the verdict. Nothing is marked passed without a
checkpoint review.

**Started:** _______________
**Target finish:** _______________ (start + 8 weeks)
**Prerequisite met:** Checkpoint 10 of `../engineering-curriculum/CURRICULUM.md` ☐

---

## Table of Contents

1. [Checkpoint log](#checkpoint-log)
2. [Vulnerabilities found in my own systems](#vulnerabilities-found-in-my-own-systems)
3. [Offensive practice (ongoing from week 3)](#offensive-practice-ongoing-from-week-3)
4. [Tools actually installed and used](#tools-actually-installed-and-used)
5. [Infrastructure state](#infrastructure-state)
6. [Compliance state](#compliance-state)
7. [Post-incident actions (September 2026)](#post-incident-actions-september-2026)
8. [Things I got wrong](#things-i-got-wrong)
9. [Honest notes](#honest-notes)

---

## Checkpoint log

| # | Week | Topic | Attempted | Verdict | Notes |
|---|---|---|---|---|---|
| 0 | — | Baseline: 3-hour cold audit of Imboni | | | |
| 1 | 1 | Threat model + network inventory | | | |
| 2 | 2 | Cryptography audit | | | |
| 3 | 3 | Access control | | | |
| 4 | 4 | OWASP Top 10 + supply chain | | | |
| 5 | 5 | Infrastructure and cloud hardening | | | |
| 6 | 6 | Endpoint and personal attack surface | | | |
| 7 | 7 | Detection, response, forensics | | | |
| 8 | 8 | Compliance with Law No. 058/2021 | | | |

Verdict is `PASS` or `REPEAT`. There is no partial credit.

---

## Vulnerabilities found in my own systems

The real output of this curriculum. One row per finding, in the system you built.

| # | Date | System | Finding | Severity | Proven how | Fixed | Regression test |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |

**A finding with no "proven how" entry does not count.** If you cannot reproduce it, it
is a suspicion.

---

## Offensive practice (ongoing from week 3)

| Platform | Target / path | Completed | Notes |
|---|---|---|---|
| PortSwigger | Access control labs | /13 | |
| PortSwigger | SQL injection labs | /18 | |
| PortSwigger | XSS labs | | |
| Juice Shop | 3-star challenges | | |
| TryHackMe / HTB | | | |

---

## Tools actually installed and used

Not "heard of". Used, on a real target, with a result.

| Tool | Installed | First real use | What it found |
|---|---|---|---|
| Burp Suite | | | |
| nmap | | | |
| Wireshark / tcpdump | | | |
| gitleaks | | | |
| pip-audit / npm audit | | | |
| Sysmon | | | |
| Autoruns | | | |
| Lynis | | | |
| testssl.sh | | | |
| Guardian (own scanner) | | | |

---

## Infrastructure state

Tick when true and verified, not when intended.

- [ ] SSH key-only, no root login, `authorized_keys` audited
- [ ] `ufw` default-deny; only 22/80/443 public
- [ ] Postgres and Redis bound to localhost
- [ ] Database role is not superuser
- [ ] `fail2ban` running
- [ ] Unattended security upgrades enabled
- [ ] Backups encrypted, off-box, **restore-tested** — restore time: ______
- [ ] `manage.py check --deploy` clean
- [ ] Secrets out of plaintext `.env` on production
- [ ] Daily laptop account is not Administrator

---

## Compliance state

- [ ] Data inventory complete (every field, basis, retention)
- [ ] Unjustifiable fields deleted
- [ ] Registered with NCSA
- [ ] Privacy notice published
- [ ] Parental consent mechanism for Imboni
- [ ] DPIA written — Imboni ☐  Screening ☐
- [ ] Processor register with contracts
- [ ] Cross-border transfers documented (including LLM APIs)
- [ ] `export_user_data` / `delete_user_data` implemented and tested
- [ ] Retention job running
- [ ] Breach template written; 48-hour owner named: ______________

---

## Post-incident actions (September 2026)

Carried over from the incident. These are overdue, not pending.

| Action | Done | Date |
|---|---|---|
| Passwords rotated from a clean device | | |
| All sessions signed out everywhere | | |
| Recovery addresses / app passwords / OAuth grants / forwarding rules audited | | |
| `.env` secrets rotated across all projects | | |
| `ahl_root_breakglass` SSH key rotated | | |
| `escreening_aos` SSH key rotated | | |
| `imboni_oracle` SSH key rotated | | |
| Server `authorized_keys` audited after rotation | | |
| Full + offline Defender scan completed | | |
| Decision made on clean Windows reinstall | | |

---

## Things I got wrong

The most useful section in this file. A security error you made and understood is worth
more than a chapter you read.

| Date | What I believed | What was actually true |
|---|---|---|
| | | |

---

## Honest notes

Space for what is not going well. Weeks skipped, controls you ticked but did not
verify, findings you did not want to write down. The curriculum only works if this
section is true.
