# 01 — JavaScript Essentials

The absolute basics of JavaScript, explained with direct comparisons to Python.

---

## Table of Contents
1. [Printing and Comments](#1-printing-and-comments)
2. [Variables: let vs const (and why to avoid var)](#2-variables-let-vs-const-and-why-to-avoid-var)
3. [Data Types in JavaScript](#3-data-types-in-javascript)
4. [Numbers and Math](#4-numbers-and-math)
5. [Type Conversion and Type Coercion](#5-type-conversion-and-type-coercion)
6. [Conditionals: if, else if, else](#6-conditionals-if-else-if-else)
7. [Equality: === vs == (The Number One Interview Question)](#7-equality--vs--the-number-one-interview-question)
8. [Logical Operators: &&, ||, !](#8-logical-operators---)
9. [Truthy and Falsy Values](#9-truthy-and-falsy-values)
10. [The Ternary Operator](#10-the-ternary-operator)
11. [Getting It Wrong: Common Beginner Traps](#11-getting-it-wrong-common-beginner-traps)

---

## 1. Printing and Comments

In Python you write `print()`. In JavaScript you write `console.log()`.

```javascript
// Purpose: print output to the terminal
console.log("Hello, World!");
console.log(42);
console.log(true);

// Single-line comment starts with two slashes

/*
   Multi-line comment
   can span multiple lines
*/
```

> [!NOTE]
> In JavaScript, you can end lines with a semicolon `;`. While modern JavaScript often allows leaving them out, using them consistently is a professional habit that avoids rare parsing bugs.

---

## 2. Variables: let vs const (and why to avoid var)

In Python, you create a variable just by writing `x = 5`.
In JavaScript, you must declare variables using **`let`** or **`const`**:

```javascript
// Purpose: declaring variables that can change (let) vs variables that cannot change (const)

let age = 20;
age = 21; // Valid! let allows you to reassign a new value.

const country = "Rwanda";
// country = "Kenya"; // ERROR! TypeError: Assignment to constant variable.
```

### The Rule of Thumb:
1. **Always use `const` by default.** If a variable should not be reassigned, lock it with `const`.
2. **Use `let` only when you know the value must change** (for example, a counter in a loop: `let count = 0;`).
3. **Never use `var` in modern JavaScript.** `var` is the legacy keyword from 1995. It has confusing scoping rules and creates bugs. (Interviewers will ask about this — see Section 7 and File 05).

---

## 3. Data Types in JavaScript

JavaScript has **7 Primitive Types** and **Objects**:

| Type | Example | Description | Python Equivalent |
|---|---|---|---|
| **Number** | `42`, `3.14`, `-10` | Integers and decimals are all one type: "Number" | `int` and `float` |
| **String** | `"hello"`, `'world'` | Text wrapped in double or single quotes | `str` |
| **Boolean** | `true`, `false` | Lowercase `true` and `false` (not `True`/`False`!) | `bool` |
| **Undefined** | `undefined` | A variable that has been declared but not assigned | Does not exist |
| **Null** | `null` | An intentional empty value | `None` |
| **BigInt** | `9007199254740991n` | For integers larger than $2^{53} - 1$ | Python handles big ints automatically |
| **Symbol** | `Symbol("id")` | A unique, hidden identifier | Rare |
| **Object** | `{ name: "Ama" }`, `[1, 2, 3]` | Complex data (arrays, dictionaries, dates) | `dict`, `list` |

### Checking Types with `typeof`:
```javascript
// Purpose: check the type of a value
console.log(typeof 42);          // "number"
console.log(typeof "hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof { a: 1 });    // "object"
console.log(typeof [1, 2, 3]);   // "object" (Arrays are objects in JS!)

// FAMOUS JAVASCRIPT QUIRK (Interviewers love this):
console.log(typeof null);        // "object" (This is a 30-year-old historic bug in JavaScript!)
```

---

## 4. Numbers and Math

In JavaScript, there is no separate `int` and `float` — everything is a `Number`.

```javascript
// Purpose: basic arithmetic operators
let a = 10;
let b = 3;

console.log(a + b);   // 13 (Addition)
console.log(a - b);   // 7  (Subtraction)
console.log(a * b);   // 30 (Multiplication)
console.log(a / b);   // 3.3333333333333335 (Standard division)
console.log(a % b);   // 1  (Remainder / Modulo)
console.log(a ** b);  // 1000 (10 to the power of 3)

// Increment and Decrement:
let count = 0;
count++;  // Same as count = count + 1 (now 1)
count--;  // Same as count = count - 1 (now 0)
```

### The `Math` Object (Crucial for Katas & Codewars):
In Python you use `//` for integer division. In JavaScript, `a / b` always gives a decimal. You must use `Math.floor()`:

```javascript
// Purpose: essential Math methods in JavaScript
console.log(Math.floor(7 / 2));  // 3  (Rounds DOWN — like Python's 7 // 2)
console.log(Math.ceil(7 / 2));   // 4  (Rounds UP)
console.log(Math.round(3.6));    // 4  (Rounds to nearest integer)
console.log(Math.abs(-15));      // 15 (Absolute value)
console.log(Math.max(10, 5, 20)); // 20 (Highest number)
console.log(Math.min(10, 5, 20)); // 5  (Lowest number)
console.log(Math.sqrt(16));      // 4  (Square root)
```

---

## 5. Type Conversion and Type Coercion

### Manual Conversion (Explicit):
```javascript
// Purpose: explicitly converting types
console.log(Number("42"));     // 42 (String to Number)
console.log(String(100));      // "100" (Number to String)
console.log(Boolean(1));       // true (Number to Boolean)

// Parsing numbers with units:
console.log(parseInt("42px"));   // 42 (Stops reading at non-digits)
console.log(parseFloat("3.14m")); // 3.14
```

### Automatic Coercion (The `+` Trap):
In JavaScript, the `+` operator does two different things:
1. If both are numbers, it adds them.
2. If **either** operand is a string, it **converts the other to a string and glues them together**:

```javascript
console.log("5" + 2); // "52" (String concatenation!)
console.log("5" - 2); // 3    (Minus only exists for numbers, so JS converts "5" to 5!)
console.log("5" * "2"); // 10
```

---

## 6. Conditionals: if, else if, else

In Python you write:
```python
if score >= 80:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "F"
```

In JavaScript, you must put the condition in parentheses `(...)` and the body in curly braces `{...}`:

```javascript
// Purpose: branching logic with if / else if / else
function getGrade(score) {
  if (score >= 80) {
    return "A";
  } else if (score >= 60) {
    return "B";
  } else {
    return "F";
  }
}

console.log(getGrade(85)); // "A"
console.log(getGrade(45)); // "F"
```

---

## 7. Equality: `===` vs `==` (The Number One Interview Question)

In Python, `==` checks value equality.
In JavaScript, there are **two** equality operators:

1. **`===` (Strict Equality — ALWAYS USE THIS):**
   Checks both **value** AND **type**. If types are different, it immediately returns `false`.
2. **`==` (Loose Equality — AVOID THIS):**
   Tries to convert types behind your back before comparing. Leads to confusing bugs.

```javascript
// Purpose: demonstrate difference between strict (===) and loose (==) equality

console.log(5 === "5");  // false (One is a Number, one is a String)
console.log(5 == "5");   // true  (JS converts "5" to number 5!)

console.log(false === 0); // false (Different types)
console.log(false == 0);  // true  (JS converts false to 0!)

console.log(null === undefined); // false
console.log(null == undefined);  // true
```

> [!IMPORTANT]
> **Interview Answer:** Always tell your interviewer:
> *"I always use `===` because it checks both type and value without unexpected type coercion."*

---

## 8. Logical Operators: `&&`, `||`, `!`

In Python you write `and`, `or`, `not`.
In JavaScript you write:
- `&&` = AND (both must be true)
- `||` = OR (at least one must be true)
- `!` = NOT (flips true to false, or false to true)

```javascript
// Purpose: combine logical conditions
let age = 22;
let hasID = true;

if (age >= 18 && hasID) {
  console.log("Allowed entry");
}

let isWeekend = true;
let isHoliday = false;

if (isWeekend || isHoliday) {
  console.log("Time to rest!");
}

let isRaining = false;
console.log(!isRaining); // true
```

---

## 9. Truthy and Falsy Values

When a value is placed inside an `if (...)` statement, JavaScript converts it to a boolean.
Almost everything in JavaScript is **truthy**, EXCEPT for the **6 Falsy Values**:

### The 6 Falsy Values (Memorize these cold for interviews):
1. `false`
2. `0` (and `-0`)
3. `""` (empty string)
4. `null`
5. `undefined`
6. `NaN` (Not-a-Number)

Everything else is **truthy** — including `[]` (empty array) and `{}` (empty object)!

```javascript
// Purpose: truthy vs falsy demonstration
if ("hello") {
  console.log("Strings with text are truthy!"); // Prints
}

if (0) {
  console.log("Won't print because 0 is falsy");
}

if ([]) {
  console.log("Empty arrays are TRUTHY in JavaScript!"); // Prints! (Surprises Python devs)
}
```

---

## 10. The Ternary Operator

A short one-line `if/else`:
`condition ? valueIfTrue : valueIfFalse`

In Python: `"Adult" if age >= 18 else "Minor"`
In JavaScript:
```javascript
// Purpose: one-line if/else assignment
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status); // "Adult"
```

---

## 11. Getting It Wrong: Common Beginner Traps

1. **Writing `True` or `False` capitalized:**
   In Python, booleans are capitalized (`True`). In JavaScript, they MUST be lowercase: `true`, `false`.
2. **Missing `let` or `const`:**
   If you write `x = 10;` without `let` or `const`, JavaScript creates an unintended global variable!
3. **Using `//` for comments vs integer division:**
   In Python, `7 // 2` is integer division. In JavaScript, `//` starts a comment! To do integer division in JavaScript, use `Math.floor(7 / 2)`.
4. **Expecting `len(x)`:**
   In Python: `len("hello")` or `len(my_list)`.
   In JavaScript: `"hello".length` or `my_list.length` (it is a property, with no parentheses!).

