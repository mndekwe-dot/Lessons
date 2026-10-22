# 02 — Loops and Functions

How to repeat actions and organize reusable code in JavaScript.

---

## Table of Contents
1. [The Classic for Loop](#1-the-classic-for-loop)
2. [The while Loop](#2-the-while-loop)
3. [Modern Iteration: for...of](#3-modern-iteration-forof)
4. [Functions: Declarations vs Arrow Functions](#4-functions-declarations-vs-arrow-functions)
5. [Return vs console.log (Crucial for Codewars)](#5-return-vs-consolelog-crucial-for-codewars)
6. [Variable Scope: Block vs Function](#6-variable-scope-block-vs-function)
7. [What Is a Closure? (Interview Favorite Explained Simply)](#7-what-is-a-closure-interview-favorite-explained-simply)
8. [Getting It Wrong: Common Traps](#8-getting-it-wrong-common-traps)

---

## 1. The Classic for Loop

In Python, you loop over numbers using `for i in range(5):`.
In JavaScript, the classic `for` loop has three parts:
```javascript
for (start; condition; step) {
  // code to repeat
}
```

```javascript
// Purpose: loop from 0 to 4 (like Python's for i in range(5):)
for (let i = 0; i < 5; i++) {
  console.log("Count:", i);
}

// Purpose: loop backwards from 5 down to 1
for (let i = 5; i >= 1; i--) {
  console.log("Countdown:", i);
}

// Purpose: step by 2s (even numbers up to 10)
for (let i = 0; i <= 10; i += 2) {
  console.log("Even:", i);
}
```

### The Three Parts Explained:
1. `let i = 0;` $\to$ Start counter at 0.
2. `i < 5;` $\to$ Keep going as long as $i < 5$ (stops when $i$ hits 5).
3. `i++` $\to$ Increase $i$ by 1 after each loop.

---

## 2. The while Loop

Repeats as long as a condition stays true. Exactly like Python's `while`:

```javascript
// Purpose: while loop running until a condition is met
let energy = 3;

while (energy > 0) {
  console.log("Studying... energy left:", energy);
  energy--; // Don't forget this, or the loop runs forever!
}
console.log("Tired, time to sleep!");
```

### Loop Controls: `break` and `continue`
- `break`: Stops the loop immediately and exits.
- `continue`: Skips the rest of the current turn and jumps to the next iteration.

```javascript
// Purpose: demonstrate break and continue
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue; // Skips printing 3
  }
  if (i === 5) {
    break; // Stops loop before printing 5
  }
  console.log(i); // Prints 1, 2, 4
}
```

---

## 3. Modern Iteration: `for...of`

When you want to visit every item in an array or string without caring about the index number, use **`for...of`**.
This is the **exact equivalent of Python's `for item in items:`**!

```javascript
// Purpose: iterate over elements of an array (like Python for item in list:)
const fruits = ["mango", "banana", "avocado"];

for (const fruit of fruits) {
  console.log("Delicious:", fruit);
}

// Works on strings too:
const word = "Kigali";
for (const char of word) {
  console.log(char);
}
```

> [!WARNING]
> Be careful not to confuse `for...of` with `for...in`:
> - `for (const x of array)` gives you the **VALUES** (use this for arrays!).
> - `for (const x in object)` gives you the **KEYS/INDICES** (use this for objects!).

---

## 4. Functions: Declarations vs Arrow Functions

There are two primary ways to write functions in modern JavaScript:

### Style 1: Function Declaration (Traditional)
```javascript
// Purpose: function declaration (equivalent to Python def add(a, b):)
function add(a, b) {
  return a + b;
}

console.log(add(10, 5)); // 15
```

### Style 2: Arrow Function (Modern ES6 — Preferred in Codewars)
Arrow functions use the `=>` ("fat arrow") syntax:

```javascript
// Purpose: arrow function definition
const multiply = (a, b) => {
  return a * b;
};

// Shorthand: if the function is just ONE line returning a value,
// you can drop the curly braces and the 'return' keyword!
const square = (x) => x * x;

console.log(multiply(4, 5)); // 20
console.log(square(6));      // 36
```

### Default Parameters:
Just like in Python, you can give parameters a fallback value:
```javascript
// Purpose: function with default parameter
function greet(name = "friend") {
  return `Hello, ${name}!`;
}

console.log(greet("Amina")); // "Hello, Amina!"
console.log(greet());        // "Hello, friend!"
```

---

## 5. Return vs console.log (Crucial for Codewars)

This is the **#1 trap** for beginners taking coding assessments on CodeWars:

- **`console.log()`** only prints text on the screen for humans to see. It returns `undefined`.
- **`return`** hands the actual calculated data back to whoever called the function.

When CodeWars tests your code, its test runner checks:
`if (yourFunction(args) === expectedOutput)`

If your function uses `console.log()` instead of `return`, your function returns `undefined`, and CodeWars marks your test as **FAILED**!

```javascript
// WRONG for Codewars:
function badAdd(a, b) {
  console.log(a + b); // Prints 7, but returns undefined!
}

// CORRECT for Codewars:
function goodAdd(a, b) {
  return a + b; // Hands 7 back to the test runner!
}
```

---

## 6. Variable Scope: Block vs Function

**Scope** answers: *"Where in my code is this variable accessible?"*

### 1. Block Scope (`let` and `const`):
Any code between curly braces `{ ... }` (inside an `if`, `for`, `while`) is a **block**.
Variables declared with `let` and `const` inside a block **cannot be accessed outside that block**:

```javascript
if (true) {
  let secret = "1234";
  const token = "abc";
}
// console.log(secret); // ERROR! ReferenceError: secret is not defined
```

### 2. Why `var` is Dangerous (Function Scope & Hoisting):
Variables created with `var` ignore blocks! They leak outside:
```javascript
if (true) {
  var leaked = "I am loose!";
}
console.log(leaked); // Prints "I am loose!" (Leaked out of the if block!)
```
This is why modern JavaScript developers exclusively use `let` and `const`.

---

## 7. What Is a Closure? (Interview Favorite Explained Simply)

Interviewers at The Gym love asking: *"What is a closure in JavaScript?"*

Here is the simple, plain-English explanation:
> **A closure is a function that remembers and has access to variables from its outer parent scope, even after the parent function has finished executing.**

Think of a backpack:
When an inner function is created inside an outer function, it packs all the variables from the outer function into its "backpack". Wherever the inner function travels later, it still has access to everything in its backpack!

```javascript
// Purpose: demonstrate a closure in JavaScript
function createCounter() {
  let count = 0; // Outer variable

  // Inner function has a closure over 'count'
  return function () {
    count++;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter1()); // 3
```
Even though `createCounter()` has already finished running, `counter1` still remembers `count`!

---

## 8. Getting It Wrong: Common Traps

1. **Returning inside a loop on the first turn:**
   ```javascript
   // WRONG: returns on i=0, never checks the rest of the list!
   function hasEven(nums) {
     for (const x of nums) {
       if (x % 2 === 0) {
         return true;
       } else {
         return false; // BUG! Exits immediately if the first number is odd!
       }
     }
   }

   // CORRECT: check all items, only return false if the loop finishes without finding any
   function hasEvenCorrect(nums) {
     for (const x of nums) {
       if (x % 2 === 0) return true;
     }
     return false; // Checked all, none were even
   }
   ```
2. **Infinite loops:**
   Always ensure your `while` loop has a step (`i++`, `energy--`) that moves toward the stopping condition.

