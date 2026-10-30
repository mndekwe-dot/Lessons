/**
 * DRILLS — 2D grids in JavaScript (Mirror of Python's drills_grids.py)
 * 
 * Run with Node:
 *     node the-gym-prep/04-patterns/2-drills-grids.js
 * 
 * Instructions:
 * Fill in each function body. Run the file to verify your solutions with the automated tests.
 */

// ===========================================================================
// SECTION A: reading a grid
// ===========================================================================

function sizeOf(grid) {
    // Return [rows, cols]. [[1,2,3],[4,5,6]] -> [2,3]
    return [grid.length, grid[0].length];
}

function cell(grid, r, c) {
    // Return the value at row r, column c. ([[1,2],[3,4]], 1, 0) -> 3
    return grid[r][c];
}

function firstRow(grid) {
    // Return the first row. [[1,2],[3,4]] -> [1,2]
    return grid[0];
}

function getColumn(grid, j) {
    // Return column j as an array. ([[1,2],[3,4]], 0) -> [1,3]
    const col = [];
    for (let r = 0; r < grid.length; r++) {
        col.push(grid[r][j]);
    }
    return col;
}

function mainDiagonal(grid) {
    // Top-left to bottom-right. [[1,2],[3,4]] -> [1,4]
    const diag = [];
    for (let i = 0; i < grid.length; i++) {
        diag.push(grid[i][i]);
    }
    return diag;
}

// ===========================================================================
// SECTION B: visiting every cell
// ===========================================================================

function gridTotal(grid) {
    // Add up every number. [[1,2],[3,4]] -> 10
    let sum = 0;
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            sum += grid[r][c];
        }
    }
    return sum;
}

function biggestInGrid(grid) {
    // The largest value anywhere. [[1,9],[3,4]] -> 9
    let maxVal = -Infinity;
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] > maxVal) maxVal = grid[r][c];
        }
    }
    return maxVal;
}

function countZeros(grid) {
    // How many cells are 0? [[0,1],[0,4]] -> 2
    let count = 0;
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === 0) count++;
        }
    }
    return count;
}

function flatten(grid) {
    // All values in one array, row by row. [[1,2],[3,4]] -> [1,2,3,4]
    return grid.flat();
}

function doubleAll(grid) {
    // A NEW grid with every value doubled. [[1,2],[3,4]] -> [[2,4],[6,8]]
    return grid.map(row => row.map(val => val * 2));
}

// ===========================================================================
// SECTION C: rows and columns
// ===========================================================================

function rowSums(grid) {
    // Sum of each row. [[1,2],[3,4]] -> [3,7]
    return grid.map(row => row.reduce((sum, v) => sum + v, 0));
}

function columnSums(grid) {
    // Sum of each column. [[1,2],[3,4]] -> [4,6]
    const cols = grid[0].length;
    const result = [];
    for (let c = 0; c < cols; c++) {
        let sum = 0;
        for (let r = 0; r < grid.length; r++) {
            sum += grid[r][c];
        }
        result.push(sum);
    }
    return result;
}

function biggestRowSum(grid) {
    // The largest row total. [[1,2],[3,4]] -> 7
    return Math.max(...rowSums(grid));
}

function hasZeroRow(grid) {
    // True if any row is entirely zeros. [[0,0],[1,2]] -> true
    return grid.some(row => row.every(val => val === 0));
}

// ===========================================================================
// SECTION D: building a grid
// ===========================================================================

function makeGrid(rows, cols, value) {
    // A rows x cols grid filled with value. (2,3,0) -> [[0,0,0],[0,0,0]]
    const grid = [];
    for (let r = 0; r < rows; r++) {
        grid.push(new Array(cols).fill(value));
    }
    return grid;
}

function identity(n) {
    // n x n grid, 1 on the main diagonal, 0 elsewhere. 2 -> [[1,0],[0,1]]
    const grid = [];
    for (let r = 0; r < n; r++) {
        const row = new Array(n).fill(0);
        row[r] = 1;
        grid.push(row);
    }
    return grid;
}

function transpose(grid) {
    // Swap rows and columns. [[1,2,3],[4,5,6]] -> [[1,4],[2,5],[3,6]]
    const rows = grid.length;
    const cols = grid[0].length;
    const result = [];
    for (let c = 0; c < cols; c++) {
        const newRow = [];
        for (let r = 0; r < rows; r++) {
            newRow.push(grid[r][c]);
        }
        result.push(newRow);
    }
    return result;
}

// ===========================================================================
// SECTION E: neighbours (the Q3 pattern)
// ===========================================================================

function neighbourSum(grid, r, c) {
    // Sum of the 4 neighbours (up/down/left/right) that are ON the grid.
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const rows = grid.length;
    const cols = grid[0].length;
    let sum = 0;
    for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            sum += grid[nr][nc];
        }
    }
    return sum;
}

function countNeighbourMines(grid, r, c) {
    // How many of the 8 surrounding cells equal 1?
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (grid[nr][nc] === 1) count++;
        }
    }
    return count;
}

function isEdgeCell(grid, r, c) {
    // True if the cell is on the outer border of the grid.
    return r === 0 || r === grid.length - 1 || c === 0 || c === grid[0].length - 1;
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
