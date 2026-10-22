# 07 — Udacity "Intro to JavaScript" (ud803) Complete Notes

The Gym explicitly recommends the Udacity course **"Intro to JavaScript" (Course code: ud803)**. Because some applicants experience access issues on Udacity, this guide summarizes every lesson, quiz, and concept taught in that course in simple teaching English.

---

## Table of Contents
1. [Lesson 1: What is JavaScript?](#lesson-1-what-is-javascript)
2. [Lesson 2: Data Types & Variables](#lesson-2-data-types--variables)
3. [Lesson 3: Conditionals (if, else, switch, ternary)](#lesson-3-conditionals-if-else-switch-ternary)
4. [Lesson 4: Loops (while, for, factorials)](#lesson-4-loops-while-for-factorials)
5. [Lesson 5: Functions & Scope](#lesson-5-functions--scope)
6. [Lesson 6: Arrays](#lesson-6-arrays)
7. [Lesson 7: Objects](#lesson-7-objects)
8. [Udacity Quiz Traps to Watch For](#udacity-quiz-traps-to-watch-for)

---

## Lesson 1: What is JavaScript?

- **HTML** provides the structure (the skeleton).
- **CSS** provides the styling (the skin and clothes).
- **JavaScript** provides the behavior and interactivity (the muscles and brain).

JavaScript runs directly inside web browsers and on servers using **Node.js**.

---

## Lesson 2: Data Types & Variables

Udacity covers the core building blocks:
- **Numbers:** Integers and decimals (`10`, `3.14`, `-5`).
- **Strings:** Characters in quotes (`"Hello"`, `'World'`).
  - Concatenation: `"Hello " + "World"` $\to$ `"Hello World"`.
  - Escaping characters: `"He said \"Hello\""`.
- **Booleans:** `true` or `false` (all lowercase).
- **Null & Undefined:**
  - `undefined`: Variable declared but never given a value.
  - `null`: Explicitly set to empty.
- **Variables:** `let` for values that change, `const` for values that stay constant.

### Key Udacity Exercises from Lesson 2:
```javascript
// Purpose: converting Celsius to Fahrenheit (Lesson 2 Quiz)
// Formula: F = C * 1.8 + 32
const celsius = 12;
const fahrenheit = celsius * 1.8 + 32;
console.log(fahrenheit); // 53.6

// Purpose: string indexing and length (Lesson 2 Quiz)
const quote = "Stay hungry, stay foolish.";
console.log(quote.length); // 26
console.log(quote[0]);     // "S"
```

---

## Lesson 3: Conditionals (if, else, switch, ternary)

### 1. `if...else` Flow
```javascript
const price = 15;
const money = 20;

if (money >= price) {
  console.log("Purchase successful!");
} else {
  console.log("Not enough money.");
}
```

### 2. Logical Operators
- `&&` (AND): Both conditions must be true.
- `||` (OR): At least one condition must be true.
- `!` (NOT): Inverts boolean.

### 3. The `switch` Statement (Udacity Favorite)
Used when comparing one variable against multiple exact values:
```javascript
// Purpose: assign education level based on years in school
const option = 3;

switch (option) {
  case 1:
    console.log("High school diploma");
    break;
  case 2:
    console.log("Associate's degree");
    break;
  case 3:
    console.log("Bachelor's degree");
    break;
  default:
    console.log("No degree selected");
}
// Always include 'break;' after each case, or it falls through to the next case!
```

---

## Lesson 4: Loops (while, for, factorials)

### The While Loop Countdown:
```javascript
// Purpose: NASA-style countdown from 10 to 0 (Udacity Quiz)
let num = 10;

while (num >= 0) {
  if (num === 10) {
    console.log("T-minus 10 seconds");
  } else if (num === 0) {
    console.log("Solid rocket booster ignition and liftoff!");
  } else {
    console.log("T-minus " + num + " seconds");
  }
  num--;
}
```

### The For Loop Factorial:
```javascript
// Purpose: calculate 12! using a for loop (Udacity Quiz)
let solution = 1;
for (let i = 12; i >= 1; i--) {
  solution *= i;
}
console.log("12! =", solution); // 479001600
```

---

## Lesson 5: Functions & Scope

### 1. Declaring vs Calling Functions
```javascript
// Declaration
function laugh(num) {
  let sound = "";
  for (let i = 0; i < num; i++) {
    sound += "ha";
  }
  return sound + "!";
}

// Call
console.log(laugh(3)); // "hahaha!"
```

### 2. Shadowing and Scope
If an inner function declares a variable with the same name as an outer variable, it "shadows" (overrides) the outer variable inside its own block:
```javascript
let bookTitle = "Pride and Prejudice"; // Global

function displayBook() {
  let bookTitle = "To Kill a Mockingbird"; // Shadows global variable
  console.log(bookTitle); // "To Kill a Mockingbird"
}

displayBook();
console.log(bookTitle); // "Pride and Prejudice"
```

---

## Lesson 6: Arrays

### Array Basics:
```javascript
const donuts = ["glazed", "powdered", "jelly"];

// Length
console.log(donuts.length); // 3

// Adding & Removing
donuts.push("chocolate"); // Adds to end
donuts.pop();             // Removes from end

// Splice (start, deleteCount, ...itemsToAdd)
donuts.splice(1, 1, "cinnamon"); // Replaces "powdered" with "cinnamon"
console.log(donuts); // ["glazed", "cinnamon", "jelly"]
```

### The `forEach()` Method (Udacity Core Concept):
```javascript
// Purpose: loop over array with forEach
const testScores = [12, 929, 11, 3, 199, 1000];

testScores.forEach(function (score, index) {
  if (score % 3 === 0) {
    testScores[index] += 100;
  }
});
```

---

## Lesson 7: Objects

### Creating and Modifying Objects:
```javascript
// Purpose: umbrella object with open and close methods (Udacity Quiz)
const umbrella = {
  color: "pink",
  isOpen: false,
  open: function () {
    if (this.isOpen) {
      return "The umbrella is already open!";
    } else {
      this.isOpen = true;
      return "Julia opens the umbrella!";
    }
  },
  close: function () {
    if (!this.isOpen) {
      return "The umbrella is already closed!";
    } else {
      this.isOpen = false;
      return "Julia closes the umbrella!";
    }
  },
};

console.log(umbrella.open());
console.log(umbrella.isOpen); // true
```

---

## Udacity Quiz Traps to Watch For

1. **Missing `break` in `switch`:** If you forget `break;`, JavaScript keeps executing the next case even if it doesn't match!
2. **Missing `return` in functions:** A function without `return` gives `undefined`.
3. **The difference between `==` and `===`:** Always use `===`.
4. **Modulo `%`:** Remainder after division (`10 % 3 = 1`).

