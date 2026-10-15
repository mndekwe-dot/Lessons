# Infrastructure

**Week 5 of [`../CURRICULUM.md`](../CURRICULUM.md). Read in numbered order.**

The server and the cloud account. Your deployment guides
([`../../engineering-curriculum/05-deployment/`](../../engineering-curriculum/05-deployment/))
get Imboni running; this module is about making the box it runs on hostile to an
attacker who gets a foothold.

Assume they will get one. Hardening decides whether a foothold becomes a breach.

| # | File | Week | Level | Core? | What it gives you |
|---|---|---|---|---|---|
| 01 | [01-INFRASTRUCTURE_HARDENING.md](01-INFRASTRUCTURE_HARDENING.md) | 5 | intermediate | **core** | SSH, firewall, service accounts, least-privilege DB roles, containers, backups. |
| 02 | [02-CLOUD_SECURITY.md](02-CLOUD_SECURITY.md) | 5 | advanced | **core** | Shared responsibility, IAM, the metadata service, buckets, audit logging, IaC scanning. |

## The one idea to take from this module

**Least privilege, written down as configuration.**

Your Django database user is almost certainly a superuser. It needs
`SELECT/INSERT/UPDATE/DELETE` on its own tables — not `DROP TABLE`, not `CREATE ROLE`.
That difference is the whole distance between "they read our data" and "they destroyed
our company", and it costs twenty minutes.

In the cloud the same idea wears a different name: IAM is the new perimeter, and
`Action: "*"` on `Resource: "*"` is the cloud equivalent of running everything as root.

## What you should be able to do afterwards

- Justify every line of `ss -tulpn` on your production host
- Write the exact `GRANT` statements your application actually needs
- Explain how an SSRF bug becomes full cloud compromise via the metadata service
- **State your restore time from backup as a number you have measured**

That last one is the checkpoint's automatic-fail condition. An untested backup is a
belief, not a backup.

Checkpoint 5 in [`../CURRICULUM.md`](../CURRICULUM.md).
