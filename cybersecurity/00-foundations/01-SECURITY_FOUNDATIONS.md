# Security Foundations — Zero to Professional

**Week 18.** By the end of this file you can threat-model a system you have never seen,
score a vulnerability the way a professional does, and explain to a non-technical person
why a given control is or is not worth its cost.

This is the vocabulary and the reasoning that the rest of the curriculum assumes. It is
also the file that decides whether you become someone who *applies security tools* or
someone who *reasons about security* — the second is the one that transfers when the
tools change.

Nothing here is specific to a language or a product. The worked examples use Django,
Postgres and Windows because that is what you run, but every model in this file is
older than all three.

---

## Table of Contents

1. [Before you read a word](#before-you-read-a-word)
2. [Chapter 1: The discipline](#chapter-1-the-discipline)
3. [Chapter 2: The properties you are protecting](#chapter-2-the-properties-you-are-protecting)
4. [Chapter 3: Assets and adversaries](#chapter-3-assets-and-adversaries)
5. [Chapter 4: The four questions](#chapter-4-the-four-questions)
6. [Chapter 5: STRIDE](#chapter-5-stride)
7. [Chapter 6: Attack trees, kill chains, and ATT&CK](#chapter-6-attack-trees-kill-chains-and-attck)
8. [Chapter 7: The other methods, and when they earn their cost](#chapter-7-the-other-methods-and-when-they-earn-their-cost)
9. [Chapter 8: Risk, quantified](#chapter-8-risk-quantified)
10. [Chapter 9: Scoring vulnerabilities](#chapter-9-scoring-vulnerabilities)
11. [Chapter 10: Saltzer and Schroeder's eight principles](#chapter-10-saltzer-and-schroeders-eight-principles)
12. [Chapter 11: Defence in depth, and the layer audit](#chapter-11-defence-in-depth-and-the-layer-audit)
13. [Chapter 12: Zero trust, honestly](#chapter-12-zero-trust-honestly)
14. [Chapter 13: Attack surface and blast radius](#chapter-13-attack-surface-and-blast-radius)
15. [Chapter 14: The attacker mindset, trained](#chapter-14-the-attacker-mindset-trained)
16. [Chapter 15: How breaches actually happen](#chapter-15-how-breaches-actually-happen)
17. [Chapter 16: Security in the development lifecycle](#chapter-16-security-in-the-development-lifecycle)
18. [Chapter 17: Metrics that mean something](#chapter-17-metrics-that-mean-something)
19. [Chapter 18: Compliance is not security](#chapter-18-compliance-is-not-security)
20. [Chapter 19: The honest conclusion](#chapter-19-the-honest-conclusion)
21. [Exercise 1 — the module checkpoint](#exercise-1--the-module-checkpoint)

---

## Before you read a word

Three claims that the rest of the file defends. If you disagree with them now, note why,
and check at the end whether you still do.

1. **Security is a property of a design, not a layer you add to one.** You cannot bolt
   it on afterwards for the same reason you cannot bolt correctness on afterwards.
2. **The attacker needs one path; you need to be right everywhere.** This asymmetry is
   the whole shape of the discipline, and it is why "we have a firewall" is not an
   answer.
3. **Most breaches are boring.** Stolen credentials, an unpatched CVE, a misconfigured
   bucket. The interesting attacks are rare and they are not your risk yet.

---

# PART 1 — WHAT SECURITY IS

## Chapter 1: The discipline

### The definition worth memorising

> Security is the practice of **keeping a system's intended properties true in the
> presence of an adversary who is actively trying to make them false.**

Every clause of that does work:

- **Intended properties** — you must be able to state them. "Secure" is not a property.
  "A parent can read only their own child's records" is.
- **In the presence of an adversary** — this is what separates security from reliability.
  A disk fails randomly. An attacker fails *intelligently*, learns, and tries again at
  the weakest point you have.
- **Actively trying** — your threat model is not a weather forecast. It is an opponent.

Reliability engineering asks "what is likely to go wrong?" Security engineering asks
"what is *possible*, if someone is paid to find it?" Those produce different designs.

### The asymmetry

```
Defender:  must be correct at EVERY entry point, EVERY release, FOREVER
Attacker:  must be correct at ONE entry point, ONCE
```

This is why security is expensive and why perfect security does not exist. It also tells
you where to spend: controls that cover a *class* of attack are worth more than controls
that cover an instance.

Consider two ways to stop SQL injection:

```python
# Purpose: fix one instance of SQL injection. Defends one line of code.
cursor.execute("SELECT * FROM students WHERE name = '" + escape(name) + "'")

# Purpose: make the entire class of SQL injection structurally impossible,
# because parameters are sent separately from the statement and are never parsed
# as SQL, no matter what they contain.
cursor.execute("SELECT * FROM students WHERE name = %s", [name])
```

The second is not "better escaping". It is a different kind of control: the first
depends on a human remembering, the second depends on the database's wire protocol.
**Prefer controls that remove the possibility over controls that require vigilance.**
This single heuristic will carry you further than any tool in `../TOOLKIT.md`.

### Security is never "done"

Three things change under you:

1. **Your system** — every feature adds attack surface
2. **The threat landscape** — a technique that was research last year is a tool this year
3. **Your dependencies** — code you did not write becomes vulnerable while you sleep

So the output of security work is not a secured system. It is a **process** that keeps
making the system secure as those three move. A penetration test is a snapshot; a patch
pipeline is a process. Budget accordingly.

### The economics

Attack and defence are both investments, and attackers are economically rational — the
commodity ones especially, because they are running a business.

```
Attacker proceeds when:   expected value of success  >  cost of attack × risk of being caught
Your goal:                make your system more expensive than the next target
```

You are almost never defending against someone who *wants your data specifically*. You
are defending against someone sweeping the internet for anything cheap. That changes the
strategy completely: **you do not need to be unbreakable, you need to be more expensive
than average.** MFA, patching and no-plaintext-secrets achieve that for nearly nothing.

The exception matters though. If you hold children's records and mental-health responses,
there exists a category of attacker for whom your data is the point — a hostile parent,
a local official, a journalist, a blackmailer. For those, "more expensive than average"
is not enough. Chapter 3 is about telling the two apart.

### Practice

1. Write down three *intended properties* of Imboni, in the form "X can only Y". Not
   goals — testable statements.
2. For each, say what would have to be true for it to be false.
3. Find one control in either codebase that depends on a human remembering. Describe
   what the structural version would be.

---

## Chapter 2: The properties you are protecting

### The CIA triad

Every control exists to serve one of three properties. Naming which one keeps you honest
about whether the control is worth its cost.

| Property | Means | Broken when | Typical controls |
|---|---|---|---|
| **Confidentiality** | only authorised parties can read it | a parent reads another child's record | encryption, access control, minimisation |
| **Integrity** | data is correct and modified only in authorised ways | a student edits their own attendance | authorisation, constraints, signing, hashing, audit |
| **Availability** | the system works when it is needed | the server is down on results day | redundancy, rate limits, backups, capacity |

### Why the triad is not enough

The triad is from an era of mainframes and classified documents. Three properties it
does not name, each of which you need:

**Authenticity** — not just "the data is unmodified" but "it genuinely came from who it
claims". Integrity without authenticity gets you a perfectly intact message from an
impostor.

```
Integrity only:     "this message has not been altered"
+ Authenticity:     "this message has not been altered AND Mr. Mutabazi sent it"
```

A hash gives you the first. A MAC or a signature gives you both. This is why
`03-CRYPTOGRAPHY_ESSENTIALS.md` insists on authenticated encryption rather than
encryption plus a separate hash.

**Non-repudiation** — the sender cannot later deny it. Requires asymmetric signatures;
a shared secret cannot provide it, because either party could have produced the tag.
Matters the moment a record is evidence: a grade change, a consent form, a safeguarding
report.

**Possession/control** — an attacker holding your encrypted backup has not broken
confidentiality *yet*, but they have your data and all the time in the world. This is
not a pedantic distinction in 2026: it is the entire basis of **harvest-now,
decrypt-later**, where traffic is captured today to be decrypted once quantum computers
arrive.

Together with **utility** (data you can no longer use is not protected, it is lost) these
make the **Parkerian hexad** — Donn Parker's six-property extension. You do not need to
cite it. You do need to notice when a problem is outside the triad, because that is
exactly when people reach for the wrong control.

### AAA — the operational trio

Distinct from CIA, and constantly confused:

| Term | Question | Failure looks like |
|---|---|---|
| **Authentication** | who are you? | an attacker logs in as someone else |
| **Authorisation** | what may you do? | a logged-in user reads another family's data |
| **Accounting** (audit) | what did you do? | a breach you cannot reconstruct |

**Authentication is the one everybody implements and authorisation is the one everybody
gets wrong.** This is not an opinion: Broken Access Control has been #1 on the OWASP Top
10 in both 2021 and 2025, found in 3.73% of applications tested across a dataset of over
2.8 million (verified October 2026 against `top10.owasp.org/2025`).

The reason is structural. Authentication happens **once**, at one place, so it is easy to
centralise and easy to test. Authorisation must happen on **every** request, for **every**
object, in **every** code path — and the failure is silent. Nothing crashes when you
forget it. The feature works perfectly; it just works for the wrong person.

Accounting is the one that gets dropped for schedule, and then the incident happens and
you cannot answer "what did they take?" You lived this in September: you could tell what
the malware *was* but not everything it *sent*, and you still cannot. That gap is an
accounting failure, not a prevention failure.

### The properties trade off — a worked lattice

There is no configuration that maximises all of them. Security engineering is choosing.

| Decision | Confidentiality | Integrity | Availability | Notes |
|---|---|---|---|---|
| Encrypt every field in Postgres | ▲▲ | — | ▼▼ | cannot index, cannot query, cannot `WHERE` |
| Nightly off-site backups | ▼ | ▲ | ▲▲ | the data now exists in more places |
| Aggressive rate limiting | — | ▲ | ▼ | you will lock out real parents on results day |
| Require MFA for all staff | ▲▲ | ▲ | ▼ | a teacher who loses their phone cannot teach |
| Append-only audit log | ▼ | ▲▲ | — | now the log itself is sensitive data |
| Delete data after 2 years | ▲▲ | — | ▼ | privacy up, historical analysis gone |

Work through one properly, because the reasoning is the skill:

> **Should Imboni encrypt the `students.medical_notes` column?**
>
> Threat it addresses: an attacker with database read access but not application access
> — a stolen backup, a misconfigured port, a compromised read replica.
>
> Threat it does not address: a compromised Django process, which holds the key. Nor an
> IDOR, which uses the legitimate decryption path. Both are *more likely* than a stolen
> backup.
>
> Costs: cannot search notes; cannot sort; key management becomes a new failure mode
> that can destroy the data permanently; backup restore now requires the key to be
> somewhere safe-but-reachable.
>
> Verdict: encrypt the **backup** (addresses the same threat, none of the costs), not the
> column. Spend the saved effort on the IDOR, which is the likelier breach.

That is what security engineering looks like. Not "encryption good" — the specific threat,
the specific cost, the cheaper control that covers the same threat.

### Practice

1. For each of the six Parkerian properties, name one thing in your stack that has it
   and one that does not.
2. Find a place in Imboni where you have integrity but not authenticity. What would an
   attacker do with that?
3. Take the audit question seriously: if Imboni were breached tonight, write down exactly
   what you could prove about what was accessed. Then write what you would need to log to
   make that answer complete.
4. Do the `medical_notes` analysis above for one real decision of your own, in the same
   five-part shape: threat addressed, threat not addressed, costs, cheaper alternative,
   verdict.

---

## Chapter 3: Assets and adversaries

### You cannot protect what you have not enumerated

Every real security programme starts with an inventory, and almost every amateur one
skips it. The reason it matters: **your attack surface includes the things you forgot
about**, and those are the things with no patches, no monitoring and no owner.

A minimal asset register has five columns. Build it once:

| Asset | Where it lives | Classification | Owner | Blast radius if lost |
|---|---|---|---|---|
| Student records | Postgres `imboni_prod` | Sensitive personal (minors) | you | legal notification, every family |
| Screening responses | Postgres `screening_prod` | Special category (health) | you | legal notification, serious individual harm |
| Session cookies | Redis | Credential | you | full impersonation of any user |
| `.env` secrets | VPS disk, dev laptop | Credential | you | everything above |
| SSH keys | dev laptop `~/.ssh` | Credential | you | the server, therefore everything |
| SMTP credentials | `.env` | Credential | you | phishing *as you*, to parents |
| Source code | GitHub | Internal | you | accelerates attack, not a breach itself |
| Dev laptop | physical | Everything above | you | **this is the one that happened** |

Two things fall out of that table immediately, and neither is obvious before you write it:

1. **The laptop is the highest-value asset**, because it transitively holds every other
   one. You protected the server and the attacker took the laptop.
2. **The SMTP credential is worse than it looks.** Reading data is a breach; sending
   mail *as Imboni to a list of parents* is a platform for attacking everyone who trusts
   you. Secondary-use value is routinely underestimated.

### Data classification

Four tiers are enough. The point is not the labels, it is that a rule attaches to each.

| Tier | Examples | Rule |
|---|---|---|
| **Public** | marketing pages, docs | no restriction |
| **Internal** | source, architecture, metrics | authenticated staff only |
| **Sensitive personal** | names, contacts, attendance, grades | need-to-know, audited, encrypted in transit and at rest |
| **Special category** | health, mental health, biometrics, minors' data | the above plus explicit lawful basis, minimisation, retention limit, DPIA |

Both your projects operate in the bottom row. Rwanda's Law No. 058/2021 treats
children's data and health data as requiring the strictest handling, with a 48-hour
breach-notification clock (see `../06-governance/01-COMPLIANCE_AND_DATA_PROTECTION.md`).
Classification is what turns that from a sentence into a design constraint.

### Adversary tiers

"Hacker" is useless as a planning term. Five tiers, with what each one actually changes
about your design:

| Tier | Motivation | Capability | Targets you? | What stops them |
|---|---|---|---|---|
| **Opportunist / script kiddie** | curiosity, bragging | public exploits, scanners, no persistence | no — sweeps everything | patching, no default creds, MFA |
| **Commodity criminal** | money at volume | kits, infostealers, phishing-as-a-service, broker markets | no — you are a row in a list | the same things, plus endpoint hygiene |
| **Targeted criminal** | money from *you* | will spend days, will phone your staff | yes | defence in depth, audit, out-of-band verification |
| **Insider** | grievance, money, curiosity, coercion | **legitimate credentials**, knows your gaps | yes | least privilege, separation of duties, audit they cannot edit |
| **State-sponsored** | intelligence, disruption | zero-days, supply chain, unlimited patience | almost certainly not | essentially nothing you can afford — document and accept |

Three conclusions that follow:

**Nearly all your real risk is in rows 1–2**, where the attacker never heard of you. That
is the September incident exactly: a commodity infostealer arriving with a pirated game,
taking whatever was in plaintext, selling it on. No one chose you.

**Row 4 is the one that is systematically under-modelled.** An insider at Imboni is not
hypothetical — it is a teacher, an administrator, a future employee, or you on a bad day.
They have credentials, so authentication does nothing. Only least privilege, separation
of duties, and an audit log the insider cannot modify do anything at all. Most systems,
including yours, have none of the three.

**Row 5 you write down and decline.** Documenting an accepted risk is a valid, mature
output. Pretending to defend against it is how budgets get wasted on the wrong tier.

### Advanced: modelling an adversary properly

For the tier that matters, write four lines. This is the compressed form of what
intelligence teams call an adversary profile:

```
ADVERSARY: hostile separated parent seeking a child's address and school schedule
INTENT:    locate a child whose guardian has moved to avoid them
CAPABILITY: no technical skill; knows the school, the child's name, a teacher's name;
            may legitimately hold a parent account
RESOURCES: patience, social legitimacy, the ability to walk into the building
```

Now notice what this adversary defeats. Every one of your technical controls is irrelevant
— they log in legitimately. Encryption, TLS, MFA, patching: all bypassed, because the
attack is *authorised*. What stops them is authorisation scoped to *their own* child,
plus an audit log, plus a staff procedure for verifying who is asking.

**This is the single most valuable exercise in the chapter.** The adversary who matters
most to your actual users is not technical at all, and you will not find them by thinking
about exploits.

### Practice

1. Build the five-column asset register for one of your projects. Include the laptop.
   Include anything on your phone.
2. Classify every table in Imboni's schema into the four tiers. Count how many are in the
   bottom two. That number is your compliance scope.
3. Write the four-line adversary profile for three adversaries of Screening, one of which
   must be an insider and one of which must be non-technical.
4. For the non-technical one, list every control you currently have that would stop them.
   If the list is empty, that is the finding.
5. Name one asset you own that you had forgotten about until you built the register.

---

# PART 2 — THREAT MODELLING

## Chapter 4: The four questions

Threat modelling has a reputation for heavyweight ceremony. The useful core is four
questions, from Adam Shostack, and they work on a napkin:

1. **What are we building?**
2. **What can go wrong?**
3. **What are we going to do about it?**
4. **Did we do a good job?**

That is the whole method. Everything else — STRIDE, PASTA, attack trees — is a technique
for answering question 2 more thoroughly. Do not skip to the techniques; teams that do
end up with beautiful STRIDE tables about the wrong system.

### Question 1: the data flow diagram

Answer it with a diagram, not prose, and use exactly five symbols. This is a DFD, and the
vocabulary is worth learning properly because it is universal.

```
  [ External entity ]    a person or system you do NOT control
  ( Process )            code that acts on data
  = Data store =         where data rests
  ──────▶                a data flow
  ╌╌╌╌╌╌                 a TRUST BOUNDARY
```

Rules that make the difference between a useful DFD and a decoration:

- **Every flow is labelled** with what crosses it, not just an arrow
- **Every process has at least one in and one out** — otherwise it is not doing anything
- **Trust boundaries are drawn, not implied** — this is the whole point of the exercise
- **One level at a time.** Level 0 is the system; level 1 is one feature. Do not mix.

### How to build a DFD — step by step

1. **List the external entities.** Anyone who sends you data and whom you do not control.
   Include third-party APIs. Include your own future admin.
2. **List the data stores.** Every place data rests, including Redis, including log
   files, including the browser's `localStorage`, including your laptop.
3. **Draw the processes between them** and label every flow with its contents.
4. **Draw the trust boundaries last.** Anywhere data crosses from something you control
   to something you do not, or between two things with different privilege.
5. **Check it against reality** — `grep` the codebase for an entry point you did not draw.
   You will find one. Everyone does.

Worked, for Imboni's parent invitation flow:

```
                             ╌╌╌╌ internet boundary ╌╌╌╌
  [ Parent ]──(1) GET /invite/<token>──▶( Django view )
       ▲                                      │
       │                                  (2) SELECT by token
       │                                      ▼
       │                              = Postgres invitations =
       │                                      │
  (5) set-cookie session                  (3) INSERT user
       │                                      ▼
       └──────────────────────────────( create account )
                                            │
                             ╌╌╌╌ vendor boundary ╌╌╌╌
                                       (4) send welcome mail
                                            ▼
                                      [ SMTP provider ]
```

Four flows, three boundaries, and already two things are visible that prose hides: the
token travels in a **URL** (flow 1), and flow 4 leaves your control entirely.

### Question 2, first pass: walk every flow

For each numbered flow, three questions:

- **Who can send this?** (not: who is supposed to)
- **What if they lie about its contents?**
- **What if they send it a million times, or twice at once?**

| Flow | Who can actually send it | What if they lie | Volume / concurrency |
|---|---|---|---|
| 1 | **anyone on the internet with a token-shaped string** | guessed or brute-forced token | enumeration at scale |
| 2 | Django only — inside the boundary | n/a, trusted | an unindexed lookup is a DoS |
| 3 | Django only | n/a | **two simultaneous requests → two accounts from one token** |
| 4 | Django, but the provider receives it | provider is breached, mail is read | mail provider rate limits you |
| 5 | Django sets it, browser stores it | cookie stolen by XSS or malware | session fixation |

Row 3 is the one prose would never have surfaced. "Single-use token" is not single-use
unless the check and the consumption are **atomic**:

```python
# Purpose: WRONG. A race between the check and the update lets two concurrent
# requests both pass the check and both create an account from one invitation.
invite = Invitation.objects.get(token=token)
if invite.used:
    raise PermissionDenied
invite.used = True
invite.save()

# Purpose: RIGHT. The database performs the test and the set in one atomic
# statement; exactly one of N concurrent requests gets rows_updated == 1.
rows_updated = Invitation.objects.filter(
    token=token, used=False, expires_at__gt=timezone.now()
).update(used=True, used_at=timezone.now())

if rows_updated != 1:
    raise PermissionDenied          # already used, expired, or never existed
```

Note the second form also stops leaking *which* of those three it was — one error for
all failure modes. That is **fail-safe defaults** and **economy of mechanism**, both from
Chapter 10, arriving naturally out of a correctness fix.

### Question 3: controls, with honesty

| Threat | Control | Does it actually work? |
|---|---|---|
| Token guessed | `secrets.token_urlsafe(32)` — 256 bits | yes, structurally |
| Token reused | atomic single-use as above | yes |
| Token never expires | `expires_at`, 72h, checked in the same query | yes |
| Token leaks via `Referer` | `Referrer-Policy: no-referrer` on that route | **partially** — still in history, proxy logs, and your own access log |
| Token enumeration | rate limit per IP | weakly — distributed requests defeat it; 256 bits is the real control |
| Mail provider breached | none | **accepted risk, documented** |
| Session cookie stolen | `HttpOnly`, `Secure`, `SameSite=Lax`, short expiry | reduces, does not prevent — malware with disk access wins anyway |

**A threat model where every row says "yes, solved" is one you did not take seriously.**
The partial and the accepted rows are the valuable output: they are the list of things
you now know rather than things you now hope.

The `Referer` row deserves a note, because it generalises. Secrets in URLs leak through
at least six channels: browser history, the `Referer` header, server access logs,
corporate proxies, analytics scripts, and shared screenshots. The structural fix is to
not put secrets in URLs — a one-time code the user types, or a POST body. Everything
else is mitigation.

### Question 4: did we do a good job?

The question people skip. Four concrete tests:

1. **Would the control stop the attack, or does it make you feel better?** Write the
   `curl` that bypasses it. If you cannot write one, you have evidence.
2. **Is it enforced centrally, or per-view?** Per-view means it will be forgotten in
   view 41.
3. **Is there a test that fails if someone removes it?** If not, it will be removed.
4. **Would you have caught the September malware with this model?** Apply it
   retrospectively to a real incident. This is how you calibrate.

```python
# Purpose: a regression test that fails if authorisation is ever removed from the
# records endpoint. Without this, the control is a comment.
def test_parent_cannot_read_another_familys_child(client, parent_a, child_of_b):
    client.force_login(parent_a)
    r = client.get(f"/api/students/{child_of_b.id}/")
    assert r.status_code == 404        # 404, not 403 — do not confirm existence
```

The `404` is deliberate. A `403` confirms the record exists, which is itself a disclosure
— it lets a hostile parent verify a child is enrolled at a school even without reading the
record. Choosing between 403 and 404 is an information-disclosure decision, not a style
decision.

### Practice

1. Draw the level-1 DFD for Screening's result-viewing flow. Five symbols, labelled
   flows, boundaries drawn last.
2. Walk every flow with the three questions. Find at least one concurrency problem.
3. Write the controls table including at least one **partial** and one **accepted** row.
4. Write the regression test for the most important control you identified.
5. `grep` your URL configuration for an endpoint that is not in your diagram.

---

## Chapter 5: STRIDE

Walking flows ad hoc finds the threats you already imagine. STRIDE is a mnemonic that
forces you past them, and it maps one-to-one onto the properties from Chapter 2 — which
is why it is worth learning rather than inventing your own list.

| Threat | Violates | Means | Control class |
|---|---|---|---|
| **S**poofing | Authenticity | pretending to be someone else | authentication, MFA, signatures |
| **T**ampering | Integrity | modifying data or code | authorisation, MACs, constraints, checksums |
| **R**epudiation | Non-repudiation | denying an action | audit logs, signatures, timestamping |
| **I**nformation disclosure | Confidentiality | reading what you may not | access control, encryption, minimisation |
| **D**enial of service | Availability | exhausting a resource | rate limits, quotas, timeouts, capacity |
| **E**levation of privilege | Authorisation | doing what you may not | least privilege, input validation, sandboxing |

### STRIDE-per-element

The advanced form, and the one that finds the real bugs. Not every threat applies to
every DFD element, and knowing which apply tells you where to look:

| Element | S | T | R | I | D | E |
|---|---|---|---|---|---|---|
| External entity | ✓ | | ✓ | | | |
| Process | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Data store | | ✓ | ✓ | ✓ | ✓ | |
| Data flow | | ✓ | | ✓ | ✓ | |

Read it as a checklist: a **data store** cannot be spoofed or elevate privilege, but it
can absolutely be tampered with, disclosed, denied, and can be the thing that destroys
repudiation (an editable audit log). A **process** is exposed to all six — which is why
processes get the most scrutiny.

### Worked: STRIDE on Screening's result-viewing flow

```
  [ Parent ]╌╌╌▶( auth middleware )──▶( results view )──▶= Postgres responses =
                                             │
                                             └──▶( PDF renderer )──▶= /tmp =
```

| # | Element | STRIDE | Concrete threat | Control |
|---|---|---|---|---|
| 1 | Parent (entity) | S | credential stuffing with a password reused from a breach | MFA; breached-password check at set time |
| 2 | Parent (entity) | R | "I never consented to the screening" | consent recorded with timestamp, version, IP |
| 3 | auth middleware (process) | E | session fixation — attacker sets the session ID pre-login | rotate session ID on privilege change |
| 4 | results view (process) | I | **IDOR** — `/results/1247/` returns anyone's | filter by `request.user`, enforced centrally |
| 5 | results view (process) | D | unbounded date-range report, one query per child | pagination, query timeout, cost ceiling |
| 6 | Postgres (store) | T | app DB user can `DROP TABLE` | least privilege grants |
| 7 | Postgres (store) | R | the audit table is writable by the app | append-only, or ship logs off-box |
| 8 | flow to PDF (flow) | I | mental-health data in a world-readable `/tmp` file | render in memory; if on disk, `0600` and unlink |
| 9 | /tmp (store) | I | PDFs persist after the request, survive reboot, enter backups | explicit cleanup, `tempfile` with delete |
| 10 | flow to Postgres (flow) | I | unencrypted connection on a shared network | `sslmode=verify-full` |

Rows 8 and 9 are the kind STRIDE-per-element finds and intuition does not. Nobody
designs a feature called "leave mental-health PDFs in /tmp" — it is a side effect of a
rendering library's default, and the only reason it appeared is that the method made you
enumerate *data stores* and `/tmp` is one.

```python
# Purpose: WRONG. The library writes to a predictable path, leaves the file behind,
# and inherits the process umask - on many systems that is world-readable.
HTML(string=html).write_pdf(f"/tmp/screening_{response.id}.pdf")

# Purpose: RIGHT. Render to memory, never touch the disk, let the bytes be garbage
# collected with the request.
import io
buf = io.BytesIO()
HTML(string=html).write_pdf(buf)
return FileResponse(io.BytesIO(buf.getvalue()),
                    content_type="application/pdf",
                    as_attachment=True,
                    filename="results.pdf")
```

### Getting STRIDE wrong

Three failure modes, all common:

**Threat inflation.** Listing every theoretical threat produces a 300-row table nobody
reads. Cap it: for each element, the two or three *most plausible* threats. The method is
a lens, not a quota.

**Modelling the diagram instead of the system.** If the DFD is wrong, the STRIDE table is
confidently wrong. Always step 5 of the DFD process — check it against the code.

**Stopping at the table.** A threat model with no owners and no dates is a document. Each
row needs a decision: *fix now*, *fix later with a ticket*, or *accept, with a reason*.
Three outcomes only.

### Practice

1. Run STRIDE-per-element on Imboni's attendance submission. Use the applicability grid;
   do not generate threats for elements that cannot have them.
2. Find one Information Disclosure threat that comes from a *library default* rather than
   your code.
3. For every row, assign one of the three outcomes. Count how many you accept.
4. Pick your highest-severity row and write the exploit — the actual request. Then fix it
   and keep the test.

---

## Chapter 6: Attack trees, kill chains, and ATT&CK

STRIDE enumerates threats per element. These three models describe an attacker's
*campaign* — how individual threats chain into a breach. You need all three because they
answer different questions.

### Attack trees

Goal at the root, methods branching down, AND/OR at each node. Useful for one high-value
goal and for finding the cheapest path — which is the one that will actually be used.

```
GOAL: read a specific child's home address
├── OR  Compromise a parent account
│   ├── OR  Credential stuffing          [cost: trivial | detect: likely]
│   ├── OR  Phish the parent             [cost: low     | detect: unlikely]
│   └── OR  Reset via compromised email  [cost: low     | detect: unlikely]
├── OR  Compromise a staff account
│   ├── AND Phish a teacher
│   │   └── AND Defeat MFA (SIM swap / real-time proxy)
│   └── OR  Teacher reuses a breached password   [cost: trivial | detect: unlikely]
├── OR  Exploit the application
│   ├── OR  IDOR on /api/students/<id>/  [cost: trivial | detect: unlikely]
│   └── OR  SQL injection in search      [cost: medium  | detect: likely]
├── OR  Compromise the developer         ← THE SEPTEMBER PATH
│   ├── AND Malware on the laptop
│   │   └── AND Steal .env or SSH key    [cost: trivial | detect: NO]
├── OR  Ask a member of staff            [cost: zero    | detect: no]
└── OR  Get a court order / be the parent [cost: legal  | detect: n/a]
```

Three lessons, and they are the reason to draw trees at all:

1. **The cheapest branch is the one that matters.** An attacker takes the minimum of the
   leaf costs, not the average. Your security is the cost of your *weakest* path — which
   makes "ask a member of staff" the real answer, and makes staff procedure a security
   control.
2. **Branches you did not consider dominate the tree.** The developer-laptop branch is
   what actually happened, and it is invisible if you only model the web application.
3. **Annotate detectability, not just cost.** A cheap-but-noisy path is survivable; a
   cheap-and-silent path is a disaster. The September branch is marked *detect: NO* and
   that was accurate — Defender was fully enabled and saw nothing.

### How to build an attack tree — step by step

1. **State one specific goal** at the root. Not "hack Imboni" — "read a named child's
   address". Specificity is what makes the tree finite.
2. **Ask "how?" and list every method**, however stupid. Social and physical paths
   included. This is where non-technical branches get in.
3. **Mark OR (alternatives) and AND (all required).** AND nodes are good news: each
   conjunct is a place to intervene.
4. **Recurse until a leaf is a single concrete action.**
5. **Annotate leaves** with cost, skill required, and detectability.
6. **Find the minimum-cost path.** That is your actual security level.
7. **Intervene on the AND nodes and the cheap leaves**, in that order.

### The Cyber Kill Chain

Lockheed Martin's 2011 model: seven sequential stages of an intrusion.

| # | Stage | Attacker does | You can |
|---|---|---|---|
| 1 | Reconnaissance | finds targets, harvests emails | reduce public info; monitor for scanning |
| 2 | Weaponisation | builds the payload | nothing — happens on their machine |
| 3 | Delivery | email, download, USB, cracked game | mail filtering, allow-listing, user training |
| 4 | Exploitation | the payload runs | patching, EDR, least privilege |
| 5 | Installation | persistence established | monitor autoruns, scheduled tasks, services |
| 6 | Command & Control | calls home | egress filtering, DNS logging |
| 7 | Actions on objectives | steals, encrypts, destroys | DLP, egress limits, backups |

The point of the model is **earlier is cheaper**, and **you only need to break the chain
once**. Stopping delivery costs a mail filter; stopping actions-on-objectives costs an
incident response.

Map September onto it and the gap is obvious:

```
1 Recon            — none; you were not targeted, you went looking for a repack
2 Weaponisation    — the loader was built and bundled by someone else
3 Delivery         — cracked GTA V / Sniper Elite installer  ← BREAK HERE, free
4 Exploitation     — you ran the installer as Administrator  ← BREAK HERE, free
5 Installation     — hidden scheduled task \SearchHost       ← detectable, 1 command
6 C2               — payload called out                      ← never monitored
7 Actions          — .env secrets, tokens, session cookies exfiltrated
```

Stages 3 and 4 were free to break and required no technology: do not run pirated
installers, do not run as Administrator. Stage 5 was one `Get-ScheduledTask` away. Stage
6 was unmonitored and stage 7 completed. The chain had four places to break and broke at
none — which is the normal outcome when nobody is watching, not bad luck.

The kill chain's weakness: it is linear and perimeter-flavoured, built for malware
delivery. It describes modern credential-based attacks badly, because an attacker who
logs in with your password skips stages 2–5 entirely. For those, use ATT&CK.

### MITRE ATT&CK

A knowledge base of real observed behaviour, organised as **tactics** (the attacker's
goal) × **techniques** (how). Fourteen Enterprise tactics:

```
Reconnaissance → Resource Development → Initial Access → Execution → Persistence
→ Privilege Escalation → Defense Evasion → Credential Access → Discovery
→ Lateral Movement → Collection → Command and Control → Exfiltration → Impact
```

Non-linear, unlike the kill chain — an intrusion loops through Discovery, Lateral
Movement and Credential Access many times.

What makes ATT&CK different from the other two: every technique has an ID, documented
real-world use, **detection guidance** and **mitigations**. It is the shared vocabulary
between attack and defence, which is why `../04-detection-and-response/` is organised
around it.

September, in ATT&CK terms:

| Tactic | Technique | ID | What happened |
|---|---|---|---|
| Initial Access | User Execution: Malicious File | T1204.002 | you ran a cracked-game installer |
| Execution | Trusted Developer Utilities: MSBuild | **T1127.001** | `MSBuild.exe` loaded a .NET assembly from a fake `.targets` file |
| Persistence | Scheduled Task | T1053.005 | `\SearchHost`, `<Hidden>true</Hidden>`, logon trigger |
| Defense Evasion | Masquerading: Match Legitimate Name | T1036.005 | folders named `TP-Link`, `JMicron`, `EnumsNET` |
| Defense Evasion | Timestomp | T1070.006 | file times falsified to defeat "recently modified" |
| Defense Evasion | Hide Artifacts | T1564 | `conhost.exe --headless` — no visible window |
| Defense Evasion | Reflective Code Loading | T1620 | `AppDomain.CurrentDomain.Load()` — payload never on disk as a PE |
| Credential Access | Credentials from Password Stores | T1555.003 | browser credential stores |
| Collection | Data from Local System | T1005 | `.env` files, SSH keys |
| Exfiltration | Exfiltration Over C2 Channel | T1041 | confirmed by Anthropic Trust & Safety |

Writing it this way is not bureaucracy. It does three things prose cannot:

- **It tells you what you did not look for.** You found persistence and execution. Did
  you check T1555 — which browser stores were read? You still do not know.
- **It gives you the detection for free.** Every technique page lists data sources and
  analytics. `T1127.001` tells you to monitor `MSBuild.exe` process creation — which is
  exactly the rule that ended up in Guardian's `lolbin.py`.
- **It makes your gaps measurable.** Count the techniques you could detect today. That
  number is your coverage, and it is honest.

### The Diamond Model and the Pyramid of Pain

Two smaller models worth knowing.

**Diamond Model** — every intrusion event has four features, and pivoting between them is
how analysis works:

```
        Adversary
         /     \
  Infrastructure — Capability
         \     /
         Victim
```

From one hash (capability) you pivot to the C2 domain (infrastructure), to other victims
of the same domain, to the operator. One hash is a fact; a diamond is intelligence.

**Pyramid of Pain** (David Bianco) — ranks indicators by how much it costs the attacker
when you block them:

```
            ▲  TTPs                      ← hardest for them to change: WIN
            │  Tools
            │  Network / host artefacts
            │  Domain names
            │  IP addresses
            ▼  Hash values               ← trivial to change: nearly worthless
```

This is the most practically important of the three. Blocking the hash
`4bcf7d9b…` from September accomplishes approximately nothing — one recompile and it is a
new hash. Detecting the **TTP** — "MSBuild spawned from a user-writable cache directory
with no solution file present" — catches the whole family, including variants that do not
exist yet.

That is precisely the upgrade Guardian received: `lolbin.py` scores *behaviour*, not
hashes. Hash matching is the bottom of the pyramid, and almost all consumer antivirus
lives there, which is why Defender missed this and a 200-line Python script caught it.

### Practice

1. Build the full attack tree for "exfiltrate every Screening response". Annotate cost
   and detectability. Identify your minimum-cost path.
2. Map your most recent feature onto the kill chain and name the earliest stage you could
   break.
3. Take ten ATT&CK techniques from the September table and for each write: could I detect
   this today, yes or no? The ratio is your coverage.
4. Pick one technique you cannot detect and read its ATT&CK page. Write the detection
   rule. Add it to Guardian.
5. For September, list the indicators you collected and place each on the Pyramid of
   Pain. How many were above "domain names"?

---

## Chapter 7: The other methods, and when they earn their cost

You will meet these names. Knowing what each is *for* saves you from applying a
corporate framework to a weekend project.

| Method | Drives from | Best for | Cost |
|---|---|---|---|
| **STRIDE** | the design | developers, per-feature, routine use | hours |
| **Attack trees** | one goal | a single high-value asset | hours |
| **PASTA** | business risk | regulated enterprise, 7 stages, risk-centric | weeks |
| **LINDDUN** | privacy, not security | **personal data — both your projects** | days |
| **OCTAVE** | organisational risk | whole-organisation programmes | weeks |
| **VAST / Trike** | automation, scale | large portfolios, tooling-driven | varies |
| **Abuse cases** | user stories | teams already doing agile | minutes per story |

Two deserve more than a row.

### LINDDUN — because your problem is privacy, not just security

STRIDE finds the attacker reading data they should not. It does **not** find the harm you
cause with data you are entitled to hold. For children's records and mental-health
responses, that second category is the larger legal and ethical exposure.

| Threat | Means | In Screening |
|---|---|---|
| **L**inking | two records can be connected | anonymous responses linkable via timestamp + school + class size |
| **I**dentifying | an individual can be named | "anonymous" results for a class of 3 identify everyone |
| **N**on-repudiation | someone cannot deny an action they should be able to | a pupil cannot plausibly deny a disclosure they made in confidence |
| **D**etecting | the existence of a record is itself revealing | that a pupil *took* a mental-health screening, regardless of content |
| **D**ata disclosure | excessive or unnecessary exposure | full response set in an export when a count would do |
| **U**nawareness | the subject does not understand or control the processing | a parent consented; did the child understand? |
| **N**on-compliance | processing without lawful basis, retention, or rights | no retention limit, no deletion path |

Row **Detecting** is the one that should stop you. In Screening, the *fact* that a
specific pupil completed a mental-health questionnaire is sensitive even if nobody reads
a single answer — to a parent, a teacher, a future employer. No access-control model
catches this, because it is not about access. It is about what your database schema makes
knowable. Fixing it is a *design* change: don't store per-pupil completion flags where
staff can see them; aggregate at the class level with a minimum cell size.

That finding is unreachable from STRIDE. It is why both your projects need LINDDUN as
well, and why `../06-governance/01-COMPLIANCE_AND_DATA_PROTECTION.md` treats a DPIA as
engineering work rather than paperwork.

### Abuse cases — the cheapest useful thing in this chapter

For every user story you write, write its inversion. It takes a minute and fits in your
existing process.

```
STORY: As a parent, I can view my child's attendance so I can follow their progress.

ABUSE: As a hostile separated parent, I can view a child's attendance to learn
       which days they are at school, so I can wait outside.

ABUSE: As a bored pupil, I can view attendance for a child who is not mine by
       changing the ID in the URL.

ABUSE: As a scraper, I can enumerate every student ID at 10 requests/second and
       keep the result.
```

Three abuse cases, three controls: scope by custody relationship (not merely "is a
parent"), object-level authorisation, rate limiting plus non-sequential IDs. The first
one is a *requirement* you would never have written down otherwise — and it is the one
that protects a child from actual physical harm.

### Practice

1. Write abuse cases for the next three user stories you create. Make it a habit, not a
   project.
2. Run the full LINDDUN table on Screening. Find at least one Detecting threat and one
   Linking threat.
3. For the Detecting threat, propose a schema change — not an access-control change.
4. Decide, in writing, which of the seven methods you will routinely use and which you
   will never use. Justify both lists.

---

# PART 3 — RISK

## Chapter 8: Risk, quantified

You cannot fix everything, so you rank. Ranking badly is worse than not ranking, because
it launders a guess into a decision.

### The qualitative matrix, and its failure modes

```
                        IMPACT
              Low      Medium      High
         ┌─────────┬─────────┬─────────┐
    High │  Medium │  High   │Critical │
L   ─────┼─────────┼─────────┼─────────┤
I  Medium│  Low    │  Medium │  High   │
K   ─────┼─────────┼─────────┼─────────┤
E    Low │  Low    │  Low    │  Medium │
         └─────────┴─────────┴─────────┘
```

Fast, communicates well, and wrong in three specific ways you must know about:

1. **Range compression.** "High impact" covers both a €5,000 loss and the end of the
   organisation. Collapsing a 1000× difference into one word destroys the information
   you needed.
2. **Everything becomes High.** With no definitions, every owner argues their risk is
   high. Define the bands numerically or the matrix is theatre.
3. **It cannot be summed.** Four Mediums might matter more than one Critical, and the
   matrix cannot express that. You cannot add words.

So define the bands, always, and in your own units:

| Band | Likelihood (per year) | Impact |
|---|---|---|
| Low | < 10% | < €500 and no personal data |
| Medium | 10–50% | < €5,000 or internal data exposed |
| High | 50–90% | legal notification required, or > €5,000 |
| Critical | > 90% or **has happened** | special-category data exposed, or project ends |

Now "the September incident" scores Critical on likelihood by definition — it happened —
and Critical on impact, because special-category data was within reach of the exfiltrated
credentials. The matrix stops being an opinion.

### Quantitative risk — the three numbers

When a decision involves real money, use numbers. The classic form (NIST SP 800-30):

```
SLE (Single Loss Expectancy)   = Asset Value × Exposure Factor
ARO (Annual Rate of Occurrence) = how many times per year
ALE (Annualised Loss Expectancy) = SLE × ARO
```

Worked, for the real decision in front of you — a password manager and MFA rollout:

```
RISK: credential theft from the developer laptop leads to production compromise

Asset value (AV):     Imboni + Screening production data
                      incident response ...................  €2,000
                      regulatory notification + fines ......  €8,000
                      lost school contracts (2 of 9) .......  €6,000
                      rebuild and rotation time (80h) ......  €2,000
                      AV ................................... €18,000

Exposure factor (EF): 60% — credentials reach prod but backups survive
SLE = 18,000 × 0.60 = €10,800

ARO before controls:  1.0  (it happened once in the last 13 months)
ALE before          = 10,800 × 1.0 = €10,800 / year

ARO after MFA + password manager + no plaintext .env:
                      0.15  (phishing-resistant second factor on every admin path)
ALE after           = 10,800 × 0.15 = €1,620 / year

Annual benefit      = 10,800 − 1,620 = €9,180
Annual cost         = password manager €40 + hardware keys €100 (amortised €35)
                      + 12h of your time (€300) = €375

ROI                 = 9,180 / 375 = 24×
```

A 24× return. Two observations about this calculation that matter more than its result:

**The numbers are estimates and that is fine.** The purpose is not precision, it is
making the reasoning visible and arguable. Someone can dispute EF = 0.60; nobody can
dispute "security is important". A number you can argue with beats a feeling you cannot.

**Run the same arithmetic on the control you were about to buy instead.** The discipline
is comparative. A WAF at €200/month would have had no effect whatsoever on the September
incident — ALE unchanged, ROI zero. Quantification is how you notice that before you pay.

### FAIR, briefly

Factor Analysis of Information Risk decomposes those estimates further — loss event
frequency into threat event frequency × vulnerability, and loss magnitude into primary
and secondary loss — and uses **distributions rather than point estimates**, run through
a Monte Carlo simulation to produce a loss curve instead of a single number.

Worth knowing it exists; worth adopting when you are presenting risk to people who
control budgets and will ask "how confident are you in €10,800?" For now, ALE with
honest ranges is the right level of effort.

### Risk treatment — the four options

Every risk gets exactly one, and the fourth is a real choice, not a failure:

| Treatment | Means | Example |
|---|---|---|
| **Mitigate** | reduce likelihood or impact | MFA; patching; least privilege |
| **Transfer** | someone else carries the loss | cyber insurance; managed hosting |
| **Avoid** | stop doing the risky thing | **stop installing cracked games**; don't collect the field |
| **Accept** | document and live with it | nation-state adversary; SMTP provider breach |

**Avoid** is the most underused and the cheapest. Data you never collect cannot leak.
A feature you do not ship has no vulnerabilities. The strongest control in this entire
curriculum is not a control — it is not having the exposure.

And the honest line, since this file is partly about your own incident: the single
highest-ROI action available to you is in the Avoid row, it costs nothing, and it is the
one you have declined. That is a legitimate decision — risk acceptance is a valid
treatment — but it should be *recorded as an accepted risk*, with the ALE next to it,
rather than left unexamined. That is the difference between a decision and a habit.

### The risk register

One table, maintained, reviewed quarterly. This is the artefact.

| ID | Risk | L | I | Score | Treatment | Owner | Review | Status |
|---|---|---|---|---|---|---|---|---|
| R1 | Plaintext `.env` secrets stolen by malware | Critical | Critical | **16** | Mitigate — rotate all; move to a manager | you | Oct 2026 | **open, overdue** |
| R2 | IDOR exposes another family's child | High | High | 9 | Mitigate — central object authorisation + tests | you | Nov 2026 | open |
| R3 | Developer laptop reinfected via cracked software | High | Critical | 12 | **Accepted** — see note | you | Jan 2027 | accepted |
| R4 | SSH key `ahl_root_breakglass` compromised | Medium | Critical | 8 | Mitigate — rotate, passphrase, short-lived certs | you | Oct 2026 | open |
| R5 | SMTP provider breach reads parent mail | Low | Medium | 2 | Accept | you | Jan 2027 | accepted |
| R6 | Targeted attack by a hostile parent | Medium | Critical | 8 | Mitigate — custody-scoped authz + audit | you | Nov 2026 | **not started** |
| R7 | Nation-state adversary | Very low | Critical | 2 | Accept | you | — | accepted |

R6 is the one with no technical glamour and the highest human stakes. It is also the only
row that protects a specific child from physical harm, and it is not started.

### Practice

1. Build the register for one project. Every row gets one of the four treatments. No row
   gets "monitor" — that is not a treatment.
2. Compute ALE for your top three risks. Show the arithmetic.
3. Compute the ALE change for a control you already implemented. Was it worth it?
4. Find one risk you can **Avoid** entirely by deleting a feature or a column.
5. Write R3's acceptance note properly: what you are accepting, the ALE, the compensating
   controls, and the date you will reconsider.

---

## Chapter 9: Scoring vulnerabilities

A CVE arrives in your dependency tree every week. The skill is deciding which of them
means working tonight and which means next sprint. Four systems, used together.

### CVSS — severity, not priority

The Common Vulnerability Scoring System, v4.0 since November 2023, gives a 0–10 score
across four metric groups:

| Group | Contains | Who sets it |
|---|---|---|
| **Base** | exploitability (attack vector, complexity, privileges, interaction) + impact on the vulnerable system + impact on **subsequent** systems | the vendor / CNA |
| **Threat** | is exploit code available? is it being exploited? | updated over time |
| **Environmental** | does *your* deployment change the impact? | **you** |
| **Supplemental** | automatable, recovery, safety, urgency — informational | the vendor |

v4 is explicit about naming, which the industry gets wrong constantly:

```
CVSS-B     Base only                      ← what a news headline means by "9.8 critical"
CVSS-BT    Base + Threat
CVSS-BE    Base + Environmental
CVSS-BTE   Base + Threat + Environmental  ← the only one that is about YOU
```

**The critical misunderstanding:** a published CVSS score is almost always CVSS-B, and
CVSS-B deliberately assumes the worst case for everyone. It knows nothing about whether
you use the affected function, whether the component is internet-facing, or whether
exploit code exists. Patching strictly in CVSS-B order is how teams spend a weekend on a
9.8 in a dev-only dependency while a 6.5 in their public login path is actively exploited.

> **CVSS measures severity. It does not measure your priority.** Treat a published score
> as one input of four.

### EPSS — probability, the input people miss

The Exploit Prediction Scoring System gives the probability that a CVE will be
**exploited in the wild in the next 30 days**, from 0 to 1, updated daily from real
attack telemetry.

This reframes triage completely, because the distributions are wildly different:

```
CVE-A:  CVSS 9.8   EPSS 0.00012   → terrifying on paper, nobody is using it
CVE-B:  CVSS 6.5   EPSS 0.89      → unglamorous, being exploited right now
```

Patch CVE-B first. Always. The vast majority of published CVEs are never exploited at
all; a small minority account for nearly all real-world attacks. EPSS is how you find
that minority, and it is free:

```bash
# Purpose: get the current exploitation probability for a CVE from the public
# EPSS API. No key required.
curl -s "https://api.first.org/data/v1/epss?cve=CVE-2024-3094" | python -m json.tool
```

```python
# Purpose: rank a list of CVEs by exploitation probability rather than by CVSS,
# so the patch queue reflects what is actually being attacked.
import urllib.request, json

def epss_scores(cves):
    url = "https://api.first.org/data/v1/epss?cve=" + ",".join(cves)
    with urllib.request.urlopen(url, timeout=10) as r:
        data = json.load(r)["data"]
    return {d["cve"]: float(d["epss"]) for d in data}

queue = ["CVE-2024-3094", "CVE-2021-44228", "CVE-2023-4863"]
for cve, p in sorted(epss_scores(queue).items(), key=lambda kv: -kv[1]):
    print(f"{cve:20s} P(exploit within 30d) = {p:.2%}")
```

### CISA KEV — certainty beats probability

The Known Exploited Vulnerabilities catalogue lists CVEs with **confirmed** in-the-wild
exploitation. EPSS is a forecast; KEV is an observation.

```bash
# Purpose: check whether a CVE is on CISA's confirmed-exploited list. Presence here
# overrides every other signal - this is not a forecast, it is a fact.
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \
  | python -c "import sys,json; d=json.load(sys.stdin); \
    print([v['cveID'] for v in d['vulnerabilities'] if v['cveID']=='CVE-2021-44228'])"
```

**If it is on KEV and you are affected, you are already late.** No further analysis is
required.

### SSVC — the decision tree

Stakeholder-Specific Vulnerability Categorization (CERT/CC) skips scoring and goes
straight to a decision, which is what you actually wanted. Four outcomes:

```
Exploitation?  ──none──────▶ Automatable? ──no──▶ Mission impact? ──low──▶  DEFER
               ──poc───────▶                                        ──high─▶ SCHEDULED
               ──active────▶ Exposure? ──open──▶ Mission impact? ──high──▶  IMMEDIATE
                                                                  ──low───▶  OUT-OF-CYCLE
```

| Outcome | Means |
|---|---|
| **Defer** | do nothing now; revisit at the next review |
| **Scheduled** | fix in the normal release cycle |
| **Out-of-cycle** | fix sooner than the normal cycle, not tonight |
| **Immediate** | stop other work; emergency change |

### The four combined — a real triage

This is the procedure. Run it on every advisory.

```
1. Am I actually affected?      Is the vulnerable version installed, AND is the
                                vulnerable code path reachable from my code?
                                → most advisories die here
2. Is it on CISA KEV?           Yes → IMMEDIATE. Stop reading.
3. What is the EPSS score?      > 0.10 → treat as active exploitation
4. What is my CVSS-BTE?         Adjust the base score for MY deployment
5. SSVC decision                Defer / Scheduled / Out-of-cycle / Immediate
```

Worked on three real advisories against your stack:

| Advisory | Affected? | KEV | EPSS | Exposure | Decision |
|---|---|---|---|---|---|
| `pillow` RCE, CVSS 9.8 | yes — Screening resizes uploaded photos | no | 0.004 | **user-uploaded images reach it** | **Out-of-cycle** — reachable with attacker-controlled input |
| `django` SQLi in `QuerySet.explain()`, CVSS 8.8 | installed, but you never call it | no | 0.001 | unreachable | **Scheduled** — patch at next release |
| `log4j` CVSS 10.0 | **not affected** — no Java anywhere | yes | 0.97 | n/a | **Defer** — not applicable |

Notice the inversions. The 9.8 that nobody is exploiting outranks the 8.8, because *your*
code passes attacker-controlled bytes into it. The 10.0 on KEV with 97% exploitation
probability is correctly ignored, because step 1 says you are not affected. **Step 1
eliminates more work than the other four combined, and it is the step people skip.**

```bash
# Purpose: find out whether you are affected at all, before any scoring. Checks the
# installed version and whether anything in your code calls into the package.
pip list 2>/dev/null | grep -i pillow
grep -rn "from PIL\|import PIL" --include="*.py" . | head
pip install pip-audit && pip-audit            # resolves your lockfile against advisories
```

### Advanced: reachability, the next step up

`pip-audit` and `npm audit` answer "is a vulnerable version present?". The expensive
question is "is the vulnerable *function* reachable from my entry points?" — and that is
what reduces a 40-advisory report to the three that matter.

Tools that attempt it (see `../TOOLKIT.md`): `osv-scanner` with call analysis,
Semgrep Supply Chain, Snyk reachability. None are perfect; all beat version matching.

The cheap manual version, which is usually enough:

```bash
# Purpose: decide reachability by hand. Find the vulnerable symbol named in the
# advisory, then check whether any of your code reaches it.
grep -rn "ImageFont\|truetype" --include="*.py" .     # the symbol from the advisory
# Nothing? You are probably not affected. Record that reasoning in the ticket -
# the next person should not have to redo it.
```

Recording the reasoning is the part that compounds. An advisory you dismissed with a
written justification stays dismissed; one you dismissed silently gets re-triaged every
quarter forever.

### Practice

1. Run `pip-audit` on both projects. For every finding, complete all five triage steps
   and record the SSVC decision with its justification.
2. Take the highest CVSS finding and determine reachability by hand. Was it reachable?
3. Pull EPSS scores for everything `pip-audit` reported and re-sort. How different is the
   order from the CVSS order?
4. Write a script that fails CI when any dependency is on CISA KEV. That is a rule with
   no false positives.
5. Find one advisory you can dismiss at step 1 and write the one-paragraph justification
   a reviewer would accept.

---

# PART 4 — THE PRINCIPLES

## Chapter 10: Saltzer and Schroeder's eight principles

In 1975, Jerome Saltzer and Michael Schroeder published eight design principles for
protection mechanisms. Every one still applies, every one is still violated daily, and
knowing them is the difference between reasoning from principle and copying
configurations.

Learn these eight. They are the most durable content in this curriculum.

### 1. Economy of mechanism

> Keep the design as simple and small as possible.

Security code must be *verifiable*, and complexity defeats verification. Every branch is
a place a bug hides.

```python
# Purpose: WRONG. Four code paths, three ways to be authorised, and the third
# condition silently grants access to any staff member in any school.
def can_view(user, student):
    if user.is_superuser:
        return True
    if user.role == "teacher" and student.school_id == user.school_id:
        return True
    if user.is_staff:                      # ← no school check. Cross-tenant leak.
        return True
    if user.role == "parent":
        return student.id in [c.id for c in user.children.all()]
    return False

# Purpose: RIGHT. One rule, expressed as a queryset, so there is exactly one place
# to audit and the database enforces it.
def visible_students(user):
    qs = Student.objects.all()
    if user.is_superuser:
        return qs
    qs = qs.filter(school_id=user.school_id)         # tenancy, always
    if user.role == "parent":
        qs = qs.filter(guardianships__guardian=user) # ownership, for parents
    return qs
```

The second version is also *reusable* — list views, detail views, exports and the admin
all call the same function. The first version gets copy-pasted and diverges. **Fewer
places to be right.**

### 2. Fail-safe defaults

> Base access decisions on permission, not exclusion. The default is deny.

```python
# Purpose: WRONG. Default-allow. A new role, or a typo in a role name, grants access.
def can_edit(user, obj):
    if user.role == "guest":
        return False
    return True

# Purpose: RIGHT. Default-deny. An unrecognised role is refused, which is the
# correct behaviour for a case the author did not anticipate.
EDITORS = {"teacher", "head_teacher", "admin"}

def can_edit(user, obj):
    return user.role in EDITORS and obj.school_id == user.school_id
```

The generalisation reaches far beyond code: firewall rules deny by default and allow
named traffic; S3 buckets are private until published; a new user has no permissions
until granted. **When a system meets a case its author did not consider, it should refuse.**

This is also why the invitation fix in Chapter 4 returns one error for three distinct
failure modes. Unanticipated state → refuse.

### 3. Complete mediation

> Every access to every object must be checked. No caching of authorisation decisions.

The principle that `visible_students()` above actually implements, and the one broken
most often.

```python
# Purpose: WRONG. Mediation happens in the list view only. The detail view trusts
# that a user who got here must be allowed - and ID-guessing bypasses it entirely.
def student_list(request):
    return render(request, "list.html",
                  {"students": visible_students(request.user)})

def student_detail(request, pk):
    return render(request, "detail.html",
                  {"student": Student.objects.get(pk=pk)})   # ← IDOR

# Purpose: RIGHT. Mediation at every access, derived from the same single rule.
# A guessed ID produces 404 because the object is not in the user's queryset.
def student_detail(request, pk):
    student = get_object_or_404(visible_students(request.user), pk=pk)
    return render(request, "detail.html", {"student": student})
```

"Every access" includes the ones you forget: API endpoints, CSV exports, the Django
admin, GraphQL resolvers, background Celery tasks, PDF renderers, and websocket
messages. Each is an access path, and each needs the same mediation.

The deeper form: **enforce it where it cannot be bypassed.** Application-level checks
are bypassed by a direct database connection or a forgotten endpoint. Row-level security
in Postgres cannot be:

```sql
-- Purpose: make tenancy impossible to bypass by enforcing it in the database
-- rather than in every view. Even a raw query obeys it.
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON students
  USING (school_id = current_setting('app.current_school_id')::int);
```

### 4. Open design

> Security must not depend on the secrecy of the design, only on the secrecy of keys.

Kerckhoffs's principle, 1883. The algorithm is public; the key is secret. A system whose
security rests on nobody knowing how it works is already broken — they will find out, and
then you have nothing.

```python
# Purpose: WRONG. Security by obscurity. Reversible by anyone who notices the pattern,
# and there is no key to rotate when they do.
def make_token(user_id):
    return base64.b64encode(f"user:{user_id}:secret99".encode()).decode()

# Purpose: RIGHT. The algorithm is public and documented. Security comes from a key
# that can be rotated, and the tag is verified in constant time.
import hmac, hashlib, secrets

def make_token(user_id: int, key: bytes) -> str:
    nonce = secrets.token_urlsafe(16)
    msg = f"{user_id}:{nonce}"
    tag = hmac.new(key, msg.encode(), hashlib.sha256).hexdigest()[:32]
    return f"{msg}:{tag}"

def verify_token(token: str, key: bytes) -> int | None:
    try:
        user_id, nonce, tag = token.rsplit(":", 2)
    except ValueError:
        return None
    expected = hmac.new(key, f"{user_id}:{nonce}".encode(),
                        hashlib.sha256).hexdigest()[:32]
    if not hmac.compare_digest(tag, expected):   # constant time - see Chapter 2 note
        return None
    return int(user_id)
```

`hmac.compare_digest` rather than `==` is not decoration. `==` returns as soon as bytes
differ, so the time it takes leaks how many leading bytes were correct, and an attacker
forges the tag one byte at a time. This is a **timing side channel**, and it is the
canonical example of why you do not write your own crypto primitives — covered properly
in `03-CRYPTOGRAPHY_ESSENTIALS.md`.

Note what open design does *not* mean: it does not mean publishing your architecture. Not
advertising your Postgres version is sensible friction. It means your security must not
*depend* on that friction.

### 5. Separation of privilege

> Require more than one condition to grant access.

Two keys for the missile silo. Two signatures on the large payment. MFA is exactly this
principle: something you know *and* something you have.

```
Single privilege:   password                            → one theft = full access
Separated:          password + hardware key            → phishing alone is not enough
Separated:          deploy requires PR approval + CI   → one compromised account cannot ship
```

For you concretely: production deployment currently requires one SSH key on one laptop.
That is a single condition, and in September that condition was in an attacker's hands.
Separated would be a signed commit **plus** a CI pipeline **plus** a deploy key that does
not exist on your laptop at all.

### 6. Least privilege

> Every program and user operates with the minimum privileges necessary.

The principle with the best cost-to-benefit ratio in security, because it converts a
compromise into an inconvenience.

```sql
-- Purpose: WRONG. What most Django projects actually run as. A SQL injection or a
-- compromised process can drop every table and create new superusers.
CREATE USER imboni WITH SUPERUSER PASSWORD '...';

-- Purpose: RIGHT. The application can read and write its own rows and nothing else.
-- No DDL, no role creation, no access to other schemas.
CREATE USER imboni_app WITH PASSWORD '...';
GRANT CONNECT ON DATABASE imboni_prod TO imboni_app;
GRANT USAGE ON SCHEMA public TO imboni_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO imboni_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO imboni_app;
REVOKE CREATE ON SCHEMA public FROM imboni_app;

-- Purpose: migrations need DDL, so they get a SEPARATE user used only by the
-- migration job - never by the running application.
CREATE USER imboni_migrate WITH PASSWORD '...';
GRANT ALL ON SCHEMA public TO imboni_migrate;
```

```bash
# Purpose: check what your database user can actually do, rather than assuming.
psql -U imboni_app -d imboni_prod -c "SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;"
psql -U imboni_app -d imboni_prod -c "DROP TABLE IF EXISTS canary_test;"   # must fail
```

The same principle, applied to the four places it is routinely violated in your stack:

| Thing | Probably has | Needs |
|---|---|---|
| Django DB user | superuser | CRUD on its own tables |
| Celery worker | same credentials as the web app | a subset — often read-only plus one table |
| API tokens | no expiry, full scope | scoped, short-lived, rotatable |
| Your Windows account | local Administrator (confirmed in September) | standard user, with a separate admin account |

That last row is the one that mattered. A standard user account would not have stopped
the infostealer reading your `.env` files — those are yours to read — but it would have
stopped the scheduled task being written where it was, and it would have stopped the
self-protecting ACL that made the process unkillable. **Running as Administrator turned a
user-level compromise into a system-level one.**

### 7. Least common mechanism

> Minimise mechanisms shared by more than one user, especially across trust levels.

Shared mechanisms are channels between users who should not be able to reach each other.

Concrete violations you can look for today:

- **One shared cache keyed without a tenant prefix** — `cache.get(f"stats:{class_id}")`
  serves school A's numbers to school B if `class_id` ever collides. Prefix every key with
  the tenant.
- **One Celery queue for all tenants** — a tenant that floods the queue denies service to
  the rest. One noisy school starves eight others.
- **One connection pool** — a slow tenant exhausts it for everyone.
- **One `/tmp` for all users** — Chapter 5's PDF problem, exactly.
- **One database for all tenants** — the pragmatic choice, but it makes a single missing
  `WHERE school_id = …` a cross-tenant breach rather than a bug. See
  `../../engineering-curriculum/06-system-design/04-MULTI_TENANCY_GUIDE.md`.

### 8. Psychological acceptability

> If the mechanism is painful, users will defeat it, and the system is less secure than
> if it were weaker.

The most ignored principle and the most consequential, because it explains nearly every
security failure that gets blamed on users.

| Control | What users do | Net effect |
|---|---|---|
| 90-day forced rotation | `Summer2026!` → `Summer2026!!` | **worse** — predictable patterns, no real entropy |
| 16-character complexity rules | written on a note under the keyboard | worse |
| MFA on every single action | shared TOTP seeds between colleagues | worse |
| A VPN that breaks video calls | disabled whenever it matters | worse |
| Passkeys | nothing to remember, cannot be phished | **better** |
| A password manager | long unique passwords, no memory required | **better** |

Note that the two that work are the two that are *easier* than the insecure behaviour.
That is the design target: **make the secure path the path of least resistance**, not the
path of greatest virtue.

NIST's own guidance moved this way years ago — stop forcing periodic rotation, stop
composition rules, check against breached-password lists instead, and allow long
passphrases and paste. If a control relies on users being disciplined forever, it is a
control that has already failed.

### Practice

1. For each of the eight principles, find one violation in your own code or
   configuration. All eight exist. Write the line number.
2. Fix the least-privilege violation on the database today. Run the canary `DROP TABLE`
   and show it failing.
3. Find a complete-mediation gap: an endpoint that returns an object without filtering
   by the requesting user. Write the `curl` that proves it.
4. Find a least-common-mechanism violation in your caching. Fix the key prefix.
5. Identify one control in your life you routinely work around. Redesign it so the secure
   path is the easy one.

---

## Chapter 11: Defence in depth, and the layer audit

Assume every control fails, because eventually one does. Layers mean a single failure is
not a breach.

### The layered view, concretely

Imboni's student records, as a defender should see them:

| # | Layer | Control | If this is the only failure |
|---|---|---|---|
| 1 | Network | Postgres bound to localhost, no public port | attacker must reach the app |
| 2 | Transport | TLS, HSTS, `sslmode=verify-full` | traffic is readable, data still needs auth |
| 3 | Authentication | login required, MFA for staff | attacker needs credentials |
| 4 | Authorisation | `visible_students()` on every access | **this is the one that fails silently** |
| 5 | Data | row-level security, DB constraints | app bug does not become a breach |
| 6 | Audit | append-only access log, shipped off-box | you can answer "what was taken?" |
| 7 | Encryption at rest | disk and backup encryption | stolen media is not a breach |
| 8 | Monitoring | alert on anomalous access volume | you find out in hours, not months |

Miss layer 4 and layers 1–3 and 5 still stand. That is the whole point: a flat system has
one wall, and when it goes everything goes.

### Where defence in depth is misunderstood

**It is not "buy more products".** Three WAFs are not three layers; they are one layer
with three vendors, and they fail to the same bypass. Layers must be **different kinds**
of control at **different places** — network, then identity, then application, then data.

**It is not an excuse for a weak layer.** "The WAF will catch it" is how SQL injection
ships. Each layer should be as strong as if it were the only one.

**Detection is a layer.** The one people omit, and the one that converts a catastrophe
into an incident. In September layers 1–7 were irrelevant — the attacker had your
credentials — and layer 8 did not exist, which is why the first notification came from
Anthropic rather than from you.

### How to audit your layers — step by step

1. Pick your most sensitive asset. One table.
2. List every path to it, including the admin, the CSV export, the backup, and the
   developer laptop.
3. For each path, name the controls in order.
4. For each control, ask: **if only this one failed, would the asset be exposed?**
5. Any "yes" is a single point of failure. That is your work queue.

Run it on the September path and the answer arrives immediately:

```
PATH:   developer laptop → SSH key → production server → Postgres → every record
LAYERS: 1. laptop is malware-free            ← FAILED
        2. SSH key has a passphrase          ← held (ed25519 + passphrase)
        3. server requires key + ...         ← nothing else
        4. database requires credentials     ← in the .env the malware read
        5. records are encrypted at rest     ← key also on the server
SINGLE POINTS OF FAILURE: layer 1. Everything after it was reachable from the laptop.
```

The passphrase on the SSH key is the only reason this is a scare rather than a
catastrophe. That one control — a passphrase you typed months earlier — did the entire
job of layers 2 through 5.

### Practice

1. Run the five-step audit on Screening's response table. Find every path, including the
   ones that are not web requests.
2. Identify every single point of failure. Rank by effort to fix.
3. Add one layer where you currently have none. Prefer detection — it is cheapest and you
   have zero.
4. Write down which layer saved you in September and what would have happened without it.

---

## Chapter 12: Zero trust, honestly

The most oversold term in security, built on a genuinely correct idea.

### The idea

The old model was a perimeter: a hard shell, a soft interior, and "inside the network"
treated as a proxy for "trusted". It fails for three reasons that are all now permanent
— remote work means there is no inside, cloud means your data is not in your building,
and an attacker who phishes one laptop is *already* inside.

Zero trust replaces location-based trust with per-request verification. NIST SP 800-207
is the authoritative description, and its core tenets compress to:

1. **No implicit trust from network location.** Being on the VPN proves nothing.
2. **Verify every request** — identity, device, context — not just at login.
3. **Least privilege, per resource**, not per network segment.
4. **Assume breach.** Design as though an attacker is already inside, because they are.
5. **Monitor everything.** Continuous verification, not a one-time gate.

Google's BeyondCorp is the canonical implementation: employees have no VPN, every
internal application is published to the internet behind an identity-aware proxy that
checks user, device posture and context on every single request.

### What it means at your scale

Most zero-trust marketing describes a seven-figure programme. Four tenets map onto a
one-developer project for nearly nothing:

| Tenet | At your scale | Cost |
|---|---|---|
| No network-based trust | Celery payloads and internal API calls are validated like user input — a poisoned task is attacker input | hours |
| Verify every request | `visible_students()` on every access, not once per session | already doing it |
| Least privilege per resource | scoped DB users; scoped API tokens; no standing admin | a day |
| Assume breach | secrets rotate on a schedule; audit logs exist; backups are tested restorable | ongoing |

And the honest part: **the biggest zero-trust gap in your stack is the laptop.** In a
zero-trust model, device posture is an input to every authorisation decision — an
unmanaged machine running unknown software does not get a production credential at all.
You have the opposite: the least-controlled device in your environment holds standing
credentials for everything.

The practical version of that insight does not require a product:

- Production secrets do not live on the laptop; deploys happen from CI
- The deploy credential is short-lived and issued per-run
- Admin access is time-boxed and requested, not standing
- You can revoke everything the laptop holds in under five minutes, and you have
  practised doing it

That last bullet is a *drill*, not a control, and it is the one that would have changed
September most.

### Practice

1. List every standing credential on your laptop. For each: what would break if it were
   revoked right now?
2. Pick one and move it to CI so the laptop no longer holds it.
3. Write the revoke-everything runbook. Time yourself executing it in a test environment.
4. Treat a Celery payload as untrusted input: find one task that would misbehave on a
   malformed or hostile payload.

---

## Chapter 13: Attack surface and blast radius

Two measurements that turn "be more secure" into something you can act on.

### Attack surface

Every point an attacker can interact with. Reducing it is the cheapest control that
exists, because removed code has no vulnerabilities, needs no patching and costs nothing
to maintain.

```bash
# Purpose: enumerate the HTTP attack surface of a Django project - every URL pattern
# that can receive a request.
python manage.py show_urls 2>/dev/null | wc -l       # django-extensions
grep -rn "path(\|re_path(" --include="urls.py" . | wc -l

# Purpose: enumerate the network attack surface - what is actually listening, and on
# which interface. 0.0.0.0 means the internet; 127.0.0.1 means localhost only.
ss -tlnp 2>/dev/null || netstat -ano | grep LISTEN

# Purpose: enumerate the dependency attack surface - code you did not write but ship.
pip list --format=freeze | wc -l
npm ls --all --parseable 2>/dev/null | wc -l
```

Four questions that reduce it:

1. **Is this endpoint used?** Delete unused ones. Check your access logs for routes with
   zero hits in 90 days.
2. **Is this port public?** Bind to `127.0.0.1` unless it must be reachable.
3. **Is this dependency needed?** Each one is code you ship and do not read.
4. **Is this field collected?** Data you do not hold cannot leak. This is the Avoid
   treatment from Chapter 8.

That last is worth dwelling on, because it is the one engineers resist. Every optional
field on a form is permanent liability. For special-category data, a field you collect
"in case it is useful later" is a legal obligation you took on for a hypothetical.

### Blast radius

If this component is fully compromised, what else goes?

```
Compromise the Django process  →  DB credentials, all student data, SMTP, session keys
Compromise the Celery worker   →  the same, if it shares .env       ← fixable
Compromise one API token       →  everything that token can reach   ← scope it
Compromise the laptop          →  EVERYTHING                        ← happened
Compromise one tenant's data   →  all tenants, if WHERE is missing  ← RLS fixes this
```

Blast radius is reduced by **compartmentalisation**: separate credentials per component,
separate per tenant where feasible, scoped tokens, and no credential that grants more
than its holder needs.

The question to ask of any new component: *"when this is compromised — not if — what is
the complete list of what the attacker gets?"* If the answer is "everything", that is the
design finding, before any code is written.

### Practice

1. Count your three attack surfaces with the commands above. Write the numbers down.
2. Find and delete one unused endpoint and one unused dependency this week.
3. Draw the blast radius for every credential in your `.env`. Which has the widest?
4. Reduce one blast radius: give Celery its own database user with fewer grants.
5. Find one data field you collect and do not use. Delete the column and the form field.

---

# PART 5 — THE ADVERSARY'S VIEW

## Chapter 14: The attacker mindset, trained

Developers ask "how do I make this work?" Attackers ask "what happens if I do something
you did not plan for?" Same skill, pointed differently — and it is trainable.

### The input checklist

Run this against every input your system accepts. Mechanically, until it is instinct.

| Ask | Why it breaks things |
|---|---|
| Empty? | unhandled `None`, division by zero, an empty `WHERE IN ()` |
| Enormous? | 10MB in a text field → memory, DoS, truncation mid-UTF-8 |
| Negative? Zero? | `quantity = -5` credits the account; `-1` indexes from the end |
| Someone else's ID? | **IDOR — the most common serious web bug** |
| Twice, simultaneously? | race conditions, double-spend, double-redeem |
| Step 3 without 1 and 2? | state-machine bypass — pay-step skipped |
| Wrong type? | a list where a string is expected, `{}` where a scalar is |
| Contains the delimiter? | CSV injection, log injection, header injection |
| Unicode tricks? | `İ`.lower() ≠ `i`; RTL override hides a file extension |
| Null byte? | `file.php\x00.jpg` passes an extension check, executes as PHP |
| Very slow? | Slowloris; a hanging webhook holding a worker |
| From an unexpected place? | CSRF, SSRF, a webhook you did not verify |

### Injection is one idea in six contexts

The unification that makes the whole class memorable:

> **Injection is data being interpreted as instructions.**

| Context | Data becomes | Structural fix |
|---|---|---|
| SQL | part of the query | parameterised statements |
| HTML | part of the markup | contextual auto-escaping |
| Shell | part of the command | argument arrays, never a string |
| LDAP / XPath | part of the filter | parameterised APIs |
| Templates | part of the template | never build templates from input |
| **LLM prompt** | part of the instruction | **no structural fix exists yet** |

```python
# Purpose: WRONG. The filename becomes part of a shell command, so a filename
# containing a semicolon runs a second command.
os.system(f"convert {filename} -resize 200x200 thumb.jpg")

# Purpose: RIGHT. The argument list is passed to execve directly. No shell parses
# it, so shell metacharacters are inert bytes.
subprocess.run(["convert", filename, "-resize", "200x200", "thumb.jpg"],
               check=True, timeout=30)
```

The last row of that table is the open problem of 2026. Prompt injection has no
parameterisation equivalent, because an LLM has one channel for instructions and data
both. Every mitigation is probabilistic. Treated properly in
`../../data-science-ml/05-nlp-llms/06-LLM_SECURITY.md`, and worth internalising now:
**an LLM's output is untrusted input to whatever consumes it.**

### Race conditions and TOCTOU

Time-of-check to time-of-use: the gap between verifying something and acting on it.

```python
# Purpose: WRONG. Two concurrent requests both read balance=100, both pass the
# check, and both withdraw. TOCTOU - the state changed between check and use.
account = Account.objects.get(pk=pk)
if account.balance >= amount:
    account.balance -= amount
    account.save()

# Purpose: RIGHT (a). The database holds a row lock for the duration of the
# transaction, so the second request waits and then re-reads the true balance.
with transaction.atomic():
    account = Account.objects.select_for_update().get(pk=pk)
    if account.balance >= amount:
        account.balance -= amount
        account.save()

# Purpose: RIGHT (b). Better still - make the check and the update one atomic
# statement with no application-side window at all.
updated = Account.objects.filter(pk=pk, balance__gte=amount) \
                         .update(balance=F("balance") - amount)
if not updated:
    raise InsufficientFunds
```

Where to look for these: anything with a balance or a quota, single-use tokens, "claim
this slot" features, idempotency of payment webhooks, and any `get` followed by a `save`.

```bash
# Purpose: find candidate TOCTOU bugs - a read, a conditional, then a write, with
# no transaction or lock in between.
grep -rn -A6 "objects.get(" --include="*.py" . | grep -B3 "\.save()" | head -40
```

### Business logic abuse

The attacks no scanner finds, because nothing is technically malformed. Every request is
valid; the *sequence* is not.

```
Sequence abuse:  add to cart → apply discount → remove item → discount persists
Numeric abuse:   quantity = -1 → refund
Timing abuse:    cancel after delivery, within the refund window
Identity abuse:  change email to a victim's, then trigger a password reset
Workflow abuse:  submit the attendance form for a date in the past, after reports ran
Quota abuse:     one free trial per email → infinite via user+1@gmail.com
```

For Imboni specifically, three worth testing today:

- Submit attendance for a **past** date, after reports were generated. Is history
  mutable? Who can tell?
- Can a parent accept an invitation for a child **already** linked to another guardian?
- Can a teacher be removed from a school while holding an active session? Does the
  session die, or does it keep working until expiry?

That third one is the authorisation-caching bug in Chapter 10's complete-mediation
section, arriving from a completely different direction.

### Practice

1. Take one endpoint and run the entire input checklist. All twelve rows. Record what
   happened for each.
2. Find a TOCTOU bug in your own code with the `grep` above and fix it the atomic way.
3. Write six abuse sequences for Imboni. Test all six. Report which worked.
4. For the LLM feature, write a prompt injection that makes it ignore its instructions.
   Then write down why no fix fully closes it.

---

## Chapter 15: How breaches actually happen

Intuition about attacks comes from films and is wrong in ways that waste money. Here is
the data, with its provenance, because a statistic without a source is a rumour.

### The 2026 picture

What changed, and what you should take from it:

- **Vulnerability exploitation overtook credential abuse as the top initial-access
  vector** in the 2026 Verizon DBIR — reported at 31% of breaches against 20% the year
  before, with credential abuse falling to 13%. The 2026 Rapid7 Global Threat Landscape
  Report puts **valid accounts without strong MFA at 43.9%** of its incident
  investigations, and Cisco Talos found phishing back as the top vector in Q1 2026.
- **Ransomware is now preceded by an infostealer** in the large majority of cases: one
  widely-cited figure is that 73% of ransomware victims had a credential-theft event in
  the preceding year.
- **The handoff is effectively instant.** Mandiant's M-Trends 2026 reports median time
  from initial-access broker to ransomware operator falling to around **22 seconds**,
  from more than eight hours in 2022.

Two caveats, stated because the standard in `../../COURSE_STANDARD.md` requires it: the
exact percentages vary between reports and several circulate mainly via vendor
aggregators, so treat the directions as solid and the decimals as indicative. Verify
against the primary reports before quoting them to anyone.

### What that means for you

The 22-second figure is the one that should change your behaviour, because it kills a
comfortable assumption. The old mental model was: credentials are stolen, they sit on a
market, eventually someone buys them, you have time to notice and rotate.

That window no longer exists. **By the time you know you were infected, the credentials
have been used.** Which inverts the priority order:

```
OLD: detect → contain → clean → rotate
NEW: assume used → ROTATE FIRST → then detect, contain, clean
```

This is exactly the lesson from your own September incident and the reason rotation
remains the overdue item in `../PROGRESS.md`. The machine was cleaned on 11 September.
The credentials that were on it have not all been rotated. The cleaning was the part that
felt like progress and was the part that mattered least.

### The commodity attack chain

```
1. You download cracked software                    ← the decision that mattered
2. The installer runs as Administrator              ← the decision that amplified it
3. An infostealer runs: browser stores, .env files, SSH keys, session cookies
4. Loot is uploaded within seconds                  ← faster than any detection you have
5. It is sold or auto-parsed on a broker market
6. Session cookies replay → MFA is bypassed entirely, because the session is already
   authenticated
7. Access is resold; a ransomware affiliate buys it
8. Lateral movement, exfiltration, encryption
```

Your incident reached step 6 and stopped there — Anthropic's Trust & Safety team detected
infostealer activity on your account and invalidated your sessions. **A third party's
detection was your only working control at step 6**, which is a precise statement of
where your monitoring gap is.

Step 6 also deserves emphasis because it is widely misunderstood: **stolen session
cookies defeat MFA.** MFA protects the *login*; a session cookie proves a login already
happened. This is why "I have 2FA on everything" was not protection, and why the only
correct response to a confirmed infostealer is to invalidate every session everywhere, not
merely change passwords.

### What is not on the list

Nothing in that chain is clever. No zero-day, no cryptanalysis, no nation-state. It is a
pirated game, an Administrator account, plaintext secrets, and an unmonitored egress path.

That is the normal shape of a real breach, and it is why Chapter 1 argued for spending in
proportion to the data rather than to the interest of the attack. The boring controls —
patching, MFA, no plaintext secrets, non-admin daily account, egress monitoring — cover
most of it, and none of them are interesting enough to be fun.

### Practice

1. For each of the eight steps, name the control you have and the control you lack.
2. For step 6, list every service where a stolen session cookie would still work today.
   Sign out of all of them, everywhere, from a different device.
3. Compute your rotation latency: for the September credentials, how long between
   detection and rotation? If any are still unrotated, that number is "ongoing".
4. Read the primary Verizon DBIR 2026 and Rapid7 reports and correct any number in this
   chapter that has moved. Then update the file.

---

# PART 6 — OPERATING

## Chapter 16: Security in the development lifecycle

Security work distributed across the cycle, because a design flaw found in review costs
a conversation and the same flaw found in production costs an incident.

| Phase | Activity | Artefact |
|---|---|---|
| Requirements | abuse cases alongside user stories | abuse cases in the ticket |
| Design | threat model (Chapters 4–7) | DFD + STRIDE table + decisions |
| Implementation | secure defaults, parameterised everything, review checklist | code |
| Build | SAST, dependency audit, secret scanning | CI gates |
| Test | authorisation tests, the input checklist | failing tests on regression |
| Deploy | hardened config, least privilege, secrets from a manager | runbook |
| Operate | logging, monitoring, patching | alerts, patch latency metric |
| Incident | detect, contain, eradicate, recover, learn | post-incident review |

The minimum viable pipeline, which costs an afternoon to set up once:

```yaml
# Purpose: the four security gates worth having in CI from day one. Each catches a
# class of problem that is expensive to find later and cheap to find here.
name: security
on: [push, pull_request]
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0                    # gitleaks needs history

      - name: Secret scanning
        uses: gitleaks/gitleaks-action@v2   # a committed secret is a rotation, not a revert

      - name: Dependency audit
        run: pip install pip-audit && pip-audit --strict

      - name: Static analysis
        run: pip install bandit && bandit -r . -ll   # -ll: medium severity and above

      - name: Authorisation tests
        run: pytest tests/test_authorization.py -v   # the class that fails silently
```

Note what is deliberately *not* in there: no vulnerability scanner that produces 400
findings nobody reads. Four gates, each with a low false-positive rate, each blocking.
A gate people routinely override is not a gate — it is a delay.

## Chapter 17: Metrics that mean something

If you cannot measure it, you cannot tell whether your effort worked.

| Metric | Measures | Target |
|---|---|---|
| **Patch latency** | days from advisory to deployed fix, by severity | KEV: 24h; critical: 7d; other: 30d |
| **MTTD** | mean time to detect | hours, not months |
| **MTTR** | mean time to respond and contain | hours |
| **Rotation latency** | detection of credential theft → rotation complete | < 4 hours |
| **Authorisation test coverage** | % of endpoints with a cross-user test | 100% of endpoints touching personal data |
| **Secret age** | oldest unrotated credential | < 90 days |
| **Audit completeness** | % of personal-data reads that are logged | 100% |

Your own numbers today, stated plainly because the standard requires honesty over
comfort:

```
MTTD (September)         ≈ 5 days, and the detection was someone else's
Rotation latency         ongoing — 29 days and counting for some credentials
Authorisation coverage   unknown; probably near 0%
Oldest secret            unknown; predates the incident
Audit completeness       0% — you cannot enumerate what was read
```

Four of those five are "unknown", and that is itself the finding. The first useful
security work is almost always measurement, because you cannot prioritise what you cannot
see.

## Chapter 18: Compliance is not security

Compliance asks "can I demonstrate I met the requirement?" Security asks "is the system
actually safe?" They overlap and they are not the same.

| | Compliance | Security |
|---|---|---|
| Driver | external requirement | actual risk |
| Output | evidence | a system that resists attack |
| Cadence | audit date | continuous |
| Failure | a finding | a breach |

Both matter, and under Law No. 058/2021 you have genuine legal obligations around
children's and health data — see `../06-governance/01-COMPLIANCE_AND_DATA_PROTECTION.md`.
But do not confuse the artefacts. A completed DPIA is not a secure system, and a secure
system with no DPIA is still non-compliant. Compliance is a **floor**, set by a regulator
who has never seen your architecture; it is never the ceiling.

## Chapter 19: The honest conclusion

The three claims from the top of the file, now defended:

**Security is a property of a design, not a layer.** Chapters 4–7 are design activities.
Chapter 10's principles are design principles. The September incident was a design
outcome: standing credentials in plaintext on an unmanaged administrator machine. No
product bolted on afterwards would have changed it.

**The attacker needs one path.** Chapter 6's attack tree makes it concrete — your security
is the cost of your cheapest path, and your cheapest path was a cracked installer.

**Most breaches are boring.** Chapter 15 is the evidence. Not one step of the chain that
actually compromised you was clever.

And the thing this file cannot do for you. You now have the vocabulary to describe what
happened in September precisely: a T1204.002 initial access leading to T1127.001
execution, T1053.005 persistence, T1555 credential access and T1041 exfiltration, against
an asset register where the highest-value asset had no controls, detected by a third
party at MTTD ≈ 5 days, with a rotation latency now measured in weeks.

That vocabulary is worth having. It is not worth as much as the rotation.

> **Read the risk register in Chapter 8 again.** R1 and R4 are marked open and overdue.
> They have been overdue since 11 September. Closing them takes an afternoon and is worth
> more than finishing this module.

---

## Exercise 1 — the module checkpoint

Guide closed. No AI. Each produces an artefact that exists afterwards.

1. **Asset register.** Build the five-column register for one project, including the
   laptop and your phone. Classify every row. (Chapter 3)

2. **Threat model.** Full DFD plus STRIDE-per-element for one feature you have shipped.
   Minimum fifteen rows, each with one of three outcomes. At least one accepted risk,
   with a reason. (Chapters 4–5)

3. **Attack tree.** One specific goal — "read a named child's address". Annotate every
   leaf with cost and detectability. Identify your minimum-cost path, and say whether it
   is technical. (Chapter 6)

4. **LINDDUN pass.** Run the seven privacy threats against Screening. You must find at
   least one *Detecting* threat and propose a **schema** change, not an access-control
   change. (Chapter 7)

5. **Risk register with arithmetic.** Seven rows minimum. ALE computed for the top three,
   showing the working. Every row gets one of the four treatments. (Chapter 8)

6. **Live triage.** Run `pip-audit` on both projects. Complete all five triage steps per
   finding. Pull real EPSS scores. Record an SSVC decision with its justification.
   (Chapter 9)

7. **Principle audit.** Find and document one violation of each of Saltzer and
   Schroeder's eight principles in your own code. File and line number for each. Fix the
   least-privilege one today and show the canary `DROP TABLE` failing. (Chapter 10)

8. **Layer audit.** Five-step audit on your most sensitive table. Every path, including
   non-web. Name every single point of failure. (Chapter 11)

9. **Attack surface count.** Run the three commands. Record the numbers. Delete one
   endpoint and one dependency. (Chapter 13)

10. **Input checklist.** All twelve rows against one real endpoint. Record what happened
    for each. Find and fix one TOCTOU bug atomically. (Chapter 14)

11. **Your own incident, mapped.** September in ATT&CK terms, from your evidence rather
    than from Chapter 6's table. For each technique: could you detect it today? The ratio
    is your coverage. (Chapter 6, 15)

12. **The metrics.** Fill in all seven rows of Chapter 17 for your own systems. Where the
    answer is "unknown", say so — that is a result.

**Automatic fail:** a threat model where every control says "yes, solved"; a risk register
with no accepted risks; an exercise answered with a tool's output instead of your
reasoning.

Exercise 11 is the one that converts this file from reading into capability, because it
is the only one where you are the incident. Exercise 4 is the one that will change a
design decision about a real child.
