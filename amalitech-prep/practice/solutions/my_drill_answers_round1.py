"""DRILLS — the mistakes YOU keep making. Run this daily until it's 20/20 with no help.

    python practice/drills_common_mistakes.py

These are deliberately TINY (2-5 lines each). The goal is not difficulty — it is
MUSCLE MEMORY. You are training your fingers so these mistakes stop happening
under exam pressure.

===========================================================================
YOUR 8 REPEATING MISTAKES — read this list before every session
===========================================================================

 1. RETURN INSIDE A COLLECTING LOOP
    If you are gathering results, `return` goes AFTER the loop, never inside.
    (Inside is only correct when SEARCHING and you want to stop early.)

 2. HARDCODING OVER THE PARAMETER
    Never write `nums = [1,2,3]` inside the function. The value ARRIVES as the
    parameter. Never use input() either.

 3. THE 3 ZONES
    setup BEFORE the loop  ->  work INSIDE the loop  ->  return AFTER the loop.
    A setup line (`result = []`, `total = 0`) inside the loop resets it every turn.

 4. len(list) vs len(item)
    len(words) = HOW MANY words.   len(words[0]) = HOW LONG the first word is.

 5. METHODS THAT RETURN None
    .append() .sort() .reverse() .insert() .remove() all return None.
    Call them, never assign them:  `result.append(x)`  NOT `y = result.append(x)`

 6. FUNCTION vs METHOD SHAPE
    Built-in FUNCTION wraps:   sorted(a), len(a), sum(a), max(a)
    METHOD attaches with dot:  a.upper(), a.split(), a.append(x)
    There is no `a.sorted()` and no `a.len()`.

 7. INDENTATION
    The function body must be indented under `def`. Flush-left code is OUTSIDE
    the function and will not run as part of it.

 8. `=+` IS NOT `+=`
    `x =+ 5` means `x = +5` (assignment!). To add, the plus comes FIRST: `x += 5`.
    To replace with a new best, use plain `=`.

===========================================================================
Fill in each function. Delete the `...` and write the body.
===========================================================================
"""


# ---------- SECTION A: the 3 zones (setup / work / return) ----------
# Every one of these is: empty collector BEFORE, append INSIDE, return AFTER.

def doubles(nums):
    """Return a new list with every number doubled. [1,2,3] -> [2,4,6]"""
    
    new_list= []

    for x in nums:
        new_value = x * 2
        new_list.append(new_value) 
    return new_list


def only_positive(nums):
    """Return only the numbers greater than 0. [-1,4,0,7] -> [4,7]"""
    
    new_list = []

    for x in nums:
        if x > 0 :
            new_list.append(x)
    return new_list



def word_lengths(words):
    """Return the length of each word. ["hi","there"] -> [2,5]"""
    length=[]

    for x in words:
        number =len(x)
        length.append(number)
    return length

def shout(words):
    """Return every word in UPPERCASE. ["a","b"] -> ["A","B"]"""
    
    upper_case =[]

    for x in words:
        new_list = x.upper()
        upper_case.append(new_list)
    return upper_case


def count_evens(nums):
    """Return HOW MANY numbers are even. [1,2,3,4] -> 2"""
    
    count = 0
    for x in nums:
        if x % 2 == 0:
            count += 1            
    return count



def total_of_odds(nums):
    """Return the SUM of the odd numbers. [1,2,3,4] -> 4"""

    count = 0
    for x in nums:
        if x % 2 == 1:
            count += x            
    return count


# ---------- SECTION B: best-so-far (use `=`, never `+=`) ----------

def biggest(nums):
    """Return the largest number WITHOUT using max(). [3,9,2] -> 9"""
    best = nums[0]
    for x in nums:
        if x > best:
            best = x
    return best

def longest_word(words):
    """Return the longest word WITHOUT using max(). ["a","abc","ab"] -> "abc" """
    
    longest = words[0]

    for x in words:
        if len(longest) < len(x):
            longest = x
    return longest


# ---------- SECTION C: len(list) vs len(item) ----------

def how_many_words(words):
    """Return HOW MANY words are in the list. ["a","b","c"] -> 3"""
    
    counter = len(words)
    return counter


def first_word_length(words):
    """Return HOW LONG the FIRST word is. ["hello","hi"] -> 5"""
    
    counter = len(words[0])
    return counter

def total_letters(words):
    """Return the total number of letters across all words. ["ab","cde"] -> 5"""
    
    counter =0
    for x in words:
        counter += len(x)
    return counter



# ---------- SECTION D: search loops (return INSIDE is correct here!) ----------

def first_negative(nums):
    """Return the first negative number, or 0 if there is none. [3,-2,5] -> -2"""
    
    for x in nums:
        if x < 0:
            return x         
    return 0

def has_letter(word, letter):
    """Return True if `letter` appears in `word`, else False. ("cat","a") -> True
    
    return letter in word """
    for x in word:          # x is one character at a time
        if x == letter:     # is THIS character the one I want?
            return True     # found it — stop immediately
    return False


# ---------- SECTION E: function vs method shape ----------

def sorted_copy(nums):
    """Return a NEW sorted list, leaving `nums` untouched. [3,1,2] -> [1,2,3]"""
    
    sorted_list =sorted(nums)
    return sorted_list


def letters_in_order(word):
    """Return the word's letters sorted, as a STRING. "cab" -> "abc" """
    ...
    return("".join(sorted(word)))


def joined(words):
    """Glue the words together with a dash. ["a","b","c"] -> "a-b-c" """
    
    return("-".join(words))

# ---------- SECTION F: predicates (return the comparison directly) ----------

def is_even(n):
    """True if n is even. 4 -> True"""
    if n % 2 == 0:
        return True
    return False


def is_longer_than(word, n):
    """True if the word has MORE than n letters. ("hello",3) -> True"""
    return(len(word)> n)

def same_letters(a, b):
    """True if both words use exactly the same letters. ("listen","silent") -> True"""
    
    return (sorted(a) == sorted(b))



def all_same(nums):
    """True if every number in the list is identical. [5,5,5] -> True"""
    if not nums:
        return True  # or False, depending on how you want to define an empty list
    first = nums[0]
    for n in nums:
        if n != first:
            return False
    return True



# ------------------------- self-tests -------------------------
TESTS = [
    (doubles, ([1, 2, 3],), [2, 4, 6]),
    (only_positive, ([-1, 4, 0, 7],), [4, 7]),
    (word_lengths, (["hi", "there"],), [2, 5]),
    (shout, (["a", "b"],), ["A", "B"]),
    (count_evens, ([1, 2, 3, 4],), 2),
    (total_of_odds, ([1, 2, 3, 4],), 4),
    (biggest, ([3, 9, 2],), 9),
    (longest_word, (["a", "abc", "ab"],), "abc"),
    (how_many_words, (["a", "b", "c"],), 3),
    (first_word_length, (["hello", "hi"],), 5),
    (total_letters, (["ab", "cde"],), 5),
    (first_negative, ([3, -2, 5],), -2),
    (first_negative, ([1, 2],), 0),
    (has_letter, ("cat", "a"), True),
    (has_letter, ("cat", "z"), False),
    (sorted_copy, ([3, 1, 2],), [1, 2, 3]),
    (letters_in_order, ("cab",), "abc"),
    (joined, (["a", "b", "c"],), "a-b-c"),
    (is_even, (4,), True),
    (is_longer_than, ("hello", 3), True),
    (same_letters, ("listen", "silent"), True),
    (same_letters, ("hello", "world"), False),
    (all_same, ([5, 5, 5],), True),
    (all_same, ([5, 6, 5],), False),
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
        print("\nALL GREEN. Do it again tomorrow from scratch — speed matters now.")
