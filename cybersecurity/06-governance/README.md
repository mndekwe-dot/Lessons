# Governance and Data Protection

**Week 8 of [`../CURRICULUM.md`](../CURRICULUM.md).**

The legal layer. This is where security stops being an engineering preference and
becomes an obligation with a deadline and a penalty attached.

| # | File | Week | Level | Core? | What it gives you |
|---|---|---|---|---|---|
| 01 | [01-COMPLIANCE_AND_DATA_PROTECTION.md](01-COMPLIANCE_AND_DATA_PROTECTION.md) | 8 | advanced | **core** | Rwanda Law No. 058/2021, lawful basis, children's data, cross-border transfer, DPIAs, data subject rights, the 48-hour breach clock. |

---

## Table of Contents

1. [This is not preparation for a future need](#this-is-not-preparation-for-a-future-need)
2. [The one that will catch you out](#the-one-that-will-catch-you-out)
3. [The one idea to take from this module](#the-one-idea-to-take-from-this-module)
4. [What you should be able to do afterwards](#what-you-should-be-able-to-do-afterwards)

---

## This is not preparation for a future need

You are already the data controller for two sensitive datasets:

- **Imboni** — identifiable records about **children**
- **Screening** — **mental-health responses**

Both are sensitive categories under Law No. 058/2021, enforced by the National Cyber
Security Authority. The obligations apply today, at your current scale, with penalties
reaching substantial administrative fines and, for the most serious violations,
imprisonment.

## The one that will catch you out

**Cross-border transfer.** Article 48 restricts moving personal data outside Rwanda,
and you have probably already done it without noticing. Every one of these is a
transfer:

- Hosting on a VPS in Germany or the US
- Sending data to Sentry, an analytics service, or a logging provider
- Emailing through a foreign SMTP provider
- **Sending a student's free-text answer to an LLM API**

That last one deserves a pause. If Screening ever sends a respondent's answer to a
hosted model, that is a cross-border transfer of health-adjacent data about an
identifiable person, and it needs a basis, a privacy notice entry, and a processor
contract.

## The one idea to take from this module

**Compliance is not parallel to security engineering — it is the same work, written
down.**

A regulator asking whether you had "appropriate technical and organisational measures"
is asking for the contents of modules 00 through 04. The part developers skip is the
*written down*, and to a regulator an undocumented control is an absent control.

## What you should be able to do afterwards

- Produce a data inventory: every field, its subject, purpose, lawful basis, retention
  and location
- Delete the fields you cannot justify — the highest-value privacy work available, and
  it takes an afternoon
- Implement and test `export_user_data` and `delete_user_data`, including related
  records, caches and third parties
- Write a DPIA whose risk section is honest about harm to **people**, not to you
- Name who notifies the NCSA within 48 hours, and have the template already written

Checkpoint 8 in [`../CURRICULUM.md`](../CURRICULUM.md).
