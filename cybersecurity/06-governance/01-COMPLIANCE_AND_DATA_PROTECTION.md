# 10 — Compliance and Data Protection

**Week 22.** The legal layer. This is the file where security stops being an
engineering preference and becomes an obligation with a deadline and a penalty.

You are not preparing for a hypothetical future compliance need. Imboni holds
identifiable records about **children**. Screening holds **mental-health responses**.
Both are sensitive personal data under Rwandan law, and you are the controller.

---

## Table of Contents

1. [The law that applies to you](#1-the-law-that-applies-to-you)
2. [Cross-border transfer is your sharpest practical issue](#2-cross-border-transfer-is-your-sharpest-practical-issue)
3. [Children's data](#3-childrens-data)
4. [Lawful basis and the data inventory](#4-lawful-basis-and-the-data-inventory)
5. [Data subject rights](#5-data-subject-rights)
6. [Privacy by design](#6-privacy-by-design)
7. [DPIA — when the stakes are high](#7-dpia--when-the-stakes-are-high)
8. [Processors and contracts](#8-processors-and-contracts)
9. [Breach notification, operationally](#9-breach-notification-operationally)
10. [Security measures the law expects](#10-security-measures-the-law-expects)
11. [The checklist](#11-the-checklist)
12. [Exercise 10](#exercise-10)

---

## 1. The law that applies to you

**Rwanda — Law No. 058/2021** relating to the protection of personal data and privacy,
in force since October 2021, enforced by the **National Cyber Security Authority
(NCSA)**.

The parts that bind you directly:

| Obligation | What it means for you |
|---|---|
| **Lawful basis** | you need a defensible reason to hold each field |
| **Consent** | freely given, specific, informed; for a child, from a parent or guardian |
| **Purpose limitation** | data collected for attendance is not available for marketing |
| **Data minimisation** | collect what you need, not what might be useful one day |
| **Accuracy** | keep it correct; allow correction |
| **Storage limitation** | delete it when the purpose ends |
| **Security** | appropriate technical and organisational measures |
| **Registration** | controllers register with NCSA |
| **Breach notification** | **48 hours** to NCSA from awareness |
| **Cross-border transfer** | restricted; needs a basis and often authorisation |

Penalties reach substantial administrative fines, and for the most serious violations
the law provides for imprisonment. This is not a parking ticket.

**GDPR** matters to you if you ever process data of people in the EU. Its structure is
very similar — the 72-hour breach clock is the main difference you would notice.

## 2. Cross-border transfer is your sharpest practical issue

This is the one most likely to catch you out, because you have probably already done it
without noticing.

Article 48 of Law 058/2021 restricts transferring personal data outside Rwanda. Every
one of the following is a transfer:

- Hosting Imboni on a VPS in Germany or the US
- Sending data to Sentry, an analytics service, or a logging provider abroad
- Emailing via a foreign SMTP provider
- **Sending a student's free-text answer to an LLM API**

That last one is worth pausing on. If Screening ever sends a respondent's answer to a
hosted model, that is a cross-border transfer of sensitive health-adjacent data about
an identifiable person. It needs a lawful basis, it needs to be in your privacy notice,
and the processor needs a contract.

What to do: know where each processor stores data, prefer local or regional hosting for
sensitive categories, keep a written transfer record, and get authorisation where
required.

## 3. Children's data

Imboni's entire dataset is children's data, which carries additional protection
everywhere.

- Consent comes from the parent or guardian, not the child
- The privacy notice must be comprehensible — if children will read it, write it for
  them
- Minimisation is applied more strictly
- Profiling and marketing are heavily constrained
- Retention should be shorter, with deletion after the child leaves the school

Practical questions you should be able to answer today: *What happens to a student's
record when they leave? Who can see a child's attendance history — only their own
teachers, or all staff? What does a parent see about other children in a class list?*

## 4. Lawful basis and the data inventory

You cannot comply with any of this without knowing what you hold. Write the inventory
once; maintain it.

| Data | Subject | Purpose | Lawful basis | Retention | Location |
|---|---|---|---|---|---|
| Name, DOB | student | identify in roll | contract with school | 2y after leaving | RW |
| Attendance | student | statutory reporting | legal obligation | 7y | RW |
| Parent phone | guardian | notifications | consent | while enrolled | RW |
| Health notes | student | duty of care | vital interest / explicit consent | while enrolled | RW |
| Mental-health responses | respondent | the service itself | explicit consent | define this | ? |

The columns you will find hardest are **retention** and **lawful basis**, and that
difficulty is informative: a field you cannot justify is a field to delete.

## 5. Data subject rights

People can demand, and you must be able to deliver:

- **Access** — a copy of everything you hold about them
- **Rectification** — correct what is wrong
- **Erasure** — delete it, where no overriding basis applies
- **Portability** — a machine-readable export
- **Objection / restriction** — stop certain processing

Engineering implications, which is where this becomes your problem:

```python
def export_user_data(user) -> dict:
    """Everything we hold. Must include related records, not just the user row."""

def delete_user_data(user) -> None:
    """Hard delete or documented anonymisation. Must reach backups policy,
    logs, caches, analytics and any third-party processor."""
```

Three traps:

1. **Soft deletes are not deletion.** `is_deleted = True` keeps the data.
2. **Backups.** You cannot practically delete from an immutable backup — so document
   the retention window and the fact that deletion propagates as backups expire.
3. **Third parties.** If you sent it to Sentry or an email provider, erasure includes
   asking them.

Timescales are typically one month. A manual process that takes a developer two days
does not scale past the first few requests; build the export and delete functions early.

## 6. Privacy by design

Build it in; retrofitting is more expensive and usually worse:

- **Minimise.** Do not collect a national ID "in case". Every field is a liability.
- **Pseudonymise** where you can — reference a student by an internal ID in logs and
  analytics rather than by name.
- **Separate.** Keep identifying data apart from behavioural data where the design
  allows.
- **Encrypt** sensitive fields at rest, with the key held separately.
- **Default to private.** New features start closed and open deliberately.
- **Delete on a schedule**, automatically. A retention policy nobody runs is prose.

## 7. DPIA — when the stakes are high

A Data Protection Impact Assessment is required for high-risk processing, which
includes large-scale processing of sensitive data and processing about children. Both
of your projects qualify.

It is a structured document:

1. What processing, and why
2. Is it necessary and proportionate? Could you achieve this with less data?
3. What are the risks to the individuals — not to you, to **them**
4. What measures reduce those risks
5. Residual risk, and who accepted it

Write one for Imboni. It is a few pages, it is required, and it forces questions
("do we need the home address?") that produce better software.

## 8. Processors and contracts

Anyone processing data on your behalf — hosting, email, SMS, error tracking, an LLM
provider — is a **processor**, and you need a contract specifying what they may do,
their security obligations, breach notification to you, sub-processors, and deletion on
termination.

Maintain a processor register: who, what data, where, under what contract. When a
breach happens at a processor, this list is how you know who is affected. Writing it
during an incident is too late.

## 9. Breach notification, operationally

From `04-detection-and-response/01-DETECTION_AND_INCIDENT_RESPONSE.md`, with the legal detail:

- The clock starts at **awareness**, not at full understanding
- **48 hours** to NCSA (Rwanda); 72 under GDPR
- Notify affected individuals where the risk to their rights is high
- Notify even if you are still investigating — partial information on time beats
  complete information late

Have the template written now:

```
1. When we became aware, and how
2. Nature of the breach, and categories of data
3. Approximate number of individuals affected
4. Likely consequences
5. Measures taken and proposed
6. Contact point
```

## 10. Security measures the law expects

Law 058/2021 requires "appropriate technical and organisational measures". In practice
a regulator will ask whether you had:

- Access control and authentication (`01-application-security/01-AUTHENTICATION_AND_ACCESS_CONTROL.md` and `01-application-security/02-WEB_VULNERABILITIES.md`)
- Encryption in transit and at rest (`00-foundations/03-CRYPTOGRAPHY_ESSENTIALS.md`)
- Logging and the ability to detect a breach (`04-detection-and-response/01-DETECTION_AND_INCIDENT_RESPONSE.md`)
- Backups and recoverability (`02-infrastructure/01-INFRASTRUCTURE_HARDENING.md`)
- Staff awareness
- Documented policies and a named responsible person

Notice that this is the content of this entire module. Compliance is not a parallel
activity to security engineering; it is the same work, written down.

**Written down** is the part developers skip. An undocumented control is, to a
regulator, an absent control.

## 11. The checklist

- [ ] Data inventory complete, with lawful basis and retention per field
- [ ] Registered with NCSA as a controller
- [ ] Privacy notice published, in language the audience can read
- [ ] Parental consent mechanism for Imboni
- [ ] DPIA written for both projects
- [ ] Processor register, with contracts
- [ ] Cross-border transfers identified and justified — including any LLM API
- [ ] Export and delete functions implemented and tested
- [ ] Retention jobs running automatically
- [ ] Breach template written; 48-hour owner named
- [ ] Policies documented, not just implemented

---

## Exercise 10

1. Build the full data inventory for Imboni (§4 table). Every field, every table.
   Flag each one you cannot assign a lawful basis to.

2. From that list, delete the fields you cannot justify. This is the highest-value
   privacy work available to you and it takes an afternoon.

3. Write `export_user_data(user)` and `delete_user_data(user)` for Imboni, including
   related records. Test them against a real-shaped account on staging.

4. List every third party that receives personal data from either project. For each:
   what data, which country, under what contract. Identify every cross-border transfer.

5. Write the DPIA for Screening. Be honest in section 3 about risks to respondents —
   mental-health data leaking is a serious harm to a real person.

6. Write the retention policy: what is deleted, when, and by which job. Then implement
   one of those jobs.

7. Using `04-detection-and-response/01-DETECTION_AND_INCIDENT_RESPONSE.md`'s timeline of the September incident, determine whether any Imboni or
   Screening personal data was in scope. If it was, you had a 48-hour obligation. Work
   out whether you would have met it.

Exercise 7 is uncomfortable, and it is the one that makes the rest of this file real.
