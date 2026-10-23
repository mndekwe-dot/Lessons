# The Gym Rwanda — JavaScript Preparation Course

A comprehensive, beginner-friendly preparation course designed specifically for applicants to **The Gym Rwanda**.

This course mirrors the structure and rigor of your Python preparation while matching the exact requirements of The Gym's selection process:
1. **JavaScript Fundamentals** (aligned with the Udacity *Intro to JavaScript* [ud803] curriculum).
2. **Technical Interview Theory** (spoken questions about how JavaScript works under the hood).
3. **Live Coding Challenge** (solving algorithm challenges similar to [CodeWars](https://www.codewars.com/) 8 kyu and 7 kyu katas).
4. **Python-to-JavaScript Translation Bridges** (since you already know Python, every concept shows how your Python knowledge translates into JavaScript).

---

## The Selection Process at The Gym

The selection process has two stages:

### Stage 1: The Application Form
You will submit an application form requiring:
1. **A short video of yourself:** Verifying your English proficiency and communication skills (see [`08-application-video-script.md`](08-application-video-script.md) for word-for-word script).
2. **Your CodeWars profile link:** Showcasing that you have solved simple algorithm challenges.
3. **Personal background:** Why you want to join and your commitment to the 20–25 hours/week schedule.

### Stage 2: The Assessment (Two Interviews)
1. **The Technical Interview:**
   - **Theoretical questions** on JavaScript Fundamentals (see [`05-interview-theory-qa.md`](05-interview-theory-qa.md)).
   - **A live coding challenge** solved in real time in front of the interviewer (see [`06-codewars-kata-playbook.md`](06-codewars-kata-playbook.md) & [`12-mock-interview-simulation.md`](12-mock-interview-simulation.md)).
2. **The Personal Interview:**
   - Assessing motivation, mindset, teamwork, and spoken English communication.

---

## Course Navigation

| # | File | Topic | What you learn |
|---|---|---|---|
| 01 | [`01-javascript-essentials.md`](01-javascript-essentials.md) | Basics & Types | Variables (`let`/`const`), primitive types, operators, `if`/`else`, truthy/falsy, `===` vs `==`. |
| 02 | [`02-loops-and-functions.md`](02-loops-and-functions.md) | Control Flow & Functions | `for`, `while`, `for...of`, regular functions, arrow functions (`=>`), scope, and closures. |
| 03 | [`03-strings-and-arrays.md`](03-strings-and-arrays.md) | Sequences & Methods | String methods, array methods (`push`, `pop`, `shift`, `unshift`, `slice`, `splice`, `map`, `filter`, `reduce`). |
| 04 | [`04-objects-and-data-structures.md`](04-objects-and-data-structures.md) | Objects & References | Object literals, dot vs bracket notation, `Object.keys`, value vs reference, Sets and Maps. |
| 05 | [`05-interview-theory-qa.md`](05-interview-theory-qa.md) | Spoken Theory Q&A | The top theoretical interview questions with model spoken English answers. |
| 06 | [`06-codewars-kata-playbook.md`](06-codewars-kata-playbook.md) | Live Coding Playbook | The 5 core Kata patterns and 10 real Codewars katas solved step-by-step. |
| 07 | [`07-udacity-ud803-summary.md`](07-udacity-ud803-summary.md) | Udacity ud803 Notes | Complete summary of all Udacity lessons and quizzes in case of login issues. |
| 08 | [`08-application-video-script.md`](08-application-video-script.md) | Video & Profile Guide | Spoken English video script, recording tips, and CodeWars profile setup checklist. |
| 09 | [`09-javascript-cheat-sheet.md`](09-javascript-cheat-sheet.md) | Quick Cheat Sheet | 1-page quick syntax reference for last-minute review. |
| 10 | [`10-my-common-js-mistakes.md`](10-my-common-js-mistakes.md) | Common JS Mistakes | The 10 traps that fail interviews (`sort()` on numbers, `==` vs `===`, mutating references). |
| 11 | [`11-javascript-glossary.md`](11-javascript-glossary.md) | Terminology Glossary | Clear definitions of all technical jargon (closures, hoisting, coercion, callbacks). |
| 12 | [`12-mock-interview-simulation.md`](12-mock-interview-simulation.md) | Mock Interview Test | 45-minute timed simulation with theory questions, coding challenges, and scoring rubric. |

---

## Interactive Practice Drills (1-to-1 Parity with Python)

Every single assignment and drill in Python has an exact counterpart in JavaScript. Run these drills directly in your terminal using Node.js:

| JavaScript Practice File | Matching Python File | Focus | Command to Run |
|---|---|---|---|
| [`practice/drills_common_mistakes.js`](practice/drills_common_mistakes.js) | `practice/drills_common_mistakes.py` | Variables, types, scope, equality | `node the-gym-prep/practice/drills_common_mistakes.js` |
| [`practice/drills_strings_arrays.js`](practice/drills_strings_arrays.js) | `practice/drills_strings_lists.py` | Slicing, splitting, joining, reversing | `node the-gym-prep/practice/drills_strings_arrays.js` |
| [`practice/drills_dicts_sets.js`](practice/drills_dicts_sets.js) | `practice/drills_dicts_sets.py` | Tally sheets, key lookups, unique sets | `node the-gym-prep/practice/drills_dicts_sets.js` |
| [`practice/drills_grids.js`](practice/drills_grids.js) | `practice/drills_grids.py` | 2D matrices, directions, neighbor cells | `node the-gym-prep/practice/drills_grids.js` |
| [`practice/q1_warmups.js`](practice/q1_warmups.js) | `practice/q1_warmups.py` | Basic warmups (century, leap year, digits) | `node the-gym-prep/practice/q1_warmups.js` |
| [`practice/gca_q1_basic.js`](practice/gca_q1_basic.js) | `practice/gca_q1_basic.py` | GCA Q1 basic problems | `node the-gym-prep/practice/gca_q1_basic.js` |
| [`practice/gca_q2_data_manipulation.js`](practice/gca_q2_data_manipulation.js) | `practice/gca_q2_data_manipulation.py` | GCA Q2 string & list algorithms | `node the-gym-prep/practice/gca_q2_data_manipulation.js` |
| [`practice/gca_q3_implementation.js`](practice/gca_q3_implementation.js) | `practice/gca_q3_implementation.py` | GCA Q3 grid & simulation problems | `node the-gym-prep/practice/gca_q3_implementation.js` |
| [`practice/gca_q4_problem_solving.js`](practice/gca_q4_problem_solving.js) | `practice/gca_q4_problem_solving.py` | GCA Q4 optimal algorithms & hash maps | `node the-gym-prep/practice/gca_q4_problem_solving.js` |
| [`practice/codewars_practice.js`](practice/codewars_practice.js) | Codewars 8/7 kyu | 10 classic Codewars algorithm katas | `node the-gym-prep/practice/codewars_practice.js` |
| [`practice/mock_interview_test.js`](practice/mock_interview_test.js) | Timed Assessment | Timed coding challenge for live technical interviews | `node the-gym-prep/practice/mock_interview_test.js` |
| [`practice/solutions/solutions_drills_explained.md`](practice/solutions/solutions_drills_explained.md) | Solutions & Notes | Complete solution code with explanations | Reference when stuck |

---

## Quick Reference: Python to JavaScript Cheat Sheet

Since you already know Python, keep this table handy:

| Concept | Python | JavaScript |
|---|---|---|
| **Print to screen** | `print("hello")` | `console.log("hello");` |
| **Variable (can change)** | `x = 5` | `let x = 5;` |
| **Constant (cannot change)** | `PI = 3.14` | `const PI = 3.14;` |
| **Function** | `def add(a, b): return a + b` | `function add(a, b) { return a + b; }` |
| **Arrow Function** | `lambda a, b: a + b` | `const add = (a, b) => a + b;` |
| **If / Else** | `if x > 0: ... elif x < 0: ... else: ...` | `if (x > 0) { ... } else if (x < 0) { ... } else { ... }` |
| **Strict Equality** | `x == y` | `x === y` (always use triple equals!) |
| **Logical AND / OR** | `x and y`, `x or y` | `x && y`, `x \|\| y` |
| **Logical NOT** | `not x` | `!x` |
| **Length** | `len(items)` | `items.length` (property, no parentheses!) |
| **List / Array** | `[1, 2, 3]` | `[1, 2, 3]` |
| **Dictionary / Object** | `{"name": "Ama"}` | `{ name: "Ama" }` |
| **Append to list** | `items.append(x)` | `items.push(x)` |
| **String template** | `f"Hello {name}"` | `` `Hello ${name}` `` (backticks!) |
| **Integer division** | `7 // 2` (gives 3) | `Math.floor(7 / 2)` (gives 3) |
| **Modulo (remainder)** | `7 % 2` (gives 1) | `7 % 2` (gives 1) |
