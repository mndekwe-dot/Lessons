‌# 11 — Glossary: Words That Appear in Problem Statements

Misreading ONE word is the most common way to fail a question. Skim this before the exam.

---

## Table of Contents

1. [Words about position and order](#words-about-position-and-order)
2. [Words about parts of things](#words-about-parts-of-things)
3. [Words about counting and uniqueness](#words-about-counting-and-uniqueness)
4. [Word puzzles that show up constantly](#word-puzzles-that-show-up-constantly)
5. [Words about the function itself](#words-about-the-function-itself)
6. [Words about grids](#words-about-grids)
7. [Maths words](#maths-words)
8. [Phrases that tell you the ANSWER'S SHAPE](#phrases-that-tell-you-the-answers-shape)

---

## Words about position and order

| Word | Means | Example |
|---|---|---|
| **index** / **position** | where an item sits, counting from **0** | in `[7,8,9]`, index 1 holds 8 |
| **element** / **item** | one thing inside a list | 8 is an element of `[7,8,9]` |
| **adjacent** / **neighbouring** / **consecutive** | next to each other | in `[1,2,3]`, 1 and 2 are adjacent |
| **contiguous** | in an unbroken run, no gaps | `[2,3]` is contiguous in `[1,2,3,4]`; `[1,3]` is not |
| **ascending** | smallest → largest | `[1,2,3]` |
| **descending** | largest → smallest | `[3,2,1]` |
| **in order** / **preserving order** | keep the original arrangement | don't sort it |
| **in-place** | change the original, don't build a new one | `nums.sort()` |
| **reverse** | backwards | `"abc"` → `"cba"` |
| **rotate** | shift items around, wrapping | `[1,2,3]` rotated left by 1 → `[2,3,1]` |

---

## Words about parts of things

| Word | Means | Example |
|---|---|---|
| **substring** | a **contiguous** piece of a string | `"ell"` is a substring of `"hello"` |
| **subarray** / **sublist** | a **contiguous** piece of a list | `[2,3]` is a subarray of `[1,2,3,4]` |
| **subsequence** | items in order but **gaps allowed** | `[1,3]` is a subsequence of `[1,2,3]` |
| **prefix** | the start of something | `"he"` is a prefix of `"hello"` |
| **suffix** | the end of something | `"lo"` is a suffix of `"hello"` |
| **digit** | one numeral of a number | 1234 has digits 1, 2, 3, 4 |
| **character** / **char** | one letter/symbol of a string | `"a"` in `"cat"` |
| **row** | one horizontal line of a grid | `grid[0]` |
| **column** | one vertical line of a grid | gathered with a loop |

> **"contiguous" is the big one.** It means no gaps. If a problem says "contiguous
> subarray", `[1,3]` from `[1,2,3]` does NOT count — you skipped the 2.

---

## Words about counting and uniqueness

| Word | Means |
|---|---|
| **distinct** / **unique** | different values, each counted once. `[1,1,2]` has 2 distinct values |
| **duplicate** | a value appearing more than once |
| **frequency** / **occurrences** | how many times something appears |
| **most frequent** / **mode** | the value appearing most often |
| **at most** | ≤ (this many or fewer) |
| **at least** | ≥ (this many or more) |
| **strictly greater** | > (bigger, NOT equal) |
| **non-negative** | 0 or positive (0 counts!) |
| **positive** | greater than 0 (0 does NOT count) |

> **"at most 2" includes 2.** "Strictly more than 2" does not. These decide whether you
> write `<=` or `<`.

---

## Word puzzles that show up constantly

| Word | Means | Example |
|---|---|---|
| **palindrome** | reads the same forwards and backwards | `"level"`, `"radar"`, `12321` |
| **anagram** | same letters, rearranged | `"listen"` and `"silent"` |
| **isogram** | no repeated letters | `"cat"` yes, `"cattle"` no |
| **vowel** | a, e, i, o, u | everything else is a **consonant** |
| **alphanumeric** | letters and digits only (no spaces/punctuation) | `.isalnum()` |
| **case-insensitive** | treat A and a as the same | use `.lower()` on both sides |
| **whitespace** | spaces, tabs, newlines | `.strip()` removes it from the ends |

**How to check each:**
- palindrome → `s == s[::-1]`
- anagram → `sorted(a) == sorted(b)`
- isogram → `len(set(s)) == len(s)`

---

## Words about the function itself

| Word | Means |
|---|---|
| **parameter** / **argument** | the value handed to your function (`def f(nums)` — `nums` is the parameter) |
| **return** | hand a value back. **The grader reads this — `print` scores zero** |
| **predicate** | a function returning True/False |
| **iterate** / **traverse** | loop over |
| **implement** | write the code for |
| **modify** | change |
| **preserve** | keep unchanged |
| **edge case** | an unusual input: empty, one item, all-same, biggest allowed |
| **constraint** | a promise about the input, e.g. `1 ≤ n ≤ 1000` |
| **time limit exceeded** | your code is too slow — needs a better approach |

> **Constraints are a hint.** `n ≤ 1000` means a double loop is fine. `n ≤ 100000` means
> you need a set/dict or a single pass.

---

## Words about grids

| Word | Means |
|---|---|
| **matrix** / **grid** / **2D array** | a list of lists |
| **cell** | one position, `grid[r][c]` |
| **square matrix** | same number of rows and columns |
| **diagonal** | top-left → bottom-right (`grid[i][i]`) |
| **anti-diagonal** | top-right → bottom-left |
| **transpose** | swap rows and columns |
| **boundary** / **border** / **edge** | the outer ring of cells |
| **8-directionally adjacent** | including diagonals (Minesweeper) |
| **4-directionally adjacent** | up/down/left/right only |

---

## Maths words

| Word | Means |
|---|---|
| **sum** | added together |
| **product** | multiplied together |
| **remainder** / **modulo** | what's left after division — `%` |
| **quotient** | the result of division |
| **divisible by k** | `n % k == 0` |
| **factor** / **divisor** | a number that divides evenly |
| **multiple** | 6 is a multiple of 3 |
| **prime** | only divisible by 1 and itself |
| **absolute value** | distance from zero, always positive — `abs()` |
| **average** / **mean** | `sum(nums) / len(nums)` |
| **integer** | whole number |
| **inclusive** | include the endpoints. "1 to n inclusive" → `range(1, n+1)` |
| **exclusive** | don't include the endpoint |

---

## Phrases that tell you the ANSWER'S SHAPE

Read these carefully — they decide what you return.

| The problem says | You return |
|---|---|
| "how many" / "count" / "the number of" | a **number** |
| "return the sum/total" | a **number** |
| "return all ___" / "return the ___s" | a **list** |
| "return the first ___" | a **single item** |
| "return true if" / "determine whether" | **True/False** |
| "return the index of" | a **number** (a position, not the value!) |
| "return a new ___" | build fresh, don't modify the input |

> The worked example shows you the shape. `[1,2,3] -> 2` is a number. `[1,2,3] -> [2]`
> is a list. Look at the brackets.
