# The Security Toolkit

Every tool referenced in this curriculum, in one place, organised by what you are
trying to do. Install commands assume Debian/Ubuntu or Windows where relevant.

**Two rules before anything here:**

1. **Legal.** Scanning, fuzzing or exploiting anything you do not own or have written
   permission to test is a crime under Rwanda's Law No. 60/2018. See
   `05-offensive-security/01-OFFENSIVE_SECURITY_BASICS.md` §1. Your own machines, your
   own servers, deliberately vulnerable labs, and in-scope bounty targets only.
2. **Tools do not make you competent.** Every item here is useless without the
   reasoning in the module it belongs to. A scanner reports what it recognises; it
   cannot tell you that a parent should not see another family's child.

---

## Table of Contents

1. [Start here — the eight that earn their place](#1-start-here--the-eight-that-earn-their-place)
2. [Reconnaissance and network](#2-reconnaissance-and-network)
3. [Web application testing](#3-web-application-testing)
4. [Static analysis, dependencies, secrets](#4-static-analysis-dependencies-secrets)
5. [Endpoint, persistence and malware](#5-endpoint-persistence-and-malware)
6. [Forensics](#6-forensics)
7. [Credentials and hashes](#7-credentials-and-hashes)
8. [Monitoring, detection and logging](#8-monitoring-detection-and-logging)
9. [Cloud](#9-cloud)
10. [Practice environments](#10-practice-environments)
11. [Reference and intelligence](#11-reference-and-intelligence)
12. [A realistic setup order](#12-a-realistic-setup-order)
13. [The honest note](#13-the-honest-note)

---

## 1. Start here — the eight that earn their place

If you install nothing else:

| Tool | For | Module |
|---|---|---|
| **Burp Suite Community** | see and edit every HTTP request your app makes | 05 |
| **nmap** | what is actually listening on your servers | 00, 02 |
| **Wireshark / tcpdump** | read traffic on the wire | 00 |
| **Sysinternals Autoruns** | every persistence mechanism on Windows, one screen | 03 |
| **gitleaks** | stop committing secrets, before the commit | 01 |
| **pip-audit / npm audit** | known CVEs in your dependencies | 01 |
| **Bitwarden / 1Password** | password manager — also a phishing detector | 03 |
| **OWASP Juice Shop** | a legal target to practise on | 05 |

---

## 2. Reconnaissance and network

| Tool | What it does | Install |
|---|---|---|
| **nmap** | port scanning, service and version detection, OS fingerprinting | `apt install nmap` |
| **masscan** | internet-scale scanning, far faster, less accurate | `apt install masscan` |
| **Wireshark** | GUI packet analysis, protocol decoding | `apt install wireshark` |
| **tcpdump** | CLI packet capture, available on every server | preinstalled |
| **netcat** / **socat** | raw TCP/UDP connections, banner grabbing, listeners | `apt install netcat-openbsd socat` |
| **dig** / **nslookup** | DNS queries, record inspection | `apt install dnsutils` |
| **whois** | domain registration data | `apt install whois` |
| **amass** / **subfinder** | subdomain enumeration — finds forgotten staging boxes | `go install` |
| **testssl.sh** | TLS configuration and cipher audit of a host | `git clone` |
| **ss** / **netstat** | what is listening locally | preinstalled |

```bash
nmap -sV -p- your-server.example.com        # full port + version scan, your host only
ss -tulpn | grep LISTEN                      # local listeners
testssl.sh https://your-site.example.com     # TLS grade and weaknesses
sudo tcpdump -i any -w capture.pcap port 80  # capture for Wireshark
```

---

## 3. Web application testing

| Tool | What it does | Notes |
|---|---|---|
| **Burp Suite Community** | intercepting proxy: view, modify, replay requests | the essential one; Pro adds the scanner |
| **OWASP ZAP** | same role, fully free, scriptable, CI-friendly | `zap-baseline.py` fits in a pipeline |
| **ffuf** | fast fuzzing: directories, parameters, subdomains | noisy — expect rate limits |
| **gobuster** | directory and DNS brute forcing | similar to ffuf |
| **nikto** | quick web server misconfiguration scan | dated but still finds things |
| **sqlmap** | confirms and exploits SQL injection | **destructive** — never point at anything you do not own |
| **wpscan** | WordPress-specific | only if you run WordPress |
| **Nuclei** | template-based vulnerability scanning | large community template library |

```bash
ffuf -u https://staging.example.com/FUZZ -w /usr/share/wordlists/dirb/common.txt
zap-baseline.py -t https://staging.example.com -r report.html
nuclei -u https://staging.example.com
```

**Always against staging, never production.** These write data, send emails to real
users, and can take a site down.

---

## 4. Static analysis, dependencies, secrets

This is the category that pays off daily in your own work.

| Tool | Ecosystem | What it finds |
|---|---|---|
| **bandit** | Python | insecure patterns: `shell=True`, `pickle`, weak crypto |
| **semgrep** | polyglot | custom and community rules; very good signal |
| **pip-audit** | Python | known CVEs in installed packages |
| **safety** | Python | alternative CVE scanner |
| **npm audit** | Node | known CVEs |
| **osv-scanner** | polyglot | Google's OSV database, multi-ecosystem |
| **gitleaks** | any | secrets in code **and in git history** |
| **detect-secrets** | any | secrets, with a baseline file to manage known ones |
| **trufflehog** | any | secrets, with live credential verification |
| **trivy** | containers, IaC, deps | the broadest single scanner |
| **tfsec** / **checkov** | Terraform | insecure infrastructure before deploy |
| **docker scout** | images | CVEs in image layers |

```bash
pip install bandit pip-audit detect-secrets
bandit -r . -ll                      # medium severity and above
pip-audit --strict
gitleaks detect --source . -v        # scans history, not just the working tree
trivy image my-app:latest
semgrep --config=auto .
```

**Wire gitleaks into pre-commit.** Ten minutes of setup, and it is the highest
value-per-effort control in this entire file:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks: [{id: gitleaks}]
```

---

## 5. Endpoint, persistence and malware

| Tool | Platform | What it does |
|---|---|---|
| **Sysinternals Autoruns** | Windows | every autostart location in one view — tick "Hide Microsoft entries" |
| **Sysinternals Process Explorer** | Windows | processes with full command lines, signatures, handles |
| **Sysinternals Process Monitor** | Windows | live file, registry and process activity |
| **Sysinternals TCPView** | Windows | live network connections per process |
| **Sysmon** | Windows | detailed process/network/file logging — the single best Windows telemetry upgrade |
| **chkrootkit** / **rkhunter** | Linux | rootkit indicators |
| **Lynis** | Linux | system hardening audit with a score |
| **ClamAV** | cross-platform | open-source AV scanning |
| **YARA** | cross-platform | pattern-matching rules for files and memory |
| **Guardian** | Windows | **your own scanner** at `~/Documents/antivirus` — LOLBIN detection, payload-carrier content scanning, `guardian exposure` |

```powershell
# the sweep that found the September infection
Get-ScheduledTask | Where-Object { $_.TaskPath -eq '\' }
Get-CimInstance Win32_Process | Select-Object ProcessId, Name, CommandLine
Get-CimInstance -Namespace root\subscription -ClassName CommandLineEventConsumer
```

```bash
sudo lynis audit system              # hardening score and specific findings
```

**Install Sysmon.** With a good config (SwiftOnSecurity's is the standard starting
point) it records process creation with command lines, which is precisely the telemetry
that makes LOLBIN abuse visible.

---

## 6. Forensics

| Tool | For |
|---|---|
| **Volatility 3** | memory analysis — injected code, decrypted payloads, connections |
| **WinPMEM** / **DumpIt** | capturing RAM on Windows |
| **Autopsy** / **The Sleuth Kit** | disk image analysis, deleted file recovery |
| **FTK Imager** | forensic disk imaging |
| **Eric Zimmerman's tools** | Windows artefacts: Prefetch, ShimCache, `$MFT`, registry |
| **plaso / log2timeline** | builds a super-timeline from many artefact sources |
| **CyberChef** | decoding, de-obfuscating, converting — a browser Swiss army knife |
| **strings** / **binwalk** | quick static triage of unknown binaries |
| **VirusTotal** | hash lookup against 70+ engines |

```bash
vol -f memory.raw windows.pslist
vol -f memory.raw windows.malfind         # injected code
strings -n 8 sample.bin | grep -iE "http|\.exe|cmd"
sha256sum sample.bin                       # look the hash up; do not upload blindly
```

**Look up hashes, do not upload files**, if the sample could contain your own data.
Uploading to VirusTotal publishes it to every subscriber.

---

## 7. Credentials and hashes

Legitimate uses: auditing your own password policy, recovering your own data, CTFs.

| Tool | For |
|---|---|
| **hashcat** | GPU-accelerated hash cracking |
| **John the Ripper** | CPU hash cracking, very broad format support |
| **hydra** | online brute force — only ever against your own services |
| **Have I Been Pwned** | has this address or password appeared in a breach |
| **Bitwarden / 1Password / KeePassXC** | password managers |

The defensive use that matters: run your own user password hashes against a wordlist
and find out how many fall in an hour. That number is the argument for your password
policy, and it is much more persuasive than a recommendation.

---

## 8. Monitoring, detection and logging

| Tool | For |
|---|---|
| **Wazuh** | open-source SIEM/XDR: log analysis, FIM, detection rules |
| **Sentry** | application errors — you likely already have it |
| **Grafana + Loki** | log aggregation and dashboards |
| **ELK / OpenSearch** | the heavyweight log stack |
| **fail2ban** | bans IPs on repeated auth failures |
| **auditd** | Linux kernel-level audit logging |
| **AIDE** / **Tripwire** | file integrity monitoring |
| **osquery** | query your endpoints with SQL |
| **Healthchecks.io / UptimeRobot** | is it up, did the cron job run |

```bash
sudo apt install fail2ban auditd
sudo auditctl -w /etc/passwd -p wa -k identity    # watch a sensitive file
```

Start small. A nightly digest of failed logins and admin actions, emailed to a human
who reads it, beats a SIEM nobody configured.

---

## 9. Cloud

| Tool | For |
|---|---|
| **ScoutSuite** | multi-cloud security posture audit |
| **Prowler** | AWS/Azure/GCP checks against benchmarks |
| **cloudsplaining** | finds over-permissive IAM policies |
| **Pacu** | AWS exploitation framework — your own accounts only |
| **tfsec / checkov / terrascan** | Terraform misconfiguration |
| **kube-bench / kube-hunter** | Kubernetes benchmark and attack surface |

```bash
pip install prowler scoutsuite
prowler aws                     # or your provider
```

---

## 10. Practice environments

Legal targets. Use these instead of anything you do not own.

| Platform | Best for |
|---|---|
| **PortSwigger Web Security Academy** | free, excellent, maps directly onto your Django/React stack |
| **TryHackMe** | the gentlest start, guided paths |
| **Hack The Box** | harder; begin with Starting Point |
| **OWASP Juice Shop** | run locally, modern JS stack |
| **DVWA** | classic PHP vulnerabilities |
| **picoCTF** | beginner CTF, permanently available |
| **VulnHub** | downloadable vulnerable VMs |
| **Metasploitable** | deliberately vulnerable Linux target |

```bash
docker run --rm -p 3000:3000 bkimminich/juice-shop     # legal target in one command
```

---

## 11. Reference and intelligence

| Resource | For |
|---|---|
| **MITRE ATT&CK** | the standard taxonomy of attacker techniques |
| **LOLBAS** | Windows binaries abusable for execution |
| **GTFOBins** | the Unix equivalent |
| **OWASP Top 10** | the web vulnerability canon |
| **OWASP ASVS** | a detailed verification standard — use it as a review checklist |
| **OWASP Cheat Sheet Series** | the best short, practical references on the internet |
| **CVE / NVD** | vulnerability databases |
| **exploit-db** | public exploit archive |
| **Have I Been Pwned** | breach exposure |
| **Rwanda NCSA** | your national regulator and reporting point |

---

## 12. A realistic setup order

Do not install everything. In this order, over the module:

**Week 18** — Wireshark, nmap, `testssl.sh`. Capture your own traffic once.
**Week 19** — Burp Community, Juice Shop, PortSwigger account. Start the access-control
path.
**Week 19** — gitleaks pre-commit, `pip-audit` and `npm audit` in CI. *Do this one even
if you do nothing else.*
**Week 20** — Lynis on the server, Sysmon + Autoruns on the laptop, Guardian scheduled.
**Week 21** — fail2ban, a logging stack, one real detection rule. CyberChef bookmarked.
**Week 22** — ScoutSuite/Prowler if you use cloud, tfsec if you use Terraform.

## 13. The honest note

A large part of security work uses no tool at all. The September infection was found
with `Get-ScheduledTask`, `reg query`, and reading a `.cmd` file carefully. The most
valuable instruments here are the ones that **show you what is actually happening** —
Burp, Wireshark, Process Explorer, Autoruns — rather than the ones that promise to find
problems for you.

Learn three deeply rather than thirty superficially.
