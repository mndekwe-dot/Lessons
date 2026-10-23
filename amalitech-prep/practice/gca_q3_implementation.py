"""GCA Real Questions — Q3: Implementation-Heavy (grids, simulation)

~15–20 min each. Read the description twice.

Run:  python practice/gca_q3_implementation.py
"""


def matrix_elements_sum(matrix):
    """Each 0 means a haunted room — no room below it in the same column is suitable.
    Return total price of all suitable rooms."""
    ...

def minesweeper(matrix):
    """Given a boolean matrix of mines, return a grid where each cell contains
    the count of mines in its 8 neighbouring cells."""
    ...

def rotate_image(grid):
    """Rotate an n x n grid 90 degrees clockwise."""
    ...

def are_similar(a, b):
    """Two lists are similar if they are equal OR can be made equal by swapping exactly one pair."""
    ...

def spiral_numbers(n):
    """Fill an n x n grid with numbers 1..n*n in a clockwise spiral from the top-left."""
    ...

def tetris_figure_drop(field, figure):
    """Drop a figure onto a game field. Return the column index where a full row is formed, or -1."""
    ...

def string_pattern_matching(pattern, source):
    """Count substrings of source that match pattern where 0=vowel, 1=consonant."""
    ...

def power_of_two_pairs(numbers):
    """Return the number of pairs (i,j) where i<=j and numbers[i]+numbers[j] is a power of 2."""
    ...

def neighbor_sum_array(a):
    """Return array b where b[i] = a[i-1] + a[i] + a[i+1], using 0 for out-of-bounds."""
    ...

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
    (spiral_numbers, (3,), [[1, 2, 3], [8, 9, 4], [7, 6, 5]]),
    (spiral_numbers, (1,), [[1]]),
    (tetris_figure_drop, ([[0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 0, 0], [1, 1, 0]],
                          [[0, 0, 1], [0, 1, 1], [0, 0, 1]]), 0),
    (string_pattern_matching, ("010", "amazing"), 2),
    (string_pattern_matching, ("100", "codesignal"), 0),
    (power_of_two_pairs, ([1, -1, 2, 3],), 5),
    (power_of_two_pairs, ([2],), 1),
    (neighbor_sum_array, ([4, 0, 1, -2, 3],), [4, 5, -1, 2, 1]),
]

if __name__ == "__main__":
    passed = 0
    for fn, args, expected in TESTS:
        try:
            got = fn(*args)
        except Exception:  # noqa: BLE001
            got = f"ERROR"
        ok = got == expected
        passed += ok
        mark = "PASS" if ok else "FAIL"
        print(f"[{mark}] {fn.__name__}{args} -> {got!r} (expected {expected!r})")
    print(f"\n{passed}/{len(TESTS)} tests passed")