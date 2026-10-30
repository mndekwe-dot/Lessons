/**
 * DRILLS — Common JavaScript Mistakes
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/01-foundations/4-drills-common-mistakes.js
 *
 * Each function below has a common beginner trap or bug.
 * Fix the implementation so that all self-tests pass!
 */

// =========================================================================
// MISTAKE 1: Number sorting trap
// Fix this so it returns numbers sorted in ASCENDING order (smallest to largest).
// =========================================================================
function fixSortAscending(nums) {
  // BUG: nums.sort() sorts alphabetically!
  // YOUR FIX HERE:
  return null;
}

// =========================================================================
// MISTAKE 2: Number sorting in DESCENDING order
// Return numbers sorted from largest to smallest.
// =========================================================================
function fixSortDescending(nums) {
  // YOUR CODE HERE:
  return null;
}

// =========================================================================
// MISTAKE 3: String number addition trap ("5" + 2 = "52")
// Take a string representing a number and an integer, and return their NUMERIC sum.
// ("5", 2) -> 7  (NOT "52"!)
// =========================================================================
function fixAddStringNumber(strNum, intNum) {
  // YOUR CODE HERE:
  return null;
}

// =========================================================================
// MISTAKE 4: Integer division trap (7 // 2 is NOT valid in JS)
// Divide a by b and return the whole integer rounded down. (7, 2) -> 3
// =========================================================================
function fixIntegerDivision(a, b) {
  // YOUR CODE HERE:
  return null;
}

// =========================================================================
// MISTAKE 5: Array copying without mutation
// Return a copy of the array with item x appended, WITHOUT changing the original!
// =========================================================================
function fixPureAppend(arr, x) {
  // BUG: arr.push(x) mutates the original array!
  // Return a new independent copy with x added.
  // YOUR CODE HERE:
  return null;
}

// =========================================================================
// MISTAKE 6: Early return in loop trap
// Return true if the array contains ANY even number, false otherwise.
// Make sure it doesn't return false on the first odd number!
// =========================================================================
function fixContainsEven(nums) {
  // YOUR CODE HERE:
  return null;
}

// =========================================================================
// MISTAKE 7: Bracket notation for dynamic object keys
// Given an object and a key variable, return the value of that property.
// =========================================================================
function fixDynamicAccess(obj, keyName) {
  // BUG: obj.keyName looks for literal property "keyName"!
  // YOUR CODE HERE:
  return null;
}

// =========================================================================
// MISTAKE 8: Length property vs method
// Return the number of characters in a string.
// =========================================================================
function fixStringLength(str) {
  // YOUR CODE HERE:
  return null;
}

// =========================================================================
// TEST SUITE
// =========================================================================
const TESTS = [
  { name: "fixSortAscending", fn: () => fixSortAscending([10, 5, 20, 1]), expected: [1, 5, 10, 20] },
  { name: "fixSortDescending", fn: () => fixSortDescending([10, 5, 20, 1]), expected: [20, 10, 5, 1] },
  { name: "fixAddStringNumber", fn: () => fixAddStringNumber("5", 2), expected: 7 },
  { name: "fixIntegerDivision", fn: () => fixIntegerDivision(7, 2), expected: 3 },
  {
    name: "fixPureAppend (leaves original intact)",
    fn: () => {
      const orig = [1, 2];
      const res = fixPureAppend(orig, 3);
      return { res, origLength: orig.length };
    },
    expected: { res: [1, 2, 3], origLength: 2 }
  },
  { name: "fixContainsEven (has even later)", fn: () => fixContainsEven([1, 3, 5, 8]), expected: true },
  { name: "fixContainsEven (all odd)", fn: () => fixContainsEven([1, 3, 5, 7]), expected: false },
  { name: "fixDynamicAccess", fn: () => fixDynamicAccess({ score: 95, name: "Ama" }, "score"), expected: 95 },
  { name: "fixStringLength", fn: () => fixStringLength("Kigali"), expected: 6 },
];

function runTests() {
  let passed = 0;
  console.log("=================================================");
  console.log("   THE GYM — COMMON JS MISTAKES DRILLS          ");
  console.log("=================================================\n");

  for (const t of TESTS) {
    let result;
    try {
      result = t.fn();
    } catch (err) {
      result = `ERROR: ${err.message}`;
    }

    const isMatch = JSON.stringify(result) === JSON.stringify(t.expected);

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
    console.log("ALL GREEN! You have eliminated the top 8 JavaScript interview bugs!");
  } else {
    console.log("Keep going! Fix the functions above and rerun!");
  }
}

runTests();

