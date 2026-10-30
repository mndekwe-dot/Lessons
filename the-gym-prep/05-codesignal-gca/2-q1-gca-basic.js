/**
 * GCA Real Questions — Q1: Basic Coding in JavaScript (Mirror of Python's gca_q1_basic.py)
 * 
 * Target: ~5–10 min each.
 * Run with Node:
 *     node the-gym-prep/05-codesignal-gca/2-q1-gca-basic.js
 */

function centuryFromYear(year) {
    // Given a year, return the century it is in. 1905 -> 20, 1700 -> 17, 2001 -> 21.
    // YOUR CODE HERE
    return null;
}

function add(a, b) {
    // Return the sum of a and b.
    // YOUR CODE HERE
    return null;
}

function checkPalindrome(inputString) {
    // Return true if inputString is a palindrome, false otherwise.
    // YOUR CODE HERE
    return null;
}

function adjacentElementsProduct(array) {
    // Find the pair of adjacent elements that has the largest product and return that product.
    // YOUR CODE HERE
    return null;
}

function shapeArea(n) {
    // Given a non-negative integer n, return the area of a shape where each layer adds 4*(n-1).
    // n=1 -> 1, n=2 -> 5, n=3 -> 13, n=4 -> 25.
    // YOUR CODE HERE
    return null;
}

function makeArrayConsecutive2(statues) {
    // Return the minimum number of statues that need to be added so that the
    // heights form a consecutive sequence from min to max.
    // YOUR CODE HERE
    return null;
}

function almostIncreasingSequence(sequence) {
    // Return true if it is possible to obtain a strictly increasing sequence by
    // removing no more than one element from the array.
    // YOUR CODE HERE
    return null;
}

function depositProfit(deposit, rate, threshold) {
    // Return the number of years it takes for a deposit to reach or exceed a threshold.
    // YOUR CODE HERE
    return null;
}

function isLeapYear(year) {
    // Return true if the year is a leap year.
    // YOUR CODE HERE
    return null;
}

function countDigitsDivisibleBy(n) {
    // Return the number of digits in n that evenly divide n. Skip digit 0.
    // YOUR CODE HERE
    return null;
}

// ------------------------- self-tests -------------------------
const TESTS = [
    [centuryFromYear, [1905], 20],
    [centuryFromYear, [1700], 17],
    [centuryFromYear, [2001], 21],
    [add, [3, 5], 8],
    [checkPalindrome, ["radar"], true],
    [checkPalindrome, ["hello"], false],
    [adjacentElementsProduct, [[3, 6, -2, -5, 7, 3]], 21],
    [shapeArea, [1], 1],
    [shapeArea, [2], 5],
    [shapeArea, [3], 13],
    [makeArrayConsecutive2, [[6, 2, 3, 8]], 3],
    [almostIncreasingSequence, [[1, 3, 2, 1]], false],
    [almostIncreasingSequence, [[1, 3, 2]], true],
    [depositProfit, [100, 20, 170], 3],
    [depositProfit, [100, 1, 100], 0],
    [isLeapYear, [2000], true],
    [isLeapYear, [1900], false],
    [isLeapYear, [2024], true],
    [countDigitsDivisibleBy, [1012], 3],
];

let passed = 0;
for (const [fn, args, expected] of TESTS) {
    let got;
    try {
        got = fn(...args);
    } catch (err) {
        got = `ERROR: ${err.message}`;
    }
    const ok = got === expected;
    if (ok) passed++;
    const mark = ok ? "PASS" : "FAIL";
    console.log(`[${mark}] ${fn.name}(${JSON.stringify(args)}) -> ${JSON.stringify(got)} (expected ${JSON.stringify(expected)})`);
}

console.log(`\n${passed}/${TESTS.length} tests passed`);
if (passed === TESTS.length) {
    console.log("\nALL GREEN. GCA Q1 basic problems mastered!");
}
