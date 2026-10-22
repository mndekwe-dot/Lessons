# 06 — CodeWars Kata Playbook

To qualify for **The Gym**, you must link your [CodeWars](https://www.codewars.com/) profile showcasing solved challenges, and you will solve a live coding challenge during your technical interview.

In CodeWars, difficulty ranks from **8 kyu** (easiest / beginner) to **1 kyu** (expert).
The Gym tests you on **8 kyu** and introductory **7 kyu** katas.

---

## Table of Contents
1. [The 5 Core Kata Patterns](#1-the-5-core-kata-patterns)
2. [Kata 1: Multiply (8 kyu)](#kata-1-multiply-8-kyu)
3. [Kata 2: Even or Odd (8 kyu)](#kata-2-even-or-odd-8-kyu)
4. [Kata 3: Opposite Number (8 kyu)](#kata-3-opposite-number-8-kyu)
5. [Kata 4: Return Negative (8 kyu)](#kata-4-return-negative-8-kyu)
6. [Kata 5: Sum of Positive (8 kyu)](#kata-5-sum-of-positive-8-kyu)
7. [Kata 6: String Repeat (8 kyu)](#kata-6-string-repeat-8-kyu)
8. [Kata 7: Remove First and Last Character (8 kyu)](#kata-7-remove-first-and-last-character-8-kyu)
9. [Kata 8: Square(n) Sum (8 kyu)](#kata-8-squaren-sum-8-kyu)
10. [Kata 9: Find the Smallest Integer in the Array (8 kyu)](#kata-9-find-the-smallest-integer-in-the-array-8-kyu)
11. [Kata 10: Vowel Count (7 kyu)](#kata-10-vowel-count-7-kyu)

---

## 1. The 5 Core Kata Patterns

Almost every 8 kyu problem is an instance of one of these 5 patterns:

1. **The Accumulator:** Start a variable at 0 (or empty array `[]`), loop through the input, add to it, and return it.
2. **The Decision Check:** Simple `if / else` or modulo `%` calculation.
3. **The String Cleaner:** Using `.slice()`, `.split()`, or `.replace()` to modify text.
4. **The Array Filter:** Keeping only items that match a condition.
5. **The Min/Max Tracker:** Finding the extreme value in a collection.

---

## Kata 1: Multiply (8 kyu)

### The Task:
This code does not execute properly. Try to figure out why:
```javascript
function multiply(a, b) {
  a * b;
}
```

### The Fix:
The function forgot the **`return`** keyword! Without `return`, JavaScript functions return `undefined`.

```javascript
// Purpose: multiply two numbers and return the product
function multiply(a, b) {
  return a * b;
}

// Arrow function shorthand:
const multiplyArrow = (a, b) => a * b;
```

---

## Kata 2: Even or Odd (8 kyu)

### The Task:
Create a function that takes an integer as an argument and returns `"Even"` for even numbers or `"Odd"` for odd numbers.

### The Logic:
A number is even if dividing by 2 leaves a remainder of 0 (`number % 2 === 0`).

```javascript
// Purpose: check if integer is even or odd
function evenOrOdd(number) {
  if (number % 2 === 0) {
    return "Even";
  } else {
    return "Odd";
  }
}

// Clean one-line ternary:
const evenOrOddShort = (number) => (number % 2 === 0 ? "Even" : "Odd");
```

---

## Kata 3: Opposite Number (8 kyu)

### The Task:
Given an integer or a floating-point number, find its opposite (e.g. `1` becomes `-1`, `-34` becomes `34`).

### The Logic:
Multiply by `-1` or simply put a minus sign `-` in front!

```javascript
// Purpose: return the mathematical opposite of a number
function opposite(number) {
  return -number;
}
```

---

## Kata 4: Return Negative (8 kyu)

### The Task:
In this simple assignment you are given a number and have to make it negative. But maybe the number is already negative?
- `makeNegative(1);` $\to$ `-1`
- `makeNegative(-5);` $\to$ `-5`
- `makeNegative(0);` $\to$ `0`

### The Logic:
If it is already negative or zero, leave it alone. If positive, turn it negative:

```javascript
// Purpose: guarantee a negative number using Math.abs
function makeNegative(num) {
  return -Math.abs(num);
}
```

---

## Kata 5: Sum of Positive (8 kyu)

### The Task:
You get an array of numbers, return the sum of all the positive ones.
Example: `[1, -4, 7, 12]` $\to$ $1 + 7 + 12 = 20$.
If the array is empty or has no positive numbers, return `0`.

### The Logic:
Use the **Accumulator pattern**:
1. Create `let sum = 0;`.
2. Loop through the array using `for...of`.
3. If the number is $> 0$, add it to `sum`.
4. Return `sum`.

```javascript
// Purpose: calculate the sum of positive numbers in an array
function positiveSum(arr) {
  let total = 0;
  for (const num of arr) {
    if (num > 0) {
      total += num;
    }
  }
  return total;
}

// Modern one-line version using filter and reduce:
const positiveSumModern = (arr) =>
  arr.filter((x) => x > 0).reduce((sum, x) => sum + x, 0);
```

---

## Kata 6: String Repeat (8 kyu)

### The Task:
Write a function that accepts an integer `n` and a string `s` as parameters, and returns a string of `s` repeated exactly `n` times.
- `repeatStr(3, "*")` $\to$ `"***"`
- `repeatStr(5, "Hello")` $\to$ `"HelloHelloHelloHelloHello"`

### The Logic:
JavaScript strings have a built-in `.repeat()` method!

```javascript
// Purpose: repeat a string n times
function repeatStr(n, s) {
  return s.repeat(n);
}
```

---

## Kata 7: Remove First and Last Character (8 kyu)

### The Task:
Create a function that removes the first and last characters of a string.
Example: `"eloquent"` $\to$ `"loquen"`.

### The Logic:
Use `.slice(1, -1)`.
- Index `1` skips the first character.
- Index `-1` stops before the last character.

```javascript
// Purpose: slice string excluding the first and last character
function removeChar(str) {
  return str.slice(1, -1);
}
```

---

## Kata 8: Square(n) Sum (8 kyu)

### The Task:
Complete the square sum function so that it squares each number passed into it and then sums the results together.
Example: `[1, 2, 2]` $\to$ $1^2 + 2^2 + 2^2 = 1 + 4 + 4 = 9$.

### The Logic:
```javascript
// Purpose: square each number and return the total sum
function squareSum(numbers) {
  let sum = 0;
  for (const num of numbers) {
    sum += num * num;
  }
  return sum;
}

// Modern reduce version:
const squareSumModern = (numbers) =>
  numbers.reduce((sum, num) => sum + num ** 2, 0);
```

---

## Kata 9: Find the Smallest Integer in the Array (8 kyu)

### The Task:
Given an array of integers, your solution should find the smallest integer.
Example: `[34, 15, 88, 2]` $\to$ `2`.

### The Logic:
Use `Math.min()` paired with the spread operator `...`:

```javascript
// Purpose: find smallest integer using Math.min and array spread
function findSmallestInt(args) {
  return Math.min(...args);
}
```

---

## Kata 10: Vowel Count (7 kyu)

### The Task:
Return the number (count) of vowels in the given string. We will consider `a, e, i, o, u` as vowels for this kata (but not `y`).

### The Logic:
```javascript
// Purpose: count vowels in string
function getCount(str) {
  let vowelsCount = 0;
  const vowels = "aeiou";

  for (const char of str) {
    if (vowels.includes(char)) {
      vowelsCount++;
    }
  }

  return vowelsCount;
}

// Modern one-line version:
const getCountModern = (str) =>
  str.split("").filter((ch) => "aeiou".includes(ch)).length;
```

