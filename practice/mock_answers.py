"""Mock test answer sheet — see 06-mock-test.md for the problems.
70 minutes, timer on, no notes. Run this file to check yourself.
"""


def growth_in_years(deposit, rate, threshold):
    ...


def most_common_first_letter(words):
    ...


def battleships(field):
    ...


def longest_equal_subarray(nums):
    ...


# ------------------------- self-tests -------------------------
TESTS = [
    (growth_in_years, (100, 20, 170), 3),
    (growth_in_years, (100, 1, 100), 1),
    (most_common_first_letter, (["apple", "banana", "avocado", "blueberry", "cherry"],), "a"),
    (most_common_first_letter, (["kiwi"],), "k"),
    (battleships, ([[1, 0, 0, 1],
                    [1, 0, 0, 0],
                    [1, 0, 1, 1],
                    [0, 0, 0, 0]],), 3),
    (battleships, ([[0]],), 0),
    (battleships, ([[1]],), 1),
    (longest_equal_subarray, ([0, 1],), 2),
    (longest_equal_subarray, ([0, 1, 0],), 2),
    (longest_equal_subarray, ([0, 0, 1, 0, 1, 1, 1, 0],), 8),
    (longest_equal_subarray, ([1, 1, 1],), 0),
]

if __name__ == "__main__":
    passed_problems = set()
    for fn, args, expected in TESTS:
        try:
            got = fn(*args)
        except Exception as e:  # noqa: BLE001
            got = f"ERROR: {e}"
        ok = got == expected
        mark = "PASS" if ok else "FAIL"
        if not ok:
            passed_problems.add(fn.__name__ + "_failed")
        print(f"[{mark}] {fn.__name__}{args} -> {got!r} (expected {expected!r})")
    names = {fn.__name__ for fn, _, _ in TESTS}
    solved = sum(1 for n in names if n + "_failed" not in passed_problems)
    print(f"\nProblems fully solved: {solved}/4  (3+ = PASSING SCORE)")
