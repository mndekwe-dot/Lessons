/**
 * SOLUTIONS: Loops & Array Methods (for, while, map, filter, reduce)
 * Reference code for drills_loops_and_methods.js
 */

// SECTION 1: for...of LOOPS
function sumWithForOf(arr) {
  let total = 0;
  for (const num of arr) {
    total += num;
  }
  return total;
}

function countLongWords(words) {
  let count = 0;
  for (const word of words) {
    if (word.length > 3) count++;
  }
  return count;
}

function maxWithForOf(arr) {
  let champion = arr[0];
  for (const num of arr) {
    if (num > champion) champion = num;
  }
  return champion;
}

function hasNegativeNumber(arr) {
  for (const num of arr) {
    if (num < 0) return true;
  }
  return false;
}

function joinWordsManual(words) {
  if (words.length === 0) return "";
  let sentence = "";
  for (const word of words) {
    sentence += (sentence === "" ? "" : " ") + word;
  }
  return sentence;
}

// SECTION 2: CLASSIC COUNTING for LOOPS
function rangeUpTo(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push(i);
  }
  return result;
}

function everyOtherItem(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
    result.push(arr[i]);
  }
  return result;
}

function adjacentPairSums(arr) {
  const result = [];
  for (let i = 0; i < arr.length - 1; i++) {
    result.push(arr[i] + arr[i + 1]);
  }
  return result;
}

function reverseWithLoop(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}

function indexOfManual(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// SECTION 3: while LOOPS
function countHalvings(n) {
  let steps = 0;
  let current = n;
  while (current > 1) {
    current = Math.floor(current / 2);
    steps++;
  }
  return steps;
}

function sumDigitsWithWhile(n) {
  let sum = 0;
  let remaining = Math.abs(n);
  while (remaining > 0) {
    sum += remaining % 10;
    remaining = Math.floor(remaining / 10);
  }
  return sum;
}

function yearsToGrow(deposit, rate, threshold) {
  let years = 0;
  let balance = deposit;
  while (balance < threshold) {
    balance += balance * (rate / 100);
    years++;
  }
  return years;
}

function reverseNumberMath(n) {
  let reversed = 0;
  let current = n;
  while (current > 0) {
    reversed = reversed * 10 + (current % 10);
    current = Math.floor(current / 10);
  }
  return reversed;
}

// SECTION 4: .map() DRILLS
function doubleWithMap(arr) {
  return arr.map(x => x * 2);
}

function uppercaseWithMap(arr) {
  return arr.map(s => s.toUpperCase());
}

function wordLengthsWithMap(words) {
  return words.map(w => w.length);
}

function extractNamesWithMap(users) {
  return users.map(u => u.name);
}

function addTaxWithMap(prices) {
  return prices.map(p => Math.round(p * 1.18 * 100) / 100);
}

// SECTION 5: .filter() DRILLS
function onlyEvensWithFilter(arr) {
  return arr.filter(x => x % 2 === 0);
}

function longWordsWithFilter(words) {
  return words.filter(w => w.length > 3);
}

function removeNullishWithFilter(arr) {
  return arr.filter(x => x !== null && x !== undefined);
}

function inStockProductsWithFilter(products) {
  return products.filter(p => p.inStock);
}

function numbersInRangeWithFilter(nums, min, max) {
  return nums.filter(x => x >= min && x <= max);
}

// SECTION 6: .reduce() DRILLS
function sumWithReduce(arr) {
  return arr.reduce((sum, x) => sum + x, 0);
}

function productWithReduce(arr) {
  return arr.reduce((prod, x) => prod * x, 1);
}

function maxWithReduce(arr) {
  return arr.reduce((max, x) => (x > max ? x : max), arr[0]);
}

function frequencyWithReduce(arr) {
  return arr.reduce((acc, x) => {
    acc[x] = (acc[x] || 0) + 1;
    return acc;
  }, {});
}

function flattenWithReduce(arr) {
  return arr.reduce((acc, row) => acc.concat(row), []);
}

module.exports = {
  sumWithForOf,
  countLongWords,
  maxWithForOf,
  hasNegativeNumber,
  joinWordsManual,
  rangeUpTo,
  everyOtherItem,
  adjacentPairSums,
  reverseWithLoop,
  indexOfManual,
  countHalvings,
  sumDigitsWithWhile,
  yearsToGrow,
  reverseNumberMath,
  doubleWithMap,
  uppercaseWithMap,
  wordLengthsWithMap,
  extractNamesWithMap,
  addTaxWithMap,
  onlyEvensWithFilter,
  longWordsWithFilter,
  removeNullishWithFilter,
  inStockProductsWithFilter,
  numbersInRangeWithFilter,
  sumWithReduce,
  productWithReduce,
  maxWithReduce,
  frequencyWithReduce,
  flattenWithReduce,
};
