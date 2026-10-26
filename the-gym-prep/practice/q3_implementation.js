/**
 * Q3-LEVEL PROBLEMS (Implementation-heavy, mostly 2D Grids)
 * Target: 15-20 minutes each.
 *
 * Real CodeSignal GCA problems often test matrix traversal and simulation.
 *
 * Run:  node the-gym-prep/practice/q3_implementation.js
 */

// 1. Each cell is a hotel room price; 0 means the room is haunted.
// A room is suitable only if it is not haunted AND no room ABOVE it
// (same column, smaller row index) is haunted. Return total price of suitable rooms.
// [[0,1,1,2], [0,5,0,0], [2,0,3,3]] -> 9 (1+1+2 + 5)
function matrixElementsSum(matrix) {
  // YOUR CODE HERE
  return null;
}

// 2. matrix contains true (mine) and false (empty). Return a grid of the same
// size where each cell holds the NUMBER of mines in the 8 neighboring cells.
// [[true, false, false], [false, true, false], [false, false, false]]
// -> [[1, 2, 1], [2, 1, 1], [1, 1, 1]]
function minesweeper(matrix) {
  // YOUR CODE HERE
  return null;
}

// 3. Rotate a square grid 90 degrees clockwise.
// [[1,2,3], [4,5,6], [7,8,9]] -> [[7,4,1], [8,5,2], [9,6,3]]
function rotateImage(grid) {
  // YOUR CODE HERE
  return null;
}

// 4. Two arrays are 'similar' if they are equal, OR can be made equal by
// swapping exactly ONE pair of elements in ONE of them.
// [1,2,3] and [1,2,3] -> true; [1,2,3] and [2,1,3] -> true; [1,2,2] and [2,1,1] -> false
function areSimilar(a, b) {
  // YOUR CODE HERE
  return null;
}

// 5. Fill an n x n grid with numbers 1..n*n in a clockwise spiral from top-left.
// 3 -> [[1,2,3], [8,9,4], [7,6,5]]
function spiralNumbers(n) {
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

const T = true;
const F = false;
const TESTS = [
  [matrixElementsSum, [[[0, 1, 1, 2], [0, 5, 0, 0], [2, 0, 3, 3]]], 9],
  [matrixElementsSum, [[[1, 1], [1, 1]]], 4],
  [minesweeper, [[[T, F, F], [F, T, F], [F, F, F]]], [[1, 2, 1], [2, 1, 1], [1, 1, 1]]],
  [rotateImage, [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]],
  [rotateImage, [[[1]]], [[1]]],
  [areSimilar, [[1, 2, 3], [1, 2, 3]], true],
  [areSimilar, [[1, 2, 3], [2, 1, 3]], true],
  [areSimilar, [[1, 2, 2], [2, 1, 1]], false],
  [areSimilar, [[1, 2, 3], [1, 10, 2]], false],
  [spiralNumbers, [3], [[1, 2, 3], [8, 9, 4], [7, 6, 5]]],
  [spiralNumbers, [1], [[1]]]
];

let passed = 0;
console.log("\n==========================================");
console.log("   RUNNING Q3 IMPLEMENTATION TESTS        ");
console.log("==========================================\n");

for (const [fn, args, expected] of TESTS) {
  try {
    const actual = fn(...args);
    if (deepEqual(actual, expected)) {
      passed++;
      console.log(`  PASS: ${fn.name}(...) === ${JSON.stringify(expected)}`);
    } else {
      console.log(`  FAIL: ${fn.name}(...)`);
      console.log(`        Expected: ${JSON.stringify(expected)}`);
      console.log(`        Got:      ${JSON.stringify(actual)}`);
    }
  } catch (err) {
    console.log(`  ERROR in ${fn.name}: ${err.message}`);
  }
}

console.log("\n------------------------------------------");
console.log(`SCORE: ${passed} / ${TESTS.length} tests passed.`);
console.log("------------------------------------------\n");

