# Cryptography — Zero to Professional

**Week 19.** By the end of this file you can pick the right primitive for a job, read a
library's documentation critically enough to notice when it is dangerous, configure TLS
correctly, and explain why your system is or is not ready for post-quantum.

Cryptography is the part of security where the mathematics is sound and the
implementations fail. Almost nobody breaks AES. Everybody breaks AES-GCM by reusing a
nonce, verifies a MAC with `==`, stores the key next to the ciphertext, or encrypts a
column and calls the system secure.

So this file spends very little time on how the algorithms work internally and a great
deal on **how they are used, and the specific ways that goes wrong.** That is where your
bugs will be.

---

## Table of Contents

1. [Before you read a word](#before-you-read-a-word)
2. [Chapter 1: Five jobs, five primitives](#chapter-1-five-jobs-five-primitives)
3. [Chapter 2: Hashing](#chapter-2-hashing)
4. [Chapter 3: Password hashing](#chapter-3-password-hashing)
5. [Chapter 4: MACs and HMAC](#chapter-4-macs-and-hmac)
6. [Chapter 5: Symmetric encryption](#chapter-5-symmetric-encryption)
7. [Chapter 6: Asymmetric cryptography](#chapter-6-asymmetric-cryptography)
8. [Chapter 7: Randomness](#chapter-7-randomness)
9. [Chapter 8: Key management](#chapter-8-key-management)
10. [Chapter 9: TLS in depth](#chapter-9-tls-in-depth)
11. [Chapter 10: Post-quantum cryptography](#chapter-10-post-quantum-cryptography)
12. [Chapter 11: Encoding is not encryption](#chapter-11-encoding-is-not-encryption)
13. [Chapter 12: Tokens and JWTs](#chapter-12-tokens-and-jwts)
14. [Chapter 13: Applied patterns](#chapter-13-applied-patterns)
15. [Chapter 14: The failure catalogue](#chapter-14-the-failure-catalogue)
16. [Chapter 15: The checklist](#chapter-15-the-checklist)
17. [Exercise 3 — the module checkpoint](#exercise-3--the-module-checkpoint)

---

## Before you read a word

The two rules that prevent most cryptographic disasters:

> **1. Never design your own primitive.** Not a cipher, not a hash, not a MAC
> construction, not "AES plus a bit of XOR". The ones we use survived decades of
> dedicated attack by specialists. Yours survived an afternoon.
>
> **2. Never implement a primitive yourself,** even a published one. The algorithm being
> public does not make the implementation safe — timing, memory access patterns, branch
> prediction and compiler optimisation all leak. Use a library whose authors thought
> about that.

What is left for you is **composition**: choosing primitives, managing keys, and not
misusing the library. That is a real skill, it is the whole content of this file, and it
is where every bug in the catalogue in Chapter 15 comes from.

---

# PART 1 — THE PRIMITIVES

## Chapter 1: Five jobs, five primitives

Most cryptographic mistakes are **category errors** — using a primitive for a job it was
never meant to do. Learn this table before anything else.

| Job | Primitive | Use | Never use |
|---|---|---|---|
| Prove data has not changed | Hash | SHA-256, SHA-3, BLAKE3 | MD5, SHA-1 |
| Store a password | **Slow** password hash | Argon2id, scrypt, bcrypt | SHA-256, any fast hash |
| Prove who sent it (shared secret) | MAC | HMAC-SHA-256, Poly1305 | `hash(secret + message)` |
| Prove who sent it (public) | Signature | Ed25519, ECDSA P-256, RSA-PSS | textbook RSA |
| Keep data secret | AEAD cipher | AES-256-GCM, XChaCha20-Poly1305 | AES-ECB, AES-CBC alone |
| Agree a key over a hostile network | KEM / key agreement | X25519, ML-KEM (hybrid) | sending the key |
| Turn a password into a key | KDF | Argon2id, scrypt, PBKDF2 | the password itself |
| Turn a key into more keys | KDF | HKDF | using the same key twice |

Two rows are the most commonly confused, and each has its own chapter:

- **Hash vs password hash.** A hash is designed to be *fast*. A password hash is designed
  to be *slow*. Using SHA-256 for passwords is not a weaker choice; it is the wrong
  primitive, and it is why breached databases get cracked in hours. (Chapter 3)
- **Hash vs MAC.** A hash proves data did not change *accidentally*. Anyone can recompute
  it, so it proves nothing about origin. A MAC requires a key. (Chapter 4)

### The decision procedure

When you do not know which to reach for, answer in this order:

```
1. Is a human-chosen secret involved?          → password hash / KDF    (Ch 3)
2. Does it need to stay SECRET?                → AEAD cipher            (Ch 5)
3. Does it need to be VERIFIABLE by a holder of the same secret?
                                               → MAC                    (Ch 4)
4. Does it need to be verifiable by the PUBLIC, or non-repudiable?
                                               → signature              (Ch 6)
5. Do two parties need a shared key over a hostile channel?
                                               → key agreement / KEM    (Ch 6, 10)
6. Only integrity against accident, no adversary?
                                               → hash                   (Ch 2)
```

Step 3 versus step 4 is the one worth internalising now. If you ever need to prove *to a
third party* that a message came from a specific sender, a MAC cannot do it — both
parties hold the same key, so either could have produced the tag. That is the
non-repudiation property from `01-SECURITY_FOUNDATIONS.md` Chapter 2, and it needs
asymmetric signatures.

---

## Chapter 2: Hashing

### What a hash is

A function mapping arbitrary input to a fixed-size output, with three properties:

| Property | Means | Broken means |
|---|---|---|
| **Preimage resistance** | given `h`, you cannot find `m` with `H(m) = h` | hashes can be reversed |
| **Second preimage resistance** | given `m₁`, you cannot find `m₂ ≠ m₁` with the same hash | you can forge a substitute for a *specific* document |
| **Collision resistance** | you cannot find *any* `m₁ ≠ m₂` with the same hash | you can forge a pair of documents you crafted |

```python
# Purpose: the basic properties - same input always gives the same output, and a
# one-bit change gives a completely different output (the avalanche effect).
import hashlib

print(hashlib.sha256(b"attendance: 94%").hexdigest())
# 1a0d8e4f...  (64 hex chars = 256 bits, always)
print(hashlib.sha256(b"attendance: 95%").hexdigest())
# c7b2f019...  entirely different - no partial similarity leaks
```

### The birthday bound — why 256 bits and not 128

Collision resistance is only **half** the output size, because of the birthday paradox:
with `n` bits of output, a collision appears after about `2^(n/2)` attempts, not `2^n`.

```
SHA-256  → 256-bit output → 2^128 work to find a collision   (safe)
           but only        → 2^256 work to find a preimage
MD5      → 128-bit output → 2^64  nominal → ACTUALLY BROKEN, seconds on a laptop
SHA-1    → 160-bit output → 2^80  nominal → BROKEN in practice since 2017
```

This is why "128-bit security" means a 256-bit hash. Preimage resistance gets the full
output length; collision resistance gets half. When someone says a hash has `n` bits of
security, ask *against which property*.

### Which hash, in 2026

| Hash | Status | Use for |
|---|---|---|
| **MD5** | broken (collisions trivial) | nothing. Legacy checksums only, never security |
| **SHA-1** | broken — first collision 2017 (SHAttered), chosen-prefix collision 2020 | nothing new. Git is migrating away |
| **SHA-256 / SHA-512** | secure | the default choice; universally available |
| **SHA-512/256** | secure | SHA-512 truncated — faster on 64-bit, immune to length extension |
| **SHA-3 (Keccak)** | secure | different internal structure to SHA-2; good diversity choice |
| **BLAKE2 / BLAKE3** | secure | much faster than SHA-2; BLAKE3 parallelises |

"Broken" needs precision, because people over- and under-react. SHA-1 collisions are
practical, so SHA-1 is unusable anywhere an *adversary* chooses the input — certificates,
signatures, deduplication of untrusted files. SHA-1 preimages are still infeasible, which
is why Git has not catastrophically fallen over. But there is no reason to start anything
new with it.

### The length-extension attack — why HMAC exists

This is the single most important structural fact about SHA-256, and the reason for
Chapter 4.

SHA-2 and MD5 use the **Merkle–Damgård** construction: they process the message in blocks
and the output *is* the internal state. So given `H(secret || message)` — without knowing
`secret` — an attacker can compute `H(secret || message || padding || anything)`.

```python
# Purpose: demonstrate WHY hash(secret + message) is a broken MAC. An attacker who
# sees a valid tag can append data and produce a valid tag for the longer message,
# without ever learning the secret.
#
#  Given:  tag = SHA256(secret || "user=alice&role=parent")
#  The attacker can compute, knowing only the tag and len(secret):
#          SHA256(secret || "user=alice&role=parent" || padding || "&role=admin")
#  ... and the server, parsing last-wins, sees role=admin with a VALID tag.
#
# Try it with the `hashpumpy` library on a test server. It takes four lines.
```

Three ways out:

1. **Use HMAC** — designed for exactly this, works with any hash (Chapter 4)
2. **Use SHA-3 or BLAKE** — sponge/tree constructions; the internal state is larger than
   the output, so extension does not work
3. **Use SHA-512/256** — truncation hides enough state

The lesson generalises past this one attack: **a primitive's internal construction
determines what compositions are safe.** You cannot reason about "a hash" abstractly and
be correct.

### What hashing is not for

| Mistaken use | Why wrong | Use instead |
|---|---|---|
| Storing passwords | too fast — billions of guesses/second on a GPU | Argon2id (Ch 3) |
| "Encrypting" data | hashing is one-way; there is nothing to recover | AEAD cipher (Ch 5) |
| Proving origin | anyone can recompute it | HMAC or signature (Ch 4, 6) |
| Anonymising personal data | a hashed phone number is trivially brute-forced — the keyspace is tiny | real de-identification (`../06-governance/`) |
| Hiding a short secret | same problem: enumerate the whole input space | HMAC with a key |

The anonymisation row has legal weight for you. **Hashing a national ID or a phone number
does not anonymise it.** There are ~10⁹ Rwandan phone numbers; a GPU hashes that entire
space in under a second, so the hash is reversible by enumeration and remains personal
data under Law No. 058/2021. Pseudonymisation that actually works needs a *keyed* function
(HMAC) with the key held separately, or a random token with a mapping table you protect.

### Real-life application: verifying the September payload

You hashed the malware to identify it. That is hashing used correctly — a file
fingerprint for comparison against known samples:

```bash
# Purpose: compute a file fingerprint for identification and sharing. Same bytes
# anywhere in the world produce the same hash, which is why hashes are the
# lingua franca of malware identification.
sha256sum sync_444b.cmd
# 4bd99a963d0a6b91db0b24da0e5556907d09cc74981107b7e3e3efbc91cce883

# On Windows:
certutil -hashfile sync_444b.cmd SHA256
```

And the limit of it, from `01-SECURITY_FOUNDATIONS.md` Chapter 6: a hash sits at the
**bottom of the Pyramid of Pain**. One recompiled byte and the hash is different, while
the behaviour is identical. Hashes identify; they do not detect.

### Advanced: Merkle trees

Hash a tree of hashes and you can prove one leaf belongs to a set without revealing or
transferring the set — in `log n` hashes rather than `n`.

```
            root = H(H₁₂ || H₃₄)
           /                    \
    H₁₂ = H(H₁||H₂)        H₃₄ = H(H₃||H₄)
      /        \              /        \
    H(d₁)    H(d₂)         H(d₃)     H(d₄)
```

Where you will meet them: Git (every commit is a Merkle DAG — this is why history is
tamper-evident), Certificate Transparency logs (Chapter 9), blockchains, and
`rsync`/backup deduplication.

The practical use for you: an **append-only audit log**. Chain each entry's hash into the
next, and any retroactive edit breaks every subsequent hash. That turns "the insider
edited the log" from undetectable into obvious — which is the control
`01-SECURITY_FOUNDATIONS.md` Chapter 3 said you lacked against an insider.

```python
# Purpose: a tamper-evident audit log. Each entry's hash covers the previous hash,
# so editing entry 5 invalidates 6..N. An insider with database write access can
# still alter it, but cannot do so UNDETECTABLY, which is the property you need.
import hashlib, json

def append(entries: list[dict], event: dict) -> dict:
    prev = entries[-1]["hash"] if entries else "0" * 64
    body = json.dumps({"prev": prev, "event": event}, sort_keys=True)
    entry = {"event": event, "prev": prev,
             "hash": hashlib.sha256(body.encode()).hexdigest()}
    entries.append(entry)
    return entry

def verify(entries: list[dict]) -> int | None:
    """Return the index of the first tampered entry, or None if the chain is intact."""
    prev = "0" * 64
    for i, e in enumerate(entries):
        body = json.dumps({"prev": prev, "event": e["event"]}, sort_keys=True)
        if e["prev"] != prev or e["hash"] != hashlib.sha256(body.encode()).hexdigest():
            return i
        prev = e["hash"]
    return None
```

To make it *unforgeable* rather than merely tamper-evident, publish the latest root hash
somewhere the insider cannot reach — a second system, a daily email, a printout. Then they
cannot rebuild a consistent chain. This is the whole idea behind Certificate Transparency,
at a smaller scale.

### Practice

1. Hash the same string with MD5, SHA-1, SHA-256 and BLAKE2b. Time a million iterations
   of each. Note which is fastest — and why that is a *problem* for passwords.
2. Compute how long it takes a GPU at 10 GH/s to enumerate every Rwandan phone number
   as SHA-256. Write the number down.
3. Implement the audit chain above, tamper with entry 3, and show `verify` finds it.
4. Find out which hash Git uses for object IDs and what it is migrating to, and why.

---

## Chapter 3: Password hashing

The one you must get exactly right, because when it is wrong the damage is retroactive
and unlimited — every password ever stored is crackable, including the ones users reused
on their bank.

### Why fast hashes fail

A modern GPU computes SHA-256 at roughly **10 billion hashes per second**. Against that
rate:

```
8-char lowercase+digits (36^8 ≈ 2.8×10^12)        →  about 5 minutes
8-char mixed case+digits+symbols (94^8 ≈ 6×10^15) →  about 7 days
Any password on a 10-million-entry wordlist       →  1 millisecond
Any password in a 1-billion-entry breach corpus   →  0.1 seconds
```

The last two rows matter most. Real attackers do not brute-force; they try known
passwords first, and most user passwords are in a corpus already.

The fix is to make each guess **expensive**. A password hash that takes 100 ms means
10 guesses per second per core instead of 10 billion — a slowdown of 10⁹, which turns
"7 days" into longer than the universe has existed.

### The three ingredients

**Salt** — a unique random value per password, stored alongside the hash.

Without a salt, identical passwords produce identical hashes, so an attacker cracks the
whole database at once and precomputed rainbow tables work. With a per-user salt, every
password must be attacked individually. Salts are **not secret** — they just have to be
unique. Modern libraries generate them for you; never write your own.

**Cost parameters** — tune them so verification takes as long as you can afford.

**Pepper** (optional) — a secret value, the same for all users, stored *outside* the
database (environment, HSM). If the database alone leaks, the hashes are uncrackable
without it. It adds nothing if the attacker gets both, which is why it is defence in depth
rather than a primary control.

### Which algorithm, with real parameters

Verified October 2026 against the OWASP Password Storage Cheat Sheet:

| Algorithm | Minimum parameters | Notes |
|---|---|---|
| **Argon2id** ✅ | **19 MiB memory, t=2, p=1** | first choice. Memory-hard, so GPUs and ASICs lose their advantage |
| **scrypt** | **N=2^17, r=8, p=1** | good second choice; also memory-hard |
| **bcrypt** | **cost ≥ 10** | acceptable for legacy. **72-byte input limit** — see below |
| **PBKDF2-HMAC-SHA256** | **≥ 600,000 iterations** | only when FIPS-140 compliance forces it. Not memory-hard, so GPUs are very effective |

OWASP notes these Argon2id settings as roughly equivalent, trading memory for time —
useful when a container has a hard memory cap:

```
46 MiB, t=1, p=1
19 MiB, t=2, p=1     ← the baseline
12 MiB, t=3, p=1
 9 MiB, t=4, p=1
```

Why **Argon2id** specifically, of the three Argon2 variants: `Argon2d` resists GPU
cracking but leaks through memory-access timing; `Argon2i` resists side channels but is
weaker against GPUs; `Argon2id` does the first pass as `i` and the rest as `d`, getting
both. When a library offers the choice, `id` is the answer.

### Configuring it in Django

```python
# Purpose: put Argon2id first in the hasher list. Django uses hashers[0] for new
# passwords and will verify against any hasher in the list, so a user hashed with
# PBKDF2 can still log in - and gets upgraded on their next login automatically.
# settings.py
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
```

```bash
# Purpose: Django's Argon2 support requires an extra package. Without it, the
# hasher silently is not available and you keep using PBKDF2.
pip install "django[argon2]"
```

Django's own Argon2 defaults (`time_cost=2`, `memory_cost=102400` KiB = **100 MiB**,
`parallelism=8`) are well above the OWASP floor. That is good, but verify the box can
take it: 100 MiB × 8 concurrent logins = 800 MiB of RAM, on a VPS that may have 2 GB.
This is a real availability trade-off — the exact kind from
`01-SECURITY_FOUNDATIONS.md` Chapter 2 — and the correct response is to measure, not to
guess:

```python
# Purpose: measure actual verification cost on the real production hardware. Target
# 100-500ms. Faster wastes available security; much slower is a DoS vector, because
# an attacker can exhaust your CPU by submitting login attempts.
import time
from django.contrib.auth.hashers import make_password, check_password

h = make_password("correct horse battery staple")
start = time.perf_counter()
check_password("correct horse battery staple", h)
print(f"verification: {(time.perf_counter() - start) * 1000:.0f} ms")
```

That DoS note is not hypothetical and it is routinely missed: an expensive password hash
is a resource amplifier pointed at yourself. Ten requests per second against your login
endpoint, each costing 300 ms of CPU and 100 MiB, is an outage. **Rate-limit the login
endpoint before raising the cost parameters.**

### Reading the stored format

Modern hashes are self-describing — the PHC string format packs everything needed to
verify into one field:

```
argon2$argon2id$v=19$m=102400,t=2,p=8$c2FsdHNhbHQ$aGFzaGhhc2hoYXNo
  │       │       │         │              │            │
  │       │       │         │              │            └─ the hash
  │       │       │         │              └─ the salt (base64, not secret)
  │       │       │         └─ cost parameters
  │       │       └─ algorithm version
  │       └─ variant: argon2id
  └─ Django's hasher label
```

This is why you can raise cost parameters without breaking existing users: the old
parameters are stored *in the hash*, so old hashes still verify, and
`check_password` rehashes with the new settings on successful login.

### Advanced: bcrypt's 72-byte trap

bcrypt silently truncates input at **72 bytes**. Longer passphrases have their tail
ignored, so `"a"*72 + "anything"` verifies against `"a"*72`. Historically it also
truncated at the first null byte.

The standard fix is to pre-hash — and the naive version introduces a *different* bug:

```python
# Purpose: WRONG. SHA-256 digest bytes can contain 0x00, and some bcrypt
# implementations truncate at a null byte - collapsing the effective password to
# only the bytes before it.
bcrypt.hashpw(hashlib.sha256(password.encode()).digest(), bcrypt.gensalt())

# Purpose: RIGHT. Base64-encode the digest first, which is null-free and exactly
# 44 bytes - under the limit. This is what Django's BCryptSHA256PasswordHasher does.
import base64, hashlib, bcrypt
digest = base64.b64encode(hashlib.sha256(password.encode()).digest())
bcrypt.hashpw(digest, bcrypt.gensalt(rounds=12))
```

This is a good miniature of the whole chapter: the primitive is fine, the *composition*
is where the bug lives, and the correct composition is non-obvious. Use the library's
named hasher rather than assembling it yourself.

### Advanced: migrating a password database

You cannot re-hash passwords you do not have in plaintext. Two correct strategies:

**Upgrade on login** (what Django does automatically). Keep the old hasher in the list,
rehash with the new one when a user successfully authenticates. Simple, but users who
never log in stay on the weak hasher forever — so pair it with a deadline after which
dormant accounts are forced through a reset.

**Wrap the old hash.** Store `Argon2id(old_hash)`. Every password is immediately protected
at the new strength, with no user interaction. Verification computes the old hash first,
then the new one. The cost is permanent extra complexity, so it is worth it only when the
old hasher was genuinely dangerous — unsalted MD5, say.

### What never to do

```python
# Purpose: a catalogue of real password-storage failures. Every one of these has
# appeared in a production breach.

hashlib.sha256(password.encode()).hexdigest()      # fast hash: cracked in hours
hashlib.md5(password.encode()).hexdigest()         # worse, and collisions too
hashlib.sha256((password + SALT).encode())         # fast, and one global salt
base64.b64encode(password.encode())                # encoding, not hashing (Ch 11)
password                                           # it happens, constantly
encrypt(password, key)                             # reversible - you can read it,
                                                   # so an attacker with the key can too
```

That last one deserves a sentence, because it looks defensible. Passwords must be
**unrecoverable**, not merely protected. If your system can recover a user's password,
so can anyone who takes the key — and you have also lost the ability to say honestly
that you never see it. Hashing is one-way *on purpose*.

### Real-life application: checking your own login path

```python
# Purpose: audit how passwords are actually stored in your database right now.
# The prefix of each hash names the algorithm, so one query tells you whether
# the migration you think happened actually happened.
from django.contrib.auth import get_user_model
from collections import Counter

c = Counter(u.password.split("$")[0] for u in get_user_model().objects.all())
print(c)
# Counter({'argon2': 41, 'pbkdf2_sha256': 7})
#   → 7 users have never logged in since the change. They are still on PBKDF2.
```

### Practice

1. Run the timing measurement on your actual VPS, not your laptop. Tune parameters to
   land between 100 and 500 ms.
2. Compute the memory cost of 20 concurrent logins at your current settings. Compare
   against the VPS's RAM. Decide whether you have a self-inflicted DoS.
3. Run the hasher audit above on both projects. How many users are on the old hasher?
4. Add rate limiting to the login endpoint. Verify it triggers before CPU saturates.
5. Demonstrate bcrypt's 72-byte truncation in a scratch script, then show
   `BCryptSHA256PasswordHasher` not having the problem.

---

## Chapter 4: MACs and HMAC

### The job

A MAC answers: *"did this come from someone holding the key, and is it unmodified?"* —
integrity **and** authenticity in one tag, with a shared secret.

```
Hash:      H(message)              → anyone can compute it   → proves nothing about origin
MAC:       MAC(key, message)       → only key-holders can    → proves both
Signature: Sign(private, message)  → only the private holder → proves both + non-repudiation
```

### Why HMAC and not the obvious thing

The obvious construction `H(key || message)` is broken by length extension (Chapter 2).
The reverse, `H(message || key)`, is weak against hash collisions. HMAC nests two hash
calls with two derived keys and is proven secure given a reasonable hash:

```
HMAC(K, m) = H( (K ⊕ opad) || H( (K ⊕ ipad) || m ) )
```

You never implement that. You call it:

```python
# Purpose: compute and verify a MAC correctly. hmac.compare_digest is mandatory -
# see the timing discussion below.
import hmac, hashlib

def sign(key: bytes, message: bytes) -> str:
    return hmac.new(key, message, hashlib.sha256).hexdigest()

def verify(key: bytes, message: bytes, tag: str) -> bool:
    expected = sign(key, message)
    return hmac.compare_digest(expected, tag)      # NOT ==
```

### Constant-time comparison, and why `==` is a vulnerability

`==` on bytes short-circuits at the first differing byte. So the time it takes reveals how
many leading bytes were correct, and an attacker forges a tag one byte at a time —
256 × 32 = 8,192 requests instead of 2²⁵⁶.

```python
# Purpose: WRONG. Leaks the number of correct leading bytes through timing.
if tag == expected:            # returns early on first mismatch
    ...

# Purpose: RIGHT. Always examines every byte, so the duration is independent of
# how much of the tag was correct.
if hmac.compare_digest(tag, expected):
    ...
```

Does this work over a network, with jitter? Yes — attackers average over many requests to
recover a signal far below the noise floor, and remote timing attacks on exactly this have
been demonstrated repeatedly. Treat it as real.

The general rule: **any comparison of a secret or a secret-derived value uses a
constant-time function.** That includes MAC tags, password reset tokens, API keys, session
IDs, and CSRF tokens.

```bash
# Purpose: find every place you compare a secret with ==, which is the most common
# instance of this bug in real codebases.
grep -rn "token ==\|== token\|signature ==\|secret ==\|api_key ==\|hmac ==" \
     --include="*.py" . | head -20
```

### Real-life application: webhook verification

The place every developer gets this wrong at least once. Three independent mistakes are
possible, and most implementations make at least two.

```python
# Purpose: WRONG, three ways. (1) compares with ==, (2) signs the re-serialised
# body rather than the raw bytes, (3) has no replay protection.
def webhook(request):
    sig = request.headers["X-Signature"]
    body = json.dumps(request.data)                       # ← re-serialised!
    expected = hmac.new(KEY, body.encode(), hashlib.sha256).hexdigest()
    if sig != expected:                                   # ← timing leak
        return HttpResponse(status=400)
    process(request.data)                                 # ← replayable forever

# Purpose: RIGHT. Verify the RAW body bytes with a constant-time comparison, and
# reject anything outside a short time window to stop replay.
import time

MAX_SKEW = 300          # 5 minutes

def webhook(request):
    sig = request.headers.get("X-Signature", "")
    ts  = request.headers.get("X-Timestamp", "")

    # 1. Freshness first - cheap, and stops replay of a genuinely signed message.
    try:
        if abs(time.time() - int(ts)) > MAX_SKEW:
            return HttpResponse(status=400)
    except ValueError:
        return HttpResponse(status=400)

    # 2. Sign exactly the bytes that arrived. request.body, never request.data.
    signed_payload = ts.encode() + b"." + request.body
    expected = hmac.new(KEY, signed_payload, hashlib.sha256).hexdigest()

    # 3. Constant-time comparison.
    if not hmac.compare_digest(sig, expected):
        return HttpResponse(status=400)

    # 4. Idempotency - the timestamp window still allows replay WITHIN it.
    if not claim_event_id(request.headers.get("X-Event-Id")):
        return HttpResponse(status=200)        # already processed; not an error

    process(json.loads(request.body))
    return HttpResponse(status=200)
```

The raw-body point is subtle and bites hard. `json.dumps(request.data)` may reorder keys,
change whitespace, or normalise unicode — producing different bytes from what the sender
signed, so valid webhooks fail intermittently. Developers then "fix" it by disabling
verification. **Always sign and verify the bytes on the wire.**

Step 4 is the one even careful implementations skip. The timestamp window stops replay
*after* five minutes; within the window the same signed message can be submitted a hundred
times. For a payment webhook that is a hundred credits. Idempotency by event ID is the
actual fix, and the timestamp is only a cheap pre-filter.

### Advanced: other MACs

| MAC | When |
|---|---|
| **HMAC-SHA-256** | the default; available everywhere; conservative |
| **Poly1305** | paired with ChaCha20 in an AEAD; very fast; one-time key per message |
| **KMAC** | the SHA-3 family's native MAC; no nesting needed |
| **CMAC / GMAC** | block-cipher based; GMAC is AES-GCM's authenticator |

Poly1305 carries a sharp constraint worth knowing: it is a **one-time** MAC. Its key must
never be reused across messages, or the authentication key can be recovered. In practice
ChaCha20-Poly1305 derives a fresh Poly1305 key per nonce, so the construction handles it —
but it is the same nonce-reuse danger as Chapter 5, in a different place.

### Practice

1. Build a tiny server that verifies a MAC with `==` and measure the timing difference
   between a tag with 0 correct bytes and one with 16. Average over 10,000 requests.
2. Fix it with `compare_digest` and show the difference disappearing.
3. Audit every webhook handler in both projects against the four-step version. Report
   which of the four steps each is missing.
4. Add idempotency to one webhook and prove a replayed event is processed once.

---

## Chapter 5: Symmetric encryption

### The shape of it

One key, used for both encryption and decryption. Fast — gigabytes per second with
hardware acceleration — which is why it does all the bulk work in every real system.

```
Encrypt(key, nonce, plaintext)  → ciphertext + tag
Decrypt(key, nonce, ciphertext, tag) → plaintext, or FAILURE
```

That "or FAILURE" is the whole point of the next section.

### AEAD, and why nothing else

**Authenticated Encryption with Associated Data.** It provides confidentiality *and*
integrity in one primitive, and refuses to return plaintext if the ciphertext was
modified.

Encryption without authentication is not a weaker option; it is a **different and
dangerous** one. An attacker who cannot read your ciphertext can still *modify* it, and
unauthenticated modes will happily decrypt the result into plaintext you then act on.

```
AES-CBC alone:   attacker flips bits in the ciphertext → predictable bit flips in the
                 plaintext → "balance: 100" becomes "balance: 900", and you process it
AES-CBC + HMAC:  safe if composed correctly (encrypt-then-MAC), easy to get wrong
AES-GCM:         one primitive, safe composition built in     ← do this
```

The classic catastrophe here is the **padding oracle**: decrypt CBC, check the padding,
and return a different error for bad padding than for bad content. That single
distinguishable error lets an attacker decrypt arbitrary ciphertext, byte by byte, without
the key. It has broken real systems repeatedly, and AEAD eliminates the whole class
because there is exactly one error: *authentication failed*.

```python
# Purpose: correct symmetric encryption with AES-256-GCM. The nonce is random and
# unique per message, the tag is produced and verified automatically, and the
# associated data is authenticated but NOT encrypted.
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

key = AESGCM.generate_key(bit_length=256)      # store this properly - Chapter 8
aead = AESGCM(key)

nonce = os.urandom(12)                         # 96 bits, UNIQUE per message
aad = b"student_id=1247;field=medical_notes"   # authenticated, visible

ct = aead.encrypt(nonce, b"peanut allergy, epipen in office", aad)

# Store nonce + ciphertext together. The nonce is not secret.
pt = aead.decrypt(nonce, ct, aad)              # raises InvalidTag if ANYTHING changed
```

### Associated data — the feature people ignore

The `aad` parameter authenticates context without encrypting it. It is how you stop
**ciphertext relocation**: an attacker who cannot read the ciphertext can still copy the
encrypted `medical_notes` of student 1247 into student 1300's row, and without AAD it
decrypts perfectly.

Bind the ciphertext to its location and the attack fails with `InvalidTag`:

```python
# Purpose: bind each ciphertext to its row and column so it cannot be moved
# elsewhere in the database and still decrypt.
aad = f"students:{student.id}:medical_notes".encode()
```

This is the cheapest, most-skipped improvement in applied encryption. If you encrypt a
database field, use AAD.

### Nonce reuse — the catastrophe

The single most common way to destroy AES-GCM. Reusing a (key, nonce) pair does not leak
"a little". It leaks:

1. **The XOR of the two plaintexts** — often enough to recover both
2. **The authentication subkey** — after which the attacker can **forge valid tags** for
   any message of their choosing

The second is worse than the first and surprises people. Nonce reuse breaks *integrity*,
not just confidentiality.

```python
# Purpose: WRONG. A fixed nonce. Catastrophic - after two messages, forgery.
NONCE = b"000000000000"
aead.encrypt(NONCE, data, None)

# Purpose: WRONG. A counter that resets when the process restarts, or that is
# duplicated across replicas. Both happen in production.
counter += 1
aead.encrypt(counter.to_bytes(12, "big"), data, None)

# Purpose: RIGHT for AES-GCM. Random 96-bit nonce per message, stored with the
# ciphertext. See the message-count limit below.
nonce = os.urandom(12)

# Purpose: RIGHT and harder to misuse. XChaCha20-Poly1305 takes a 192-bit nonce,
# which is large enough that random generation has no practical collision risk,
# at any message volume you will ever reach.
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305
```

### Advanced: the 2³² limit on random GCM nonces

A 96-bit nonce is only 96 bits, so random nonces collide by the birthday bound. The
accepted guidance is **at most ~2³² messages under one key** (about 4 billion) before
rotating. That is unreachable for a Django app encrypting database fields, and very
reachable for a high-volume message bus.

Two ways out when you might approach it:

- **XChaCha20-Poly1305** — 192-bit nonce, random nonces are safe indefinitely
- **AES-GCM-SIV** — nonce-misuse resistant: a repeated nonce leaks only whether two
  plaintexts were equal, and does *not* enable forgery. The right choice when you cannot
  guarantee nonce uniqueness, such as across stateless replicas

Knowing that AES-GCM-SIV exists is what separates someone who read a tutorial from
someone who can design a system with distributed encryption.

### Mode reference

| Mode | Authenticated | Use |
|---|---|---|
| **ECB** | no | **never.** Identical plaintext blocks → identical ciphertext blocks, so structure is visible in the ciphertext |
| **CBC** | no | legacy only; needs separate HMAC, encrypt-then-MAC, padding-oracle risk |
| **CTR** | no | legacy only; turns a block cipher into a stream cipher |
| **GCM** | **yes** | the default. Hardware-accelerated on any modern CPU |
| **ChaCha20-Poly1305** | **yes** | when there is no AES hardware (mobile, embedded); constant-time in software |
| **XChaCha20-Poly1305** | **yes** | as above, with a nonce big enough to be random-safe |
| **AES-GCM-SIV** | **yes** | when nonce uniqueness cannot be guaranteed |

ECB deserves its "never". The reason is structural: it is deterministic and
position-independent, so an encrypted bitmap of a picture is still recognisably that
picture, and an encrypted database column still reveals which rows share a value. That
last property is exactly what makes "encrypted" columns searchable — and is why the
searchable-encryption section in Chapter 13 has to work much harder.

### The library choice

```python
# Purpose: the easy, hard-to-misuse option. Fernet handles key format, nonce
# generation, authentication and a timestamp for you. Use it unless you have a
# specific reason not to.
from cryptography.fernet import Fernet

key = Fernet.generate_key()          # urlsafe base64, 32 bytes of entropy
f = Fernet(key)
token = f.encrypt(b"sensitive")
data = f.decrypt(token, ttl=3600)    # ttl enforces the embedded timestamp
```

Fernet's internals, so you know its limits: AES-128-CBC with HMAC-SHA-256
(encrypt-then-MAC), a random IV, and a timestamp. Three consequences:

- **No AAD support.** If you need ciphertext bound to its location, use `AESGCM` directly.
- **AES-128, not 256.** Fine — 128-bit symmetric security is not the weak link in any
  system you will build.
- **The timestamp is visible** in the token, unencrypted. Usually irrelevant; occasionally
  a metadata leak.

### Practice

1. Encrypt the same 64-byte repeating plaintext with ECB and with GCM. Print both
   ciphertexts as hex. Explain what you can see in one and not the other.
2. Encrypt two different messages with AES-GCM under the same key and nonce. XOR the
   ciphertexts and XOR with one plaintext. Recover the other.
3. Encrypt a field with AAD bound to the row, then try to decrypt it as a different row.
   Show `InvalidTag`.
4. Modify one byte of a GCM ciphertext and show decryption failing. Do the same with CBC
   and show it succeeding with corrupted plaintext.
5. Work out how many messages per second your system would need to send to approach the
   2³² limit in a year.

---

## Chapter 6: Asymmetric cryptography

### The idea

Two mathematically related keys. What one does, only the other undoes.

| | Encryption | Signatures |
|---|---|---|
| **Public key** | encrypts | **verifies** |
| **Private key** | decrypts | **signs** |

Note the inversion — it is the most common confusion in the subject. For confidentiality,
the *public* key encrypts. For authenticity, the *private* key signs.

### Which algorithm

| Algorithm | Key size | Status | Use |
|---|---|---|---|
| **RSA-2048** | 2048-bit | acceptable, ~112-bit security | legacy interop; slow |
| **RSA-3072/4096** | 3072+ | fine but slow | when RSA is mandated |
| **ECDSA P-256** | 256-bit | fine, widely required | TLS certificates, FIPS environments |
| **Ed25519** | 256-bit | **preferred** | SSH keys, signing, anything you control both ends of |
| **X25519** | 256-bit | **preferred** | key agreement (ECDH) |
| **ML-DSA, SLH-DSA** | — | post-quantum signatures | Chapter 10 |

256-bit elliptic curve keys give roughly the same security as 3072-bit RSA, with far
smaller keys and faster operations. Unless something forces RSA, choose a curve.

Your SSH keys are already Ed25519 — which is correct, and is part of why September was
survivable. See `../02-infrastructure/01-INFRASTRUCTURE_HARDENING.md`.

### Signatures

```python
# Purpose: sign and verify with Ed25519. Fast, small signatures (64 bytes), no
# parameter choices to get wrong, and deterministic - see the ECDSA warning below.
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey, Ed25519PublicKey)

private = Ed25519PrivateKey.generate()
public = private.public_key()

message = b"grade:A;student:1247;teacher:mutabazi;ts:1760000000"
signature = private.sign(message)           # 64 bytes

from cryptography.exceptions import InvalidSignature
try:
    public.verify(signature, message)
    print("authentic")
except InvalidSignature:
    print("forged or modified")
```

### Advanced: the ECDSA nonce disaster

ECDSA requires a random per-signature nonce `k`. If `k` is ever **reused** across two
signatures, the private key can be recovered algebraically from the two signatures. Not
weakened — recovered, in closed form.

This is not theoretical. It is how Sony's PlayStation 3 signing key was extracted (a
fixed `k`), and how Bitcoin wallets with faulty RNGs have been drained.

**Ed25519 removes the whole class** by deriving `k` deterministically from the private key
and the message. There is no RNG to fail. That is the main reason to prefer it when you
control both ends, and a good illustration of the theme of this file: the better primitive
is the one that is *harder to misuse*, not the one with the bigger number.

### RSA, if you must

```python
# Purpose: correct RSA usage. OAEP padding for encryption, PSS for signatures.
# Textbook RSA - no padding - is deterministic and malleable, therefore broken.
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

key = rsa.generate_private_key(public_exponent=65537, key_size=3072)

ct = key.public_key().encrypt(
    b"short secret",
    padding.OAEP(mgf=padding.MGF1(hashes.SHA256()),
                 algorithm=hashes.SHA256(), label=None))

sig = key.sign(
    b"message",
    padding.PSS(mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH),
    hashes.SHA256())
```

Note `padding.PKCS1v15` exists for both operations and is legacy. For encryption it is
vulnerable to Bleichenbacher-style attacks; use OAEP. For signatures it is still
acceptable but PSS is better. If a library lets you pass no padding at all, that is
textbook RSA and it is insecure.

### Hybrid encryption — what actually happens in practice

RSA can only encrypt data smaller than its key, and asymmetric operations are slow. So
**nobody encrypts data with a public key.** Every real system does KEM/DEM:

```
1. Generate a random symmetric key (the DEK)
2. Encrypt the data with the DEK using AEAD        ← fast, any size
3. Encrypt the DEK with the recipient's public key ← slow, but tiny
4. Send both
```

This is what TLS does, what PGP does, what `age` does, and what cloud KMS envelope
encryption does (Chapter 8). When you see "RSA-encrypted file", it means this.

### Key agreement and forward secrecy

Diffie–Hellman lets two parties derive a shared secret over a channel an attacker is
watching, without ever transmitting it.

```python
# Purpose: X25519 key agreement. Both sides compute the same shared secret from
# their own private key and the other's public key. The secret itself never
# crosses the network.
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

alice_priv, bob_priv = X25519PrivateKey.generate(), X25519PrivateKey.generate()

shared_a = alice_priv.exchange(bob_priv.public_key())
shared_b = bob_priv.exchange(alice_priv.public_key())
assert shared_a == shared_b

# Purpose: NEVER use a raw DH output as a key. It is not uniformly distributed.
# Run it through a KDF, with a label binding it to its purpose.
key = HKDF(algorithm=hashes.SHA256(), length=32, salt=None,
           info=b"imboni-session-v1").derive(shared_a)
```

**Forward secrecy** is the property that matters here. Use an *ephemeral* DH key per
session and discard it, and an attacker who later steals your long-term private key
*still cannot decrypt recorded past traffic* — the session keys no longer exist anywhere.

Without forward secrecy, one key compromise retroactively decrypts every conversation
ever recorded. This is why TLS 1.3 **removed** non-forward-secret key exchange entirely,
and why the harvest-now-decrypt-later threat in Chapter 10 is about key agreement rather
than certificates.

### Practice

1. Generate an Ed25519 keypair, sign a message, flip one bit of the message, show
   verification failing.
2. Implement hybrid encryption by hand: random AES key, encrypt a file with AES-GCM,
   encrypt the key with RSA-OAEP. Then decrypt.
3. Look up how the PS3 ECDSA key was recovered and write the explanation in three
   sentences.
4. Check what key types your own SSH keys use: `ssh-keygen -l -f ~/.ssh/id_ed25519.pub`.
5. Explain forward secrecy to someone non-technical in two sentences.

---

## Chapter 7: Randomness

Cryptography's silent dependency. Every key, nonce, salt, token and IV comes from a random
source, and when that source is weak everything above it collapses silently — the system
keeps working perfectly while being completely insecure.

### Two kinds of random

```python
# Purpose: WRONG for anything security-related. The Mersenne Twister is fast and
# statistically excellent, and completely predictable: 624 consecutive outputs
# are enough to reconstruct the state and predict all future values.
import random
token = "".join(random.choices("abcdef0123456789", k=32))

# Purpose: RIGHT. A cryptographically secure source, seeded by the OS from
# hardware entropy, with no recoverable internal state.
import secrets
token = secrets.token_urlsafe(32)          # ~43 chars, 256 bits of entropy
hex_token = secrets.token_hex(16)          # 128 bits
n = secrets.randbelow(100)                 # unbiased, unlike random.randint
choice = secrets.choice(options)
```

The rule is simple and absolute: **`random` for simulations and games, `secrets` for
anything an attacker benefits from guessing.** In NumPy work, `np.random` is in the first
category too.

### What to use, by language

| Language | Correct source |
|---|---|
| Python | `secrets`, `os.urandom` |
| JavaScript (browser) | `crypto.getRandomValues()` — **never** `Math.random()` |
| Node | `crypto.randomBytes()` |
| Linux / macOS | `getrandom(2)`, `/dev/urandom` |
| Windows | `BCryptGenRandom` |
| Postgres | `gen_random_bytes()` from `pgcrypto` |

On Linux, use `/dev/urandom` (or `getrandom`) rather than `/dev/random`. The old advice to
prefer `/dev/random` is obsolete: modern kernels make them equivalent once the pool is
initialised, and `/dev/random` historically blocked, which caused outages and pushed
developers toward worse sources.

### How much entropy

| Use | Minimum | Why |
|---|---|---|
| Session ID | 128 bits | guessable at 64 |
| Password reset token | **256 bits** | single-use, high value, often emailed |
| Invitation token | 256 bits | your `secrets.token_urlsafe(32)` is correct |
| API key | 256 bits | long-lived |
| Salt | 128 bits | uniqueness, not secrecy |
| Nonce (GCM) | 96 bits | fixed by the construction |

A note on UUIDs, which get used as tokens constantly: `uuid4()` contains 122 bits of
randomness, which is adequate for an identifier but is at the low end for a secret — and
`uuid1()` is built from the MAC address and timestamp, so it is **not random at all** and
is sometimes predictable to the second. Never use `uuid1` as a secret.

### Advanced: the failure modes

Randomness fails in ways that leave no trace, which is what makes it dangerous:

**Insufficient seeding at boot.** A VM or container generating keys seconds after first
boot may draw from a barely-initialised pool. Cloned VM images are worse — every clone
starts with the *same* entropy state. This produced large-scale duplicate-key incidents in
embedded devices and hosting fleets.

**The Debian OpenSSL disaster (2008).** A patch removed entropy sources, leaving the PRNG
seeded only by the process ID — 32,767 possible values. Every SSH and TLS key generated on
affected Debian systems for ~20 months was one of a tiny enumerable set. Nothing looked
wrong. The keys were the right length and the right format.

**Dual_EC_DRBG.** A standardised PRNG, widely believed to contain a deliberate backdoor
usable by whoever chose its constants. Withdrawn. The lesson: prefer primitives with
*explained* constants ("nothing-up-my-sleeve" numbers) — one of the reasons Curve25519 is
trusted.

**Userspace pools after `fork()`.** A PRNG state duplicated across forked workers produces
identical outputs in each. Prefer the OS source, which handles this.

```bash
# Purpose: confirm the kernel's entropy pool is initialised before generating keys
# on a fresh VM. Should be well above 256.
cat /proc/sys/kernel/random/entropy_avail

# Purpose: look for the real risk on a cloned image - two hosts with identical
# SSH host keys means the image was cloned after key generation.
sha256sum /etc/ssh/ssh_host_ed25519_key.pub
```

### Practice

1. Generate 1,000 tokens with `random.choices` and show that observing some predicts
   others, using a Mersenne Twister state-recovery library.
2. Audit both codebases for `random`, `Math.random`, `uuid1` and `time`-seeded values used
   in any security context.
3. Check `entropy_avail` on your VPS and on a freshly created VM.
4. Verify your VPS's SSH host key was generated on the VPS, not baked into the image.

---

## Chapter 8: Key management

The genuinely hard part. The algorithms are solved; key management is where real systems
fail, and it is where **your** system failed in September.

### The uncomfortable truth

> Encryption moves the problem. Instead of protecting the data, you now protect the key —
> which is smaller, which is the point, but it does not disappear.

If the key sits next to the ciphertext, you have accomplished nothing beyond making the
data unreadable to someone who takes exactly one of the two. That is a real threat (a
stolen backup) but not the common one.

Four questions you must be able to answer for every key you hold:

1. **Where does it live?** (and is that different from where the data lives?)
2. **Who or what can read it?**
3. **How is it rotated, and has that ever been tested?**
4. **What happens if it is lost?** (data unrecoverable) **or leaked?** (data readable)

Question 4 names the fundamental tension: protect the key too well and you destroy your
own data; protect it too loosely and you have not protected anything. Both failures are
permanent.

### The hierarchy — envelope encryption

Do not encrypt everything with one key. Build two levels:

```
   KEK  (Key Encryption Key)      ← in a KMS/HSM, never leaves it, rotated often
    │
    ├── encrypts DEK₁             ← per-tenant, per-table, or per-record
    ├── encrypts DEK₂
    └── encrypts DEK₃

   DEK  (Data Encryption Key)     ← encrypts the actual data, stored WITH the
                                     data in encrypted form
```

Three properties this buys you, none of which you get from a single key:

- **Rotate the KEK cheaply** — re-encrypt the small DEKs, not terabytes of data
- **Limit blast radius** — one leaked DEK exposes one tenant, not all of them
  (the least-common-mechanism principle, `01-SECURITY_FOUNDATIONS.md` Ch 10)
- **Crypto-shredding** — delete a tenant's DEK and their data is unrecoverable
  everywhere at once, including in backups you cannot selectively edit. This is the only
  practical way to honour a deletion request that has already propagated into backups,
  and it is a genuine compliance capability

```python
# Purpose: envelope encryption. The DEK is random per record, used once, and stored
# encrypted under the KEK. Only the KEK needs protecting.
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def encrypt_record(kek: bytes, plaintext: bytes, aad: bytes) -> dict:
    dek = AESGCM.generate_key(bit_length=256)
    dn, kn = os.urandom(12), os.urandom(12)
    return {
        "ciphertext":    AESGCM(dek).encrypt(dn, plaintext, aad),
        "data_nonce":    dn,
        "wrapped_dek":   AESGCM(kek).encrypt(kn, dek, aad),   # DEK bound to the same AAD
        "dek_nonce":     kn,
        "kek_version":   2,                                   # for rotation
    }

def decrypt_record(kek: bytes, rec: dict, aad: bytes) -> bytes:
    dek = AESGCM(kek).decrypt(rec["dek_nonce"], rec["wrapped_dek"], aad)
    return AESGCM(dek).decrypt(rec["data_nonce"], rec["ciphertext"], aad)
```

`kek_version` is what makes rotation possible later. Add it on day one; retrofitting a
version field onto a million encrypted rows is painful.

### Key separation and derivation

**One key, one purpose.** Using the same key for encryption and for MACs, or across two
features, creates cross-protocol attacks. Derive instead:

```python
# Purpose: derive many purpose-specific keys from one master key. The `info` label
# makes each output independent - compromising one does not affect the others.
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

def subkey(master: bytes, purpose: str) -> bytes:
    return HKDF(algorithm=hashes.SHA256(), length=32, salt=None,
                info=purpose.encode()).derive(master)

session_key  = subkey(MASTER, "imboni/session/v1")
webhook_key  = subkey(MASTER, "imboni/webhook/v1")
field_key    = subkey(MASTER, "imboni/field-encryption/v1")
```

Version the labels. When you need to rotate one purpose, bump `v1` to `v2` and the old
derived key still exists for decrypting old data.

### Where keys should live, ranked

| Storage | Security | Use |
|---|---|---|
| **HSM / cloud KMS** | highest — the key never leaves the hardware | production keys for sensitive data |
| **Secret manager** (Vault, AWS/GCP Secrets Manager, Doppler, Infisical) | high — audited access, rotation, short-lived leases | the right answer for you |
| **Environment variables** | medium — not in git, but readable by any process as that user and visible in `/proc` | acceptable in containers, with care |
| **`.env` file on disk** | **low** | **this is what was stolen in September** |
| **Hardcoded in source** | none | never; and remember a committed secret is forever (`../../engineering-curriculum/02-backend/12-REMOVE_COMMITTED_ENV.md`) |

Be precise about why the `.env` row is low rather than merely inconvenient. A `.env` file
is a plaintext file, readable by your user account, in a predictable location, that
persists across reboots and gets copied into backups and sync folders. It is *exactly*
what commodity infostealers enumerate first — and that is not a guess about September, it
is what happened.

```bash
# Purpose: find every plaintext secret on this machine, the way the malware did.
# Run it and read the output as an attacker's shopping list.
find ~ -name ".env*" -not -path "*/node_modules/*" 2>/dev/null
find ~ -name "*.pem" -o -name "id_rsa" -o -name "id_ed25519" 2>/dev/null
find ~ -name "credentials" -path "*/.aws/*" 2>/dev/null
grep -rln "SECRET\|PASSWORD\|API_KEY\|TOKEN" ~/Documents --include="*.env*" 2>/dev/null
```

Your own scanner already automates this: `guardian exposure` in
`C:\Users\user\Documents\antivirus` was written for exactly this check, and it found five
real CRITICAL findings. Those are still live until the secrets are rotated.

### Rotation

Rotation is the control that limits the *duration* of a compromise, and it is the one that
is never practised until it is needed urgently.

```
Routine:        every 90 days for long-lived secrets; shorter is better
After incident: IMMEDIATELY - and assume used (01-SECURITY_FOUNDATIONS.md Ch 15)
On departure:   anything a leaver could have seen
```

Design for rotation from the start, or it becomes an outage:

1. **Support two keys at once** — verify against old and new during the window
2. **Version every ciphertext and token** (`kek_version` above)
3. **Rotate, then re-encrypt in the background**, then retire the old key
4. **Practise it** on a schedule, not during an incident

```python
# Purpose: decrypt during a rotation window. Keys are tried by the version recorded
# with the ciphertext, so old and new data both work and re-encryption can proceed
# lazily in the background.
KEKS = {2: os.environ["KEK_V2"].encode(), 1: os.environ["KEK_V1"].encode()}

def decrypt_any(rec: dict, aad: bytes) -> bytes:
    kek = KEKS[rec["kek_version"]]
    return decrypt_record(kek, rec, aad)
```

### Real-life application: the September key inventory

The actual remediation list, which is the honest content of this chapter:

| Key | Where it was | Exposed? | Rotated? |
|---|---|---|---|
| Django `SECRET_KEY` | `.env` on the laptop | **yes** | ? |
| Postgres password | `.env` on the laptop | **yes** | ? |
| SMTP credentials | `.env` on the laptop | **yes** | ? |
| Stripe / payment keys | `.env` on the laptop | **yes** | ? |
| `ahl_root_breakglass` SSH key | `~/.ssh` | **file taken; passphrase-protected** | **no — tracked in `../PROGRESS.md`** |
| Other SSH keys | `~/.ssh` | file taken; passphrase-protected | no |
| Browser session cookies | browser stores | **yes** | invalidated by Anthropic T&S |
| API tokens (GitHub, cloud) | keyring / `.env` | likely | ? |

Two observations worth more than the rest of this chapter:

**The passphrase on the SSH keys is the only thing standing between "a scare" and "total
compromise".** The private key files were taken. Without a passphrase, the attacker would
have had root on the server. That single control — chosen months earlier, costing one
extra prompt per login — did the work of every other layer.

**Django's `SECRET_KEY` is worse than it looks.** It signs sessions, password-reset tokens
and CSRF tokens. An attacker with it can forge a session for any user, including a
superuser, *without touching the database*. Rotating it logs everyone out — which is why
it gets deferred — and that inconvenience is exactly why it should already have been done.

### Practice

1. Complete the table above with real answers in the "Rotated?" column. Every `?` is a
   finding.
2. Run the four `find` commands. Count the plaintext secrets on your machine today.
3. Pick the highest-value secret and move it into a secret manager. Measure how long it
   took, so you know the cost of doing the rest.
4. Implement envelope encryption with `kek_version` for one sensitive field.
5. Practise a rotation of a non-critical key end to end. Write the runbook while you do
   it, not afterwards.

---

# PART 2 — PROTOCOLS AND PRACTICE

## Chapter 9: TLS in depth

Everything from Part 1, assembled: key agreement, signatures, AEAD, certificates. Worth
understanding properly because you configure it, and because almost every real TLS
failure is a configuration failure.

### What the handshake does

TLS 1.3, which is what you should be running:

```
Client                                              Server
  │  ClientHello                                        │
  │   + supported ciphers                               │
  │   + key_share (an ephemeral X25519 public key)       │
  │ ──────────────────────────────────────────────────▶ │
  │                                                     │
  │                                      ServerHello    │
  │                              + key_share (ephemeral)│
  │                      {+ Certificate, CertVerify}    │  ← encrypted already
  │                                      {+ Finished}   │
  │ ◀────────────────────────────────────────────────── │
  │  {Finished}                                         │
  │ ──────────────────────────────────────────────────▶ │
  │  {application data}            ← 1 round trip total │
```

Four things are happening at once, and naming them makes the configuration advice obvious:

1. **Key agreement** — ephemeral X25519 (or ML-KEM hybrid, Chapter 10) gives a shared
   secret with forward secrecy
2. **Authentication** — the server signs the handshake, proving it holds the private key
   for the certificate
3. **Certificate validation** — the client checks the chain to a trusted root
4. **Symmetric setup** — derive AEAD keys via HKDF; all application data uses AES-GCM or
   ChaCha20-Poly1305

What TLS 1.3 removed is as important as what it kept: no RSA key transport (no forward
secrecy), no static DH, no CBC modes, no RC4, no compression (CRIME), no renegotiation,
and no unauthenticated ciphers. **The mode-selection mistakes of Chapter 5 were deleted
from the protocol.** This is why "just use TLS 1.3" is genuinely good advice.

### 0-RTT, and why it is a trap

TLS 1.3 offers zero-round-trip resumption: send application data with the first packet.
It is fast, and the early data is **replayable** — an attacker who captures it can send it
again, and the server cannot distinguish.

Safe for an idempotent `GET`. Unsafe for anything that changes state. If you enable it,
restrict it to idempotent requests; most people should leave it off.

### Certificates and the chain

A certificate binds an identity to a public key, signed by a CA.

```bash
# Purpose: inspect what a server actually presents - subject, issuer, validity,
# SANs and signature algorithm.
openssl s_client -connect imboni.rw:443 -servername imboni.rw </dev/null 2>/dev/null \
  | openssl x509 -noout -text | head -40

# Purpose: the fast version - just the dates, for an expiry check.
echo | openssl s_client -connect imboni.rw:443 2>/dev/null \
  | openssl x509 -noout -dates
```

Validation checks that clients perform, each of which is a historical vulnerability class:

| Check | Failure if skipped |
|---|---|
| Signature chains to a trusted root | any CA-shaped certificate accepted |
| Not expired, not before `notBefore` | revoked-by-time certificates accepted |
| Hostname matches a SAN | a valid certificate for *another* domain accepted |
| Not revoked (CRL / OCSP) | a known-stolen certificate accepted |
| Basic constraints — is the issuer a CA? | **any leaf certificate can sign others** |
| Key usage permits this use | a signing cert used for TLS |

The `basicConstraints` row is the famous one: for years some implementations did not check
it, so anyone with any valid certificate could mint certificates for any domain.

### Revocation, and why it mostly does not work

CRLs are large and cached. OCSP adds a round trip to a third party, leaks which sites you
visit, and — the fatal part — most clients **fail open** when the responder is
unreachable, because failing closed would take sites offline. So an attacker who can
intercept traffic can also block OCSP.

OCSP stapling (the server attaches a fresh signed status) fixes the privacy and latency
problems but not fail-open, unless `must-staple` is set, which risks outages.

The industry's actual answer is **short lifetimes instead of revocation** — and this is now
a schedule, not a theory:

```
CA/Browser Forum ballot SC-081v3, passed April 2025 (verified October 2026):
  from 15 March 2026  →  maximum 200 days   ← IN FORCE NOW
  from 15 March 2027  →  maximum 100 days
  from 15 March 2029  →  maximum  47 days
Domain-validation reuse shrinks alongside, to about 10 days by 2029.
```

The practical consequence is not subtle: **manual certificate renewal is finished.** At
47 days, any human process will eventually miss one and take the site down. If your
renewal is not automated and monitored today, that is a scheduled outage.

```bash
# Purpose: verify automated renewal actually works, rather than assuming it does.
# The dry run exercises the full path without consuming rate limits.
sudo certbot renew --dry-run
systemctl list-timers | grep certbot

# Purpose: alert before expiry independently of the renewal mechanism, because
# the thing most likely to fail silently is the automation itself.
echo | openssl s_client -connect imboni.rw:443 2>/dev/null | openssl x509 -noout -enddate
```

That second check matters more than it looks. Monitoring the *certificate* catches a
broken renewer; monitoring the renewer does not catch a certificate that was never
installed.

### Certificate Transparency

Every publicly trusted certificate must be logged in append-only, Merkle-tree-based public
logs (Chapter 2's Merkle trees, in production). Browsers require proof of logging.

Why you care: **you can monitor for certificates issued for your domain that you did not
request.** That is detection of a CA compromise or a mis-issuance, for free.

```bash
# Purpose: list every certificate ever publicly issued for your domain. Anything
# here you did not request is an incident.
curl -s "https://crt.sh/?q=imboni.rw&output=json" \
  | python -c "import sys,json; [print(c['not_before'][:10], c['issuer_name'][:40], c['name_value'].replace(chr(10),' ')) for c in json.load(sys.stdin)[:20]]"
```

Set up a free CT monitoring alert for both domains. It takes five minutes and it is one of
the few detection controls you can add today with no infrastructure — which matters given
that your detection coverage, per `01-SECURITY_FOUNDATIONS.md` Chapter 17, is currently
zero.

### The configuration that matters

```nginx
# Purpose: a modern, correct TLS configuration for nginx. TLS 1.2 is kept only for
# older Android devices; drop it when your analytics say you can.
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;            # TLS 1.3: let the client choose
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;

ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;                  # tickets can undermine forward secrecy

ssl_stapling on;
ssl_stapling_verify on;

# HSTS: force HTTPS for two years, including subdomains.
# `preload` is effectively PERMANENT - read hstspreload.org before adding it.
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
```

Every cipher in that list is ECDHE (forward secrecy) with an AEAD mode (GCM or
Poly1305). Nothing with CBC, nothing with static RSA key exchange. That is the whole
selection rule, and it comes straight out of Chapters 5 and 6.

```bash
# Purpose: test the result from outside, including protocol versions, cipher
# selection, certificate chain and known vulnerabilities.
docker run --rm -ti drwetter/testssl.sh https://imboni.rw
# or: https://www.ssllabs.com/ssltest/
```

### mTLS and pinning

**Mutual TLS** — the client presents a certificate too. Both sides authenticate
cryptographically. Right for service-to-service calls and webhook senders; wrong for
general users, because certificate distribution to humans is a nightmare.

**Certificate pinning** — hardcode the expected certificate or key. It stops a
compromised CA and it has caused more outages than it has prevented breaches: pin to a
certificate, rotate it, and every client breaks with no recovery path. HTTP Public Key
Pinning was deprecated and removed from browsers for exactly this reason. Pin only in a
mobile app where you control the update cycle, pin to an intermediate or a backup key, and
read `../../engineering-curriculum/09-mobile/` before shipping it.

### Practice

1. Run `testssl.sh` against your production domain. Fix everything it rates below A.
2. Verify `certbot renew --dry-run` passes and the timer is active.
3. Add independent certificate-expiry monitoring that would catch a broken renewer.
4. Query `crt.sh` for both domains. Account for every certificate listed.
5. Set up CT monitoring alerts. This is a detection control you can finish today.
6. Decide — in writing, with the 2029 date in mind — whether your renewal process
   survives 47-day certificates.

---

## Chapter 10: Post-quantum cryptography

The part of this subject that changed most recently, and the part your existing notes did
not mention at all.

### What a quantum computer breaks

Precision matters here, because the popular framing ("quantum breaks encryption") is
wrong in both directions.

| Algorithm | Quantum attack | Effect |
|---|---|---|
| RSA | **Shor's** | **broken completely** — polynomial time |
| ECDH / X25519 | **Shor's** | **broken completely** |
| ECDSA / Ed25519 | **Shor's** | **broken completely** |
| Diffie–Hellman | **Shor's** | **broken completely** |
| AES-256 | Grover's | effective security halves to 128 bits — **still fine** |
| AES-128 | Grover's | 64 bits — uncomfortable; prefer 256 |
| SHA-256 | Grover's | preimage 128 bits — **fine** |
| HMAC, Argon2 | Grover's | fine |

So: **all current public-key cryptography falls; symmetric cryptography survives with
larger parameters.** Everything in Chapters 3, 4 and 5 is essentially fine. Everything in
Chapter 6 needs replacing.

### Harvest now, decrypt later

The reason this is not a 2035 problem. An adversary can **record encrypted traffic today**
and decrypt it once a capable quantum computer exists.

```
2026: attacker captures TLS sessions; cannot read them
2033: attacker runs Shor's on the recorded key exchange
      → recovers the session keys → reads everything captured in 2026
```

So the question is not "when do quantum computers arrive?" It is:

> **How long does my data need to stay secret?**

For a marketing page: zero, this is irrelevant. For children's health records and
mental-health screening responses: **decades.** A pupil screened in 2026 has a legitimate
expectation of confidentiality in 2050.

That puts both your projects in the category where harvest-now-decrypt-later is a real
consideration rather than a vendor talking point — not because anyone is targeting you, but
because bulk traffic capture is not targeted.

Note what is and is not affected. **Forward secrecy does not help** against this: the
ephemeral key exchange is precisely what Shor's algorithm breaks. Data encrypted at rest
with AES-256 is fine. The exposure is *key agreement*, in transit.

### The standardised algorithms

NIST published the first post-quantum standards in August 2024:

| Standard | Algorithm | Job | Based on |
|---|---|---|---|
| **FIPS 203** | **ML-KEM** (Kyber) | key encapsulation — replaces ECDH | module lattices |
| **FIPS 204** | **ML-DSA** (Dilithium) | signatures — replaces ECDSA/Ed25519 | module lattices |
| **FIPS 205** | **SLH-DSA** (SPHINCS+) | signatures, hash-based | hash functions only |

SLH-DSA is the conservative hedge: it rests only on hash functions, so it survives even if
lattice problems turn out to be weaker than believed. Its signatures are large and slow,
which is why it is a backup rather than a default. NIST also selected **HQC** in 2025 as a
backup KEM with different mathematics, for the same diversification reason.

### Hybrid key exchange — what to actually do

Nobody sensible deploys post-quantum cryptography alone yet; the algorithms are young. The
deployed approach is **hybrid**: combine a classical and a post-quantum key exchange so the
session is secure if *either* holds.

```
X25519MLKEM768  =  X25519 (classical)  +  ML-KEM-768 (post-quantum)
                   secure unless BOTH are broken
```

This is not speculative. Measured across sampled domains in 2026, **X25519MLKEM768 was
negotiated by roughly 49% of domains, overtaking plain X25519 at about 38%** — the hybrid
group is now the majority choice for TLS 1.3 key exchange.

The asymmetry to understand: **key exchange is largely solved and migrating fast;
authentication is not.** The same study measured approximately **0% adoption of
post-quantum certificates**. Certificates still use RSA and ECDSA, and the ecosystem — CAs,
chain sizes, client support — is far behind. Microsoft shipping ML-DSA support in Active
Directory Certificate Services in May 2026 is an early step, not general availability.

That split tells you where to spend effort: enabling hybrid key exchange is cheap and
available now; post-quantum certificates are not yet your decision to make.

### The timelines

| Authority | Requirement |
|---|---|
| **EU roadmap** | national implementation plans by end of **2026**; high-risk use cases migrated by **2030**; broad transition by **2035** |
| **NSA CNSA 2.0** | post-quantum capability required for national security systems, exclusive use by **2035**; specifies **ML-KEM-1024** |

You are not bound by either. They matter because they set vendor roadmaps — your
dependencies will become post-quantum-capable on this schedule whether you plan for it or
not.

### What to do now, concretely

In rough order of cost:

1. **Enable hybrid key exchange.** Mostly free — recent OpenSSL, nginx and browsers
   support `X25519MLKEM768`. You get protection against harvest-now-decrypt-later for the
   cost of a config line.
2. **Inventory your cryptography.** You cannot migrate what you have not listed. Where is
   RSA? Where is ECDSA? Which are in long-lived data versus transient sessions?
3. **Prefer AES-256 over AES-128** for anything long-lived. Grover's halves it, and 256
   leaves margin.
4. **Build crypto-agility.** The versioned keys and labelled HKDF derivations from
   Chapter 8 are exactly this: the ability to change algorithm without a rewrite. This is
   the highest-value structural work, because it makes every future migration cheap.
5. **Do not deploy post-quantum-only anything.** Hybrid or nothing.
6. **Ignore post-quantum certificates for now** — and watch, because this is the part that
   will move next.

```bash
# Purpose: check whether your OpenSSL supports hybrid post-quantum key exchange,
# and which groups it offers.
openssl version
openssl list -kem-algorithms 2>/dev/null | grep -i -E "kem|mlkem"
openssl ecparam -list_curves 2>/dev/null | head

# Purpose: see what key exchange group a server actually negotiated. Look for
# "Negotiated TLS1.3 group" in the output.
openssl s_client -connect cloudflare.com:443 -groups X25519MLKEM768 </dev/null 2>&1 \
  | grep -i -E "group|cipher"
```

```nginx
# Purpose: offer hybrid post-quantum key exchange, preferred, with classical
# fallback for clients that do not support it. Requires OpenSSL 3.5+ or equivalent.
ssl_ecdh_curve X25519MLKEM768:X25519:prime256v1;
```

### Practice

1. Check whether your VPS's OpenSSL supports `X25519MLKEM768`. If yes, enable it and
   confirm with `openssl s_client` that it negotiates.
2. Inventory every use of RSA and ECDSA across both projects and your SSH configuration.
3. For each sensitive data class, write down how long it must stay confidential. Which
   exceed 10 years?
4. Explain harvest-now-decrypt-later in three sentences, and explain why forward secrecy
   does not prevent it.
5. Check whether Cloudflare, Google and your own domain negotiate a hybrid group today.

---

## Chapter 11: Encoding is not encryption

The error that looks silly written down and is made constantly in production.

| Operation | Reversible without a key? | Purpose |
|---|---|---|
| **Encoding** (base64, hex, URL) | **yes, trivially** | safe transport of bytes |
| **Compression** (gzip) | yes | size |
| **Hashing** | no, but enumerable for small inputs | fingerprinting |
| **Encryption** | only with the key | secrecy |

```python
# Purpose: demonstrate that base64 provides no confidentiality whatsoever.
import base64
token = base64.b64encode(b"user=admin;role=superuser").decode()
print(token)                                      # dXNlcj1hZG1pbjtyb2xlPXN1cGVydXNlcg==
print(base64.b64decode(token).decode())           # user=admin;role=superuser
```

If a value looks like `dXNlcj1hZG1pbg==` or ends in `=`, treat it as **plaintext**.

### Real-life application: the September payload

This is exactly what the malware relied on, and it is why the reasoning matters.

The .NET assembly was stored as a long hex string inside a fake MSBuild property
(`<Copyright>`, `<PackageTags>`) and decoded at runtime with
`SoapHexBinary.Parse(...)`. Not encrypted — **encoded**.

Two consequences, and they point in opposite directions:

- **For the attacker:** encoding was enough, because it defeats signature matching and
  eyeballing. No key management, no decryption stub, nothing for antivirus to match.
- **For you:** it meant the payload was fully recoverable from the file on disk, which is
  how it was identified and hashed. Had it been *encrypted* with a key fetched from a C2
  server, static analysis would have recovered nothing.

```python
# Purpose: recognise an encoded executable inside a text file. A PE binary starts
# with the bytes "MZ" (0x4D 0x5A), which gives a recognisable prefix in both hex
# and base64 - and detecting these is what contentscan.py was written to do.
#
#   hex:     4d5a90...      ← "MZ" followed by the DOS header
#   base64:  TVqQAA...      ← the same bytes, base64-encoded
#
# Multi-kilobyte hex or base64 blobs in a .csproj, .targets or .props file have
# no legitimate explanation.
```

That detection is now in your own scanner at
`C:\Users\user\Documents\antivirus\guardian\contentscan.py`. The lesson generalises: **the
absence of encryption is itself a detectable signal.** Encoded payloads are findable
precisely because they are not encrypted.

### Practice

1. Decode a JWT from either project at jwt.io. Confirm the payload is readable and that
   the signature is what protects it, not the encoding.
2. Find one place in either codebase where base64 is used as if it provided secrecy.
3. Write a function that detects a multi-kilobyte hex or base64 blob in a text file.
   Compare yours against `contentscan.py`.

---

## Chapter 12: Tokens and JWTs

Where cryptography meets session management, and where a surprising number of production
systems are broken.

### The format

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiIxMjQ3Iiwicm9sZSI6InBhcmVudCJ9 . 4f2a...
     header (b64)              payload (b64)                      signature
```

**The payload is encoded, not encrypted** (Chapter 11). Anyone holding the token reads it.
Never put anything confidential in a JWT.

### The attacks

| Attack | How | Defence |
|---|---|---|
| **`alg: none`** | set the header algorithm to `none`, drop the signature; naive verifiers accept it | pin the expected algorithm explicitly |
| **HS/RS confusion** | server expects RS256; attacker sends HS256 signed with the *public* key as the HMAC secret | pin the algorithm; never let the token choose |
| **`kid` injection** | point `kid` at a file or SQL-injectable key lookup | allow-list key IDs |
| **No expiry check** | library decodes without verifying `exp` | verify `exp`, `nbf`, `iss`, `aud` |
| **Weak secret** | HS256 with a guessable secret, cracked offline at GPU speed | ≥256 bits from `secrets` |
| **No revocation** | logout cannot invalidate a stateless token | see below |

```python
# Purpose: WRONG. Lets the token's own header choose the algorithm, which is the
# root of both the alg:none and the HS/RS confusion attacks.
jwt.decode(token, key, algorithms=None)
jwt.decode(token, options={"verify_signature": False})      # worse

# Purpose: RIGHT. The algorithm is pinned by the server, and the standard claims
# are verified rather than merely parsed.
import jwt
claims = jwt.decode(
    token,
    key=PUBLIC_KEY,
    algorithms=["RS256"],                 # pinned - a single-element list
    audience="imboni-api",
    issuer="https://auth.imboni.rw",
    options={"require": ["exp", "iat", "sub", "aud", "iss"]},
)
```

### The revocation problem — the real reason to think twice about JWTs

A JWT's selling point is that it is **stateless**: verify the signature and trust the
contents, no database lookup. That same property means you **cannot revoke it**. Logout,
role change, account suspension, "sign out everywhere" after a malware incident — none of
them can invalidate a token that is already issued and still inside its expiry window.

The options, honestly:

| Approach | Revocation | Cost |
|---|---|---|
| Long-lived JWT (hours/days) | **impossible** | fast, and dangerous |
| Short-lived JWT (5–15 min) + refresh token | within one access-token lifetime | a refresh endpoint |
| JWT + denylist lookup | immediate | you reintroduced the database lookup |
| **Opaque token + server-side session** | **immediate** | one lookup per request, usually a Redis hit |

> **The decision rule:** use a JWT when a *different* service must verify the token
> without calling you. Otherwise use an opaque random token with server-side state — it is
> simpler, revocable, and leaks nothing.

For a Django monolith serving its own frontend, the JWT buys you nothing and costs you
revocation. Most JWT deployments are cargo-culted microservice patterns applied to
single-service applications.

This is directly relevant to September. When an infostealer takes session material, the
only correct response is to **invalidate every session everywhere** — and whether you
*can* is determined by this design decision, made long before the incident. Anthropic
could invalidate your sessions because they hold server-side state. Could Imboni?

### Advanced: PASETO

Platform-Agnostic Security Tokens. Same use case, designed so the attacks above are
impossible: versioned protocols where the algorithm is fixed by the version, so there is
no `alg` header to manipulate, and no `none` option.

```
v4.local.<encrypted payload>     ← symmetric, XChaCha20-Poly1305, payload ENCRYPTED
v4.public.<signed payload>       ← asymmetric, Ed25519, payload readable
```

Worth knowing as the example of a better design: the algorithm-confusion class is removed
structurally rather than by careful configuration — the same preference stated in
`01-SECURITY_FOUNDATIONS.md` Chapter 1.

### Practice

1. Take a JWT from either project and try the `alg: none` attack against your own
   endpoint. Document whether it worked.
2. Check every `jwt.decode` call in both codebases for a pinned algorithm list and
   required claims.
3. Answer in writing: if you learned right now that a session token had been stolen, what
   exactly would you do, and would it work?
4. For one token in your system, decide JWT or opaque using the decision rule. Write the
   justification.

---

## Chapter 13: Applied patterns

The three jobs you will actually need, assembled from Part 1.

### Pattern 1: encrypting a database field

```python
# Purpose: transparently encrypt a sensitive field at the ORM boundary, with the
# ciphertext bound to its row so it cannot be relocated. Key comes from the
# environment (better: a secret manager - Chapter 8).
import os, base64
from django.db import models
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

KEK = base64.b64decode(os.environ["FIELD_KEK"])     # 32 bytes

class EncryptedTextField(models.TextField):
    """AES-256-GCM, with the row's identity as associated data."""

    def _aad(self, model_instance) -> bytes:
        return f"{model_instance._meta.db_table}:{model_instance.pk}:{self.name}".encode()

    def get_prep_value(self, value):
        if value in (None, ""):
            return value
        nonce = os.urandom(12)
        ct = AESGCM(KEK).encrypt(nonce, str(value).encode(), self._aad_cache)
        return base64.b64encode(b"v1" + nonce + ct).decode()

    def from_db_value(self, value, expression, connection):
        if value in (None, ""):
            return value
        raw = base64.b64decode(value)
        assert raw[:2] == b"v1"                      # version, for rotation
        nonce, ct = raw[2:14], raw[14:]
        return AESGCM(KEK).decrypt(nonce, ct, self._aad_cache).decode()
```

The hard constraint, which no library removes: **you cannot query an encrypted column.**
No `WHERE medical_notes LIKE '%allergy%'`, no index, no sort, no `GROUP BY`. Decide that
before you encrypt, not after a report breaks.

Note also that the AAD depends on the primary key, which does not exist before the first
save — a real wrinkle this sketch papers over with `_aad_cache`. Binding to the table and
column name only is the simpler correct option when rows can be inserted before they have
an ID.

### Pattern 2: searchable encryption with a blind index

When you must look up an encrypted value by exact match:

```python
# Purpose: allow exact-match lookup on an encrypted field without decrypting the
# column. A keyed HMAC of the normalised value is deterministic, so it can be
# indexed, while revealing nothing to someone without the index key.
import hmac, hashlib, os

INDEX_KEY = os.environ["BLIND_INDEX_KEY"].encode()

def blind_index(value: str) -> str:
    normalised = value.strip().lower()               # normalise or lookups miss
    return hmac.new(INDEX_KEY, normalised.encode(), hashlib.sha256).hexdigest()

# Model:  national_id_enc = EncryptedTextField()
#         national_id_bi  = models.CharField(max_length=64, db_index=True)
#
# Write:  obj.national_id_enc = nid; obj.national_id_bi = blind_index(nid)
# Read:   Person.objects.get(national_id_bi=blind_index(query))
```

Be clear about what this does and does not give you. It is deterministic, so it **leaks
equality**: an attacker with the database sees which rows share a value, and can count
frequencies. For a national ID (unique per person) that is acceptable. For a field with
few distinct values — a diagnosis, a yes/no answer — frequency analysis recovers the
plaintext distribution, and a blind index is the wrong tool.

And it supports exact match only. No prefix, no substring, no range. Order-preserving and
searchable-encryption schemes exist for those and all leak more; treat them as research
unless you have read the specific scheme's leakage profile.

### Pattern 3: signed URLs for temporary access

```python
# Purpose: grant time-limited access to a resource without a database lookup or a
# session, using an HMAC over the resource and expiry. Suitable for report
# downloads and share links.
import hmac, hashlib, time, base64

def sign_url(path: str, user_id: int, ttl: int = 3600) -> str:
    exp = int(time.time()) + ttl
    msg = f"{path}:{user_id}:{exp}".encode()
    sig = base64.urlsafe_b64encode(
        hmac.new(URL_KEY, msg, hashlib.sha256).digest()[:16]).decode().rstrip("=")
    return f"{path}?uid={user_id}&exp={exp}&sig={sig}"

def verify_url(path: str, user_id: int, exp: int, sig: str) -> bool:
    if time.time() > exp:
        return False
    expected = sign_url(path, user_id, exp - int(time.time())).split("sig=")[1]
    return hmac.compare_digest(sig, expected)
```

Then remember the `Referer`/history/log leakage from
`01-SECURITY_FOUNDATIONS.md` Chapter 4: a signed URL *is* a bearer credential in a URL.
Keep the TTL short, and do not use this for anything whose exposure for its TTL would be
serious.

### Library choices

| Need | Python | Avoid |
|---|---|---|
| General crypto | `cryptography` | `pycrypto` (unmaintained), `pycryptodome` for new code |
| Easy & safe | `cryptography.fernet`, `PyNaCl` (libsodium) | hand-rolled anything |
| Passwords | `argon2-cffi` via Django | `hashlib` |
| JWT | `PyJWT` with pinned algorithms | anything that defaults to `algorithms=None` |
| TLS | the OS/OpenSSL via `requests` | `verify=False`, ever |

```bash
# Purpose: find the single most common TLS mistake in Python codebases - disabled
# certificate verification, which silently removes all of Chapter 9.
grep -rn "verify=False\|VERIFY_NONE\|check_hostname = False\|InsecureRequestWarning" \
     --include="*.py" .
```

### Practice

1. Encrypt one real sensitive field with AAD binding. Then try to write a report that
   filters on it and document exactly what breaks.
2. Add a blind index for one exact-match lookup. Write down its leakage profile in one
   sentence.
3. Run the `verify=False` grep on both projects. Fix every hit.
4. Implement signed URLs for one download endpoint and explain your TTL choice.

---

## Chapter 14: The failure catalogue

Every one of these has happened in production systems. Check yours against it.

| # | Failure | Why it is fatal | Fix |
|---|---|---|---|
| 1 | SHA-256 for passwords | 10 GH/s on a GPU | Argon2id, 19 MiB / t=2 minimum |
| 2 | `==` to compare a MAC or token | timing side channel | `hmac.compare_digest` |
| 3 | Reused AES-GCM nonce | plaintext recovery **and tag forgery** | random 96-bit, or XChaCha20 |
| 4 | `hash(secret + message)` as a MAC | length extension | HMAC |
| 5 | Encryption without authentication | bit-flipping, padding oracles | AEAD only |
| 6 | Key stored beside ciphertext | encryption achieved nothing | KMS / secret manager |
| 7 | `random` instead of `secrets` | predictable tokens | `secrets` |
| 8 | base64 treated as encryption | it is plaintext | actual encryption |
| 9 | `verify=False` on TLS | MITM, silently | never disable verification |
| 10 | JWT with `algorithms=None` | trivial forgery | pin the algorithm |
| 11 | Signing re-serialised webhook bodies | intermittent valid-signature failures | sign the raw bytes |
| 12 | No idempotency on verified webhooks | replay within the time window | event-ID claim |
| 13 | ECB mode | structure visible in ciphertext | GCM |
| 14 | ECDSA nonce reuse | **private key recovery** | Ed25519 |
| 15 | Hashing a phone number to "anonymise" | enumerable keyspace | keyed HMAC or tokenisation |
| 16 | No `kek_version` on ciphertext | rotation becomes a rewrite | version from day one |
| 17 | Manual certificate renewal | guaranteed outage at 47 days | automate and monitor separately |
| 18 | Long-lived JWT with no revocation path | cannot respond to theft | short expiry + refresh, or opaque |
| 19 | AES-128 for decades-lived secrets | Grover's halves it | AES-256 |
| 20 | Classical-only key exchange for long-lived secrets | harvest-now-decrypt-later | hybrid `X25519MLKEM768` |

## Chapter 15: The checklist

- [ ] Passwords: Argon2id, ≥19 MiB / t=2 / p=1, verified timing 100–500 ms **on the VPS**
- [ ] Login endpoint rate-limited *before* cost parameters were raised
- [ ] Every secret comparison uses a constant-time function
- [ ] Every webhook verifies the **raw body**, with a timestamp window **and** idempotency
- [ ] All encryption is AEAD; no CBC, no ECB, no unauthenticated modes
- [ ] Nonces are random per message; AAD binds ciphertext to its location
- [ ] Every ciphertext and token carries a key version
- [ ] Keys live in a secret manager, not a `.env` file on a laptop
- [ ] Key derivation uses HKDF with versioned purpose labels
- [ ] Rotation has been practised, with a written runbook
- [ ] All randomness comes from `secrets` / `os.urandom` / `crypto.getRandomValues`
- [ ] TLS 1.2+ only, forward-secret AEAD ciphers only, HSTS set
- [ ] Certificate renewal automated **and** expiry monitored independently
- [ ] CT monitoring enabled for every domain
- [ ] JWTs pin the algorithm and verify `exp`, `aud`, `iss` — or you use opaque tokens
- [ ] You can invalidate every session everywhere, and have tested it
- [ ] Hybrid post-quantum key exchange enabled where the stack supports it
- [ ] A cryptographic inventory exists: what algorithm, where, protecting what, for how long
- [ ] No `verify=False` anywhere in either codebase

---

## Exercise 3 — the module checkpoint

Guide closed. No AI. Each item produces an artefact.

1. **The primitive table, from memory.** Eight jobs, the right primitive, and one thing
   never to use for each. Then check it. (Chapter 1)

2. **Password timing.** Measure Argon2id verification on the production VPS. Tune to
   100–500 ms. Compute the memory cost of 20 concurrent logins and state whether you have
   a self-inflicted DoS. (Chapter 3)

3. **Hasher audit.** Report how many users in each project are still on the old hasher,
   and your plan for the ones who never log in. (Chapter 3)

4. **The timing attack, demonstrated.** Build a server that compares a MAC with `==`.
   Measure the difference between 0 and 16 correct bytes over 10,000 requests. Fix it and
   show the signal vanish. (Chapter 4)

5. **Webhook audit.** Check every handler in both projects against all four steps — raw
   body, constant time, timestamp window, idempotency. Report which steps each is missing,
   then fix one completely. (Chapter 4)

6. **Nonce reuse, demonstrated.** Encrypt two plaintexts with one key and nonce. Recover
   one from the other. Write down, in one sentence, why this also breaks *integrity*.
   (Chapter 5)

7. **Ciphertext relocation.** Encrypt a field with AAD bound to the row. Move the
   ciphertext to another row. Show `InvalidTag`. Then do it without AAD and show it
   decrypting. (Chapter 5)

8. **Key inventory.** Complete the September table from Chapter 8 with real answers in the
   "Rotated?" column. Every remaining `?` is a finding — list them separately so they can
   be closed.

9. **Plaintext secret sweep.** Run the four `find` commands. Count the plaintext secrets
   on your machine today, thirteen months after they were stolen once.

10. **Envelope encryption.** Implement KEK/DEK with `kek_version` for one field, then
    perform a full KEK rotation with both versions live. Write the runbook as you go.

11. **TLS audit.** `testssl.sh` against production. Fix everything below A. Verify
    automated renewal, add independent expiry monitoring, enable CT alerts. (Chapter 9)

12. **Post-quantum readiness.** Inventory every use of RSA and ECDSA. For each sensitive
    data class, state its required confidentiality lifetime. Enable hybrid key exchange if
    the stack supports it, and confirm the negotiated group. (Chapter 10)

13. **Token decision.** For one token in your system, decide JWT or opaque using Chapter
    12's rule, and answer: if it were stolen tonight, could you invalidate it? (Chapter 12)

14. **The catalogue.** Check both codebases against all twenty rows of Chapter 14. Report
    hits with file and line.

**Automatic fail:** implementing a primitive yourself; `verify=False` surviving anywhere;
any answer that reports a tool's output without your reasoning.

Exercise 8 is the one that matters most, because it is the only one that closes a live
incident rather than teaching you about one. Exercise 4 is the one that will make you
distrust `==` permanently.
