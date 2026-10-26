/**
 * CODESIGNAL GCA MOCK TEST (JAVASCRIPT)
 *
 * 70 minutes. Timer on. No notes. 4 questions.
 * Target: 3+ problems fully solved = 700+ PASSING SCORE.
 *
 * Run:  node the-gym-prep/practice/mock_test_gca.js
 */

// ===========================================================================
// QUESTION 1 (Warmup): Investment Growth in Years
// deposit grows by rate% each year. Return years until deposit > threshold.
// (100, 20, 170) -> 3
// ===========================================================================
function growthInYears(deposit, rate, threshold) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// QUESTION 2 (Data Manipulation): Most Common First Letter
// Return the first letter that appears most often. Break ties alphabetically.
// ["apple", "banana", "avocado", "blueberry", "cherry"] -> "a"
// ===========================================================================
function mostCommonFirstLetter(words) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// QUESTION 3 (Implementation / 2D Grid): Battleships Counter
// Count the number of ships on the board. A ship is connected 1s.
// Ships are rectangular, placed horizontally or vertically, separated by 0s.
// (Tip: count only the top-left cell of each ship!)
// ===========================================================================
function battleships(field) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// QUESTION 4 (Algorithmic / Hash Map): Longest Equal 0s and 1s Subarray
// Find the maximum length of a contiguous subarray with equal number of 0s and 1s.
// [0, 0, 1, 0, 1, 1, 1, 0] -> 8
// ===========================================================================
function longestEqualSubarray(nums) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// SELF-TESTS RUNNER (Calculates your GCA 4-problem score)
// ===========================================================================

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  return false;
}

const TESTS = [
  // Q1 tests
  [growthInYears, [100, 20, 170], 3],
  [growthInYears, [100, 1, 100], 1],

  // Q2 tests
  [mostCommonFirstLetter, [["apple", "banana", "avocado", "blueberry", "cherry"]], "a"],
  [mostCommonFirstLetter, [["kiwi"]], "k"],

  // Q3 tests
  [battleships, [[[1, 0, 0, 1], [1, 0, 0, 0], [1, 0, 1, 1], [0, 0, 0, 0]]], 3],
  [battleships, [[[0]]], 0],
  [battleships, [[[1]]], 1],

  // Q4 tests
  [longestEqualSubarray, [[0, 1]], 2],
  [longestEqualSubarray, [[0, 1, 0]], 2],
  [longestEqualSubarray, [[0, 0, 1, 0, 1, 1, 1, 0]], 8],
  [longestEqualSubarray, [[1, 1, 1]], 0]
];

console.log("\n=======================================================");
console.log("   CODESIGNAL GCA 70-MINUTE MOCK ASSESSMENT (JAVASCRIPT)");
console.log("=======================================================\n");

const failedFns = new Set();
let passedTests = 0;

for (const [fn, args, expected] of TESTS) {
  try {
    const actual = fn(...args);
    if (deepEqual(actual, expected)) {
      passedTests++;
      console.log(`  PASS: ${fn.name}(...) === ${JSON.stringify(expected)}`);
    } else {
      failedFns.add(fn.name);
      console.log(`  FAIL: ${fn.name}(...)`);
      console.log(`        Expected: ${JSON.stringify(expected)}`);
      console.log(`        Got:      ${JSON.stringify(actual)}`);
    }
  } catch (err) {
    failedFns.add(fn.name);
    console.log(`  ERROR in ${fn.name}: ${err.message}`);
  }
}

const allFns = new Set(TESTS.map(t => t[0].name));
const fullySolvedCount = [...allFns].filter(name => !failedFns.has(name)).length;

console.log("\n-------------------------------------------------------");
console.log(`Passed ${passedTests} / ${TESTS.length} test cases.`);
console.log(`PROBLEMS FULLY SOLVED: ${fullySolvedCount} / 4`);
if (fullySolvedCount >= 3) {
  console.log("STATUS: PASSING SCORE (700+ equivalent on CodeSignal GCA)!");
} else {
  console.log("STATUS: Keep practicing! Target 3+ fully solved for CodeSignal passing score.");
}
console.log("-------------------------------------------------------\n");
