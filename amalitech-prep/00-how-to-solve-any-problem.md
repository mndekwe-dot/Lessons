# 00 — How to Solve Any Problem (the method)

Read this BEFORE the lessons, and re-read it whenever you get stuck.
Being stuck almost never means "I don't know Python" — it means you skipped a step below.

The lessons teach you the *tools* (loops, dicts, slicing). This file teaches you the
*method*: the same 6 steps, applied to every single question, from Q1 to Q4.

---

## Table of Contents

1. [The 6-step method](#the-6-step-method)
2. [The 9 solution-finding moves](#the-9-solution-finding-moves)
3. [Worked example: the method applied to `century` end to end](#worked-example-the-method-applied-to-century-end-to-end)
4. [When you're stuck for 10+ minutes (the unstick checklist)](#when-youre-stuck-for-10-minutes-the-unstick-checklist)

---

## The 6-step method

### Step 1 — Restate the problem in your own words
One sentence, out loud or on paper. If you can't restate it, you don't understand it yet — re-read.

> *century(year)*: "Given a year, tell me which century it belongs to."

### Step 2 — Study the given examples like they are the real problem statement
The examples are not decoration — they are there to kill wrong assumptions.
For each example ask: **"why is THIS the answer and not something else?"**

> - `1905 -> 20` — fine, 1905 is in the 1900s, so 19+1 = 20.
> - `2001 -> 21` — same logic, 20+1 = 21.
> - `1700 -> 17` — wait. My logic says 17+1 = 18. **The example disagrees.**
>
> That disagreement IS the question. 1700 is the *last* year of century 17,
> not the first of century 18. Round-number years belong to the century that *ends* on them.

**The trickiest example is usually the whole point of the problem.** Find the example that
breaks your first idea before you write any code.

### Step 3 — Solve it by hand first (no code!)
Take the smallest example and compute the answer with pen and paper, step by step.
Write down *what you actually did* — that IS the algorithm. If you can't do it by hand,
you can't code it.

> By hand for centuries: years 1–100 → century 1, years 101–200 → century 2, ...
> So I'm dividing by 100 and rounding **up**, not down.

### Step 4 — Name the pattern
Now match what you did by hand to a known tool. Ask, in order:

1. Am I just doing math on numbers? → `%`, `//`, the round-up trick (see moves below)
2. Am I looking at every element once? → a `for` loop with a running variable
3. Am I counting or remembering things? → dict / set
4. Am I comparing pairs or ranges? → sort first / two pointers / prefix sums

(The full phrase→tool table is in `08-cheat-sheet.md`.)

### Step 5 — Write the code in tiny steps, testing as you go
Don't write 15 lines and then run. Write 2–3 lines, run against an example, repeat.
In the practice files: fill in ONE function, run the file, look at that function's tests only.

### Step 6 — Attack your own solution before submitting
Try to break it with:
- the **smallest** input (0, 1, empty list, one element)
- a **boundary** input (exactly on a limit: year 100, 200, 2000)
- an **all-same** input (`[5,5,5]`, `"aaaa"`)

If it survives, submit.

---

## The 9 solution-finding moves

When step 4 doesn't ring a bell, run through these moves. They solve 90% of Q1–Q3 questions.

### Move 1 — Try the naive idea first, let the examples correct you
Write the obvious formula/loop, test it on ALL given examples. When one fails,
the *way* it fails tells you the fix.
> `year // 100 + 1` fails only on 1700 → only round years are wrong → I need round-**up** division.

### Move 2 — The round-up division trick
"Divide by k, rounding up" with integers:
```python
(x + k - 1) // k        # century: (year + 99) // 100
```
Appears as: centuries, "how many buses/boxes/pages of size k", "minimum groups needed".

### Move 3 — Peel a number digit by digit
```python
while n > 0:
    digit = n % 10      # last digit
    n //= 10            # remove it
```
Appears as: reverse a number, sum of digits, count digits, check palindrome number.
(Shortcut: `str(n)` turns it into a string problem — also fine!)

### Move 4 — The running variable
One variable that you update as you loop: a sum, a count, a best-so-far.
```python
total = 0               # or: best = a[0], count = 0
for x in items:
    if <condition>:
        total += x      # or: best = max(best, x), count += 1
```
Appears as: sum of odds, count evens, largest element, "how many satisfy ___".
This ONE shape solves most of Q1 and half of Q2.

### Move 5 — Translate conditions literally, one `if` per rule
For "rule-following" problems (leap years, pricing rules, grading):
write each rule from the statement as its own line, in the order the statement gives exceptions.
```python
# "divisible by 4, EXCEPT centuries, UNLESS divisible by 400"
if year % 400 == 0: return True     # strongest exception first
if year % 100 == 0: return False
return year % 4 == 0
```
Don't try to be clever and merge rules — literal is safer and easier to debug.

### Move 6 — Work backwards from the expected output
Stuck on *how*? Look at the expected answer and ask "what's the last thing I'd do to produce this?"
> Output `4321` from `1234` → last step is appending digits in reverse order →
> so I need the digits from the right → that's `% 10` and `// 10` (Move 3).

### Move 7 — Make the problem smaller
Can't solve it for `n = 1000`? Solve it for `n = 3` by hand. Then `n = 4`.
Notice what you repeated between the two — that repetition is your loop body.

### Move 8 — GENERATE vs PEEL vs WALK: what do I do with the input?

When the input is a single number, ask which of these you need — they are NOT the same:

| I need... | Do this | Tool |
|---|---|---|
| the numbers **1 to n** | **GENERATE** them | `for i in range(1, n + 1)` |
| the **digits** of n (1234 → 1,2,3,4) | **PEEL** them off | `n % 10` and `n // 10` (Move 3) |
| a **calculation** on n | neither — no loop at all! | plain arithmetic |

And when the input is a list or string, you **WALK** it: `for x in items`.

> `sum_odd(7)` needs GENERATE — produce 1..7, then keep the odds. You are not taking 7 apart.
> `reverse_number(1234)` needs PEEL — you want the actual digits.
> `century(1905)` needs NEITHER — it is one division, no loop.

**Getting this wrong wastes minutes.** Before writing any loop, say out loud what the loop is
walking over. If you can't name it, you may not need a loop.

### Move 9 — Say what each variable IS, out loud
Halfway through, if you're confused, point at each variable and finish this sentence:
"after i steps, `total` is ___". If you can't finish it, that variable has no clear job —
delete it and restart the function. Confusion lives in undefined variables.

---

## Worked example: the method applied to `century` end to end

| Step | What you do |
|---|---|
| 1. Restate | "Which century does this year fall in?" |
| 2. Examples | `1700 -> 17` kills the naive `//100 + 1` idea — round years are the trap |
| 3. By hand | 1–100→1, 101–200→2 ... so it's division by 100, rounded UP |
| 4. Pattern | Round-up division → Move 2: `(x + k - 1) // k` |
| 5. Tiny steps | `return (year + 99) // 100` → run file → 3 PASS |
| 6. Attack it | Boundaries: `century(100)` → 1 ✓, `century(101)` → 2 ✓. Submit. |

---

## When you're stuck for 10+ minutes (the unstick checklist)

1. Re-read the problem — you skipped a sentence. (This fixes it half the time.)
2. Re-do Step 2: which given example does your current idea get WRONG, and why?
3. Run Move 7: solve `n = 3` by hand and watch what your hands do.
4. Simplify: delete your code and write the dumbest version that could work.
5. Still stuck after 15 min in practice? Read the solution — then **close it and
   retype it from memory**, and redo the same problem tomorrow without looking.

On exam day, replace item 5 with: submit whatever passes the visible examples and move on.
