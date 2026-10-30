# 12 — Mock Technical Interview Simulation

Run this 45-minute mock simulation before your real interview at **The Gym**.

---

## Instructions:
1. **Set a timer for 45 minutes.**
2. **Do not use Google or AI.**
3. **Speak out loud in English** during Part 1 and Part 2 (as if an interviewer is sitting opposite you).
4. Score yourself using the rubric at the bottom.

---

## Part 1: Spoken Theory Questions (15 Minutes)

Speak your answer out loud in English. Aim for 60 to 90 seconds per answer.

### Question 1:
*"Can you explain the difference between `let`, `const`, and `var` in JavaScript?"*

### Question 2:
*"What happens if I write `console.log(5 == "5")` versus `console.log(5 === "5")`? Which one should developers use, and why?"*

### Question 3:
*"What are the falsy values in JavaScript? Is an empty array `[]` truthy or falsy?"*

### Question 4:
*"What is a closure in JavaScript? Can you give an example of why it is useful?"*

### Question 5:
*"If I have an array `const numbers = [10, 5, 20, 1]`, what does `numbers.sort()` produce? How do I sort it correctly?"*

---

## Part 2: Practical Live Coding Challenge (30 Minutes)

Open your terminal or editor and write the code for these two problems without using internet searches. Test them using Node.js.

### Challenge 1 (8 kyu Level — 12 Minutes):
**Title:** Sum of Multiples
**Task:**
Write a function `sumOfMultiples(n, m)` that takes two positive integers and returns the sum of all positive multiples of `n` that are strictly less than `m`.
If `n >= m` or either number is invalid, return `0`.

*Examples:*
- `sumOfMultiples(2, 9)` $\to$ Multiples of 2 below 9 are: $2, 4, 6, 8 \to 2 + 4 + 6 + 8 = 20$.
- `sumOfMultiples(3, 13)` $\to$ Multiples of 3 below 13 are: $3, 6, 9, 12 \to 30$.
- `sumOfMultiples(4, 4)` $\to$ `0`.

---

### Challenge 2 (7 kyu Level — 18 Minutes):
**Title:** Disemvowel Trolls
**Task:**
Trolls are attacking your comment section! A common way to deal with this situation is to remove all of the vowels from the trolls' comments, neutralizing the threat.
Write a function `disemvowel(str)` that takes a string and returns a new string with all vowels (`a, e, i, o, u`, both uppercase and lowercase) removed.

*Examples:*
- `disemvowel("This website is for losers LOL!")` $\to$ `"Ths wbst s fr lsrs LL!"`
- `disemvowel("No offense but, Your writing is among the worst I've ever read")` $\to$ `"N ffns bt, Yr wrtng s mng th wrst 'v vr rd"`

---

## Solutions & Scoring Rubric

### Scoring (Total: 100 Points)
- **Part 1 (Theory):** 10 points per question (Total: 50 points)
  - 10 points: Clear, accurate answer spoken smoothly in English.
  - 5 points: Correct concept, but struggled with explanation or English vocabulary.
  - 0 points: Incorrect or blank.
- **Part 2 (Coding):** 25 points per challenge (Total: 50 points)
  - 25 points: Working code that passes all examples and handles edge cases.
  - 15 points: Working logic, but syntax error or off-by-one bug.
  - 0 points: Incomplete.

**Passing Score for The Gym:** **75 / 100** or higher.

---

### Solution for Challenge 1:
```javascript
// Purpose: sum all positive multiples of n strictly below m
function sumOfMultiples(n, m) {
  if (n <= 0 || m <= 0 || n >= m) {
    return 0;
  }

  let total = 0;
  for (let i = n; i < m; i += n) {
    total += i;
  }
  return total;
}

console.log(sumOfMultiples(2, 9));  // 20
console.log(sumOfMultiples(3, 13)); // 30
console.log(sumOfMultiples(4, 4));  // 0
```

### Solution for Challenge 2:
```javascript
// Purpose: remove all vowels from text
function disemvowel(str) {
  const vowels = "aeiouAEIOU";
  let result = "";

  for (const char of str) {
    if (!vowels.includes(char)) {
      result += char;
    }
  }

  return result;
}

// Alternative modern one-liner:
const disemvowelModern = (str) =>
  str.split("").filter(ch => !"aeiouAEIOU".includes(ch)).join("");

console.log(disemvowel("This website is for losers LOL!"));
// Output: "Ths wbst s fr lsrs LL!"
```

