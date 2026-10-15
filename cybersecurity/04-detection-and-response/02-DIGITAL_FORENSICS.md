# 02 — Digital Forensics

**Week 21.** Reconstructing what happened after the fact. Incident response stops the
bleeding; forensics answers *what did they actually do, what did they take, and how did
they get in* — the three questions your regulator, your users and your own planning all
depend on.

You did a partial version of this in September. This file is the discipline you were
improvising.

---

## Table of Contents

1. [The questions forensics answers](#1-the-questions-forensics-answers)
2. [Order of volatility](#2-order-of-volatility)
3. [Preserve before you touch](#3-preserve-before-you-touch)
4. [Windows artefacts worth knowing](#4-windows-artefacts-worth-knowing)
5. [Linux artefacts](#5-linux-artefacts)
6. [Building the timeline](#6-building-the-timeline)
7. [Memory forensics, briefly](#7-memory-forensics-briefly)
8. [Malware triage without running it](#8-malware-triage-without-running-it)
9. [Anti-forensics to expect](#9-anti-forensics-to-expect)
10. [Writing it up](#10-writing-it-up)
11. [The checklist](#11-the-checklist)
12. [Exercise 13](#exercise-13)

---

## 1. The questions forensics answers

1. **Initial access** — how did they get in?
2. **Timeline** — what happened, in what order?
3. **Scope** — what did they reach?
4. **Exfiltration** — what left, if anything?
5. **Persistence** — are they still here?

Question 4 is the one that determines your legal obligations, and the one most often
unanswerable. Saying "we could not determine what was exfiltrated" is an honest answer.
Saying "nothing was taken" when you did not look is not.

## 2. Order of volatility

Collect the most perishable evidence first. Each step down lasts longer:

1. **CPU registers, cache** — microseconds, practically unreachable
2. **RAM** — lost at power-off. Contains decrypted keys, injected code, network state.
3. **Network connections, running processes** — lost at reboot
4. **Disk** — survives reboot
5. **Logs, backups, archives** — survive the machine

The practical consequence, and the mistake to avoid: **a fileless payload lives only in
RAM.** In September we killed the `MSBuild.exe` process for containment, which was the
right call for safety and permanently destroyed the only copy of the decrypted stage
three. That trade-off is legitimate — containment usually outranks evidence — but make
it knowingly.

If memory matters and the machine is still running: capture RAM before anything else.

## 3. Preserve before you touch

The cardinal rule. Investigating on the live system changes it — timestamps move, logs
roll, caches populate.

- **Work on copies.** Image the disk, hash the image, investigate the copy.
- **Hash everything** on collection, and record the hashes. This is how you later prove
  the evidence was not altered.
- **Document as you go**: what you ran, when, as whom, and what you saw. Your own
  actions are part of the timeline and will otherwise be indistinguishable from the
  attacker's.
- **Chain of custody** if this could ever be disputed: who held the evidence, when,
  and where it was stored.

```bash
sha256sum suspicious.bin >> evidence/hashes.txt
date -u +"%Y-%m-%dT%H:%M:%SZ" >> evidence/actions.log
```

In September you did the right thing here — exported the scheduled-task XML, copied the
samples, hashed them, and recorded the origin paths before quarantining. That is why
the write-up could be specific.

## 4. Windows artefacts worth knowing

| Artefact | Tells you | Where |
|---|---|---|
| **Event logs** | logons, service installs, process creation | `Get-WinEvent`, `C:\Windows\System32\winevt` |
| **Prefetch** | that a program ran, when, how often | `C:\Windows\Prefetch` |
| **Registry hives** | persistence, USB history, run counts | `SAM`, `SYSTEM`, `SOFTWARE`, `NTUSER.DAT` |
| **Scheduled tasks** | persistence | `C:\Windows\System32\Tasks` (XML on disk) |
| **ShimCache / AmCache** | execution evidence even after deletion | registry |
| **Browser profile** | history, cookies, saved credentials | `AppData\Local\...\User Data` |
| **`$MFT`** | file creation/deletion, including deleted files | NTFS metadata |
| **Zone.Identifier** | that a file came from the internet, and from where | NTFS alternate data stream |

The key event IDs: **4624** (logon), **4625** (failed logon), **4688** (process
creation — enable it, it is off by default and it is the single most useful one),
**7045** (service installed), **1102** (audit log cleared — always suspicious).

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 50
Get-ChildItem C:\Windows\Prefetch -Filter "*SUSPECT*"
Get-Content file.exe -Stream Zone.Identifier     # where did this download come from
```

That last one is worth remembering: Windows records the source URL of downloaded files
in an alternate data stream. It frequently answers "how did this get here".

## 5. Linux artefacts

| Artefact | Where |
|---|---|
| Auth log | `/var/log/auth.log`, `/var/log/secure` |
| Shell history | `~/.bash_history` (unreliable — easily cleared) |
| Systemd journal | `journalctl` |
| Cron | `/etc/crontab`, `/var/spool/cron/`, `/etc/cron.*` |
| SSH keys | `~/.ssh/authorized_keys` — **check this first** |
| Running processes | `/proc/<pid>/`, including `cmdline`, `exe`, `environ` |
| Deleted-but-open files | `/proc/<pid>/fd/` — recoverable while the process lives |

```bash
last -50                              # successful logins
lastb -50                             # failed logins
journalctl -u ssh --since "7 days ago"
find / -newermt "2026-09-06" -type f 2>/dev/null | grep -v /proc   # changed since
stat suspicious_file                  # atime, mtime, ctime
```

`ctime` is the one attackers usually forget. Timestomping tools set `mtime` and
`atime`; changing `ctime` requires more effort. A file whose `mtime` is 2022 but whose
`ctime` is last Tuesday is telling you plainly that it was tampered with — which is
exactly the pattern your September loader showed.

## 6. Building the timeline

The timeline is the deliverable. Everything else is input.

Merge every source into one chronology in UTC: file timestamps, log entries, process
creation, network connections, authentication events. Then read it as a story and look
for the gaps.

```
2026-09-06 12:32  files written to AppData\Local\TP-Link\WiFi Configuration Utility\
2026-09-09 20:20  copies appear in INetCache\, WebCache\, Caches\
2026-09-09 20:22  timestamps on INetCache copy falsified to 2022-05-09
2026-09-10 10:50  TroschuetzRandom variant written to Temp
2026-09-11 14:33  scheduled task \SearchHost fires at logon; MSBuild loads stage 2
2026-09-11 14:48  Defender detects PlayGTAV.rar  (delivery, not loader)
2026-09-12  --    Anthropic T&S reports session misuse  <-- external notification
```

Reading that back, the useful observations are structural: first artefact 6 September,
external notification 12 September — **six days of dwell time**, and the detection came
from outside. Dwell time is the number that matters; it is how long the attacker had.

## 7. Memory forensics, briefly

When you can capture it, RAM is the richest source — it holds decrypted payloads,
injected code, keys, and connections that never touched disk.

- Capture: WinPMEM, DumpIt, or a VM snapshot
- Analyse: **Volatility 3**

```bash
vol -f mem.raw windows.pslist
vol -f mem.raw windows.malfind      # injected code regions
vol -f mem.raw windows.cmdline
```

For your case this is exactly what would have recovered the stage-three payload that
the encrypted resources hid. If there is ever a next time, and the machine is still
running: **capture memory before you kill anything.**

## 8. Malware triage without running it

You are not reverse-engineering; you are deciding what a sample does.

**Static, safe:**

```bash
sha256sum sample.bin                      # then search VirusTotal by hash
file sample.bin
strings -n 8 sample.bin | less            # URLs, paths, commands
```

Hash lookup first — if it is known, someone has already done the analysis. Note that
**uploading** a sample to VirusTotal publishes it; upload hashes, not files, if the
sample might contain your own data.

**YARA** turns an observation into a reusable rule:

```yara
rule MSBuild_Loader {
  strings:
    $a = "MSBUILDENABLEALLPROPERTYFUNCTIONS"
    $b = "System.AppDomain]::CurrentDomain.Load"
    $c = "--headless cmd"
  condition: 2 of them
}
```

That is essentially what your own scanner's `contentscan.py` encodes.

**Dynamic:** only in an isolated VM with no network, or a sandbox (ANY.RUN, Joe
Sandbox, Hybrid Analysis). Never on your own machine, never on a VM that shares a
network with anything you care about.

## 9. Anti-forensics to expect

Attackers actively work against this process:

- **Timestomping** — falsified timestamps (September: May 2022). Check `ctime`.
- **Log clearing** — event 1102. The absence of logs is itself evidence.
- **Living off the land** — no malicious binary to find
- **Fileless execution** — nothing on disk at all
- **Process self-protection** — your `MSBuild.exe` denied `taskkill /F` via its own ACL
- **Encrypted payloads** — stage three stayed encrypted and unanalysed

When several of these appear together, the correct conclusion is that you are not
dealing with a script kiddie, and that **"we removed it" is a weaker claim than it
sounds**. This is the evidence base for recommending a rebuild.

## 10. Writing it up

The report should answer the five questions in §1, and say plainly which ones you could
not answer.

```
SUMMARY       one paragraph a non-technical reader understands
TIMELINE      UTC, with source for each entry
INITIAL ACCESS  how they got in, and the confidence level
SCOPE         what was reachable; what was confirmed accessed
EXFILTRATION  what left; or "could not be determined", explicitly
IOCs          hashes, paths, domains, behaviours
REMEDIATION   what was done, what remains
LESSONS       dated actions with named owners
```

Confidence language matters: **confirmed** / **likely** / **possible** / **unknown**.
Overstating certainty in a forensic report is how you end up telling users something
false.

## 11. The checklist

- [ ] Evidence hashed and copied before investigation
- [ ] Own actions logged with UTC timestamps
- [ ] Memory captured before process termination, where feasible
- [ ] Timeline built from multiple independent sources
- [ ] `ctime` checked against `mtime` for tampering
- [ ] Hash lookups before any upload of a sample
- [ ] Dynamic analysis only in an isolated VM
- [ ] Report states explicitly what could **not** be determined
- [ ] Dwell time calculated

---

## Exercise 13

1. Enable process-creation auditing (event 4688) with command lines on your machine.
   Then run something harmless and confirm it is captured.

2. Build the full September timeline from the evidence still in your quarantine folder,
   in the §6 format, UTC, with a source for every line. Calculate the dwell time.

3. Take one quarantined sample and triage it statically: hash, `file`, `strings`. Write
   what you can conclude and what you cannot.

4. Write a YARA rule that matches the September loader and does **not** match any
   legitimate `.csproj` on your machine. Test it against both.

5. Check `ctime` versus `mtime` on the quarantined files and show the timestomping
   numerically.

6. Write the full incident report in the §10 format. Be rigorous about the confidence
   language, particularly in the exfiltration section.

Exercise 6 is the deliverable that would have been required of you if Imboni's data had
been in scope.
