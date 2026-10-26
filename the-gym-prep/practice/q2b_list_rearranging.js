/**
 * Q2B-STYLE: REARRANGING ARRAYS (Move, Remove, Reorder)
 *
 * The Big Idea: DON'T fight to edit arrays in-place.
 * BUILD A NEW ARRAY in the order you want, then return it!
 *
 * Run:  node the-gym-prep/practice/q2b_list_rearranging.js
 */

// 1. Move every 0 to the end, keeping the other numbers in their original order.
// [0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0]
function moveZerosToEnd(nums) {
  // YOUR CODE HERE
  return null;
}

// 2. Return a new array with every copy of `target` removed.
// ([1, 2, 3, 2], 2) -> [1, 3]
function removeAll(nums, target) {
  // YOUR CODE HERE
  return null;
}

// 3. All even numbers first, then all odd numbers. Keep original order within each group.
// [1, 2, 3, 4, 5, 6] -> [2, 4, 6, 1, 3, 5]
function evensThenOdds(nums) {
  // YOUR CODE HERE
  return null;
}

// 4. All negatives first, then everything else (0 and positives), order kept.
// [3, -1, 0, -5, 2] -> [-1, -5, 3, 0, 2]
function negativesFirst(nums) {
  // YOUR CODE HERE
  return null;
}

// 5. Keep only the FIRST appearance of each value, in order.
// [3, 1, 3, 2, 1] -> [3, 1, 2]
function removeDuplicatesKeepOrder(nums) {
  // YOUR CODE HERE
  return null;
}

// 6. Move the first k items to the end.
// ([1, 2, 3, 4, 5], 2) -> [3, 4, 5, 1, 2]
function rotateLeft(nums, k) {
  // YOUR CODE HERE
  return null;
}

// 7. Swap the first and last items. [1, 2, 3, 4] -> [4, 2, 3, 1]
function swapFirstLast(nums) {
  // YOUR CODE HERE
  return null;
}

// 8. Alternate items from two equal-length arrays, starting with a.
// ([1, 3, 5], [2, 4, 6]) -> [1, 2, 3, 4, 5, 6]
function interleave(a, b) {
  // YOUR CODE HERE
  return null;
}

// 9. Return [negatives, zeros, positives] - three arrays inside one array.
// [1, -2, 0, 3, 0, -4] -> [[-2, -4], [0, 0], [1, 3]]
function groupBySign(nums) {
  // YOUR CODE HERE
  return null;
}

// 10. Letters first, then digits. Keep the order within each group.
// "a1b2c3" -> "abc123"
function moveLettersToFront(s) {
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
  [moveZerosToEnd, [[0, 1, 0, 3, 12]], [1, 3, 12, 0, 0]],
  [moveZerosToEnd, [[0, 0]], [0, 0]],
  [moveZerosToEnd, [[1, 2]], [1, 2]],
  [removeAll, [[1, 2, 3, 2], 2], [1, 3]],
  [removeAll, [[1, 1, 1], 1], []],
  [evensThenOdds, [[1, 2, 3, 4, 5, 6]], [2, 4, 6, 1, 3, 5]],
  [evensThenOdds, [[1, 3]], [1, 3]],
  [negativesFirst, [[3, -1, 0, -5, 2]], [-1, -5, 3, 0, 2]],
  [removeDuplicatesKeepOrder, [[3, 1, 3, 2, 1]], [3, 1, 2]],
  [removeDuplicatesKeepOrder, [[1, 1, 1]], [1]],
  [rotateLeft, [[1, 2, 3, 4, 5], 2], [3, 4, 5, 1, 2]],
  [rotateLeft, [[1, 2, 3], 0], [1, 2, 3]],
  [swapFirstLast, [[1, 2, 3, 4]], [4, 2, 3, 1]],
  [swapFirstLast, [[1]], [1]],
  [interleave, [[1, 3, 5], [2, 4, 6]], [1, 2, 3, 4, 5, 6]],
  [groupBySign, [[1, -2, 0, 3, 0, -4]], [[-2, -4], [0, 0], [1, 3]]],
  [moveLettersToFront, ["a1b2c3"], "abc123"],
  [moveLettersToFront, ["abc"], "abc"]
];

let passed = 0;
console.log("\n==========================================");
console.log("   RUNNING Q2B ARRAY REARRANGING TESTS    ");
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

