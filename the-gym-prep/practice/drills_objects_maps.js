/**
 * DRILLS — Objects, Dictionaries and Sets in JavaScript
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/practice/drills_objects_maps.js
 *
 * Fill in your code where it says "// YOUR CODE HERE", then run the file
 * to see your test score improve from 0/7 to 7/7!
 */

// =========================================================================
// 1. Safe Property Lookup (like Python dict.get(key, fallback))
// Return the value of obj[key], or fallback if key is not in obj.
// =========================================================================
function safeGet(obj, key, fallback = 0) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// 2. Character Frequency Counter (The Tally Sheet)
// Count occurrences of each character in str. "aba" -> { a: 2, b: 1 }
// =========================================================================
function countChars(str) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// 3. Most Frequent Character
// Return the character that appears most often in str. "banana" -> "a"
// =========================================================================
function mostFrequent(str) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// 4. Merge Two Objects (like Python {**a, **b})
// Return a new object combining obj1 and obj2. obj2 properties override obj1.
// =========================================================================
function mergeObjects(obj1, obj2) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// 5. Invert Keys and Values
// Swap keys and values: { a: "1", b: "2" } -> { "1": "a", "2": "b" }
// =========================================================================
function invertObj(obj) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// 6. Remove Duplicates using a Set
// Given an array with duplicates, return an array with unique items only.
// [1, 2, 2, 3, 1] -> [1, 2, 3]
// =========================================================================
function uniqueItems(arr) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// 7. Array Intersection (Common Elements)
// Return an array of items present in BOTH arr1 and arr2.
// ([1, 2, 3], [2, 3, 4]) -> [2, 3]
// =========================================================================
function commonItems(arr1, arr2) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// TEST SUITE
// =========================================================================
const TESTS = [
  { name: "safeGet (exists)", fn: () => safeGet({ score: 90 }, "score", 0), expected: 90 },
  { name: "safeGet (missing)", fn: () => safeGet({ score: 90 }, "age", 0), expected: 0 },
  { name: "countChars", fn: () => countChars("banana"), expected: { b: 1, a: 3, n: 2 } },
  { name: "mostFrequent", fn: () => mostFrequent("banana"), expected: "a" },
  { name: "mergeObjects", fn: () => mergeObjects({ a: 1, b: 2 }, { b: 99, c: 3 }), expected: { a: 1, b: 99, c: 3 } },
  { name: "invertObj", fn: () => invertObj({ a: "1", b: "2" }), expected: { "1": "a", "2": "b" } },
  { name: "uniqueItems", fn: () => uniqueItems([1, 2, 2, 3, 1]), expected: [1, 2, 3] },
  { name: "commonItems", fn: () => commonItems([1, 2, 3], [2, 3, 4]), expected: [2, 3] },
];

function runTests() {
  let passed = 0;
  console.log("=================================================");
  console.log("   THE GYM — OBJECTS, MAPS & SETS DRILLS        ");
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
    console.log("ALL GREEN! Fantastic work with objects and sets!");
  } else {
    console.log("Keep going! Fill in the functions above and rerun!");
  }
}

runTests();

