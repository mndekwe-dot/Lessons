# Detection and Response

**Week 7 of [`../CURRICULUM.md`](../CURRICULUM.md). Read in numbered order.**

Prevention fails eventually. This module is the part that decides whether a failure is
an incident or a catastrophe — seeing it, stopping it, and reconstructing what
happened.

| # | File | Week | Level | Core? | What it gives you |
|---|---|---|---|---|---|
| 01 | [01-DETECTION_AND_INCIDENT_RESPONSE.md](01-DETECTION_AND_INCIDENT_RESPONSE.md) | 7 | advanced | **core** | What to log, detection rules, alert fatigue, the IR lifecycle, credential rotation. |
| 02 | [02-DIGITAL_FORENSICS.md](02-DIGITAL_FORENSICS.md) | 7 | advanced | **core** | Order of volatility, Windows and Linux artefacts, timelines, memory analysis, anti-forensics. |

---

## Table of Contents

1. [The uncomfortable statistic](#the-uncomfortable-statistic)
2. [The one idea to take from this module](#the-one-idea-to-take-from-this-module)
3. [A note on alert fatigue](#a-note-on-alert-fatigue)
4. [What you should be able to do afterwards](#what-you-should-be-able-to-do-afterwards)

---

## The uncomfortable statistic

Most organisations learn they were breached from someone else. In September you learned
from Anthropic's Trust & Safety team, six days after the first artefact appeared on
disk. That six days is your **dwell time**, and it is the number this module exists to
reduce.

## The one idea to take from this module

**Removal is not recovery.**

> An infostealer's theft completes in seconds. Cleaning the machine afterwards does not
> un-steal anything.

Cleaning answers *"is it still running?"*. It does not answer *"what do they already
have?"*. Those are different questions, and only the second determines your exposure —
which is why credential rotation, not malware removal, is the real remediation, and why
the post-incident checklist in [`../PROGRESS.md`](../PROGRESS.md) is still the most
overdue thing in this repository.

## A note on alert fatigue

An alert nobody acts on is worse than no alert — it trains you to dismiss the channel.
This is not theoretical: the first extension of your Guardian scanner produced **460
findings, 295 of them HIGH**, and the one real finding was buried. Every detection rule
you write needs a documented response, or it belongs on a dashboard instead.

## What you should be able to do afterwards

- Log auth events with actor, IP, outcome and UTC timestamp — and no secrets
- Write three detection rules with defined responses, and prove one fires
- Produce an incident runbook with commands you have actually tested
- Build a forensic timeline from multiple sources and calculate dwell time
- Use confidence language honestly: confirmed / likely / possible / **unknown**

Checkpoint 7 in [`../CURRICULUM.md`](../CURRICULUM.md).
