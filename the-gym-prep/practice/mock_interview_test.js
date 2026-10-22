/**
 * THE GYM RWANDA — TIMED MOCK INTERVIEW CODING CHALLENGE
 *
 * Run this file in your terminal using:
 *     node the-gym-prep/practice/mock_interview_test.js
 *
 * Set a timer for 30 minutes. Complete Challenge 1 and Challenge 2!
 */

// =========================================================================
// CHALLENGE 1 (8 kyu Level — 12 Minutes): Sum of Multiples
//
// Return the sum of all positive multiples of n strictly less than m.
// If n >= m or either number is invalid (<= 0), return 0.
//
// Examples:
//   sumOfMultiples(2, 9)  -> 2 + 4 + 6 + 8 = 20
//   sumOfMultiples(3, 13) -> 3 + 6 + 9 + 12 = 30
//   sumOfMultiples(4, 4)  -> 0
// =========================================================================
function sumOfMultiples(n, m) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// CHALLENGE 2 (7 kyu Level — 18 Minutes): Disemvowel Trolls
//
// Take a string and return a new string with all vowels (a, e, i, o, u,
// uppercase and lowercase) removed.
//
// Examples:
//   disemvowel("This website is for losers LOL!") -> "Ths wbst s fr lsrs LL!"
// =========================================================================
function disemvowel(str) {
  // YOUR CODE HERE
  return null;
}

// =========================================================================
// TEST SUITE
// =========================================================================
const TESTS = [
  { name: "sumOfMultiples(2, 9)", fn: () => sumOfMultiples(2, 9), expected: 20 },
  { name: "sumOfMultiples(3, 13)", fn: () => sumOfMultiples(3, 13), expected: 30 },
  { name: "sumOfMultiples(4, 4) [equal]", fn: () => sumOfMultiples(4, 4), expected: 0 },
  { name: "sumOfMultiples(5, 3) [n > m]", fn: () => sumOfMultiples(5, 3), expected: 0 },
  { name: "sumOfMultiples(0, 10) [zero input]", fn: () => sumOfMultiples(0, 10), expected: 0 },
  {
    name: "disemvowel('This website is for losers LOL!')",
    fn: () => disemvowel("This website is for losers LOL!"),
    expected: "Ths wbst s fr lsrs LL!"
  },
  {
    name: "disemvowel('AEIOU and aeiou')",
    fn: () => disemvowel("AEIOU and aeiou"),
    expected: " nd "
  },
];

function runTests() {
  let passed = 0;
  console.log("=================================================");
  console.log("   THE GYM — MOCK TECHNICAL INTERVIEW TEST      ");
  console.log("=================================================\n");

  for (const t of TESTS) {
    let result;
    try {
      result = t.fn();
    } catch (err) {
      result = `ERROR: ${err.message}`;
    }

    const isMatch = JSON.stringify(result) === JSON.stringify(t.expected);

    if (isMatch) {
      passed++;
      console.log(`[PASS] ${t.name} -> ${JSON.stringify(result)}`);
    } else {
      console.log(`[FAIL] ${t.name} -> got ${JSON.stringify(result)}, expected ${JSON.stringify(t.expected)}`);
    }
  }

  console.log("\n-------------------------------------------------");
  console.log(`Score: ${passed}/${TESTS.length} tests passed`);
  if (passed === TESTS.length) {
    console.log("ALL GREEN! 50/50 points on the coding challenge! Outstanding job!");
  } else {
    console.log("Keep going! Fill in both challenges and rerun!");
  }
}

runTests();

