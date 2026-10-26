/**
 * SOLUTIONS for mock_test_gca.js
 */

function growthInYears(deposit, rate, threshold) {
  let years = 0;
  let balance = deposit;
  while (balance <= threshold) {
    balance *= (1 + rate / 100);
    years++;
  }
  return years;
}

function mostCommonFirstLetter(words) {
  const counts = {};
  for (const w of words) {
    const first = w[0];
    counts[first] = (counts[first] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const candidates = Object.keys(counts)
    .filter(c => counts[c] === maxCount)
    .sort();
  return candidates[0];
}

function battleships(field) {
  const n = field.length;
  let ships = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < field[r].length; c++) {
      if (field[r][c] === 1) {
        const above = r > 0 && field[r - 1][c] === 1;
        const left = c > 0 && field[r][c - 1] === 1;
        if (!above && !left) {
          ships++; // Top-left cell of a ship
        }
      }
    }
  }
  return ships;
}

function longestEqualSubarray(nums) {
  // Running sum technique: 0 counts as -1, 1 counts as +1.
  // When running sum repeats, the subarray between the two occurrences has equal 0s and 1s!
  const firstSeen = { 0: -1 };
  let running = 0;
  let best = 0;

  for (let i = 0; i < nums.length; i++) {
    running += nums[i] === 1 ? 1 : -1;
    if (running in firstSeen) {
      best = Math.max(best, i - firstSeen[running]);
    } else {
      firstSeen[running] = i;
    }
  }
  return best;
}

module.exports = {
  growthInYears,
  mostCommonFirstLetter,
  battleships,
  longestEqualSubarray
};
