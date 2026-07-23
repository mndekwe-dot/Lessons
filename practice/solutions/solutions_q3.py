"""Solutions for q3_implementation.py"""


def matrix_elements_sum(matrix):
    total = 0
    for c in range(len(matrix[0])):
        for r in range(len(matrix)):
            if matrix[r][c] == 0:
                break            # this column is blocked from here down
            total += matrix[r][c]
    return total


def minesweeper(matrix):
    rows, cols = len(matrix), len(matrix[0])
    result = [[0] * cols for _ in range(rows)]
    directions = [(-1, -1), (-1, 0), (-1, 1),
                  (0, -1),           (0, 1),
                  (1, -1),  (1, 0),  (1, 1)]
    for r in range(rows):
        for c in range(cols):
            count = 0
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc]:
                    count += 1
            result[r][c] = count
    return result


def rotate_image(grid):
    n = len(grid)
    result = [[0] * n for _ in range(n)]
    for r in range(n):
        for c in range(n):
            result[c][n - 1 - r] = grid[r][c]
    return result


def are_similar(a, b):
    # Collect positions where they differ.
    diffs = [i for i in range(len(a)) if a[i] != b[i]]
    if not diffs:
        return True
    if len(diffs) != 2:
        return False
    i, j = diffs
    return a[i] == b[j] and a[j] == b[i]   # would one swap fix both spots?


def spiral_numbers(n):
    grid = [[0] * n for _ in range(n)]
    top, bottom, left, right = 0, n - 1, 0, n - 1
    num = 1
    while num <= n * n:
        for c in range(left, right + 1):          # top row, left -> right
            grid[top][c] = num; num += 1
        top += 1
        for r in range(top, bottom + 1):          # right column, top -> bottom
            grid[r][right] = num; num += 1
        right -= 1
        for c in range(right, left - 1, -1):      # bottom row, right -> left
            grid[bottom][c] = num; num += 1
        bottom -= 1
        for r in range(bottom, top - 1, -1):      # left column, bottom -> top
            grid[r][left] = num; num += 1
        left += 1
    return grid
