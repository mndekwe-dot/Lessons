# 04 — Objects and Data Structures

In Python, you store key-value data in a **dictionary** (`{"name": "Ama", "age": 20}`).
In JavaScript, this is called an **Object**. Objects are fundamental to everything in JavaScript.

---

## Table of Contents
1. [Creating and Accessing Objects](#1-creating-and-accessing-objects)
2. [Dot Notation vs Bracket Notation (When to Use Which)](#2-dot-notation-vs-bracket-notation-when-to-use-which)
3. [Adding, Modifying and Deleting Properties](#3-adding-modifying-and-deleting-properties)
4. [Iterating Over Objects: Object.keys, Object.values, Object.entries](#4-iterating-over-objects-objectkeys-objectvalues-objectentries)
5. [Value vs Reference (The #1 Object Concept in Interviews)](#5-value-vs-reference-the-1-object-concept-in-interviews)
6. [Modern Data Structures: Set and Map](#6-modern-data-structures-set-and-map)
7. [The Character Frequency Counter Pattern](#7-the-character-frequency-counter-pattern)

---

## 1. Creating and Accessing Objects

An object stores related data in **key-value pairs**:

```javascript
// Purpose: creating an object literal (like Python dict)
const student = {
  name: "Uwase Amina",
  age: 21,
  city: "Kigali",
  isEnrolled: true,
};

// Accessing properties:
console.log(student.name); // "Uwase Amina" (Dot notation)
console.log(student["city"]); // "Kigali" (Bracket notation)
```

---

## 2. Dot Notation vs Bracket Notation (When to Use Which)

- **Dot Notation (`obj.key`):** Clean and standard. Use this when you know the exact property name in advance.
- **Bracket Notation (`obj[key]`):** Essential when the property name is stored inside a **variable**, or has spaces/symbols.

```javascript
// Purpose: dynamic property access using bracket notation
const person = {
  name: "Eric",
  score: 88,
};

const query = "score";

console.log(person.query); // undefined! (Looks for a property literally named "query")
console.log(person[query]); // 88 (Evaluates variable query -> looks up "score"!)
```

> [!TIP]
> Whenever you loop over keys, always use **bracket notation** (`obj[key]`). Dot notation (`obj.key`) will fail!

---

## 3. Adding, Modifying and Deleting Properties

```javascript
// Purpose: adding, updating and removing object properties
const user = { name: "Claire" };

// 1. Add new property
user.email = "claire@example.com";

// 2. Modify existing property
user.name = "Claire Mutesi";

// 3. Check if property exists
console.log("email" in user); // true
console.log(user.hasOwnProperty("age")); // false

// 4. Delete a property
delete user.email;
console.log(user); // { name: "Claire Mutesi" }
```

---

## 4. Iterating Over Objects: Object.keys, Object.values, Object.entries

Unlike arrays, you cannot use a simple `for...of` directly on an object. Instead, use the built-in `Object` helpers:

```javascript
// Purpose: iterating through object keys, values, and entries
const scores = { Math: 90, English: 85, Physics: 92 };

// 1. Get array of all keys
console.log(Object.keys(scores));
// Output: ["Math", "English", "Physics"]

// 2. Get array of all values
console.log(Object.values(scores));
// Output: [90, 85, 92]

// 3. Get array of [key, value] pairs (like Python dict.items())
for (const [subject, score] of Object.entries(scores)) {
  console.log(`${subject}: ${score}%`);
}
```

---

## 5. Value vs Reference (The #1 Object Concept in Interviews)

Interviewers test this constantly.

### 1. Primitive types are copied by VALUE:
Numbers, strings, and booleans create independent copies:
```javascript
let x = 10;
let y = x; // y gets an independent copy of 10
y = 20;

console.log(x); // 10 (x did NOT change!)
```

### 2. Objects and Arrays are copied by REFERENCE:
When you assign an object or array to a new variable, it does **not** copy the data. It copies the **memory address (pointer)**:
```javascript
const original = { name: "Alice" };
const copy = original; // Points to the EXACT same object in memory!

copy.name = "Bob";

console.log(original.name); // "Bob"! (Original was modified!)
```

### How to Make a Real Independent Copy (Shallow Clone):
Use the **spread operator (`...`)**:
```javascript
const original = { name: "Alice" };
const safeCopy = { ...original }; // Creates a brand-new object!

safeCopy.name = "Bob";
console.log(original.name); // "Alice" (Original is safe!)
```

---

## 6. Modern Data Structures: Set and Map

### 1. `Set` (Collection of Unique Values):
Just like Python's `set`:
```javascript
// Purpose: store unique items and eliminate duplicates
const numbers = [1, 2, 2, 3, 3, 3, 4];
const uniqueSet = new Set(numbers);

console.log(uniqueSet.has(2)); // true
console.log(uniqueSet.size); // 4

// Convert Set back to an Array:
const uniqueArray = [...uniqueSet];
console.log(uniqueArray); // [1, 2, 3, 4]
```

### 2. `Map` (Dictionary that allows ANY key type):
Normal objects convert all keys to strings. A `Map` preserves exact key types and maintains insertion order:
```javascript
// Purpose: modern key-value map
const map = new Map();
map.set("name", "Ama");
map.set(100, "number-key");

console.log(map.get(100)); // "number-key"
console.log(map.has("name")); // true
```

---

## 7. The Character Frequency Counter Pattern

This pattern is the foundation for solving anagrams, duplicate detection, and string analysis in CodeWars:

```javascript
// Purpose: count occurrences of each character using an object as a tally sheet
function countFrequencies(str) {
  const counts = {};

  for (const char of str) {
    // If char already exists, increment; otherwise initialize to 1
    counts[char] = (counts[char] || 0) + 1;
  }

  return counts;
}

console.log(countFrequencies("banana"));
// Output: { b: 1, a: 3, n: 2 }
```

