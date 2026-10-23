"""Solutions for q2_data_manipulation.py"""


def all_longest_strings(words):
    longest = max(len(w) for w in words)
    return [w for w in words if len(w) == longest]


def add_border(picture):
    width = len(picture[0]) + 2
    return ["*" * width] + ["*" + row + "*" for row in picture] + ["*" * width]


def sorted_squares(nums):
    return sorted(x * x for x in nums)


def is_anagram(a, b):
    return sorted(a) == sorted(b)
    # or: Counter(a) == Counter(b)


def first_digit(s):
    for c in s:
        if c.isdigit():
            return c
    return ""


def alternating_sums(a):
    return [sum(a[::2]), sum(a[1::2])]
