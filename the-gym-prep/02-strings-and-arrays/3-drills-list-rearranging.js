/**
 * Q2B-STYLE: REARRANGING ARRAYS (Move, Remove, Reorder)
 *
 * The Big Idea: DON'T fight to edit arrays in-place.
 * BUILD A NEW ARRAY in the order you want, then return it!
 *
 * Run:  node the-gym-prep/02-strings-and-arrays/3-drills-list-rearranging.js
 */

// 1. Move every 0 to the end, keeping the other numbers in their original order.
// [0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0]
function moveZerosToEnd(nums) {
const list =[]
  for(let num of nums){
    if(num != 0){
        list.push(num);
    } 
  }
  for (let zero of nums ){
    if(zero === 0){
        list.push(zero);
    }
  }
  return list;
}

// 2. Return a new array with every copy of `target` removed.
// ([1, 2, 3, 2], 2) -> [1, 3]
function removeAll(nums, target) {
    const list=[]
    for(let num of nums ){
        if( num != target){
            list.push(num);
        }
    }
    return list
};


// 3. All even numbers first, then all odd numbers. Keep original order within each group.
// [1, 2, 3, 4, 5, 6] -> [2, 4, 6, 1, 3, 5]
function evensThenOdds(nums) {
    let oddNumbers = []
    let evenNumbers = []
    
    for(let num of nums ){
        if(num % 2 === 0){
            evenNumbers.push(num);
        }
    }

    for(let numodd of nums ){
        if(numodd % 2 != 0){
            evenNumbers.push(numodd);
        }
    }
    return evenNumbers.concat(oddNumbers)
}


results = evensThenOdds([1, 2, 3, 4, 5, 6]);

// 4. All negatives first, then everything else (0 and positives), order kept.
// [3, -1, 0, -5, 2] -> [-1, -5, 3, 0, 2]
function negativesFirst(nums) {
  const negatives =[]
  const positive = []
  for(let num of nums){
    if(num < 0){
        negatives.push(num);
    }
  }  
  for(let numPositive of nums){
    if(numPositive >= 0){
        positive.push(numPositive);
    }
  }
  return negatives.concat(positive)
}

// 5. Keep only the FIRST appearance of each value, in order.
// [3, 1, 3, 2, 1] -> [3, 1, 2]
function removeDuplicatesKeepOrder(nums) {
  const list = []
  for(let num of nums){
    if(!list.includes(num)){
      list.push(num);
    }
  }
  return list;
}

// 6. Move the first k items to the end.
// ([1, 2, 3, 4, 5], 2) -> [3, 4, 5, 1, 2]
function rotateLeft(nums, k) {
    const afterK = nums.slice(k);
    const firstK = nums.slice(0,k)
    return afterK.concat(firstK);
}

// 7. Swap the first and last items. [1, 2, 3, 4] -> [4, 2, 3, 1]
function swapFirstLast(nums) {
  if (nums.length <= 1) return nums;
  const first = nums.slice(0, 1);
  const last = nums.slice(-1);
  const middle = nums.slice(1, -1);
  return last.concat(middle, first);
}

// 8. Alternate items from two equal-length arrays, starting with a.
// ([1, 3, 5], [2, 4, 6]) -> [1, 2, 3, 4, 5, 6]
function interleave(a, b) {
  const result = [];

  for (let i = 0; i < a.length; i++) {
    result.push(a[i]); // Take from array a
    result.push(b[i]); // Take from array b
  }

  return result;
}

// 9. Return [negatives, zeros, positives] - three arrays inside one array.
// [1, -2, 0, 3, 0, -4] -> [[-2, -4], [0, 0], [1, 3]]
function groupBySign(nums) {
  const negatives = [];
  const zeros = [];
  const positives = [];

  for (const num of nums) {
    if (num < 0) {
      negatives.push(num);
    } else if (num === 0) {
      zeros.push(num);
    } else {
      positives.push(num);
    }
  }

  return [negatives, zeros, positives];
}

// 10. Letters first, then digits. Keep the order within each group.
// "a1b2c3" -> "abc123"
function moveLettersToFront(s) {
    const numbers = []
    const Letters =[]

    for(item of s ){
        if(item >= "0" && item <= "9"){
            numbers.push(item)
        }else{
            Letters.push(item)
        }
    }
    return Letters.concat(numbers).join("")
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

