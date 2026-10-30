# Dual-Track Master Roadmap: Python & JavaScript in Parallel

How to prepare for **both technical assessments** at the same time without confusion or burnout:
1. **Track 1 (Python):** **AmaliTech Assessment** (CodeSignal GCA format: 4 challenges in 70 minutes + cognitive test).
2. **Track 2 (JavaScript):** **The Gym Rwanda** (Application video + CodeWars katas + JavaScript fundamentals technical interview + live coding).

---

## Table of Contents
1. [The Golden Rule: The Two-Session Daily Split](#1-the-golden-rule-the-two-session-daily-split)
2. [The Side-by-Side Syntax Bridge (Don't Mix Them Up!)](#2-the-side-by-side-syntax-bridge-dont-mix-them-up)
3. [Exact 1-to-1 Practice Parity Matrix (Python & JavaScript)](#3-exact-1-to-1-practice-parity-matrix-python--javascript)
4. [4-Week Dual-Track Study Calendar](#4-4-week-dual-track-study-calendar)
5. [Daily Study Routine (Pure Coding Focus — 2.5 to 3 Hours per Day)](#5-daily-study-routine-pure-coding-focus--25-to-3-hours-per-day)
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

## 3. Exact 1-to-1 Practice Parity Matrix (Python & JavaScript)

Every single assignment and drill in Python has an exact twin in JavaScript. When you solve a drill in Python in the morning, you can solve the exact same drill in JavaScript in the evening:

| Assignment Level | Python Practice File | JavaScript Mirror File | Run Commands |
| :--- | :--- | :--- | :--- |
| **Level 1: Core Traps** | [drills_common_mistakes.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/drills_common_mistakes.py) | [drills_common_mistakes.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/01-foundations/4-drills-common-mistakes.js) | `python amalitech-prep/practice/drills_common_mistakes.py`<br>`node the-gym-prep/01-foundations/4-drills-common-mistakes.js` |
| **Level 2: Strings & Arrays** | [drills_strings_lists.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/drills_strings_lists.py) | [drills_strings_arrays.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/02-strings-and-arrays/2-drills-strings-arrays.js) | `python amalitech-prep/practice/drills_strings_lists.py`<br>`node the-gym-prep/02-strings-and-arrays/2-drills-strings-arrays.js` |
| **Level 3: Dicts & Sets** | [drills_dicts_sets.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/drills_dicts_sets.py) | [drills_dicts_sets.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/03-objects-maps-sets/3-drills-dicts-sets.js) | `python amalitech-prep/practice/drills_dicts_sets.py`<br>`node the-gym-prep/03-objects-maps-sets/3-drills-dicts-sets.js` |
| **Level 4: 2D Grids** | [drills_grids.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/drills_grids.py) | [drills_grids.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/04-patterns/2-drills-grids.js) | `python amalitech-prep/practice/drills_grids.py`<br>`node the-gym-prep/04-patterns/2-drills-grids.js` |
| **Level 5: Q1 Warmups** | [q1_warmups.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/q1_warmups.py) | [q1_warmups.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/05-codesignal-gca/1-q1-warmups.js) | `python amalitech-prep/practice/q1_warmups.py`<br>`node the-gym-prep/05-codesignal-gca/1-q1-warmups.js` |
| **Level 6: GCA Q1 Basic** | [gca_q1_basic.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/gca_q1_basic.py) | [gca_q1_basic.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/05-codesignal-gca/2-q1-gca-basic.js) | `python amalitech-prep/practice/gca_q1_basic.py`<br>`node the-gym-prep/05-codesignal-gca/2-q1-gca-basic.js` |
| **Level 7: GCA Q2 Data** | [gca_q2_data_manipulation.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/gca_q2_data_manipulation.py) | [gca_q2_data_manipulation.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/05-codesignal-gca/4-q2-gca-data-manipulation.js) | `python amalitech-prep/practice/gca_q2_data_manipulation.py`<br>`node the-gym-prep/05-codesignal-gca/4-q2-gca-data-manipulation.js` |
| **Level 8: GCA Q3 Simulation** | [gca_q3_implementation.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/gca_q3_implementation.py) | [gca_q3_implementation.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/05-codesignal-gca/6-q3-gca-implementation.js) | `python amalitech-prep/practice/gca_q3_implementation.py`<br>`node the-gym-prep/05-codesignal-gca/6-q3-gca-implementation.js` |
| **Level 9: GCA Q4 Algorithms** | [gca_q4_problem_solving.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/gca_q4_problem_solving.py) | [gca_q4_problem_solving.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/05-codesignal-gca/8-q4-gca-problem-solving.js) | `python amalitech-prep/practice/gca_q4_problem_solving.py`<br>`node the-gym-prep/05-codesignal-gca/8-q4-gca-problem-solving.js` |

---

## 4. 4-Week Dual-Track Study Calendar

### Week 1: Foundation & Muscle Memory
- **Python (Morning):**
  - Read: `amalitech-prep/01-python-essentials.md` & `amalitech-prep/01b-loops-guide.md`
  - Practice: `amalitech-prep/practice/drills_common_mistakes.py` (Sections A–D)
  - Target: Master `%`, `//`, `sum()`, `min()`, `max()`.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/01-foundations/1-lesson-javascript-essentials.md` & `the-gym-prep/01-foundations/5-lesson-loops-and-functions.md`
  - Practice: `the-gym-prep/01-foundations/4-drills-common-mistakes.js` & `the-gym-prep/01-foundations/2-drills-js-basics.js`
  - CodeWars: Solve Kata 1 (*Multiply*), Kata 2 (*Even or Odd*), Kata 3 (*Opposite*).

### Week 2: Sequences, Strings & CodeWars Katas
- **Python (Morning):**
  - Read: `amalitech-prep/02-strings-and-lists.md`
  - Practice: `amalitech-prep/practice/drills_strings_lists.py` (Sections A–E)
  - Target: Slicing `[start:stop:step]`, `.split()`, `"".join()`.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/02-strings-and-arrays/1-lesson-strings-and-arrays.md` & `the-gym-prep/06-the-gym-interview/2-codewars-kata-playbook.md`
  - Practice: `the-gym-prep/02-strings-and-arrays/2-drills-strings-arrays.js`
  - CodeWars: Complete `the-gym-prep/06-the-gym-interview/3-codewars-practice.js` (Katas 4 through 8).

### Week 3: Dictionaries, Objects & 2D Grids
- **Python (Morning):**
  - Read: `amalitech-prep/03-dictionaries-and-sets.md` & `amalitech-prep/04-matrices-and-simulation.md`
  - Practice: `amalitech-prep/practice/drills_dicts_sets.py` & `amalitech-prep/practice/drills_grids.py`
  - Target: Hash map tallies, $O(1)$ lookups, 2D matrix coordinate navigation.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/03-objects-maps-sets/1-lesson-objects-and-data-structures.md` & `the-gym-prep/06-the-gym-interview/4-interview-theory-qa.md`
  - Practice: `the-gym-prep/03-objects-maps-sets/3-drills-dicts-sets.js` & `the-gym-prep/04-patterns/2-drills-grids.js`
  - Video Prep: Read and rehearse `the-gym-prep/06-the-gym-interview/1-application-video-script.md`.

### Week 4: Timed Mocks & Final Polish
- **Python (Morning):**
  - Read: `amalitech-prep/05-algorithm-patterns.md`, `amalitech-prep/10-my-common-mistakes.md`, `amalitech-prep/08-cheat-sheet.md`
  - Practice: `amalitech-prep/practice/gca_q2_data_manipulation.py` & `amalitech-prep/06-mock-test.md`
  - Target: Complete 3 out of 4 problems in under 60 minutes.
- **JavaScript (Evening):**
  - Read: `the-gym-prep/reference/cheat-sheet.md` & `the-gym-prep/00-start-here/2-my-common-js-mistakes.md`
  - Practice: `the-gym-prep/05-codesignal-gca/4-q2-gca-data-manipulation.js` & `the-gym-prep/06-the-gym-interview/6-mock-interview-test.js`
  - Application: Record video, copy CodeWars profile link, and submit The Gym application form!

---

## 5. Daily Study Routine (Pure Coding Focus — 2.5 to 3 Hours per Day)

### Morning Session: Python Track (AmaliTech) — 75 to 90 Minutes (100% Coding)
1. **Warmup Drills (20 min):** Solve 5 to 10 drills in [drills_strings_lists.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/drills_strings_lists.py) or [drills_dicts_sets.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/drills_dicts_sets.py). Run `python <file>` to test immediately.
2. **GCA Coding Challenges (50 min):** Solve 1 or 2 full questions from [gca_q1_basic.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/gca_q1_basic.py), [gca_q2_data_manipulation.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/gca_q2_data_manipulation.py), or [gca_q3_implementation.py](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/practice/gca_q3_implementation.py). Trace on paper first!
3. **Bug Check (10 min):** Check edge cases (empty list, single element, negative numbers) against [10-my-common-mistakes.md](file:///c:/Users/user/Documents/AmaliTech-Prep/amalitech-prep/10-my-common-mistakes.md).

### Evening Session: JavaScript Track (The Gym) — 75 to 90 Minutes (100% Coding)
1. **Mirror Coding Drills (35 min):** Open the JavaScript twin file of your morning session: [drills_strings_arrays.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/02-strings-and-arrays/2-drills-strings-arrays.js) or [drills_dicts_sets.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/03-objects-maps-sets/3-drills-dicts-sets.js). Implement functions and run `node <file>` to see green passes.
2. **CodeWars Katas & GCA JS Practice (45 min):** Solve 2 to 3 real challenges from [gca_q1_basic.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/05-codesignal-gca/2-q1-gca-basic.js), [gca_q2_data_manipulation.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/05-codesignal-gca/4-q2-gca-data-manipulation.js), or directly on [codewars.com](https://www.codewars.com/).
3. **Light Theory Check (5 min):** Quickly glance at 1 question in [the-gym-prep/06-the-gym-interview/4-interview-theory-qa.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/06-the-gym-interview/4-interview-theory-qa.md). Keep spoken practice to 5 minutes so maximum energy is reserved for code.

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

