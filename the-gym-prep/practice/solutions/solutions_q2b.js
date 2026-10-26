/**
 * SOLUTIONS for q2b_list_rearranging.js
 */

function moveZerosToEnd(nums) {
  const nonZeros = nums.filter(x => x !== 0);
  const zeros = nums.filter(x => x === 0);
  return [...nonZeros, ...zeros];
}

function removeAll(nums, target) {
  return nums.filter(x => x !== target);
}

function evensThenOdds(nums) {
  const evens = nums.filter(x => x % 2 === 0);
  const odds = nums.filter(x => x % 2 !== 0);
  return [...evens, ...odds];
}

function negativesFirst(nums) {
  const negs = nums.filter(x => x < 0);
  const rest = nums.filter(x => x >= 0);
  return [...negs, ...rest];
}

function removeDuplicatesKeepOrder(nums) {
  const seen = new Set();
  const result = [];
  for (const x of nums) {
    if (!seen.has(x)) {
      seen.add(x);
      result.push(x);
    }
  }
  return result;
}

function rotateLeft(nums, k) {
  return [...nums.slice(k), ...nums.slice(0, k)];
}

function swapFirstLast(nums) {
  if (nums.length <= 1) return [...nums];
  const copy = [...nums];
  const first = copy[0];
  copy[0] = copy[copy.length - 1];
  copy[copy.length - 1] = first;
  return copy;
}

function interleave(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result.push(a[i]);
    result.push(b[i]);
  }
  return result;
}

function groupBySign(nums) {
  const negs = nums.filter(x => x < 0);
  const zeros = nums.filter(x => x === 0);
  const pos = nums.filter(x => x > 0);
  return [negs, zeros, pos];
}

function moveLettersToFront(s) {
  let letters = "";
  let digits = "";
  for (const c of s) {
    if (c >= "0" && c <= "9") {
      digits += c;
    } else {
      letters += c;
    }
  }
  return letters + digits;
}

module.exports = {
  moveZerosToEnd,
  removeAll,
  evensThenOdds,
  negativesFirst,
  removeDuplicatesKeepOrder,
  rotateLeft,
  swapFirstLast,
  interleave,
  groupBySign,
  moveLettersToFront
};

