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

