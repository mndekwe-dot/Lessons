# 02 — Cloud Security

**Week 20.** Oracle Cloud, AWS, or anywhere else you rent infrastructure. The threat
model changes: you no longer control the hardware, the hypervisor, or the network
fabric — but you gain an identity system powerful enough to lock yourself out of, and
an API surface that is itself a target.

Your deployment guides (`../../engineering-curriculum/05-deployment/06..08`) cover
getting Imboni running on Oracle Free Tier. This file is about not getting breached
there.

---

## Table of Contents

1. [The shared responsibility model](#1-the-shared-responsibility-model)
2. [IAM is the new perimeter](#2-iam-is-the-new-perimeter)
3. [The metadata service — cloud's signature vulnerability](#3-the-metadata-service--clouds-signature-vulnerability)
4. [Storage buckets](#4-storage-buckets)
5. [Secrets in the cloud](#5-secrets-in-the-cloud)
6. [Network controls](#6-network-controls)
7. [Logging and audit](#7-logging-and-audit)
8. [Cost as a security signal](#8-cost-as-a-security-signal)
9. [Infrastructure as code](#9-infrastructure-as-code)
10. [Managed Kubernetes, briefly](#10-managed-kubernetes-briefly)
11. [The checklist](#11-the-checklist)
12. [Exercise 11](#exercise-11)

---

## 1. The shared responsibility model

The provider secures the cloud. **You secure what you put in it.** The dividing line
moves depending on the service:

| | IaaS (a VM) | PaaS (managed DB) | SaaS |
|---|---|---|---|
| Physical, hypervisor | provider | provider | provider |
| OS patching | **you** | provider | provider |
| Network config | **you** | **you** | provider |
| Application code | **you** | **you** | n/a |
| **Data** | **you** | **you** | **you** |
| **Access control / IAM** | **you** | **you** | **you** |

The bottom two rows never move. Nearly every publicised "cloud breach" is one of them —
a misconfigured bucket or an over-permissioned key — not a failure of the provider.

Your Oracle VM is IaaS. Everything above the hypervisor is yours.

## 2. IAM is the new perimeter

In the cloud, identity replaces the firewall as the primary control. An over-permissive
IAM policy is a bigger hole than an open port, because it is invisible from the outside
and grants far more.

Principles:

- **Least privilege, enforced in the policy**, not by intention. `Action: "*"` on
  `Resource: "*"` is the cloud equivalent of running everything as root.
- **Roles over long-lived keys.** A VM that assumes a role gets short-lived, rotating
  credentials. A static access key in a `.env` lives until someone remembers it.
- **No root/tenancy-admin for daily work.** Create a user, give it what it needs, and
  put MFA on the root account and then leave it alone.
- **MFA everywhere**, especially on anything that can change IAM.
- **Separate accounts/compartments per environment.** A dev mistake must not reach
  production data.

A useful audit question: *list every credential that can read Imboni's database, and
say how each one would be revoked within five minutes.* If you cannot enumerate them,
that is the finding.

## 3. The metadata service — cloud's signature vulnerability

Every cloud VM exposes an internal HTTP endpoint carrying its identity:

```
http://169.254.169.254/latest/meta-data/        # AWS
http://169.254.169.254/opc/v2/instance/         # Oracle
```

It is unauthenticated and reachable from anything running on the instance. On AWS it
hands out **temporary credentials for the instance's IAM role**.

This turns an SSRF bug (`04-WEB_VULNERABILITIES` §11 — in
`../01-application-security/02-WEB_VULNERABILITIES.md`) into full cloud compromise:

1. Attacker finds a feature that fetches a user-supplied URL
2. Supplies `http://169.254.169.254/...`
3. Your server dutifully fetches it and returns the credentials
4. Attacker now acts as your application's role

This is exactly how the 2019 Capital One breach worked — SSRF plus metadata plus an
over-permissive role, 100 million records.

Defences:

- **IMDSv2** (AWS) requires a PUT with a token first, which a naive SSRF cannot do.
  Enforce it; do not merely enable it.
- Block `169.254.169.254` at the host firewall for the application user
- Minimise the instance role, so stolen credentials are worth little
- Never fetch user-supplied URLs; if you must, allowlist and re-check after DNS
  resolution

## 4. Storage buckets

The single most common cloud data leak, and the mechanism is always the same: a bucket
set to public because it was easier during development.

- **Default private. Always.** Enable the account-level "block public access" setting
  so an individual bucket cannot be made public by accident.
- Serve user content through your application or signed, expiring URLs — not by making
  the bucket readable.
- Enable encryption at rest (usually one checkbox, and free).
- Turn on access logging and object versioning. Versioning is also your ransomware
  defence.
- Audit periodically: list every bucket and its public-access status.

If Imboni stores student photos or PDF reports in object storage, those objects are
children's personal data. A public bucket there is a reportable breach under Law
No. 058/2021, not an embarrassment.

## 5. Secrets in the cloud

Stop putting secrets in environment variables on the box and start using the managed
service:

- AWS Secrets Manager / Parameter Store, Oracle Vault, Google Secret Manager
- Rotation support, audit logging, IAM-controlled access
- The application fetches at startup using its instance role — **no secret on disk at
  all**

That last point is the one that matters given September: the infostealer read your
`.env` files because they were plaintext on disk, readable by your user. A secret
fetched at runtime into process memory via an instance role has no file to steal.

Never, under any circumstances, put credentials in:

- Instance user-data scripts (readable via the metadata service)
- Container images (every layer is extractable)
- Terraform state files (plaintext by default — encrypt the backend)
- Environment variables in a CI configuration that logs its environment

## 6. Network controls

- **Security groups / network security lists** are the cloud firewall. Default deny
  inbound; allow 443 from the world and 22 from your IP or a bastion only.
- Put databases in a **private subnet** with no internet gateway route.
- Use a **bastion host** or the provider's session manager rather than exposing SSH on
  every instance.
- **Egress filtering** is the control most people skip and the one that limits
  exfiltration. An app server rarely needs to reach arbitrary internet hosts.
- VPC flow logs give you the network evidence you will want during an incident.

## 7. Logging and audit

Turn on the provider's audit trail **first**, before anything else:

- AWS **CloudTrail**, Oracle **Audit**, GCP **Cloud Audit Logs**
- Every API call: who, what, when, from where
- Ship to a separate account or bucket with restricted write access, so an attacker who
  compromises the main account cannot erase the evidence of it

Alert on: root account usage, IAM policy changes, security group changes, failed
console logins, and new access-key creation. Those five cover most account-takeover
paths.

## 8. Cost as a security signal

A sudden bill spike is often the first visible sign of compromise — cryptomining,
data egress, or a "denial of wallet" attack against a metered service.

Set billing alerts. On a free tier they are also your early warning that something has
escaped the free allowance, which for your Oracle setup is a practical concern of its
own.

## 9. Infrastructure as code

Click-ops is unreviewable and unreproducible. Terraform or the provider's equivalent
gives you:

- A diff before changes apply
- Code review on infrastructure
- Recovery by re-applying rather than remembering
- Scanning: `tfsec`, `checkov`, `terrascan` find insecure configurations before deploy

```bash
tfsec .
checkov -d .
```

Two warnings: **encrypt your state backend** — it contains secrets in plaintext — and
never commit `.tfstate` to git.

## 10. Managed Kubernetes, briefly

Only if you get there. The security essentials:

- RBAC properly configured; the default service account should do nothing
- Network policies (pods can talk to everything by default — that is the wrong default)
- Secrets are base64, **not encrypted**, unless you enable encryption at rest
- Pod security standards: no privileged containers, no host network, non-root
- Scan images in the registry, not just locally

Kubernetes multiplies both capability and attack surface. It is almost certainly
overkill for Imboni; know what it costs before you adopt it.

## 11. The checklist

- [ ] Root/tenancy account: MFA on, unused for daily work
- [ ] No `*:*` IAM policies; roles preferred over static keys
- [ ] IMDSv2 enforced; metadata endpoint blocked for the app user
- [ ] Account-level block-public-access on object storage
- [ ] Buckets encrypted, versioned, access-logged
- [ ] Secrets in a managed vault, not on disk
- [ ] Databases in a private subnet; SSH via bastion
- [ ] Egress restricted
- [ ] Audit logging on, shipped somewhere the main account cannot delete
- [ ] Billing alerts set
- [ ] Infrastructure in code, state encrypted, `tfsec` in CI

---

## Exercise 11

1. List every IAM user, role and access key in your cloud account. For each: what it
   can do, when it was last used, and how you would revoke it. Delete what is unused.

2. From inside your Imboni instance, `curl` the metadata endpoint. See what it returns.
   Then confirm whether your application could be tricked into doing the same.

3. Audit every storage bucket for public access and encryption. Fix anything open.

4. Move one secret from a `.env` file into the provider's secret manager and have the
   app fetch it at startup via its instance role. Confirm the secret is no longer on
   disk anywhere.

5. Turn on audit logging and create one alert — root account usage is the best first
   one. Trigger it deliberately and confirm it fires.

6. Write the Capital One attack chain (SSRF → metadata → role → bucket) as it would
   apply to Imboni specifically. Name the control at each step that would break it.

Exercise 6 is the one that connects this file to the application-security module.
