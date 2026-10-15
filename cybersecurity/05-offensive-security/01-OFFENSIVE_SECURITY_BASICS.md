# 09 — Offensive Security Basics

**Week 22.** How to test your own systems the way an attacker would, legally. The
defensive files tell you what to build; this one tells you how to find out whether it
worked.

Defence without testing is a belief. You do not know your authorisation is sound until
someone has genuinely tried to get past it.

---

## Table of Contents

1. [The legal line, first](#1-the-legal-line-first)
2. [Where to practise legally](#2-where-to-practise-legally)
3. [The methodology](#3-the-methodology)
4. [Reconnaissance against your own app](#4-reconnaissance-against-your-own-app)
5. [Enumerating the application](#5-enumerating-the-application)
6. [The tests worth running first](#6-the-tests-worth-running-first)
7. [Tooling, honestly](#7-tooling-honestly)
8. [Writing the report](#8-writing-the-report)
9. [Disclosure](#9-disclosure)
10. [Where this leads](#10-where-this-leads)
11. [The checklist](#11-the-checklist)
12. [Exercise 9](#exercise-9)

---

## 1. The legal line, first

This is not a formality and it is not negotiable.

**Testing a system without written authorisation from its owner is a crime**, in Rwanda
and essentially everywhere else. Rwanda's Law No. 60/2018 on cybercrime covers
unauthorised access, with custodial sentences. Intent does not matter. "I was only
looking" is not a defence, and neither is "I reported it afterwards".

What you may test:

| Target | Allowed? |
|---|---|
| Imboni and Screening — your own code and servers | **yes** |
| A deliberately vulnerable lab you installed locally | **yes** |
| A CTF or training platform, within its rules | **yes** |
| A public bug bounty, strictly within its scope document | **yes** |
| A client's system, with a signed scope and dates | **yes** |
| Your university's portal, a bank's website, anything else | **no** |
| "Just checking" a friend's site | **no** |

Scope is a boundary, not a suggestion. A bug bounty that lists `*.example.com` does not
include `example.org`. Finding something out of scope means stopping and reporting, not
continuing.

For client work you need, in writing and before you start: the systems in scope, the
dates and hours, the techniques excluded (usually DoS and social engineering), an
emergency contact, and a named person authorising it. No document, no testing.

## 2. Where to practise legally

Build the skill somewhere designed for it:

- **TryHackMe** — the gentlest on-ramp, guided paths
- **Hack The Box** — harder, less hand-holding; start with Starting Point
- **PortSwigger Web Security Academy** — free, outstanding, and the best match for your
  stack. Work through access control, SQL injection, XSS and SSRF.
- **OWASP Juice Shop** — a deliberately broken app you run locally
- **DVWA**, **picoCTF** — classic practice targets

```bash
docker run --rm -p 3000:3000 bkimminich/juice-shop
```

That is a legal target on your own machine in one command. Start there this week.

## 3. The methodology

Real testing is systematic, not inspired. The phases:

1. **Reconnaissance** — what exists?
2. **Enumeration** — what does each thing do?
3. **Vulnerability identification** — where might it be weak?
4. **Exploitation** — prove it, minimally
5. **Post-exploitation** — what does this access reach?
6. **Reporting** — the part that creates value

Beginners skip to 4 and miss most of what is there. The findings live in 1 and 2.

## 4. Reconnaissance against your own app

Against Imboni, map what you actually expose:

```bash
# what ports are open (your own host only)
nmap -sV -p- imboni.example.com

# what the HTTP surface looks like
curl -sI https://imboni.example.com | sort

# what subdomains exist - forgotten staging boxes are a classic finding
# (passive sources; no traffic to the target)
```

The highest-value recon question for a developer: **what is deployed that I forgot
about?** An old staging instance with `DEBUG = True` and a copy of production data is
one of the most common real-world findings, and it is always discovered by recon rather
than by cleverness.

## 5. Enumerating the application

Walk the app as a normal user with an intercepting proxy running. **Burp Suite
Community** or **OWASP ZAP** — both free. Configure the browser through the proxy and
every request becomes visible and editable.

Build a map:

- Every endpoint, method and parameter
- Which require authentication; which require *which role*
- Where IDs appear in URLs or bodies
- Where the app fetches a URL, renders HTML, or touches the filesystem
- What the error messages reveal

This is the same inventory as your threat model from `00-foundations/01-SECURITY_FOUNDATIONS.md`, built from the outside.
Where the two disagree, the disagreement is the interesting part.

## 6. The tests worth running first

Against your own app, in rough order of expected yield:

**Access control** — the highest-yield category by a wide margin:
- Log in as parent A, capture a request for their child, replay it with child B's ID
- Call an admin endpoint with a normal user's token
- Remove the auth header entirely and see what still answers
- Register, then try to set `role` or `is_staff` in the profile update

**Injection:**
- `'` and `"` in every text input; watch for 500s and SQL in the error
- `<script>alert(1)</script>` and `"><img src=x onerror=alert(1)>` in anything rendered
- `; id` and `$(id)` anywhere a filename reaches the system

**Logic:**
- Negative quantities, zero, enormous numbers
- Skipping a step in a multi-step flow
- Submitting the same request twice simultaneously (race conditions)
- Changing a price or total that the client sends

**Session and token:**
- Does logout invalidate server-side, or just clear the cookie?
- Does an old token still work after a password change?
- Is the reset token single-use?

Record everything as you go. You will not remember which of forty requests behaved
oddly.

## 7. Tooling, honestly

| Tool | For | Note |
|---|---|---|
| **Burp Suite Community** | intercepting, editing, replaying | the essential one |
| **OWASP ZAP** | same, plus automated baseline scan | fully free, CI-friendly |
| **nmap** | port and service discovery | your own hosts only |
| **ffuf** / **gobuster** | directory and parameter discovery | noisy; expect to be rate-limited |
| **sqlmap** | SQL injection confirmation | powerful and destructive — never point it at something you do not own |
| **Metasploit** | exploitation framework | mostly beyond what you need for web work |

A warning that matters: automated scanners generate real load and can write real data.
Running one against production will create junk records, send emails to real users, and
possibly take the site down. Scan staging.

## 8. Writing the report

The report is the product. A finding nobody can reproduce or act on has no value.

Each finding needs:

```
TITLE       Parent can read any student record by changing the URL ID

SEVERITY    High  (confidentiality of children's records; trivially exploitable)

AFFECTED    GET /api/students/{id}/   -- all authenticated roles

STEPS       1. Log in as parent@example.com (child ID 42)
            2. Request GET /api/students/43/
            3. Full record for a child of a different family is returned

EVIDENCE    [request/response, redacted]

IMPACT      Any parent account enumerates every student record in the school.
            ~1,200 records. Sensitive personal data of minors; reportable
            under Law No. 058/2021.

FIX         Scope the queryset to request.user before lookup:
            Student.objects.filter(guardians=request.user)
            Add a regression test asserting 404 for a non-owned ID.
```

Severity should reflect **impact in context**, not a generic score. An IDOR on a public
blog post is low; the same bug on children's records is high. CVSS does not know the
difference; you do.

## 9. Disclosure

If you ever find something in software you do not own — a package, a service — handle
it properly:

1. Report privately to the vendor (security.txt, a `SECURITY.md`, or a bounty platform)
2. Give them reasonable time — 90 days is the industry norm
3. Do not access more data than needed to prove it exists; stop at proof
4. Do not demand payment. That reads as extortion regardless of intent.
5. Publish only after a fix, or after the deadline with notice given

Keep a written record of every communication.

## 10. Where this leads

If this turns out to interest you, the recognised paths are the practical ones:
**PortSwigger's BSCP**, **OSCP**, or **HTB CPTS**. All require hands-on exploitation
under time pressure rather than multiple choice, which is why they carry weight.

But the more likely value for you is narrower and more immediate: a backend engineer
who can threat-model, read their own logs, and break their own authorisation is rarer
and more employable than one who cannot. You do not need a pentest career to need this
skill.

## 11. The checklist

- [ ] Written authorisation exists for anything not yours
- [ ] Juice Shop running locally; PortSwigger Academy account created
- [ ] Burp or ZAP configured against your own staging
- [ ] Full endpoint inventory for Imboni, with required role per endpoint
- [ ] Access-control tests run against your own app, results written down
- [ ] Findings documented in the §8 format
- [ ] Nothing automated ever pointed at production

---

## Exercise 9

1. Run OWASP Juice Shop locally and solve the access-control and injection challenges
   up to three stars. Write down which category took you longest.

2. Complete PortSwigger's **Access control** and **SQL injection** learning paths. They
   map directly onto Django patterns you already write.

3. Put Burp in front of Imboni staging. Build the full endpoint inventory from §5 —
   method, parameters, required role. Compare it against what you believed was exposed.

4. Run the §6 access-control tests against your own app. Document every finding in the
   §8 report format, including the ones that turned out to be secure.

5. Take the worst finding from (4), fix it, and write the regression test. Then re-run
   the original request and confirm it now fails.

6. Write a one-page rules-of-engagement document you would require before testing a
   client's system. Include scope, dates, exclusions, and emergency contact.

Exercise 3 is where most people discover their app exposes more than they thought.
