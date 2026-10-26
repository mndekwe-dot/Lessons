/**
 * SOLUTIONS for q3_implementation.js
 */

function matrixElementsSum(matrix) {
  let total = 0;
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (matrix[r][c] === 0) {
        break; // Column haunted from here down!
      }
      total += matrix[r][c];
    }
  }
  return total;
}

function minesweeper(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: rows }, () => Array(cols).fill(0));
  const DIRS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let count = 0;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc]) {
          count++;
        }
      }
      result[r][c] = count;
    }
  }
  return result;
}

function rotateImage(grid) {
  const n = grid.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      result[c][n - 1 - r] = grid[r][c];
    }
  }
  return result;
}

function areSimilar(a, b) {
  const diffs = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diffs.push(i);
    }
  }
  if (diffs.length === 0) return true;
  if (diffs.length !== 2) return false;
  const [i, j] = diffs;
  return a[i] === b[j] && a[j] === b[i];
}

function spiralNumbers(n) {
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  let top = 0;
  let bottom = n - 1;
  let left = 0;
  let right = n - 1;
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

module.exports = {
  matrixElementsSum,
  minesweeper,
  rotateImage,
  areSimilar,
  spiralNumbers
};

