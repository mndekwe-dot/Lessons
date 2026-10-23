"""Solutions for q1_warmups.py — only look after a real 15-minute attempt!"""


def century(year):
    # (year - 1) // 100 + 1 handles exact centuries: 1700 -> 17, 1701 -> 18
    return (year - 1) // 100 + 1


def sum_odd(n):
    return sum(x for x in range(1, n + 1) if x % 2 == 1)
    # Math way: odd numbers 1..n are 1,3,5,...; there are (n+1)//2 of them,
    # and their sum is ((n+1)//2) ** 2


def reverse_number(n):
    # Math way:
    result = 0
    while n > 0:
        result = result * 10 + n % 10
        n //= 10
    return result
    # String way: int(str(n)[::-1])


def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def count_digits_divisible(n):
    count = 0
    for ch in str(n):
        d = int(ch)
        if d != 0 and n % d == 0:   # the d != 0 check is the trap
            count += 1
    return count
