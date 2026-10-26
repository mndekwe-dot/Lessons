/**
 * Q4-LEVEL PROBLEMS (Algorithmic Optimization & Hash Maps)
 * Target: 20-25 minutes each.
 *
 * Q4 tests efficiency: Objects/Sets, Sliding Windows, Two Pointers, and Running Totals.
 *
 * Run:  node the-gym-prep/practice/q4_problem_solving.js
 */

// 1. The value that appears most often. [3,1,3,2,3,1] -> 3
function mostFrequent(nums) {
  // YOUR CODE HERE
  return null;
}

// 2. Is there a duplicate pair at index distance <= k?
// ([1,2,3,1], 3) -> true, ([1,2,3,1], 2) -> false
function containsCloseDuplicates(nums, k) {
  // YOUR CODE HERE
  return null;
}

// 3. Values present in BOTH arrays, no duplicates, sorted ascending.
// ([1,2,2,3], [2,3,4]) -> [2,3]
function commonElements(a, b) {
  // YOUR CODE HERE
  return null;
}

// 4. Can you build string `note` using the letters of `magazine`, each letter used at most once?
// ("aab", "baa") -> true, ("aab", "ab") -> false
function canFormNote(note, magazine) {
  // YOUR CODE HERE
  return null;
}

// 5. First value whose SECOND occurrence comes earliest; -1 if none (Real CodeSignal GCA).
// [2,1,3,5,3,2] -> 3, [1,2,3] -> -1
function firstDuplicate(nums) {
  // YOUR CODE HERE
  return null;
}

// 6. Max sum of any contiguous window of size k (Sliding Window).
// ([2,1,5,1,3,2], 3) -> 9 (5+1+3)
function maxSubarraySumK(nums, k) {
  // YOUR CODE HERE
  return null;
}

// 7. Smallest abs difference between any element of a and any of b (Sort + Two Pointers).
// ([1,3,15,11,2], [23,127,235,19,8]) -> 3 (11 vs 8)
function smallestDifference(a, b) {
  // YOUR CODE HERE
  return null;
}

// 8. Count pairs i < j with nums[i] + nums[j] == target.
// ([1,5,7,-1,5], 6) -> 3 (1+5, 7+-1, 1+5)
function countPairsWithSum(nums, target) {
  // YOUR CODE HERE
  return null;
}

// 9. First index i where sum(nums[0..i-1]) == sum(nums[i+1..end]); -1 if none.
// [1,7,3,6,5,6] -> 3
function equalSplitIndex(nums) {
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
  [mostFrequent, [[3, 1, 3, 2, 3, 1]], 3],
  [containsCloseDuplicates, [[1, 2, 3, 1], 3], true],
  [containsCloseDuplicates, [[1, 2, 3, 1], 2], false],
  [commonElements, [[1, 2, 2, 3], [2, 3, 4]], [2, 3]],
  [canFormNote, ["aab", "baa"], true],
  [canFormNote, ["aab", "ab"], false],
  [firstDuplicate, [[2, 1, 3, 5, 3, 2]], 3],
  [firstDuplicate, [[1, 2, 3]], -1],
  [maxSubarraySumK, [[2, 1, 5, 1, 3, 2], 3], 9],
  [smallestDifference, [[1, 3, 15, 11, 2], [23, 127, 235, 19, 8]], 3],
  [countPairsWithSum, [[1, 5, 7, -1, 5], 6], 3],
  [equalSplitIndex, [[1, 7, 3, 6, 5, 6]], 3],
  [equalSplitIndex, [[1, 2, 3]], -1]
];

let passed = 0;
console.log("\n==========================================");
console.log("   RUNNING Q4 PROBLEM SOLVING TESTS       ");
console.log("==========================================\n");

for (const [fn, args, expected] of TESTS) {
  try {
    const actual = fn(...args);
    if (deepEqual(actual, expected)) {
      passed++;
      console.log(`  PASS: ${fn.name}(...) === ${JSON.stringify(expected)}`);
    } else {
      console.log(`  FAIL: ${fn.name}(...)`);
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
