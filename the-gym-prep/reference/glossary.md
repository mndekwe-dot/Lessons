# 11 — JavaScript Glossary

Clear, simple English definitions of every JavaScript word you will encounter in tutorials, CodeWars, and interviews.

---

### Callback Function
A function passed into another function as an argument, to be called later.
*Example:* In `nums.map(x => x * 2)`, the arrow function `x => x * 2` is a callback.

### Closure
When an inner function retains access to the variables of its outer parent function, even after the parent function has finished running. (Think of it as the inner function packing the parent's variables into a backpack).

### Destructuring
A clean shortcut to unpack values from arrays or properties from objects into distinct variables.
*Example:* `const { name, age } = user;` instead of `const name = user.name; const age = user.age;`.

### ES6 (ECMAScript 2015)
The major update to JavaScript released in 2015 that introduced `let`, `const`, arrow functions (`=>`), template literals (`` `Hello ${name}` ``), default parameters, and the spread operator (`...`).

### Falsy
A value that becomes `false` when evaluated in an `if` condition. JavaScript has exactly 6 falsy values: `false`, `0`, `""` (empty string), `null`, `undefined`, and `NaN`.

### Higher-Order Function
A function that either:
1. Takes another function as an argument (like `.map()`, `.filter()`, `.reduce()`).
2. Returns a new function.

### Hoisting
JavaScript's behavior of moving variable and function declarations to the top of their scope before code execution. (`var` variables are hoisted as `undefined`, while `let` and `const` sit in a "Temporal Dead Zone" until declared).

### Immutability
Data that cannot be modified after it is created. In JavaScript, all primitive types (strings, numbers, booleans) are immutable. (When you modify a string, you create a brand-new string).

### Kata
A small coding exercise or algorithm challenge on [codewars.com](https://www.codewars.com/). Rankings start at **8 kyu** (easiest) and go up to **1 kyu** (master).

### NaN (Not-a-Number)
A special numeric value returned when a mathematical operation fails or cannot produce a meaningful number (e.g., `0 / 0` or `"hello" * 5`). Ironically, `typeof NaN` is `"number"`.

### Null vs Undefined
- **`undefined`:** A variable has been created, but nobody has given it a value yet.
- **`null`:** A programmer intentionally set the value to "empty".

### Object Literal
A way to create a key-value object using curly braces `{}`. Example: `const car = { brand: "Toyota", year: 2020 };`.

### Primitive Types
The basic, immutable building blocks of JavaScript that are copied by value: Number, String, Boolean, Null, Undefined, BigInt, Symbol.

### Reference Types
Complex data structures that are copied by memory reference (pointer): Objects, Arrays, and Functions.

### Scope
The region of code where a variable is accessible:
- **Global Scope:** Accessible anywhere in the entire program.
- **Function Scope:** Accessible only inside the function where it was declared (`var`).
- **Block Scope:** Accessible only between the nearest curly braces `{ ... }` (`let` and `const`).

### Spread Operator (`...`)
Three dots that unpack elements of an array or properties of an object into a new context.
*Example:* `const copy = [...originalList];` (makes an independent shallow clone).

### Strict Equality (`===`)
Comparison that checks both data type and value without performing automatic conversion. (Always preferred over loose equality `==`).

### Template Literal
A string wrapped in backticks (`` ` ``) that allows embedded expressions using `${expression}` and multi-line text (similar to Python f-strings).

### Truthy
Any value that evaluates to `true` inside an `if` statement. Everything that is not one of the 6 falsy values is truthy (including empty arrays `[]` and empty objects `{}`).

### Type Coercion
JavaScript automatically converting a value from one data type to another behind your back (e.g., `"5" + 2` turns into `"52"`).

