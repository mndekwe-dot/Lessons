"""DRILLS — strings and lists (file 02). The Q2 toolkit.

    python practice/drills_strings_lists.py

Same format: tiny problems, one concept per section, do them IN ORDER.
This covers what the mistake-drills did NOT: slicing, split, string methods,
and the classic Q2 patterns.

===========================================================================
POSITIONS — the picture to keep in your head
===========================================================================

     a   m   a   l   i
     0   1   2   3   4      <- from the front
    -5  -4  -3  -2  -1      <- from the back

  s[2]     one item at position 2          -> "a"
  s[1:4]   from 1, STOPS BEFORE 4          -> "mal"
  s[:3]    from the start up to 3          -> "ama"
  s[2:]    from 2 to the end               -> "ali"
  s[::-1]  whole thing, backwards          -> "ilama"
  s[::2]   every 2nd item                  -> "aai"

REMINDER: slicing works the SAME on strings and lists.
===========================================================================
"""


# ---------- SECTION A: indexing and slicing ----------

def first_char(s):
    """Return the first character. "hello" -> "h" """
    return s[0]


def last_char(s):
    """Return the last character. "hello" -> "o" """
    return s[-1]


def first_three(s):
    """Return the first 3 characters. "hello" -> "hel" """
    return s[0:3]


def last_three(s):
    """Return the last 3 characters. "hello" -> "llo" """
    return s[-3: ]


def middle_part(s):
    """Return everything EXCEPT the first and last character. "hello" -> "ell" """
    return s[1:-1]


def backwards(s):
    """Return the string reversed. "hello" -> "olleh" """
    return s[::-1]


def every_second(s):
    """Return every 2nd character, starting from the first. "abcdef" -> "ace" """
    return s[::2]


def drop_first_two(nums):
    """Return the list without its first two items. [1,2,3,4] -> [3,4]"""

    return nums[2:]


# ---------- SECTION B: split and join ----------

def word_count(sentence):
    """How many words? "the cat sat" -> 3"""
    return len(sentence.split())

def first_word(sentence):
    """The first word. "the cat sat" -> "the" """
    words = sentence.split()
    return words[0]


def last_word(sentence):
    """The last word. "the cat sat" -> "sat" """
    words = sentence.split()
    return words[-1]

def reverse_words(sentence):
    """Same words, reversed ORDER. "the cat sat" -> "sat cat the" """
    return " ".join(sentence.split()[::-1])

def join_with_commas(words):
    """["a","b","c"] -> "a,b,c" """
    return ",".join(words)


def initials(sentence):
    """First letter of each word, joined. "the cat sat" -> "tcs" """
    
    result = []
    for w in sentence.split():
        result.append(w[0])
    return "".join(result)
      
# ---------- SECTION C: string methods ----------

def shout_it(s):
    """Uppercase the whole string. "hi" -> "HI" """
    return s.upper()


def trimmed(s):
    """Remove spaces from both ends. "  hi  " -> "hi" """
    return s.strip()


def count_letter(s, letter):
    """How many times does `letter` appear? ("banana","a") -> 3"""
    count = 0
    for ch in s:
        if ch == letter:
            count += 1
    return count

def swap_letter(s, old, new):
    """Replace every `old` with `new`. ("banana","a","o") -> "bonono" """
    return s.replace(old,new)


def starts_with_vowel(word):
    return word[0] in "aeiou"          # first char, is it in the vowel string?

def count_digits(s):
    count = 0
    for ch in s:
        if ch.isdigit():
            count += 1
    return count

def only_letters(s):
    result = []                        # a LIST — strings are immutable
    for ch in s:
        if ch.isalpha():
            result.append(ch)
    return "".join(result)             # fuse back into a string


# ---------- SECTION D: list methods ----------

def add_to_end(nums, x):
    """Return the list with x added at the end. ([1,2], 3) -> [1,2,3]"""
    return nums + [x]


def without_last(nums):
    """Return the list without its last item. [1,2,3] -> [1,2]"""
    return nums[:-1]


def position_of(nums, x):
    """The position of the first x, or -1 if absent. ([5,7,9],7) -> 1"""
    if x in nums:
        return nums.index(x)
    return -1

def how_many_times(nums, x):
    """How many times x appears. ([1,2,1],1) -> 2"""
    return nums.count(x)


def combine(a, b):
    """Join two lists into one. ([1,2],[3]) -> [1,2,3]"""
    return (a+b)


# ---------- SECTION E: classic Q2 patterns ----------

def is_palindrome(s):
    """Reads the same both ways? "level" -> True, "hello" -> False"""
    if s == s[::-1]:
        return True
    return False


def alternating_sums(nums):
    """[sum of even positions, sum of odd positions].
    [50,60,60,45,70] -> [180, 105]
    HINT: step slicing."""
    ...


def adjacent_sums(nums):
    """Sum each neighbouring pair. [1,2,3,4] -> [3,5,7]
    HINT: loop to len-1 so nums[i+1] exists."""
    results =[]
    for i in range(len(nums)-1):
        results.append(nums[i]+ nums[i+1])
    return results

def longest_word_in(sentence):
    """The longest word. "the apple sat" -> "apple" """
    words = sentence.split()
    best = words[0]

    for w in words:
        if len(w) > len(best):
            best = w
    return best

def capitalize_words(sentence):
    """Uppercase the first letter of each word.
    "the cat sat" -> "The Cat Sat" """
    result = []
    for w in sentence.split():
        result.append(w.capitalize())     # "the" -> "The"
    return " ".join(result)



# ------------------------- self-tests -------------------------
TESTS = [
    (first_char, ("hello",), "h"),
    (last_char, ("hello",), "o"),
    (first_three, ("hello",), "hel"),
    (last_three, ("hello",), "llo"),
    (middle_part, ("hello",), "ell"),
    (backwards, ("hello",), "olleh"),
    (every_second, ("abcdef",), "ace"),
    (drop_first_two, ([1, 2, 3, 4],), [3, 4]),
    (word_count, ("the cat sat",), 3),
    (first_word, ("the cat sat",), "the"),
    (last_word, ("the cat sat",), "sat"),
    (reverse_words, ("the cat sat",), "sat cat the"),
    (join_with_commas, (["a", "b", "c"],), "a,b,c"),
    (initials, ("the cat sat",), "tcs"),
    (shout_it, ("hi",), "HI"),
    (trimmed, ("  hi  ",), "hi"),
    (count_letter, ("banana", "a"), 3),
    (swap_letter, ("banana", "a", "o"), "bonono"),
    (starts_with_vowel, ("apple",), True),
    (starts_with_vowel, ("cat",), False),
    (count_digits, ("a1b22",), 3),
    (only_letters, ("a1b2",), "ab"),
    (add_to_end, ([1, 2], 3), [1, 2, 3]),
    (without_last, ([1, 2, 3],), [1, 2]),
    (position_of, ([5, 7, 9], 7), 1),
    (position_of, ([5, 7, 9], 4), -1),
    (how_many_times, ([1, 2, 1], 1), 2),
    (combine, ([1, 2], [3]), [1, 2, 3]),
    (is_palindrome, ("level",), True),
    (is_palindrome, ("hello",), False),
    (alternating_sums, ([50, 60, 60, 45, 70],), [180, 105]),
    (adjacent_sums, ([1, 2, 3, 4],), [3, 5, 7]),
    (longest_word_in, ("the apple sat",), "apple"),
    (capitalize_words, ("the cat sat",), "The Cat Sat"),
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
    if passed == len(TESTS):
        print("\nALL GREEN. Now try practice/q2_data_manipulation.py — the real GCA versions.")
