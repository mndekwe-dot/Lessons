/**
 * DRILLS — 2D grids in JavaScript (Mirror of Python's drills_grids.py)
 * 
 * Run with Node:
 *     node the-gym-prep/04-patterns/2-drills-grids.js
 * 
 * Instructions:
 * Fill in each function body. Run the file to verify your solutions with the automated tests.
 * Full solutions are isolated in: the-gym-prep/solutions/04-patterns/2-drills-grids.js
 */

// ===========================================================================
// SECTION A: reading a grid
// ===========================================================================

function sizeOf(grid) {
    // Return [rows, cols]. [[1,2,3],[4,5,6]] -> [2,3]
    // YOUR CODE HERE
    return null;
}

function cell(grid, r, c) {
    // Return the value at row r, column c. ([[1,2],[3,4]], 1, 0) -> 3
    // YOUR CODE HERE
    return null;
}

function firstRow(grid) {
    // Return the first row. [[1,2],[3,4]] -> [1,2]
    // YOUR CODE HERE
    return null;
}

function getColumn(grid, j) {
    // Return column j as an array. ([[1,2],[3,4]], 0) -> [1,3]
    // YOUR CODE HERE
    return null;
}

function mainDiagonal(grid) {
    // Top-left to bottom-right. [[1,2],[3,4]] -> [1,4]
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION B: visiting every cell
// ===========================================================================

function gridTotal(grid) {
    // Add up every number. [[1,2],[3,4]] -> 10
    // YOUR CODE HERE
    return null;
}

function biggestInGrid(grid) {
    // The largest value anywhere. [[1,9],[3,4]] -> 9
    // YOUR CODE HERE
    return null;
}

function countZeros(grid) {
    // How many cells are 0? [[0,1],[0,4]] -> 2
    // YOUR CODE HERE
    return null;
}

function flatten(grid) {
    // All values in one array, row by row. [[1,2],[3,4]] -> [1,2,3,4]
    // YOUR CODE HERE
    return null;
}

function doubleAll(grid) {
    // A NEW grid with every value doubled. [[1,2],[3,4]] -> [[2,4],[6,8]]
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION C: rows and columns
// ===========================================================================

function rowSums(grid) {
    // Sum of each row. [[1,2],[3,4]] -> [3,7]
    // YOUR CODE HERE
    return null;
}

function columnSums(grid) {
    // Sum of each column. [[1,2],[3,4]] -> [4,6]
    // YOUR CODE HERE
    return null;
}

function biggestRowSum(grid) {
    // The largest row total. [[1,2],[3,4]] -> 7
    // YOUR CODE HERE
    return null;
}

function hasZeroRow(grid) {
    // True if any row is entirely zeros. [[0,0],[1,2]] -> true
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION D: building a grid
// ===========================================================================

function makeGrid(rows, cols, value) {
    // A rows x cols grid filled with value. (2,3,0) -> [[0,0,0],[0,0,0]]
    // YOUR CODE HERE
    return null;
}

function identity(n) {
    // n x n grid, 1 on the main diagonal, 0 elsewhere. 2 -> [[1,0],[0,1]]
    // YOUR CODE HERE
    return null;
}

function transpose(grid) {
    // Swap rows and columns. [[1,2,3],[4,5,6]] -> [[1,4],[2,5],[3,6]]
    // YOUR CODE HERE
    return null;
}

// ===========================================================================
// SECTION E: neighbours (the Q3 pattern)
// ===========================================================================

function neighbourSum(grid, r, c) {
    // Sum of the 4 neighbours (up/down/left/right) that are ON the grid.
    // YOUR CODE HERE
    return null;
}

function countNeighbourMines(grid, r, c) {
    // How many of the 8 surrounding cells equal 1?
    // YOUR CODE HERE
    return null;
}

function isEdgeCell(grid, r, c) {
    // True if the cell is on the outer border of the grid.
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
    [sizeOf, [[[1, 2, 3], [4, 5, 6]]], [2, 3]],
    [cell, [[[1, 2], [3, 4]], 1, 0], 3],
    [firstRow, [[[1, 2], [3, 4]]], [1, 2]],
    [getColumn, [[[1, 2], [3, 4]], 0], [1, 3]],
    [getColumn, [[[1, 2], [3, 4]], 1], [2, 4]],
    [mainDiagonal, [[[1, 2], [3, 4]]], [1, 4]],
    [gridTotal, [[[1, 2], [3, 4]]], 10],
    [biggestInGrid, [[[1, 9], [3, 4]]], 9],
    [countZeros, [[[0, 1], [0, 4]]], 2],
    [flatten, [[[1, 2], [3, 4]]], [1, 2, 3, 4]],
    [doubleAll, [[[1, 2], [3, 4]]], [[2, 4], [6, 8]]],
    [rowSums, [[[1, 2], [3, 4]]], [3, 7]],
    [columnSums, [[[1, 2], [3, 4]]], [4, 6]],
    [biggestRowSum, [[[1, 2], [3, 4]]], 7],
    [hasZeroRow, [[[0, 0], [1, 2]]], true],
    [hasZeroRow, [[[0, 1], [1, 2]]], false],
    [makeGrid, [2, 3, 0], [[0, 0, 0], [0, 0, 0]]],
    [identity, [2], [[1, 0], [0, 1]]],
    [transpose, [[[1, 2, 3], [4, 5, 6]]], [[1, 4], [2, 5], [3, 6]]],
    [neighbourSum, [[[1, 2], [3, 4]], 0, 0], 5],
    [countNeighbourMines, [[[1, 1, 0], [0, 0, 0], [0, 0, 0]], 1, 1], 2],
    [isEdgeCell, [[[1, 2], [3, 4]], 0, 0], true],
    [isEdgeCell, [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], 1, 1], false],
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
    console.log("\nALL GREEN. 2D grids and matrix operations mastered in JavaScript!");
}
