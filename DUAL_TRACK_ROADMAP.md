# Dual-Track Master Roadmap: Python & JavaScript in Parallel

How to prepare for **both technical assessments** at the same time without confusion or burnout:
1. **Track 1 (Python):** **AmaliTech Assessment** (CodeSignal GCA format: 4 challenges in 70 minutes + cognitive test).
2. **Track 2 (JavaScript):** **The Gym Rwanda** (Application video + CodeWars katas + JavaScript fundamentals technical interview + live coding).

---

## Table of Contents
1. [The Golden Rule: The Two-Session Daily Split](#1-the-golden-rule-the-two-session-daily-split)
2. [The Side-by-Side Syntax Bridge (Don't Mix Them Up!)](#2-the-side-by-side-syntax-bridge-dont-mix-them-up)
3. [Concept-by-Concept Study Alignment Matrix](#3-concept-by-concept-study-alignment-matrix)
4. [4-Week Dual-Track Study Calendar](#4-4-week-dual-track-study-calendar)
5. [Daily Study Routine (2.5 to 3 Hours per Day)](#5-daily-study-routine-25-to-3-hours-per-day)
6. [The Readiness Checklists (Before Interview Day)](#6-the-readiness-checklists-before-interview-day)

---

## 1. The Golden Rule: The Two-Session Daily Split

**Never switch languages every 15 minutes.** That causes brain fatigue and syntax errors (like typing `def` in JavaScript or `let` in Python).

Instead, divide your study day into **two clean, separated blocks**:

```
+---------------------------------------------------------------+
| MORNING SESSION (60-90 min): PYTHON TRACK                     |
| Focus: AmaliTech GCA (Speed, 2D Grids, Math, Q1 -> Q3)        |
+---------------------------------------------------------------+
                               |
                        [BREAK / CLASSES]
                               |
+---------------------------------------------------------------+
| EVENING SESSION (60-90 min): JAVASCRIPT TRACK                 |
| Focus: The Gym (CodeWars Katas, Spoken English Theory Q&A)   |
+---------------------------------------------------------------+
```

---

## 2. The Side-by-Side Syntax Bridge (Don't Mix Them Up!)

Keep this table open whenever you switch languages:

| Action | Python (AmaliTech) | JavaScript (The Gym) | The Difference to Remember |
|---|---|---|---|
| **Declare a variable** | `x = 10` | `let x = 10;` or `const x = 10;` | JS requires `let` or `const`! |
| **Print to screen** | `print(x)` | `console.log(x);` | `print()` does not exist in JS! |
| **Function definition** | `def add(a, b):` | `function add(a, b) {` or `(a, b) =>` | JS needs curly braces `{ ... }` |
| **Check equality** | `a == b` | `a === b` | In JS, always use **triple equals** `===`! |
| **Get length** | `len(items)` | `items.length` | In JS, `.length` has **no parentheses**! |
| **Add to end of list** | `items.append(x)` | `items.push(x)` | Python = `.append()`, JS = `.push()` |
| **Remove from end** | `items.pop()` | `items.pop()` | Identical! |
| **Integer division** | `7 // 2` (gives 3) | `Math.floor(7 / 2)` (gives 3) | In JS, `//` starts a comment! |
| **Format a string** | `f"Score: {score}"` | `` `Score: ${score}` `` | JS uses **backticks** and `${}` |
| **Loop over items** | `for x in items:` | `for (const x of items) {` | JS uses `for...of` (not `for...in`!) |
| **Check if item exists** | `x in items` | `items.includes(x)` (array/string) | In JS, `in` checks object keys! |
| **Booleans** | `True`, `False` | `true`, `false` | In JS, booleans are lowercase! |
| **Empty value** | `None` | `null` or `undefined` | In JS, `null` is intentional empty. |
| **Dictionary / Object** | `{"age": 20}` | `{ age: 20 }` | Very similar, called Object in JS. |

---

## 3. Concept-by-Concept Study Alignment Matrix

To study concept by concept, refer to [UNIVERSAL_PROGRAMMING_LOGIC.md](file:///c:/Users/user/Documents/AmaliTech-Prep/UNIVERSAL_PROGRAMMING_LOGIC.md) for the universal mental models. Then study the matching morning and evening files together:

| Core Concept | Universal Model | Morning: Python Track (AmaliTech) | Evening: JavaScript Track (The Gym) |
| :--- | :--- | :--- | :--- |
| **1. Variables & Types** | Storing values in labeled boxes | [01-python-essentials.md](file:///c:/Users/user/Documents/AmaliTech-Prep/01-python-essentials.md)<br>`practice/drills_common_mistakes.py` | [01-javascript-essentials.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/01-javascript-essentials.md)<br>`the-gym-prep/practice/drills_js_basics.js` (Sec A) |
| **2. Conditionals & Logic** | Forks in the road (`if`/`else`) | [01-python-essentials.md](file:///c:/Users/user/Documents/AmaliTech-Prep/01-python-essentials.md)<br>`practice/drills_common_mistakes.py` | [01-javascript-essentials.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/01-javascript-essentials.md)<br>`the-gym-prep/practice/drills_js_basics.js` (Sec B) |
| **3. Loops & Iteration** | Running laps until done | [01b-loops-guide.md](file:///c:/Users/user/Documents/AmaliTech-Prep/01b-loops-guide.md)<br>`practice/drills_strings_lists.py` (Sec A–B) | [02-loops-and-functions.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/02-loops-and-functions.md)<br>`the-gym-prep/practice/drills_js_basics.js` (Sec C) |
| **4. Sequences & Lists** | Numbered post office boxes | [02-strings-and-lists.md](file:///c:/Users/user/Documents/AmaliTech-Prep/02-strings-and-lists.md)<br>`practice/drills_strings_lists.py` (Sec C–E) | [03-strings-and-arrays.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/03-strings-and-arrays.md)<br>`the-gym-prep/practice/drills_js_basics.js` (Sec D–E) |
| **5. Functions & Scope** | Kitchen blenders (`input -> return`) | [01-python-essentials.md](file:///c:/Users/user/Documents/AmaliTech-Prep/01-python-essentials.md)<br>`practice/q1_warmups.py` | [02-loops-and-functions.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/02-loops-and-functions.md)<br>`the-gym-prep/practice/codewars_practice.js` |
| **6. Hash Maps / Objects** | Contact list lookup by name | [03-dictionaries-and-sets.md](file:///c:/Users/user/Documents/AmaliTech-Prep/03-dictionaries-and-sets.md)<br>`practice/drills_dicts_sets.py` | [04-objects-and-data-structures.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/04-objects-and-data-structures.md)<br>`the-gym-prep/practice/drills_objects_maps.js` |
| **7. Common Traps & Bugs** | The subtle silent errors | [10-my-common-mistakes.md](file:///c:/Users/user/Documents/AmaliTech-Prep/10-my-common-mistakes.md)<br>`practice/drills_common_mistakes.py` | [10-my-common-js-mistakes.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/10-my-common-js-mistakes.md)<br>`the-gym-prep/practice/drills_common_mistakes.js` |
| **8. Algorithm Patterns** | Accumulators, Filters, Tallies | [05-algorithm-patterns.md](file:///c:/Users/user/Documents/AmaliTech-Prep/05-algorithm-patterns.md)<br>`practice/q2_data_manipulation.py` | [06-codewars-kata-playbook.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/06-codewars-kata-playbook.md)<br>`the-gym-prep/practice/codewars_practice.js` |
| **9. Full Mock Simulation** | Timed interview testing | [06-mock-test.md](file:///c:/Users/user/Documents/AmaliTech-Prep/06-mock-test.md) (70 min GCA) | [12-mock-interview-simulation.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/12-mock-interview-simulation.md) (45 min) |

---

## 4. 4-Week Dual-Track Study Calendar

### Week 1: Foundation & Muscle Memory
- **Python (Morning):**
  - Read: `01-python-essentials.md` & `01b-loops-guide.md`
  - Practice: `practice/drills_common_mistakes.py` (Sections A–D)
  - Target: Master `%`, `//`, `sum()`, `min()`, `max()`.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/01-javascript-essentials.md` & `02-loops-and-functions.md`
  - Practice: `the-gym-prep/practice/drills_js_basics.js` (Sections A, B, C)
  - CodeWars: Solve Kata 1 (*Multiply*), Kata 2 (*Even or Odd*), Kata 3 (*Opposite*).

### Week 2: Sequences, Strings & CodeWars Katas
- **Python (Morning):**
  - Read: `02-strings-and-lists.md`
  - Practice: `practice/drills_strings_lists.py` (Sections A–E)
  - Target: Slicing `[start:stop:step]`, `.split()`, `"".join()`.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/03-strings-and-arrays.md` & `06-codewars-kata-playbook.md`
  - Practice: `the-gym-prep/practice/drills_js_basics.js` (Sections D & E)
  - CodeWars: Complete `the-gym-prep/practice/codewars_practice.js` (Katas 4 through 8).

### Week 3: Dictionaries, Objects & Interview Theory
- **Python (Morning):**
  - Read: `03-dictionaries-and-sets.md` & `04-matrices-and-simulation.md`
  - Practice: `practice/drills_dicts_sets.py` & `practice/q1_warmups.py`
  - Target: Hash map tallies, $O(1)$ lookups, 2D matrix coordinate navigation.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/04-objects-and-data-structures.md` & `05-interview-theory-qa.md`
  - Practice: `the-gym-prep/practice/drills_objects_maps.js`
  - Spoken English: Practice speaking the 9 technical interview answers out loud.
  - Video Prep: Read and rehearse `the-gym-prep/08-application-video-script.md`.

### Week 4: Timed Mocks & Final Polish
- **Python (Morning):**
  - Read: `05-algorithm-patterns.md`, `10-my-common-mistakes.md`, `08-cheat-sheet.md`
  - Practice: `practice/q2_data_manipulation.py` & `06-mock-test.md`
  - Target: Complete 3 out of 4 problems in under 60 minutes.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/09-javascript-cheat-sheet.md` & `the-gym-prep/10-my-common-js-mistakes.md`
  - Practice: `the-gym-prep/practice/mock_interview_test.js`
  - Application: Record video, copy CodeWars profile link, and submit The Gym application form!

---

## 5. Daily Study Routine (2.5 to 3 Hours per Day)

### Morning Session: Python (AmaliTech) — 75 Minutes
1. **Warmup (15 min):** Run 10 quick drill exercises in `practice/drills_common_mistakes.py` or `practice/drills_strings_lists.py`.
2. **Deep Work (45 min):** Work on one real GCA problem in `practice/q1_warmups.py`, `q2_data_manipulation.py`, or `q3_implementation.py`. Solve it on paper first!
3. **Review (15 min):** Review your mistakes against `10-my-common-mistakes.md`.

### Evening Session: JavaScript (The Gym) — 75 Minutes
1. **Theory & Spoken English (20 min):** Open `the-gym-prep/05-interview-theory-qa.md`. Read two questions and answer them **out loud in English** without reading the screen.
2. **Coding Drills (35 min):** Open `the-gym-prep/practice/drills_js_basics.js` or `codewars_practice.js`. Implement 2 to 3 functions and verify with `node`.
3. **CodeWars Online (20 min):** Log into [codewars.com](https://www.codewars.com/), solve one 8 kyu kata in JavaScript, and submit it to boost your profile score.

---

## 6. The Readiness Checklists (Before Interview Day)

### AmaliTech (Python) Readiness:
- [ ] I can write loops, `if/else`, and math operations without looking at notes.
- [ ] I know that `range(len(x))` needs `len()`, but `for x in nums` does not.
- [ ] I know that `x += 5` is correct, and `x =+ 5` is a silent bug.
- [ ] I can slice strings and lists backwards with `[::-1]`.
- [ ] I can count items using a dictionary tally sheet (`d[x] = d.get(x, 0) + 1`).
- [ ] I can navigate a 2D grid with `grid[row][col]`.

### The Gym (JavaScript) Readiness:
- [ ] I can explain `let` vs `const` vs `var` out loud in English.
- [ ] I know why `===` must always be used instead of `==`.
- [ ] I can name the 6 falsy values (`false`, `0`, `""`, `null`, `undefined`, `NaN`).
- [ ] I know that `nums.sort()` on numbers requires `(a, b) => a - b`.
- [ ] I have solved at least 10 katas on CodeWars and my profile is active.
- [ ] I have recorded my 60–90 second application video speaking clearly in English.
- [ ] I remember to write `return` instead of `console.log()` in coding challenges.

