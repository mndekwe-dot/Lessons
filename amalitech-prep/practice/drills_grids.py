"""DRILLS — 2D grids (file 04). The Q3 toolkit.

    python practice/drills_grids.py

Tiny grid problems, easiest first. Q3 is usually a grid + careful reading.

===========================================================================
THE PICTURE
===========================================================================

    grid = [[1, 2, 3],        <- row 0
            [4, 5, 6]]        <- row 1
             c0 c1 c2

    rows = len(grid)          # 2   how many rows
    cols = len(grid[0])       # 3   how many columns (length of one row)
    grid[r][c]                # ROW first, then COLUMN.  grid[1][2] is 6

    for r in range(rows):         # visit every cell
        for c in range(cols):
            ... grid[r][c] ...

    grid = [[0] * cols for _ in range(rows)]    # correct way to build
    grid = [[0] * cols] * rows                  # BUG - all rows are the SAME list

    # neighbours, without falling off the edge
    directions = [(-1,0),(1,0),(0,-1),(0,1)]                  # up down left right
    for dr, dc in directions:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols:                 # BOUNDS CHECK FIRST
            ... grid[nr][nc] ...

REMINDERS
 - grid[r][c] not grid[c][r]
 - a ROW is one item: grid[i].  A COLUMN must be gathered with a loop.
 - still true: return AFTER the loop unless you are SEARCHING.
===========================================================================
"""


# ---------- SECTION A: reading a grid ----------

def size_of(grid):
    """Return [rows, cols]. [[1,2,3],[4,5,6]] -> [2,3]"""
    ...

def cell(grid, r, c):
    """Return the value at row r, column c. ([[1,2],[3,4]], 1, 0) -> 3"""
    ...

def first_row(grid):
    """Return the first row. [[1,2],[3,4]] -> [1,2]"""
    ...


def get_column(grid, j):
    """Return column j as a list. ([[1,2],[3,4]], 0) -> [1,3]"""
    ...


def main_diagonal(grid):
    """Top-left to bottom-right. [[1,2],[3,4]] -> [1,4]"""
    ...


# ---------- SECTION B: visiting every cell ----------

def grid_total(grid):
    """Add up every number. [[1,2],[3,4]] -> 10"""
    ...


def biggest_in_grid(grid):
    """The largest value anywhere. [[1,9],[3,4]] -> 9"""
    ...

def count_zeros(grid):
    """How many cells are 0? [[0,1],[0,4]] -> 2"""
    ...

def flatten(grid):
    """All values in one list, row by row. [[1,2],[3,4]] -> [1,2,3,4]"""
    ...


def double_all(grid):
    """A NEW grid with every value doubled. [[1,2],[3,4]] -> [[2,4],[6,8]]"""
    ...


# ---------- SECTION C: rows and columns ----------

def row_sums(grid):
    """Sum of each row. [[1,2],[3,4]] -> [3,7]"""
    ...


def column_sums(grid):
    """Sum of each column. [[1,2],[3,4]] -> [4,6]"""
    ...


def biggest_row_sum(grid):
    """The largest row total. [[1,2],[3,4]] -> 7"""
    ...


def has_zero_row(grid):
    """True if any row is entirely zeros. [[0,0],[1,2]] -> True"""
    ...


# ---------- SECTION D: building a grid ----------

def make_grid(rows, cols, value):
    """A rows x cols grid filled with value. (2,3,0) -> [[0,0,0],[0,0,0]]"""
    ...


def identity(n):
    """n x n grid, 1 on the main diagonal, 0 elsewhere.
    2 -> [[1,0],[0,1]]"""
    ...


def transpose(grid):
    """Swap rows and columns. [[1,2,3],[4,5,6]] -> [[1,4],[2,5],[3,6]]
    HINT: new grid has cols rows and rows cols. new[c][r] = old[r][c]"""
    ...


# ---------- SECTION E: neighbours (the Q3 pattern) ----------

def neighbour_sum(grid, r, c):
    """Sum of the 4 neighbours (up/down/left/right) that are ON the grid.
    ([[1,2],[3,4]], 0, 0) -> 5     (right is 2, down is 3)"""
    ...


def count_neighbour_mines(grid, r, c):
    """How many of the 8 surrounding cells equal 1?
    ([[1,1,0],[0,0,0],[0,0,0]], 1, 1) -> 2"""
    ...


def is_edge_cell(grid, r, c):
    """True if the cell is on the outer border of the grid.
    ([[1,2],[3,4]], 0, 0) -> True"""
    ...


# ------------------------- self-tests -------------------------
TESTS = [
    (size_of, ([[1, 2, 3], [4, 5, 6]],), [2, 3]),
    (cell, ([[1, 2], [3, 4]], 1, 0), 3),
    (first_row, ([[1, 2], [3, 4]],), [1, 2]),
    (get_column, ([[1, 2], [3, 4]], 0), [1, 3]),
    (get_column, ([[1, 2], [3, 4]], 1), [2, 4]),
    (main_diagonal, ([[1, 2], [3, 4]],), [1, 4]),
    (grid_total, ([[1, 2], [3, 4]],), 10),
    (biggest_in_grid, ([[1, 9], [3, 4]],), 9),
    (count_zeros, ([[0, 1], [0, 4]],), 2),
    (flatten, ([[1, 2], [3, 4]],), [1, 2, 3, 4]),
    (double_all, ([[1, 2], [3, 4]],), [[2, 4], [6, 8]]),
    (row_sums, ([[1, 2], [3, 4]],), [3, 7]),
    (column_sums, ([[1, 2], [3, 4]],), [4, 6]),
    (biggest_row_sum, ([[1, 2], [3, 4]],), 7),
    (has_zero_row, ([[0, 0], [1, 2]],), True),
    (has_zero_row, ([[0, 1], [1, 2]],), False),
    (make_grid, (2, 3, 0), [[0, 0, 0], [0, 0, 0]]),
    (identity, (2,), [[1, 0], [0, 1]]),
    (transpose, ([[1, 2, 3], [4, 5, 6]],), [[1, 4], [2, 5], [3, 6]]),
    (neighbour_sum, ([[1, 2], [3, 4]], 0, 0), 5),
    (count_neighbour_mines, ([[1, 1, 0], [0, 0, 0], [0, 0, 0]], 1, 1), 2),
    (is_edge_cell, ([[1, 2], [3, 4]], 0, 0), True),
    (is_edge_cell, ([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 1, 1), False),
]

if __name__ == "__main__":
    passed = 0
    for fn, args, expected in TESTS:
        try:
            got = fn(*args)
        except Exception as e:  # noqa: BLE001
            got = f"ERROR: {e}"
        ok = got == expected
        passed += ok
        mark = "PASS" if ok else "FAIL"
        print(f"[{mark}] {fn.__name__}{args} -> {got!r} (expected {expected!r})")
    print(f"\n{passed}/{len(TESTS)} tests passed")
    if passed == len(TESTS):
        print("\nALL GREEN. Now try practice/q3_implementation.py — the real GCA versions.")
