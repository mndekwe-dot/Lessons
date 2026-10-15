# 08 — Supply Chain and Secure Development

**Week 21.** The code you did not write, and the process that stops you shipping holes.
Imboni's `requirements.txt` and `package.json` pull in hundreds of packages, each
maintained by strangers, each running code on your machine at install time and in
production.

This is the attack surface developers most consistently underestimate, because it does
not feel like an attack surface. It feels like `pip install`.

---

## Table of Contents

1. [The shape of the problem](#1-the-shape-of-the-problem)
2. [How supply chain attacks work](#2-how-supply-chain-attacks-work)
3. [Lockfiles](#3-lockfiles)
4. [Auditing](#4-auditing)
5. [Choosing a dependency](#5-choosing-a-dependency)
6. [Securing your own repository](#6-securing-your-own-repository)
7. [Secret scanning locally](#7-secret-scanning-locally)
8. [SAST, DAST and where they fit](#8-sast-dast-and-where-they-fit)
9. [Security in code review](#9-security-in-code-review)
10. [A realistic CI pipeline](#10-a-realistic-ci-pipeline)
11. [The checklist](#11-the-checklist)
12. [Exercise 8](#exercise-8)

---

## 1. The shape of the problem

Your direct dependencies are a small fraction of what you run. A typical Django +
React project has 30–50 direct dependencies and 800–1,500 transitive ones. You chose
the first number; the second chose itself.

```bash
pip list | wc -l
npm ls --all --parseable 2>/dev/null | wc -l
```

Run those on Imboni. The second number is usually the one that produces silence.

Every one of those packages can, at minimum, read every file your user can read — your
`.env`, your SSH keys, your browser profile.

## 2. How supply chain attacks work

**Typosquatting.** A package named one character away from a popular one.
`python-dateutil` vs `python-dateutil2`, `crossenv` vs `cross-env`. The install succeeds,
the code works, and it exfiltrates on the side.

**Dependency confusion.** Your company has an internal package `imboni-utils`. An
attacker publishes `imboni-utils` to the *public* registry with a higher version
number. Default resolution prefers the higher version and pulls the attacker's. This
has been demonstrated against major companies and it is still effective.

**Compromised maintainer.** A legitimate, popular package whose maintainer account is
phished or whose repo token leaks. `event-stream`, `ua-parser-js`, `xz-utils`. The code
is signed, the download is genuine, and the content is hostile.

**Protestware.** A maintainer deliberately sabotages their own package over a political
position. `node-ipc` wiped files on machines with Russian or Belarusian IPs.

**Install-time execution.** npm `postinstall` scripts and Python `setup.py` run
arbitrary code **during installation**, as your user, before you have run anything. You
do not need to import the package to be compromised by it.

```bash
npm install --ignore-scripts        # blocks postinstall; some packages break
```

## 3. Lockfiles

A lockfile pins the exact resolved version and hash of every package, direct and
transitive. Without one, two installs a week apart give you different code.

- Python: `requirements.txt` with `==`, or better `uv.lock` / `poetry.lock` /
  `pip-compile` output with hashes
- Node: `package-lock.json` or `pnpm-lock.yaml`

**Commit the lockfile.** Use `npm ci`, not `npm install`, in CI — `ci` installs exactly
the lockfile and fails if `package.json` disagrees, which is what you want in a build.

With hashes, even a compromised registry cannot swap content underneath you:

```
django==5.0.6 --hash=sha256:c9d5b...
```

## 4. Auditing

```bash
pip install pip-audit && pip-audit         # Python, against the PyPI advisory DB
npm audit                                   # JS
npm audit fix                               # the safe subset
osv-scanner -r .                            # multi-ecosystem, Google's OSV database
```

Run these in CI and fail on high severity. Then actually triage the output: a critical
CVE in a dev-only dependency that never runs in production is not an emergency, and
treating it as one is how teams learn to ignore the whole report.

**Enable Dependabot** on your GitHub repos. It opens PRs for vulnerable dependencies
automatically. The cost is PR noise; the benefit is that you patch in days rather than
never. Group minor updates to keep it manageable.

## 5. Choosing a dependency

Before adding one, five questions:

1. **Do I need it?** `left-pad` and `is-odd` were real packages with real dependents.
   A function you can write in six lines is not a dependency.
2. **Is it maintained?** Last release, open issue count, number of maintainers. A
   package with one maintainer and no release in three years is a liability.
3. **How deep is it?** A package with 40 transitive dependencies brings 40 more
   maintainers into your trust boundary.
4. **What does it get?** A date-formatting library has no business making network calls.
5. **What is the exit?** If it is abandoned next year, how hard is it to replace?

## 6. Securing your own repository

- **Branch protection** on `main`: require review, require CI to pass, no force-push.
- **Secret scanning** — GitHub's is free and on by default for public repos; enable
  push protection so a committed key is blocked rather than merely reported.
- **Signed commits** if you can; at minimum know who can push.
- **Least privilege on CI tokens.** A GitHub Actions `GITHUB_TOKEN` defaults broader
  than most workflows need; set `permissions:` explicitly.
- **Pin third-party Actions by commit SHA**, not by tag. Tags are mutable, so
  `@v3` can be moved to point at new code by whoever controls the repo:

```yaml
- uses: actions/checkout@8f4b7f8  # not @v4
```

> You already have `02-backend/12-REMOVE_COMMITTED_ENV.md`, which means a secret has
> been committed at least once. Note that removing it in a later commit does **not**
> remove it — it stays in history and in every clone and fork. The only correct
> response is to **rotate the secret**, then clean history if you wish. Rotation is
> the part that matters.

## 7. Secret scanning locally

Catch it before it leaves your machine:

```bash
pip install detect-secrets
detect-secrets scan > .secrets.baseline

# or gitleaks
gitleaks detect --source . -v
```

Wire it into a pre-commit hook:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks: [{id: gitleaks}]
```

This is the cheapest high-value control in this file. It takes ten minutes.

## 8. SAST, DAST and where they fit

- **SAST** — static analysis of source. Fast, runs on every commit, finds injection
  patterns and hardcoded secrets. Noisy. Python: `bandit`, `semgrep`. JS: ESLint
  security plugins.
- **DAST** — attacks a running application. Finds configuration and runtime issues SAST
  cannot see. Slower. `OWASP ZAP` has a baseline scan that fits in CI.
- **SCA** — dependency scanning, §4 above.

```bash
bandit -r . -ll            # medium+ severity only
semgrep --config=auto .
```

None of these find business-logic flaws. A scanner cannot know that a parent should not
see another family's child. That is threat modelling and code review.

## 9. Security in code review

Add these to your review habit. They catch more than any tool:

- Does this endpoint check **authorisation**, and is the query scoped to the requester?
- Is any user input reaching SQL, a shell, a template, or `innerHTML`?
- Is a new dependency being added? Has anyone looked at it?
- Are errors leaking internals in their messages?
- Is anything sensitive being logged?
- Does a new `.env` key have a corresponding entry in `.env.example` (name only)?
- Does this change widen what an existing role can do?

## 10. A realistic CI pipeline

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    permissions: {contents: read}
    steps:
      - uses: actions/checkout@8f4b7f8
      - run: pip install pip-audit bandit
      - run: pip-audit --strict
      - run: bandit -r . -ll
      - run: npm ci && npm audit --audit-level=high
      - uses: gitleaks/gitleaks-action@cb7149a
```

Keep it under a few minutes or people will route around it. Fail the build on high
severity; report the rest.

## 11. The checklist

- [ ] Lockfiles committed; CI uses `npm ci` / hash-pinned installs
- [ ] `pip-audit` and `npm audit` in CI, failing on high
- [ ] Dependabot enabled and triaged, not ignored
- [ ] Secret scanning in pre-commit **and** in CI with push protection
- [ ] Branch protection on `main`
- [ ] GitHub Actions pinned by SHA; `permissions:` set explicitly
- [ ] Every previously committed secret rotated, not just deleted
- [ ] New dependencies pass the five questions
- [ ] Security items on the code-review checklist

---

## Exercise 8

1. Count Imboni's direct and transitive dependencies in both ecosystems. Then pick the
   five with the most transitive dependencies of their own and decide whether each is
   worth it.

2. Run `pip-audit`, `npm audit` and `bandit` on both projects. Triage every finding
   into: fix now / fix later / not applicable, with a reason.

3. Install `gitleaks` as a pre-commit hook. Then run it over your **full history** and
   report what it finds. Rotate anything real.

4. Add the §10 security job to one project's CI. Make it fail deliberately, then fix it.

5. Pick a package you depend on directly. Read its `setup.py` or `package.json` scripts.
   Does it execute anything at install time? Say what it would get if it were hostile.

6. Write the dependency-confusion scenario for Imboni specifically: if you have any
   internal package name, could someone publish it publicly? If you have none, say what
   you would do before creating one.

Exercise 3 is the one with the highest chance of finding something live.
