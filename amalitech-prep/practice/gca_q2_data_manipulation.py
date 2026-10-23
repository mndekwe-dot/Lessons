"""GCA Real Questions — Q2: Data Manipulation (lists, strings, counting)

~10–15 min each.

Run:  python practice/gca_q2_data_manipulation.py
"""


def all_longest_strings(words):
    """Return ALL strings of maximum length, keeping their order.

    Example:
        words = ["aba", "aa", "ad", "vcd", "aba"]
        -> ["aba", "vcd", "aba"]
    """
    max_lenght =0
    list=[]
    for x in words:
        if len(x) > max_lenght:
            max_lenght = len(x)

    for y in words:
        if len(y)==max_lenght:
            list.append(y)
    return list


def add_border(picture):
    """Surround a rectangular matrix of characters with a border of asterisks (*).

    Example:
        picture = ["abc", "ded"]
        -> ["*****",
            "*abc*",
            "*ded*",
            "*****"]
    """
    width = len(picture[0]) + 2
    border ="*" * width
    list=[border]
    for x in picture:
        list.append("*" + x + "*")
    list.append(border)
    return list

def sorted_squares(nums):
    """Square every number in the array and return the result sorted ascending.

    Example:
        nums = [-4, -1, 0, 3, 10]
        -> [0, 1, 9, 16, 100]
    """
    list=[]
    for x in nums:
        list.append(x ** 2)
    return sorted(list)


def is_anagram(a, b):
    """Return True if a and b use exactly the same letters.

    Example:
        a = "listen", b = "silent" -> True
        a = "rat", b = "car"       -> False
    """
    return sorted(a) == sorted(b)


def first_digit(s):
    """Return the first digit character in string s.

    Example:
        s = "var_1__Int" -> "1"
        s = "q2q-q"      -> "2"
    """
    for x in s:
      if x.isdigit():
         return x



def alternating_sums(a):
    """Players go alternately to team 1 and team 2. Return [team1_weight, team2_weight].

    Example:
        a = [50, 60, 60, 45, 70]
        -> [180, 105]  (Team 1: 50 + 60 + 70 = 180; Team 2: 60 + 45 = 105)
    """
    return [sum(a[::2]), sum(a[1::2])]


def common_character_count(s1, s2):
    """Return the count of characters that appear in both strings (counted per occurrence).

    Example:
        s1 = "aabcc", s2 = "adcaa"
        -> 3  (two 'a's and one 'c' are common)
    """
    s2_list = list(s2)
    times= 0

    for x in s1:
        if x in s2_list:
            times += 1
            s2_list.remove(x)
    return times


def is_lucky(n):
    """Return True if sum of first half digits equals sum of second half."""
    s = str(n)
    half = len(s) // 2

    sum_first = 0
    for digit in s[:half]:
        sum_first += int(digit)

    sum_second = 0
    for digit in s[half:]:
        sum_second += int(digit)

    return sum_first == sum_second


def sort_by_height(a):
    """Sort the non-negative numbers (people) in ascending order while leaving

    the -1 values (trees) fixed in place.

    Example:
        a = [-1, 150, 190, 170, -1, -1, 160, 180]
        -> [-1, 150, 160, 170, -1, -1, 180, 190]
    """
    pass


def reverse_in_parentheses(input_string):
    """Reverse the substrings inside each pair of matching parentheses from inside out.

    Example:
        input_string = "foo(bar(baz))blim"
        -> "foobazrabblim"  ("baz" reverses to "zab" -> "barzab" reverses to "bazrab")
    """
    pass
def palindrome_rearranging(input_string):
    """Return True if it is possible to rearrange the characters of the string to form a palindrome."""
    ...

def array_change(input_array):
    """Return the minimum number of operations needed to make the array strictly increasing.
    Each operation increments by 1."""
    ...

def are_equally_strong(your_left, your_right, friends_left, friends_right):
    """Return True if your friend has the same strength (max of both arms) as you,
    and their weaker arm is at least as strong as your weaker arm."""
    ...

def array_maximal_adjacent_difference(input_array):
    """Return the maximal absolute difference between adjacent elements."""
    ...

def is_ipv4_address(input_string):
    """Return True if input_string is a valid IPv4 address."""
    ...

def avoid_obstacles(input_array):
    """Return the minimum jump length to avoid all obstacles on a line."""
    ...

def box_blur(image):
    """Apply a box blur to a grayscale image. Each pixel becomes the average of itself and its 8 neighbours (floor)."""
    ...

def array_replace(input_array):
    """Replace each element with the nearest power of 2."""
    ...

def even_digits_only(n):
    """Return True if all digits in n are even."""
    ...

def variable_name(name):
    """Return True if name is a valid variable name (starts with letter or underscore, contains only alphanumeric or underscore)."""
    ...

def alphabetic_shift(input_string):
    """Shift each character by 1 in the alphabet: 'a'->'b', 'z'->'a'."""
    ...

def chess_board_cell_color(cell1, cell2):
    """Return True if both cells have the same color on a chess board."""
    ...

def circle_of_numbers(n, first_number):
    """Return the number directly opposite to first_number on a circle of n numbers."""
    ...

def absolute_values_sum_minimization(a):
    """Return the element x that minimizes sum of |a[i] - x| for all i.
    If multiple such x exist, return the smallest one."""
    ...

def strings_rearrangement(input_array):
    """Return True if it is possible to rearrange all strings to form a palindrome chain
    where adjacent strings differ by exactly one character."""
    ...

def extract_each_kth(input_array, k):
    """Return the input array with every kth element removed."""
    ...

def different_symbols_naive(s):
    """Return the number of different symbols in the string."""
    ...

def array_max_consecutive_sum(input_array, k):
    """Return the maximum sum of any k consecutive elements."""
    ...

def digit_degree(n):
    """Return the number of times we need to replace n with the sum of its digits until we get a one-digit number."""
    ...

def growing_plant(up_speed, down_speed, desired_height):
    """Return the number of days it takes for a plant to reach the desired height.
    Each day it grows up_speed, each night it slides down down_speed."""
    ...

def knapsack_light(value1, weight1, value2, weight2, max_weight):
    """Return the maximum total value that can be carried in the knapsack."""
    ...

def longest_digits_prefix(input_string):
    """Return the longest prefix of the string consisting only of digits."""
    ...

def bishop_and_pawn(bishop, pawn):
    """Return True if a bishop can capture the pawn in one move on a chess board."""
    ...

def is_beautiful_string(input_string):
    """Return True if the string is 'beautiful' — every character's frequency is >= every character
    with a larger alphabetical value."""
    ...

def find_email_domain(email_address):
    """Return the domain part of the email address (everything after '@')."""
    ...

def build_palindrome(st):
    """Return the shortest palindrome that can be formed by appending characters to the end of st."""
    ...

def elections_winners(votes, k):
    """Return the number of candidates who can still win. k is the number of votes you can assign."""
    ...

def is_mac48_address(input_string):
    """Return True if input_string is a valid MAC-48 address (hex pairs separated by hyphens)."""
    ...

def is_digit(ch):
    """Return True if ch is a digit character."""
    ...

def line_encoding(s):
    """Encode the string by replacing consecutive groups of the same character with the count followed by the character."""
    ...

def chess_knight(cell):
    """Return the number of valid moves a knight can make from the given cell on a chess board."""
    ...

def delete_digit(n):
    """Return the maximum number you can get by deleting exactly one digit of the given number."""
    ...

def longest_word(sentence):
    """Return the longest word in a sentence, with all punctuation removed."""
    ...

def valid_time(time):
    """Return True if time is a valid 24-hour format (HH:MM)."""
    ...

def sum_up_numbers(input_string):
    """Return the sum of all numbers found in the input string."""
    ...

def different_squares(matrix):
    """Return the number of distinct 2x2 squares in a matrix."""
    ...

def digits_product(n):
    """Given the product of the digits, return the minimum positive integer whose digits multiply to n.
    If no such number exists, return 0. If n is 0, return 10."""
    ...

def file_naming(name):
    """Return a valid filename by appending the smallest (k+1) if the name already exists."""
    ...

def message_from_binary_code(message):
    """Decode a binary string where each 8-bit chunk represents an ASCII character."""
    ...

def sudoku(grid):
    """Return True if the 9x9 grid is a valid Sudoku."""
    ...

# ------------------------- self-tests -------------------------
TESTS = [
    (all_longest_strings, (["aba", "aa", "ad", "vcd", "aba"],), ["aba", "vcd", "aba"]),
    (add_border, (["abc", "ded"],), ["*****", "*abc*", "*ded*", "*****"]),
    (sorted_squares, ([-4, -1, 0, 3],), [0, 1, 9, 16]),
    (is_anagram, ("listen", "silent"), True),
    (is_anagram, ("hello", "world"), False),
    (first_digit, ("var_1__int",), "1"),
    (first_digit, ("q2q-q",), "2"),
    (alternating_sums, ([50, 60, 60, 45, 70],), [180, 105]),
    (common_character_count, ("aab", "aba"), 3),
    (different_squares, ([[1, 2, 1], [2, 3, 4], [2, 3, 4]],), 2),
    (knapsack_light, (10, 5, 6, 4, 9), 16),
    (knapsack_light, (10, 5, 6, 4, 1), 0),
    (array_change, ([1, 1, 1]), 0),
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