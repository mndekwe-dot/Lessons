"""Solutions for the mock test (06-mock-test.md)."""
from collections import Counter


def growth_in_years(deposit, rate, threshold):
    years = 0
    while deposit <= threshold:
        deposit *= (1 + rate / 100)
        years += 1
    return years


def most_common_first_letter(words):
    counts = Counter(w[0] for w in words)
    best = max(counts.values())
    return min(c for c, n in counts.items() if n == best)  # min() breaks ties alphabetically


def battleships(field):
    n = len(field)
    ships = 0
    for r in range(n):
        for c in range(n):
            if field[r][c] == 1:
                above = r > 0 and field[r - 1][c] == 1
                left = c > 0 and field[r][c - 1] == 1
                if not above and not left:   # only count the top-left cell of each ship
                    ships += 1
    return ships


def longest_equal_subarray(nums):
    # Treat 0 as -1; a subarray with equal 0s and 1s has running-sum difference 0,
    # i.e. the same running sum appears at both ends. Store first index of each sum.
    first_seen = {0: -1}
    running = 0
    best = 0
    for i, x in enumerate(nums):
        running += 1 if x == 1 else -1
        if running in first_seen:
            best = max(best, i - first_seen[running])
        else:
            first_seen[running] = i
    return best
