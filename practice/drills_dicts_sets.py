"""DRILLS — dictionaries and sets, tiny problems (file 03).

    python practice/drills_dicts_sets.py

Same idea as drills_common_mistakes.py: small, repetitive, one concept at a time.
Do them IN ORDER — each section builds on the one before.

===========================================================================
THE 4 SHAPES YOU ARE TRAINING
===========================================================================

 A. READING a dictionary        d[key], d.get(key, default), len(d)
 B. BUILDING a dictionary       d[key] = value      (the tally sheet)
 C. SCANNING a dictionary       for key, value in d.items():   + best-so-far
 D. SETS                        seen = set(), seen.add(x), x in seen

REMINDERS
 - {} is an empty DICTIONARY. An empty set is set()
 - d[missing_key] CRASHES. d.get(missing_key, 0) does not.
 - .add() is for sets, .append() is for lists. Both return None.
 - Counting = d[x] = d.get(x, 0) + 1
 - Still true: return AFTER the loop, unless you are SEARCHING.
===========================================================================
"""


# ---------- SECTION A: reading a dictionary ----------

def get_age(ages, name):
    """Return the person's age, or 0 if they are not in the dictionary.
    ({"ama": 20}, "ama") -> 20     ({"ama": 20}, "zoe") -> 0"""
    
    return ages.get(name,0)



def how_many_keys(d):
    """How many keys does the dictionary have? {"a":1,"b":2} -> 2"""
    return len(d.keys())
def has_key(d, key):
    """True if the key exists in the dictionary. ({"a":1}, "a") -> True"""
    return key in d


def all_the_values(d):
    """Return a list of all the values. {"a":1,"b":2} -> [1,2]"""
    return list(d.values())


# ---------- SECTION B: building a dictionary (the tally sheet) ----------

def count_letters(word):
    """Count each letter. "aba" -> {"a":2, "b":1}"""
    counts={}
    for x in word:
        counts[x] = counts.get(x,0)+1
    return counts


def count_items(items):
    """Count each item in a list. [1,2,1] -> {1:2, 2:1}"""
    counts={}
    for x in items:
      counts[x] = counts.get(x,0)+1
    return counts

def count_words(sentence):
    """Count each word in a sentence. "a b a" -> {"a":2, "b":1}
    HINT: split first."""
    words = sentence.split()
    counts ={} 
    for x in words:
        counts[x]=counts.get(x,0)+1
    return counts


def length_map(words):
    """Map each word to its length. ["hi","abc"] -> {"hi":2, "abc":3}
    (Not counting — just storing a value per key.)"""
    counts={}
    for k in words:
        counts[k] = len(k)
    return counts 



# ---------- SECTION C: scanning a dictionary ----------

def total_of_values(d):
    """Add up all the values. {"a":1,"b":2} -> 3"""
    count=0
    for x,v in d.items():
        count += v
    return count


def key_with_biggest_value(d):
    """Return the key whose value is largest. {"a":1,"b":5,"c":2} -> "b"
    HINT: best-so-far, but track TWO things (the key and its value)."""
    best = 0
    best_k = ""

    for k,v in d.items():
        if v > best:
            best = v
            best_k = k
    return best_k

def keys_with_value(d, target):
    """Return all keys whose value equals target, in order.
    ({"a":1,"b":2,"c":1}, 1) -> ["a","c"]"""
    list =[]

    for x , v in d.items():
        if v == target:
            list.append(x)
    return list


def appears_once(d):
    """Return all keys whose value is exactly 1, in order.
    {"a":2,"b":1,"c":1} -> ["b","c"]"""

    appear=[]

    for x , v in d.items():
        if v == 1:
            appear.append(x)
    return appear

# ---------- SECTION D: sets ----------

def distinct_count(nums):
    """How many DIFFERENT values are there? [1,2,2,3] -> 3"""
    return len(set(nums))


def remove_duplicates(nums):
    """Return the distinct values, sorted. [3,1,3,2] -> [1,2,3]"""
    return sorted(set(nums))



def in_both(a, b):
    """Values present in BOTH lists, sorted, no duplicates.
    ([1,2,3],[2,3,4]) -> [2,3]"""
    ...


def only_in_first(a, b):
    """Values in a but NOT in b, sorted. ([1,2,3],[2]) -> [1,3]"""
    ...


def has_duplicate(nums):
    """True if any value appears more than once. [1,2,1] -> True
    HINT: a set + compare lengths, OR the 'seen' loop."""
    ...


# ---------- SECTION E: putting it together ----------

def most_frequent(nums):
    """The value that appears most often. [3,1,3,2,3,1] -> 3
    Count first, then scan for the biggest."""
    ...


def first_repeated(nums):
    """The first value that appears a second time, or -1.
    [2,1,3,1] -> 1      [1,2,3] -> -1
    HINT: this is a SEARCH — a set, and return inside the loop."""
    ...


def first_unique_letter(word):
    """The first letter appearing exactly once, or "" if none.
    "aabc" -> "b"       "aabb" -> ""
    HINT: count everything first, THEN walk the word again in order."""
    ...


# ------------------------- self-tests -------------------------
TESTS = [
    (get_age, ({"ama": 20}, "ama"), 20),
    (get_age, ({"ama": 20}, "zoe"), 0),
    (how_many_keys, ({"a": 1, "b": 2},), 2),
    (has_key, ({"a": 1}, "a"), True),
    (has_key, ({"a": 1}, "z"), False),
    (all_the_values, ({"a": 1, "b": 2},), [1, 2]),
    (count_letters, ("aba",), {"a": 2, "b": 1}),
    (count_items, ([1, 2, 1],), {1: 2, 2: 1}),
    (count_words, ("a b a",), {"a": 2, "b": 1}),
    (length_map, (["hi", "abc"],), {"hi": 2, "abc": 3}),
    (total_of_values, ({"a": 1, "b": 2},), 3),
    (key_with_biggest_value, ({"a": 1, "b": 5, "c": 2},), "b"),
    (keys_with_value, ({"a": 1, "b": 2, "c": 1}, 1), ["a", "c"]),
    (appears_once, ({"a": 2, "b": 1, "c": 1},), ["b", "c"]),
    (distinct_count, ([1, 2, 2, 3],), 3),
    (remove_duplicates, ([3, 1, 3, 2],), [1, 2, 3]),
    (in_both, ([1, 2, 3], [2, 3, 4]), [2, 3]),
    (only_in_first, ([1, 2, 3], [2]), [1, 3]),
    (has_duplicate, ([1, 2, 1],), True),
    (has_duplicate, ([1, 2, 3],), False),
    (most_frequent, ([3, 1, 3, 2, 3, 1],), 3),
    (first_repeated, ([2, 1, 3, 1],), 1),
    (first_repeated, ([1, 2, 3],), -1),
    (first_unique_letter, ("aabc",), "b"),
    (first_unique_letter, ("aabb",), ""),
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
        print("\nALL GREEN. Now try practice/q4_problem_solving.py — the real GCA versions.")
