"""Q2-style: REARRANGING a list (move things, remove things, reorder things).

    python practice/q2b_list_rearranging.py

These all share one big idea:

    DON'T fight to edit the list in place.
    BUILD A NEW LIST in the order you want, then return it.

That turns "move/remove/reorder" into the collecting loop you already know:
    result = []          <- setup BEFORE
    for x in nums:       <- work INSIDE
        ...append...
    return result        <- return AFTER

Order of difficulty: top = easiest. Do them in order.
"""


def move_zeros_to_end(nums):
    """Move every 0 to the end, keeping the other numbers in their original order.
    [0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0]

    HINT: two passes. First collect the non-zeros, then add the zeros.
    (How many zeros? Count them, or use len.)"""
    ...


def remove_all(nums, target):
    """Return a new list with every copy of `target` removed.
    ([1, 2, 3, 2], 2) -> [1, 3]"""
    ...


def evens_then_odds(nums):
    """All even numbers first, then all odd numbers. Keep the original order
    within each group.
    [1, 2, 3, 4, 5, 6] -> [2, 4, 6, 1, 3, 5]

    HINT: build TWO lists, then join them with +"""
    ...


def negatives_first(nums):
    """All negatives first, then everything else (0 and positives), order kept.
    [3, -1, 0, -5, 2] -> [-1, -5, 3, 0, 2]"""
    ...


def remove_duplicates_keep_order(nums):
    """Keep only the FIRST appearance of each value, in order.
    [3, 1, 3, 2, 1] -> [3, 1, 2]

    HINT: a set to remember what you've already added (file 03)."""
    ...


def rotate_left(nums, k):
    """Move the first k items to the end.
    ([1, 2, 3, 4, 5], 2) -> [3, 4, 5, 1, 2]

    HINT: slicing. Which slice is 'from k onward'? Which is 'the first k'?"""
    ...


def swap_first_last(nums):
    """Swap the first and last items. [1, 2, 3, 4] -> [4, 2, 3, 1]
    A list of 0 or 1 items comes back unchanged."""
    ...


def interleave(a, b):
    """Alternate items from two equal-length lists, starting with a.
    ([1, 3, 5], [2, 4, 6]) -> [1, 2, 3, 4, 5, 6]

    HINT: zip (file 01b, Loop 7)."""
    ...


def group_by_sign(nums):
    """Return [negatives, zeros, positives] - three lists inside one list.
    [1, -2, 0, 3, 0, -4] -> [[-2, -4], [0, 0], [1, 3]]"""
    ...


def move_letters_to_front(s):
    """Letters first, then digits. Keep the order within each group.
    "a1b2c3" -> "abc123"

    HINT: same idea, but join the pieces back into a string at the end."""
    ...


# ------------------------- self-tests -------------------------
TESTS = [
    (move_zeros_to_end, ([0, 1, 0, 3, 12],), [1, 3, 12, 0, 0]),
    (move_zeros_to_end, ([0, 0],), [0, 0]),
    (move_zeros_to_end, ([1, 2],), [1, 2]),
    (remove_all, ([1, 2, 3, 2], 2), [1, 3]),
    (remove_all, ([1, 1, 1], 1), []),
    (evens_then_odds, ([1, 2, 3, 4, 5, 6],), [2, 4, 6, 1, 3, 5]),
    (evens_then_odds, ([1, 3],), [1, 3]),
    (negatives_first, ([3, -1, 0, -5, 2],), [-1, -5, 3, 0, 2]),
    (remove_duplicates_keep_order, ([3, 1, 3, 2, 1],), [3, 1, 2]),
    (remove_duplicates_keep_order, ([1, 1, 1],), [1]),
    (rotate_left, ([1, 2, 3, 4, 5], 2), [3, 4, 5, 1, 2]),
    (rotate_left, ([1, 2, 3], 0), [1, 2, 3]),
    (swap_first_last, ([1, 2, 3, 4],), [4, 2, 3, 1]),
    (swap_first_last, ([1],), [1]),
    (interleave, ([1, 3, 5], [2, 4, 6]), [1, 2, 3, 4, 5, 6]),
    (group_by_sign, ([1, -2, 0, 3, 0, -4],), [[-2, -4], [0, 0], [1, 3]]),
    (move_letters_to_front, ("a1b2c3",), "abc123"),
    (move_letters_to_front, ("abc",), "abc"),
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
