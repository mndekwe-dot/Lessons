/**
 * Q2-LEVEL PROBLEMS (Strings & Arrays Data Manipulation)
 * Target: 10-15 minutes each.
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/05-codesignal-gca/3-q2-data-manipulation.js
 */

// 1. Return ALL strings of maximum length, keeping their order.
// ["aba", "aa", "ad", "vcd", "aba"] -> ["aba", "vcd", "aba"]
function allLongestStrings(words) {
  const list =[]
  let maxLength= 0
    for(let i = 0 ; i < words.length ; i++ ){
        if(words[i].length > maxLength){
            maxLength = words[i].length
        }
    }
    for (let item of words){
        if(item.length === maxLength){
            list.push(item);
        }
    }

  return list
}

// 2. Surround an array of strings with '*' (Real CodeSignal GCA problem).
// ["abc", "ded"] -> ["*****", "*abc*", "*ded*", "*****"]
function addBorder(picture) {
  const width = picture[0].length + 2
  const border = "*".repeat(width)
  const rows = []
    for(const row of picture){
        rows.push(`*${row}*`)
  }
  return [border , ...rows ,border]
}

// 3. Square every number, return results sorted ascending.
// [-4, -1, 0, 3] -> [0, 1, 9, 16]
function sortedSquares(nums) {
  let list = []
  for(let item of nums){
    list.push(item * item)
  }
  return list.sort((a,b) => a-b)
}

// 4. Do the two words use exactly the same letters?
// ("listen", "silent") -> true, ("hello", "world") -> false
function isAnagram(a, b) {
  const sortedA = a.toLowerCase().split("").sort().join("");
  const sortedB = b.toLowerCase().split("").sort().join("");
  return sortedA === sortedB;
}

// 5. Return the first character in s that is a digit. "var_1__int" -> "1"
function firstDigit(s) {
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      return ch;
    }
  }
  return null;
}

// 6. Alternating team weights (Real CodeSignal GCA problem).
// Players go alternately to team 1 and team 2.
// [50, 60, 60, 45, 70] -> [180, 105] (50+60+70, 60+45)
function alternatingSums(a) {
    let evenPosition = 0
    let oddPosition = 0 
    for(let i=0 ; i < a.length; i++){
        if(i%2 === 0 ){
            evenPosition += a[i]
        }
    }
    for(let i=0 ; i < a.length; i++){
        if(i%2 != 0 ){
            oddPosition += a[i]
        }
    }
    return [evenPosition,oddPosition]
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
  [allLongestStrings, [["aba", "aa", "ad", "vcd", "aba"]], ["aba", "vcd", "aba"]],
  [allLongestStrings, [["a"]], ["a"]],
  [addBorder, [["abc", "ded"]], ["*****", "*abc*", "*ded*", "*****"]],
  [addBorder, [["a"]], ["***", "*a*", "***"]],
  [sortedSquares, [[-4, -1, 0, 3]], [0, 1, 9, 16]],
  [isAnagram, ["listen", "silent"], true],
  [isAnagram, ["hello", "world"], false],
  [firstDigit, ["var_1__int"], "1"],
  [firstDigit, ["q2q-q"], "2"],
  [alternatingSums, [[50, 60, 60, 45, 70]], [180, 105]]
];

let passed = 0;
console.log("\n==========================================");
console.log("   RUNNING Q2 DATA MANIPULATION TESTS     ");
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

