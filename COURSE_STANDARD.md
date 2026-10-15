# Course Standard

What counts as a finished course in this repository, and what counts as notes.

This file exists because a batch of guides was written as summaries and shipped as
courses. It is the contract they are being rebuilt against. Any new guide that does not
meet it is not finished.

---

## The benchmark

The standard was not invented here. It is measured from the guides in this repository
that were already right:

| File | Lines | Words | H2 | Code blocks |
|---|---|---|---|---|
| `engineering-curriculum/06-system-design/01-ADVANCED_SYSTEM_DESIGN.md` | 2,199 | 15,191 | 25 | 37 |
| `engineering-curriculum/01-frontend/01-REACT_PATTERNS.md` | 2,211 | 9,751 | 49 | 126 |
| `engineering-curriculum/00-foundations/01-DSA_COURSE.md` | 1,726 | 14,356 | 20 | 57 |
| `engineering-curriculum/03-async-caching/01-CACHING_FULL_COURSE.md` | 1,216 | 5,362 | 39 | 57 |

**Floor for a course: 5,000 words and 25 code blocks.** Below that it is a guide, and
it must say so in its first line.

## The five rules

### 1. Cover the field, not the project

A course on time series covers time series. It does not cover "the parts of time series
that happen to appear in Imboni."

The project is where the knowledge gets **applied**, at the end of a section, after the
general case is complete. `01-DSA_COURSE.md` is the model: full coverage of arrays,
hashing, sorting, recursion, graphs and DP — and *then* "Real-life application: teacher
double-booking checker". Not the other way round.

If a reader left your project tomorrow, the file should still be worth keeping.

### 2. Beginner to advanced, in that order, in one file

Every section starts from the definition and ends somewhere a professional would still
learn something. No prerequisites assumed beyond the module before it.

The test: a section that a beginner can follow *and* that contains at least one thing a
practitioner would not already know.

### 3. Runnable code, commented with purpose

The house pattern, from `01-DSA_COURSE.md`:

```python
# Purpose: find two numbers in a SORTED array that add up to `target`, in O(n).
def two_sum_sorted(nums, target):
    lo, hi = 0, len(nums) - 1
    ...
```

Every block states its purpose in a comment. Every block runs as written. Commands show
their **output**, because output is how a reader knows they got it right.

Snippets that cannot run — config fragments, SQL plans, protocol traces — are fine, and
still carry a purpose line.

### 4. Step-by-step construction, not conclusions

`### How to build X — step by step` before the finished code. The reader must be able to
build it again without the file. A file that only states conclusions teaches recognition,
not ability.

### 5. Exercises that produce an artefact

Numbered, guide-closed, and each one ends in something that exists afterwards: a script,
a diagram, a written paragraph, a number. The last line names which exercise matters
most and why.

## Section shape

```
## N. Topic
      one-paragraph statement of what this is and why it matters

### The mechanics
      the general case, completely, with code

### How to build it — step by step
      numbered construction

### Advanced: <the part most people skip>
      where a professional earns their keep

### Getting it wrong
      the failure mode, the symptom, the fix

### Real-life application: <concrete>
      now the project, with output shown

### Practice
      2-5 problems
```

Not every section needs all seven. Every section needs mechanics, code and practice.

## Research requirement

Anything versioned, dated or ranked must be verified against a primary source before it
is written down, and the source named inline.

This is not pedantry. The first draft of the security curriculum taught **OWASP Top
10:2021** in October 2026 — eleven months after the 2025 list replaced it, with two new
categories and SSRF merged away. It was confidently wrong, and a reader would have
learned the wrong list by heart.

Verify, with a date:

- Standards and top-10 lists — the standards body's own page, not a vendor blog
- Library and tool versions — the project's own changelog
- Statistics — the original report, never an aggregator
- Legal and regulatory claims — the gazette or the regulator
- Anything where "current best practice" is claimed

Write `(verified October 2026)` next to the volatile ones so the next reader knows when
it was last true.

## What does not count as depth

- Restating a bullet list as a table
- Listing tool names without a command that uses one
- "It depends" with no decision rule
- An exercise that says "read about X"
- Project examples standing in for the general case
- A checklist at the end of a file that taught no mechanics

## Front matter

Every course opens with:

```markdown
# <Title> — Zero to Professional

**Week N.** <One sentence: what you will be able to do afterwards.>

<Two or three lines on why this file exists and what it assumes.>
```

Then the TOC, generated — never hand-written:

```bash
python tools/add_toc.py
python tools/check_toc_links.py     # must report 0 broken
python tools/check_file_links.py    # must report no new breakage
```

---

## The honest note

Depth is not length. A 10,000-word file that says one thing ten times is worse than a
3,000-word file that teaches three things properly, and padding a file to clear the
floor in rule 1 defeats the point of having it.

The real test is the one in rule 1: **would this still be worth reading if the projects
it mentions no longer existed?**
