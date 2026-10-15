# Offensive Security

**Ongoing from Week 3 of [`../CURRICULUM.md`](../CURRICULUM.md).** One session a week,
alongside the main track.

Not gated by a checkpoint, because this is practice rather than delivery. It is,
however, where the defensive material stops being theoretical — you do not know your
authorisation logic holds until someone has genuinely tried to get past it.

| # | File | Level | Core? | What it gives you |
|---|---|---|---|---|
| 01 | [01-OFFENSIVE_SECURITY_BASICS.md](01-OFFENSIVE_SECURITY_BASICS.md) | advanced | *extra* | Legal boundaries, methodology, recon, Burp, the tests worth running, report writing, disclosure. |

See also [`../TOOLKIT.md`](../TOOLKIT.md) for every tool referenced, with install
commands and the module each belongs to.

---

## Table of Contents

1. [Read this before anything else in this module](#read-this-before-anything-else-in-this-module)
2. [Start here, this week](#start-here-this-week)
3. [The one idea to take from this module](#the-one-idea-to-take-from-this-module)
4. [What you should be able to do afterwards](#what-you-should-be-able-to-do-afterwards)

---

## Read this before anything else in this module

**Testing a system without written authorisation from its owner is a crime** — in
Rwanda under Law No. 60/2018, with custodial sentences, and essentially everywhere
else. Intent is not a defence. "I was only looking" is not a defence. "I reported it
afterwards" is not a defence.

Legal targets, and only these:

- Your own code and your own servers
- A deliberately vulnerable lab running on your own machine
- A CTF or training platform, within its rules
- A public bug bounty, strictly within its published scope
- A client's system, with a signed scope document and agreed dates

Scope is a boundary, not a suggestion. An automatic fail in this curriculum, and a
criminal matter outside it.

## Start here, this week

```bash
docker run --rm -p 3000:3000 bkimminich/juice-shop
```

That is a legal target on your own machine in one command. Pair it with a free
**PortSwigger Web Security Academy** account — the access control and SQL injection
paths map directly onto the Django patterns you already write, which makes them the
highest-value starting point for you specifically.

## The one idea to take from this module

**The findings live in reconnaissance and enumeration, not in exploitation.**

Beginners skip to the exploit and miss most of what is there. The highest-yield
question a developer can ask of their own infrastructure is simply: *what is deployed
that I forgot about?* An old staging instance with `DEBUG = True` and a copy of
production data is one of the most common real-world findings, and it is never found
by cleverness.

## What you should be able to do afterwards

- Build a complete endpoint inventory of your own app from the outside, with the role
  each endpoint requires
- Prove an access-control flaw with a reproducible request
- Write a finding in a format someone can act on, with severity reasoned from impact
  in context rather than a generic score
