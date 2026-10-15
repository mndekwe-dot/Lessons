"""Q1-level warmups (basic coding). Target: solve each in under 10 minutes.

Fill in each function, then run:  python q1_warmups.py
Stuck for 15+ minutes? Peek at solutions/solutions_q1.py
"""


def century(year):
    """Which century is the year in? 1905 -> 20, 1700 -> 17, 2001 -> 21."""
    ...


def sum_odd(n):
    """Sum of all odd numbers from 1 to n (inclusive). sum_odd(7) -> 16."""
    ...


def reverse_number(n):
    """Return the digits of n reversed, as a number. 1234 -> 4321, 5 -> 5."""
    ...



def is_leap(year):
    """Leap years: divisible by 4, EXCEPT centuries unless divisible by 400.
    2000 -> True, 1900 -> False, 2024 -> True, 2023 -> False."""
    ...


def count_digits_divisible(n):
    """How many digits of n divide n evenly? 1012 -> 3 (1, 1, 2 divide 1012; skip the 0).
    Careful: never divide by zero!"""
    ...



# ------------------------- self-tests -------------------------
TESTS = [
    (century, (1905,), 20),
    (century, (1700,), 17),
    (century, (2001,), 21),
    (sum_odd, (7,), 16),
    (sum_odd, (1,), 1),
    (reverse_number, (1234,), 4321),
    (reverse_number, (5,), 5),
    (is_leap, (2000,), True),
    (is_leap, (1900,), False),
    (is_leap, (2024,), True),
    (count_digits_divisible, (1012,), 3),
    (count_digits_divisible, (111,), 3),
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
