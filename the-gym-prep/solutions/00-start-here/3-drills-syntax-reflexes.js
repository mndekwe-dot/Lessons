/**
 * SOLUTIONS — Daily Syntax & Muscle-Memory Reflex Drills
 *
 * Run with Node:
 *     node the-gym-prep/solutions/00-start-here/3-drills-syntax-reflexes.js
 */

function fixLengthSpelling(words) {
    return words.length;
}

function fixIncludesSpelling(items, target) {
    return items.includes(target);
}

function repeatStar(width) {
    return "*".repeat(width);
}

function isEvenNumber(n) {
    return n % 2 === 0;
}

function sumNumbers(nums) {
    let total = 0;
    for (const n of nums) {
        total += n;
    }
    return total;
}

function shoutAll(words) {
    const result = [];
    for (const word of words) {
        result.push(word.toUpperCase());
    }
    return result;
}

function findFirstDigit(s) {
    for (const ch of s) {
        if (ch >= "0" && ch <= "9") {
            return ch;
        }
    }
    return "";
}

function countPositives(nums) {
    let count = 0;
    for (const n of nums) {
        if (n > 0) {
            count++;
        }
    }
    return count;
}

function groupSigns(nums) {
    const neg = [];
    const pos = [];
    for (const n of nums) {
        if (n < 0) neg.push(n);
        else if (n > 0) pos.push(n);
    }
    return [neg, pos];
}

function sortAscending(nums) {
    return [...nums].sort((a, b) => a - b);
}

function lookupAge(ages, personName) {
    if (ages[personName] !== undefined) {
        return ages[personName];
    }
    return -1;
}

function separateLettersAndDigits(s) {
    let letters = "";
    let digits = "";
    for (const ch of s) {
        if (ch >= "0" && ch <= "9") {
            digits += ch;
        } else {
            letters += ch;
        }
    }
    return letters + digits;
}

function recallRepeat(str, n) {
    return str.repeat(n);
}

function recallJoin(words) {
    return words.join(" ");
}

function recallSplit(sentence) {
    return sentence.split(" ");
}

function recallIncludes(arr, target) {
    return arr.includes(target);
}

function recallSliceMiddle(arr) {
    return arr.slice(1, -1);
}

function recallPeelDigit(n) {
    return [n % 10, Math.floor(n / 10)];
}

function recallTallyStep(tally, key) {
    const copy = { ...tally };
    copy[key] = (copy[key] || 0) + 1;
    return copy;
}

function recallUnique(arr) {
    return [...new Set(arr)];
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

