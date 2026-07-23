"""Q3-level problems (implementation-heavy, mostly 2D grids). Target: 15-20 min each.

These have LONG descriptions on purpose - Q3 tests careful reading.
Run:  python q3_implementation.py
Solutions: solutions/solutions_q3.py
"""


def matrix_elements_sum(matrix):
    """Each cell is a hotel room price; 0 means the room is haunted.
    A room is suitable only if it is not haunted AND no room ABOVE it
    (same column, smaller row index) is haunted. Return the total price
    of all suitable rooms. (Real GCA problem.)

    [[0,1,1,2],
     [0,5,0,0],
     [2,0,3,3]] -> 9   (1+1+2 from row 0, +5 from row 1; everything below a 0 is lost)
    """
    total = 0
    for c in range(len(matrix[0])):
        for r in range(len(matrix)):
            if matrix[r][c] == 0:
                break
            total += matrix[r][c]
    return total 


def minesweeper(matrix):
    """matrix contains True (mine) and False (empty). Return a grid of the
    same size where each cell holds the NUMBER of mines in the 8 neighboring
    cells (the cell itself is not counted). (Real GCA problem.)

    [[T,F,F],
     [F,T,F],
     [F,F,F]] -> [[1,2,1],
                  [2,1,1],
                  [1,1,1]]
    """
    rows = len(matrix)
    cols = len(matrix[0])
    directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]

    results = []
    for r in range(rows):
        new_row =[]
        for c in range(cols):
            count = 0
            for dr,dc in directions:
                nr, nc = r + dr , c +dc
                if 0<= nr < rows  and 0 <= nc < cols and matrix[nr][nc]:
                    count += 1 
            new_row.append(count)
        results.append(new_row)
    return results


def rotate_image(grid):
    """Rotate a square grid 90 degrees clockwise. Use loops (no zip tricks)
    so you truly understand the index mapping: new[c][n-1-r] = old[r][c].

    [[1,2,3],
     [4,5,6],
     [7,8,9]] -> [[7,4,1],
                  [8,5,2],
                  [9,6,3]]
    """
    n =len(grid)
    results = []
    for c in range(n):
        new_row =[]
        for r in range(n-1,-1,-1):
            new_row.append(grid[r][c])
        results.append(new_row) 
    return results


def are_similar(a, b):
    """Two lists are 'similar' if they are equal, OR can be made equal by
    swapping exactly ONE pair of elements in ONE of them. (Real GCA problem.)

    [1,2,3] and [1,2,3] -> True
    [1,2,3] and [2,1,3] -> True
    [1,2,2] and [2,1,1] -> False
    """
    


def spiral_numbers(n):
    """Fill an n x n grid with numbers 1..n*n in a clockwise spiral
    starting from the top-left corner. (Tough but classic Q3.)

    n=3 -> [[1,2,3],
            [8,9,4],
            [7,6,5]]
    """
    grid = [[0] * n for _ in range(n)]          # empty grid, 0 = "not filled yet"
    directions = [(0,1), (1,0), (0,-1), (-1,0)] # right, down, left, up (clockwise)
    r = c = d = 0                               # position (0,0), direction 0 (right)

    for num in range(1, n*n + 1):               # place 1, 2, ... up to n*n
        grid[r][c] = num                        # drop the number here
        dr, dc = directions[d]                  # try to keep going same direction
        nr, nc = r + dr, c + dc
        # if the next cell is off-grid OR already filled, TURN clockwise
        if not (0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0):
            d = (d + 1) % 4                      # next direction (wraps 3 -> 0)
            dr, dc = directions[d]
            nr, nc = r + dr, c + dc
        r, c = nr, nc                            # move
    return grid



# ------------------------- self-tests -------------------------
T, F = True, False
TESTS = [
    (matrix_elements_sum, ([[0, 1, 1, 2], [0, 5, 0, 0], [2, 0, 3, 3]],), 9),
    (matrix_elements_sum, ([[1, 1], [1, 1]],), 4),
    (minesweeper, ([[T, F, F], [F, T, F], [F, F, F]],),
     [[1, 2, 1], [2, 1, 1], [1, 1, 1]]),
    (rotate_image, ([[1, 2, 3], [4, 5, 6], [7, 8, 9]],),
     [[7, 4, 1], [8, 5, 2], [9, 6, 3]]),
    (rotate_image, ([[1]],), [[1]]),
    (are_similar, ([1, 2, 3], [1, 2, 3]), True),
    (are_similar, ([1, 2, 3], [2, 1, 3]), True),
    (are_similar, ([1, 2, 2], [2, 1, 1]), False),
    (are_similar, ([1, 2, 3], [1, 10, 2]), False),
    (spiral_numbers, (3,), [[1, 2, 3], [8, 9, 4], [7, 6, 5]]),
    (spiral_numbers, (1,), [[1]]),
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
        print(f"[{mark}] {fn.__name__} -> {got!r} (expected {expected!r})")
    print(f"\n{passed}/{len(TESTS)} tests passed")
