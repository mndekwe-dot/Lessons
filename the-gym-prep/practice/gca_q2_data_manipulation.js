/**
 * GCA Real Questions — Q2: Data Manipulation in JavaScript (Mirror of Python's gca_q2_data_manipulation.py)
 * 
 * Target: ~10–15 min each.
 * Run with Node:
 *     node the-gym-prep/practice/gca_q2_data_manipulation.js
 */

function allLongestStrings(words) {
    // Return ALL strings of maximum length, keeping their order.
    let maxLen = 0;
    for (const w of words) {
        if (w.length > maxLen) maxLen = w.length;
    }
    return words.filter(w => w.length === maxLen);
}

function addBorder(picture) {
    // Surround a rectangular matrix of characters with a border of asterisks (*).
    const width = picture[0].length + 2;
    const border = "*".repeat(width);
    const result = [border];
    for (const row of picture) {
        result.push("*" + row + "*");
    }
    result.push(border);
    return result;
}

function sortedSquares(nums) {
    // Square every number in the array and return the result sorted ascending.
    return nums.map(x => x * x).sort((a, b) => a - b);
}

function isAnagram(a, b) {
    // Return true if a and b use exactly the same letters.
    if (a.length !== b.length) return false;
    return a.split("").sort().join("") === b.split("").sort().join("");
}

function firstDigit(s) {
    // Return the first digit character in string s.
    for (const ch of s) {
        if (ch >= "0" && ch <= "9") return ch;
    }
    return "";
}

function alternatingSums(a) {
    // Players go alternately to team 1 and team 2. Return [team1_weight, team2_weight].
    let t1 = 0, t2 = 0;
    for (let i = 0; i < a.length; i++) {
        if (i % 2 === 0) t1 += a[i];
        else t2 += a[i];
    }
    return [t1, t2];
}

function commonCharacterCount(s1, s2) {
    // Return the count of characters that appear in both strings (counted per occurrence).
    const list2 = s2.split("");
    let count = 0;
    for (const ch of s1) {
        const idx = list2.indexOf(ch);
        if (idx !== -1) {
            count++;
            list2.splice(idx, 1);
        }
    }
    return count;
}

function isLucky(n) {
    // Return true if sum of first half digits equals sum of second half.
    const s = String(n);
    const half = Math.floor(s.length / 2);
    let sum1 = 0, sum2 = 0;
    for (let i = 0; i < half; i++) sum1 += Number(s[i]);
    for (let i = half; i < s.length; i++) sum2 += Number(s[i]);
    return sum1 === sum2;
}

function sortByHeight(a) {
    // Sort the non-negative numbers (people) in ascending order while leaving
    // the -1 values (trees) fixed in place.
    const people = a.filter(x => x !== -1).sort((x, y) => x - y);
    let pIdx = 0;
    return a.map(x => (x === -1 ? -1 : people[pIdx++]));
}

function reverseInParentheses(inputString) {
    // Reverse substrings inside each pair of matching parentheses from inside out.
    let s = inputString;
    while (s.includes("(")) {
        const closeIdx = s.indexOf(")");
        const openIdx = s.lastIndexOf("(", closeIdx);
        const inside = s.slice(openIdx + 1, closeIdx);
        const reversed = inside.split("").reverse().join("");
        s = s.slice(0, openIdx) + reversed + s.slice(closeIdx + 1);
    }
    return s;
}

function differentSquares(matrix) {
    // Return the number of distinct 2x2 squares in a matrix.
    const rows = matrix.length;
    const cols = matrix[0].length;
    const set = new Set();
    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
            const square = `${matrix[r][c]},${matrix[r][c+1]},${matrix[r+1][c]},${matrix[r+1][c+1]}`;
            set.add(square);
        }
    }
    return set.size;
}

function knapsackLight(value1, weight1, value2, weight2, maxWeight) {
    // Return the maximum total value that can be carried in the knapsack.
    if (weight1 + weight2 <= maxWeight) return value1 + value2;
    let maxVal = 0;
    if (weight1 <= maxWeight) maxVal = Math.max(maxVal, value1);
    if (weight2 <= maxWeight) maxVal = Math.max(maxVal, value2);
    return maxVal;
}

function arrayChange(inputArray) {
    // Minimum increments so array becomes strictly increasing.
    let moves = 0;
    let prev = inputArray[0];
    for (let i = 1; i < inputArray.length; i++) {
        if (inputArray[i] <= prev) {
            moves += (prev + 1 - inputArray[i]);
            prev = prev + 1;
        } else {
            prev = inputArray[i];
        }
    }
    return moves;
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
