# 07 — Detection and Incident Response

**Week 21.** Seeing an attack, and what to do in the hours after. Prevention fails
eventually; this file is about the part that decides whether a failure is an incident
or a catastrophe.

The uncomfortable statistic: most organisations learn they were breached from someone
else. In September, you learned from Anthropic's Trust & Safety team, not from your own
monitoring. That is the normal case, and it is the thing this file tries to change.

---

## Table of Contents

1. [What to log](#1-what-to-log)
2. [Structured logging](#2-structured-logging)
3. [From logs to detection](#3-from-logs-to-detection)
4. [Alert fatigue is a security failure](#4-alert-fatigue-is-a-security-failure)
5. [The incident response lifecycle](#5-the-incident-response-lifecycle)
6. [The credential reality](#6-the-credential-reality)
7. [Forensic basics](#7-forensic-basics)
8. [Breach notification](#8-breach-notification)
9. [The runbook](#9-the-runbook)
10. [The checklist](#10-the-checklist)
11. [Exercise 7](#exercise-7)

---

## 1. What to log

Log the security-relevant events, not everything. Noise is the enemy of detection.

**Always log:**

| Event | Why |
|---|---|
| Authentication success **and** failure | brute force, credential stuffing, unexpected logins |
| Logout and session invalidation | timeline reconstruction |
| Authorisation denials | someone probing for IDOR |
| Password/email/MFA changes | account takeover |
| Privilege changes | escalation |
| Access to sensitive records | who read which child's file |
| Admin actions | accountability |
| Payment events | fraud and disputes |

**Never log:** passwords, tokens, session IDs, card numbers, full national IDs. Logs
flow into aggregators with far wider access than your database — treating them as
public is the right mental model.

Every entry needs: **timestamp (UTC, ISO 8601), actor, action, target, source IP,
outcome.** A log line that does not say who did what to which object is decoration.

```python
logger.info(
    "student_record_viewed",
    extra={"actor": request.user.id, "student": student.id,
           "ip": get_client_ip(request), "outcome": "allowed"},
)
```

## 2. Structured logging

Plain text is for humans; structured JSON is for queries. You cannot answer "how many
failed logins for this account from outside Rwanda last week?" by grepping prose.

```python
import structlog
log = structlog.get_logger()
log.warning("login_failed", email_hash=h, ip=ip, attempt=n)
```

Hash or truncate identifiers where you can — enough to correlate, not enough to leak.

## 3. From logs to detection

Logs you never read are a compliance artefact. Detection means something watches.

Start with simple, high-value rules:

- **N failed logins** for one account in M minutes
- A **successful** login immediately after many failures
- Login from a new country for an existing account
- A spike in 403s from one IP (enumeration)
- Any admin action outside working hours
- Mass export — one account reading hundreds of records

Tools, in increasing order of effort: Sentry (errors, cheap, you likely have it) →
Grafana Loki or the ELK stack → a real SIEM (Wazuh is capable and free).

For a project at Imboni's scale, **a nightly digest email of the table above beats a
SIEM nobody configured.** The best detection is the one that actually runs.

## 4. Alert fatigue is a security failure

An alert nobody acts on is worse than none — it trains you to dismiss the channel.

This is not theoretical for you. When the Guardian scanner was first extended it
produced **460 findings, 295 of them HIGH**, and the one real finding was buried. The
fix was the split between primary and amplifier signals. The same discipline applies
to every alert you write:

- Every alert needs a documented response. No action → do not alert; put it on a
  dashboard.
- Tune relentlessly. A rule that fires daily and is always benign is broken.
- Severity must mean something. If everything is critical, nothing is.

## 5. The incident response lifecycle

The standard six phases (NIST SP 800-61). They are a checklist, not bureaucracy — under
pressure, people skip steps, and the skipped step is usually the expensive one.

### 1. Preparation
Before anything happens: know who to call, where backups are, how to isolate a host,
and where you would write things down. Decide **now** who can authorise taking
production offline.

### 2. Identification
Confirm it is real. What is affected? When did it start? Scope before you act — the
instinct to immediately delete destroys the evidence that tells you how far it went.

### 3. Containment
Stop the bleeding without destroying the scene.

- *Short-term:* isolate the host, disable the account, revoke the token, block the IP.
- *Long-term:* a clean replacement while you investigate the original.

In September this was: disable the scheduled task, kill the process tree, quarantine
rather than delete — in that order, after exporting the task XML and hashing the files.

### 4. Eradication
Remove persistence, close the entry route, patch the vulnerability. If you cannot
establish the entry route, assume it is still open.

### 5. Recovery
Restore, verify, monitor closely for recurrence. Persistence you missed will recreate
itself, so the verification scan after a reboot is not a formality.

### 6. Lessons learned
A blameless write-up within a week: timeline, root cause, what worked, what did not,
and dated actions with owners. **Blameless** matters — if people are punished, you stop
hearing about incidents early, and early is the only time they are cheap.

## 6. The credential reality

The single most important thing in this file:

> **An infostealer's theft completes in seconds. Removing the malware afterwards does
> not un-steal anything.**

Cleaning the machine answers "is it still running?". It does not answer "what do they
already have?". Those are different questions and only the second one determines your
exposure.

After any credential compromise, from a **device you trust, not the affected one**:

1. **Email first** — it is the reset path for everything else
2. Change the password, then **explicitly sign out all sessions**. Password changes do
   not reliably invalidate existing cookies, and a stolen cookie needs no password and
   no 2FA.
3. Then: banking, cloud, GitHub, anything with saved payment details
4. **Rotate secrets, not just passwords** — `.env` values, API keys, SSH keys, webhook
   secrets, database passwords
5. **Check for attacker-planted persistence inside accounts.** This survives a password
   change and is how people get re-compromised a fortnight later:
   - recovery email and phone
   - app passwords (these bypass MFA entirely)
   - OAuth third-party app grants
   - mail forwarding rules and filters that delete security alerts
   - regenerate backup codes
6. Do not sign back in on the affected machine until you are confident in it — fresh
   logins mint fresh cookies.

## 7. Forensic basics

If an incident might ever be disputed, reported to a regulator, or form the basis of
a claim, handle evidence properly.

**Order of volatility** — collect most-perishable first: memory, network connections,
running processes, disk, backups.

**Preserve before you touch.** Copy, hash, and work on the copy. Record what you did
and when. A simple timestamped log of your own actions is worth a great deal later.

**Do not reboot** if memory matters — a fileless payload lives only in RAM, and the
reboot that kills it also destroys the evidence of what it was. In September we killed
the process *first*, which was right for containment and lost the memory image.
Accepting that trade-off knowingly is fine; stumbling into it is not.

## 8. Breach notification

Rwanda's **Law No. 058/2021** on personal data protection requires notification to the
National Cyber Security Authority **within 48 hours** of becoming aware of a breach,
and notification to affected individuals where there is high risk to their rights.
GDPR's equivalent is 72 hours.

Both clocks start at *awareness*, not at *full understanding*. "We are still
investigating" is an acceptable first notification; silence is not.

You hold children's records (Imboni) and mental-health responses (Screening). Both are
sensitive categories. Decide **now**, in writing, who notifies whom and within what
time — because deciding during an incident is how deadlines get missed.

## 9. The runbook

Write this before you need it. One page, where you can reach it when production is
down and you are not thinking clearly.

```
INCIDENT RUNBOOK - Imboni
1. Who to contact, in order, with phone numbers
2. How to take the app offline        (exact command)
3. How to revoke all sessions         (exact command)
4. How to rotate the database password (exact steps)
5. Where backups are, and the restore command
6. Where to write the timeline        (a shared doc, created now)
7. Notification: NCSA within 48h - template drafted, owner named
```

An untested runbook is a wish. Walk through it once, out loud.

## 10. The checklist

- [ ] Auth successes and failures logged with actor, IP, outcome, UTC timestamp
- [ ] No secrets in logs
- [ ] Logs structured and queryable
- [ ] At least three detection rules live, each with a defined response
- [ ] Someone actually receives the alerts
- [ ] Runbook written, printed or offline-accessible, walked through once
- [ ] Backups off-box and restore-tested
- [ ] Breach notification owner and 48-hour process agreed in writing

---

## Exercise 7

1. Add structured security logging to Imboni's login, logout, and failed-login paths.
   Include actor, IP, outcome. Confirm no password or token is logged.

2. Write three detection rules as actual queries against your logs. For each, document
   the response. Trigger one deliberately and confirm it fires.

3. Write the Imboni incident runbook (§9), with real commands that you have tested. Not
   placeholders — commands you have run.

4. Reconstruct the September incident as a formal timeline: first infection, what ran
   when, when detection occurred, when containment happened, what was exfiltrated and
   what remains unknown. Mark the gaps honestly.

5. Write the NCSA breach notification you *would* have sent in September, as if
   Imboni's database had been in scope. Then check the 48-hour clock against when you
   actually learned.

6. From the credential list in §6, work through every item for your own accounts and
   tick them off. Pay particular attention to step 5 — check for recovery addresses,
   app passwords and forwarding rules you did not create.

Exercise 6 is not a study exercise. Do it this week.
