/**
 * DRILLS — JavaScript Fundamentals for The Gym
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/practice/drills_js_basics.js
 *
 * Format: Each function has a docstring explaining what to do.
 * Fill in your code where it says "// YOUR CODE HERE", then run the file
 * to see your test score improve from 0/25 to 25/25!
 */

// =========================================================================
// SECTION A: NUMBERS AND MATH
// =========================================================================

// 1. Add two numbers and return the sum.
function add(a, b) {
  return a+b;
}

// 2. Return true if n is an even number, false if odd.
function isEven(n) {
  if (n % 2 === 0){
    return true
  } else{
    return false
  }
}

// 3. Integer division: divide a by b and round DOWN (like Python a // b).
function intDivide(a, b) {
  return Math.floor(a/b);
}

// 4. Return the opposite of a number: 5 -> -5, -10 -> 10.
function opposite(n) {
  return -n;
}

// 5. Return the maximum of three numbers.
function maxOfThree(a, b, c) {
  return Math.max(a,b,c);
}

// =========================================================================
// SECTION B: STRINGS
// =========================================================================

// 6. Return the first character of a string. "hello" -> "h"
function firstChar(s) {
  return s[0];
}

// 7. Return the last character of a string. "hello" -> "o"
function lastChar(s) {
  return s[s.length - 1];
}

// 8. Return the string in UPPERCASE. "kigali" -> "KIGALI"
function shout(s) {
  return s.toUpperCase();
}

// 9. Remove spaces from both ends of a string. "  hi  " -> "hi"
function trimSpaces(s) {
  return s.trim();
}

// 10. Return the reversed string. "hello" -> "olleh"
function reverseStr(s) {
  return s.split("").reverse().join("");
}

// 11. Return true if s starts with a vowel (a, e, i, o, u), false otherwise.
function startsWithVowel(s) {
  if ("aeoiuAEIOU".includes(s[0])){
    return true;
  } else {
    return false;
  }
}

// =========================================================================
// SECTION C: ARRAYS
// =========================================================================

// 12. Return the number of items in the array. [1, 2, 3] -> 3
function getLength(arr) {
  return arr.length;
}

// 13. Add item x to the END of array and return the array. ([1, 2], 3) -> [1, 2, 3]
function addToEnd(arr, x) {
  arr.push(x);
  return arr
}

// 14. Return the array WITHOUT its last item. [1, 2, 3] -> [1, 2]
function withoutLast(arr) {
  arr.pop()
  return arr;
}

// 15. Return the sum of all numbers in the array. [1, 2, 3] -> 6
function sumArray(arr) {
  let total =0
  for(const nums of arr){
    total += nums
  }
  return total
}

// 16. Return a NEW array with every number doubled. [1, 2, 3] -> [2, 4, 6]
function doubleAll(arr) {
  const result = []
  for(const nums of arr){
    result.push(nums * 2)
  }
  return result
}

// 17. Return only the positive numbers (greater than 0). [1, -4, 7, 0] -> [1, 7]
function onlyPositives(arr) {
  positive=[];
  for (const nums of arr){
    if(nums > 0 ){
      positive.push(nums)
    }else{
      continue
    }
  }
  return positive
}

// 18. Return the smallest number in the array. [34, 15, 88, 2] -> 2
function findSmallest(arr) {
  champion=arr[0]
  for(const nums of arr ){
    if (nums < champion){
      champion = nums; 
    }
  }
  return champion
}

// 19. Sort numbers in ASCENDING order (smallest to largest). [10, 5, 20, 1] -> [1, 5, 10, 20]
function sortNumbers(arr) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// SECTION D: OBJECTS
// =========================================================================

// 20. Return the person's age from the object. ({ name: "Ama", age: 20 }) -> 20
function getAge(person) {
  // YOUR CODE HERE
  return null;
}

// 21. Check if the object has a property named key. Return true or false.
function hasProperty(obj, key) {
  // YOUR CODE HERE
  return null;
}

// 22. Return an array of all keys in the object. ({ a: 1, b: 2 }) -> ["a", "b"]
function getAllKeys(obj) {
  // YOUR CODE HERE
  return null;
}

// 23. Return an array of all values in the object. ({ a: 1, b: 2 }) -> [1, 2]
function getAllValues(obj) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// SECTION E: CLASSIC INTERVIEW & CODEWARS PATTERNS
// =========================================================================

// 24. Palindrome check: returns true if word reads same backwards and forwards.
function isPalindrome(s) {
  // YOUR CODE HERE
  return null;
}

// 25. Count how many vowels (a, e, i, o, u) are in the string.
function countVowels(s) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// SELF-TEST SUITE
// =========================================================================

const TESTS = [
  { name: "add", fn: () => add(10, 5), expected: 15 },
  { name: "isEven (even)", fn: () => isEven(4), expected: true },
  { name: "isEven (odd)", fn: () => isEven(7), expected: false },
  { name: "intDivide", fn: () => intDivide(7, 2), expected: 3 },
  { name: "opposite (pos)", fn: () => opposite(5), expected: -5 },
  { name: "opposite (neg)", fn: () => opposite(-14), expected: 14 },
  { name: "maxOfThree", fn: () => maxOfThree(10, 25, 15), expected: 25 },
  { name: "firstChar", fn: () => firstChar("hello"), expected: "h" },
  { name: "lastChar", fn: () => lastChar("hello"), expected: "o" },
  { name: "shout", fn: () => shout("kigali"), expected: "KIGALI" },
  { name: "trimSpaces", fn: () => trimSpaces("  hi  "), expected: "hi" },
  { name: "reverseStr", fn: () => reverseStr("hello"), expected: "olleh" },
  { name: "startsWithVowel (true)", fn: () => startsWithVowel("apple"), expected: true },
  { name: "startsWithVowel (false)", fn: () => startsWithVowel("banana"), expected: false },
  { name: "getLength", fn: () => getLength([1, 2, 3]), expected: 3 },
  { name: "addToEnd", fn: () => addToEnd([1, 2], 3), expected: [1, 2, 3] },
  { name: "withoutLast", fn: () => withoutLast([1, 2, 3]), expected: [1, 2] },
  { name: "sumArray", fn: () => sumArray([1, 2, 3, 4]), expected: 10 },
  { name: "doubleAll", fn: () => doubleAll([1, 2, 3]), expected: [2, 4, 6] },
  { name: "onlyPositives", fn: () => onlyPositives([1, -4, 7, 0]), expected: [1, 7] },
  { name: "findSmallest", fn: () => findSmallest([34, 15, 88, 2]), expected: 2 },
  { name: "sortNumbers", fn: () => sortNumbers([10, 5, 20, 1]), expected: [1, 5, 10, 20] },
  { name: "getAge", fn: () => getAge({ name: "Ama", age: 20 }), expected: 20 },
  { name: "hasProperty", fn: () => hasProperty({ a: 1 }, "a"), expected: true },
  { name: "isPalindrome (true)", fn: () => isPalindrome("level"), expected: true },
  { name: "isPalindrome (false)", fn: () => isPalindrome("hello"), expected: false },
  { name: "countVowels", fn: () => countVowels("celebration"), expected: 5 },
];

function runTests() {
  let passed = 0;
  console.log("=================================================");
  console.log("   THE GYM — JAVASCRIPT FUNDAMENTALS DRILLS     ");
  console.log("=================================================\n");

  for (const t of TESTS) {
    let result;
    try {
      result = t.fn();
    } catch (err) {
      result = `ERROR: ${err.message}`;
    }

    const isMatch =
      JSON.stringify(result) === JSON.stringify(t.expected);

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
    console.log("ALL GREEN! Fantastic job! You are ready for The Gym assessment!");
  } else {
    console.log("Keep going! Fill in the functions above and rerun!");
  }
}

runTests();

