# Authentication and Access Control — Zero to Professional

**Week 20.** By the end of this file you can design a login system that resists phishing,
build authorisation that cannot be forgotten in view 41, explain OAuth without hand-waving,
and write the test that catches the single most common serious web vulnerability.

**Broken Access Control is #1 on the OWASP Top 10:2025**, as it was in 2021 — found in
3.73% of applications across a dataset of over 2.8 million, and now absorbing SSRF as
well (verified October 2026 against `top10.owasp.org/2025`). **Authentication Failures**
is #7 separately.

That split is the structure of this file. Authentication is the part everybody implements;
authorisation is the part everybody gets wrong. The asymmetry has a cause, and
understanding it is most of the value here.

---

## Table of Contents

1. [Before you read a word](#before-you-read-a-word)
2. [Chapter 1: The four questions](#chapter-1-the-four-questions)
3. [Chapter 2: Passwords](#chapter-2-passwords)
4. [Chapter 3: Multi-factor authentication](#chapter-3-multi-factor-authentication)
5. [Chapter 4: Sessions](#chapter-4-sessions)
6. [Chapter 5: Federated identity — OAuth and OIDC](#chapter-5-federated-identity--oauth-and-oidc)
7. [Chapter 6: The models](#chapter-6-the-models)
8. [Chapter 7: Broken Access Control — A01:2025](#chapter-7-broken-access-control--a012025)
9. [Chapter 8: Enforcing it where it cannot be bypassed](#chapter-8-enforcing-it-where-it-cannot-be-bypassed)
10. [Chapter 9: Machine and service identity](#chapter-9-machine-and-service-identity)
11. [Chapter 10: Audit](#chapter-10-audit)
12. [Chapter 11: The failure catalogue](#chapter-11-the-failure-catalogue)
13. [Chapter 12: The checklist](#chapter-12-the-checklist)
14. [Exercise 4 — the module checkpoint](#exercise-4--the-module-checkpoint)

---

## Before you read a word

> **Authentication happens once, in one place, and fails loudly.**
> **Authorisation happens on every request, for every object, in every code path — and
> fails silently.**

Nothing crashes when you forget an authorisation check. The feature works perfectly. It
just works for the wrong person, and you find out when a parent emails you about a child
who is not theirs.

That is why this file spends twice as long on Part 2.

---

# PART 1 — IDENTITY AND AUTHENTICATION

## Chapter 1: The four questions

Distinguish these precisely; almost every muddled security conversation is two people
using one word for two of them.

| Question | Name | Mechanism |
|---|---|---|
| Who claims to be here? | **Identification** | a username, an email, a user ID |
| Can they prove it? | **Authentication** | a password, a key, a biometric, a passkey |
| What may they do? | **Authorisation** | roles, policies, ownership checks |
| What did they do? | **Accounting / audit** | an append-only log |

A fifth concern sits underneath all of them and is usually skipped:

**Identity proofing** — how you know the real-world person behind the account is who the
account says. Authentication proves continuity ("the same person as last time"); it never
proves identity. A parent account on Imboni authenticates fine and tells you nothing about
whether that person has custody of the child.

For Imboni this is not an academic distinction. The authorisation question you actually
need to answer is *"does this adult have a lawful relationship to this child?"* — a
proofing question, answered at enrolment by a human, that your software can only record
and enforce. If the enrolment process is sloppy, no amount of correct code fixes it.

### Practice

1. For one endpoint in each project, name what satisfies all four questions.
2. Write down how a parent account in Imboni comes to be linked to a child. Who verifies
   it? What evidence? Is it recorded?
3. Name one thing your system treats as proven identity that is only proven continuity.

---

## Chapter 2: Passwords

Still the baseline, still mostly done wrong, and the current guidance is close to the
opposite of what most developers were taught.

### What current guidance actually says

NIST's digital identity guidance (SP 800-63B and its revisions) reversed decades of
advice. The modern rules:

| Rule | Reason |
|---|---|
| **Minimum 8 characters, allow at least 64** | length dominates; blocking long passphrases is harmful |
| **No composition rules** — no "must contain a symbol" | they produce `Password1!`, which is in every wordlist |
| **No forced periodic rotation** | produces `Summer2026` → `Summer2027`; rotate on *suspicion* instead |
| **Check against breached-password lists** | the single most effective check available |
| **Allow all printable characters, including spaces and emoji** | more keyspace, no user confusion |
| **Allow paste** | blocking paste breaks password managers, which are the real fix |
| **No security questions** | the answers are public or guessable |
| **No password hints** | they leak the password |

The psychological-acceptability principle from `../00-foundations/01-SECURITY_FOUNDATIONS.md`
Chapter 10 explains every row: controls that fight the user lose. Forced rotation made
passwords *worse* because users responded rationally to an irrational demand.

### The breached-password check

The highest-value five lines in this chapter. Credential stuffing works because users
reuse passwords; checking against known-breached passwords at set time removes the attack.

```python
# Purpose: check a password against the Have I Been Pwned corpus using k-anonymity.
# Only the first 5 characters of the SHA-1 hash leave your server, so the service
# never learns which password was checked.
import hashlib
import requests

def times_breached(password: str) -> int:
    h = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix, suffix = h[:5], h[5:]
    r = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}",
                     timeout=4, headers={"Add-Padding": "true"})
    r.raise_for_status()
    for line in r.text.splitlines():
        candidate, count = line.split(":")
        if candidate == suffix:
            return int(count)
    return 0
```

```python
# Purpose: a Django validator that rejects breached passwords but FAILS OPEN if the
# service is unreachable - an outage at HIBP must not stop people registering.
from django.core.exceptions import ValidationError

class BreachedPasswordValidator:
    def validate(self, password, user=None):
        try:
            n = times_breached(password)
        except Exception:
            return                      # fail open: availability over this one check
        if n > 0:
            raise ValidationError(
                f"This password has appeared in {n:,} known data breaches. "
                "Please choose a different one.",
                code="password_breached")

    def get_help_text(self):
        return "Your password must not have appeared in a known data breach."

# settings.py
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
     "OPTIONS": {"min_length": 12}},
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "myapp.validators.BreachedPasswordValidator"},
    # Deliberately NOT NumericPasswordValidator-style composition rules.
]
```

Note the fail-open decision, which is the opposite of the fail-safe-defaults principle —
and is correct here. Fail-safe defaults apply to **authorisation** decisions, where the
cost of wrongly allowing exceeds the cost of wrongly denying. This is a *quality* check at
registration; failing closed would mean an outage at a third party stops your users
signing up. Knowing which way to fail, and why, is the judgement this chapter is teaching.

### Account enumeration

Does your system reveal which email addresses have accounts? Almost certainly yes, through
one of four channels:

| Channel | Leak |
|---|---|
| Registration | "an account with this email already exists" |
| Login | "no user with that email" vs "incorrect password" |
| Password reset | "we could not find that email" |
| **Timing** | a registered email runs the full password hash; an unregistered one returns early |

For a mental-health screening service this is a real harm, not a theoretical one: it lets
anyone test whether a specific person has an account. That is the LINDDUN *Detecting*
threat from `../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 7, in a concrete form.

```python
# Purpose: WRONG. Three separate leaks - distinguishable messages, and an early
# return that makes the timing difference measurable.
def login(request):
    try:
        user = User.objects.get(email=request.POST["email"])
    except User.DoesNotExist:
        return render(request, "login.html", {"error": "No account with that email"})
    if not user.check_password(request.POST["password"]):
        return render(request, "login.html", {"error": "Incorrect password"})
    ...

# Purpose: RIGHT. One message for every failure, and a dummy hash computed when the
# user does not exist so the response time does not distinguish the cases.
from django.contrib.auth.hashers import check_password, make_password

DUMMY_HASH = make_password("a-constant-value-never-used")   # compute once at import

GENERIC = "Email or password is incorrect."

def login(request):
    email = request.POST.get("email", "")
    password = request.POST.get("password", "")

    user = User.objects.filter(email__iexact=email).first()
    if user is None:
        check_password(password, DUMMY_HASH)        # burn the same CPU
        return render(request, "login.html", {"error": GENERIC})

    if not user.check_password(password):
        return render(request, "login.html", {"error": GENERIC})
    ...
```

Password reset needs the same treatment and is the one most often missed:

```python
# Purpose: RIGHT. Always respond identically, whether or not the address exists.
# Send the mail only if it does. The user is told to check their inbox either way.
def request_reset(request):
    email = request.POST.get("email", "")
    user = User.objects.filter(email__iexact=email).first()
    if user is not None:
        send_reset_email(user)                      # queue it; do not block
    return render(request, "reset_sent.html")       # identical response always
```

There is a usability cost — a user who mistypes their address gets no warning — and that
is the trade-off to make deliberately. For Screening, make it. For a low-sensitivity
service, revealing existence at registration only is a defensible choice.

### Rate limiting and lockout

Needed, and the naive design creates two new problems.

```
Problem with lockout after N failures:
  1. An attacker locks out every user on purpose - a denial-of-service
  2. Credential stuffing uses ONE password against MANY accounts, so per-account
     counters never trip
```

The correct design counts on several dimensions at once:

| Dimension | Limit | Catches |
|---|---|---|
| Per account | 10 failures / hour, then exponential backoff | targeted brute force |
| **Per IP across all accounts** | 20 failures / hour | **credential stuffing** |
| Per IP per account | 5 / 15 min | the common case |
| Global failure rate | alert on anomaly | a distributed campaign |

```python
# Purpose: multi-dimensional rate limiting. The per-IP-across-accounts counter is
# the one that catches credential stuffing, which per-account counters miss
# entirely because each account sees only one attempt.
from django.core.cache import cache

LIMITS = [
    ("acct:{email}",        10, 3600),     # key template, max, window seconds
    ("ip:{ip}",             20, 3600),
    ("ip-acct:{ip}:{email}", 5,  900),
]

def check_limits(email: str, ip: str) -> bool:
    """False if any limit is already exceeded."""
    for tmpl, limit, _ in LIMITS:
        if cache.get(tmpl.format(email=email.lower(), ip=ip), 0) >= limit:
            return False
    return True

def record_failure(email: str, ip: str) -> None:
    for tmpl, _, window in LIMITS:
        key = tmpl.format(email=email.lower(), ip=ip)
        if cache.add(key, 1, window) is False:      # add() only if absent
            try:
                cache.incr(key)
            except ValueError:                      # expired between add and incr
                cache.add(key, 1, window)

def clear_failures(email: str, ip: str) -> None:
    for tmpl, _, _ in LIMITS:
        cache.delete(tmpl.format(email=email.lower(), ip=ip))
```

Three details that make this work in practice:

- **`cache.add` then `incr`**, not `get`-then-`set`. The latter is a TOCTOU race
  (`../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 14) and under load an attacker
  gets more attempts than the limit allows.
- **Clear on success**, or a user who fumbles twice and then succeeds carries the counter.
- **The IP must come from a validated proxy chain**
  (`../00-foundations/02-NETWORKING_FOR_SECURITY.md` Chapter 13), or the limit is bypassed
  with a header.

And recall from the cryptography file, Chapter 3: an expensive password hash plus an
unlimited login endpoint is a self-inflicted denial of service. **Rate limit before you
raise Argon2 parameters.**

### Practice

1. Test all four enumeration channels against both projects. Measure the timing one with
   1,000 requests against a known and an unknown address.
2. Implement the breached-password validator. Try registering with `Password123!` and
   watch it be rejected.
3. Implement multi-dimensional rate limiting. Prove the per-IP limit stops one password
   tried against 50 accounts.
4. Decide, in writing, whether Screening should reveal account existence at registration.
   Justify it either way.

---

## Chapter 3: Multi-factor authentication

### The factor taxonomy

```
Something you KNOW   — password, PIN, recovery code
Something you HAVE   — phone, hardware key, smartcard, a device holding a private key
Something you ARE    — fingerprint, face, iris
```

Two factors must come from **different categories**. A password plus a security question
is one factor twice. So is a password plus a "secret" PIN.

### Ranked by what they actually resist

| Method | Phishing | SIM swap | Malware on device | Verdict |
|---|---|---|---|---|
| **Passkey / WebAuthn (hardware)** | **resistant** | n/a | resistant | **best** |
| Passkey (synced, platform) | **resistant** | n/a | partially | excellent |
| TOTP app | vulnerable (code is replayable) | n/a | vulnerable | good |
| Push approval | vulnerable (fatigue) | n/a | vulnerable | fair |
| **SMS** | vulnerable | **vulnerable** | vulnerable | **weakest — but far better than nothing** |
| Email code | vulnerable | n/a | vulnerable | weak; email is often the thing being protected |

SMS deserves its ranking and also a defence. It is genuinely weak: SIM swapping is a
routine criminal service, and SS7 interception exists. It is also the factor most of your
users *can actually use* in Rwanda, where smartphone penetration is uneven and hardware
keys are not realistic for parents. **SMS MFA on a parent account is a large improvement
over no MFA.** Offer stronger factors to staff, where you can require them.

That is a deliberate, documented risk decision — the kind
`../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 8 asks for — not a shrug.

### TOTP, implemented properly

Time-based one-time passwords (RFC 6238): HMAC of a shared secret and a 30-second counter,
truncated to six digits.

```python
# Purpose: TOTP enrolment and verification with the three details implementations
# miss: a drift window, replay prevention, and rate limiting on the verify step.
import pyotp, qrcode, io
from django.core.cache import cache

def start_enrolment(user) -> tuple[str, bytes]:
    """Return the secret and a QR code. Do NOT save the secret as confirmed yet."""
    secret = pyotp.random_base32()                 # 160 bits
    uri = pyotp.TOTP(secret).provisioning_uri(
        name=user.email, issuer_name="Imboni")
    buf = io.BytesIO()
    qrcode.make(uri).save(buf, format="PNG")
    return secret, buf.getvalue()

def confirm_enrolment(user, secret: str, code: str) -> bool:
    """Only store the secret once the user has proved they can generate a code."""
    if not pyotp.TOTP(secret).verify(code, valid_window=1):
        return False
    user.totp_secret = encrypt_field(secret)       # encrypted at rest - crypto Ch 13
    user.mfa_enabled = True
    user.save(update_fields=["totp_secret", "mfa_enabled"])
    return True

def verify_totp(user, code: str) -> bool:
    # 1. Rate limit, or six digits is brute-forceable: 1,000,000 / 30s windows.
    key = f"totp-attempts:{user.pk}"
    if cache.get(key, 0) >= 5:
        return False

    totp = pyotp.TOTP(decrypt_field(user.totp_secret))

    # 2. valid_window=1 accepts the previous and next 30s step, for clock drift.
    #    Do not widen it further; each step multiplies the brute-force surface.
    if not totp.verify(code, valid_window=1):
        cache.set(key, cache.get(key, 0) + 1, 900)
        return False

    # 3. Replay prevention. A TOTP code stays valid for its whole window, so a code
    #    phished 10 seconds ago still works without this check.
    replay_key = f"totp-used:{user.pk}:{code}"
    if not cache.add(replay_key, 1, 90):
        return False                               # already used in this window

    cache.delete(key)
    return True
```

The replay check in step 3 is the one almost every tutorial omits, and it matters: without
it, an attacker who captures a code by any means has up to 90 seconds to use it. With it,
the code is single-use.

### Passkeys and WebAuthn — why they are categorically better

WebAuthn is not "a nicer second factor". It removes phishing structurally, which is a
different kind of thing.

```
Registration:
  1. Server sends a random challenge
  2. The authenticator generates a NEW keypair, scoped to THIS origin
  3. It returns the public key, signed over the challenge
  4. Server stores the public key against the account

Authentication:
  1. Server sends a random challenge
  2. The authenticator signs { challenge, origin, type } with the private key
  3. Server verifies the signature against the stored public key
```

Three properties fall out of that, and the third is the one that matters:

1. **The private key never leaves the authenticator** — there is nothing on the server to
   steal. A breach of your database yields public keys, which are useless.
2. **Challenges are single-use** — no replay.
3. **The signature covers the origin, and the browser supplies the origin, not the user.**
   A phishing site at `imbon1.rw` cannot get a signature valid for `imboni.rw`. The user
   cannot be tricked into providing it, because the user is not the one asserting the
   origin.

That third point is why passkeys are phishing-resistant and TOTP is not. A user *can* be
talked into reading a six-digit code to an attacker on the phone. There is no equivalent
mistake available with WebAuthn — the browser enforces it.

```python
# Purpose: WebAuthn verification with py_webauthn. The three parameters that carry
# the security are expected_challenge, expected_origin and expected_rp_id - get any
# of them wrong and the phishing resistance is gone.
from webauthn import verify_authentication_response
from webauthn.helpers.structs import AuthenticationCredential

def verify_passkey(user, credential_json: str, expected_challenge: bytes):
    stored = user.webauthn_credentials.get(credential_id=...)
    return verify_authentication_response(
        credential=AuthenticationCredential.parse_raw(credential_json),
        expected_challenge=expected_challenge,          # from the session, single-use
        expected_origin="https://imboni.rw",            # exact, including scheme
        expected_rp_id="imboni.rw",
        credential_public_key=stored.public_key,
        credential_current_sign_count=stored.sign_count,
        require_user_verification=True,                 # PIN or biometric, not just touch
    )
```

`sign_count` is worth a note: authenticators increment a counter per use, and a counter
that goes backwards suggests a cloned credential. Hardware keys maintain it; many synced
passkeys report zero and the check must be skipped for those.

**Synced versus device-bound.** Platform passkeys sync through iCloud or Google accounts,
which makes them usable (no lost-key disaster) and means the security of the passkey
inherits the security of that cloud account. Device-bound hardware keys do not sync and
cannot be extracted. For staff accounts with access to children's records, require two
registered credentials, at least one of them hardware.

### Recovery — the part that undoes everything

MFA creates a new failure mode: the user loses the factor. The recovery path is then the
weakest link, and it is routinely weaker than the password it replaced.

```
BAD:   "contact support" → social engineering, which is how most MFA is defeated
BAD:   SMS fallback on an account protected by a hardware key → downgrades to SMS
BAD:   security questions → public information
GOOD:  one-time recovery codes, generated at enrolment, shown once, hashed at rest
GOOD:  a second registered factor (two keys, or key + TOTP)
GOOD:  verified in-person reset for staff, with it logged
```

```python
# Purpose: recovery codes, stored HASHED so a database breach does not yield
# working bypass credentials. Each is single-use and consumption is atomic.
import secrets
from django.contrib.auth.hashers import make_password, check_password

def generate_recovery_codes(user, n: int = 10) -> list[str]:
    codes = ["-".join(secrets.token_hex(2) for _ in range(3)) for _ in range(n)]
    user.recovery_codes.all().delete()              # invalidate any previous set
    RecoveryCode.objects.bulk_create([
        RecoveryCode(user=user, code_hash=make_password(c)) for c in codes])
    return codes                                    # shown ONCE, never stored plain

def consume_recovery_code(user, submitted: str) -> bool:
    for rc in user.recovery_codes.filter(used_at__isnull=True):
        if check_password(submitted, rc.code_hash):
            # Atomic claim: concurrent submissions cannot both succeed.
            claimed = RecoveryCode.objects.filter(
                pk=rc.pk, used_at__isnull=True).update(used_at=timezone.now())
            if claimed == 1:
                notify_user(user, "A recovery code was used on your account.")
                return True
    return False
```

The notification is not decoration. Recovery-code use is a high-signal event: if the user
did not do it, they need to know immediately.

### Step-up authentication

Not every action needs the same assurance. Re-authenticate for the dangerous ones, even
inside a valid session.

```python
# Purpose: require a fresh authentication for sensitive actions, so a stolen
# session cookie cannot change the password, email or MFA settings. This is what
# limits the damage of exactly the theft that happened in September.
from functools import wraps
from django.utils import timezone
from datetime import timedelta

def requires_recent_auth(max_age=timedelta(minutes=10)):
    def decorator(view):
        @wraps(view)
        def wrapper(request, *args, **kwargs):
            last = request.session.get("last_auth_at")
            if not last or timezone.now() - parse(last) > max_age:
                request.session["next_after_reauth"] = request.get_full_path()
                return redirect("reauth")
            return view(request, *args, **kwargs)
        return wrapper
    return decorator

@requires_recent_auth()
def change_email(request): ...

@requires_recent_auth()
def disable_mfa(request): ...

@requires_recent_auth(max_age=timedelta(minutes=2))
def export_all_student_records(request): ...
```

Apply it to: password change, email change, MFA enrolment and removal, adding a payment
method, bulk export, deleting data, and granting another user access. These are the
actions an attacker with a stolen session wants, and step-up is what stops them.

### Practice

1. Implement TOTP with all three details — drift window, replay prevention, rate limiting.
   Prove a code cannot be used twice.
2. Implement WebAuthn for staff accounts. Then try to authenticate from a different origin
   and watch it fail.
3. Implement hashed single-use recovery codes with the notification.
4. Add step-up authentication to all seven sensitive actions listed above.
5. Write down your MFA recovery path and ask honestly whether it is weaker than the
   password.

---

## Chapter 4: Sessions

Authentication produces a session. How you handle it determines what a stolen credential
is worth — which, after September, is not an abstract question for you.

### Cookie attributes, completely

```python
# Purpose: the full set of session cookie settings, with the reason for each.
# settings.py
SESSION_COOKIE_HTTPONLY = True      # JavaScript cannot read it → XSS cannot steal it
SESSION_COOKIE_SECURE = True        # HTTPS only → never sent over plaintext
SESSION_COOKIE_SAMESITE = "Lax"     # not sent on cross-site POST → CSRF defence
SESSION_COOKIE_AGE = 60 * 60 * 8    # 8 hours absolute
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_COOKIE_NAME = "__Host-sessionid"   # see the prefix note below

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False        # deliberately readable: the JS needs to send it
CSRF_COOKIE_SAMESITE = "Lax"
```

| Attribute | Effect | Omitted means |
|---|---|---|
| `HttpOnly` | unreadable from JavaScript | one XSS becomes full account takeover |
| `Secure` | HTTPS only | the cookie leaks on any plaintext request |
| `SameSite=Lax` | not sent on cross-site POST or iframe | CSRF is wide open |
| `SameSite=Strict` | not sent on *any* cross-site request | more secure; breaks inbound links to logged-in pages |
| `SameSite=None` | always sent — **requires `Secure`** | only for genuine cross-site embedding |
| `Domain` | which hosts receive it | setting `.imboni.rw` sends it to **every** subdomain, including a taken-over one |
| `__Host-` prefix | browser enforces `Secure`, `Path=/`, and no `Domain` | a subdomain can set a cookie your main site reads |

The `Domain` and `__Host-` rows connect to the subdomain-takeover problem in
`../00-foundations/02-NETWORKING_FOR_SECURITY.md` Chapter 3. If your cookie is scoped to
`.imboni.rw` and someone claims `blog.imboni.rw`, they can read it. The `__Host-` prefix
makes the browser refuse any cookie that is not host-locked — a one-word fix for a class
of attack.

### Session fixation

The attacker sets a known session ID *before* you log in, then uses it afterwards.

```python
# Purpose: WRONG. The session ID survives the privilege change, so a pre-set
# identifier becomes an authenticated session.
def login_view(request):
    user = authenticate(...)
    request.session["user_id"] = user.id        # same session ID as before

# Purpose: RIGHT. Cycle the key on every privilege change. Django's login() does
# this for you - which is a reason to use it rather than writing your own.
from django.contrib.auth import login

def login_view(request):
    user = authenticate(...)
    login(request, user)                        # calls cycle_key() internally
    request.session["last_auth_at"] = timezone.now().isoformat()
```

Rotate the session identifier on **every** privilege change: login, step-up, role change,
and impersonation start and stop.

### Timeouts — two of them, for different reasons

```
Idle timeout:      30 min of inactivity   → limits an unattended-machine window
Absolute timeout:  8-12 hours             → limits a stolen cookie's life
```

You need both. An idle timeout alone lets a stolen cookie live indefinitely as long as the
attacker keeps using it. An absolute timeout alone leaves an unlocked laptop usable all
day.

```python
# Purpose: enforce both timeouts. Django gives you the absolute one via
# SESSION_COOKIE_AGE; the idle one needs middleware.
class IdleTimeoutMiddleware:
    IDLE = 30 * 60

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            last = request.session.get("last_activity")
            now = timezone.now().timestamp()
            if last and now - last > self.IDLE:
                from django.contrib.auth import logout
                logout(request)
                return redirect("login")
            request.session["last_activity"] = now
        return self.get_response(request)
```

### Sign out everywhere — the September requirement

This is the control that determines your incident response capability, and it has to be
designed in advance.

```python
# Purpose: invalidate every session for a user across all devices. This is the
# correct response to a confirmed credential theft, and it only works if sessions
# are server-side state you can enumerate - see the JWT discussion in
# ../00-foundations/03-CRYPTOGRAPHY_ESSENTIALS.md Chapter 12.
from django.contrib.sessions.models import Session

def sign_out_everywhere(user, keep_current: str | None = None) -> int:
    killed = 0
    for s in Session.objects.filter(expire_date__gte=timezone.now()).iterator():
        data = s.get_decoded()
        if str(data.get("_auth_user_id")) == str(user.pk):
            if keep_current and s.session_key == keep_current:
                continue
            s.delete()
            killed += 1
    return killed
```

That iteration over all sessions is inefficient at scale. The proper design stores a
session index per user, or a `session_epoch` integer on the user that every request
checks:

```python
# Purpose: O(1) sign-out-everywhere. Bump the epoch and every existing session
# becomes invalid on its next request, with no enumeration required.
class User(AbstractUser):
    session_epoch = models.IntegerField(default=0)

class SessionEpochMiddleware:
    def __call__(self, request):
        if request.user.is_authenticated:
            if request.session.get("epoch") != request.user.session_epoch:
                logout(request)
                return redirect("login")
        return self.get_response(request)

# Incident response becomes one statement:
# User.objects.filter(pk=uid).update(session_epoch=F("session_epoch") + 1)
```

Add a **device list** too, so a user can see and revoke their own sessions:

```python
# Purpose: let users see where they are logged in and revoke individual sessions.
# This turns session management from an admin-only tool into a user-facing control,
# and it is how people discover a compromise themselves.
class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, db_index=True)
    user_agent = models.TextField()
    ip = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)
```

### Practice

1. Set every cookie attribute in the table, including the `__Host-` prefix. Verify in
   DevTools.
2. Implement both timeouts and test each independently.
3. Implement the `session_epoch` design and prove one `UPDATE` logs out every device.
4. Build the device list. Log in from three browsers and revoke one.
5. Answer the September question concretely: how long, today, from "a session was stolen"
   to "every session is dead"?

---

## Chapter 5: Federated identity — OAuth and OIDC

Where "log in with Google" comes from, and where the subtle bugs live.

### The distinction nobody states clearly

> **OAuth 2.0 is an authorisation framework. It is not an authentication protocol.**
> **OpenID Connect is the authentication layer on top of it.**

OAuth answers *"may this application access that resource on the user's behalf?"* An
access token says what the bearer may **do**. It says nothing reliable about **who** the
user is.

OIDC adds an **ID token** — a signed JWT containing identity claims (`sub`, `email`,
`iss`, `aud`, `nonce`) specifically intended for authentication.

Using an OAuth access token as proof of identity is a real vulnerability class: an access
token issued to *another* application can be replayed to yours, and if you authenticate by
calling a userinfo endpoint with whatever token you were handed, you will log the attacker
in as the token's owner. **Verify an ID token; do not trust an access token as identity.**

### The only flow you should use

Authorisation Code with PKCE, for every client type — web, mobile and SPA:

```
1. App → browser → authorisation server
      ?response_type=code
      &client_id=...
      &redirect_uri=https://imboni.rw/auth/callback   (pre-registered, exact)
      &scope=openid email profile
      &state=<random, CSRF protection>
      &nonce=<random, replay protection, lands in the ID token>
      &code_challenge=BASE64URL(SHA256(verifier))
      &code_challenge_method=S256

2. User authenticates and consents

3. Redirect back:  /auth/callback?code=<code>&state=<state>

4. App verifies state matches, then exchanges the code SERVER-SIDE:
      POST /token  { code, client_id, client_secret, code_verifier, redirect_uri }

5. Receives { access_token, id_token, refresh_token }

6. VERIFY the id_token: signature, iss, aud, exp, nonce
```

Why each piece exists:

| Parameter | Prevents |
|---|---|
| `state` | CSRF — an attacker making you complete *their* login |
| `nonce` | ID token replay — binds the token to this specific request |
| `code_challenge` (PKCE) | authorisation code interception, originally a mobile problem |
| exact `redirect_uri` | code exfiltration to an attacker-controlled URL |

**Implicit flow is dead.** It returned tokens in the URL fragment — straight into browser
history, `Referer` headers and logs, the exact leakage from
`../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 4. OAuth 2.1 removes it, along with
the password grant.

```python
# Purpose: the callback, with every check that matters. Omitting any one of these
# is a known, exploited vulnerability class.
import secrets, hashlib, base64
from jose import jwt

def oauth_start(request):
    verifier = secrets.token_urlsafe(64)
    challenge = base64.urlsafe_b64encode(
        hashlib.sha256(verifier.encode()).digest()).decode().rstrip("=")
    request.session["pkce_verifier"] = verifier
    request.session["oauth_state"] = secrets.token_urlsafe(32)
    request.session["oidc_nonce"] = secrets.token_urlsafe(32)
    # ... redirect with the parameters above

def oauth_callback(request):
    # 1. state must match, and must be CONSUMED so it cannot be replayed.
    expected = request.session.pop("oauth_state", None)
    if not expected or not secrets.compare_digest(
            request.GET.get("state", ""), expected):
        raise PermissionDenied("state mismatch")

    # 2. Exchange the code server-side, with the PKCE verifier.
    tokens = exchange_code(
        code=request.GET["code"],
        verifier=request.session.pop("pkce_verifier"),
        redirect_uri="https://imboni.rw/auth/callback")

    # 3. VERIFY the ID token. Do not decode without verifying.
    claims = jwt.decode(
        tokens["id_token"],
        key=fetch_jwks(ISSUER),              # cached, rotated
        algorithms=["RS256"],                # pinned - crypto Ch 12
        audience=CLIENT_ID,
        issuer=ISSUER,
    )

    # 4. nonce must match the one we generated.
    if not secrets.compare_digest(
            claims.get("nonce", ""), request.session.pop("oidc_nonce", "")):
        raise PermissionDenied("nonce mismatch")

    # 5. Match on the stable 'sub', never on email - see the attack below.
    return link_or_create_user(issuer=claims["iss"], subject=claims["sub"],
                               email=claims.get("email"),
                               email_verified=claims.get("email_verified", False))
```

### Advanced: the account-linking attack

Step 5's comment hides the most commonly exploited OIDC bug in small applications.

```
1. Attacker registers on your app with victim@school.rw and a password. No
   verification required, or verification is never enforced.
2. Victim later clicks "Sign in with Google" as victim@school.rw.
3. Your app looks up the user BY EMAIL, finds the attacker's account, and links
   the identity to it.
4. The attacker now logs in with their own password and is the victim.
```

Also the reverse: an identity provider that does not verify email ownership lets an
attacker create an account claiming your user's address.

The rules that close it:

- **Match on `(iss, sub)`**, which is stable and provider-asserted — never on email alone
- **Only auto-link when `email_verified` is true** *and* your own local account's email is
  also verified
- **Otherwise require a password login first**, then link from inside the account
- **Treat email as a mutable attribute**, not an identifier. Users change addresses;
  `sub` does not

```python
# Purpose: safe identity linking. An unverified email never silently takes over an
# existing account.
def link_or_create_user(issuer, subject, email, email_verified):
    identity = FederatedIdentity.objects.filter(
        issuer=issuer, subject=subject).select_related("user").first()
    if identity:
        return identity.user                       # known identity, trusted path

    existing = User.objects.filter(email__iexact=email).first() if email else None
    if existing:
        if not (email_verified and existing.email_verified):
            raise NeedsManualLink(
                "Sign in with your password first, then connect this account.")
        FederatedIdentity.objects.create(
            issuer=issuer, subject=subject, user=existing)
        notify_user(existing, f"{issuer} was connected to your account.")
        return existing

    user = User.objects.create(email=email, email_verified=email_verified)
    FederatedIdentity.objects.create(issuer=issuer, subject=subject, user=user)
    return user
```

### Practice

1. Explain, in two sentences, why an OAuth access token is not proof of identity.
2. Audit any social login in your projects for `state`, `nonce`, PKCE, exact redirect URI,
   and ID token verification with a pinned algorithm.
3. Attempt the account-linking attack against your own implementation. Document the
   result.
4. Confirm you match on `sub` and not email.

---

# PART 2 — AUTHORISATION

## Chapter 6: The models

Pick deliberately. Most systems drift into a muddle of all four and become impossible to
reason about.

| Model | Decision based on | Good for | Breaks down when |
|---|---|---|---|
| **ACL** | a list per object | few objects, explicit sharing | thousands of objects |
| **RBAC** | the user's role | organisational hierarchies | permissions depend on the *object* |
| **ABAC** | attributes of user, object, environment | fine-grained, contextual | hard to audit "who can see X?" |
| **ReBAC** | *relationships* in a graph | "my child", "my school", "shared with me" | needs real infrastructure |
| **PBAC** | centralised policy, often as code | many services, one policy engine | overkill for a monolith |

### Why your case needs ReBAC thinking

RBAC answers "is this user a parent?" Imboni's actual question is **"is this user *this
child's* parent?"** — a relationship, not a role. RBAC cannot express it, and attempts to
bolt it on produce exactly the tangled `can_view` from
`../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 10.

```
RBAC:  user.role == "parent"                       → WRONG. Any parent, any child.
ReBAC: guardianship(user, child) exists AND is current → the real question
```

And the relationship is not simple. It has a type (mother, father, guardian, emergency
contact), a validity period (custody changes; a child leaves the school), and permissions
that vary by type. That is a graph, and modelling it as a role is the root cause of a whole
class of bugs.

```python
# Purpose: model the relationship explicitly, with its type and validity, so
# authorisation can ask the real question. This single model replaces a dozen
# scattered role checks.
class Guardianship(models.Model):
    class Kind(models.TextChoices):
        MOTHER = "mother"
        FATHER = "father"
        LEGAL_GUARDIAN = "legal_guardian"
        EMERGENCY_CONTACT = "emergency_contact"      # fewer permissions

    guardian = models.ForeignKey(User, on_delete=models.CASCADE,
                                 related_name="guardianships")
    child = models.ForeignKey("Student", on_delete=models.CASCADE,
                              related_name="guardianships")
    kind = models.CharField(max_length=32, choices=Kind.choices)

    valid_from = models.DateField()
    valid_until = models.DateField(null=True, blank=True)   # null = current

    can_view_records = models.BooleanField(default=True)
    can_view_address = models.BooleanField(default=True)     # see the note below
    can_collect_child = models.BooleanField(default=False)
    verified_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    verified_at = models.DateTimeField(null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["guardian", "child"],
                condition=models.Q(valid_until__isnull=True),
                name="one_current_guardianship_per_pair"),
        ]

    @property
    def is_current(self) -> bool:
        today = timezone.localdate()
        return (self.valid_from <= today
                and (self.valid_until is None or self.valid_until >= today))
```

`can_view_address` as a separate flag is the control for the hostile-separated-parent
adversary from `../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 3 — risk **R6**,
which that file's register marks as *not started*. This model is where it gets started: a
guardian can be given record access without location access, and `valid_until` means a
court order can be reflected in the system the same day.

### Practice

1. Decide which model each project uses today. Then decide which it *should* use.
2. Implement the `Guardianship` model, or the Screening equivalent.
3. Enumerate every permission a guardian could have. Which should be separately
   grantable?
4. Model one real scenario: a court restricts one parent's access to a child's location
   but not their grades.

---

## Chapter 7: Broken Access Control — A01:2025

The #1 risk, with the full taxonomy. Check your code against every row.

| Variant | Attack | Example |
|---|---|---|
| **IDOR / BOLA** | change an object ID | `/api/students/1247/` → `1248` |
| **Horizontal escalation** | reach a peer's data | another parent's child |
| **Vertical escalation** | reach a higher role's function | a parent calling an admin endpoint |
| **Missing function-level authz** | the endpoint checks login, not role | `POST /api/users/` creating staff |
| **Mass assignment** | set fields you should not control | `{"role": "admin"}` in a profile update |
| **Forced browsing** | guess an unlinked URL | `/admin/export-all/` |
| **Path traversal** | escape a directory | `?file=../../../../etc/passwd` |
| **CORS misconfiguration** | reflect any origin with credentials | `Access-Control-Allow-Origin: <attacker>` |
| **Metadata manipulation** | tamper with a JWT or hidden field | `role` claim in an unverified token |
| **SSRF** | make the server request internal resources | now part of A01 — networking Ch 16 |

### IDOR, the one you will actually have

```python
# Purpose: WRONG. Authenticated but not authorised. The single most common serious
# web vulnerability, and it looks like perfectly normal code.
@login_required
def student_detail(request, pk):
    student = get_object_or_404(Student, pk=pk)
    return render(request, "student.html", {"student": student})
```

Three fixes, in increasing order of robustness:

```python
# Purpose: FIX 1 - scope the lookup to what this user may see. Correct, but it
# relies on every author remembering to do it.
@login_required
def student_detail(request, pk):
    student = get_object_or_404(visible_students(request.user), pk=pk)
    ...

# Purpose: FIX 2 - one central policy, used everywhere. Now there is a single
# place to audit and a single place to fix.
def visible_students(user) -> QuerySet:
    qs = Student.objects.all()
    if user.is_superuser:
        return qs
    if user.role in ("teacher", "head_teacher", "admin"):
        return qs.filter(school_id=user.school_id)
    if user.role == "parent":
        today = timezone.localdate()
        return qs.filter(
            guardianships__guardian=user,
            guardianships__can_view_records=True,
            guardianships__valid_from__lte=today,
        ).filter(
            Q(guardianships__valid_until__isnull=True)
            | Q(guardianships__valid_until__gte=today)
        ).distinct()
    return Student.objects.none()          # fail-safe default: deny

# Purpose: FIX 3 - make it structurally impossible to query unscoped, by removing
# the unscoped manager from the model entirely.
class ScopedManager(models.Manager):
    def for_user(self, user):
        return visible_students(user)

    def get_queryset(self):
        raise RuntimeError(
            "Student.objects is disabled. Use Student.objects.for_user(request.user).")
```

Fix 3 looks aggressive and it is the one that actually holds, because it converts "someone
forgot" from a silent data breach into a crash in development. That is the complete
mediation principle with teeth.

### Mass assignment

```python
# Purpose: WRONG. A serializer with __all__ lets a user set any field, including
# role, school, and is_staff.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"          # POST {"role": "admin"} → admin

# Purpose: RIGHT. An explicit allow-list of writable fields, with everything
# security-relevant read-only.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "phone",
                  "role", "school", "is_staff", "is_superuser"]
        read_only_fields = ["id", "role", "school", "is_staff", "is_superuser"]
```

`fields = "__all__"` is the single most dangerous idiom in Django REST Framework. Grep for
it:

```bash
# Purpose: find every serializer that will accept any field a client sends.
grep -rn '"__all__"\|= .__all__.' --include="*.py" . | grep -i serial
```

### 403 or 404 — an information-disclosure decision

```python
# Purpose: 404 rather than 403 for objects the user may not see, so the response
# does not confirm that the object exists. A 403 on /students/1248/ tells a hostile
# parent that student 1248 is enrolled - which is itself a disclosure, and a
# safeguarding problem rather than a technical one.
student = get_object_or_404(visible_students(request.user), pk=pk)
```

Use 403 when the user knows the resource exists and is being told they lack permission
(their own account's billing page, say). Use 404 when existence is itself sensitive. For
children's records, 404.

### CORS — the misconfiguration that undoes everything

```python
# Purpose: WRONG. Reflecting any origin with credentials allows any website to make
# authenticated requests as your logged-in users and read the responses.
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True          # this combination is the vulnerability

# Purpose: RIGHT. An exact allow-list. Note that a wildcard is IGNORED by browsers
# when credentials are included, so "it works" in testing can mean the opposite of
# what you think.
CORS_ALLOWED_ORIGINS = [
    "https://imboni.rw",
    "https://www.imboni.rw",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False
```

Also beware regex origin matching: `^https://.*\.imboni\.rw$` permits a taken-over
subdomain, and `^https://imboni\.rw.*$` permits `imboni.rw.attacker.com`. Anchor and
escape properly, or enumerate exactly.

### Testing it — the part that makes it stay fixed

Authorisation bugs are *regressions*. A test suite is the only thing that keeps them fixed.

```python
# Purpose: a parametrised cross-user authorisation test. One test, every endpoint.
# This is the highest-value test file in either project.
import pytest

PROTECTED_ENDPOINTS = [
    ("GET",  "/api/students/{other_student}/"),
    ("GET",  "/api/students/{other_student}/attendance/"),
    ("GET",  "/api/students/{other_student}/report.pdf"),
    ("PATCH","/api/students/{other_student}/"),
    ("GET",  "/api/schools/{other_school}/students/"),
    ("POST", "/api/students/{other_student}/notes/"),
]

@pytest.mark.parametrize("method,template", PROTECTED_ENDPOINTS)
def test_parent_cannot_reach_another_familys_child(
        client, parent_a, child_of_b, school_b, method, template):
    client.force_login(parent_a)
    url = template.format(other_student=child_of_b.id, other_school=school_b.id)
    r = client.generic(method, url)
    assert r.status_code == 404, (
        f"{method} {url} returned {r.status_code} to an unauthorised parent")

@pytest.mark.parametrize("method,template", PROTECTED_ENDPOINTS)
def test_teacher_cannot_reach_another_school(
        client, teacher_a, child_of_b, school_b, method, template):
    client.force_login(teacher_a)
    url = template.format(other_student=child_of_b.id, other_school=school_b.id)
    assert client.generic(method, url).status_code == 404

def test_parent_cannot_escalate_via_mass_assignment(client, parent_a):
    client.force_login(parent_a)
    r = client.patch("/api/me/", {"role": "admin", "is_staff": True},
                     content_type="application/json")
    parent_a.refresh_from_db()
    assert parent_a.role == "parent" and not parent_a.is_staff
```

```python
# Purpose: a coverage test that FAILS when a new endpoint is added without an
# authorisation test. This is what stops the suite from decaying.
def test_every_object_endpoint_has_an_authz_test():
    from django.urls import get_resolver
    tested = {t for _, t in PROTECTED_ENDPOINTS}
    object_routes = {
        f"/{p.pattern}" for p in get_resolver().url_patterns
        if "<int:pk>" in str(p.pattern) or "<pk>" in str(p.pattern)}
    untested = {r for r in object_routes
                if not any(r.split("<")[0] in t for t in tested)}
    assert not untested, f"endpoints with no authorisation test: {untested}"
```

### Practice

1. Go through all ten rows of the taxonomy against both projects. Record a hit or a miss
   for each, with file and line.
2. Implement the central `visible_students` policy and refactor every view to use it.
3. Run the `__all__` grep and fix every serializer.
4. Write the parametrised cross-user test for every object endpoint. Expect failures.
5. Add the coverage test so a new endpoint without a test breaks CI.
6. Check CORS for a reflected origin with credentials.

---

## Chapter 8: Enforcing it where it cannot be bypassed

Application checks are bypassed by the path you forgot: a management command, the Django
admin, a Celery task, a raw SQL report, a CSV export. The deeper enforcement is in the
database.

### Postgres row-level security

```sql
-- Purpose: enforce tenant isolation in the database, so even a raw query or a
-- forgotten WHERE clause cannot cross schools. This is defence in depth for the
-- failure mode that is most likely and most silent.
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE students FORCE ROW LEVEL SECURITY;   -- applies to the table owner too

CREATE POLICY students_tenant ON students
  USING (school_id = current_setting('app.school_id', true)::int);

-- Purpose: a separate policy for the superuser path, so platform admins still work.
CREATE POLICY students_platform_admin ON students
  USING (current_setting('app.is_platform_admin', true) = 'on');
```

```python
# Purpose: set the session variable on every request so RLS has the tenant context.
# SET LOCAL scopes it to the transaction, so it cannot leak between pooled
# connections - which is the bug this pattern is most prone to.
from django.db import connection

class TenantRLSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and request.user.school_id:
            with connection.cursor() as c:
                c.execute("SELECT set_config('app.school_id', %s, true)",
                          [str(request.user.school_id)])
        return self.get_response(request)
```

The connection-pooling caveat is the important one. With a transaction-pooling proxy such
as PgBouncer, a `SET` without `LOCAL` can persist onto the next request's connection and
serve one tenant's rows to another — turning a safety control into a cross-tenant leak.
`set_config(..., true)` is transaction-scoped. Test it under concurrency, not just in
development.

### Practice

1. Enable RLS on your most sensitive table and prove a raw query cannot escape it.
2. Test RLS under a connection pool with concurrent requests from two tenants.
3. List every non-HTTP path to your data: admin, commands, tasks, exports, backups. For
   each, state whether authorisation applies.

---

## Chapter 9: Machine and service identity

Humans are not the only principals, and service credentials are usually the weakest.

| Credential | Lifetime | Problem |
|---|---|---|
| API key in `.env` | forever | **stolen in September; still valid** |
| Service account password | forever | shared, never rotated |
| OAuth client credentials | long | at least scoped |
| **Short-lived token from a workload identity** | minutes | the right answer |
| mTLS certificate | months, auto-renewed | strong, more setup |

The direction of travel is away from long-lived secrets entirely. In CI, use the
provider's OIDC federation so no credential is stored at all:

```yaml
# Purpose: deploy with a short-lived token minted from the workflow's own identity,
# so there is no long-lived cloud credential in GitHub secrets to steal.
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/imboni-deploy
          aws-region: eu-west-1
          # No access key. The token is minted per run and expires in minutes.
```

This is also the zero-trust point from `../00-foundations/01-SECURITY_FOUNDATIONS.md`
Chapter 12, applied: the laptop stops holding standing production credentials, because CI
mints them per run.

### API key design, when you must have them

```python
# Purpose: API keys that can be rotated, scoped and revoked, and whose theft from
# your database does not yield working credentials.
import secrets, hashlib

class APIKey(models.Model):
    name = models.CharField(max_length=100)
    prefix = models.CharField(max_length=8, db_index=True)   # shown in the UI
    key_hash = models.CharField(max_length=64)               # SHA-256 of the secret
    scopes = models.JSONField(default=list)
    expires_at = models.DateTimeField(null=True)
    last_used_at = models.DateTimeField(null=True)
    revoked_at = models.DateTimeField(null=True)

    @classmethod
    def issue(cls, name, scopes, ttl_days=90):
        raw = secrets.token_urlsafe(32)
        prefix = raw[:8]
        obj = cls.objects.create(
            name=name, prefix=prefix, scopes=scopes,
            key_hash=hashlib.sha256(raw.encode()).hexdigest(),
            expires_at=timezone.now() + timedelta(days=ttl_days))
        return obj, f"imb_{prefix}_{raw}"            # returned ONCE
```

Four properties worth copying: the key is **hashed at rest** (a database leak yields
nothing usable), the **prefix** lets a user identify a key without revealing it, keys
**expire by default**, and `scopes` makes least privilege possible. A recognisable prefix
such as `imb_` also lets secret scanners detect your keys in public repositories.

### Practice

1. Inventory every machine credential in both projects with its lifetime and scope.
2. Replace one long-lived CI credential with OIDC federation.
3. Implement hashed, scoped, expiring API keys.
4. Answer: which service credentials stolen in September are still valid today?

---

## Chapter 10: Audit

Authorisation decides what happens. Audit is how you know what did.

```python
# Purpose: log every access to personal data, in a form you can query during an
# incident. This is the control that was missing in September, which is why you
# still cannot say what was read.
class AccessLog(models.Model):
    actor = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    actor_email = models.CharField(max_length=254)      # survives user deletion
    action = models.CharField(max_length=64)            # view, export, modify, delete
    object_type = models.CharField(max_length=64)
    object_id = models.CharField(max_length=64)
    subject_id = models.CharField(max_length=64, null=True)   # whose data
    ip = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)
    at = models.DateTimeField(auto_now_add=True, db_index=True)
    extra = models.JSONField(default=dict)

    class Meta:
        indexes = [
            models.Index(fields=["subject_id", "at"]),   # "who read this child's data?"
            models.Index(fields=["actor", "at"]),        # "what did this user access?"
        ]
```

Four requirements that make an audit log actually usable:

1. **Append-only.** A log the application can edit is worthless against an insider. Revoke
   `UPDATE` and `DELETE` from the application's database user, and ship the log off-box.
2. **Two indexes.** `(subject, at)` answers the regulator's question — "who accessed this
   child's record?" — and `(actor, at)` answers yours.
3. **Never log the secret.** No passwords, no tokens, no full record contents. An audit log
   containing sensitive data becomes a second copy of the thing you are protecting.
4. **A retention period**, because the log is personal data too.

```sql
-- Purpose: make the log append-only at the database level, so a compromised
-- application cannot rewrite history.
REVOKE UPDATE, DELETE ON access_log FROM imboni_app;
GRANT INSERT, SELECT ON access_log TO imboni_app;
```

Pair it with the hash-chaining from `../00-foundations/03-CRYPTOGRAPHY_ESSENTIALS.md`
Chapter 2 and tampering becomes detectable even by someone with database access.

### Practice

1. Implement `AccessLog` and apply it to every read of student or response data.
2. Make it append-only with the `REVOKE`. Verify an `UPDATE` fails.
3. Answer the regulator's question from your log: who accessed one named child's record in
   the last 90 days?
4. Add hash chaining and a daily published root.

---

## Chapter 11: The failure catalogue

| # | Failure | Fix |
|---|---|---|
| 1 | `get_object_or_404(Model, pk=pk)` with no user scope | scope via a central policy |
| 2 | Authorisation in the list view only | complete mediation on every access |
| 3 | `fields = "__all__"` in a serializer | explicit allow-list, read-only on sensitive fields |
| 4 | Role check instead of relationship check | ReBAC — `Guardianship`, not `role == "parent"` |
| 5 | 403 where existence is sensitive | 404 |
| 6 | `CORS_ALLOW_ALL_ORIGINS` with credentials | exact origin allow-list |
| 7 | Distinguishable login errors | one generic message, plus a dummy hash |
| 8 | Per-account rate limit only | multi-dimensional, including per-IP across accounts |
| 9 | Session ID not rotated on login | `cycle_key` / use `login()` |
| 10 | Cookie without `HttpOnly`/`Secure`/`SameSite` | set all three, plus `__Host-` |
| 11 | No absolute session timeout | both idle and absolute |
| 12 | Cannot sign out everywhere | `session_epoch` or a session index |
| 13 | TOTP with no replay check | single-use within the window |
| 14 | Recovery codes stored in plaintext | hashed, single-use, notify on use |
| 15 | MFA with an SMS fallback on a hardware-key account | no downgrade path |
| 16 | No step-up for sensitive actions | re-authenticate |
| 17 | Access token used as proof of identity | verify an OIDC ID token |
| 18 | OAuth without `state`, `nonce` or PKCE | all three, consumed once |
| 19 | Identity linked by email | link on `(iss, sub)`, require verification |
| 20 | Audit log the application can modify | `REVOKE UPDATE, DELETE` |
| 21 | Long-lived API keys stored in plaintext | hashed, scoped, expiring |
| 22 | `SET` instead of `set_config(..., true)` under a pooler | transaction-scoped |

## Chapter 12: The checklist

**Authentication**
- [ ] Argon2id, no composition rules, no forced rotation, 12+ character minimum
- [ ] Breached-password check at set time, failing open
- [ ] One generic error for all login failures, with timing equalised
- [ ] Password reset reveals nothing about account existence
- [ ] Multi-dimensional rate limiting, including per-IP across accounts
- [ ] MFA available to all users, **required** for staff
- [ ] TOTP with drift window, replay prevention and rate limiting
- [ ] WebAuthn for staff, two credentials registered
- [ ] Recovery codes hashed, single-use, with notification
- [ ] No MFA downgrade path
- [ ] Step-up authentication on every sensitive action

**Sessions**
- [ ] `HttpOnly`, `Secure`, `SameSite`, `__Host-` prefix
- [ ] Session ID rotated on every privilege change
- [ ] Idle **and** absolute timeouts
- [ ] Sign-out-everywhere implemented and tested
- [ ] User-visible device list with per-session revocation

**Federation**
- [ ] Authorisation Code + PKCE only; no implicit, no password grant
- [ ] `state` and `nonce` generated, verified, consumed
- [ ] ID token verified with a pinned algorithm, `iss`, `aud`, `exp`
- [ ] Identity matched on `(iss, sub)`, never email
- [ ] Exact redirect URI registration

**Authorisation**
- [ ] One central policy function, used by every access path
- [ ] Relationship-based where the question is relational
- [ ] Default deny for unknown roles
- [ ] No `fields = "__all__"`
- [ ] 404 where existence is sensitive
- [ ] RLS on the most sensitive tables, tested under pooling
- [ ] Cross-user tests for every object endpoint
- [ ] A coverage test that fails when an endpoint has no authorisation test
- [ ] Every non-HTTP path accounted for

**Audit**
- [ ] Every personal-data access logged
- [ ] Append-only, enforced by database grants
- [ ] Indexed by subject and by actor
- [ ] No secrets in the log; retention period set

---

## Exercise 4 — the module checkpoint

Guide closed. No AI. Each produces an artefact.

1. **Enumeration audit.** Test all four channels on both projects, including the timing
   one over 1,000 requests. Fix every leak and prove the timing difference is gone.
   (Chapter 2)

2. **Breached passwords and rate limits.** Implement both. Demonstrate the per-IP limit
   stopping one password tried against 50 accounts. (Chapter 2)

3. **MFA, complete.** TOTP with drift window, replay prevention and rate limiting;
   WebAuthn for staff; hashed single-use recovery codes with notification. Prove a TOTP
   code cannot be used twice and that a passkey fails from a wrong origin. (Chapter 3)

4. **Step-up.** Add it to all seven sensitive actions. Then demonstrate that a stolen
   session cookie cannot change the account's email. (Chapter 3)

5. **Session hardening.** Every cookie attribute, both timeouts, `session_epoch`
   sign-out-everywhere, and a device list. Time yourself killing every session for one
   user. (Chapter 4)

6. **The September answer.** Write down, as a runbook: a session is confirmed stolen at
   14:00. What do you run, in what order, and how long until every session on both
   projects is dead? (Chapter 4)

7. **OAuth audit.** If you have social login, verify all five controls and attempt the
   account-linking attack against yourself. If you do not, implement it correctly once in
   a scratch project. (Chapter 5)

8. **The taxonomy.** All ten rows of Chapter 7 against both projects. Hit or miss, with
   file and line. Expect at least three hits. (Chapter 7)

9. **Central policy.** Implement `visible_students` (or the Screening equivalent) and
   refactor **every** access path to use it, including admin, exports and Celery tasks.
   Then disable the unscoped manager and fix what breaks. (Chapter 7)

10. **The test suite.** Parametrised cross-user tests for every object endpoint, plus the
    coverage test that fails on an untested endpoint. Report how many endpoints failed on
    the first run. (Chapter 7)

11. **Relationship model.** Implement `Guardianship` with type, validity and separable
    permissions. Model the court-order scenario: location access revoked, grade access
    retained. This is risk **R6** from the foundations file, and it is currently not
    started. (Chapter 6)

12. **RLS.** Enable it on the most sensitive table. Prove a raw query cannot escape, and
    test it under a connection pool with two concurrent tenants. (Chapter 8)

13. **Audit log.** Implement it, make it append-only, and answer the regulator's question
    from real data: who accessed one named child's record in the last 90 days? (Chapter 10)

14. **Machine credentials.** Inventory every one with lifetime and scope. Replace one with
    OIDC federation. State which September-era credentials are still valid. (Chapter 9)

**Automatic fail:** any object endpoint without a cross-user test; `fields = "__all__"`
surviving anywhere; a role check standing in for a relationship check on a child's record.

Exercise 11 is the one that protects a specific child from physical harm, and it is the
one that has been open since the September threat model. Exercise 10 is the one that will
find bugs in your code today.
