"""Q4-level problems (need an efficient idea: dict, set, window, prefix sums).
Target: 20-25 minutes each. Remember: Q4 is your BONUS question on exam day.

Run:  python q4_problem_solving.py
Solutions: solutions/solutions_q4.py
"""


# ---------- Part 1: dictionaries & sets (file 03) ----------

def most_frequent(nums):
    """The value that appears most often. [3,1,3,2,3,1] -> 3"""
    ...


def contains_close_duplicates(nums, k):
    """Is there a duplicate pair at index distance <= k?
    ([1,2,3,1], 3) -> True    ([1,2,3,1], 2) -> False"""
    ...


def common_elements(a, b):
    """Values present in BOTH lists, no duplicates, sorted.
    ([1,2,2,3], [2,3,4]) -> [2,3]"""
    ...


def can_form_note(note, magazine):
    """Can you build string `note` using the letters of `magazine`,
    each letter used at most once? ("aab","baa") -> True  ("aab","ab") -> False"""
    ...


def first_duplicate(nums):
    """First value whose SECOND occurrence comes earliest; -1 if none.
    (Real GCA Q4.)  [2,1,3,5,3,2] -> 3   [1,2,3] -> -1"""
    ...


# ---------- Part 2: patterns (file 05) ----------

def max_subarray_sum_k(nums, k):
    """Max sum of any contiguous window of size k (sliding window).
    ([2,1,5,1,3,2], 3) -> 9  (5+1+3)"""
    ...


def smallest_difference(a, b):
    """Smallest abs difference between any element of a and any of b.
    Sort + two pointers - beat the double loop!
    ([1,3,15,11,2], [23,127,235,19,8]) -> 3  (11 vs 8)"""
    ...


def count_pairs_with_sum(nums, target):
    """Count pairs i<j with nums[i]+nums[j] == target.
    ([1,5,7,-1,5], 6) -> 3   (1+5, 7+-1, 1+5)"""
    ...


def equal_split_index(nums):
    """First index i where sum(nums[:i]) == sum(nums[i+1:]); -1 if none.
    [1,7,3,6,5,6] -> 3"""
    ...


# ------------------------- self-tests -------------------------
TESTS = [
    (most_frequent, ([3, 1, 3, 2, 3, 1],), 3),
    (contains_close_duplicates, ([1, 2, 3, 1], 3), True),
    (contains_close_duplicates, ([1, 2, 3, 1], 2), False),
    (common_elements, ([1, 2, 2, 3], [2, 3, 4]), [2, 3]),
    (can_form_note, ("aab", "baa"), True),
    (can_form_note, ("aab", "ab"), False),
    (first_duplicate, ([2, 1, 3, 5, 3, 2],), 3),
    (first_duplicate, ([1, 2, 3],), -1),
    (max_subarray_sum_k, ([2, 1, 5, 1, 3, 2], 3), 9),
    (smallest_difference, ([1, 3, 15, 11, 2], [23, 127, 235, 19, 8]), 3),
    (count_pairs_with_sum, ([1, 5, 7, -1, 5], 6), 3),
    (equal_split_index, ([1, 7, 3, 6, 5, 6],), 3),
    (equal_split_index, ([1, 2, 3],), -1),
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
