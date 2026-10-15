# 05 — Infrastructure Hardening

**Week 20.** The server, the container, the network. Your deployment guides
(`05-deployment/`) tell you how to get the application running; this file is about
making the box it runs on hostile to an attacker who gets a foothold.

Assume they will. Hardening is what decides whether a foothold becomes a breach.

---

## Table of Contents

1. [The attack surface of a VPS](#1-the-attack-surface-of-a-vps)
2. [SSH hardening](#2-ssh-hardening)
3. [Users, groups and sudo](#3-users-groups-and-sudo)
4. [The firewall](#4-the-firewall)
5. [Patching](#5-patching)
6. [Database hardening](#6-database-hardening)
7. [Container security](#7-container-security)
8. [Secrets at runtime](#8-secrets-at-runtime)
9. [Monitoring the box](#9-monitoring-the-box)
10. [Backups and recovery](#10-backups-and-recovery)
11. [The checklist](#11-the-checklist)
12. [Exercise 5](#exercise-5)

---

## 1. The attack surface of a VPS

A fresh Oracle/Hetzner box exposed to the internet starts receiving automated SSH
brute-force attempts within minutes. Not because anyone knows about you — because the
entire IPv4 space is scanned continuously.

Everything listening on a public interface is attack surface:

```bash
ss -tulpn | grep LISTEN       # what is listening, and which process owns it
```

Run this on your Imboni server now. Anything bound to `0.0.0.0` is reachable from the
internet. The expected answer is: **22 (SSH), 80, 443, and nothing else.** Postgres on
5432 and Redis on 6379 must bind to `127.0.0.1` only.

An internet-exposed Redis with no password is remote code execution — it has a
documented technique for writing an SSH key to disk. It is one of the most commonly
compromised services in existence.

## 2. SSH hardening

SSH is your front door. Configure `/etc/ssh/sshd_config`:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey
Port 22
AllowUsers deploy
ClientAliveInterval 300
MaxAuthTries 3
```

`PasswordAuthentication no` is the single highest-value line. It makes the brute-force
traffic irrelevant — there is no password to guess.

```bash
sudo sshd -t && sudo systemctl reload sshd   # ALWAYS test config before reloading
```

Keep your current session open while you test a new one. Locking yourself out of a
remote box is a rite of passage you can skip.

**Changing the port** to 2222 reduces log noise. It is not security — a scanner finds
it in seconds — but less noise means you notice real events.

**Key hygiene** (your September incident is directly relevant):

- Ed25519, with a passphrase. Yours are correct on both counts.
- One key per machine, not one key copied everywhere — so losing a laptop revokes one key.
- `~/.ssh/authorized_keys` on the server is the list of who can log in. **Audit it.**
  An attacker's first persistence move is appending a key there.
- `chmod 600` private keys, `700` the `.ssh` directory. SSH refuses loose permissions.

## 3. Users, groups and sudo

Never run the application as root. One service account, owning only what it needs:

```bash
sudo adduser --system --group --no-create-home imboni
sudo chown -R imboni:imboni /srv/imboni
sudo chmod 750 /srv/imboni
```

Read the Unix permission model properly once — `rwx` for owner/group/other, and the
fact that **write permission on a directory means you can delete files inside it**
regardless of the files' own permissions. That last point surprises people.

`sudo` should be specific where you can manage it:

```
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart imboni
```

rather than blanket `ALL=(ALL) NOPASSWD: ALL`, which makes the deploy account
equivalent to root.

## 4. The firewall

Default deny inbound. Allow the three things you need.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ufw status verbose
```

Consider restricting SSH to your own IP if it is stable, or to a VPN. And note
**outbound** matters too: a compromised app server with unrestricted egress can
exfiltrate your database anywhere. Restricting outbound is inconvenient and genuinely
effective — it is what would have limited the September infostealer.

`fail2ban` watches logs and bans repeat offenders:

```bash
sudo apt install fail2ban       # ships with a sane sshd jail by default
```

## 5. Patching

The second most common breach cause after stolen credentials.

```bash
sudo apt update && sudo apt upgrade
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

Turn on automatic **security** updates. The risk of an unattended update breaking
something is real but far smaller than the risk of running a known-vulnerable OpenSSL
for six months.

Know your distribution's EOL date. An Ubuntu LTS past end-of-life receives no security
patches at all, and that is a slow-motion breach.

## 6. Database hardening

- Bind to `127.0.0.1`. If the app is on another host, use a private network or TLS,
  never the public interface.
- A dedicated role per application, with grants on its own schema only — not superuser.
- Strong generated password, from your secret manager.
- `ssl = on` for connections that leave the host.
- Backups: encrypted, off-box, and **restore-tested**. An untested backup is a belief,
  not a backup.

```sql
CREATE ROLE imboni_app LOGIN PASSWORD '...';
GRANT CONNECT ON DATABASE imboni TO imboni_app;
GRANT USAGE ON SCHEMA public TO imboni_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO imboni_app;
-- deliberately absent: DROP, CREATE, ALTER, superuser
```

Then ask the question from `00-foundations/01-SECURITY_FOUNDATIONS.md`: if the app is compromised, what can that role do?
With the grants above, it can read and modify data — bad — but it cannot drop your
tables or create new superusers. That difference is worth the twenty minutes.

## 7. Container security

Docker changes the shape of the problem, it does not remove it.

**Do not run as root inside the container.** The default is root, and a container
escape then lands as root on the host:

```dockerfile
RUN adduser --system --group app
USER app
```

**Use minimal base images.** `python:3.12-slim` over `python:3.12`; distroless if you
can manage it. Fewer packages, fewer CVEs, smaller attack surface.

**Pin versions.** `FROM python:3.12.7-slim` not `FROM python:latest`. Reproducibility
is a security property — you cannot reason about what you cannot pin.

**Never bake secrets into an image.** Every layer is retrievable, including deleted
files:

```dockerfile
ENV API_KEY=sk-live-...      # permanently in the image history
```

Pass secrets at runtime via environment or mounted files.

**Never mount the Docker socket** into a container you do not fully trust.
`-v /var/run/docker.sock:/var/run/docker.sock` is equivalent to giving that container
root on the host.

Scan images:

```bash
docker scout cves my-image:tag
trivy image my-image:tag
```

**A container is not a security boundary** in the way a VM is. It shares the host
kernel. For untrusted code — running a user's submitted script, say — use gVisor,
Firecracker or a VM.

## 8. Secrets at runtime

Covered in `02-backend/08-SECRETS_STUDY_GUIDE.md` for the `.env` mechanics. The
infrastructure additions:

- Environment variables are visible in `/proc/<pid>/environ` to the same user, and
  often in process listings and crash dumps. Better than hardcoding; not airtight.
- Mounted secret files with `chmod 400`, owned by the service user, are stronger.
- A real secret manager (Vault, AWS Secrets Manager, Doppler) gives rotation and audit.
- On a shared box, remember any process running as your user can read your `.env`.
  **This is exactly how the September infostealer took your project secrets** — not by
  breaking encryption, but by being you.

## 9. Monitoring the box

The minimum you should be able to answer:

- Is it up? (uptime monitor — UptimeRobot, Healthchecks.io)
- Is the disk filling? (a full disk takes Postgres down)
- Who logged in, and when? (`last`, `journalctl -u ssh`)
- What changed? (`aide` or `tripwire` for file integrity, if you want depth)

```bash
last -20                       # recent logins
sudo lastb -20                 # recent FAILED logins
journalctl -u ssh --since "1 week ago" | grep -i "accepted"
```

Run those on the Imboni server periodically. An `Accepted publickey` from an IP you do
not recognise is the alarm you cannot afford to miss.

## 10. Backups and recovery

Security includes getting back. Ransomware and `DROP TABLE` have the same remedy.

The 3-2-1 rule: **3** copies, **2** media, **1** off-site.

- Automated, scheduled, monitored (a silently failing backup is the normal failure mode)
- Encrypted at rest, with the key stored separately
- **Off-box and offline-capable** — a backup your compromised server can reach and
  delete is not a backup against ransomware
- Restore-tested quarterly, timed. "How long to restore Imboni from scratch?" should
  have a number.

## 11. The checklist

- [ ] `ss -tulpn` shows only 22/80/443 public; Postgres and Redis on localhost
- [ ] SSH: no root, no passwords, keys only, `MaxAuthTries` set
- [ ] `authorized_keys` audited on every server
- [ ] App runs as a non-root service user
- [ ] `ufw` default-deny inbound, egress considered
- [ ] `fail2ban` running
- [ ] Unattended security upgrades on; OS within support
- [ ] DB role is not superuser; backups encrypted, off-box, restore-tested
- [ ] Containers: non-root `USER`, pinned base, no secrets in layers, no Docker socket
- [ ] Login history reviewed; uptime and disk monitored

---

## Exercise 5

1. SSH into the Imboni server and run `ss -tulpn`. Write down every listener, which
   process owns it, and whether it should be public. Close anything that should not be.

2. Audit `~/.ssh/authorized_keys` on every server you control. For each key, name the
   machine it belongs to. Remove any you cannot account for.

3. Write the exact `GRANT` statements Imboni's database role needs, apply them on a
   staging copy, and run the test suite. Fix what breaks.

4. Harden your Dockerfile: non-root user, pinned base, no secrets. Run `trivy` before
   and after and report the CVE counts.

5. Run `sudo lastb` and `journalctl -u ssh`. How many failed logins in the last week,
   and from how many distinct IPs? Then enable `fail2ban` and compare a week later.

6. Time a full restore of Imboni from your most recent backup onto a clean box. Write
   down the number. If you cannot do it, that is the finding.

Exercise 6 is the one nobody does until the week they desperately need it.
