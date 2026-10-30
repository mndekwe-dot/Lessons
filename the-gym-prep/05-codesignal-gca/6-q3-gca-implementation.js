/**
 * GCA Real Questions — Q3: Implementation-Heavy in JavaScript (Mirror of Python's gca_q3_implementation.py)
 * 
 * Target: ~15–20 min each. Careful reading and grid / array operations.
 * Run with Node:
 *     node the-gym-prep/05-codesignal-gca/6-q3-gca-implementation.js
 */

function matrixElementsSum(matrix) {
    // Each 0 means a haunted room — no room below it in the same column is suitable.
    // Return total price of all suitable rooms.
    // YOUR CODE HERE
    return null;
}

function minesweeper(matrix) {
    // Return a grid where each cell contains the count of mines in its 8 neighbouring cells.
    // YOUR CODE HERE
    return null;
}

function rotateImage(grid) {
    // Rotate an n x n grid 90 degrees clockwise.
    // YOUR CODE HERE
    return null;
}

function areSimilar(a, b) {
    // Two arrays are similar if they are equal OR can be made equal by swapping exactly one pair.
    // YOUR CODE HERE
    return null;
}

function spiralNumbers(n) {
    // Fill an n x n grid with numbers 1..n*n in a clockwise spiral from the top-left.
    // YOUR CODE HERE
    return null;
}

function neighborSumArray(a) {
    // Return array b where b[i] = a[i-1] + a[i] + a[i+1], using 0 for out-of-bounds.
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

const T = true, F = false;
const TESTS = [
    [matrixElementsSum, [[[0, 1, 1, 2], [0, 5, 0, 0], [2, 0, 3, 3]]], 9],
    [matrixElementsSum, [[[1, 1], [1, 1]]], 4],
    [minesweeper, [[[T, F, F], [F, T, F], [F, F, F]]], [[1, 2, 1], [2, 1, 1], [1, 1, 1]]],
    [rotateImage, [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]],
    [rotateImage, [[[1]]], [[1]]],
    [areSimilar, [[1, 2, 3], [1, 2, 3]], true],
    [areSimilar, [[1, 2, 3], [2, 1, 3]], true],
    [areSimilar, [[1, 2, 2], [2, 1, 1]], false],
    [spiralNumbers, [3], [[1, 2, 3], [8, 9, 4], [7, 6, 5]]],
    [neighborSumArray, [[4, 0, 1, -2, 3]], [4, 5, -1, 2, 1]],
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
    console.log("\nALL GREEN. GCA Q3 implementation challenges mastered in JavaScript!");
}
