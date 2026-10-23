# 18 — Retake Weekend Plan

**Assessment: Monday 17 August 2026, 9:00 AM** · AmaliTech Kigali Office, near Nyanza Bus Station,
Kicukiro · arrive **8:45** · ~2 hours · September cohort

**You have: Saturday afternoon + Sunday. That's it.**

---

## Table of Contents

1. [The one rule](#the-one-rule)
2. [SATURDAY](#saturday)
3. [SUNDAY](#sunday)
4. [MONDAY MORNING](#monday-morning)
5. [What "ready" looks like Sunday night](#what-ready-looks-like-sunday-night)

---

## The one rule

**Everything below is done SOLO and TIMED.**

In July you did four days of guided work, felt ready, and scored 210/600. The gap wasn't knowledge —
it was that the skill only worked with prompting. This weekend is not for learning. It's for proving
you can produce code alone with a clock running.

**No new material. No reading lessons. Reps only.**

If you can't do a problem in 15 minutes alone, that's information — mark it, move on, come back.
Don't reach for help the moment it gets uncomfortable. The exam room has no help.

---

## SATURDAY

### 12:30–13:30 · Mechanics speed round

`python practice/drills_common_mistakes.py`

Target: **24/24, unaided, under 25 minutes.** These are your known bugs — `=+` vs `+=`,
`range(len(...))`, return placement, `.append()` returning None.

If you don't hit 24/24, run it again immediately. Repeat until you do. Do not move on.

### 13:30–14:30 · Strings and lists speed round

`python practice/drills_strings_lists.py` — all sections.

Target: 34/34. Same rule — repeat until clean.

*Break. 30 minutes. Away from the screen.*

### 15:00–16:00 · Q1 under time

`python practice/gca_q1_basic.py` — every problem, **8 minutes each, timer visible.**

Q1 must be automatic. If any of these takes you more than 8 minutes, that's your first red flag.

### 16:00–17:30 · Q2 under time

`python practice/gca_q2_data_manipulation.py` — **12 minutes each.**

### 17:30–18:00 · Review

Look only at what you got wrong. For each one, write **one line** in `10-my-common-mistakes.md`:
what you did, what was right. Don't re-solve them. Just name them.

### Evening · Cognitive, 45 minutes

`07-cognitive-test.md`. Numerical, verbal, abstract, general mental ability. Light — this is the
section you can't cram, and panicking about it costs you sleep you need more.

**Bed early.**

---

## SUNDAY

### 09:00–10:00 · Grids speed round

`python practice/drills_grids.py` — all sections.

`grid[r][c]` · `range(len(grid))` · neighbours · bounds checks. If these aren't automatic, Q3 is
unreachable, and Q3 is where your third pass mark lives.

### 10:00–11:30 · Q3 under time

`python practice/gca_q3_implementation.py` — **18 minutes each, timer visible.**

Q3 is not clever, it's careful. Read the statement **twice** before typing. Most Q3 failures are
misreadings, not missing skill.

*Break. Eat properly.*

### 12:30–13:30 · Q4 attempt

`python practice/gca_q4_problem_solving.py` — attempt, but **cap it at 20 minutes per problem.**

Q4 is a bonus. Do not sink Sunday into it. If brute force fits the limits, brute force is a correct
answer that scores.

### 14:30–15:40 · FULL TIMED MOCK — the most important 70 minutes of the weekend

`06-mock-test.md`. **70 minutes. No notes. No cheat sheet. No Claude. No Google.**

Phone in another room. Timer running. Treat it as the real thing.

This is the only part of the weekend that reproduces the conditions you actually failed under. If you
skip one thing this weekend, don't let it be this.

### 15:40–17:00 · Mock review

Score it honestly against the 600/350 scale. Then for every question you missed, ask:

- Did I not know the approach, or did I know it and execute it wrong?
- Was it a mechanics bug, or a misread problem?
- Where did the time actually go?

**Execution bugs are the ones to fix.** Those are what cost you July.

### 17:00–18:00 · Fix the top three only

Pick the three mistakes that appeared most. Drill those specifically. Nothing else.

### Evening

Skim `08-cheat-sheet.md` Part 1 and 2, and `10-my-common-mistakes.md`. **Twenty minutes maximum.**

Then stop. Pack your bag. **Sleep early.**

---

## MONDAY MORNING

**No new material. No practice problems. No cramming.**

- Eat properly before you leave
- Bring **ID**
- Leave early — Kicukiro, near Nyanza Bus Station, road to Rebero, 300m from the traffic lights
- Arrive **8:45** for registration
- Set the language to **Python 3** before you start

### In the room

1. **Read all four questions first** (1 minute). Know what's coming.
2. **Q1 → Q2 → Q3.** Lock in three. That's your pass.
3. **Run the given examples after every few lines**, not at the end.
4. **Q3: read the statement twice.** Underline every rule mentally before typing.
5. Only start Q4 when Q1–Q3 are green.
6. **Never leave a blank.** 600 marks, 350 to pass, partial credit is real. Broken code that passes one
   example beats an empty function.
7. If you're 25 minutes in and still on Q1/Q2 — you're overcomplicating it. Simplify.
8. Test edge cases before submitting: empty input, single element, all-same values.

### Before you submit anything, check

- [ ] `+=` not `=+`
- [ ] `range(len(grid))` not `range(grid)`
- [ ] `return` is **after** the loop unless you're searching
- [ ] Not assigning the result of `.append()` or `.sort()` — both return `None`
- [ ] Setup lines are **before** the loop, not inside it
- [ ] Using the parameter, not a hardcoded value

---

## What "ready" looks like Sunday night

- 24/24 on `drills_common_mistakes` unaided, twice
- Q1 problems in under 8 minutes each
- At least 3 of 4 mock questions substantially working in 70 minutes solo

If that's true, you're in a different position than July. If it isn't, you still go on Monday — and you
go knowing which question to open first.
