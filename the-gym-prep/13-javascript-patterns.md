# JavaScript Patterns: From Basic Loops to Algorithm Weapons

> "You do not need to memorize hundreds of algorithms. You only need to master 5 core loop patterns. Every coding challenge is built from these 5 blocks."

---

## Table of Contents
1. [The Golden Rule of Loops](#1-the-golden-rule-of-loops)
2. [The 5 Fundamental Loop Patterns](#2-the-5-fundamental-loop-patterns)
   - [Pattern 1: The Accumulator (The Running Bucket)](#pattern-1-the-accumulator-the-running-bucket)
   - [Pattern 2: The Filter (The Bouncer / Sifter)](#pattern-2-the-filter-the-bouncer--sifter)
   - [Pattern 3: The Transformer (The Assembly Line)](#pattern-3-the-transformer-the-assembly-line)
   - [Pattern 4: The Champion Tracker (Finding Max or Min)](#pattern-4-the-champion-tracker-finding-max-or-min)
   - [Pattern 5: The Early-Exit Search (The Detective)](#pattern-5-the-early-exit-search-the-detective)
3. [Choosing Between Loop Styles](#3-choosing-between-loop-styles)
   - [When to Use for...of](#when-to-use-forof)
   - [When to Use Classic Counting for](#when-to-use-classic-counting-for)
4. [Intermediate Algorithm Patterns](#4-intermediate-algorithm-patterns)
   - [Pattern 6: The Frequency Tally Sheet (Hash Map / Object)](#pattern-6-the-frequency-tally-sheet-hash-map--object)
   - [Pattern 7: Two Pointers (Walking From Both Ends)](#pattern-7-two-pointers-walking-from-both-ends)
5. [The Modern Shortcut Bridge: From Loops to Methods](#5-the-modern-shortcut-bridge-from-loops-to-methods)
6. [The 4-Step Problem-Solving Recipe](#6-the-4-step-problem-solving-recipe)

---

## 1. The Golden Rule of Loops

Every loop problem follows this exact 3-step physical structure:

```
[ Step 1: Prepare the Container ] -> BEFORE the loop starts (let total = 0, let result = [])
               ▼
[ Step 2: Visit & Update ]        -> INSIDE the loop (total += item, result.push(item))
               ▼
[ Step 3: Return the Container ]  -> AFTER the loop finishes (return total, return result)
```

> [!CAUTION]
> **The Most Common Beginner Mistake:** Placing `return` inside the loop body. If `return` is inside the loop, the function stops on the very first round and never inspects the rest of the items!

### Why Can't the Container Go Inside the Loop?

A very common beginner question is: *"Why can't I put `const result = []` or `let total = 0` inside the loop?"*

There are two major reasons:

#### 1. The Shopping Cart Analogy (The Wipeout Trap)
Think of your container as a **shopping cart**:
- **Outside the loop (Correct):** You take **one cart** before entering the store. Every item you grab goes into that same cart. At checkout (after the loop), your cart holds everything: `[2, 4, 6]`.
- **Inside the loop (Wrong):** Every time you look at an item, you throw away your current cart, grab a **brand-new empty cart**, and put only that one item inside.
  - Round 1 (sees 1): new empty cart $\rightarrow$ adds 2 $\rightarrow$ cart is `[2]`.
  - Round 2 (sees 2): **throws away cart!** new empty cart $\rightarrow$ adds 4 $\rightarrow$ the 2 is lost forever!
  - Round 3 (sees 3): **throws away cart!** new empty cart $\rightarrow$ adds 6 $\rightarrow$ the 4 is lost forever!

#### 2. Block Scope (ReferenceError)
Variables declared with `const` or `let` inside `{ ... }` only exist inside those braces:
```javascript
// WRONG:
function doubleAll(arr) {
  for (const num of arr) {
    const result = [];    // Created and destroyed on every single lap!
    result.push(num * 2);
  } // <--- 'result' dies here!

  return result; // ERROR: ReferenceError: result is not defined
}

// CORRECT:
function doubleAll(arr) {
  const result = []; // 1. Built once BEFORE the loop

  for (const num of arr) {
    result.push(num * 2); // 2. Collects on every lap
  }

  return result; // 3. Survives and returns all collected items
}
```

---

## 2. The 5 Fundamental Loop Patterns

---

### Pattern 1: The Accumulator (The Running Bucket)

- **When to use:** Whenever the problem asks to *"sum all numbers"*, *"count how many"*, or *"combine into one total"*.
- **Mental Model:** A piggy bank. You start with an empty bank ($0). Every time you find a coin, you drop it inside. When done walking, you count the contents.

#### Blueprint:
```javascript
function sumArray(numbers) {
  // 1. Prepare container BEFORE the loop
  let total = 0;

  // 2. Loop through every item
  for (const num of numbers) {
    total += num; // add to running total
  }

  // 3. Return AFTER the loop has fully finished
  return total;
}

console.log(sumArray([1, 2, 3, 4])); // 10
```

#### String Accumulator Example (Building Text):
```javascript
function repeatWord(word, times) {
  let result = ""; // empty string container

  for (let i = 0; i < times; i++) {
    result += word;
  }

  return result;
}

console.log(repeatWord("Ha", 3)); // "HaHaHa"
```

---

### Pattern 2: The Filter (The Bouncer / Sifter)

- **When to use:** Whenever the problem asks to *"keep only positive numbers"*, *"extract words starting with A"*, or *"remove bad data"*.
- **Mental Model:** A nightclub bouncer checking ID at the door. If a person meets the rule, they enter the club (`result.push()`). Otherwise, they are skipped.

#### Blueprint:
```javascript
function onlyPositives(numbers) {
  // 1. Prepare empty array container
  const result = [];

  // 2. Inspect each item
  for (const num of numbers) {
    if (num > 0) {
      result.push(num); // only push if it passes the check!
    }
  }

  // 3. Return the filtered list
  return result;
}

console.log(onlyPositives([1, -4, 7, 0, -2])); // [1, 7]
```

---

### Pattern 3: The Transformer (The Assembly Line)

- **When to use:** Whenever you need to *"double every number"*, *"uppercase every word"*, or *"square each value"*.
- **Mental Model:** A factory conveyor belt. Every item that passes through is painted or modified, then placed in the shipping crate.

#### Blueprint:
```javascript
function doubleAll(numbers) {
  // 1. Prepare empty array container
  const doubled = [];

  // 2. Transform every single item
  for (const num of numbers) {
    doubled.push(num * 2);
  }

  // 3. Return new array
  return doubled;
}

console.log(doubleAll([1, 2, 3])); // [2, 4, 6]
```

---

### Pattern 4: The Champion Tracker (Finding Max or Min)

- **When to use:** Whenever the problem asks for *"the largest number"*, *"the smallest price"*, or *"the longest word"*.
- **Mental Model:** The heavyweight boxing champion. The first fighter holds the belt. As new challengers arrive, if a challenger is stronger, they take the belt.

#### Blueprint:
```javascript
function findLargest(numbers) {
  // 1. The first item starts as champion
  let champion = numbers[0];

  // 2. Compare against every contender
  for (const num of numbers) {
    if (num > champion) {
      champion = num; // We found a new champion!
    }
  }

  // 3. Return the ultimate champion
  return champion;
}

console.log(findLargest([12, 45, 7, 89, 23])); // 89
```

> [!TIP]
> **Always initialize with `numbers[0]`**, not `0`. If an array contains only negative numbers like `[-10, -50, -3]`, starting at `0` gives a false answer!

---

### Pattern 5: The Early-Exit Search (The Detective)

- **When to use:** Whenever the problem asks *"Does this list contain X?"*, *"Is every number even?"*, or *"Find the first negative"*.
- **Mental Model:** Searching for your house keys in a bag. The moment your hand touches the keys, you stop searching immediately. You do not keep digging through the whole bag.

#### Blueprint (Finding If Something Exists):
```javascript
function hasNegative(numbers) {
  for (const num of numbers) {
    if (num < 0) {
      return true; // Stop immediately and report success!
    }
  }

  // If the loop finished without finding any negative, return false
  return false;
}

console.log(hasNegative([1, 5, -2, 8])); // true
console.log(hasNegative([1, 5, 2, 8]));  // false
```

#### Blueprint (Validating All Items Meet a Rule):
```javascript
function areAllEven(numbers) {
  for (const num of numbers) {
    // Look for the first bad item
    if (num % 2 !== 0) {
      return false; // Found an odd number -> rule broken!
    }
  }

  // Loop completed without finding any odd numbers -> all are even!
  return true;
}

console.log(areAllEven([2, 4, 6])); // true
console.log(areAllEven([2, 5, 6])); // false
```

---

## 3. Choosing Between Loop Styles

### When to Use for...of
Use `for (const x of arr)` **90% of the time** when you only need the items themselves.

```javascript
for (const color of ["red", "green", "blue"]) {
  console.log(color);
}
```

### When to Use Classic Counting for
Use index-based loops only when:
1. You need the **index position** (e.g. *"return the index of 7"*).
2. You need to compare **adjacent items** (e.g. `arr[i]` vs `arr[i + 1]`).
3. You need to loop **backwards** (`let i = arr.length - 1; i >= 0; i--`).

```javascript
// Example: Checking adjacent pairs
function hasDuplicatesNextToEachOther(arr) {
  // Stop at length - 1 so arr[i + 1] does not fall off the edge!
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      return true;
    }
  }
  return false;
}
```

---

## 4. Intermediate Algorithm Patterns

---

### Pattern 6: The Frequency Tally Sheet (Hash Map / Object)

- **When to use:** Counting occurrences of characters, finding the most frequent item, or checking anagrams.
- **Mental Model:** A clipboard tally sheet. Every time a person votes for a candidate, you draw a tick mark next to their name.

```javascript
function countFrequencies(items) {
  const tally = {};

  for (const item of items) {
    // If seen before, add 1. If first time, set to 1.
    tally[item] = (tally[item] || 0) + 1;
  }

  return tally;
}

console.log(countFrequencies(["cat", "dog", "cat", "bird"]));
// { cat: 2, dog: 1, bird: 1 }
```

---

### Pattern 7: Two Pointers (Walking From Both Ends)

- **When to use:** Reversing arrays, checking palindromes, or finding pairs with a target sum in a sorted list.
- **Mental Model:** Two people walking toward each other from opposite ends of a bridge.

```javascript
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) {
      return false; // Letters do not match!
    }
    left++;  // Move left pointer forward
    right--; // Move right pointer backward
  }

  return true;
}

console.log(isPalindrome("radar")); // true
console.log(isPalindrome("hello")); // false
```

---

## 5. The Modern Shortcut Bridge: From Loops to Methods

Once the loop patterns are clear in your mind, you can turn any multi-line `for` loop into a clean one-liner using JavaScript's powerhouse array methods:

### The Big Picture: Which One Do You Need?

| Tool | Real-Life Analogy | Input $\to$ Output Size | Example |
|---|---|---|---|
| **`.map()`** | **The Assembly Line** | 4 items in $\to$ **4 items out** | Double every number: `[1, 2, 3] -> [2, 4, 6]` |
| **`.filter()`** | **The Nightclub Bouncer** | 4 items in $\to$ **Fewer items out** | Keep only evens: `[1, 2, 3, 4] -> [2, 4]` |
| **`.reduce()`** | **The Kitchen Blender** | 4 items in $\to$ **1 single value out** | Sum all numbers: `[1, 2, 3, 4] -> 10` |

---

### Conversion 1: `for` Loop $\to$ `.map()`

**Formula:** `arr.map(item => whatYouWantItToBecome)`

```javascript
// BEFORE (Manual for loop):
function doubleAll(arr) {
  const result = [];
  for (const x of arr) {
    result.push(x * 2);
  }
  return result;
}

// AFTER (.map one-liner):
function doubleAll(arr) {
  return arr.map(x => x * 2);
}
```
*Notice:* No empty array container `[]`, no `.push()`. `.map()` automatically creates and returns the new array.

---

### Conversion 2: `for` Loop $\to$ `.filter()`

**Formula:** `arr.filter(item => trueOrFalseCondition)`

```javascript
// BEFORE (Manual for loop):
function onlyPositives(arr) {
  const result = [];
  for (const x of arr) {
    if (x > 0) {
      result.push(x);
    }
  }
  return result;
}

// AFTER (.filter one-liner):
function onlyPositives(arr) {
  return arr.filter(x => x > 0);
}
```
*Notice:* If the condition evaluates to `true`, the item stays. If `false`, the bouncer rejects it.

---

### Conversion 3: `for` Loop $\to$ `.reduce()`

**Formula:** `arr.reduce((accumulator, item) => newAccumulatorValue, startingValue)`

```javascript
// BEFORE (Manual for loop):
function sumArray(arr) {
  let total = 0; // Starting value (0)
  for (const x of arr) {
    total += x;  // Add x to total
  }
  return total;
}

// AFTER (.reduce one-liner):
function sumArray(arr) {
  return arr.reduce((total, x) => total + x, 0);
}
```
*Notice the two parameters inside `(total, x)`:*
1. `total` is the running bucket (starts at `0`, defined by the second argument `, 0`).
2. `x` is the current element being processed.

---

### Quick Cheat Sheet

| Pattern | Classic `for` Loop | Modern Shortcut Method |
| :--- | :--- | :--- |
| **Transform** (Modify each item) | `result.push(x * 2)` | `arr.map(x => x * 2)` |
| **Filter** (Keep matching items) | `if (test) result.push(x)` | `arr.filter(x => test)` |
| **Accumulator** (Total sum/blend) | `total += x` | `arr.reduce((s, x) => s + x, 0)` |
| **Search one** (First match) | `if (test) return x;` | `arr.find(x => test)` |
| **Check any** (At least one) | `if (test) return true;` | `arr.some(x => test)` |
| **Check all** (Every item) | `if (!test) return false;` | `arr.every(x => test)` |

> [!NOTE]
> In technical interviews, interviewers often ask: *"Can you write this using a basic `for` loop first, and then refactor it using array methods?"* Knowing both makes you stand out immediately!

---

## 6. The 4-Step Problem-Solving Recipe

Whenever you see a coding challenge, follow this recipe before typing code:

1. **Pick the Pattern:**
   - Am I totaling? $\rightarrow$ **Accumulator** (`let total = 0`)
   - Am I picking specific items? $\rightarrow$ **Filter** (`const result = []`)
   - Am I modifying each item? $\rightarrow$ **Transformer** (`const result = []`)
   - Am I finding the biggest? $\rightarrow$ **Champion** (`let best = arr[0]`)
   - Am I checking yes/no? $\rightarrow$ **Search** (`return true / false`)

2. **Initialize Container:** Write line 1 before the loop.
3. **Loop & Update:** Write the loop body.
4. **Return:** Return your container outside the loop.

---

## Quick Reference Links
- Loops Guide: [the-gym-prep/02-loops-and-functions.md](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/02-loops-and-functions.md)
- JavaScript Drills: [the-gym-prep/practice/drills_js_basics.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/practice/drills_js_basics.js)
- Array Drills: [the-gym-prep/practice/drills_strings_arrays.js](file:///c:/Users/user/Documents/AmaliTech-Prep/the-gym-prep/practice/drills_strings_arrays.js)
