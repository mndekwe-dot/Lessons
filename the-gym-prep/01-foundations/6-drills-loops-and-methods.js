/**
 * DRILLS: Loops & Array Methods (for, while, map, filter, reduce)
 * 
 * Target: Master the transition from manual loops to modern methods.
 * Run with Node:
 *     node the-gym-prep/01-foundations/6-drills-loops-and-methods.js
 * 
 * Instructions:
 * Work through each section in order. Replace "return null;" with your logic.
 * When stuck, peek at: the-gym-prep/solutions/01-foundations/6-drills-loops-and-methods.js
 */

// ===========================================================================
// SECTION 1: for...of LOOPS (Item-by-Item)
// ===========================================================================

// 1.1 Sum all numbers in an array. [1, 2, 3, 4] -> 10
function sumWithForOf(arr) {
  total = 0;
  for (const nums of arr){
    total += nums;
  }
  return total;
}

// 1.2 Count how many strings have length > 3. ["cat", "zebra", "lion", "ox"] -> 2
function countLongWords(words) {
  let count = 0
  for(const items of words){
    if (items.length > 3){
      count += 1
    }else{
      continue
    }
  }
  return count
}

// 1.3 Find the maximum number in an array. [10, 45, 3, 89, 22] -> 89
function maxWithForOf(arr) {
  let champion = arr[0]
  for(const nums of arr){
    if(nums > champion){
      champion = nums
    }else{
      continue 
    }
  }
  return champion
}

// 1.4 Check if an array contains any negative number. [1, 4, -2, 8] -> true
function hasNegativeNumber(arr) {
  for(const nums of arr){
    if(nums < 0){
      return true
    }
  }
  return false;
}

// 1.5 Join words with spaces into a single sentence. ["Code", "is", "fun"] -> "Code is fun"
function joinWordsManual(words) {
  let sentence ="";
  for(const x of words){
    if (sentence === ""){
        sentence = word;
    }else{
      sentence += " " + word;
    }
  }
  return sentence;
}

// ===========================================================================
// SECTION 2: CLASSIC COUNTING for LOOPS (for (let i = 0; i < len; i++))
// ===========================================================================

// 2.1 Return an array with numbers from 1 up to n. 4 -> [1, 2, 3, 4]
function rangeUpTo(n) {  
  const result =[];
  for(let i =1;i<= n;i++){
    result.push(i);
  }
  return result;
}

// 2.2 Return every second item starting at index 0. ["a", "b", "c", "d", "e"] -> ["a", "c", "e"]
function everyOtherItem(arr) {
  const result =[];
  for(let i = 0 ; i <= arr.length; i+=2){
    result.push(arr[i] );
  }
  return result;
}

// 2.3 Sum adjacent pairs: [1, 2, 3, 4] -> [3, 5, 7]
function adjacentPairSums(arr) {
  let list = []
  for(let i=0 ; i < arr.length-1; i++){
    let sum = arr[i] + arr[i + 1];
    list.push(sum);
  }
  return list;
}

// 2.4 Reverse an array using a backwards loop. [1, 2, 3] -> [3, 2, 1]
function reverseWithLoop(arr) {
  const result = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }

  return result;
}

// 2.5 Find the index of the first occurrence of target, or -1. ([10, 20, 30], 20) -> 1
function indexOfManual(arr, target) {
  for(let i =0; i < arr.length;i++){
    if(arr[i] === target){
      return i
    }
  }
  return -1
}

// ===========================================================================
// SECTION 3: while LOOPS (Condition-Based Repetition)
// ===========================================================================

// 3.1 Keep halving a number (integer division) until it reaches 1. Count steps. 16 -> 4 (16->8->4->2->1)
function countHalvings(n) {
  let steps = 0
  while (n > 1){
    n =Math.floor(n/2);
    steps++;
  }
  return steps
}

// 3.2 Sum the digits of a number. 123 -> 6
function sumDigitsWithWhile(n) {
  let sum = 0;
  while(n>0){
    const digit = n % 10
    sum += digit
    n= Math.floor(n/10)
  }
  return sum
}

// 3.3 Investment growth: deposit grows by rate% each year. Years until threshold? (100, 20, 150) -> 3
function yearsToGrow(deposit, rate, threshold) {
  let years = 0 ;  
  let balance = deposit;
  while(balance < threshold){
    balance += balance *(rate/100);
    years++;
  }
  return years;
}

// 3.4 Reverse a positive number mathematically using while: 1234 -> 4321
function reverseNumberMath(n) {
  let reversed = 0;

  while (n > 0) {
    const digit = n % 10;
    reversed = reversed * 10 + digit; // Shift left and add digit
    n = Math.floor(n / 10);            // Chop off the last digit
  }

  return reversed;
}

// ===========================================================================
// SECTION 4: .map() DRILLS (Transforming Every Item)
// ===========================================================================

// 4.1 Double all numbers: [1, 2, 3] -> [2, 4, 6]
function doubleWithMap(arr) {
  return arr.map(items => items * 2);
}

// 4.2 Convert all strings to uppercase: ["hi", "dev"] -> ["HI", "DEV"]
function uppercaseWithMap(arr) {
  return arr.map(items => items.toUpperCase());
}

// 4.3 Extract lengths of words: ["apple", "pie"] -> [5, 3]
function wordLengthsWithMap(words) {
  return words.map(items => items.length);
}

// 4.4 Extract names from user objects: [{name: "Ama"}, {name: "Eric"}] -> ["Ama", "Eric"]
function extractNamesWithMap(users) {
  return users.map(items => items["name"]);
}

// 4.5 Add tax (18%) to all prices, rounded to 2 decimals: [100, 50] -> [118, 59]
function addTaxWithMap(prices) {
  return prices.map(items => items += items * (18/100));
}

// ===========================================================================
// SECTION 5: .filter() DRILLS (Keeping Matching Items)
// ===========================================================================

// 5.1 Keep only even numbers: [1, 2, 3, 4, 5] -> [2, 4]
function onlyEvensWithFilter(arr) {
  return arr.filter(items => items % 2 === 0);
}

// 5.2 Keep only words with more than 3 letters: ["a", "dog", "elephant"] -> ["elephant"]
function longWordsWithFilter(words) {
  return words.filter(items => items.length > 3);
}

// 5.3 Filter out null and undefined values: [1, null, 2, undefined, 3] -> [1, 2, 3]
function removeNullishWithFilter(arr) {
  return arr.filter(items=> items != null && items != undefined);
}

// 5.4 Keep only products that are in stock: [{id: 1, inStock: true}, {id: 2, inStock: false}]
function inStockProductsWithFilter(products) {
  return products.filter(items => items.inStock === true);
}

// 5.5 Keep only numbers within range [min, max] inclusive: ([10, 5, 25, 30], 10, 25) -> [10, 25]
function numbersInRangeWithFilter(nums, min, max) {
  return nums.filter(items => items>= min && items<= max);
}

// ===========================================================================
// SECTION 6: .reduce() DRILLS (Accumulating into a Single Value)
// ===========================================================================

// 6.1 Sum all numbers: [1, 2, 3, 4] -> 10
function sumWithReduce(arr) {
  return arr.reduce((total,items)=> total+items , 0);
}

// 6.2 Multiply all numbers (product): [2, 3, 4] -> 24
function productWithReduce(arr) {
  return arr.reduce((Multiply,items)=> Multiply * items,1);
}

// 6.3 Find the maximum number using reduce: [5, 12, 8, 130, 44] -> 130
function maxWithReduce(arr) {
  return arr.reduce((max, item) => (item > max ? item : max));
}

// 6.4 Count occurrences of items into an object: ["a", "b", "a"] -> { a: 2, b: 1 }
function frequencyWithReduce(arr) {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {}); // <-- Start with an empty object {}
}

// 6.5 Flatten an array of arrays one level: [[1, 2], [3, 4]] -> [1, 2, 3, 4]
  function flattenWithReduce(arr) {
  return arr.reduce((acc, curr) => acc.concat(curr), []);
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
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

const TESTS = [
  // Section 1
  [sumWithForOf, [[1, 2, 3, 4]], 10],
  [countLongWords, [["cat", "zebra", "lion", "ox"]], 2],
  [maxWithForOf, [[10, 45, 3, 89, 22]], 89],
  [hasNegativeNumber, [[1, 4, -2, 8]], true],
  [hasNegativeNumber, [[1, 4, 2, 8]], false],
  [joinWordsManual, [["Code", "is", "fun"]], "Code is fun"],

  // Section 2
  [rangeUpTo, [4], [1, 2, 3, 4]],
  [everyOtherItem, [["a", "b", "c", "d", "e"]], ["a", "c", "e"]],
  [adjacentPairSums, [[1, 2, 3, 4]], [3, 5, 7]],
  [reverseWithLoop, [[1, 2, 3]], [3, 2, 1]],
  [indexOfManual, [[10, 20, 30], 20], 1],
  [indexOfManual, [[10, 20, 30], 99], -1],

  // Section 3
  [countHalvings, [16], 4],
  [countHalvings, [1], 0],
  [sumDigitsWithWhile, [123], 6],
  [yearsToGrow, [100, 20, 150], 3],
  [reverseNumberMath, [1234], 4321],

  // Section 4
  [doubleWithMap, [[1, 2, 3]], [2, 4, 6]],
  [uppercaseWithMap, [["hi", "dev"]], ["HI", "DEV"]],
  [wordLengthsWithMap, [["apple", "pie"]], [5, 3]],
  [extractNamesWithMap, [[{ name: "Ama" }, { name: "Eric" }]], ["Ama", "Eric"]],
  [addTaxWithMap, [[100, 50]], [118, 59]],

  // Section 5
  [onlyEvensWithFilter, [[1, 2, 3, 4, 5]], [2, 4]],
  [longWordsWithFilter, [["a", "dog", "elephant"]], ["elephant"]],
  [removeNullishWithFilter, [[1, null, 2, undefined, 3]], [1, 2, 3]],
  [inStockProductsWithFilter, [[{ id: 1, inStock: true }, { id: 2, inStock: false }]], [{ id: 1, inStock: true }]],
  [numbersInRangeWithFilter, [[10, 5, 25, 30], 10, 25], [10, 25]],

  // Section 6
  [sumWithReduce, [[1, 2, 3, 4]], 10],
  [productWithReduce, [[2, 3, 4]], 24],
  [maxWithReduce, [[5, 12, 8, 130, 44]], 130],
  [frequencyWithReduce, [["a", "b", "a"]], { a: 2, b: 1 }],
  [flattenWithReduce, [[[1, 2], [3, 4]]], [1, 2, 3, 4]],
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

console.log(`\n=================================================`);
console.log(`   ${passed}/${TESTS.length} TESTS PASSED`);
console.log(`=================================================`);
if (passed === TESTS.length) {
  console.log("ALL GREEN. Loops and array methods fully mastered!");
}
