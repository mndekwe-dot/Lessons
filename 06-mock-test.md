# 06 — Mock Test (do this under real conditions)

**Rules:** 70 minutes. No notes, no lessons, no AI, no solutions file. Set a timer.
Write your answers in `practice/mock_answers.py` and run it to check.

Do this mock only after finishing files 01–05. Repeat it a few days later if you scored under 3/4.

---

## Table of Contents

1. [Task 1 (target: 8 min)](#task-1-target-8-min)
2. [Task 2 (target: 12 min)](#task-2-target-12-min)
3. [Task 3 (target: 20 min)](#task-3-target-20-min)
4. [Task 4 (target: 25 min)](#task-4-target-25-min)

---

## Task 1 (target: 8 min)

**growthInYears(deposit, rate, threshold)**
Each year a deposit grows by `rate` percent. Return the number of full years needed
for the deposit to become **strictly more** than `threshold`.

- `growthInYears(100, 20, 170)` → `3` (100 → 120 → 144 → 172.8)
- `growthInYears(100, 1, 100)` → `1`

## Task 2 (target: 12 min)

**mostCommonFirstLetter(words)**
Given a list of lowercase words, return the letter that appears most often as a
**first letter**. If there is a tie, return the alphabetically smallest one.

- `["apple","banana","avocado","blueberry","cherry"]` → `"a"` (a:2, b:2 → tie → "a")
- `["kiwi"]` → `"k"`

## Task 3 (target: 20 min)

**battleships(field)**
`field` is a square grid of `1` (ship part) and `0` (water). Ships are straight
horizontal or vertical lines of 1s (a single `1` is also a ship). Ships never touch
each other, not even diagonally. Return the **number of ships**.

```
[[1,0,0,1],
 [1,0,0,0],
 [1,0,1,1],
 [0,0,0,0]]  → 3   (one vertical of length 3, one single, one horizontal of length 2)
```

Hint: count only the "start" cells — a cell with no ship part above it and none to its left.

## Task 4 (target: 25 min)

**longestEqualSubarray(nums)**
Given a list containing only 0s and 1s, return the length of the longest contiguous
subarray with an **equal number of 0s and 1s**.

- `[0,1]` → `2`
- `[0,1,0]` → `2`
- `[0,0,1,0,1,1,1,0]` → `8`

Hint: treat 0 as −1 and think about running sums seen before (file 05, prefix sums + dict).

---

When done: check against `practice/solutions/solutions_mock.py`, then **review every
mistake the same day** and note what went wrong (misread? syntax? wrong idea? time?).
