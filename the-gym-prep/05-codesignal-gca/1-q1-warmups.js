/**
 * Q1-Level Warmups in JavaScript (Mirror of Python's q1_warmups.py)
 * 
 * Target: solve each in under 10 minutes.
 * Run with Node:
 *     node the-gym-prep/05-codesignal-gca/1-q1-warmups.js
 */

function century(year) {
    // Which century is the year in? 1905 -> 20, 1700 -> 17, 2001 -> 21.
    // YOUR CODE HERE
    return null;
}

function sumOdd(n) {
    // Sum of all odd numbers from 1 to n (inclusive). sumOdd(7) -> 16 (1+3+5+7).
    // YOUR CODE HERE
    return null;
}

function reverseNumber(n) {
    // Return the digits of n reversed, as a number. 1234 -> 4321, 5 -> 5.
    // YOUR CODE HERE
    return null;
}

function isLeap(year) {
    // Leap years: divisible by 4, EXCEPT centuries unless divisible by 400.
    // 2000 -> true, 1900 -> false, 2024 -> true, 2023 -> false.
    // YOUR CODE HERE
    return null;
}

function countDigitsDivisible(n) {
    // How many digits of n divide n evenly? 1012 -> 3 (1, 1, 2 divide 1012; skip the 0).
    // Careful: never divide by zero!
    // YOUR CODE HERE
    return null;
}

// ------------------------- self-tests -------------------------
const TESTS = [
    [century, [1905], 20],
    [century, [1700], 17],
    [century, [2001], 21],
    [sumOdd, [7], 16],
    [sumOdd, [1], 1],
    [reverseNumber, [1234], 4321],
    [reverseNumber, [5], 5],
    [isLeap, [2000], true],
    [isLeap, [1900], false],
    [isLeap, [2024], true],
    [countDigitsDivisible, [1012], 3],
    [countDigitsDivisible, [111], 3],
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
    console.log("\nALL GREEN. Q1 Warmups completed!");
}
