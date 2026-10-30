/**
 * Daily Syntax & Muscle-Memory Reflex Drills
 *
 * Designed specifically for your profile:
 * "Strong thinker, imprecise typist."
 *
 * Target: 10 minutes each morning as a warm-up.
 * Run with Node:
 *     node the-gym-prep/00-start-here/3-drills-syntax-reflexes.js
 */

// ============================================================================
// PART 1: SPOT & FIX THE SLIP (12 Drills)
// Each function below has ONE of your past syntax or return slips.
// Find the slip and fix it!
// ============================================================================

// 1. Fix the spelling slip on the property name.
function fixLengthSpelling(words) {
    return words.lenght;
}

// 2. Fix the spelling slip on the method name.
function fixIncludesSpelling(items, target) {
    return items.include(target);
}

// 3. Fix the string repetition (Python style '*' does not work in JS!).
function repeatStar(width) {
    return "*" * width;
}

// 4. Fix the operator: check if n is even (not division!).
function isEvenNumber(n) {
    return n / 2 === 0;
}

// 5. Fix the declaration: 'total' is reassigned inside the loop, so 'const' crashes!
function sumNumbers(nums) {
    const total = 0;
    for (const n of nums) {
        total += n;
    }
    return total;
}

// 6. Fix the loop variable mismatch (header says 'x', body uses 'word').
function shoutAll(words) {
    const result = [];
    for (const x of words) {
        result.push(word.toUpperCase());
    }
    return result;
}

// 7. Fix the return value: return the FIRST DIGIT CHARACTER itself, not 'true'!
function findFirstDigit(s) {
    for (const ch of s) {
        if (ch >= "0" && ch <= "9") {
            return true;
        }
    }
    return "";
}

// 8. Fix the premature return inside the loop (stops on the very first item!).
function countPositives(nums) {
    let count = 0;
    for (const n of nums) {
        if (n > 0) {
            count++;
        }
        return count;
    }
}

// 9. Fix the '.push()' return trap (push returns the new length, not the array!).
function groupSigns(nums) {
    const neg = [];
    const pos = [];
    for (const n of nums) {
        if (n < 0) neg.push(n);
        else if (n > 0) pos.push(n);
    }
    const list = [];
    return list.push(neg, pos);
}

// 10. Fix the number sort (default .sort() sorts alphabetically as strings!).
function sortAscending(nums) {
    return [...nums].sort();
}

// 11. Fix dot vs bracket notation when looking up a dynamic variable key.
function lookupAge(ages, personName) {
    if (ages.personName !== undefined) {
        return ages.personName;
    }
    return -1;
}

// 12. Fix the character check (.isLetter() does not exist in JavaScript!).
function separateLettersAndDigits(s) {
    let letters = "";
    let digits = "";
    for (const ch of s) {
        if (ch.isLetter()) {
            letters += ch;
        } else {
            digits += ch;
        }
    }
    return letters + digits;
}

// ============================================================================
// PART 2: EXACT METHOD RECALL FROM MEMORY (8 Drills)
// Write the 1-line or 2-line body using the exact JavaScript method.
// ============================================================================

// 13. Repeat the string `str` exactly `n` times. ("ha", 3) -> "hahaha"
function recallRepeat(str, n) {
    // YOUR CODE HERE
    return null;
}

// 14. Join an array of words with a single space between them. (["a", "b"]) -> "a b"
function recallJoin(words) {
    // YOUR CODE HERE
    return null;
}

// 15. Split a sentence by spaces into an array of words. ("hi there") -> ["hi", "there"]
function recallSplit(sentence) {
    // YOUR CODE HERE
    return null;
}

// 16. Check if `arr` contains `target` (return true or false).
function recallIncludes(arr, target) {
    // YOUR CODE HERE
    return null;
}

// 17. Return a copy of `arr` without the first and last elements. ([1, 2, 3, 4]) -> [2, 3]
function recallSliceMiddle(arr) {
    // YOUR CODE HERE
    return null;
}

// 18. Return the last digit of positive integer `n` AND the remaining digits: [lastDigit, rest]
// (1234) -> [4, 123]
function recallPeelDigit(n) {
    // YOUR CODE HERE
    return null;
}

// 19. Increment the count of `key` inside `tally` object (initializing to 0 if missing).
// Return the updated tally object. ({ a: 1 }, "a") -> { a: 2 }, ({ a: 1 }, "b") -> { a: 1, b: 1 }
function recallTallyStep(tally, key) {
    const copy = { ...tally };
    // YOUR CODE HERE (1 line to update copy[key])
    return null;
}

// 20. Remove duplicates from `arr` while keeping original order. ([1, 2, 1, 3, 2]) -> [1, 2, 3]
function recallUnique(arr) {
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
    if (typeof a === "object" && typeof b === "object") {
        const ka = Object.keys(a), kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        return ka.every(k => deepEqual(a[k], b[k]));
    }
    return false;
}

const TESTS = [
    [fixLengthSpelling, [["a", "b", "c"]], 3],
    [fixIncludesSpelling, [[10, 20, 30], 20], true],
    [fixIncludesSpelling, [[10, 20, 30], 99], false],
    [repeatStar, [5], "*****"],
    [isEvenNumber, [4], true],
    [isEvenNumber, [7], false],
    [sumNumbers, [[1, 2, 3, 4]], 10],
    [shoutAll, [["hi", "go"]], ["HI", "GO"]],
    [findFirstDigit, ["ab7cd9"], "7"],
    [findFirstDigit, ["abcdef"], ""],
    [countPositives, [[-1, 2, -3, 4, 5]], 3],
    [groupSigns, [[1, -2, 0, 3, -4]], [[-2, -4], [1, 3]]],
    [sortAscending, [[10, 2, 30, 1]], [1, 2, 10, 30]],
    [lookupAge, [{ Ama: 20, Kofi: 0 }, "Kofi"], 0],
    [lookupAge, [{ Ama: 20 }, "Yaw"], -1],
    [separateLettersAndDigits, ["a1b2c3"], "abc123"],
    [recallRepeat, ["ha", 3], "hahaha"],
    [recallJoin, [["hello", "world"]], "hello world"],
    [recallSplit, ["one two three"], ["one", "two", "three"]],
    [recallIncludes, [["cat", "dog"], "dog"], true],
    [recallSliceMiddle, [[1, 2, 3, 4]], [2, 3]],
    [recallPeelDigit, [1234], [4, 123]],
    [recallTallyStep, [{ a: 1 }, "a"], { a: 2 }],
    [recallTallyStep, [{ a: 1 }, "b"], { a: 1, b: 1 }],
    [recallUnique, [[1, 2, 1, 3, 2]], [1, 2, 3]],
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

console.log(`\n${passed}/${TESTS.length} reflex drills passed`);
if (passed === TESTS.length) {
    console.log("\nALL GREEN. Syntax reflexes sharp!");
}

