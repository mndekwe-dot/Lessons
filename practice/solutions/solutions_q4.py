"""Solutions for q4_problem_solving.py"""
from collections import Counter


def most_frequent(nums):
    counts = Counter(nums)
    return max(counts, key=counts.get)


def contains_close_duplicates(nums, k):
    last_index = {}
    for i, x in enumerate(nums):
        if x in last_index and i - last_index[x] <= k:
            return True
        last_index[x] = i
    return False


def common_elements(a, b):
    return sorted(set(a) & set(b))


def can_form_note(note, magazine):
    need, have = Counter(note), Counter(magazine)
    return all(have[c] >= n for c, n in need.items())


def first_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return x
        seen.add(x)
    return -1


def max_subarray_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # slide: add new, drop old
        best = max(best, window)
    return best


def smallest_difference(a, b):
    a, b = sorted(a), sorted(b)
    i = j = 0
    best = abs(a[0] - b[0])
    while i < len(a) and j < len(b):
        best = min(best, abs(a[i] - b[j]))
        if a[i] < b[j]:      # move the pointer at the smaller value
            i += 1
        else:
            j += 1
    return best


def count_pairs_with_sum(nums, target):
    seen = Counter()
    count = 0
    for x in nums:
        count += seen[target - x]   # every earlier partner forms a pair
        seen[x] += 1
    return count


def equal_split_index(nums):
    total = sum(nums)
    left = 0
    for i, x in enumerate(nums):
        if left == total - left - x:
            return i
        left += x
    return -1
