/**
 * GCA Real Questions — Q4: Problem Solving in JavaScript (Mirror of Python's gca_q4_problem_solving.py)
 * 
 * Target: ~20–25 min each. Optimal hash maps, sets, and two-pointer techniques.
 * Run with Node:
 *     node the-gym-prep/05-codesignal-gca/8-q4-gca-problem-solving.js
 */

function mostFrequent(nums) {
    // Return the value that appears most often in the array.
    // YOUR CODE HERE
    return null;
}

function containsCloseDuplicates(nums, k) {
    // Return true if there are two indices i,j where nums[i]==nums[j] and abs(i-j) <= k.
    // YOUR CODE HERE
    return null;
}

function commonElements(a, b) {
    // Values present in BOTH arrays, no duplicates, sorted.
    // YOUR CODE HERE
    return null;
}

function canFormNote(note, magazine) {
    // Can you build string `note` from the letters of `magazine`? Each letter used at most once.
    // YOUR CODE HERE
    return null;
}

function firstDuplicate(nums) {
    // Return the first value whose second occurrence comes earliest. -1 if no duplicate.
    // YOUR CODE HERE
    return null;
}

function maxSubarraySumK(nums, k) {
    // Return the maximum sum of any contiguous window of size k.
    // YOUR CODE HERE
    return null;
}

function smallestDifference(a, b) {
    // Return the smallest absolute difference between any element of a and any element of b.
    // YOUR CODE HERE
    return null;
}

function countPairsWithSum(nums, target) {
    // Count pairs i<j where nums[i]+nums[j]==target.
    // YOUR CODE HERE
    return null;
}

function equalSplitIndex(nums) {
    // Return the first index i where sum(nums[:i]) == sum(nums[i+1:]); -1 if none.
    // YOUR CODE HERE
    return null;
}

// ------------------------- self-tests -------------------------
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
    [equalSplitIndex, [[1, 2, 3]], -1],
];

let passed = 0;
for (const [fn, args, expected] of TESTS) {
    let got;
    try {
        got = fn(...args);
    } catch (err) {
        got = `ERROR: ${err.message}`;
    }
    const ok = deepEqual(got, expected);
    if (ok) passed++;
    const mark = ok ? "PASS" : "FAIL";
    console.log(`[${mark}] ${fn.name}(${JSON.stringify(args)}) -> ${JSON.stringify(got)} (expected ${JSON.stringify(expected)})`);
}

console.log(`\n${passed}/${TESTS.length} tests passed`);
if (passed === TESTS.length) {
    console.log("\nALL GREEN. GCA Q4 problem-solving mastered in JavaScript!");
}
