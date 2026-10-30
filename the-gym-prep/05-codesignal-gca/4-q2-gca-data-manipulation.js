/**
 * GCA Real Questions — Q2: Data Manipulation in JavaScript (Mirror of Python's gca_q2_data_manipulation.py)
 * 
 * Target: ~10–15 min each.
 * Run with Node:
 *     node the-gym-prep/05-codesignal-gca/4-q2-gca-data-manipulation.js
 */

function allLongestStrings(words) {
    // Return ALL strings of maximum length, keeping their order.
    // YOUR CODE HERE
    return null;
}

function addBorder(picture) {
    // Surround a rectangular matrix of characters with a border of asterisks (*).
    // YOUR CODE HERE
    return null;
}

function sortedSquares(nums) {
    // Square every number in the array and return the result sorted ascending.
    // YOUR CODE HERE
    return null;
}

function isAnagram(a, b) {
    // Return true if a and b use exactly the same letters.
    // YOUR CODE HERE
    return null;
}

function firstDigit(s) {
    // Return the first digit character in string s.
    // YOUR CODE HERE
    return null;
}

function alternatingSums(a) {
    // Players go alternately to team 1 and team 2. Return [team1_weight, team2_weight].
    // YOUR CODE HERE
    return null;
}

function commonCharacterCount(s1, s2) {
    // Return the count of characters that appear in both strings (counted per occurrence).
    // YOUR CODE HERE
    return null;
}

function isLucky(n) {
    // Return true if sum of first half digits equals sum of second half.
    // YOUR CODE HERE
    return null;
}

function sortByHeight(a) {
    // Sort the non-negative numbers (people) in ascending order while leaving
    // the -1 values (trees) fixed in place.
    // YOUR CODE HERE
    return null;
}

function reverseInParentheses(inputString) {
    // Reverse substrings inside each pair of matching parentheses from inside out.
    // YOUR CODE HERE
    return null;
}

function differentSquares(matrix) {
    // Return the number of distinct 2x2 squares in a matrix.
    // YOUR CODE HERE
    return null;
}

function knapsackLight(value1, weight1, value2, weight2, maxWeight) {
    // Return the maximum total value that can be carried in the knapsack.
    // YOUR CODE HERE
    return null;
}

function arrayChange(inputArray) {
    // Minimum increments so array becomes strictly increasing.
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
    [allLongestStrings, [["aba", "aa", "ad", "vcd", "aba"]], ["aba", "vcd", "aba"]],
    [addBorder, [["abc", "ded"]], ["*****", "*abc*", "*ded*", "*****"]],
    [sortedSquares, [[-4, -1, 0, 3]], [0, 1, 9, 16]],
    [isAnagram, ["listen", "silent"], true],
    [isAnagram, ["hello", "world"], false],
    [firstDigit, ["var_1__int"], "1"],
    [firstDigit, ["q2q-q"], "2"],
    [alternatingSums, [[50, 60, 60, 45, 70]], [180, 105]],
    [commonCharacterCount, ["aab", "aba"], 3],
    [isLucky, [1230], true],
    [isLucky, [239017], false],
    [sortByHeight, [[-1, 150, 190, 170, -1, -1, 160, 180]], [-1, 150, 160, 170, -1, -1, 180, 190]],
    [reverseInParentheses, ["(bar)"], "rab"],
    [reverseInParentheses, ["foo(bar(baz))blim"], "foobazrabblim"],
    [differentSquares, [[[1, 2, 1], [2, 3, 4], [2, 3, 4]]], 4],
    [knapsackLight, [10, 5, 6, 4, 9], 16],
    [knapsackLight, [10, 5, 6, 4, 1], 0],
    [arrayChange, [[1, 1, 1]], 3],
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
    console.log("\nALL GREEN. GCA Q2 data manipulation mastered in JavaScript!");
}
