# 03 — Strings and Arrays

Strings and Arrays appear in **almost every single CodeWars kata and coding assessment**.
Mastering these methods is your direct path to passing the technical interview at The Gym.

---

## Table of Contents
1. [Strings: Indexing, Length and Template Literals](#1-strings-indexing-length-and-template-literals)
2. [Essential String Methods](#2-essential-string-methods)
3. [Arrays: Indexing and Basic Methods](#3-arrays-indexing-and-basic-methods)
4. [Adding and Removing Items: push, pop, shift, unshift](#4-adding-and-removing-items-push-pop-shift-unshift)
5. [Slice vs Splice](#5-slice-vs-splice)
6. [The Three Powerhouse Array Methods: map, filter, reduce](#6-the-three-powerhouse-array-methods-map-filter-reduce)
7. [The Famous JavaScript Sorting Trap (Must Know!)](#7-the-famous-javascript-sorting-trap-must-know)
8. [Classic CodeWars Patterns](#8-classic-codewars-patterns)

---

## 1. Strings: Indexing, Length and Template Literals

In JavaScript, strings are ordered sequences of characters. Like Python, positions start at **index 0**.

```javascript
// Purpose: string indexing and length
const city = "Kigali";

console.log(city[0]);       // "K" (First character)
console.log(city[city.length - 1]); // "i" (Last character)
console.log(city.at(-1));   // "i" (Modern JS support for negative indices!)
console.log(city.length);   // 6   (Length property — NO parentheses!)
```

### Template Literals (Like Python's f-strings):
In Python you write: `f"Hello {name}, you have {score} points"`
In JavaScript, use **backticks (`` ` ``)** and **`${expression}`**:

```javascript
// Purpose: string formatting using template literals
const name = "Amina";
const score = 95;

const message = `Hello ${name}, you scored ${score}% on the exam!`;
console.log(message);
// Output: "Hello Amina, you scored 95% on the exam!"
```

---

## 2. Essential String Methods

| Method | What it does | Example | Result |
|---|---|---|---|
| `str.toLowerCase()` | Converts all to lowercase | `"HI".toLowerCase()` | `"hi"` |
| `str.toUpperCase()` | Converts all to uppercase | `"hi".toUpperCase()` | `"HI"` |
| `str.trim()` | Strips spaces from ends | `"  hi  ".trim()` | `"hi"` |
| `str.slice(start, end)` | Cuts slice from start up to (not including) end | `"hello".slice(1, 4)` | `"ell"` |
| `str.includes(sub)` | Checks if substring exists (like Python `sub in str`) | `"banana".includes("nan")` | `true` |
| `str.indexOf(sub)` | Finds index of first match (or -1 if missing) | `"banana".indexOf("a")` | `1` |
| `str.replace(old, new)` | Replaces first occurrence | `"banana".replace("a", "o")` | `"bonana"` |
| `str.replaceAll(old, new)` | Replaces all occurrences | `"banana".replaceAll("a", "o")` | `"bonono"` |
| `str.split(delimiter)` | Splits string into array (like Python `.split()`) | `"a,b,c".split(",")` | `["a", "b", "c"]` |
| `str.repeat(n)` | Repeats string $n$ times | `"ha".repeat(3)` | `"hahaha"` |

### The Classic String Reverse Trick:
Unlike Python which does `s[::-1]`, JavaScript strings do not have a built-in `.reverse()` method.
The standard JavaScript trick is: **Split to array $\to$ Reverse array $\to$ Join back to string**:

```javascript
// Purpose: reverse a string in JavaScript
function reverseString(str) {
  return str.split("").reverse().join("");
}

console.log(reverseString("hello")); // "olleh"
```

---

## 3. Arrays: Indexing and Basic Methods

An array in JavaScript is an ordered list of items, identical to a Python list.

```javascript
// Purpose: array creation, indexing and length
const numbers = [10, 20, 30, 40];

console.log(numbers[0]);      // 10
console.log(numbers.length);  // 4
```

---

## 4. Adding and Removing Items: push, pop, shift, unshift

| Method | Action | Side of Array | Python Equivalent |
|---|---|---|---|
| **`.push(item)`** | Add to end | Back (End) | `list.append(x)` |
| **`.pop()`** | Remove from end | Back (End) | `list.pop()` |
| **`.unshift(item)`** | Add to start | Front (Start) | `list.insert(0, x)` |
| **`.shift()`** | Remove from start | Front (Start) | `list.pop(0)` |

```javascript
// Purpose: push, pop, shift, and unshift demonstration
const list = [2, 3];

list.push(4);      // list is now [2, 3, 4]
list.unshift(1);   // list is now [1, 2, 3, 4]

const last = list.pop();    // removes 4, list is [1, 2, 3]
const first = list.shift();  // removes 1, list is [2, 3]

console.log(list); // [2, 3]
```

---

## 5. Slice vs Splice

Interviewers frequently ask candidates to explain the difference between `slice` and `splice`:

### 1. `slice(start, end)` — Non-Destructive (Safe)
Returns a copy of a section of an array **without modifying the original array** (just like Python slicing `arr[start:end]`):
```javascript
const colors = ["red", "green", "blue", "yellow"];
const sub = colors.slice(1, 3);

console.log(sub);    // ["green", "blue"]
console.log(colors); // ["red", "green", "blue", "yellow"] (Original unchanged!)
```

### 2. `splice(start, deleteCount, ...newItems)` — Destructive (Changes original!)
Actually modifies the original array by removing or inserting items:
```javascript
const fruits = ["apple", "banana", "orange"];
fruits.splice(1, 1); // Starting at index 1, delete 1 item

console.log(fruits); // ["apple", "orange"] (Original was modified!)
```

---

## 6. The Three Powerhouse Array Methods: map, filter, reduce

In modern JavaScript and CodeWars katas, these three methods replace traditional `for` loops.

### 1. `map()`: Transform Every Item
Takes an array, applies a function to every item, and returns a **new array of the same length**.
*(Equivalent to Python list comprehension: `[x * 2 for x in nums]`)*

```javascript
// Purpose: double every number in an array using map
const nums = [1, 2, 3, 4];
const doubled = nums.map((x) => x * 2);

console.log(doubled); // [2, 4, 6, 8]
```

### 2. `filter()`: Keep Only Matching Items
Keeps only the items that return `true` for your condition.
*(Equivalent to Python list comprehension: `[x for x in nums if x % 2 === 0]`)*

```javascript
// Purpose: filter out only even numbers
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter((x) => x % 2 === 0);

console.log(evens); // [2, 4, 6]
```

### 3. `reduce()`: Accumulate to a Single Result
Walks through the array combining items into one single value (like a running total sum or maximum).
Syntax: `array.reduce((accumulator, currentItem) => ..., initialValue)`

```javascript
// Purpose: calculate the sum of an array using reduce
const prices = [10, 25, 40];
const total = prices.reduce((acc, curr) => acc + curr, 0);

console.log(total); // 75 (0 + 10 + 25 + 40)
```

### The Conversion Bridge: Transforming `for` Loops into Methods

| Goal | Manual `for` Loop | Modern Method One-Liner |
|---|---|---|
| **Transform every item** | `for (const x of arr) res.push(x * 2)` | `arr.map(x => x * 2)` |
| **Keep matching items** | `for (const x of arr) if (x > 0) res.push(x)` | `arr.filter(x => x > 0)` |
| **Combine into one sum** | `for (const x of arr) total += x` | `arr.reduce((acc, x) => acc + x, 0)` |

*(For full step-by-step conversion walkthroughs with side-by-side recipes, see [`13-javascript-patterns.md`](13-javascript-patterns.md#5-the-modern-shortcut-bridge-from-loops-to-methods)).*

---

## 7. The Famous JavaScript Sorting Trap (Must Know!)

In Python: `[10, 5, 20, 1].sort()` correctly gives `[1, 5, 10, 20]`.
In JavaScript, **`.sort()` converts elements to STRINGS by default**:

```javascript
const badSort = [10, 5, 20, 1].sort();
console.log(badSort); // [1, 10, 20, 5]  <-- BUG! "10" comes before "5" alphabetically!
```

### The Fix: Always provide a comparison function!
- **Ascending order (Smallest to Largest):** `(a, b) => a - b`
- **Descending order (Largest to Smallest):** `(a, b) => b - a`

```javascript
// Purpose: correctly sort numbers in JavaScript
const nums = [10, 5, 20, 1];

nums.sort((a, b) => a - b);
console.log(nums); // [1, 5, 10, 20] (Correct!)

nums.sort((a, b) => b - a);
console.log(nums); // [20, 10, 5, 1] (Descending!)
```

---

## 8. Classic CodeWars Patterns

### Pattern A: Count Vowels in a String
```javascript
// Purpose: count vowels (a, e, i, o, u) in a string
function countVowels(str) {
  let count = 0;
  const vowels = "aeiouAEIOU";

  for (const char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

console.log(countVowels("celebration")); // 5
```

### Pattern B: Find Smallest and Largest in an Array
```javascript
// Purpose: find min and max using Math and the spread operator (...)
const scores = [88, 92, 75, 99, 64];

const minScore = Math.min(...scores); // Spread (...) unpacks array into separate arguments
const maxScore = Math.max(...scores);

console.log("Min:", minScore); // 64
console.log("Max:", maxScore); // 99
```

