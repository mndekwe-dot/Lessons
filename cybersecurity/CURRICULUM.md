# The Security Curriculum — 8 Weeks

**Start date:** _______________ (fill this in)
**Owner:** you
**Grader:** Claude, strictly, against the rubrics below

**Prerequisite:** Checkpoint 10 of `../engineering-curriculum/CURRICULUM.md`. You need
a deployed application before hardening one means anything.

---

## Table of Contents

1. [Why this curriculum exists](#why-this-curriculum-exists)
2. [The rules](#the-rules)
3. [Week 0 — Baseline (before anything else)](#week-0--baseline-before-anything-else)
4. [Phase 1 — Foundations (Weeks 1–2)](#phase-1--foundations-weeks-12)
5. [Phase 2 — Application Security (Weeks 3–4)](#phase-2--application-security-weeks-34)
6. [Phase 3 — Infrastructure and Endpoint (Weeks 5–6)](#phase-3--infrastructure-and-endpoint-weeks-56)
7. [Phase 4 — Detection, Response and Governance (Weeks 7–8)](#phase-4--detection-response-and-governance-weeks-78)
8. [Optional — Offensive practice (ongoing)](#optional--offensive-practice-ongoing)
9. [What passing means](#what-passing-means)
10. [What it does not mean](#what-it-does-not-mean)
11. [My commitments](#my-commitments)

---

## Why this curriculum exists

The other two curricula teach you to build things that work. This one teaches you to
build things that do not hurt anyone when someone attacks them — and you are already
past the point where that is optional:

- **Imboni holds identifiable records about children.** Under Rwanda's Law
  No. 058/2021 you are the data controller. The obligations apply now, not when you
  grow.
- **Screening holds mental-health responses.** Same law, more sensitive category.
- **Your development machine was compromised in September 2026.** A fileless MSBuild
  loader, delivered with a cracked game, with Defender fully enabled and blind to it.
  Your plaintext `.env` secrets and browser sessions were taken. You learned about it
  from Anthropic's Trust & Safety team, not from your own monitoring.

That last one is why this curriculum is eight weeks rather than a chapter. You have
already paid the tuition; this is collecting on it.

## The rules

Same as the other two. You chose strict.

**1. Every week has a Build Task done with all guides closed.** Official documentation
(Django, OWASP, vendor docs) is allowed. These guides, your past code, and AI are not.

**2. No AI during Build Tasks.** Including "just checking my approach".

**3. Checkpoints are pass or repeat.** No partial credit.

**4. Every finding must be reproducible.** A vulnerability you cannot demonstrate with
a concrete request is a guess. "I think this might be vulnerable" fails.

**5. Nothing is tested without authorisation.** Your own systems, deliberately
vulnerable labs, or in-scope bounty targets. Unauthorised testing is a crime under Law
No. 60/2018 and an automatic fail here.

**6. Fixes come with regression tests.** A vulnerability fixed without a test proving
it stays fixed is half a fix.

**7. Time commitment: 6–8 hours a week.** Lighter than the engineering curriculum
because much of the work lands inside projects you are already running.

---

## Week 0 — Baseline (before anything else)

**The cold assessment, 3 hours, timed, no AI, no guides:**

> Take Imboni as it stands today. Find and document as many real security problems as
> you can in three hours. For each: where it is, how to reproduce it, what an attacker
> gets, and how severe it is. Stop at three hours regardless of where you are.

Then, separately, answer these from memory:

1. What is the difference between authentication and authorisation?
2. Why is hashing a password with SHA-256 wrong?
3. What does `select_for_update` prevent?
4. Where do your production secrets live right now, and who can read them?
5. If a parent's session cookie were stolen today, what could they do and for how long?

**Checkpoint 0:** I tell you where your real level is, and which weeks you can compress.

---

## Phase 1 — Foundations (Weeks 1–2)

### Week 1 — Thinking about security

**Read:** `00-foundations/01-SECURITY_FOUNDATIONS.md`,
`00-foundations/02-NETWORKING_FOR_SECURITY.md`

**Build Task (guides closed):** A written threat model for Imboni. One diagram, every
trust boundary, and a table of threat → control → honest assessment. Plus a full
network inventory of your production server: every listener, every port, justified.

**Checkpoint 1 — PASS requires:**
- [ ] Diagram showing every component and data flow
- [ ] Every trust boundary identified, with the validation that must occur at each
- [ ] At least 12 threats, each with a control or a **documented accepted risk**
- [ ] At least one accepted risk, with reasoning — a model with no accepted risk is not
      honest
- [ ] `ss -tulpn` output annotated; anything unnecessary closed
- [ ] You can explain, cold, why frontend validation has no security value

**Automatic fail:** a threat model that lists only threats you had already fixed.

### Week 2 — Cryptography

**Read:** `00-foundations/03-CRYPTOGRAPHY_ESSENTIALS.md`

**Build Task (guides closed):** Audit and fix every cryptographic decision in both
codebases: password hashing, token generation, secret comparison, webhook verification,
TLS configuration.

**Checkpoint 2 — PASS requires:**
- [ ] Every `random` use audited; the ones needing `secrets` fixed
- [ ] All secret comparisons use `hmac.compare_digest`
- [ ] Webhook verification against the **raw** body, with a test proving a tampered
      body fails
- [ ] `testssl.sh` run against production; findings fixed or justified
- [ ] You can state which primitive solves which problem, cold, and why "we hashed the
      card numbers" is a category error

---

## Phase 2 — Application Security (Weeks 3–4)

### Week 3 — Access control

**Read:** `01-application-security/01-AUTHENTICATION_AND_ACCESS_CONTROL.md`

**Build Task:** Find and fix every broken access control in Imboni. Then make the fix
structural — authorisation in querysets, not scattered across views.

**Checkpoint 3 — PASS requires:**
- [ ] Every endpoint taking an object ID audited, with a verdict per endpoint
- [ ] At least one real IDOR found and proven with `curl` **before** fixing
- [ ] `visible_to(user)` implemented on the main models, with **default deny**
- [ ] Tests proving a parent cannot reach another family's child through any endpoint
- [ ] Rate limiting on login, reset and invite redemption, with a test
- [ ] You can explain why scoping the query beats filtering afterwards

**Automatic fail:** fixing a vulnerability you never demonstrated.

### Week 4 — Vulnerabilities and the supply chain

**Read:** `01-application-security/02-WEB_VULNERABILITIES.md`,
`01-application-security/03-SUPPLY_CHAIN_AND_SECURE_SDLC.md`

**Build Task (two parts):**

*Part A:* Work the OWASP Top 10 against Imboni systematically. Document each category:
not applicable, secure, or vulnerable — with evidence either way.

*Part B:* Secure the pipeline. `gitleaks` in pre-commit, dependency auditing in CI,
`manage.py check --deploy` clean, and every historically committed secret rotated.

**Checkpoint 4 — PASS requires:**
- [ ] All ten categories assessed with evidence, not assertions
- [ ] Every `raw()`/`cursor.execute`/`extra()` classified and fixed where needed
- [ ] No `fields = "__all__"` on any model with a permission column
- [ ] `check --deploy` clean, or each finding justified
- [ ] `gitleaks` in pre-commit **and** CI; full history scanned
- [ ] `pip-audit` and `npm audit` failing the build on high severity
- [ ] Every secret ever committed rotated — not merely deleted

---

## Phase 3 — Infrastructure and Endpoint (Weeks 5–6)

### Week 5 — Hardening

**Read:** `02-infrastructure/01-INFRASTRUCTURE_HARDENING.md`,
`02-infrastructure/02-CLOUD_SECURITY.md`

**Build Task:** Harden the Imboni production server and its cloud account to the
checklists. Then prove recoverability.

**Checkpoint 5 — PASS requires:**
- [ ] SSH: key-only, no root, `authorized_keys` audited on every host
- [ ] `ufw` default-deny; only 22/80/443 public; Postgres and Redis on localhost
- [ ] Database role is **not** superuser; exact `GRANT`s documented and applied
- [ ] `fail2ban` running; unattended security upgrades on
- [ ] Containers: non-root `USER`, pinned base, no secrets in layers
- [ ] Cloud: no `*:*` IAM, metadata endpoint considered, buckets private
- [ ] **A timed full restore from backup onto a clean host, with the number recorded**

**Automatic fail:** an untested backup.

### Week 6 — The endpoint

**Read:** `03-endpoint-and-malware/01-ENDPOINT_SECURITY_AND_MALWARE.md`,
`03-endpoint-and-malware/02-SOCIAL_ENGINEERING.md`

**Build Task:** Full persistence sweep of your own machine. Then reduce your own attack
surface: demote your daily account from Administrator, install Sysmon, and schedule
Guardian.

**Checkpoint 6 — PASS requires:**
- [ ] Every autostart entry on your machine enumerated and justified
- [ ] The September chain reconstructed from memory, with the control each stage defeated
- [ ] Daily account no longer a local Administrator, and a written list of what broke
- [ ] Sysmon installed with a real config; process-creation logging confirmed working
- [ ] Every account audited for attacker persistence: recovery addresses, app
      passwords, OAuth grants, forwarding rules
- [ ] You can explain why 2FA did not prevent the September session theft

---

## Phase 4 — Detection, Response and Governance (Weeks 7–8)

### Week 7 — Seeing and responding

**Read:** `04-detection-and-response/01-DETECTION_AND_INCIDENT_RESPONSE.md`,
`04-detection-and-response/02-DIGITAL_FORENSICS.md`

**Build Task:** Make Imboni observable, then prove you can respond.

**Checkpoint 7 — PASS requires:**
- [ ] Structured security logging: auth success/failure, authz denials, admin actions —
      with actor, IP, outcome, UTC
- [ ] No secrets in logs, verified
- [ ] Three detection rules live, each with a documented response; one triggered
      deliberately to prove it fires
- [ ] Incident runbook written with **tested** commands, reachable offline
- [ ] The September incident written up as a formal timeline with dwell time calculated
- [ ] Confidence language used correctly — what you could **not** determine, stated

### Week 8 — The law

**Read:** `06-governance/01-COMPLIANCE_AND_DATA_PROTECTION.md`

**Build Task:** Bring Imboni into documented compliance with Law No. 058/2021.

**Checkpoint 8 — PASS requires:**
- [ ] Complete data inventory: every field, subject, purpose, lawful basis, retention
- [ ] Fields with no justifiable basis **deleted**
- [ ] `export_user_data` and `delete_user_data` implemented and tested
- [ ] Every cross-border transfer identified, including any LLM API call
- [ ] DPIA written for both projects
- [ ] Breach notification template written, 48-hour owner named
- [ ] Retention job implemented and running

**Automatic fail:** a compliance document describing controls that do not exist.

---

## Optional — Offensive practice (ongoing)

`05-offensive-security/01-OFFENSIVE_SECURITY_BASICS.md` and `TOOLKIT.md` run alongside
from Week 3, one session a week. Not gated, because it is practice rather than
delivery — but it is where the defensive material stops being theoretical.

| Weeks | Work |
|---|---|
| 3–4 | PortSwigger Academy: access control, then SQL injection |
| 5–6 | Juice Shop to three stars; Burp against your own staging |
| 7–8 | Full endpoint inventory of Imboni from the outside; write one finding as a formal report |

---

## What passing means

You can look at a system you did not build, find the ways it fails, explain the
mechanism of each, fix them structurally, and prove the fix holds. You can tell a real
finding from a scanner's guess, and you know which legal obligations you are under.

## What it does not mean

You are not a penetration tester, a malware analyst, or a compliance officer. Those are
each a career. What you will be is a developer whose systems do not fail in the
ordinary ways — which is rarer than it should be, and is the thing that actually
protects the children whose records you hold.

## My commitments

- I grade honestly, against the rubric, and I will not soften a REPEAT.
- I will not do your Build Tasks, including when you ask.
- I will tell you when a control you are proud of does not do what you think.
- If you stop, I will say so plainly rather than quietly letting it decay.
