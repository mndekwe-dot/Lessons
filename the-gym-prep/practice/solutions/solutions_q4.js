/**
 * SOLUTIONS for q4_problem_solving.js
 */

function mostFrequent(nums) {
  const counts = {};
  for (const x of nums) counts[x] = (counts[x] || 0) + 1;
  let bestVal = nums[0];
  let maxCount = 0;
  for (const [val, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      bestVal = Number(val);
    }
  }
  return bestVal;
}

function containsCloseDuplicates(nums, k) {
  const lastIndex = {};
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    if (x in lastIndex && i - lastIndex[x] <= k) {
      return true;
    }
    lastIndex[x] = i;
  }
  return false;
}

function commonElements(a, b) {
  const setB = new Set(b);
  const common = new Set();
  for (const x of a) {
    if (setB.has(x)) {
      common.add(x);
    }
  }
  return [...common].sort((x, y) => x - y);
}

function canFormNote(note, magazine) {
  const counts = {};
  for (const c of magazine) counts[c] = (counts[c] || 0) + 1;
  for (const c of note) {
    if (!counts[c]) return false;
    counts[c]--;
  }
  return true;
}

function firstDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return x;
    seen.add(x);
  }
  return -1;
}

function maxSubarraySumK(nums, k) {
  let window = 0;
  for (let i = 0; i < k; i++) window += nums[i];
  let best = window;
  for (let i = k; i < nums.length; i++) {
    window += nums[i] - nums[i - k];
    best = Math.max(best, window);
  }
  return best;
}

function smallestDifference(a, b) {
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  let i = 0;
  let j = 0;
  let best = Math.abs(sortedA[0] - sortedB[0]);

  while (i < sortedA.length && j < sortedB.length) {
    best = Math.min(best, Math.abs(sortedA[i] - sortedB[j]));
    if (sortedA[i] < sortedB[j]) {
      i++;
    } else {
      j++;
    }
  }
  return best;
}

function countPairsWithSum(nums, target) {
  const seen = {};
  let count = 0;
  for (const x of nums) {
    const complement = target - x;
    if (seen[complement]) {
      count += seen[complement];
    }
    seen[x] = (seen[x] || 0) + 1;
  }
  return count;
}

function equalSplitIndex(nums) {
  const total = nums.reduce((s, x) => s + x, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    const rightSum = total - leftSum - nums[i];
    if (leftSum === rightSum) return i;
    leftSum += nums[i];
  }
  return -1;
}

module.exports = {
  mostFrequent,
  containsCloseDuplicates,
  commonElements,
  canFormNote,
  firstDuplicate,
  maxSubarraySumK,
  smallestDifference,
  countPairsWithSum,
  equalSplitIndex
};

