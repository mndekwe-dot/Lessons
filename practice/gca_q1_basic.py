"""GCA Real Questions — Q1: Basic Coding (loops, if/else, math)

~5–10 min each. Lock these in first on exam day.

Run:  python practice/gca_q1_basic.py
"""


def century_from_year(year):
    """Given a year, return the century it is in. 1905 -> 20, 1700 -> 17, 2001 -> 21."""
    if year % 100 == 0:
        return year // 100
    else:
        return (year // 100) + 1

def add(a, b):
    """Return the sum of a and b."""
    return (a+b)

def check_palindrome(input_string):
    """Return True if input_string is a palindrome, False otherwise."""
    return input_string == input_string[::-1]

def adjacent_elements_product(array):
    """Find the pair of adjacent elements that has the largest product and return that product."""
    # Start with the first pair's product
    max_prod = array[0] * array[1]

    # Stop 1 element early because we look forward to array[i + 1]
    for i in range(len(array) - 1):
        current_prod = array[i] * array[i + 1]
        if current_prod > max_prod:
            max_prod = current_prod

    return max_prod
def shape_area(n):
    """Given a non-negative integer n, return the area of a shape where each layer adds 4*(n-1).
    n=1 -> 1, n=2 -> 5, n=3 -> 13, n=4 -> 25.
    Formula: 2*n*(n-1) + 1"""
    return  2*n*(n-1) + 1

def make_array_consecutive2(statues):
    """Given an array of distinct integers representing the heights of statues,
    return the minimum number of statues that need to be added so that the
    heights form a consecutive sequence from min to max."""
    smallest = min(statues)
    biggest = max(statues)
    missing  = 0

    for x in range(smallest,biggest+1):
        if x not in statues:
            missing += 1
    return missing


def almost_increasing_sequence(sequence):
    drops = 0

    for i in range(len(sequence) - 1):
        # Check if the pair breaks strictly increasing order
        if sequence[i] >= sequence[i + 1]:
            drops += 1
            if drops > 1:
                return False

            # Check if removing sequence[i] or sequence[i+1] solves the overlap
            if i > 0 and sequence[i - 1] >= sequence[i + 1]:
                if i + 2 < len(sequence) and sequence[i] >= sequence[i + 2]:
                    return False
    return True

def deposit_profit(deposit, rate, threshold):
    """Return the number of years it takes for a deposit to reach or exceed a threshold
    given a fixed annual interest rate (percentage, not decimal).
    Example: deposit=100, rate=20, threshold=170 -> 3"""
    year =0
    while deposit < threshold:
        deposit += deposit*(rate/100)
        year += 1
    return year    

def is_leap_year(year):
    """Return True if the year is a leap year. Leap years are divisible by 4,
    except centuries unless divisible by 400."""
    if year % 400 == 0:
        return True
    elif year % 100 == 0:
        return False
    elif year % 4 == 0:
        return True
    else:
       return False

def count_digits_divisible_by(n):
    """Return the number of digits in n that evenly divide n. Skip digit 0.
    Example: 1012 -> 3 (digits 1,1,2 all divide 1012; skip 0)."""
    count = 0

    for char in str(n):
        digit = int(char)
        # Skip 0 to avoid ZeroDivisionError, then check if digit evenly divides n
        if digit != 0 and n % digit == 0:
            count += 1

    return count


# ------------------------- self-tests -------------------------
TESTS = [
    (century_from_year, (1905,), 20),
    (century_from_year, (1700,), 17),
    (century_from_year, (2001,), 21),
    (add, (3, 5), 8),
    (check_palindrome, ("radar",), True),
    (check_palindrome, ("hello",), False),
    (adjacent_elements_product, ([3, 6, -2, -5, 7, 3],), 21),
    (shape_area, (1,), 1),
    (shape_area, (2,), 5),
    (shape_area, (3,), 13),
    (make_array_consecutive2, ([6, 2, 3, 8],), 3),
    (almost_increasing_sequence, ([1, 3, 2, 1],), False),
    (almost_increasing_sequence, ([1, 3, 2],), True),
    (deposit_profit, (100, 20, 170), 3),
    (deposit_profit, (100, 1, 100), 0),
    (is_leap_year, (2000,), True),
    (is_leap_year, (1900,), False),
    (is_leap_year, (2024,), True),
    (count_digits_divisible_by, (1012,), 3),
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