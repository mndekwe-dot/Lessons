/**
 * DRILLS — strings and arrays in JavaScript (Mirror of Python's drills_strings_lists.py)
 * 
 * Run with Node:
 *     node the-gym-prep/02-strings-and-arrays/2-drills-strings-arrays.js
 * 
 * Instructions:
 * Fill in each function body. Run the file to verify your solutions with the automated tests.
 * Full solutions are isolated in: the-gym-prep/solutions/02-strings-and-arrays/2-drills-strings-arrays.js
 */

// ===========================================================================
// SECTION A: indexing and slicing
// ===========================================================================

function firstChar(s) {
    // Return the first character. "hello" -> "h"
    // YOUR CODE HERE
    return null;
}

function lastChar(s) {
    // Return the last character. "hello" -> "o"
    // YOUR CODE HERE
    return null;
}

function firstThree(s) {
    // Return the first 3 characters. "hello" -> "hel"
    // YOUR CODE HERE
    return null;
}

function lastThree(s) {
    // Return the last 3 characters. "hello" -> "llo"
    // YOUR CODE HERE
    return null;
}

function middlePart(s) {
    // Return everything EXCEPT the first and last character. "hello" -> "ell"
    // YOUR CODE HERE
    return null;
}

function backwards(s) {
    // Return the string reversed. "hello" -> "olleh"
    // YOUR CODE HERE
    return null;
}

function everySecond(s) {
    // Return every 2nd character, starting from the first. "abcdef" -> "ace"
    // YOUR CODE HERE
    return null;
}

function dropFirstTwo(nums) {
    // Return the array without its first two items. [1,2,3,4] -> [3,4]
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION B: split and join
// ===========================================================================

function wordCount(sentence) {
    // How many words? "the cat sat" -> 3
    // YOUR CODE HERE
    return null;
}

function firstWord(sentence) {
    // The first word. "the cat sat" -> "the"
    // YOUR CODE HERE
    return null;
}

function lastWord(sentence) {
    // The last word. "the cat sat" -> "sat"
    // YOUR CODE HERE
    return null;
}

function reverseWords(sentence) {
    // Same words, reversed ORDER. "the cat sat" -> "sat cat the"
    // YOUR CODE HERE
    return null;
}

function joinWithCommas(words) {
    // ["a","b","c"] -> "a,b,c"
    // YOUR CODE HERE
    return null;
}

function initials(sentence) {
    // First letter of each word, joined. "the cat sat" -> "tcs"
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION C: string methods
// ===========================================================================

function shoutIt(s) {
    // Uppercase the whole string. "hi" -> "HI"
    // YOUR CODE HERE
    return null;
}

function trimmed(s) {
    // Remove spaces from both ends. "  hi  " -> "hi"
    // YOUR CODE HERE
    return null;
}

function countLetter(s, letter) {
    // How many times does `letter` appear? ("banana","a") -> 3
    // YOUR CODE HERE
    return null;
}

function swapLetter(s, oldChar, newChar) {
    // Replace every `oldChar` with `newChar`. ("banana","a","o") -> "bonono"
    // YOUR CODE HERE
    return null;
}

function startsWithVowel(word) {
    // True if the word starts with a vowel. "apple" -> true, "cat" -> false
    // YOUR CODE HERE
    return null;
}

function countDigits(s) {
    // How many characters in s are digits? "a1b22" -> 3
    // YOUR CODE HERE
    return null;
}

function onlyLetters(s) {
    // Keep only the alphabetic characters, as a string. "a1b2" -> "ab"
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION D: array methods
// ===========================================================================

function addToEnd(nums, x) {
    // Return a new array with x added at the end. ([1,2], 3) -> [1,2,3]
    // YOUR CODE HERE
    return null;
}

function withoutLast(nums) {
    // Return the array without its last item. [1,2,3] -> [1,2]
    // YOUR CODE HERE
    return null;
}

function positionOf(nums, x) {
    // The position of the first x, or -1 if absent. ([5,7,9],7) -> 1
    // YOUR CODE HERE
    return null;
}

function howManyTimes(nums, x) {
    // How many times x appears. ([1,2,1],1) -> 2
    // YOUR CODE HERE
    return null;
}

function combine(a, b) {
    // Join two arrays into one. ([1,2],[3]) -> [1,2,3]
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION E: classic patterns
// ===========================================================================

function isPalindrome(s) {
    // Reads the same both ways? "level" -> true, "hello" -> false
    // YOUR CODE HERE
    return null;
}

function alternatingSums(nums) {
    // [sum of even positions, sum of odd positions].
    // [50,60,60,45,70] -> [180, 105]
    // YOUR CODE HERE
    return null;
}

function adjacentSums(nums) {
    // Sum each neighbouring pair. [1,2,3,4] -> [3,5,7]
    // YOUR CODE HERE
    return null;
}

function longestWordIn(sentence) {
    // The longest word. "the apple sat" -> "apple"
    // YOUR CODE HERE
    return null;
}

function capitalizeWords(sentence) {
    // Uppercase the first letter of each word. "the cat sat" -> "The Cat Sat"
    // YOUR CODE HERE
    return null;
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
    [firstChar, ["hello"], "h"],
    [lastChar, ["hello"], "o"],
    [firstThree, ["hello"], "hel"],
    [lastThree, ["hello"], "llo"],
    [middlePart, ["hello"], "ell"],
    [backwards, ["hello"], "olleh"],
    [everySecond, ["abcdef"], "ace"],
    [dropFirstTwo, [[1, 2, 3, 4]], [3, 4]],
    [wordCount, ["the cat sat"], 3],
    [firstWord, ["the cat sat"], "the"],
    [lastWord, ["the cat sat"], "sat"],
    [reverseWords, ["the cat sat"], "sat cat the"],
    [joinWithCommas, [["a", "b", "c"]], "a,b,c"],
    [initials, ["the cat sat"], "tcs"],
    [shoutIt, ["hi"], "HI"],
    [trimmed, ["  hi  "], "hi"],
    [countLetter, ["banana", "a"], 3],
    [swapLetter, ["banana", "a", "o"], "bonono"],
    [startsWithVowel, ["apple"], true],
    [startsWithVowel, ["cat"], false],
    [countDigits, ["a1b22"], 3],
    [onlyLetters, ["a1b2"], "ab"],
    [addToEnd, [[1, 2], 3], [1, 2, 3]],
    [withoutLast, [[1, 2, 3]], [1, 2]],
    [positionOf, [[5, 7, 9], 7], 1],
    [positionOf, [[5, 7, 9], 4], -1],
    [howManyTimes, [[1, 2, 1], 1], 2],
    [combine, [[1, 2], [3]], [1, 2, 3]],
    [isPalindrome, ["level"], true],
    [isPalindrome, ["hello"], false],
    [alternatingSums, [[50, 60, 60, 45, 70]], [180, 105]],
    [adjacentSums, [[1, 2, 3, 4]], [3, 5, 7]],
    [longestWordIn, ["the apple sat"], "apple"],
    [capitalizeWords, ["the cat sat"], "The Cat Sat"],
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
    console.log("\nALL GREEN. Strings and arrays mastered in JavaScript!");
}
