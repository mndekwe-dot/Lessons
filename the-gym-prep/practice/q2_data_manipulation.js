/**
 * Q2-LEVEL PROBLEMS (Strings & Arrays Data Manipulation)
 * Target: 10-15 minutes each.
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/practice/q2_data_manipulation.js
 */

// 1. Return ALL strings of maximum length, keeping their order.
// ["aba", "aa", "ad", "vcd", "aba"] -> ["aba", "vcd", "aba"]
function allLongestStrings(words) {
  // YOUR CODE HERE
  return null;
}

// 2. Surround an array of strings with '*' (Real CodeSignal GCA problem).
// ["abc", "ded"] -> ["*****", "*abc*", "*ded*", "*****"]
function addBorder(picture) {
  // YOUR CODE HERE
  return null;
}

// 3. Square every number, return results sorted ascending.
// [-4, -1, 0, 3] -> [0, 1, 9, 16]
function sortedSquares(nums) {
  // YOUR CODE HERE
  return null;
}

// 4. Do the two words use exactly the same letters?
// ("listen", "silent") -> true, ("hello", "world") -> false
function isAnagram(a, b) {
  // YOUR CODE HERE
  return null;
}

// 5. Return the first character in s that is a digit. "var_1__int" -> "1"
function firstDigit(s) {
  // YOUR CODE HERE
  return null;
}

// 6. Alternating team weights (Real CodeSignal GCA problem).
// Players go alternately to team 1 and team 2.
// [50, 60, 60, 45, 70] -> [180, 105] (50+60+70, 60+45)
function alternatingSums(a) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// SELF-TESTS RUNNER
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
  [allLongestStrings, [["aba", "aa", "ad", "vcd", "aba"]], ["aba", "vcd", "aba"]],
  [allLongestStrings, [["a"]], ["a"]],
  [addBorder, [["abc", "ded"]], ["*****", "*abc*", "*ded*", "*****"]],
  [addBorder, [["a"]], ["***", "*a*", "***"]],
  [sortedSquares, [[-4, -1, 0, 3]], [0, 1, 9, 16]],
  [isAnagram, ["listen", "silent"], true],
  [isAnagram, ["hello", "world"], false],
  [firstDigit, ["var_1__int"], "1"],
  [firstDigit, ["q2q-q"], "2"],
  [alternatingSums, [[50, 60, 60, 45, 70]], [180, 105]]
];

let passed = 0;
console.log("\n==========================================");
console.log("   RUNNING Q2 DATA MANIPULATION TESTS     ");
console.log("==========================================\n");

for (const [fn, args, expected] of TESTS) {
  try {
    const actual = fn(...args);
    if (deepEqual(actual, expected)) {
      passed++;
      console.log(`  PASS: ${fn.name}(${args.map((a) => JSON.stringify(a)).join(", ")}) === ${JSON.stringify(expected)}`);
    } else {
      console.log(`  FAIL: ${fn.name}(${args.map((a) => JSON.stringify(a)).join(", ")})`);
      console.log(`        Expected: ${JSON.stringify(expected)}`);
      console.log(`        Got:      ${JSON.stringify(actual)}`);
    }
  } catch (err) {
    console.log(`  ERROR in ${fn.name}: ${err.message}`);
  }
}

console.log("\n------------------------------------------");
console.log(`SCORE: ${passed} / ${TESTS.length} tests passed.`);
console.log("------------------------------------------\n");
