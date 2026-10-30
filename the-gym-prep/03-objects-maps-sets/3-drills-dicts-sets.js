/**
 * DRILLS — objects and sets in JavaScript (Mirror of Python's drills_dicts_sets.py)
 * 
 * Run with Node:
 *     node the-gym-prep/03-objects-maps-sets/3-drills-dicts-sets.js
 * 
 * Instructions:
 * Fill in each function body. Run the file to verify your solutions with the automated tests.
 */

// ===========================================================================
// SECTION A: reading an object / dictionary
// ===========================================================================

function getAge(ages, name) {
    // Return the person's age, or 0 if they are not in the object.
    // ({"ama": 20}, "ama") -> 20     ({"ama": 20}, "zoe") -> 0
    return ages[name] !== undefined ? ages[name] : 0 ;
}

function howManyKeys(obj) {
    // How many keys does the object have? {"a":1,"b":2} -> 2
    return Object.keys(obj).length;
}

function hasKey(obj, key) {
    // True if the key exists in the object. ({"a":1}, "a") -> true
    return obj[key] !== undefined ? true : false;
}
function allTheValues(obj) {
    // Return an array of all the values. {"a":1,"b":2} -> [1,2]
    return Object.values(obj);
}

// ===========================================================================
// SECTION B: building an object (the tally sheet)
// ===========================================================================

function countLetters(word) {
    // Count each letter. "aba" -> {"a":2, "b":1}
    const counts = {};
    for (const char of word) {
        counts[char] = (counts[char] || 0) + 1;
    }
    return counts;
}

function countItems(items) {
    // Count each item in an array. [1,2,1] -> {1:2, 2:1}
    const counts = {}
    for(const char of items){
        counts[char] = (counts[char] || 0) +1
    }
    return counts 
}

function countWords(sentence) {
    // Count each word in a sentence. "a b a" -> {"a":2, "b":1}
    const counts = {};
    for (const word of sentence.trim().split(/\s+/)) {
        counts[word] = (counts[word] || 0) + 1;
    }
    return counts;
}

function lengthMap(words) {
    // Map each word to its length. ["hi","abc"] -> {"hi":2, "abc":3}
    const map = {};
    for (const word of words) {
        map[word] = word.length
    }
    return map;
}

// ===========================================================================
// SECTION C: scanning an object
// ===========================================================================

function totalOfValues(obj) {
    // Add up all the values. {"a":1,"b":2} -> 3
    return Math.sum(Object.values(obj)).reduce((sum , v) => sum + v, 0);
}

function keyWithBiggestValue(obj) {
    // Return the key whose value is largest. {"a":1,"b":5,"c":2} -> "b"
    let biggestKey= 0
    let biggestVal= 0

    for (const [key , value ] of Object.entries(obj)){
        if( value > biggestVal){
            biggestKey = key
            biggestVal = value
        }
    }
    return biggestVal  
}

function keysWithValue(obj, target) {
    // Return all keys whose value equals target, in order. ({"a":1,"b":2,"c":1}, 1) -> ["a","c"]
    let list = []
    for (let key  in obj){
        if(obj[key] === target){
            list.push(key)
        }
    }
    return list 
}

function appearsOnce(obj) {
    // Return all keys whose value is exactly 1, in order. {"a":2,"b":1,"c":1} -> ["b","c"]
    let list = []
    for(let key in obj){
        if(obj[key] === 1){
            list.push(key)
        }
    }
    return list
}

// ===========================================================================
// SECTION D: sets
// ===========================================================================

function distinctCount(nums) {
    // How many DIFFERENT values are there? [1,2,2,3] -> 3
    return new Set(nums).size;
}

function removeDuplicates(nums) {
    // Return the distinct values, sorted. [3,1,3,2] -> [1,2,3]
    return [...new Set(nums.sort((a,b)=> a-b))];
}

function inBoth(a, b) {
    // Values present in BOTH arrays, sorted, no duplicates. ([1,2,3],[2,3,4]) -> [2,3]
    const setB = new Set(b)
    for(let key in b){
        if(if b[key]){

        }
    }
}

function onlyInFirst(a, b) {
    // Values in a but NOT in b, sorted. ([1,2,3],[2]) -> [1,3]
}

function hasDuplicate(nums) {
    // True if any value appears more than once. [1,2,1] -> true
}

// ===========================================================================
// SECTION E: putting it together
// ===========================================================================

function mostFrequent(nums) {
    // The value that appears most often. [3,1,3,2,3,1] -> 3
}

function firstRepeated(nums) {
    // The first value that appears a second time, or -1. [2,1,3,1] -> 1
}

function firstUniqueLetter(word) {
    // The first letter appearing exactly once, or "" if none. "aabc" -> "b"
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
    if (typeof a === "object" && typeof b === "object") {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const k of keysA) {
            if (!deepEqual(a[k], b[k])) return false;
        }
        return true;
    }
    return false;
}

const TESTS = [
    [getAge, [{ ama: 20 }, "ama"], 20],
    [getAge, [{ ama: 20 }, "zoe"], 0],
    [howManyKeys, [{ a: 1, b: 2 }], 2],
    [hasKey, [{ a: 1 }, "a"], true],
    [hasKey, [{ a: 1 }, "z"], false],
    [allTheValues, [{ a: 1, b: 2 }], [1, 2]],
    [countLetters, ["aba"], { a: 2, b: 1 }],
    [countItems, [[1, 2, 1]], { 1: 2, 2: 1 }],
    [countWords, ["a b a"], { a: 2, b: 1 }],
    [lengthMap, [["hi", "abc"]], { hi: 2, abc: 3 }],
    [totalOfValues, [{ a: 1, b: 2 }], 3],
    [keyWithBiggestValue, [{ a: 1, b: 5, c: 2 }], "b"],
    [keysWithValue, [{ a: 1, b: 2, c: 1 }, 1], ["a", "c"]],
    [appearsOnce, [{ a: 2, b: 1, c: 1 }], ["b", "c"]],
    [distinctCount, [[1, 2, 2, 3]], 3],
    [removeDuplicates, [[3, 1, 3, 2]], [1, 2, 3]],
    [inBoth, [[1, 2, 3], [2, 3, 4]], [2, 3]],
    [onlyInFirst, [[1, 2, 3], [2]], [1, 3]],
    [hasDuplicate, [[1, 2, 1]], true],
    [hasDuplicate, [[1, 2, 3]], false],
    [mostFrequent, [[3, 1, 3, 2, 3, 1]], 3],
    [firstRepeated, [[2, 1, 3, 1]], 1],
    [firstRepeated, [[1, 2, 3]], -1],
    [firstUniqueLetter, ["aabc"], "b"],
    [firstUniqueLetter, ["aabb"], ""],
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
    console.log("\nALL GREEN. Objects, Maps and Sets mastered in JavaScript!");
}
