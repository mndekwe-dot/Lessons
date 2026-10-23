# Mock Test — Answers, Explained

The four mock questions (from `06-mock-test.md`), each with the code and a plain walkthrough.
Study the *reasoning*, not just the code — that's what transfers to tomorrow.

---

## Table of Contents

1. [Task 1 — growthInYears (target 8 min) · difficulty: EASY (Q1)](#task-1--growthinyears-target-8-min--difficulty-easy-q1)
2. [Task 2 — mostCommonFirstLetter (target 12 min) · difficulty: EASY-MEDIUM (Q2)](#task-2--mostcommonfirstletter-target-12-min--difficulty-easy-medium-q2)
3. [Task 3 — battleships (target 20 min) · difficulty: MEDIUM (Q3)](#task-3--battleships-target-20-min--difficulty-medium-q3)
4. [Task 4 — longestEqualSubarray (target 25 min) · difficulty: HARD (Q4)](#task-4--longestequalsubarray-target-25-min--difficulty-hard-q4)
5. [The takeaway for tomorrow](#the-takeaway-for-tomorrow)

---

## Task 1 — growthInYears (target 8 min) · difficulty: EASY (Q1)

**Problem:** a deposit grows by `rate` percent each year. Return how many full years until it
becomes **strictly greater** than `threshold`.
`growthInYears(100, 20, 170)` → 3 (100 → 120 → 144 → 172.8)

**Which pattern?** A `while` loop — you don't know how many years, you stop when a condition
flips. Count the years as you go (a running counter).

```python
def growth_in_years(deposit, rate, threshold):
    years = 0
    while deposit <= threshold:          # keep going while NOT yet past threshold
        deposit = deposit * (1 + rate / 100)   # grow by rate% (20% → ×1.20)
        years += 1                       # count this year
    return years
```

**Walkthrough** for (100, 20, 170):
- start: deposit 100, years 0. Is 100 <= 170? yes → grow to 120, years 1
- 120 <= 170? yes → 144, years 2
- 144 <= 170? yes → 172.8, years 3
- 172.8 <= 170? **no** → stop → return 3 ✓

**The trap:** "strictly more than". The loop runs while `deposit <= threshold`, so it keeps
going until deposit is truly past it. If it said "at least", you'd use `<`.

---

## Task 2 — mostCommonFirstLetter (target 12 min) · difficulty: EASY-MEDIUM (Q2)

**Problem:** given lowercase words, return the letter appearing most often as a **first
letter**. On a tie, return the alphabetically smallest.
`["apple","banana","avocado","blueberry","cherry"]` → "a" (a:2, b:2 tie → "a")

**Which pattern?** COUNT EACH (a dictionary), then find the best — but with a tie-breaker.

```python
from collections import Counter

def most_common_first_letter(words):
    counts = Counter(w[0] for w in words)   # count first letters: {a:2, b:2, c:1}
    best = max(counts.values())             # the highest count → 2
    winners = [c for c, n in counts.items() if n == best]  # all letters with that count
    return min(winners)                     # alphabetically smallest of the tied ones
```

**Walkthrough:**
- first letters: a, b, a, b, c → counts `{a:2, b:2, c:1}`
- highest count is 2
- letters with count 2: `["a","b"]`
- `min(["a","b"])` → "a" ✓ (min on strings = alphabetical)

**The insight:** two phases — count, then decide. The tie-breaker is why you collect *all*
winners and take `min`, instead of just grabbing the first max.

---

## Task 3 — battleships (target 20 min) · difficulty: MEDIUM (Q3)

**Problem:** a grid of 1 (ship) and 0 (water). Ships are straight lines of 1s (a single 1
counts). Ships never touch. Return the **number of ships**.

**The trick (from the hint):** don't trace whole ships. Every ship has exactly ONE top-left
cell — a 1 with **no 1 above it and no 1 to its left**. Count those "start" cells.

```python
def battleships(field):
    rows = len(field)
    cols = len(field[0])
    count = 0
    for r in range(rows):                    # visit every cell (G5)
        for c in range(cols):
            if field[r][c] == 1:
                no_above = (r == 0 or field[r-1][c] == 0)   # top edge OR water above
                no_left  = (c == 0 or field[r][c-1] == 0)   # left edge OR water left
                if no_above and no_left:
                    count += 1               # this is a ship's start
    return count
```

**Walkthrough** — each 1 is a "start" only if nothing connects to it above or left:
- a vertical ship: only its TOP cell is a start (the ones below have a 1 above → skipped)
- a horizontal ship: only its LEFT cell is a start (the ones right have a 1 left → skipped)
- a single 1: nothing above, nothing left → a start

**The edge guard:** `r == 0 or ...` must come first. On row 0 there's nothing above, and it
stops Python from reading `field[-1][c]` (which would wrongly wrap to the last row).

---

## Task 4 — longestEqualSubarray (target 25 min) · difficulty: HARD (Q4)

**Problem:** a list of 0s and 1s. Return the length of the longest **contiguous** stretch with
an equal number of 0s and 1s.
`[0,0,1,0,1,1,1,0]` → 8

> This is a genuinely hard Q4 (prefix-sum + dictionary). If you're short on time tomorrow,
> a Q4 like this is the one to attempt LAST or leave partial. Understanding it is a bonus.

**The clever idea:** turn each 0 into −1. Now "equal 0s and 1s" means "the chunk sums to 0".
Keep a **running sum**. If the same running-sum value appears at two positions, the chunk
*between* them sums to 0 → equal 0s and 1s.

```python
def longest_equal_subarray(nums):
    first_seen = {0: -1}     # running-sum value → the earliest index it appeared
    running = 0
    best = 0
    for i, x in enumerate(nums):
        running += 1 if x == 1 else -1       # 1 adds +1, 0 adds -1
        if running in first_seen:
            best = max(best, i - first_seen[running])   # distance between equal sums
        else:
            first_seen[running] = i          # remember the FIRST time we saw this sum
    return best
```

**Why `{0: -1}` at the start:** a running sum of 0 means "equal so far from the very start".
Pretending we saw sum 0 at index −1 makes the length maths work (e.g. index 1 minus −1 = 2).

**Walkthrough** for `[0,1]`:
- i=0, x=0 → running −1. New, store `{-1: 0}`.
- i=1, x=1 → running 0. Already in `first_seen` at −1 → length = 1 − (−1) = 2 → best 2 ✓

**The pattern:** running sum + "have I seen this value before?" (a dictionary of first
positions). This is the prefix-sum idea from file 05 — the hardest Q4 tool.

---

## The takeaway for tomorrow

| Task | Pattern | Your comfort |
|---|---|---|
| 1 growthInYears | `while` + counter | should be solid |
| 2 mostCommonFirstLetter | count each → decide + tiebreak | solid |
| 3 battleships | grid + "start cell" trick | doable |
| 4 longestEqualSubarray | prefix sum + dict | hard — attempt last |

**Marks strategy:** Tasks 1, 2, 3 fully = well past 350. Task 4 is a bonus. Do 1 and 2 fast,
give 3 a proper go, and only touch 4 if the others are green. Never leave any blank.
