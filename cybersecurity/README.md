# Cybersecurity

**Beginner to advanced, in eight gated weeks.** The third curriculum in this
repository, alongside `../engineering-curriculum/` and `../data-science-ml/`.

Full plan, build tasks and pass criteria: [`CURRICULUM.md`](CURRICULUM.md)
Progress tracker: [`PROGRESS.md`](PROGRESS.md)
Every tool referenced here, in one place: [`TOOLKIT.md`](TOOLKIT.md)

---

## Table of Contents

1. [Why this exists](#why-this-exists)
2. [The modules](#the-modules)
3. [Reading order](#reading-order)
4. [What is deliberately not here](#what-is-deliberately-not-here)
5. [The through-line](#the-through-line)
6. [A warning about this directory](#a-warning-about-this-directory)

---

## Why this exists

The other curricula teach you to build things that work. This one teaches you to build
things that hold up when someone attacks them. Three facts make it non-optional for
you specifically:

1. **Imboni holds identifiable records about children.** Under Rwanda's Law
   No. 058/2021 you are the data controller, today.
2. **Screening holds mental-health responses.** Same law, more sensitive category.
3. **Your development machine was compromised in September 2026** — a fileless MSBuild
   loader delivered with a cracked game, invisible to a fully-enabled Windows Defender.
   Your plaintext `.env` secrets and browser sessions were taken, and you found out
   from Anthropic's Trust & Safety team rather than from your own monitoring.

Several files here are written directly from that incident. It is the most expensive
lesson you have had this year and it should not go to waste.

## The modules

| # | Module | Weeks | Level | What it gives you |
|---|---|---|---|---|
| 00 | [00-foundations/](00-foundations/) | 1–2 | beginner | Threat modelling, trust boundaries, networking, cryptography |
| 01 | [01-application-security/](01-application-security/) | 3–4 | intermediate | Access control, OWASP Top 10, supply chain, secure CI |
| 02 | [02-infrastructure/](02-infrastructure/) | 5 | intermediate | SSH, firewalls, least-privilege DB roles, containers, cloud and IAM |
| 03 | [03-endpoint-and-malware/](03-endpoint-and-malware/) | 6 | intermediate | Persistence, LOLBINs, fileless loaders, infostealers, social engineering |
| 04 | [04-detection-and-response/](04-detection-and-response/) | 7 | advanced | Security logging, detection rules, incident response, digital forensics |
| 05 | [05-offensive-security/](05-offensive-security/) | ongoing | advanced | Testing your own systems legally; methodology and reporting |
| 06 | [06-governance/](06-governance/) | 8 | advanced | Law No. 058/2021, children's data, DPIAs, the 48-hour breach clock |

## Reading order

Strictly numbered. Module 01 assumes module 00's vocabulary, and the application
security files assume you can read a packet capture.

```
00-foundations/01-SECURITY_FOUNDATIONS.md          ← start here
00-foundations/02-NETWORKING_FOR_SECURITY.md
00-foundations/03-CRYPTOGRAPHY_ESSENTIALS.md
01-application-security/01-AUTHENTICATION_AND_ACCESS_CONTROL.md
01-application-security/02-WEB_VULNERABILITIES.md
01-application-security/03-SUPPLY_CHAIN_AND_SECURE_SDLC.md
02-infrastructure/01-INFRASTRUCTURE_HARDENING.md
02-infrastructure/02-CLOUD_SECURITY.md
03-endpoint-and-malware/01-ENDPOINT_SECURITY_AND_MALWARE.md
03-endpoint-and-malware/02-SOCIAL_ENGINEERING.md
04-detection-and-response/01-DETECTION_AND_INCIDENT_RESPONSE.md
04-detection-and-response/02-DIGITAL_FORENSICS.md
05-offensive-security/01-OFFENSIVE_SECURITY_BASICS.md
06-governance/01-COMPLIANCE_AND_DATA_PROTECTION.md
```

## What is deliberately not here

Security material already exists elsewhere in this repository. It is cross-referenced,
not duplicated:

| Topic | Lives in |
|---|---|
| CSP, HSTS, clickjacking, response headers, token storage | [`../engineering-curriculum/01-frontend/17-PWA_SECURITY_GUIDE.md`](../engineering-curriculum/01-frontend/17-PWA_SECURITY_GUIDE.md) |
| `.env`, `python-decouple`, production secrets | [`../engineering-curriculum/02-backend/08-SECRETS_STUDY_GUIDE.md`](../engineering-curriculum/02-backend/08-SECRETS_STUDY_GUIDE.md) |
| JWT mechanics in Imboni | [`../engineering-curriculum/02-backend/04-JWT_AUTH_GUIDE.md`](../engineering-curriculum/02-backend/04-JWT_AUTH_GUIDE.md) |
| DRF permission classes | [`../engineering-curriculum/02-backend/03-PERMISSIONS_GUIDE.md`](../engineering-curriculum/02-backend/03-PERMISSIONS_GUIDE.md) |
| Prompt injection, LLM abuse | [`../data-science-ml/05-nlp-llms/06-LLM_SECURITY.md`](../data-science-ml/05-nlp-llms/06-LLM_SECURITY.md) |
| Model theft, anonymisation, adversarial input | [`../data-science-ml/07-enterprise/03-PRIVACY_AND_SECURITY.md`](../data-science-ml/07-enterprise/03-PRIVACY_AND_SECURITY.md) |

## The through-line

Three ideas recur across every module. Recognising them is most of the value:

1. **Injection is data being read as instructions.** SQL, shell, template, HTML, LLM
   prompt — one mechanism in five contexts.
2. **Authorisation belongs where the data is, not where the UI is.** Scope the query;
   never filter afterwards.
3. **Removal is not recovery.** A stealer's theft completes in seconds. Cleaning the
   machine afterwards changes nothing about what already left — which is why credential
   rotation, not malware removal, is the real remediation.

## A warning about this directory

Unlike `../engineering-curriculum/`, this directory is **not** in `.gitignore`, so it
will be committed if you `git add .`. That is probably what you want — there are no
secrets here. But several files reference your real infrastructure, your server
layout, and the specifics of a live incident. **Think before making this repository
public.** A threat model is a useful document for an attacker too.
