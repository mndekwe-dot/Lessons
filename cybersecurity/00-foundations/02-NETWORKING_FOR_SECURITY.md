# Networking for Security — Zero to Professional

**Week 18.** By the end of this file you can read a packet capture, write a firewall
policy in both directions, explain what an observer on the wire learns about your users
despite TLS, and name the one network control that would have caught the September
malware.

Most security material treats the network as a diagram. This file treats it as the place
your evidence lives. Every intrusion crosses a wire, which means every intrusion leaves
traces there — and network evidence is the hardest for an attacker to erase, because it
is not on the machine they control.

---

## Table of Contents

1. [Before you read a word](#before-you-read-a-word)
2. [Chapter 1: Layers, and why an attacker cares](#chapter-1-layers-and-why-an-attacker-cares)
3. [Chapter 2: Addressing and the path a packet takes](#chapter-2-addressing-and-the-path-a-packet-takes)
4. [Chapter 3: DNS](#chapter-3-dns)
5. [Chapter 4: TCP, UDP and QUIC](#chapter-4-tcp-udp-and-quic)
6. [Chapter 5: Ports, services and enumeration](#chapter-5-ports-services-and-enumeration)
7. [Chapter 6: The LAN is hostile](#chapter-6-the-lan-is-hostile)
8. [Chapter 7: Wi-Fi](#chapter-7-wi-fi)
9. [Chapter 8: What TLS does not hide](#chapter-8-what-tls-does-not-hide)
10. [Chapter 9: Traffic analysis](#chapter-9-traffic-analysis)
11. [Chapter 10: Firewalls](#chapter-10-firewalls)
12. [Chapter 11: Egress filtering — the September control](#chapter-11-egress-filtering--the-september-control)
13. [Chapter 12: Segmentation, VPNs and tunnels](#chapter-12-segmentation-vpns-and-tunnels)
14. [Chapter 13: Proxies, load balancers and the headers that lie](#chapter-13-proxies-load-balancers-and-the-headers-that-lie)
15. [Chapter 14: Detection on the network](#chapter-14-detection-on-the-network)
16. [Chapter 15: Capturing and reading traffic](#chapter-15-capturing-and-reading-traffic)
17. [Chapter 16: SSRF — the network view of a web bug](#chapter-16-ssrf--the-network-view-of-a-web-bug)
18. [Chapter 17: The checklist](#chapter-17-the-checklist)
19. [Exercise 2 — the module checkpoint](#exercise-2--the-module-checkpoint)

---

## Before you read a word

Three things this file will keep returning to:

1. **"Internal network" is not a trust boundary.** It never was, and it certainly is not
   now. Anyone on your LAN can impersonate your gateway in one command.
2. **Egress matters more than ingress, and almost nobody filters it.** You blocked the
   world from reaching in. Nothing stopped the malware reaching out — and that is the
   direction the data went.
3. **DNS is the single highest-value log you are not keeping.** Nearly every intrusion
   performs a DNS lookup before it does anything else.

---

# PART 1 — THE MODEL

## Chapter 1: Layers, and why an attacker cares

### The two models

The seven-layer OSI model is how people talk; the four-layer TCP/IP model is how things
actually work. Learn the mapping because tools and vulnerability descriptions use both.

| OSI | TCP/IP | Carries | Example attacks |
|---|---|---|---|
| 7 Application | Application | HTTP, DNS, SMTP, SSH | SQLi, XSS, DNS poisoning, HTTP smuggling |
| 6 Presentation | Application | TLS, encoding | downgrade, padding oracle, cert mis-issuance |
| 5 Session | Application | sessions | session hijack, fixation |
| 4 Transport | Transport | TCP, UDP, QUIC | SYN flood, RST injection, port scan |
| 3 Network | Internet | IP, ICMP, routing | IP spoofing, BGP hijack, fragmentation |
| 2 Data link | Link | Ethernet, ARP, Wi-Fi | ARP spoofing, MAC flooding, deauth |
| 1 Physical | Link | cables, radio | tapping, jamming, physical access |

The reason to know this is not exam trivia. It is that **a control at one layer cannot see
problems at another.** Your TLS certificate is perfect and irrelevant to an ARP spoofing
attack. Your WAF inspects layer 7 and cannot see a SYN flood. When you are told "we are
secure, we have X", the useful question is *which layer does X operate at, and what is
unprotected at the others?*

### Encapsulation — what is actually on the wire

Each layer wraps the one above:

```
┌────────────────────────────────────────────────────────────────┐
│ Ethernet header │ IP header │ TCP header │ TLS record │ HTTP   │
│ src/dst MAC     │ src/dst IP│ src/dst    │ encrypted  │ GET /… │
│                 │           │ port, flags│ payload    │        │
└────────────────────────────────────────────────────────────────┘
  layer 2           layer 3     layer 4      layer 6      layer 7
   visible to       visible     visible      ENCRYPTED    encrypted
   your LAN         to every    to every
                    router      router
```

Read that diagram as a privacy statement, because it is one. TLS encrypts the HTTP payload
and **nothing else**. Every router between you and the server sees both IP addresses, both
ports, the packet sizes and the timing. That is Chapter 9's whole subject, and it is why
"we use HTTPS" is an incomplete answer to "what does the network learn about our users?"

### Practice

1. For each of the seven layers, name one control you have and one attack it cannot see.
2. Run `curl -v https://imboni.rw` and label each stage of the output with its layer.
3. Explain in two sentences why a WAF cannot stop a SYN flood.

---

## Chapter 2: Addressing and the path a packet takes

### Addresses and CIDR

```
IPv4:  192.168.1.10          32 bits, exhausted, NAT everywhere
IPv6:  2001:db8::1          128 bits, no NAT needed, often forgotten in firewall rules

CIDR:  10.0.0.0/8           10.0.0.0   – 10.255.255.255   (16.7M addresses)
       172.16.0.0/12        172.16.0.0 – 172.31.255.255   (1M)
       192.168.0.0/16       192.168.0.0– 192.168.255.255  (65k)
       /24 = 256 addresses, /32 = exactly one host
```

The private ranges above are **RFC 1918** — not routable on the internet. Memorise them,
because they are the allow-list and the deny-list in half the rules you will ever write.

Two special addresses that matter disproportionately:

```
127.0.0.1        localhost. Binding here means "this machine only" — the cheapest
                 attack-surface reduction available.
169.254.169.254  the cloud metadata service. Chapter 16. This single address is the
                 payload of most SSRF exploitation.
```

> **The IPv6 trap:** firewall rules written only in `iptables` do not apply to IPv6, which
> uses `ip6tables`. A host with a public IPv6 address and IPv4-only rules is **wide open**
> while looking locked down. Check both, every time.

```bash
# Purpose: confirm whether this host has a routable IPv6 address, and whether your
# IPv6 firewall rules exist at all. An empty ip6tables with a global address is a
# silent hole.
ip -6 addr show scope global
sudo ip6tables -L -n -v | head -20
sudo nft list ruleset | grep -c "ip6\|inet"     # nftables handles both in one table
```

### NAT, and what it is not

Network Address Translation maps many private addresses onto one public address. It
incidentally blocks unsolicited inbound connections, which is why people call it a
security feature.

It is not one. NAT provides **no outbound filtering whatsoever**. Every piece of malware
on a NAT'd network connects out freely, and that is the direction that matters. NAT is
address conservation that happens to break inbound scanning. Do not count it as a control.

### The full path — a URL, annotated

What happens when a browser loads `https://imboni.rw/students`, with the security
question at each step:

```
 1. Browser cache / HSTS check     → is HTTP even allowed? (HSTS says no)
 2. DNS resolution                 → Chapter 3. Who answered, and were they lying?
 3. ARP for the gateway            → Chapter 6. Is that really the gateway?
 4. TCP handshake, port 443        → Chapter 4. Can an observer inject a RST?
 5. TLS handshake                  → cert valid? hostname match? which group?
                                     SNI is sent in CLEARTEXT (Chapter 8)
 6. HTTP request inside TLS        → cookies attached per SameSite rules
 7. Reverse proxy                  → X-Forwarded-For set? trusted? (Chapter 13)
 8. Application                    → authn, authz, the whole of 01-application-security/
 9. Database query                 → is this connection itself encrypted?
10. Response, logged               → what did you record? (nothing, currently)
```

Steps 2, 3 and 5 are network attacks that no amount of application security prevents.
Step 10 is the one you have not done.

### Advanced: routing and BGP

Between networks, BGP decides paths — and it works on **announcements that are largely
trusted**. An operator that announces your prefix can attract your traffic.

This has happened at scale repeatedly: traffic for large providers has been rerouted
through unexpected countries, and BGP hijacks have been used to intercept the domain
validation step of certificate issuance, obtaining valid certificates for domains the
attacker did not own.

You cannot defend your own BGP — you do not have any. What you can do:

- **CAA records** limit which CAs may issue for your domain, shrinking the hijack-plus-
  mis-issuance path
- **CT monitoring** (crypto Chapter 9) detects it after the fact
- **HSTS with a long max-age** means a one-off interception cannot downgrade you

```bash
# Purpose: restrict certificate issuance for your domain to one CA, so a hijack
# cannot easily obtain a valid certificate from a different one.
dig +short CAA imboni.rw
# expected: 0 issue "letsencrypt.org"
```

### Practice

1. Write out the three RFC 1918 ranges from memory. Check them.
2. Determine whether your VPS has a global IPv6 address and whether your rules cover it.
3. Add CAA records for both domains and verify with `dig`.
4. Walk the ten-step path for one real request in your own system and answer the security
   question at every step.

---

## Chapter 3: DNS

The most under-monitored protocol and the most useful one for detection.

### How a lookup works

```
Browser → stub resolver → recursive resolver (ISP / 8.8.8.8 / 1.1.1.1)
                              │
                              ├─▶ root servers        "ask .rw"
                              ├─▶ .rw TLD servers     "ask ns1.imboni.rw"
                              └─▶ authoritative NS    "it is 203.0.113.10"
```

Each step is cached with a TTL. Caching is what makes DNS fast and what makes poisoning
valuable — one successful poison serves every user behind that resolver until the TTL
expires.

### Records worth knowing

| Type | Holds | Security relevance |
|---|---|---|
| A / AAAA | IPv4 / IPv6 address | the target |
| CNAME | an alias | **dangling CNAME → subdomain takeover** |
| MX | mail servers | mail interception |
| TXT | arbitrary text | SPF, DKIM, DMARC, domain verification, **exfiltration** |
| NS | delegation | whole-zone takeover |
| CAA | permitted CAs | limits mis-issuance |
| PTR | reverse lookup | attribution, mail reputation |

**Subdomain takeover** is the one that bites small teams. You point `blog.imboni.rw` at a
hosting provider, later delete the hosted site, and leave the CNAME. Anyone can now claim
that hostname at the provider and serve content on *your* domain — with a valid
certificate, reading cookies scoped to `.imboni.rw`, and phishing your users convincingly.

```bash
# Purpose: find dangling DNS records pointing at services you no longer own.
# A CNAME that resolves to a provider hostname with NXDOMAIN behind it is a takeover
# waiting to happen.
for sub in www api blog staging dev old test admin cdn mail; do
  r=$(dig +short "$sub.imboni.rw" 2>/dev/null)
  [ -n "$r" ] && echo "$sub.imboni.rw -> $r"
done
```

### Mail authentication — the three records

Your SMTP credentials were stolen in September, which makes this directly relevant: these
records limit what an attacker can do while impersonating your domain.

```
SPF    TXT  "v=spf1 include:_spf.provider.com -all"
             which servers may send as you. -all = reject everything else.

DKIM   TXT  selector._domainkey  → public key
             signs outgoing mail; receivers verify it was not altered.

DMARC  TXT  _dmarc  "v=DMARC1; p=reject; rua=mailto:dmarc@imboni.rw"
             what to do when SPF/DKIM fail, and where to send reports.
```

```bash
# Purpose: check all three. Missing or permissive records mean anyone can send mail
# as your domain to the parents who trust it.
dig +short TXT imboni.rw | grep spf
dig +short TXT _dmarc.imboni.rw
# p=none is monitoring only. p=reject is the goal.
```

`p=none` is where everyone starts and most people stay. Moving to `p=reject` is the
control that actually stops impersonation, and it is free.

### DNS attacks

| Attack | Mechanism | Defence |
|---|---|---|
| **Cache poisoning** | inject a forged response the resolver accepts | source-port randomisation, 0x20 encoding, DNSSEC |
| **Kaminsky attack** | poison the delegation rather than one record — much more powerful | the above; fixed in 2008 by randomising ports |
| **Hijacking** | change records at the registrar | registrar lock, MFA on the registrar account |
| **Tunnelling** | encode data in subdomain labels to exfiltrate or carry C2 | monitor query length, entropy and volume per domain |
| **DGA** | malware generates pseudo-random domains to find its C2 | monitor NXDOMAIN rate, high-entropy names |
| **Rebinding** | low-TTL record flips to `127.0.0.1` after validation, bypassing SSRF filters | resolve once and pin; validate the resolved IP |

**Your registrar account is a single point of failure for everything.** Whoever controls
DNS can obtain certificates, redirect mail, and serve your site. MFA and a registrar lock
on that account are worth more than most of the application work in this curriculum.

### DNS as exfiltration — and why it works

```
Normal:   api.imboni.rw                              short, low entropy, repeated
Tunnel:   aGVsbG8gd29ybGQgdGhpcyBpcyBzdG9sZW4.evil.com    long, high entropy, unique
```

DNS is almost universally allowed outbound, even on networks that block everything else,
because without it nothing works. So it is the exfiltration channel of choice in
restricted environments, and the C2 channel of last resort.

```python
# Purpose: detect DNS tunnelling in resolver logs. Three signals together are
# strong: unusually long labels, high character entropy, and many unique
# subdomains under one parent domain.
import math, collections

def entropy(s: str) -> float:
    if not s:
        return 0.0
    counts = collections.Counter(s)
    return -sum((c / len(s)) * math.log2(c / len(s)) for c in counts.values())

def suspicious(qname: str) -> list[str]:
    labels = qname.rstrip(".").split(".")
    reasons = []
    longest = max(labels, key=len)
    if len(longest) > 40:
        reasons.append(f"long label ({len(longest)} chars)")
    if entropy(longest) > 4.0:
        reasons.append(f"high entropy ({entropy(longest):.1f} bits/char)")
    if len(qname) > 100:
        reasons.append("very long qname")
    return reasons

for q in ["api.imboni.rw",
          "aGVsbG8gd29ybGQgdGhpcyBpcyBzdG9sZW4gZGF0YQ.c2.evil.com"]:
    print(f"{q[:50]:52s} {suspicious(q) or 'ok'}")
```

Volume per parent domain is the fourth signal and the strongest: 4,000 unique subdomains
under one domain in an hour has no legitimate explanation outside a CDN.

### Encrypted DNS — both sides of it

| Protocol | Port | Effect |
|---|---|---|
| **Do53** | 53/udp | plaintext; anyone on the path reads and can modify |
| **DoT** | 853/tcp | DNS over TLS; encrypted, on a distinct port, so it is blockable |
| **DoH** | 443/tcp | DNS over HTTPS; indistinguishable from web traffic |
| **DoQ** | 853/udp | DNS over QUIC |

**DoH is good for user privacy and bad for your visibility.** It hides queries from the
network — including from *you*. Malware increasingly uses DoH precisely so its lookups do
not appear in your resolver logs.

The resolution for a network you administer: run your own resolver, log everything, and
**block outbound DoH to public resolvers** so clients must use yours. That is a real
privacy trade-off, made deliberately, and on a managed network it is the right call.

```bash
# Purpose: log every DNS query with its client, which is the highest-value, lowest-
# cost detection you can add. In the September incident this would have recorded
# the C2 domain the payload resolved.
# /etc/unbound/unbound.conf
#   server:
#     log-queries: yes
#     log-replies: yes
#     verbosity: 1

# Purpose: find the loudest and the rarest domains. Rare, high-entropy, repeated
# at a fixed interval is the C2 signature.
awk '{print $NF}' /var/log/unbound.log | sort | uniq -c | sort -rn | head -20
awk '{print $NF}' /var/log/unbound.log | sort | uniq -c | sort -n  | head -20
```

### Real-life application: the September DNS gap

The payload established command and control (ATT&CK **T1041**, exfiltration over C2). The
exfiltration is confirmed — Anthropic's Trust & Safety team saw the results.

What you do not know, and cannot now reconstruct: **which domain it contacted.** There is
no DNS log. With one, you would have the C2 domain, and from the C2 domain you could pivot
to the campaign, other victims, and the full capability — the Diamond Model pivot from
`01-SECURITY_FOUNDATIONS.md` Chapter 6.

That is a permanent gap in the investigation, caused by a missing log file.

```powershell
# Purpose: enable DNS client logging on Windows so this gap does not recur. The
# Microsoft-Windows-DNS-Client/Operational log is off by default.
wevtutil sl Microsoft-Windows-DNS-Client/Operational /e:true

# Purpose: read recent DNS queries from that log once it is enabled.
Get-WinEvent -LogName "Microsoft-Windows-DNS-Client/Operational" -MaxEvents 50 |
  Where-Object { $_.Id -eq 3006 } |
  Select-Object TimeCreated, @{n="Query"; e={$_.Properties[0].Value}}
```

Run that command. It is one line, it costs nothing, and it closes the exact gap that
makes the September investigation incomplete.

### Practice

1. Enable DNS client logging on your machine with the command above. Watch it for an hour
   and list every domain your machine contacted that you cannot explain.
2. Check SPF, DKIM and DMARC for both domains. Move DMARC to `p=reject` if it is not.
3. Add CAA records. Enable MFA and a registrar lock on the registrar account today.
4. Run the dangling-CNAME check. Account for every record returned.
5. Implement the tunnelling detector and run it against your own logs. Report false
   positives — CDNs will trigger it.

---

## Chapter 4: TCP, UDP and QUIC

### The TCP handshake, and the states that matter

```
Client                          Server
  │  SYN (seq=x)                  │        → server allocates state here
  │ ────────────────────────────▶ │
  │  SYN-ACK (seq=y, ack=x+1)     │
  │ ◀──────────────────────────── │
  │  ACK (ack=y+1)                │
  │ ────────────────────────────▶ │        → ESTABLISHED
```

Three security facts fall out of this:

**SYN floods work** because the server allocates memory after the first packet, before any
proof the client exists. Half-open connections exhaust the backlog. Defence: SYN cookies
(encode the state in the sequence number instead of storing it), which Linux enables by
default.

**Port scanning works** by not completing the handshake. A SYN scan sends SYN, reads the
reply, and sends RST — never establishing, often never logged by the application.

**TCP is trivially spoofable off-path only if sequence numbers are guessable.** Modern
stacks randomise them, which is why off-path injection is hard and on-path injection
(Chapter 6) is easy.

```bash
# Purpose: check SYN flood protection and the current connection state breakdown.
# A large SYN_RECV count with no matching ESTABLISHED is an active SYN flood.
sysctl net.ipv4.tcp_syncookies          # should be 1
ss -s
ss -tan | awk '{print $1}' | sort | uniq -c | sort -rn
```

### The flags, for reading captures

| Flag | Means | Seen in |
|---|---|---|
| SYN | open a connection | handshake, scans |
| ACK | acknowledging data | everything after the handshake |
| FIN | graceful close | normal shutdown |
| RST | abrupt reset | **closed port, or injected to kill a connection** |
| PSH | deliver now | interactive traffic |
| URG | urgent pointer | almost never legitimate; used in evasion |

A burst of RSTs you did not generate means either a closed-port scan response or
**active connection tampering** by something on the path — censorship equipment and
intrusion prevention systems both work this way.

### UDP and QUIC

UDP has no handshake, no state, no ordering. Which gives it two security properties:

- **Spoofing is trivial** — no handshake means no return-path proof. This makes UDP the
  basis of amplification: send a small spoofed query to a DNS or NTP server, it sends a
  large response to the victim.
- **Scanning it is unreliable** — a silent port is indistinguishable from a dropped
  packet, so UDP scans are slow and inconclusive.

**QUIC** (and HTTP/3 on top of it) runs over UDP on port 443 with TLS 1.3 built into the
transport. Its security consequence is about *visibility*: much of what was previously
readable TCP/TLS metadata is now encrypted inside QUIC, and middleboxes that inspect TLS
handshakes see much less. Firewalls that permit 443/udp without understanding QUIC are
permitting an opaque channel.

```bash
# Purpose: see whether QUIC is in use on your network. Unexpected 443/udp volume
# from a host is worth explaining.
sudo tcpdump -ni any 'udp port 443' -c 20
```

### Practice

1. Capture a TCP handshake with `tcpdump` and identify all three packets by flag.
2. Scan one of your own ports with `nmap -sS` and watch it in a capture. Confirm the
   connection is never established.
3. Check `tcp_syncookies` on your VPS.
4. Explain in two sentences why UDP enables amplification attacks and TCP does not.

---

## Chapter 5: Ports, services and enumeration

### Knowing what you expose

The first question in any assessment, of your own systems as much as anyone else's.

```bash
# Purpose: what is listening on THIS host, and on which interface. The address
# column is the security-relevant part: 0.0.0.0 means the internet can reach it,
# 127.0.0.1 means only this machine can.
ss -tlnp
# LISTEN 0 128 127.0.0.1:5432  → Postgres, localhost only          ✓ correct
# LISTEN 0 128   0.0.0.0:5432  → Postgres, THE ENTIRE INTERNET     ✗ incident
# LISTEN 0 511   0.0.0.0:443   → nginx                              ✓ intended
# LISTEN 0 128   0.0.0.0:6379  → Redis, no auth by default          ✗ incident
```

```powershell
# Purpose: the same question on Windows, with the owning process, which is how you
# attribute an unexpected listener.
Get-NetTCPConnection -State Listen |
  Select-Object LocalAddress, LocalPort,
    @{n="Process"; e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name}} |
  Sort-Object LocalPort | Format-Table -AutoSize
```

Redis and Postgres bound to `0.0.0.0` are two of the most common causes of real data
breaches in small deployments — both default to no authentication or weak authentication
on the assumption that they are not reachable. Check yours now rather than later.

### Scanning, and what each type means

```bash
# Purpose: the standard first scan. -sS is a SYN (half-open) scan, -sV fingerprints
# service versions, -O guesses the OS. Run this against YOUR OWN hosts only.
sudo nmap -sS -sV -O -p- --min-rate 1000 203.0.113.10

# Purpose: the fast default - top 1000 ports, service detection, default scripts.
nmap -sC -sV 203.0.113.10

# Purpose: UDP, which is slow and often skipped - and therefore where forgotten
# services live.
sudo nmap -sU --top-ports 50 203.0.113.10

# Purpose: see it from the outside, which is the only view that matters. Your own
# host's firewall may permit what a cloud security group blocks, or vice versa.
nmap -Pn -p 22,80,443,5432,6379,3306,27017 your.public.ip
```

| Scan | Flag | Property |
|---|---|---|
| SYN / half-open | `-sS` | fast, rarely logged by the application, needs root |
| Connect | `-sT` | completes the handshake, always logged, no root needed |
| UDP | `-sU` | slow, ambiguous, finds forgotten services |
| Version detection | `-sV` | banner and probe based; the actually useful part |
| Script scan | `-sC` | default NSE scripts — finds known misconfigurations |
| Idle / zombie | `-sI` | source-spoofed via a third host; mostly historical |

> **Authorisation.** Scanning hosts you do not own is unlawful in most jurisdictions,
> including under Rwanda's Law No. 60/2018 on cybercrime. Scan your own VPS, your own LAN,
> and deliberately vulnerable targets. `../05-offensive-security/` covers scope and
> authorisation properly, and it is not optional reading before you point `nmap` anywhere
> unfamiliar.

### Advanced: what a service banner gives away

```bash
# Purpose: grab a banner manually, which is what -sV automates. Version strings
# are what an attacker feeds into a CVE search.
nc -v imboni.rw 22
# SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4   ← exact version AND distribution

curl -sI https://imboni.rw | grep -i "server\|x-powered\|x-"
# Server: nginx/1.18.0 (Ubuntu)             ← same problem
# X-Powered-By: Django                      ← unnecessary disclosure
```

Hiding versions is **obscurity, not security** — the honest framing from
`01-SECURITY_FOUNDATIONS.md` Chapter 10's open-design principle. It does not stop a
determined attacker, who will fingerprint behaviour instead. It does remove you from
automated mass-exploitation scans that filter by banner, which is a genuine reduction in
the commodity risk from Chapter 3 of that file.

```nginx
# Purpose: stop advertising the exact nginx version. Cheap, and it removes you from
# version-filtered scan lists.
server_tokens off;
```

```python
# Purpose: remove Django's framework disclosure header.
# settings.py — middleware or nginx can strip it
SECURE_REFERRER_POLICY = "no-referrer"
# and in nginx:  proxy_hide_header X-Powered-By;
```

### Practice

1. Run `ss -tlnp` on your VPS. Justify every listener. Bind to localhost anything that
   does not need to be public.
2. Scan your own public IP from outside. Compare the result against `ss` output — any
   difference is a firewall or security group you misunderstood.
3. Run a UDP scan of your own host. Find something you forgot about.
4. Banner-grab your own SSH and HTTP. Search for CVEs in the exact versions returned.
5. Set `server_tokens off` and verify the header is gone.

---

# PART 2 — WHO IS ON THE WIRE

## Chapter 6: The LAN is hostile

### ARP has no authentication

Address Resolution Protocol maps IP addresses to MAC addresses on a local network, and it
has **no authentication at all**. Any host can claim any IP.

```
Normal:      "Who has 192.168.1.1?"  →  gateway: "I do, MAC aa:bb:cc:dd:ee:ff"
ARP spoof:   attacker, unprompted:   "192.168.1.1 is at 11:22:33:44:55:66"
             → your machine believes it → all your traffic goes via the attacker
```

This is a two-command attack with public tools. The consequence is a full
machine-in-the-middle position: the attacker sees every unencrypted byte, can inject RSTs,
can attempt TLS downgrade, can serve forged DNS, and can capture any credential sent over
a plaintext protocol.

```bash
# Purpose: detect ARP spoofing by looking for one MAC claiming several IPs, or the
# gateway's MAC changing. Both are the signature.
ip neigh show
arp -a | sort -k4
# Two IPs sharing one MAC, or the gateway MAC differing from yesterday, is the tell.

# Purpose: continuous detection on a network you administer.
sudo arpwatch -i eth0        # emails on every MAC/IP pairing change
```

Mitigations, honestly ranked: static ARP entries for critical hosts (unmanageable at
scale), dynamic ARP inspection on managed switches (the real answer, needs the hardware),
and **assume the LAN is hostile and encrypt everything anyway** (the answer that always
works).

That last one is the practical conclusion, and it is why the trust-boundary model in
`01-SECURITY_FOUNDATIONS.md` Chapter 4 does not treat "inside the network" as inside
anything.

### The rest of the LAN attack set

| Attack | Mechanism | Defence |
|---|---|---|
| **MAC flooding** | fill the switch's CAM table so it fails open and broadcasts everything | port security, limit MACs per port |
| **DHCP spoofing** | answer DHCP first, become the gateway and the DNS server | DHCP snooping on the switch |
| **Rogue AP / evil twin** | broadcast the same SSID, stronger signal; clients connect | 802.1X, WPA3, certificate-based auth |
| **VLAN hopping** | double-tagged frames, or negotiating a trunk port | disable DTP, set native VLAN to an unused one |
| **LLMNR / NBT-NS poisoning** | answer Windows' fallback name resolution, capture NTLM hashes | **disable LLMNR and NBT-NS** |
| **IPv6 RA spoofing** | send router advertisements; IPv6 is preferred over IPv4 | RA Guard; do not leave IPv6 unmanaged |

The LLMNR row is the highest-value one on a Windows network and is almost always left
enabled. Windows falls back to LLMNR/NBT-NS when DNS fails, an attacker answers "that's
me", and the client authenticates to them — handing over NTLMv2 hashes for offline
cracking or relay. Disabling both is a single policy change with no legitimate loss.

```powershell
# Purpose: disable LLMNR, which exists only as a fallback and is used almost
# exclusively by attackers on modern networks.
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" `
  -Name "EnableMulticast" -Value 0 -Type DWord

# Purpose: check whether IPv6 router advertisements are being accepted from
# anywhere, which is how an attacker becomes your preferred gateway.
Get-NetIPInterface | Where-Object { $_.AddressFamily -eq "IPv6" } |
  Select-Object InterfaceAlias, RouterDiscovery, Dhcp
```

### Practice

1. Record your gateway's MAC address. Check it weekly. Any change you did not cause is an
   incident.
2. Set up `arpwatch` on your LAN for a week and report what it saw.
3. Disable LLMNR and NBT-NS on your Windows machine.
4. In a lab you own, perform an ARP spoof between two of your own devices and capture a
   plaintext credential. Then repeat it against an HTTPS site and document what you can
   and cannot see.

---

## Chapter 7: Wi-Fi

### The protocol generations

| Protocol | Status | Break |
|---|---|---|
| **WEP** | broken since 2001 | RC4 IV reuse; key recovered in minutes |
| **WPA/TKIP** | broken | deprecated, do not use |
| **WPA2-PSK** | acceptable, with caveats | **handshake/PMKID capture → offline cracking** |
| **WPA2-Enterprise** | good | per-user credentials via 802.1X/RADIUS |
| **WPA3-SAE** | **current best** | SAE resists offline cracking; forward secrecy |

The WPA2-PSK caveat is the practically important one. An attacker captures the 4-way
handshake — or just the PMKID, which requires no client at all — and then cracks the
passphrase **offline**, at GPU speed, with no further contact with your network. There is
no rate limiting and no lockout, because the attack happens on their hardware.

Which means a WPA2 network's security is exactly the strength of its passphrase against
the password-cracking rates from the cryptography file, Chapter 3. `Imboni2026` falls in
under a second. A five-word random passphrase does not fall.

**WPA3's SAE** (Simultaneous Authentication of Equals) fixes this structurally: the
handshake does not permit offline cracking, so a weak password is only attackable online,
one guess at a time. That is the upgrade worth making.

```bash
# Purpose: see which security mode your own networks use. Anything not WPA2 or WPA3
# should be changed today.
nmcli -f SSID,SECURITY,CHAN,SIGNAL device wifi list

# Purpose: on Windows, show the saved key and the authentication type for a profile.
# Run against your OWN network only.
# netsh wlan show profile name="YourSSID" key=clear
```

### Deauthentication and the public-Wi-Fi reality

802.11 management frames are unauthenticated in WPA2, so anyone can send a deauth frame
and knock clients off. Used to force a reconnection, so the handshake can be captured, and
to push clients onto an evil twin. **WPA3 and 802.11w (protected management frames) fix
it.**

On public Wi-Fi, be precise about the actual risk, because the folklore is outdated:

| Risk | Real in 2026? |
|---|---|
| Reading your HTTPS traffic | **no** — TLS holds, assuming you do not click through warnings |
| Seeing which sites you visit | **yes** — DNS and SNI (Chapter 8) |
| Injecting into plaintext HTTP | yes, and HSTS is the defence |
| Captive portal credential phishing | yes |
| Attacking services listening on your laptop | **yes** — and this is the underrated one |

That last row is why a host firewall matters on a laptop. Your development server on
`0.0.0.0:8000`, your Redis, your Postgres — all reachable by everyone in the café. Bind
development services to `127.0.0.1`.

```bash
# Purpose: the single most useful habit for development on untrusted networks.
python manage.py runserver 127.0.0.1:8000      # not 0.0.0.0:8000
```

### Practice

1. Check which WPA version your home and phone hotspot use. Move to WPA3 where supported.
2. Audit your Wi-Fi passphrase against the offline-cracking rates from the crypto file.
   Replace it if it would fall in under a year.
3. List every service listening on `0.0.0.0` on your laptop right now. Rebind them.
4. In a lab you own, capture your own WPA2 handshake and attempt to crack a deliberately
   weak passphrase. Then try a five-word one and stop when you understand the difference.

---

## Chapter 8: What TLS does not hide

The cryptography is in `03-CRYPTOGRAPHY_ESSENTIALS.md` Chapter 9. This is the network
view: what an observer still learns.

### The leakage

```
VISIBLE to anyone on the path, with TLS 1.3:
  • your IP and the server's IP          → who you are talking to
  • ports                                → what kind of service
  • SNI in the ClientHello               → the HOSTNAME, in cleartext
  • certificate (TLS 1.2) / none (1.3)   → 1.3 encrypts the certificate
  • packet sizes and timing              → page fingerprinting
  • connection duration and volume       → behaviour
  • TLS fingerprint (JA3/JA4)            → which client software you are running

HIDDEN:
  • URLs, headers, cookies, bodies, credentials
```

**SNI is the big one.** Server Name Indication is sent in cleartext so that a server
hosting many domains knows which certificate to present. So an observer learns every
hostname you visit, even though they cannot read any content.

For Screening, that is a meaningful privacy leak: a network observer — a school, an ISP, a
family member on the same LAN — learns that a device connected to a mental-health screening
service. That is the LINDDUN *Detecting* threat from `01-SECURITY_FOUNDATIONS.md`
Chapter 7, appearing again at the network layer. The content is protected; the fact of
the visit is not.

**Encrypted Client Hello (ECH)** encrypts SNI and is the fix. Adoption is partial and it
requires support from the client, the server and DNS (the public key is published in an
HTTPS/SVCB record). Enable it where your CDN offers it; it is one of the few genuine
privacy improvements available by configuration.

```bash
# Purpose: see what an observer sees. The SNI is in the ClientHello in cleartext,
# before any encryption begins - which this capture demonstrates directly.
sudo tcpdump -ni any -s0 -A 'tcp port 443 and tcp[((tcp[12:1] & 0xf0) >> 2)] = 0x16' -c 5 \
  | grep -a -o "imboni\.rw\|[a-z0-9.-]*\.rw"

# Purpose: check whether a domain publishes an ECH configuration.
dig +short HTTPS imboni.rw
```

### Advanced: TLS fingerprinting

Your TLS client announces its supported ciphers, extensions and curves in a specific
order. That ordering is characteristic of the software — Chrome, Firefox, Python
`requests`, Go, curl, and specific malware families each have a recognisable signature.
**JA3** and the newer **JA4** hash it into a comparable fingerprint.

Both directions matter:

- **Defensively**, a JA3/JA4 fingerprint that is not a browser, arriving at your login
  endpoint, is a strong bot signal — and it is much harder to forge than a `User-Agent`.
- **Offensively**, it is how security products identify malware C2 traffic inside TLS
  without decrypting it, which is how the September payload's traffic would have been
  classified by an EDR that was watching.

### Practice

1. Capture your own TLS handshake and extract the SNI from the cleartext ClientHello.
2. Check whether your domains and your CDN support ECH.
3. Write down what a school network administrator learns about a pupil using Screening,
   assuming perfect TLS. Then decide whether that changes a design decision.
4. Compare the JA3 fingerprint of `curl` and of your browser against the same endpoint.

---

## Chapter 9: Traffic analysis

Even with everything encrypted, patterns talk.

| Observable | Reveals |
|---|---|
| Packet sizes | which page or action, via fingerprinting |
| Timing between packets | typing, interactivity, voice |
| Volume per flow | download versus upload, file size |
| **Periodicity** | **automated beaconing — the C2 signature** |
| Destination reputation | known-bad infrastructure |
| New destinations | first-time contact with an unknown host |

### Beaconing — the detection that matters

Malware calls home on a schedule. Humans do not. A connection to the same destination
every 300 seconds, ±2 seconds, with a near-constant payload size, is **not a person**.

```python
# Purpose: detect C2 beaconing in connection logs. Low variance in the interval
# between connections to one destination is the signal; humans are irregular.
import statistics
from collections import defaultdict

def find_beacons(connections, min_count=12, max_cv=0.15):
    """connections: list of (timestamp, dest_ip). Returns likely beacons."""
    by_dest = defaultdict(list)
    for ts, dest in sorted(connections):
        by_dest[dest].append(ts)

    beacons = []
    for dest, times in by_dest.items():
        if len(times) < min_count:
            continue
        gaps = [b - a for a, b in zip(times, times[1:])]
        mean = statistics.mean(gaps)
        if mean == 0:
            continue
        cv = statistics.stdev(gaps) / mean          # coefficient of variation
        if cv < max_cv:
            beacons.append((dest, round(mean, 1), round(cv, 3), len(times)))
    return sorted(beacons, key=lambda b: b[2])

# dest            interval   cv      count
# 203.0.113.50    300.0      0.004   48     ← beacon. Nothing human does this.
# 142.250.200.14   37.2      0.812   22     ← normal browsing
```

A coefficient of variation below about 0.15 over a dozen connections is a strong signal.
Sophisticated malware adds jitter to defeat this, which raises the CV — so the arms race
is real, but most commodity malware does not bother.

This detection requires only **connection metadata**: timestamp and destination. No packet
contents, no decryption. Which means you could run it today from firewall logs, if you
kept any.

### Practice

1. Collect your own outbound connection metadata for an hour (`ss -tn` on a loop, or
   firewall logs).
2. Run the beacon detector. You will find legitimate beacons — update checkers, telemetry,
   keepalives. Identify each.
3. Write down which of them you could not identify. That is your baseline problem: you
   cannot spot an anomaly without knowing normal.

---

# PART 3 — CONTROLS

## Chapter 10: Firewalls

### The three kinds

| Kind | Decides on | Blind to |
|---|---|---|
| **Stateless packet filter** | each packet in isolation | connection context; needs rules for both directions |
| **Stateful firewall** | connection state (NEW / ESTABLISHED / RELATED) | payload |
| **Application firewall / WAF** | layer-7 content | anything encrypted it cannot terminate |

Stateful is the baseline, and it is what makes the policy in the next section short: allow
established traffic back in automatically, and reason only about new connections.

### The policy that is actually correct

```bash
# Purpose: a complete default-deny nftables policy, in BOTH directions. The output
# chain is the part almost everyone omits, and it is the part that stops
# exfiltration and C2.
sudo tee /etc/nftables.conf >/dev/null <<'EOF'
#!/usr/sbin/nft -f
flush ruleset

table inet filter {
  chain input {
    type filter hook input priority 0; policy drop;

    ct state established,related accept
    iif lo accept
    ip protocol icmp icmp type { echo-request, echo-reply, destination-unreachable } accept
    ip6 nexthdr icmpv6 accept

    tcp dport 22 ct state new limit rate 10/minute accept   comment "ssh, rate limited"
    tcp dport { 80, 443 } ct state new accept               comment "web"

    counter comment "count what the policy drops"
  }

  chain forward {
    type filter hook forward priority 0; policy drop;
  }

  chain output {
    type filter hook output priority 0; policy drop;        # ← THE IMPORTANT LINE

    ct state established,related accept
    oif lo accept

    udp dport 53 accept                                     comment "dns"
    tcp dport 53 accept
    tcp dport { 80, 443 } accept                            comment "updates, apis"
    udp dport 123 accept                                    comment "ntp"
    tcp dport 25 accept                                     comment "smtp"

    counter log prefix "EGRESS-DROP " comment "see what wanted out"
  }
}
EOF

sudo nft -f /etc/nftables.conf && sudo systemctl enable --now nftables
sudo nft list ruleset
```

Four things about that policy worth stating explicitly:

1. **`policy drop` on output.** This is the line that distinguishes a real firewall policy
   from the usual one. Almost every deployment allows all outbound traffic.
2. **The SSH rate limit** turns brute-forcing from thousands of attempts per minute into
   ten, without `fail2ban`.
3. **`counter log prefix "EGRESS-DROP "`** makes blocked outbound attempts *visible*. That
   log line is your malware detector.
4. **`inet`** covers both IPv4 and IPv6 in one table, which closes the IPv6 gap from
   Chapter 2.

The simpler version, for a host where `ufw` is already in use:

```bash
# Purpose: default-deny in both directions with ufw, which is adequate for a single
# VPS and far better than the default outgoing-allow.
sudo ufw default deny incoming
sudo ufw default deny outgoing          # ← the uncommon half
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw allow out 53
sudo ufw allow out 80,443/tcp
sudo ufw allow out 123/udp
sudo ufw logging on
sudo ufw enable
sudo ufw status verbose
```

### Cloud security groups are a separate firewall

A critical operational point: a cloud security group and the host firewall are **two
independent controls**, and traffic must pass both. People debug for hours having changed
one.

```bash
# Purpose: confirm what the cloud layer permits, independently of the host. Oracle
# Cloud (which you use) also has per-subnet security lists AND network security
# groups - check both.
# Then always verify from OUTSIDE:
nmap -Pn -p 22,80,443,5432,6379 your.public.ip
```

Oracle Cloud specifically defaults to restrictive security lists *and* an iptables ruleset
baked into its Ubuntu images — which is a frequent cause of "my port is open but nothing
connects". See `../../engineering-curriculum/05-deployment/08-ORACLE_FREE_SETUP.md`.

### Practice

1. Write and apply a default-deny **output** policy on your VPS. Watch the `EGRESS-DROP`
   log for a day and add only what is genuinely needed.
2. Verify your rules cover IPv6.
3. Scan your public IP from outside and reconcile against both the host firewall and the
   cloud security group.
4. Add the SSH rate limit and confirm from the auth log that brute-force attempts drop.

---

## Chapter 11: Egress filtering — the September control

This chapter exists because it is the one network control that would have changed the
outcome of your own incident, and it is the one that is almost never implemented.

### The asymmetry

Everyone filters ingress. Almost nobody filters egress. But look at where the damage
happens in the kill chain:

```
Ingress filtering stops:   stage 3 (delivery) — sometimes
Egress filtering stops:    stage 6 (C2) and stage 7 (exfiltration) — reliably
```

Stages 6 and 7 are where your *data leaves*. An attacker who achieves code execution but
cannot establish command and control has achieved very little. The payload runs, finds
nothing to talk to, and sits there.

### What it would have done

```
What happened:
  MSBuild.exe loaded a payload → payload resolved a C2 domain → connected out
  → sent .env contents, SSH key files, browser credentials, session cookies
  → nothing logged, nothing blocked, nothing alerted

With egress filtering on the laptop:
  payload attempts outbound connection → DROPPED → logged
  → "EGRESS-DROP from MSBuild.exe to 203.0.113.50:443"
  → an alert naming the process and the destination
  → you investigate on day one instead of day five, and the data never leaves
```

The data theft is the irreversible part of that incident. Everything else — the hidden
task, the quarantine, the reboot — was recoverable. Egress filtering is the control that
addresses the irreversible part.

### Doing it on Windows

Windows Defender Firewall supports outbound rules and defaults to allowing all outbound
traffic. Changing that default is disruptive, so the workable approach is to block
*specific high-risk binaries* that have no legitimate reason to reach the internet.

```powershell
# Purpose: block outbound network access for the LOLBINs that malware uses as a
# network stack. None of these need to reach the internet on a developer laptop,
# and MSBuild.exe is precisely what was abused in September (ATT&CK T1127.001).
# Run as Administrator.
$lolbins = @(
  "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe",
  "C:\Windows\Microsoft.NET\Framework\v4.0.30319\MSBuild.exe",
  "C:\Windows\System32\mshta.exe",
  "C:\Windows\System32\wscript.exe",
  "C:\Windows\System32\cscript.exe",
  "C:\Windows\System32\regsvr32.exe",
  "C:\Windows\System32\rundll32.exe",
  "C:\Windows\System32\certutil.exe",
  "C:\Windows\System32\bitsadmin.exe"
)

foreach ($p in $lolbins) {
  if (Test-Path $p) {
    $name = "Block egress - $(Split-Path $p -Leaf)"
    if (-not (Get-NetFirewallRule -DisplayName $name -ErrorAction SilentlyContinue)) {
      New-NetFirewallRule -DisplayName $name -Direction Outbound -Program $p `
        -Action Block -Profile Any -Enabled True | Out-Null
      Write-Host "blocked: $p"
    }
  }
}
```

Two caveats, stated honestly rather than buried:

- **`rundll32.exe` and `certutil.exe` have legitimate uses.** Blocking their *network*
  access is usually safe; test on your own machine and be ready to remove a rule. If you
  build .NET projects locally, MSBuild may need network access for NuGet restore — in
  which case block the Framework copies and allow the Visual Studio one, or allow it only
  to your package feed.
- **This is not a complete control.** Malware can inject into an allowed process. It
  raises the cost substantially, which is the realistic goal from
  `01-SECURITY_FOUNDATIONS.md` Chapter 1.

```powershell
# Purpose: turn on firewall logging, including dropped packets, so blocked egress
# produces evidence rather than silence.
Set-NetFirewallProfile -All -LogBlocked True -LogAllowed False `
  -LogFileName "%systemroot%\system32\LogFiles\Firewall\pfirewall.log" -LogMaxSizeKilobytes 32767

# Purpose: read what was blocked. This file is the thing that did not exist in
# September.
Get-Content "$env:systemroot\system32\LogFiles\Firewall\pfirewall.log" -Tail 40
```

### On the server

For a server the rules are easier, because a server's legitimate outbound traffic is a
short, knowable list: package repositories, your SMTP provider, your payment provider,
NTP, DNS. Everything else is suspicious by definition.

The output chain in Chapter 10 is that policy. Write it once, read the drop log for a
week, and you have both a control and a detection.

### Practice

1. Apply the LOLBIN egress block on your laptop. Enable firewall logging.
2. Apply a default-deny output policy on the VPS. Read the drop log daily for a week.
3. From the drop log, write the list of destinations your server legitimately needs. That
   list is your allow-list and your inventory.
4. Simulate the attack: have a test script attempt an outbound connection from a blocked
   binary. Confirm it is blocked *and* logged.

---

## Chapter 12: Segmentation, VPNs and tunnels

### Segmentation

Divide the network so a compromise in one place does not reach another — the blast-radius
reduction from `01-SECURITY_FOUNDATIONS.md` Chapter 13, applied to topology.

```
Flat (what most small deployments have):
  [ web ] [ db ] [ cache ] [ laptop ] [ printer ]   all mutually reachable
  → compromise any one, reach all

Segmented:
  DMZ:       [ nginx ]              ← internet-facing, nothing else
  App tier:  [ django ] [ celery ]  ← reachable only from the DMZ
  Data tier: [ postgres ] [ redis ] ← reachable only from the app tier
  Admin:     [ bastion ]            ← the only SSH entry point
```

On a single VPS you cannot segment physically, and the equivalent is still available:
bind each service to localhost, give each its own system user, run each with its own
database credentials, and use the output chain to limit what each can reach.

### WireGuard

The modern VPN: small, fast, auditable, and simple enough to configure correctly.

```ini
# Purpose: a WireGuard server config. AllowedIPs on the server side is a routing
# AND an authorisation statement - a peer may only use the addresses listed.
# /etc/wireguard/wg0.conf  (server)
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = <server private key>
PostUp   = nft add rule inet filter forward iifname wg0 oifname eth0 accept
PostDown = nft delete rule inet filter forward iifname wg0 oifname eth0 accept

[Peer]
# laptop
PublicKey = <laptop public key>
AllowedIPs = 10.8.0.2/32            # exactly one address. Not 10.8.0.0/24.
```

```ini
# Purpose: the client side. Restricting AllowedIPs to the server's subnet is
# split tunnelling - only VPN-destined traffic goes through it.
# /etc/wireguard/wg0.conf  (laptop)
[Interface]
Address = 10.8.0.2/24
PrivateKey = <laptop private key>
DNS = 10.8.0.1

[Peer]
PublicKey = <server public key>
Endpoint = 203.0.113.10:51820
AllowedIPs = 10.8.0.0/24            # split tunnel; use 0.0.0.0/0 for full tunnel
PersistentKeepalive = 25
```

The security point to notice: `AllowedIPs` on the server is **cryptographic
authorisation**, not just routing. A peer cannot source traffic from an address outside its
`AllowedIPs` — WireGuard drops it. Setting it to `0.0.0.0/0` for a peer gives that peer
the right to impersonate any address, which is exactly the mistake that turns a VPN into a
liability.

And the thing a VPN does **not** do: it does not make the remote network trustworthy. It
moves your trust boundary, it does not remove it. A compromised laptop on a VPN is a
compromised machine *inside* your network — which is the zero-trust argument from
`01-SECURITY_FOUNDATIONS.md` Chapter 12.

### SSH tunnelling

Useful, and an exfiltration path worth understanding in both directions:

```bash
# Purpose: local forward - reach the server's Postgres from your laptop without
# exposing 5432 to the internet. This is the CORRECT way to do database admin.
ssh -L 5432:localhost:5432 user@203.0.113.10
psql -h localhost -p 5432 -U imboni_app imboni_prod

# Purpose: remote forward - expose a port on the SERVER to reach back into your
# laptop. Legitimate for demos; also how attackers get a foothold past a NAT.
ssh -R 8080:localhost:3000 user@203.0.113.10

# Purpose: dynamic forward - a SOCKS proxy through the server. Legitimate for
# testing geography; also a full tunnel out of a restricted network.
ssh -D 1080 user@203.0.113.10
```

```bash
# Purpose: refuse the forwarding types you do not need. A compromised account
# cannot then use your server as a pivot or a tunnel endpoint.
# /etc/ssh/sshd_config
AllowTcpForwarding no        # or: local
GatewayPorts no
PermitTunnel no
AllowAgentForwarding no      # agent forwarding lets the remote host use YOUR keys
```

`AllowAgentForwarding no` deserves emphasis. Agent forwarding (`ssh -A`) lets a server you
connect to use your local SSH keys to authenticate elsewhere — so a compromised server can
hop onward *as you*. Use `ProxyJump` instead, which does not expose the agent:

```bash
# Purpose: reach an internal host through a bastion WITHOUT exposing your agent to
# the bastion. This is the safe replacement for ssh -A.
ssh -J bastion.imboni.rw internal-db.imboni.rw
```

### Practice

1. Set up WireGuard between your laptop and your VPS. Verify a peer cannot source traffic
   from outside its `AllowedIPs`.
2. Move all database administration to an SSH local forward and remove any public exposure
   of 5432.
3. Harden `sshd_config` with the forwarding restrictions. Confirm legitimate access still
   works.
4. Replace any use of `ssh -A` in your workflow with `ProxyJump`.

---

## Chapter 13: Proxies, load balancers and the headers that lie

### The trust problem

Behind a reverse proxy, the application sees the *proxy's* IP for every request. So the
real client IP arrives in a header — and headers are attacker-controlled.

```python
# Purpose: WRONG. The client sets this header, so rate limiting, geolocation,
# audit logs and IP allow-lists are all trivially bypassed.
client_ip = request.headers.get("X-Forwarded-For", "").split(",")[0]

# Purpose: WRONG in the opposite direction. Django's setting trusts the header
# without validating the proxy chain.
# USE_X_FORWARDED_HOST = True   with no proxy validation

# Purpose: RIGHT. Only trust the header when the request actually came from YOUR
# proxy, and take the right element of the chain.
TRUSTED_PROXIES = {"127.0.0.1", "10.0.0.2"}

def client_ip(request) -> str:
    peer = request.META["REMOTE_ADDR"]
    if peer not in TRUSTED_PROXIES:
        return peer                                  # direct connection; ignore headers
    chain = [ip.strip() for ip in
             request.META.get("HTTP_X_FORWARDED_FOR", "").split(",") if ip.strip()]
    return chain[-1] if chain else peer               # rightmost = added by YOUR proxy
```

The "rightmost" detail is the part people get wrong. Each proxy *appends* to
`X-Forwarded-For`, so the leftmost value is whatever the client claimed and the rightmost
is what your own proxy observed. Taking `[0]` takes the attacker's input.

```nginx
# Purpose: have nginx set the headers correctly, overwriting rather than appending
# to anything the client sent.
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;      # authoritative
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Advanced: HTTP request smuggling

When a front-end proxy and a back-end server disagree about where one request ends and the
next begins, an attacker can smuggle a second request inside the first — bypassing the
proxy's access controls, poisoning the response queue, and serving their content to other
users.

The disagreement comes from conflicting length indicators:

```
POST / HTTP/1.1
Content-Length: 13
Transfer-Encoding: chunked      ← two length headers, two interpretations

0

SMUGGLED
```

If the front end uses `Content-Length` and the back end uses `Transfer-Encoding` (or the
reverse), the leftover bytes become the start of the *next* request on that connection —
which may belong to another user.

Defences: use HTTP/2 end to end (the framing is unambiguous), reject any request
containing both headers, and keep your proxy and server versions aligned. This is a class
to be aware of rather than one you will debug often — but it is the reason "the proxy
checked authorisation" is not a complete argument.

### WAFs, honestly

A WAF inspects layer-7 content and blocks known attack patterns. What it is genuinely good
for: buying time against a known CVE you cannot patch today, blocking commodity scanners,
and rate limiting.

What it is not: a substitute for fixing the bug. WAF rules are pattern matching, and
patterns are bypassed — encoding, case, comments, fragmentation, parameter pollution.
Recall the ALE calculation in `01-SECURITY_FOUNDATIONS.md` Chapter 8: a WAF would have had
**zero** effect on the September incident, because nothing came through the web
application.

Deploy one if it is free with your CDN. Do not let it appear in a threat model as the
control for anything.

### Practice

1. Test your own client-IP handling: send a forged `X-Forwarded-For` directly to the
   application and see whether it is believed.
2. Verify your rate limiting cannot be bypassed by a header.
3. Confirm your audit logs record the real client IP, not the proxy's.
4. Check whether your stack rejects requests carrying both `Content-Length` and
   `Transfer-Encoding`.

---

## Chapter 14: Detection on the network

### What to deploy, in order of value per hour spent

| Tool | Gives you | Effort |
|---|---|---|
| **DNS query logging** | every domain contacted — the highest-value log | minutes |
| **Firewall drop logging** | blocked egress attempts, with process on Windows | minutes |
| **NetFlow / conn logs** | who talked to whom, when, how much | hours |
| **Zeek** | structured protocol logs — HTTP, DNS, TLS, files, connections | a day |
| **Suricata** | signature-based IDS/IPS with a community ruleset | a day |
| **Full packet capture** | everything, briefly — storage is the limit | ongoing |

The ordering is deliberate and it is the answer to "where do I start?". DNS logging costs
ten minutes and would have given you the September C2 domain. Full packet capture costs
terabytes and you would not have read it.

### Zeek, which is what you want if you deploy one thing

Zeek produces structured logs rather than alerts, which makes it an *investigation* tool
rather than an alarm:

```bash
# Purpose: run Zeek over a capture file and produce structured protocol logs.
zeek -r capture.pcap
ls
# conn.log  dns.log  http.log  ssl.log  files.log  notice.log  x509.log

# Purpose: conn.log is the one you will use most - every connection with duration
# and byte counts in both directions. This finds large uploads.
zeek-cut id.orig_h id.resp_h id.resp_p proto duration orig_bytes resp_bytes < conn.log \
  | sort -k7 -rn | head -20

# Purpose: dns.log answers "what did this machine look up?" - the September question.
zeek-cut ts id.orig_h query answers < dns.log | head -40

# Purpose: ssl.log records the SNI for every TLS connection, so you get hostnames
# even without decryption.
zeek-cut id.orig_h server_name validation_status < ssl.log | sort | uniq -c | sort -rn
```

`orig_bytes` on `conn.log` is the exfiltration detector: a workstation uploading 400 MB to
an unfamiliar host is the finding, and no signature is required to see it.

### Suricata

Signature-based: a large community ruleset matching known malicious traffic, including C2
patterns and JA3 fingerprints.

```bash
# Purpose: install Suricata with the free Emerging Threats ruleset and run it in
# IDS mode (detect and log, do not block).
sudo apt install suricata
sudo suricata-update
sudo systemctl enable --now suricata
sudo tail -f /var/log/suricata/fast.log
```

Its limit is the limit of all signature detection, and it is the Pyramid of Pain argument
from `01-SECURITY_FOUNDATIONS.md` Chapter 6: it catches *known* badness. The September
loader was not known. Pair signatures with the behavioural detections in Chapter 9 —
beaconing, volume anomalies, first-contact destinations — because those catch what has no
signature yet.

### Practice

1. Enable DNS logging and firewall drop logging on both your laptop and the VPS. This is
   today's work and it closes your largest gap.
2. Capture an hour of your own traffic, run Zeek over it, and answer three questions from
   the logs: which hostnames, which destination received the most bytes, and which
   connections were periodic.
3. Install Suricata on the VPS in IDS mode. Read `fast.log` for a week and triage
   everything it reports.
4. Write down your network detection coverage as a list of what you *would* see: a port
   scan, a brute force, a beacon, a large upload, a new destination. Honest yes or no for
   each.

---

## Chapter 15: Capturing and reading traffic

The practical skill. You will do this during an incident, and it is a bad time to learn
the filter syntax.

### tcpdump

```bash
# Purpose: capture to a file for later analysis. -s0 takes full packets, -w writes
# pcap. Always capture to a file; analyse afterwards.
sudo tcpdump -i eth0 -s0 -w capture.pcap

# Purpose: everything to or from one host.
sudo tcpdump -ni eth0 host 203.0.113.50

# Purpose: web traffic only, excluding your own SSH session so the capture does not
# fill with its own output - the classic beginner mistake.
sudo tcpdump -ni eth0 'tcp port 443 or tcp port 80' and not port 22

# Purpose: DNS queries, with contents printed. The fastest way to see what a
# machine is looking up right now.
sudo tcpdump -ni eth0 -s0 -A 'udp port 53'

# Purpose: only new connection attempts (SYN without ACK) - shows scanning and
# shows a process trying to call out.
sudo tcpdump -ni eth0 'tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) = 0'

# Purpose: plaintext credentials crossing the wire. Run this on your own network to
# find services you thought were encrypted.
sudo tcpdump -ni eth0 -s0 -A 'tcp port 21 or tcp port 23 or tcp port 110 or tcp port 143'
```

### BPF filter syntax, enough to be useful

```
host 10.0.0.1              src host / dst host for direction
net 10.0.0.0/8
port 443                   src port / dst port
portrange 8000-9000
tcp / udp / icmp
tcp[tcpflags] & tcp-syn != 0
greater 1000               packets larger than 1000 bytes
and / or / not             combine; parenthesise and quote
```

### tshark — the scriptable one

```bash
# Purpose: extract specific fields as columns, which makes a capture analysable
# with ordinary shell tools.
tshark -r capture.pcap -T fields -e frame.time -e ip.src -e ip.dst -e tcp.dstport \
  -Y "tcp.flags.syn==1 && tcp.flags.ack==0" | head -20

# Purpose: every TLS SNI in the capture, counted. This is the hostname list.
tshark -r capture.pcap -T fields -e tls.handshake.extensions_server_name \
  -Y "tls.handshake.type==1" | sort | uniq -c | sort -rn

# Purpose: top talkers by bytes, which finds the exfiltration.
tshark -r capture.pcap -q -z conv,tcp | head -20

# Purpose: every DNS query name in the capture.
tshark -r capture.pcap -T fields -e dns.qry.name -Y "dns.flags.response==0" \
  | sort | uniq -c | sort -rn | head -30
```

### A worked investigation

Suppose you suspect a machine is compromised. The sequence, in order:

```bash
# 1. Capture for 15 minutes while the machine is idle. Idle is important - it
#    removes your own activity and leaves the automated traffic.
sudo tcpdump -ni eth0 -s0 -w suspect.pcap host 192.168.1.42

# 2. Who did it talk to, and how much left the machine?
tshark -r suspect.pcap -q -z conv,tcp

# 3. What hostnames? Anything unfamiliar is the lead.
tshark -r suspect.pcap -T fields -e dns.qry.name -Y "dns.flags.response==0" \
  | sort -u

# 4. Is anything periodic? Extract timestamps per destination and check the
#    interval variance with the beacon detector from Chapter 9.
tshark -r suspect.pcap -T fields -e frame.time_epoch -e ip.dst \
  -Y "tcp.flags.syn==1 && tcp.flags.ack==0" > conns.tsv

# 5. Reputation-check every unfamiliar destination before concluding anything.
#    VirusTotal, AbuseIPDB, and whois for the ASN.
```

Step 1's "while idle" is the detail that makes this work. On an idle machine, almost all
remaining traffic is automated — updates, telemetry, keepalives, and anything malicious.
The signal-to-noise ratio is far better than during use.

### Practice

1. Capture 10 minutes of your own traffic. Answer: how many distinct destinations, which
   received the most bytes, which hostnames appeared.
2. Find one service on your own network still using a plaintext protocol.
3. Run the full five-step investigation against your own laptop while idle. Account for
   every destination. The ones you cannot explain are the exercise.
4. Extract every SNI from a capture of your own browsing and consider what an observer
   would conclude about you.

---

## Chapter 16: SSRF — the network view of a web bug

Server-Side Request Forgery is where application security and networking meet, and in the
OWASP Top 10:2025 it was **merged into A01 Broken Access Control** rather than having its
own category (verified October 2026). The network understanding is what makes it
defensible.

### The attack

Your server fetches a URL the user supplied. The attacker supplies an *internal* one, and
your server — which sits inside the network — makes the request on their behalf.

```python
# Purpose: WRONG. The classic SSRF. The server will happily fetch anything,
# including addresses only it can reach.
def fetch_avatar(request):
    url = request.GET["url"]
    return HttpResponse(requests.get(url).content)

# Attacker supplies:
#   http://169.254.169.254/latest/meta-data/iam/security-credentials/
#        → cloud credentials, the usual goal
#   http://127.0.0.1:6379/                → your unauthenticated Redis
#   http://127.0.0.1:5432/                → Postgres
#   http://10.0.0.5/admin/                → an internal service with no auth
#   file:///etc/passwd                    → local files, via the file:// scheme
#   http://[::1]:6379/                    → IPv6 localhost, bypassing an IPv4 filter
```

The metadata address `169.254.169.254` is the standard objective: on a cloud instance it
returns credentials for the instance's role, which converts a web bug into cloud account
access. See `../02-infrastructure/02-CLOUD_SECURITY.md`.

### Why naive defences fail

```python
# Purpose: WRONG. A blocklist of strings. Every one of these bypasses it.
if "169.254.169.254" in url or "localhost" in url:
    raise ValueError
#   http://0x7f000001/           hex encoding of 127.0.0.1
#   http://2130706433/           decimal encoding
#   http://127.1/                short form
#   http://[::1]/                IPv6
#   http://127.0.0.1.nip.io/     a public DNS name resolving to 127.0.0.1
#   http://attacker.com/r → 302 redirect to the metadata address
#   DNS rebinding: name resolves to a public IP at validation, 127.0.0.1 at fetch
```

### The defence that works

Validate the **resolved IP**, not the string, and re-check at connection time:

```python
# Purpose: RIGHT. Resolve the hostname, reject any address in a private, loopback,
# link-local or reserved range, and refuse redirects so a 302 cannot escape the
# check. Scheme and port are allow-listed.
import ipaddress, socket
from urllib.parse import urlparse
import requests

ALLOWED_SCHEMES = {"http", "https"}
ALLOWED_PORTS = {80, 443}

def safe_fetch(url: str, timeout: int = 5, max_bytes: int = 2_000_000) -> bytes:
    p = urlparse(url)
    if p.scheme not in ALLOWED_SCHEMES:
        raise ValueError(f"scheme not allowed: {p.scheme}")
    if not p.hostname:
        raise ValueError("no host")
    port = p.port or (443 if p.scheme == "https" else 80)
    if port not in ALLOWED_PORTS:
        raise ValueError(f"port not allowed: {port}")

    # Resolve ALL addresses - a hostname with both a public A and a private AAAA
    # record defeats a check that only looks at the first.
    infos = socket.getaddrinfo(p.hostname, port, proto=socket.IPPROTO_TCP)
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if (ip.is_private or ip.is_loopback or ip.is_link_local
                or ip.is_reserved or ip.is_multicast or ip.is_unspecified):
            raise ValueError(f"blocked address: {ip}")

    # allow_redirects=False: a 302 to the metadata service would bypass everything
    # above. Handle redirects yourself, revalidating each hop.
    r = requests.get(url, timeout=timeout, allow_redirects=False, stream=True)
    if r.status_code in (301, 302, 303, 307, 308):
        raise ValueError("redirects not followed")

    body = r.raw.read(max_bytes + 1)
    if len(body) > max_bytes:
        raise ValueError("response too large")
    return body
```

Even that leaves DNS rebinding open in principle, because the name is resolved twice —
once by you, once by the HTTP library. The complete fix is to connect to the **validated
IP** directly while sending the original `Host` header, or to use a library that lets you
pin the resolved address.

### The network-layer defences — the ones that actually hold

Application validation is necessary and fragile. The network controls are robust, and this
is where Chapter 11 pays off again:

1. **Block the metadata endpoint at the firewall** for any process that does not need it
2. **Require IMDSv2** (token-based) on cloud instances, which defeats simple SSRF
3. **Egress filter the application tier** — if it can only reach your SMTP and payment
   providers, SSRF reaches nothing interesting
4. **Authenticate internal services.** Redis and Postgres with no password are what makes
   SSRF catastrophic rather than merely annoying
5. **Perform outbound fetches from an isolated egress proxy** with its own allow-list

```bash
# Purpose: block the cloud metadata service for everything except a specific user,
# which stops SSRF from reaching credentials even if the application check fails.
sudo nft add rule inet filter output ip daddr 169.254.169.254 \
  skuid != cloud-agent counter drop
```

### Practice

1. Find every place either project fetches a user-supplied URL. There is at least one.
2. Test each with `http://127.0.0.1:6379/`, `http://[::1]/` and a redirect to the metadata
   address. Document what happened.
3. Implement `safe_fetch` and prove all three are blocked.
4. Add the firewall rule for the metadata address and confirm it is enforced.
5. Set a password on Redis. SSRF against an authenticated Redis is far less interesting.

---

## Chapter 17: The checklist

**Exposure**
- [ ] Every listener justified; nothing on `0.0.0.0` that does not need to be
- [ ] Verified from outside with `nmap`, not just from `ss`
- [ ] Postgres and Redis bound to localhost, both with authentication
- [ ] `server_tokens off`, framework headers removed
- [ ] Dev servers bound to `127.0.0.1`

**Firewall**
- [ ] Default-deny **inbound**
- [ ] Default-deny **outbound**, with the drop log read
- [ ] Rules cover IPv6
- [ ] Cloud security group reconciled against the host firewall
- [ ] SSH rate-limited
- [ ] LOLBIN egress blocked on the laptop

**DNS**
- [ ] Query logging enabled on laptop and server
- [ ] SPF, DKIM, DMARC present; DMARC at `p=reject`
- [ ] CAA records set
- [ ] Registrar account has MFA and a transfer lock
- [ ] No dangling CNAMEs

**TLS**
- [ ] TLS 1.2+ only, forward-secret AEAD ciphers (crypto Ch 9)
- [ ] Renewal automated, expiry monitored independently
- [ ] CT monitoring enabled
- [ ] ECH enabled where available
- [ ] No `verify=False` anywhere

**Detection**
- [ ] Firewall drop logging on
- [ ] Connection metadata retained long enough to investigate
- [ ] A beacon check you can run
- [ ] You can answer "what did this machine contact last Tuesday?"

**Access**
- [ ] SSH key-only, forwarding restricted, `ProxyJump` instead of `-A`
- [ ] Database access via SSH tunnel, not a public port
- [ ] WireGuard peers restricted to a single `AllowedIPs` address

**Application/network boundary**
- [ ] Client IP derived from a validated proxy chain
- [ ] Every user-supplied URL fetch validated against resolved IPs
- [ ] Metadata endpoint blocked; IMDSv2 required

---

## Exercise 2 — the module checkpoint

Guide closed. No AI. Each item produces an artefact.

1. **Exposure audit.** `ss -tlnp` on every host you own. Justify every listener, rebind
   what should be local, then verify from outside with `nmap`. Report the before and after.
   (Chapters 5, 10)

2. **The ten-step path.** Take one real request in your system and answer the security
   question at each of the ten steps in Chapter 2. Name which steps you cannot currently
   answer.

3. **DNS logging, today.** Enable it on laptop and server. Watch for an hour. List every
   domain you cannot explain. (Chapter 3)

4. **Mail and domain records.** SPF, DKIM, DMARC, CAA for both domains. Move DMARC to
   `p=reject`. Enable registrar MFA and lock. Report the before and after. (Chapter 3)

5. **Egress policy.** Default-deny output on the VPS, LOLBIN egress block on the laptop,
   drop logging on both. Read the logs for a week and produce the allow-list your server
   actually needs. (Chapters 10, 11)

6. **The September counterfactual.** Write one page: exactly what the egress policy and the
   DNS log would have shown on 6 September, at what point you would have noticed, and what
   would not have left the machine. (Chapter 11)

7. **Capture and investigate.** Full five-step investigation against your own laptop while
   idle. Account for every destination. Reputation-check the unfamiliar ones. (Chapter 15)

8. **Beacon hunt.** Run the beacon detector over your own connection metadata. Identify
   every legitimate beacon by name. Report anything you could not identify. (Chapter 9)

9. **LAN hostility, demonstrated.** In a lab you own, ARP-spoof between two of your own
   devices. Capture a plaintext credential. Then repeat against HTTPS and document exactly
   what you could and could not see. (Chapter 6)

10. **SSRF hunt.** Find every user-supplied URL fetch in both projects. Test all three
    bypasses. Implement `safe_fetch`. Add the metadata firewall rule. Set a Redis password.
    (Chapter 16)

11. **Wi-Fi.** Check the protocol generation on every network you control. Audit the
    passphrase against offline-cracking rates. Upgrade to WPA3 where supported. (Chapter 7)

12. **Detection coverage.** For each of: port scan, SSH brute force, C2 beacon, large
    outbound upload, first contact with a new destination — state honestly whether you
    would see it today. Then fix the cheapest "no". (Chapter 14)

**Automatic fail:** scanning a host you do not own; an egress policy with `policy accept`;
reporting a tool's output without saying what it means.

Exercise 5 is the one that closes the gap that let your data leave. Exercise 6 is the one
that will make you keep it.
