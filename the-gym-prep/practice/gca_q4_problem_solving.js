/**
 * GCA Real Questions — Q4: Problem Solving in JavaScript (Mirror of Python's gca_q4_problem_solving.py)
 * 
 * Target: ~20–25 min each. Optimal hash maps, sets, and two-pointer techniques.
 * Run with Node:
 *     node the-gym-prep/practice/gca_q4_problem_solving.js
 */

function mostFrequent(nums) {
    // Return the value that appears most often in the array.
    const counts = {};
    for (const x of nums) counts[x] = (counts[x] || 0) + 1;
    let bestVal = null, maxCount = -1;
    for (const [k, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            bestVal = Number(k);
        }
    }
    return bestVal;
}

function containsCloseDuplicates(nums, k) {
    // Return true if there are two indices i,j where nums[i]==nums[j] and abs(i-j) <= k.
    const lastSeen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        if (lastSeen.has(val)) {
            if (i - lastSeen.get(val) <= k) return true;
        }
        lastSeen.set(val, i);
    }
    return false;
}

function commonElements(a, b) {
    // Values present in BOTH arrays, no duplicates, sorted.
    const setB = new Set(b);
    const common = [...new Set(a)].filter(x => setB.has(x));
    return common.sort((x, y) => x - y);
}

function canFormNote(note, magazine) {
    // Can you build string `note` from the letters of `magazine`? Each letter used at most once.
    const magCounts = {};
    for (const ch of magazine) magCounts[ch] = (magCounts[ch] || 0) + 1;
    for (const ch of note) {
        if (!magCounts[ch] || magCounts[ch] <= 0) return false;
        magCounts[ch]--;
    }
    return true;
}

function firstDuplicate(nums) {
    // Return the first value whose second occurrence comes earliest. -1 if no duplicate.
    const seen = new Set();
    for (const x of nums) {
        if (seen.has(x)) return x;
        seen.add(x);
    }
    return -1;
}

function maxSubarraySumK(nums, k) {
    // Return the maximum sum of any contiguous window of size k.
    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += nums[i];
    let maxSum = windowSum;
    for (let i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        if (windowSum > maxSum) maxSum = windowSum;
    }
    return maxSum;
}

function smallestDifference(a, b) {
    // Return the smallest absolute difference between any element of a and any element of b.
    const sortedA = [...a].sort((x, y) => x - y);
    const sortedB = [...b].sort((x, y) => x - y);
    let i = 0, j = 0;
    let minDiff = Infinity;
    while (i < sortedA.length && j < sortedB.length) {
        const diff = Math.abs(sortedA[i] - sortedB[j]);
        if (diff < minDiff) minDiff = diff;
        if (sortedA[i] < sortedB[j]) i++;
        else j++;
    }
    return minDiff;
}

function countPairsWithSum(nums, target) {
    // Count pairs i<j where nums[i]+nums[j]==target.
    const counts = {};
    let pairs = 0;
    for (const x of nums) {
        const complement = target - x;
        if (counts[complement]) {
            pairs += counts[complement];
        }
        counts[x] = (counts[x] || 0) + 1;
    }
    return pairs;
}

function equalSplitIndex(nums) {
    // Return the first index i where sum(nums[:i]) == sum(nums[i+1:]); -1 if none.
    const total = nums.reduce((s, x) => s + x, 0);
    let leftSum = 0;
    for (let i = 0; i < nums.length; i++) {
        const rightSum = total - leftSum - nums[i];
        if (leftSum === rightSum) return i;
        leftSum += nums[i];
    }
    return -1;
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
