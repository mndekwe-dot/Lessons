# 09 — JavaScript Quick Cheat Sheet

Keep this one-page sheet open during your practice and review it right before your technical interview.

---

## 1. Variables & Data Types
```javascript
let count = 0;             // can change (reassignable)
const PI = 3.14159;        // locked (cannot reassign)

// 7 Primitives
const n = 42;              // number (both ints and floats)
const s = "hello";         // string
const b = true;            // boolean (lowercase!)
const u = undefined;       // declared, no value yet
const nil = null;          // intentional empty value
const big = 9007199254740991n; // bigint
const sym = Symbol("id");  // symbol

// Object & Array
const person = { name: "Ama", age: 20 };
const items = [10, 20, 30];
```

---

## 2. Math & Numbers
```javascript
Math.floor(7 / 2);         // 3  (integer division, like Python 7 // 2)
Math.ceil(7 / 2);          // 4  (round UP)
Math.round(3.6);           // 4  (round to nearest)
Math.abs(-15);             // 15
Math.max(10, 5, 20);       // 20
Math.min(10, 5, 20);       // 5
Math.max(...[1, 5, 2]);    // 5  (spread array into separate args)
7 % 2;                     // 1  (remainder / modulo)
2 ** 3;                    // 8  (power: 2^3)
parseInt("42px");          // 42 (string to int)
Number("42");              // 42
```

---

## 3. Conditionals & Logic
```javascript
// Strict equality: ALWAYS USE ===
5 === "5";                 // false (type + value check)
5 !== "5";                 // true

// Logic operators
if (age >= 18 && hasID) { ... }  // AND (both true)
if (isSat || isSun) { ... }      // OR (at least one true)
if (!isRaining) { ... }          // NOT

// Ternary one-liner
const status = age >= 18 ? "Adult" : "Minor";

// The 6 Falsy Values: false, 0, "", null, undefined, NaN
```

---

## 4. Strings
```javascript
const s = "kigali";
s.length;                  // 6 (property, NO parentheses!)
s[0];                      // "k"
s.at(-1);                  // "i" (last char)
s.slice(1, 4);             // "iga" (from 1 up to 4)
s.toUpperCase();           // "KIGALI"
s.toLowerCase();           // "kigali"
s.trim();                  // removes spaces from ends
s.includes("iga");         // true
s.indexOf("g");            // 2 (or -1 if missing)
s.replace("k", "K");       // "Kigali"
s.repeat(3);               // "kigalikigalikigali"
s.split("");               // ["k","i","g","a","l","i"]

// Reverse string trick
s.split("").reverse().join(""); // "ilagik"

// Template literal (f-string)
`Hello, ${name}! You scored ${score}.`
```

---

## 5. Arrays
```javascript
const a = [1, 2, 3];
a.length;                  // 3

// Adding & removing
a.push(4);                 // add to END        -> [1, 2, 3, 4]
a.pop();                   // remove from END   -> returns 4
a.unshift(0);              // add to FRONT      -> [0, 1, 2, 3]
a.shift();                 // remove from FRONT -> returns 0

// Slice (safe copy) vs Splice (modifies original)
a.slice(1, 3);             // elements 1..2 without modifying a
a.splice(1, 1);            // removes 1 item at index 1

// Helpers
a.includes(2);             // true
a.indexOf(2);              // 1 (or -1 if missing)
a.join(",");               // "1,2,3"
[...a];                    // shallow clone copy of array

// THE SORTING RULE: always pass (a, b) => a - b for numbers!
[10, 5, 20, 1].sort((a, b) => a - b); // [1, 5, 10, 20]
```

---

## 6. Functional Array Superpowers
```javascript
// map: transform every item into a new array
[1, 2, 3].map(x => x * 2);             // [2, 4, 6]

// filter: keep only matching items
[1, 2, 3, 4].filter(x => x % 2 === 0); // [2, 4]

// reduce: accumulate to single total
[10, 20, 30].reduce((sum, x) => sum + x, 0); // 60
```

---

## 7. Loops & Iteration
```javascript
// Classic for loop
for (let i = 0; i < n; i++) { ... }

// for...of: walk values of array or string (like Python for x in items:)
for (const x of items) { ... }

// while loop
while (condition) { ... }
```

---

## 8. Objects (Dictionaries)
```javascript
const user = { name: "Ama", score: 95 };

// Access
user.name;                 // "Ama" (dot notation)
user["score"];             // 95    (bracket notation)
user[variableKey];         // dynamic key access

// Add / modify / delete
user.city = "Kigali";      // add
user.score = 99;           // update
delete user.city;          // remove

// Check key
"score" in user;           // true
user.hasOwnProperty("age");// false

// Object iteration
Object.keys(user);         // ["name", "score"]
Object.values(user);       // ["Ama", 99]
Object.entries(user);      // [["name", "Ama"], ["score", 99]]
```

