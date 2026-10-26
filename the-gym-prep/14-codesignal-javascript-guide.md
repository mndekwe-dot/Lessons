# 14 — CodeSignal GCA in JavaScript (AmaliTech Assessment Guide)

How to conquer the **AmaliTech CodeSignal General Coding Assessment (GCA)** using **JavaScript**.

CodeSignal natively supports JavaScript (Node.js). Taking the assessment in JavaScript allows you to focus 100% of your energy on a single language for both **AmaliTech** and **The Gym Rwanda**, eliminating syntax confusion and doubling your practice efficiency.

---

## Table of Contents
1. [The CodeSignal GCA Structure](#1-the-codesignal-gca-structure)
2. [The 70-Minute Battle Plan](#2-the-70-minute-battle-plan)
3. [The 4 Question Types & JavaScript Weapons](#3-the-4-question-types--javascript-weapons)
   - [Question 1: Warmup & Basic Operations](#question-1-warmup--basic-operations)
   - [Question 2: Data Manipulation (Strings & Arrays)](#question-2-data-manipulation-strings--arrays)
   - [Question 3: 2D Grids, Matrices & Simulations](#question-3-2d-grids-matrices--simulations)
   - [Question 4: Algorithmic Optimization & Hash Maps](#question-4-algorithmic-optimization--hash-maps)
4. [Essential JavaScript Syntax for CodeSignal](#4-essential-javascript-syntax-for-codesignal)
5. [Practice File Directory](#5-practice-file-directory)

---

## 1. The CodeSignal GCA Structure

| Metric | Details |
|---|---|
| **Total Time** | 70 minutes |
| **Questions** | 4 coding challenges |
| **Score Scale** | 300 to 850 points |
| **Target Score** | **700+** (Passing benchmark for top tech roles) |
| **Environment** | Web IDE running Node.js. Auto-graded against public and hidden test cases. |

---

## 2. The 70-Minute Battle Plan

Do not solve questions strictly from 1 to 4! Use the proven **Order of Attack**:

```
[ Minutes 00 - 10 ]  ──► Solve Q1 (Easy warmup — lock in 100% points)
[ Minutes 10 - 25 ]  ──► Solve Q2 (String/Array data manipulation)
[ Minutes 25 - 30 ]  ──► Scan BOTH Q3 and Q4
                         - If Q4 looks like a Hash Map / Tally problem, DO Q4 FIRST!
                         - If Q3 is a straightforward simulation, DO Q3 FIRST!
[ Minutes 30 - 55 ]  ──► Solve your chosen 3rd problem (Q4 or Q3)
[ Minutes 55 - 70 ]  ──► Attempt the final problem (Partial points count toward 700+!)
```

> [!TIP]
> **Partial solutions earn real points!** If your solution passes 15 out of 20 tests before time runs out, CodeSignal still awards points for those 15 passed tests. Never leave a problem blank.

---

## 3. The 4 Question Types & JavaScript Weapons

---

### Question 1: Warmup & Basic Operations
- **What it tests:** Basic math, simple conditions (`if/else`), integer division, and 1-line logic.
- **Time Target:** 5 to 10 minutes.
- **Example Problems:** Century from year, leap year check, opposite number, adding numbers.

#### JavaScript Weapons for Q1:
```javascript
// Integer division (Like Python a // b):
const quotient = Math.floor(a / b);

// Ternary one-liner:
const result = score >= 50 ? "PASS" : "FAIL";

// String template:
const greeting = `Hello, ${name}!`;
```

*Practice File:* [`practice/gca_q1_basic.js`](practice/gca_q1_basic.js) and [`practice/q1_warmups.js`](practice/q1_warmups.js)

---

### Question 2: Data Manipulation (Strings & Arrays)
- **What it tests:** Reversing strings, extracting words, filtering lists, tracking indices.
- **Time Target:** 10 to 15 minutes.
- **Example Problems:** Palindrome check, alternating sums, removing duplicates, rearranging arrays.

#### JavaScript Weapons for Q2:
```javascript
// 1. Reverse a string:
const reversed = str.split("").reverse().join("");

// 2. ASCII character codes (Like Python ord() and chr()):
const code = str.charCodeAt(0);          // ord('a') -> 97
const char = String.fromCharCode(code);  // chr(97)  -> 'a'

// 3. Substring / Slicing:
const piece = str.slice(1, 4); // Index 1 up to (not including) 4

// 4. Filtering & Mapping:
const evens = arr.filter(x => x % 2 === 0);
const doubled = arr.map(x => x * 2);
```

*Practice File:* [`practice/gca_q2_data_manipulation.js`](practice/gca_q2_data_manipulation.js) and [`practice/drills_strings_arrays.js`](practice/drills_strings_arrays.js)

---

### Question 3: 2D Grids, Matrices & Simulations
- **What it tests:** Nested loops, traversing rows and columns, simulating game boards (Tetris, Minesweeper, falling blocks).
- **Time Target:** 20 to 25 minutes.
- **Key Skill:** Matrix coordinates `matrix[row][col]`.

#### JavaScript Weapons for Q3:
```javascript
// 1. Matrix Dimensions:
const R = matrix.length;       // Number of rows
const C = matrix[0].length;    // Number of columns

// 2. Creating a blank R x C matrix filled with 0s:
const grid = Array.from({ length: R }, () => Array(C).fill(0));

// 3. Safe Boundary Check (Never fall off the grid!):
function isValid(r, c, R, C) {
  return r >= 0 && r < R && c >= 0 && c < C;
}

// 4. The 4-Direction Vectors (Up, Down, Left, Right):
const DIRS = [
  [-1, 0], // Up
  [1, 0],  // Down
  [0, -1], // Left
  [0, 1]   // Right
];

// Check all 4 neighbors of (r, c):
for (const [dr, dc] of DIRS) {
  const nr = r + dr;
  const nc = c + dc;
  if (isValid(nr, nc, R, C)) {
    // Visit neighbor matrix[nr][nc]
  }
}
```

*Practice File:* [`practice/gca_q3_implementation.js`](practice/gca_q3_implementation.js) and [`practice/drills_grids.js`](practice/drills_grids.js)

---

### Question 4: Algorithmic Optimization & Hash Maps
- **What it tests:** Solving problems in $O(N)$ or $O(N \log N)$ time to avoid "Time Limit Exceeded".
- **Time Target:** 15 to 20 minutes.
- **Patterns:** Frequency Tally Object, Two Pointers, Prefix Sum, Sliding Window.

#### JavaScript Weapons for Q4:

#### Weapon A: The Frequency Tally Object ($O(N)$ Lookup)
```javascript
function countFrequencies(arr) {
  const tally = {};
  for (const item of arr) {
    tally[item] = (tally[item] || 0) + 1;
  }
  return tally;
}
```

#### Weapon B: The Two-Sum Complement Pattern ($O(N)$)
```javascript
function hasPairWithSum(arr, target) {
  const seen = new Set();
  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement)) {
      return true; // Found pair!
    }
    seen.add(num);
  }
  return false;
}
```

#### Weapon C: Prefix Sum (Fast Range Totals)
```javascript
// Build running cumulative sums:
function buildPrefixSum(arr) {
  const prefix = [0];
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i]);
  }
  return prefix;
}
// Sum from index L to R is simply: prefix[R + 1] - prefix[L] (O(1) time!)
```

*Practice File:* [`practice/gca_q4_problem_solving.js`](practice/gca_q4_problem_solving.js) and [`practice/drills_dicts_sets.js`](practice/drills_dicts_sets.js)

---

## 4. Essential JavaScript Syntax for CodeSignal

| What You Need | How to Write It in JavaScript | Watch Out For! |
|---|---|---|
| **Sort numbers** | `nums.sort((a, b) => a - b)` | `nums.sort()` sorts as strings! Must pass `(a, b) => a - b`. |
| **Integer division** | `Math.floor(a / b)` | `//` is a comment in JS, not division! |
| **Array length** | `arr.length` | No parentheses! (`len(arr)` does not exist). |
| **Lookup in Set** | `mySet.has(x)` | Use `has()`, not `includes()`. |
| **Add to Set** | `mySet.add(x)` | Use `add()`, not `push()`. |
| **Convert Set to Array** | `[...mySet]` | Spread operator turns Set into Array. |
| **Unique values** | `[...new Set(arr)]` | Quickest way to deduplicate an array. |

---

## 5. Practice File Directory

Run each practice file with Node.js to prepare for the assessment:

```bash
# 1. Warmups (Q1):
node the-gym-prep/practice/q1_warmups.js
node the-gym-prep/practice/gca_q1_basic.js

# 2. Strings & Arrays (Q2):
node the-gym-prep/practice/gca_q2_data_manipulation.js
node the-gym-prep/practice/drills_strings_arrays.js

# 3. 2D Grids & Simulations (Q3):
node the-gym-prep/practice/gca_q3_implementation.js
node the-gym-prep/practice/drills_grids.js

# 4. Hash Maps & Optimization (Q4):
node the-gym-prep/practice/gca_q4_problem_solving.js
node the-gym-prep/practice/drills_dicts_sets.js
```

