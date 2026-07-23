"""Q2-level problems (lists & strings). Target: 10-15 minutes each.

Run:  python q2_data_manipulation.py
Solutions: solutions/solutions_q2.py
"""


def all_longest_strings(words):
    """Return ALL strings of maximum length, keeping their order.
    ["aba", "aa", "ad", "vcd", "aba"] -> ["aba", "vcd", "aba"]"""
    longest = 0                  # "the biggest length seen so far"
    for w in words:
        if len(w) > longest:                  
            longest += len(w)        
    
    result = []            # start with an EMPTY list to collect into
    for w in words:           # walk the list a SECOND time
        if len(w)==longest:               # does this word's length match the max?
            result.append(w)     # add it to the collection
    return result             # return the list, not the number

words =["aba", "aa", "ad", "vcd", "aba"]   
results = all_longest_strings(words)
print(results)
    ...

def add_border(picture):
    """Surround a list of strings with '*' (a real GCA problem).
    ["abc", "ded"] -> ["*****", "*abc*", "*ded*", "*****"]"""
    width = len(picture[0]) + 2
    border = "*" * width
    result = [border]              # top border already inside
    for row in picture:
        result.append("*" + row + "*")
    result.append(border)          # bottom border
    return result

    ...


def sorted_squares(nums):
    """Square every number, return the results sorted ascending.
    [-4, -1, 0, 3] -> [0, 1, 9, 16]"""
    results=[]
    for x in nums:
        results.append(x**2)
    return sorted(results)
    
new_results=sorted_squares([-4, -1, 0, 3])
print(new_results)    


def is_anagram(a, b):
    """Do the two words use exactly the same letters? ("listen","silent") -> True"""
    return sorted(a) == sorted(b)

a = "listen"
b = "silent"
results = is_anagram(a, b)
print(results)          # True


def first_digit(s):
    """Return the first character in s that is a digit. "var_1__int" -> "1" """
    ...


def alternating_sums(a):
    """Team weights: players go alternately to team 1 and team 2 (real GCA problem).
    [50, 60, 60, 45, 70] -> [180, 105]"""
    ...


# ------------------------- self-tests -------------------------
TESTS = [
    (all_longest_strings, (["aba", "aa", "ad", "vcd", "aba"],), ["aba", "vcd", "aba"]),
    (all_longest_strings, (["a"],), ["a"]),
    (add_border, (["abc", "ded"],), ["*****", "*abc*", "*ded*", "*****"]),
    (add_border, (["a"],), ["***", "*a*", "***"]),
    (sorted_squares, ([-4, -1, 0, 3],), [0, 1, 9, 16]),
    (is_anagram, ("listen", "silent"), True),
    (is_anagram, ("hello", "world"), False),
    (first_digit, ("var_1__int",), "1"),
    (first_digit, ("q2q-q",), "2"),
    (alternating_sums, ([50, 60, 60, 45, 70],), [180, 105]),
    (alternating_sums, ([100],), [100, 0]),
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
