# 10 — Common JavaScript Mistakes (Check This Before Submitting Any Kata)

These are the most frequent bugs that cause candidates to fail the technical interview and CodeWars challenges. Read this checklist before you submit your code.

---

## ⚠️ MISTAKE 1: `nums.sort()` sorts numbers like strings! ⚠️

```javascript
const nums = [10, 5, 20, 1];
nums.sort();
console.log(nums); // [1, 10, 20, 5]  <-- WRONG! "10" comes before "5" in the dictionary!
```

**The Rule:** In JavaScript, `.sort()` converts numbers to strings by default.
You **must** always pass a comparator function:
```javascript
nums.sort((a, b) => a - b); // [1, 5, 10, 20]  <-- CORRECT (Ascending)
nums.sort((a, b) => b - a); // [20, 10, 5, 1]  <-- CORRECT (Descending)
```

---

## ⚠️ MISTAKE 2: Forgetting `return` in a function ⚠️

In CodeWars, tests do not check what appears on your screen. They check what your function **returns**:

```javascript
// WRONG:
function add(a, b) {
  console.log(a + b); // Prints 7, but returns undefined! (Test FAILS)
}

// CORRECT:
function add(a, b) {
  return a + b; // Returns 7! (Test PASSES)
}
```

**With Arrow functions:** If you use curly braces `{ ... }`, you MUST write `return`:
```javascript
const double = x => { x * 2; };     // Returns undefined!
const double = x => { return x * 2; }; // Correct
const double = x => x * 2;            // Also correct (implicit return)
```

---

## ⚠️ MISTAKE 3: Using `==` instead of `===` ⚠️

Loose equality `==` does hidden type conversions behind your back:
```javascript
false == 0;      // true!
"" == 0;         // true!
null == undefined; // true!
```
**The Rule:** Always type three equals `===`. It guarantees both value and type match.

---

## ⚠️ MISTAKE 4: Typing `arr.length()` with parentheses ⚠️

In Python you write `len(arr)`.
In Java or other languages you might write `size()`.
In JavaScript, **`length` is a property, NOT a method**:

```javascript
const arr = [1, 2, 3];
console.log(arr.length()); // CRASH! TypeError: arr.length is not a function
console.log(arr.length);   // 3 (CORRECT, no parentheses!)
```

---

## ⚠️ MISTAKE 5: String concatenation with `+` ⚠️

If one side is a string, `+` turns everything into a string:
```javascript
const a = "5";
const b = 2;
console.log(a + b); // "52" (Glued together!)
```
**The Rule:** Always wrap variables in `Number(...)` before adding:
```javascript
console.log(Number(a) + b); // 7 (CORRECT)
```

---

## ⚠️ MISTAKE 6: Returning from inside a `.forEach()` loop ⚠️

If you write `return` inside a `.forEach()`, it only returns from the tiny inner callback — it does **NOT** exit your main outer function:

```javascript
// WRONG:
function containsZero(nums) {
  nums.forEach(n => {
    if (n === 0) return true; // Does NOT exit containsZero! Just skips to next turn!
  });
  return false; // Always returns false!
}

// CORRECT: Use a standard for...of loop when you need to return early:
function containsZero(nums) {
  for (const n of nums) {
    if (n === 0) return true; // Exits the whole function immediately!
  }
  return false;
}
```

---

## ⚠️ MISTAKE 7: Modifying an Array Reference by Accident ⚠️

In JavaScript, objects and arrays are copied by reference:
```javascript
const original = [1, 2, 3];
const copy = original; // Points to the EXACT SAME memory!
copy.push(4);

console.log(original); // [1, 2, 3, 4]  <-- Original was mutated!
```
**The Rule:** Make an independent shallow clone using the spread operator `[...original]`:
```javascript
const safeCopy = [...original];
safeCopy.push(4);
console.log(original); // [1, 2, 3] (Original is safe!)
```

---

## ⚠️ MISTAKE 8: Using `for...in` instead of `for...of` on Arrays ⚠️

```javascript
const fruits = ["apple", "banana", "orange"];

for (const x in fruits) {
  console.log(x); // Prints "0", "1", "2" (the INDICES as strings!)
}

for (const x of fruits) {
  console.log(x); // Prints "apple", "banana", "orange" (the VALUES!)
}
```
**The Rule:** Use `for...of` for array values. Use `for...in` only for object keys.

---

## ⚠️ MISTAKE 9: Capitalizing `True` or `False` ⚠️

Python uses `True` and `False`.
JavaScript booleans are **strictly lowercase**: `true`, `false`.
Writing `True` causes a `ReferenceError: True is not defined`.

---

## ⚠️ MISTAKE 10: Integer Division using `//` ⚠️

In Python, `7 // 2` is integer division (3).
In JavaScript, `//` starts a code comment!
```javascript
const x = 7 // 2;  <- This just means x = 7, with a comment "// 2"!
```
**The Rule:** Always use `Math.floor()` for integer division in JavaScript:
```javascript
const x = Math.floor(7 / 2); // 3 (CORRECT)
```

---

## ⚠️ MISTAKE 11: Declaring the Container or Returning Inside the Loop ⚠️

```javascript
// WRONG:
function doubleAll(arr) {
  for (const num of arr) {
    const result = [];    // Wiped clean on every iteration!
    result.push(num * 2);
    return result;        // Stops on the very first round!
  }
}

// CORRECT:
function doubleAll(arr) {
  const result = []; // 1. Built once BEFORE the loop

  for (const num of arr) {
    result.push(num * 2); // 2. Collects on each lap
  }

  return result; // 3. Returned AFTER the loop finishes
}
```
**The Rule:** Your container (`let total = 0` or `const result = []`) must be created **before** the loop. Your `return` statement must be placed **after** the loop closing brace `}`.

---

## ⚠️ MISTAKE 12: Loop Boundaries — Using `<=` instead of `<` ⚠️

```javascript
// WRONG:
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]); // On the last turn, arr[arr.length] is undefined!
}

// CORRECT:
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // Safely visits indexes 0 up to length - 1
}
```

### The Bus Seat Analogy
If a bus has **3 seats** (`arr.length === 3`), seats are numbered `0, 1, 2`.  
**Seat 3 does not exist!**  
- `i < 3` visits `0, 1, 2` ✅
- `i <= 3` visits `0, 1, 2, 3` ❌ (Seat 3 is `undefined`, causing `NaN` or crashes).

### When to Use `arr.length - 1` vs `arr.length + 1`

| Header | When to Use | Why |
|---|---|---|
| `i < arr.length` | **Normal loop (every element)** | Standard forward traversal. Runs from `0` to `length - 1`. |
| `i < arr.length - 1` | **Comparing neighbors (`arr[i + 1]`)** | Stops 1 index early so `arr[i + 1]` never falls off the edge into `undefined`. |
| `i = arr.length - 1; i >= 0; i--` | **Backwards loop** | Starts at the last valid index and walks down to index `0`. |
| `arr[arr.length - 1]` | **Accessing last item (Python `arr[-1]`)** | Direct lookup of the last item in the array. |
| `arr.length + 1` | **NEVER in loops!** | Goes past the end of the array into empty space (`undefined`). |

---

## ⚠️ MISTAKE 13: Numbers Do NOT Have `.length` ⚠️

```javascript
// WRONG:
let n = 1234;
while (n.length > 0) { ... } // 1234.length is undefined! undefined > 0 is false!

// CORRECT:
while (n > 0) { ... }        // For math / numbers, check if n > 0!
```
**The Rule:** Only arrays and strings have `.length`. For raw numbers, check `while (n > 0)`. If you must count digits with length, convert to string first: `String(n).length`.

---

## ⚠️ MISTAKE 14: Pushing the Index `i` Instead of the Item `arr[i]` ⚠️

```javascript
// WRONG:
for (let i = 0; i < arr.length; i += 2) {
  result.push(i);      // Pushes 0, 2, 4 (the index numbers!)
}

// CORRECT:
for (let i = 0; i < arr.length; i += 2) {
  result.push(arr[i]); // Pushes "a", "c", "e" (the actual data!)
}
```
**The Rule:** `i` is the seat number; `arr[i]` is the person in the seat. When collecting items from an array, push `arr[i]`.

---

## ⚠️ MISTAKE 15: Starting `.reduce()` with `0` for Multiplication ⚠️

```javascript
// WRONG:
arr.reduce((acc, x) => acc * x, 0); // 0 * x = 0! Result is ALWAYS 0!

// CORRECT:
arr.reduce((acc, x) => acc * x, 1); // 1 * x = x! (Or omit 1 to use arr[0])
```
**The Rule:** For sums, start with `0` ($0 + x = x$). For products, start with `1` ($1 \times x = x$).

---

## ⚠️ MISTAKE 16: Object Keys Without Quotes in Brackets ⚠️

```javascript
// WRONG:
items[inStock];   // ReferenceError: inStock is not defined (looks for variable inStock)

// CORRECT:
items.inStock;     // Dot notation (cleanest!)
items["inStock"];  // Bracket notation requires string quotes!
```
**The Rule:** Use dot notation `item.prop` by default. Only use brackets without quotes if the key is stored inside a variable: `const key = "inStock"; item[key]`.

---

## ⚠️ MISTAKE 17: Forgetting `i++` or the Update Step (Infinite Loop) ⚠️

```javascript
// WRONG:
for (let i = 0; i < arr.length;) { ... } // i never increments -> hangs forever!
while (n > 0) { const digit = n % 10; }   // n is never chopped -> hangs forever!

// CORRECT:
for (let i = 0; i < arr.length; i++) { ... }
while (n > 0) { n = Math.floor(n / 10); }
```
**The Rule:** Every loop must have an engine step that changes the counter or condition variable toward the finish line on every lap.

---

## ⚠️ MISTAKE 18: Inverting the `while` Condition (Thinking "Until" Instead of "While") ⚠️

```javascript
// WRONG (Thinking in English: "Keep going until balance reaches threshold"):
while (balance > threshold) { ... } // If balance starts smaller, condition is false immediately!

// CORRECT (Code logic: "Keep going as long as balance is STILL UNDER threshold"):
while (balance < threshold) { ... }
```
**The Rule:** `while` runs when the condition is **TRUE**, not when it is false. Ask: *"Under what condition should this loop keep running?"*

---

## ⚠️ MISTAKE 19: Putting the Container Outside the Function (The 3 Zones Rule) ⚠️

When you hear *"Put `const list = []` outside the loop"*, do NOT put it outside the **function**!

```javascript
// ❌ ZONE 1: OUTSIDE THE FUNCTION (Wrong!)
// Why it fails: When CodeWars/CodeSignal runs Test 2, old items from Test 1 are still inside list!
let list = [];

function solve(nums) {
  // ✅ ZONE 2: INSIDE THE FUNCTION, BEFORE THE LOOP (100% Correct!)
  // Every function call gets a brand-new, clean empty array.
  const list = [];

  for (const num of nums) {
    // ❌ ZONE 3: INSIDE THE LOOP (Wrong!)
    // Wipes the array clean on every single turn of the loop!
    const list = [];
  }

  return list;
}
```
**The Rule:** Always place your container (`const list = []` or `let total = 0`) on **Line 1 inside the function**, right above your `for` or `while` loop.

---

## ⚠️ MISTAKE 20: Reordering Items — Nested `if` Traps & The "1 Bag vs. 2 Bags" Rule ⚠️

### Trap A: Nesting Opposites Inside Each Other
```javascript
// WRONG:
if (num !== 0) {
  list.push(num);
  if (num === 0) { // <-- IMPOSSIBLE! A number inside (num !== 0) can never be 0!
    list.push(num);
  }
}
```

### Trap B: Why Rearranging Groups Needs Either 2 Loops OR 2 Bags
If you want to move all `0`s to the end (`[0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0]`):
- A loop walks from left to right. If you only have **1 bag** (`list`) and **1 loop**, pushing `0` when you see it puts `0` at the **front**, not the back!

You have two clean choices:

#### Option 1: 1 Bag + 2 Separate Loops (Two Walks)
```javascript
function moveZerosToEnd(nums) {
  const list = []; // 1 Bag

  // Walk 1: Pick up ONLY non-zeros -> [1, 3, 12]
  for (const num of nums) {
    if (num !== 0) list.push(num);
  }

  // Walk 2 (AFTER Walk 1 finishes): Pick up ONLY zeros -> [1, 3, 12, 0, 0]
  for (const num of nums) {
    if (num === 0) list.push(num);
  }

  return list;
}
```

#### Option 2: 2 Bags + 1 Loop (Sort on the Spot, Join at the End)
```javascript
function moveZerosToEnd(nums) {
  const nonZeros = []; // Bag 1
  const zeros = [];    // Bag 2

  for (const num of nums) {
    if (num !== 0) {
      nonZeros.push(num);
    } else {
      zeros.push(num);
    }
  }

  return nonZeros.concat(zeros); // Glue Bag 1 + Bag 2 at the end!
}
```
**The Rule:**
- **1 Bag** requires **2 Loops** (finish collecting Group 1 first, then start a second loop for Group 2).
- **2 Bags** requires **1 Loop** (put Group 1 in Bag A, Group 2 in Bag B, then `.concat()` them at the end).




