# AmaliTech Assessment Prep — Python (From Zero to Ready)

You are preparing for **two assessments**, taken in person:

1. **Coding assessment** — the CodeSignal **GCA (General Coding Assessment)** format:
   - **4 coding challenges in 70 minutes**
   - You need **at least 3 correct** to pass
   - You choose your language → **Python**
2. **Cognitive assessment** — logic, pattern recognition, numerical reasoning (see `07-cognitive-test.md`)

---

## The single most important fact about the GCA

The 4 questions are **not random** — they always follow the same difficulty ladder:

| Question | Type | Time you should spend | Difficulty |
|----------|------|----------------------|------------|
| Q1 | Basic coding (loops, if/else, math) | 5–10 min | Very easy |
| Q2 | Data manipulation (lists, strings, counting) | 10–15 min | Easy |
| Q3 | Implementation-heavy (follow complex instructions exactly, often 2D grids/strings) | 15–20 min | Medium — long description, but no clever algorithm needed |
| Q4 | Problem solving (needs an efficient idea: dictionaries, sets, prefix sums) | 20–25 min | Harder — brute force may be too slow |

**Your pass strategy: lock in Q1 + Q2 + Q3.** That's 3 correct = passing score. Q4 is a bonus.
Q3 is not "smart" — it's *careful*. Most people fail it by misreading the problem, not by lacking skill.

---

## Study plan

Work through the numbered files in order. Each has a lesson + exercises, and matching
practice files in `practice/` that you can **run directly** (`python practice/q1_warmups.py`).

**Start with `00-how-to-solve-any-problem.md`** — it's the 6-step method and the 8
solution-finding moves you'll apply to every exercise in every lesson. Re-read it whenever
you get stuck.

### If you have 4 weeks
- **Week 1:** `01-python-essentials.md` + `02-strings-and-lists.md` — write code every day, no copy-paste
- **Week 2:** `03-dictionaries-and-sets.md` + `04-matrices-and-simulation.md`
- **Week 3:** `05-algorithm-patterns.md` + start timed practice on [CodeSignal practice](https://app.codesignal.com/assessments/practice) (they sent you this link — use it, it's the *exact* test interface)
- **Week 4:** `06-mock-test.md` under real conditions (70 min, no notes) + redo weak areas + `07-cognitive-test.md`

### If you have 2 weeks
- **Days 1–3:** files 01–02
- **Days 4–6:** files 03–04
- **Days 7–9:** file 05
- **Days 10–14:** one timed practice session per day (CodeSignal practice + the mock test), review mistakes the same day

### Daily rule
**Type every solution yourself.** Reading solutions feels like learning but isn't.
Attempt each problem for at least 10–15 minutes before looking at the answer.

---

## Test-day strategy (memorize this)

1. **Read Q1–Q4 titles first** (1 min). Know what's coming.
2. Solve in order: Q1 → Q2 → Q3. **Run the provided examples after every few lines of code**, not just at the end.
3. **Q3: read the statement twice** before typing. Underline (mentally) every rule. Test edge cases: empty input, single element, all-same values.
4. Only start Q4 when Q1–Q3 are green. If brute force fits the limits (n ≤ ~1000), just do brute force — a slow correct answer often scores partial/full points; an elegant broken one scores zero.
5. **Never leave a question blank.** Submit *something* that passes the visible examples.
6. Budget: if you're 25 minutes in and still on Q1/Q2, simplify — you're overcomplicating it.

## Files in this kit

| File | What it covers |
|------|----------------|
| `00-how-to-solve-any-problem.md` | The 6-step method + 8 solution-finding moves — how to approach ANY question |
| `01-python-essentials.md` | Syntax, loops, functions, input/output — the foundation |
| `01b-loops-guide.md` | Every kind of loop, explained the beginner way, with when to use each |
| `01c-conditions-guide.md` | Every kind of if/decision, comparisons, and/or/not — with scenarios |
| `01d-operations-and-builtins.md` | Math operators + all the built-in functions, each with a scenario |
| `02-strings-and-lists.md` | Slicing, methods, comprehensions — used in EVERY question |
| `03-dictionaries-and-sets.md` | Counting & lookups — the #1 tool for Q4 |
| `04-matrices-and-simulation.md` | 2D grids & "follow the rules" problems — the heart of Q3 |
| `05-algorithm-patterns.md` | Two pointers, prefix sums, sorting tricks — Q4 weapons |
| `06-mock-test.md` | A full 4-question, 70-minute mock exam with solutions |
| `07-cognitive-test.md` | How to prepare for the cognitive assessment |
| `08-cheat-sheet.md` | One-page summary of ALL tips, patterns, and traps — review before test day |
| `09-specialization-roadmap.md` | **AFTER the assessment** — choosing Data Engineering vs Python BE & AI, and what to learn next |
| `10-my-common-mistakes.md` | **MY** repeating mistakes + pre-submit checklist + error-message decoder |
| `11-glossary.md` | What the words in problem statements mean (anagram, contiguous, subarray…) |
| `practice/drills_common_mistakes.py` | 24 tiny drills targeting those exact mistakes — run daily |
| `practice/gca_q1_basic.py` | Q1 real GCA questions — basic coding (loops, math, conditions) |
| `practice/gca_q2_data_manipulation.py` | Q2 real GCA questions — data manipulation (lists, strings, counting) |
| `practice/gca_q3_implementation.py` | Q3 real GCA questions — implementation-heavy (grids, simulation) |
| `practice/gca_q4_problem_solving.py` | Q4 real GCA questions — problem solving (efficient algorithms) |
| `practice/` | Runnable Python files: problems + hidden solutions + self-tests |
| `12-practice-plan.md` | Daily practice schedule — how to practice so you can depend on yourself |
