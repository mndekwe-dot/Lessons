/**
 * DRILLS — strings and arrays in JavaScript (Mirror of Python's drills_strings_lists.py)
 * 
 * Run with Node:
 *     node the-gym-prep/practice/drills_strings_arrays.js
 * 
 * Instructions:
 * Fill in each function body. Run the file to verify your solutions with the automated tests.
 */

// ===========================================================================
// SECTION A: indexing and slicing
// ===========================================================================

function firstChar(s) {
    // Return the first character. "hello" -> "h"
    return s[0];
}

function lastChar(s) {
    // Return the last character. "hello" -> "o"
    return s[s.length - 1];
}

function firstThree(s) {
    // Return the first 3 characters. "hello" -> "hel"
    return s.slice(0, 3);
}

function lastThree(s) {
    // Return the last 3 characters. "hello" -> "llo"
    return s.slice(-3);
}

function middlePart(s) {
    // Return everything EXCEPT the first and last character. "hello" -> "ell"
    return s.slice(1, -1);
}

function backwards(s) {
    // Return the string reversed. "hello" -> "olleh"
    return s.split("").reverse().join("");
}

function everySecond(s) {
    // Return every 2nd character, starting from the first. "abcdef" -> "ace"
    let result = "";
    for (let i = 0; i < s.length; i += 2) {
        result += s[i];
    }
    return result;
}

function dropFirstTwo(nums) {
    // Return the array without its first two items. [1,2,3,4] -> [3,4]
    return nums.slice(2);
}

// ===========================================================================
// SECTION B: split and join
// ===========================================================================

function wordCount(sentence) {
    // How many words? "the cat sat" -> 3
    return sentence.trim().split(/\s+/).length;
}

function firstWord(sentence) {
    // The first word. "the cat sat" -> "the"
    return sentence.trim().split(/\s+/)[0];
}

function lastWord(sentence) {
    // The last word. "the cat sat" -> "sat"
    const words = sentence.trim().split(/\s+/);
    return words[words.length - 1];
}

function reverseWords(sentence) {
    // Same words, reversed ORDER. "the cat sat" -> "sat cat the"
    return sentence.trim().split(/\s+/).reverse().join(" ");
}

function joinWithCommas(words) {
    // ["a","b","c"] -> "a,b,c"
    return words.join(",");
}

function initials(sentence) {
    // First letter of each word, joined. "the cat sat" -> "tcs"
    return sentence.trim().split(/\s+/).map(w => w[0]).join("");
}

// ===========================================================================
// SECTION C: string methods
// ===========================================================================

function shoutIt(s) {
    // Uppercase the whole string. "hi" -> "HI"
    return s.toUpperCase();
}

function trimmed(s) {
    // Remove spaces from both ends. "  hi  " -> "hi"
    return s.trim();
}

function countLetter(s, letter) {
    // How many times does `letter` appear? ("banana","a") -> 3
    let count = 0;
    for (const char of s) {
        if (char === letter) count++;
    }
    return count;
}

function swapLetter(s, oldChar, newChar) {
    // Replace every `oldChar` with `newChar`. ("banana","a","o") -> "bonono"
    return s.replaceAll(oldChar, newChar);
}

function startsWithVowel(word) {
    // True if the word starts with a vowel. "apple" -> true, "cat" -> false
    return "aeiouAEIOU".includes(word[0]);
}

function countDigits(s) {
    // How many characters in s are digits? "a1b22" -> 3
    let count = 0;
    for (const char of s) {
        if (char >= "0" && char <= "9") count++;
    }
    return count;
}

function onlyLetters(s) {
    // Keep only the alphabetic characters, as a string. "a1b2" -> "ab"
    let result = "";
    for (const char of s) {
        if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
            result += char;
        }
    }
    return result;
}

// ===========================================================================
// SECTION D: array methods
// ===========================================================================

function addToEnd(nums, x) {
    // Return a new array with x added at the end. ([1,2], 3) -> [1,2,3]
    return [...nums, x];
}

function withoutLast(nums) {
    // Return the array without its last item. [1,2,3] -> [1,2]
    return nums.slice(0, -1);
}

function positionOf(nums, x) {
    // The position of the first x, or -1 if absent. ([5,7,9],7) -> 1
    return nums.indexOf(x);
}

function howManyTimes(nums, x) {
    // How many times x appears. ([1,2,1],1) -> 2
    let count = 0;
    for (const item of nums) {
        if (item === x) count++;
    }
    return count;
}

function combine(a, b) {
    // Join two arrays into one. ([1,2],[3]) -> [1,2,3]
    return a.concat(b);
}

// ===========================================================================
// SECTION E: classic patterns
// ===========================================================================

function isPalindrome(s) {
    // Reads the same both ways? "level" -> true, "hello" -> false
    return s === s.split("").reverse().join("");
}

function alternatingSums(nums) {
    // [sum of even positions, sum of odd positions].
    // [50,60,60,45,70] -> [180, 105]
    let evenSum = 0;
    let oddSum = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i % 2 === 0) evenSum += nums[i];
        else oddSum += nums[i];
    }
    return [evenSum, oddSum];
}

function adjacentSums(nums) {
    // Sum each neighbouring pair. [1,2,3,4] -> [3,5,7]
    const result = [];
    for (let i = 0; i < nums.length - 1; i++) {
        result.push(nums[i] + nums[i + 1]);
    }
    return result;
}

function longestWordIn(sentence) {
    // The longest word. "the apple sat" -> "apple"
    const words = sentence.trim().split(/\s+/);
    let best = words[0];
    for (const w of words) {
        if (w.length > best.length) best = w;
    }
    return best;
}

function capitalizeWords(sentence) {
    // Uppercase the first letter of each word. "the cat sat" -> "The Cat Sat"
    return sentence.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
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
