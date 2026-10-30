# 05 — Technical & Personal Interview Q&A

This guide prepares you for both parts of **The Gym assessment**:
1. **The Technical Interview:** Theoretical questions testing your understanding of JavaScript fundamentals.
2. **The Personal Interview:** Questions assessing your motivation, commitment, and spoken English communication.

Every answer is written in **clear, conversational English** so you can practice saying it out loud.

---

## Part 1: Technical Interview (JavaScript Fundamentals)

---

### Question 1: What is the difference between `var`, `let`, and `const`?

**Model Answer to Speak:**
> *"The main differences are in reassignability and scope:*
> 1. *`const` is for variables that should never be reassigned. It is block-scoped.*
> 2. *`let` is for variables that can be reassigned later, like a counter in a loop. It is also block-scoped.*
> 3. *`var` is the older way from before ES6. It is function-scoped rather than block-scoped, and it can be hoisted in confusing ways. In modern development, we avoid `var` and use `const` by default, and `let` only when values need to change."*

**Quick Code Proof:**
```javascript
let count = 1;
count = 2; // Allowed

const pi = 3.14;
// pi = 3; // Error!
```

---

### Question 2: What is the difference between `==` and `===`?

**Model Answer to Speak:**
> *"The operator `===` is strict equality, while `==` is loose equality:*
> - *Strict equality `===` checks both the value and the data type. If the types are different, it immediately returns false.*
> - *Loose equality `==` performs type coercion behind the scenes, meaning it tries to convert the variables to the same type before comparing.*
> *In production code, we always prefer `===` because it prevents unexpected bugs."*

**Quick Code Proof:**
```javascript
5 === "5"; // false (number vs string)
5 == "5";  // true  (coerces string to number)
```

---

### Question 3: What is the difference between `null` and `undefined`?

**Model Answer to Speak:**
> *"Both represent an absence of value, but with different intentions:*
> - *`undefined` means a variable has been declared, but has not yet been assigned any value.*
> - *`null` is an intentional assignment representing an empty or non-existent value.*
> *Also, `typeof undefined` is `'undefined'`, while `typeof null` returns `'object'`, which is a known historical bug in JavaScript."*

---

### Question 4: What are truthy and falsy values? Can you list the falsy values?

**Model Answer to Speak:**
> *"In JavaScript, any value evaluated inside a boolean context (like an `if` condition) converts to either true or false. Values that convert to false are called falsy, and everything else is truthy.*
> *There are six primary falsy values in JavaScript:*
> 1. *`false`*
> 2. *`0` (and `-0`)*
> 3. *Empty string `""`*
> 4. *`null`*
> 5. *`undefined`*
> 6. *`NaN` (Not-a-Number)*
> *Importantly, empty arrays `[]` and empty objects `{}` are truthy."*

---

### Question 5: What is a closure in JavaScript?

**Model Answer to Speak:**
> *"A closure is when an inner function retains access to variables from its outer parent function, even after the parent function has finished executing.*
> *It allows functions to maintain private state. A classic example is a counter function that increments a private variable every time it is called."*

**Quick Code Proof:**
```javascript
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const myCounter = makeCounter();
myCounter(); // 1
myCounter(); // 2
```

---

### Question 6: What is the difference between `forEach()` and `map()`?

**Model Answer to Speak:**
> *"Both iterate over an array, but:*
> - *`map()` creates and returns a brand-new array containing the transformed results of each element.*
> - *`forEach()` simply executes a function on each item for side effects (like logging or saving to a database) and returns `undefined`.*
> *If you want to transform data, use `map()`. If you just want to perform an action, use `forEach()`."*

---

### Question 7: What is the difference between `slice()` and `splice()`?

**Model Answer to Speak:**
> *"The key difference is whether the original array is modified:*
> - *`slice()` is non-destructive. It returns a shallow copy of a portion of an array without changing the original array.*
> - *`splice()` is destructive. It modifies the original array by adding, removing, or replacing elements directly in place."*

---

### Question 8: How do primitive types differ from reference types?

**Model Answer to Speak:**
> *"Primitive types (like numbers, strings, and booleans) are copied by value. When you assign one variable to another, a completely independent copy is created in memory.*
> *Reference types (like objects and arrays) are copied by reference. The variable only stores a memory pointer to where the object lives. Assigning it to another variable copies the pointer, meaning changes made through one variable affect the original object."*

---

### Question 9: How do you check if a variable is an array in JavaScript?

**Model Answer to Speak:**
> *"Because `typeof []` returns `'object'`, you cannot use `typeof` to check for arrays. The standard and safe method is using `Array.isArray(variable)`."*

**Quick Code Proof:**
```javascript
Array.isArray([1, 2, 3]); // true
Array.isArray({ a: 1 });  // false
```

---

## Part 2: Personal Interview & English Assessment

The interviewers want to see that you are enthusiastic, communicate clearly in English, and can commit 20–25 hours per week.

---

### Question 1: "Tell me about yourself."

**Structure:** Present $\to$ Past $\to$ Future (Keep it to 60–90 seconds).

**Model Answer:**
> *"Hello! My name is [Your Name]. I am currently a student at [Your University], studying [Your Course/Faculty].*
> *Over the past months, I have been building solid foundations in software development and algorithms, primarily solving algorithmic challenges in Python and JavaScript on CodeWars.*
> *I am passionate about building real-world digital solutions, and I am excited about the opportunity to join The Gym to work on practical team projects and grow into a professional software engineer."*

---

### Question 2: "Why do you want to join The Gym?"

**Key points to mention:** Practical teamwork, coaching, and real industry preparation.

**Model Answer:**
> *"I want to join The Gym because of its hands-on approach to learning. While university teaches theory, The Gym focuses on real project work in groups of 5, weekly one-on-one coaching, and international software development standards.*
> *I know that The Gym produces some of the most capable developers in Rwanda, and I want to be in an environment that challenges me and helps me reach my full potential."*

---

### Question 3: "The Gym requires 20–25 hours a week. How will you manage your university studies alongside this training?"

**Key points to mention:** Time management, discipline, and organized scheduling.

**Model Answer:**
> *"I have already planned my schedule carefully. I treat my university classes and this traineeship as top priorities.*
> *By dedicating evenings and weekends to project work and self-study, and by keeping a consistent daily routine, I am fully prepared to invest the required 20 to 25 hours every week without falling behind in my academic work."*

---

## Final Interview Tips

1. **Think aloud during the live coding challenge:**
   Never sit in silence for 5 minutes. Explain your thought process to the interviewer:
   *"First, I will initialize a counter to zero... then I will loop over the string..."*
2. **Clarify edge cases before typing:**
   Ask: *"Can the input array be empty? Can numbers be negative?"* This shows maturity.
3. **Speak calmly and clearly in English:**
   Take a breath before answering. It is completely okay to pause for 2 seconds to structure your thoughts.

