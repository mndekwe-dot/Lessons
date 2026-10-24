/**
 * DRILLS — The Ternary Operator (? :)
 *
 * The ternary operator is the clean 1-line shortcut for if...else statements.
 * Formula: condition ? valueIfTrue : valueIfFalse;
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/practice/drills_ternary.js
 */

// ===========================================================================
// SECTION 1: BASIC IF/ELSE REPLACEMENTS
// ===========================================================================

// 1.1 Return "even" if n is even, "odd" if odd. 4 -> "even", 7 -> "odd"
function evenOrOddTernary(n) {
  // YOUR CODE HERE
  return null;
}

// 1.2 Return "adult" if age >= 18, otherwise "minor". 20 -> "adult", 15 -> "minor"
function checkAgeTernary(age) {
  // YOUR CODE HERE
  return null;
}

// 1.3 Return "PASS" if score >= 50, otherwise "FAIL". 75 -> "PASS", 40 -> "FAIL"
function passOrFail(score) {
  // YOUR CODE HERE
  return null;
}

// 1.4 Absolute value: if n is negative, return -n, else return n. -5 -> 5, 12 -> 12
function absoluteTernary(n) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// SECTION 2: COMPARISONS & MAX/MIN
// ===========================================================================

// 2.1 Return the larger of two numbers. (10, 25) -> 25
function maxOfTwo(a, b) {
  // YOUR CODE HERE
  return null;
}

// 2.2 Return the smaller of two numbers. (10, 25) -> 10
function minOfTwo(a, b) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// SECTION 3: STRINGS & PLURALIZATION
// ===========================================================================

// 3.1 Pluralize: 1 -> "1 item", 3 -> "3 items", 0 -> "0 items"
function pluralizeItem(count) {
  // YOUR CODE HERE
  return null;
}

// 3.2 If name is empty string "", return "Guest", otherwise return name. "Ama" -> "Ama", "" -> "Guest"
function defaultName(name) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// SECTION 4: CHAINED TERNARY (MULTI-WAY IF/ELSE IF/ELSE)
// ===========================================================================

// 4.1 Return "positive", "negative", or "zero". 5 -> "positive", -3 -> "negative", 0 -> "zero"
function numberSign(n) {
  // YOUR CODE HERE
  return null;
}

// 4.2 Grade: score >= 80 -> "A", score >= 60 -> "B", otherwise "F". 85 -> "A", 65 -> "B", 40 -> "F"
function letterGrade(score) {
  // YOUR CODE HERE
  return null;
}

// ===========================================================================
// SECTION 5: TERNARY INSIDE ARRAY METHODS
// ===========================================================================

// 5.1 Given array of numbers, return array of "EVEN" or "ODD" strings using .map() and ternary.
// [1, 2, 3] -> ["ODD", "EVEN", "ODD"]
function mapEvenOrOdd(arr) {
  // YOUR CODE HERE
  return null;
}

// 5.2 Cap values at max 100: [40, 150, 80, 200] -> [40, 100, 80, 100] using .map() and ternary.
function clampMax100(arr) {
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
  [evenOrOddTernary, [4], "even"],
  [evenOrOddTernary, [7], "odd"],
  [checkAgeTernary, [20], "adult"],
  [checkAgeTernary, [15], "minor"],
  [passOrFail, [75], "PASS"],
  [passOrFail, [40], "FAIL"],
  [absoluteTernary, [-5], 5],
  [absoluteTernary, [12], 12],
  [maxOfTwo, [10, 25], 25],
  [maxOfTwo, [50, 20], 50],
  [minOfTwo, [10, 25], 10],
  [minOfTwo, [5, 99], 5],
  [pluralizeItem, [1], "1 item"],
  [pluralizeItem, [3], "3 items"],
  [pluralizeItem, [0], "0 items"],
  [defaultName, ["Ama"], "Ama"],
  [defaultName, [""], "Guest"],
  [numberSign, [5], "positive"],
  [numberSign, [-3], "negative"],
  [numberSign, [0], "zero"],
  [letterGrade, [85], "A"],
  [letterGrade, [65], "B"],
  [letterGrade, [40], "F"],
  [mapEvenOrOdd, [[1, 2, 3]], ["ODD", "EVEN", "ODD"]],
  [clampMax100, [[40, 150, 80, 200]], [40, 100, 80, 100]]
];

let passed = 0;
console.log("\n==========================================");
console.log("   RUNNING TERNARY OPERATOR DRILLS TESTS   ");
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
if (passed === TESTS.length) {
  console.log("CONGRATULATIONS! YOU HAVE MASTERED THE TERNARY OPERATOR!");
} else {
  console.log("Keep practicing! Fill in the remaining drills.");
}
console.log("------------------------------------------\n");
