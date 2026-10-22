/**
 * THE GYM RWANDA — REAL CODEWARS KATAS PRACTICE SUITE
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/practice/codewars_practice.js
 *
 * These 10 problems represent classic 8 kyu and 7 kyu Codewars challenges.
 * Fill in each function, then run the script to test your code!
 */

// =========================================================================
// KATA 1 (8 kyu): Multiply
// Fix the function so it multiplies a and b and returns the result.
// =========================================================================
function multiply(a, b) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 2 (8 kyu): Even or Odd
// Return "Even" for even numbers, "Odd" for odd numbers.
// =========================================================================
function evenOrOdd(number) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 3 (8 kyu): Opposite number
// Given an integer or float, return its opposite (1 -> -1, -34 -> 34).
// =========================================================================
function opposite(number) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 4 (8 kyu): Return Negative
// Given a number, make it negative. (1 -> -1, -5 -> -5, 0 -> 0)
// =========================================================================
function makeNegative(num) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 5 (8 kyu): Sum of positive
// Return the sum of all positive numbers in an array. ([1, -4, 7, 12] -> 20)
// Return 0 if array is empty or has no positive numbers.
// =========================================================================
function positiveSum(arr) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 6 (8 kyu): String repeat
// Repeat string s exactly n times. (3, "*") -> "***"
// =========================================================================
function repeatStr(n, s) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 7 (8 kyu): Remove First and Last Character
// Remove first and last characters from string. ("eloquent" -> "loquen")
// =========================================================================
function removeChar(str) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 8 (8 kyu): Square(n) Sum
// Square each number and return the sum. ([1, 2, 2] -> 1^2 + 2^2 + 2^2 = 9)
// =========================================================================
function squareSum(numbers) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 9 (8 kyu): Find the smallest integer in the array
// Given an array of integers, return the smallest one. ([34, 15, 88, 2] -> 2)
// =========================================================================
function findSmallestInt(args) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// KATA 10 (7 kyu): Vowel Count
// Return the count of vowels (a, e, i, o, u) in string. ("abracadabra" -> 5)
// =========================================================================
function getCount(str) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// TEST RUNNER
// =========================================================================
const TESTS = [
  { name: "Kata 1: Multiply", fn: () => multiply(4, 5), expected: 20 },
  { name: "Kata 2: Even or Odd (even)", fn: () => evenOrOdd(2), expected: "Even" },
  { name: "Kata 2: Even or Odd (odd)", fn: () => evenOrOdd(7), expected: "Odd" },
  { name: "Kata 3: Opposite number", fn: () => opposite(-34), expected: 34 },
  { name: "Kata 4: Return Negative (pos)", fn: () => makeNegative(1), expected: -1 },
  { name: "Kata 4: Return Negative (already neg)", fn: () => makeNegative(-5), expected: -5 },
  { name: "Kata 4: Return Negative (zero)", fn: () => makeNegative(0), expected: 0 },
  { name: "Kata 5: Sum of positive", fn: () => positiveSum([1, -4, 7, 12]), expected: 20 },
  { name: "Kata 5: Sum of positive (empty)", fn: () => positiveSum([]), expected: 0 },
  { name: "Kata 6: String repeat", fn: () => repeatStr(3, "*"), expected: "***" },
  { name: "Kata 7: Remove First and Last Char", fn: () => removeChar("country"), expected: "ountr" },
  { name: "Kata 8: Square(n) Sum", fn: () => squareSum([1, 2, 2]), expected: 9 },
  { name: "Kata 9: Find smallest int", fn: () => findSmallestInt([78, 56, 232, 12, 8]), expected: 8 },
  { name: "Kata 10: Vowel Count", fn: () => getCount("abracadabra"), expected: 5 },
];

function runTests() {
  let passed = 0;
  console.log("=================================================");
  console.log("   THE GYM — CODEWARS KATA PRACTICE SUITE       ");
  console.log("=================================================\n");

  for (const t of TESTS) {
    let result;
    try {
      result = t.fn();
    } catch (err) {
      result = `ERROR: ${err.message}`;
    }

    const isMatch =
      JSON.stringify(result) === JSON.stringify(t.expected);

    if (isMatch) {
      passed++;
      console.log(`[PASS] ${t.name} -> ${JSON.stringify(result)}`);
    } else {
      console.log(`[FAIL] ${t.name} -> got ${JSON.stringify(result)}, expected ${JSON.stringify(t.expected)}`);
    }
  }

  console.log("\n-------------------------------------------------");
  console.log(`Score: ${passed}/${TESTS.length} tests passed`);
  if (passed === TESTS.length) {
    console.log("ALL GREEN! You are ready to crush the Codewars live interview!");
  } else {
    console.log("Keep going! Fill in the functions above and rerun!");
  }
}

runTests();

