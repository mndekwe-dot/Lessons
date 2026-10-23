"""GCA Real Questions — Q4: Problem Solving (efficient algorithm needed)

~20–25 min each. Q4 is your BONUS question on exam day.

Run:  python practice/gca_q4_problem_solving.py
"""


def most_frequent(nums):
    """Return the value that appears most often in the list."""
    ...

def contains_close_duplicates(nums, k):
    """Return True if there are two indices i,j where nums[i]==nums[j] and abs(i-j) <= k."""
    ...

def common_elements(a, b):
    """Values present in BOTH lists, no duplicates, sorted."""
    ...

def can_form_note(note, magazine):
    """Can you build string `note` from the letters of `magazine`? Each letter used at most once."""
    ...

def first_duplicate(nums):
    """Return the first value whose second occurrence comes earliest. -1 if no duplicate."""
    ...

def max_subarray_sum_k(nums, k):
    """Return the maximum sum of any contiguous window of size k."""
    ...

def smallest_difference(a, b):
    """Return the smallest absolute difference between any element of a and any element of b."""
    ...

def count_pairs_with_sum(nums, target):
    """Count pairs i<j where nums[i]+nums[j]==target."""
    ...

def equal_split_index(nums):
    """Return the first index i where sum(nums[:i]) == sum(nums[i+1:]); -1 if none."""
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
        except Exception:  # noqa: BLE001
            got = f"ERROR"
        ok = got == expected
        passed += ok
        mark = "PASS" if ok else "FAIL"
        print(f"[{mark}] {fn.__name__}{args} -> {got!r} (expected {expected!r})")
    print(f"\n{passed}/{len(TESTS)} tests passed")