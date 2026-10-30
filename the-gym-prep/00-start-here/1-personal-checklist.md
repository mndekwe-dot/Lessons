# Personal Checklist — Keep This Open While Practicing

> **Your profile in one line:** your plans are almost always right. Points get lost on small details: spelling, operators, `return`, and not checking.
> The fix is habits, not more theory.

```
Plan: correct  ->  Concept recall: shaky  ->  Syntax: slips  ->  Verification: skipped
                    (fix: steps 01-04)        (fix: checklist)   (fix: trace by hand)
```

---

## 1. Before Typing (1 minute)

- [ ] Say the plan in **one sentence**. Example: *"Find the max length, then keep only the words with that length."*
- [ ] Ask: **what do I return?** A number? An array? The item itself, or `true`/`false`?
- [ ] Ask: **what if nothing is found?** (`-1`? `""`? `null`? an empty array?)
- [ ] **Trace the example by hand** on paper. Write the value of each variable after each loop step.

> A 30-second trace catches most of the bugs from past problems.

---

## 2. While Typing

- [ ] Write **5 lines, then run.** Do not write 30 lines at once.
- [ ] `console.log` the middle values when unsure.
- [ ] Use the **same name** in the loop header and the loop body (`for (const word of words)`, then use `word`).

---

## 3. Pre-Submit Checklist (read every line)

| # | Check | Past slip |
|---|---|---|
| 1 | Every variable has `let` or `const` | `results = ...` with no `const` |
| 2 | A `const` is never reassigned | `const total = 0; total += x` |
| 3 | Spelling of methods and properties | `lenght`, `include` |
| 4 | Right operator | `/` instead of `%` for even/odd |
| 5 | Return the **value**, not `true` | returning `true` instead of the item |
| 6 | `return` is **after** the `if` check, not before it | code after `return` never runs |
| 7 | Not-found case is handled | missing `return -1` |
| 8 | Numbers sorted with a comparator | `.sort()` instead of `.sort((a, b) => a - b)` |
| 9 | Arrays compared by content, not `===` | `[1,2] === [1,2]` is `false` |
| 10 | Bracket notation for variable keys | `ages.name` instead of `ages[name]` |
| 11 | Old test lines from earlier problems deleted | leftover `sortedSquares(...)` call |

---

## 4. Methods I Forget (add to this list)

| Want to... | Write | Not |
|---|---|---|
| Check if something is inside | `arr.includes(x)` / `str.includes(x)` | `include` |
| Repeat a string | `"*".repeat(5)` | `"*" * 5` |
| Array → string | `arr.join("")` | `arr.toString()` |
| String → array | `str.split("")` | |
| Remainder / even check | `n % 2 === 0` | `n / 2` |
| Sort numbers | `arr.sort((a, b) => a - b)` | `arr.sort()` |
| Sort strings A→Z | `arr.sort((a, b) => a.localeCompare(b))` | |
| Is it a digit? | `ch >= "0" && ch <= "9"` | `ch.isDigit()` (doesn't exist) |
| Copy part of array | `arr.slice(start, end)` (original safe) | |
| Cut out of array | `arr.splice(start, count)` (changes original) | |
| Read a key held in a variable | `obj[key]` | `obj.key` |
| | | |

> Changing the loop variable (`x = x * 2` inside `for (let x of arr)`) does **not** change the array. Build a new array or use `arr[i] = ...`.

---

## 5. Daily Routine (about 2 hours)

1. **Syntax & Bible Warm-up (15 min):**
   - Read the Pattern Picker & Top 25 Traps in [`1-lesson-javascript-patterns.md`](../04-patterns/1-lesson-javascript-patterns.md).
   - Run [`3-drills-syntax-reflexes.js`](3-drills-syntax-reflexes.js) or rewrite **yesterday's** solved problem from memory without looking.
2. **Lesson (20 min):** read the next part of the current step folder.
3. **Drills (60 min):** work through the next drills, using sections 1–3 of this checklist on every problem.
4. **Review (15 min):** check the `solutions/` folder **only after** trying. Add any new slip to section 4.
5. **Log (5 min):** write down which checklist line caught a bug today.

---

## 6. Course Order

Work through the folders in number order. Finish a folder before opening the next.

`00-start-here` → `01-foundations` → `02-strings-and-arrays` → `03-objects-maps-sets` → `04-patterns` → `05-codesignal-gca` → `06-the-gym-interview`

Then see [`2-my-common-js-mistakes.md`](2-my-common-js-mistakes.md) for the full list of traps with examples.

