/**
 * GCA Real Questions — Q3: Implementation-Heavy in JavaScript (Mirror of Python's gca_q3_implementation.py)
 * 
 * Target: ~15–20 min each. Careful reading and grid / array operations.
 * Run with Node:
 *     node the-gym-prep/practice/gca_q3_implementation.js
 */

function matrixElementsSum(matrix) {
    // Each 0 means a haunted room — no room below it in the same column is suitable.
    // Return total price of all suitable rooms.
    const rows = matrix.length;
    const cols = matrix[0].length;
    let total = 0;
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            if (matrix[r][c] === 0) break; // room below is haunted
            total += matrix[r][c];
        }
    }
    return total;
}

function minesweeper(matrix) {
    // Return a grid where each cell contains the count of mines in its 8 neighbouring cells.
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            let mines = 0;
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (matrix[nr][nc] === true) mines++;
                }
            }
            row.push(mines);
        }
        result.push(row);
    }
    return result;
}

function rotateImage(grid) {
    // Rotate an n x n grid 90 degrees clockwise.
    const n = grid.length;
    const result = [];
    for (let c = 0; c < n; c++) {
        const row = [];
        for (let r = n - 1; r >= 0; r--) {
            row.push(grid[r][c]);
        }
        result.push(row);
    }
    return result;
}

function areSimilar(a, b) {
    // Two arrays are similar if they are equal OR can be made equal by swapping exactly one pair.
    if (a.length !== b.length) return false;
    const diffs = [];
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            diffs.push(i);
        }
    }
    if (diffs.length === 0) return true;
    if (diffs.length === 2) {
        const [i, j] = diffs;
        return a[i] === b[j] && a[j] === b[i];
    }
    return false;
}

function spiralNumbers(n) {
    // Fill an n x n grid with numbers 1..n*n in a clockwise spiral from the top-left.
    const grid = Array.from({ length: n }, () => new Array(n).fill(0));
    let top = 0, bottom = n - 1, left = 0, right = n - 1;
    let num = 1;
    while (num <= n * n) {
        for (let c = left; c <= right; c++) grid[top][c] = num++;
        top++;
        for (let r = top; r <= bottom; r++) grid[r][right] = num++;
        right--;
        for (let c = right; c >= left; c--) grid[bottom][c] = num++;
        bottom--;
        for (let r = bottom; r >= top; r--) grid[r][left] = num++;
        left++;
    }
    return grid;
}

function neighborSumArray(a) {
    // Return array b where b[i] = a[i-1] + a[i] + a[i+1], using 0 for out-of-bounds.
    const b = [];
    for (let i = 0; i < a.length; i++) {
        const left = i > 0 ? a[i - 1] : 0;
        const mid = a[i];
        const right = i < a.length - 1 ? a[i + 1] : 0;
        b.push(left + mid + right);
    }
    return b;
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
