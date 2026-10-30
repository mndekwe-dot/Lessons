# The JavaScript Patterns Bible

> "You do not need to memorize hundreds of algorithms. Almost every coding question is built from the same few patterns.
> Learn to **spot** the pattern, **say** the approach, then **type** the template."

Read this file **every day**. It is built to be re-read, not read once.

---

## How to Read This Every Day (15 minutes)

| Every day (5 min) | Then one rotating part (10 min) |
|---|---|
| [Part 2: Pattern Picker](#part-2-the-pattern-picker) + [Part 6: Top 25 Traps](#top-25-traps-read-daily) | **Mon:** Group A · **Tue:** Groups B + C · **Wed:** Group D · **Thu:** Group E · **Fri:** Group F · **Sat:** Groups G + H · **Sun:** [Part 7 Self-Quiz](#part-7-daily-self-quiz) |

**How to read a pattern:** cover the template with your hand, read only the **Trigger** and **Say it**, then try to write the template from memory on paper. Uncover and compare.

---

## Table of Contents

1. [Part 1: The Golden Rule and the Approach Script](#part-1-the-golden-rule-and-the-approach-script)
2. [Part 2: The Pattern Picker](#part-2-the-pattern-picker)
3. [Part 3: The Patterns](#part-3-the-patterns)
   - [Group A: Loop Basics](#group-a-loop-basics) (1–5)
   - [Group B: Index Patterns](#group-b-index-patterns) (6–9)
   - [Group C: Rearranging](#group-c-rearranging) (10–11)
   - [Group D: Lookup Patterns (Objects, Maps, Sets)](#group-d-lookup-patterns-objects-maps-sets) (12–14)
   - [Group E: Smart Walking](#group-e-smart-walking) (15–18)
   - [Group F: Numbers, Strings and Stacks](#group-f-numbers-strings-and-stacks) (19–23)
   - [Group G: Grids (2D Arrays)](#group-g-grids-2d-arrays) (24–28)
   - [Group H: Sorting](#group-h-sorting) (29)
4. [Part 4: Choosing a Loop Style](#part-4-choosing-a-loop-style)
5. [Part 5: Loops to Methods Bridge](#part-5-loops-to-methods-bridge)
6. [Part 6: Confusing Syntax, Side by Side](#part-6-confusing-syntax-side-by-side)
7. [Part 7: Daily Self-Quiz](#part-7-daily-self-quiz)

---

## Part 1: The Golden Rule and the Approach Script

### The Golden Rule of Loops

Every loop problem follows this 3-step structure:

```
[ Step 1: Prepare the Container ] -> BEFORE the loop  (let total = 0, const result = [])
               ▼
[ Step 2: Visit & Update ]        -> INSIDE the loop  (total += item, result.push(item))
               ▼
[ Step 3: Return the Container ]  -> AFTER the loop   (return total, return result)
```

> [!CAUTION]
> **The most common beginner mistake:** putting `return` inside the loop body. The function stops on the very first round and never looks at the rest of the items.
> The only time `return` goes inside a loop is the **Early-Exit Search** (Pattern 5): "found it, stop now".

### Why Can't the Container Go Inside the Loop?

**1. The Shopping Cart Analogy (the wipeout trap).** The container is a **shopping cart**:
- **Outside the loop (correct):** take **one cart** before entering the store. Every item goes into that same cart. At checkout (after the loop) the cart holds everything: `[2, 4, 6]`.
- **Inside the loop (wrong):** every round throws away the cart and grabs a **brand-new empty one**.
  - Round 1 (sees 1): new cart → adds 2 → `[2]`.
  - Round 2 (sees 2): **throws cart away!** new cart → adds 4 → the 2 is lost.
  - Round 3 (sees 3): **throws cart away!** new cart → adds 6 → the 4 is lost.

**2. Block scope (ReferenceError).** `let`/`const` created inside `{ ... }` only live inside those braces:

```javascript
// WRONG:
function doubleAllWrong(arr) {
  for (const num of arr) {
    const result = [];    // created and destroyed on every lap
    result.push(num * 2);
  } // <--- 'result' dies here

  // return result;     // ReferenceError: result is not defined
}

// CORRECT:
function doubleAll(arr) {
  const result = [];        // 1. built once BEFORE the loop
  for (const num of arr) {
    result.push(num * 2);   // 2. collects on every lap
  }
  return result;            // 3. survives and returns everything
}
```

### The 4-Step Recipe (before typing anything)

1. **Pick the pattern** using [Part 2](#part-2-the-pattern-picker).
2. **Write the container line** (before the loop).
3. **Write the loop and the update.**
4. **Write the return** (after the loop), and the **not-found** return.

### The Approach Script (say this out loud in interviews)

Interviewers grade the **explanation** as much as the code. Use the same 7 lines every time:

| # | Say | Example (`allLongestStrings`) |
|---|---|---|
| 1 | **Restate:** "So I get ___ and must return ___." | "I get an array of words and must return all words with the maximum length, in order." |
| 2 | **Example:** "For ___, the answer is ___ because ___." | "For `["aba","aa","vcd"]` it's `["aba","vcd"]` because both have length 3." |
| 3 | **Pattern:** "This is a ___ problem, so I will ___." | "This is Champion + Filter: first find the max length, then keep words with that length." |
| 4 | **Edge cases:** "If ___, I return ___." | "If the array is empty, I return an empty array." |
| 5 | **Code** while narrating each line. | "First loop finds `maxLen`..." |
| 6 | **Trace** the example by hand. | "`maxLen` goes 0 → 3. Then `aba` stays, `aa` is skipped..." |
| 7 | **Cost:** "One pass, so O(n) time, and ___ extra space." | "Two passes is still O(n) time, O(n) space for the result." |

> [!TIP]
> If stuck, say the **brute-force** idea first ("I could check every pair with two loops, that's O(n²)"), then improve it ("but a Set lets me check in one pass"). Interviewers reward that thinking.

---

## Part 2: The Pattern Picker

Read the question, find the **trigger words**, jump to the pattern.

| Trigger words in the question | Pattern | First line to type |
|---|---|---|
| "sum", "total", "how many", "count", "build a string" | [1 Accumulator](#pattern-1-accumulator-the-piggy-bank) | `let total = 0;` / `let count = 0;` / `let text = "";` |
| "keep only", "remove", "extract", "all items that" | [2 Filter](#pattern-2-filter-the-bouncer) | `const result = [];` |
| "double every", "uppercase each", "convert each" | [3 Transformer](#pattern-3-transformer-the-assembly-line) | `const result = [];` |
| "largest", "smallest", "longest", "best", "index of max" | [4 Champion](#pattern-4-champion-tracker-the-title-belt) | `let best = arr[0];` |
| "does it contain", "is every", "find the first", "index of" | [5 Early-Exit Search](#pattern-5-early-exit-search-the-detective) | `for (...) { if (...) return ...; } return notFound;` |
| "next to each other", "adjacent", "consecutive", "strictly increasing" | [6 Adjacent Pairs](#pattern-6-adjacent-pairs-the-neighbours-handshake) | `for (let i = 0; i < arr.length - 1; i++)` |
| "every other", "alternate", "odd/even positions", "teams" | [7 Alternate Index](#pattern-7-alternate-index-the-two-teams) | `if (i % 2 === 0)` |
| "reverse", "backwards", "from the end" | [8 Backwards Loop](#pattern-8-backwards-loop-rewinding-the-tape) | `for (let i = arr.length - 1; i >= 0; i--)` |
| "swap", "rotate", "shift left/right" | [9 Swap and Rotate](#pattern-9-swap-and-rotate-the-musical-chairs) | `[a[i], a[j]] = [a[j], a[i]];` |
| "group", "X first then Y", "move zeros to end", "split into" | [10 Buckets](#pattern-10-buckets-partition-the-sorting-bins) | `const groupA = []; const groupB = [];` |
| "two arrays", "merge", "interleave", "zip" | [11 Interleave](#pattern-11-interleave-two-arrays-the-zipper) | `for (let i = 0; i < a.length; i++)` |
| "most frequent", "how many times each", "anagram", "can build from" | [12 Tally](#pattern-12-tally-counter-the-clipboard) | `const count = {};` |
| "duplicate", "unique", "seen before", "common to both", "first repeated" | [13 Seen Set](#pattern-13-seen-set-the-guest-list) | `const seen = new Set();` |
| "pair that sums to", "within k positions", "complement" | [14 Look-Back Map](#pattern-14-look-back-map-the-memory-notebook) | `const lastSeen = new Map();` |
| "palindrome", "reverse in place", "sorted array pair" | [15 Two Pointers (ends)](#pattern-15-two-pointers-from-both-ends-the-bridge) | `let left = 0, right = arr.length - 1;` |
| "two sorted arrays", "closest between two lists" | [16 Two Pointers (two arrays)](#pattern-16-two-pointers-across-two-arrays-the-two-queues) | `let i = 0, j = 0;` |
| "subarray of size k", "window", "k consecutive" | [17 Sliding Window](#pattern-17-sliding-window-the-moving-frame) | `let windowSum = 0;` |
| "left side equals right side", "balance point", "sum of neighbours" | [18 Running Sum](#pattern-18-running-sum--prefix-sum-the-scale) | `const total = ...; let leftSum = 0;` |
| "digits of a number", "reverse a number", "sum of digits" | [19 Digit Peeling](#pattern-19-digit-peeling-peeling-an-onion) | `n % 10` and `Math.floor(n / 10)` |
| "letters", "digits", "vowels", "characters of a string" | [20 Character Check](#pattern-20-character-check-and-string-building-the-sorting-office) | `for (const ch of s)` |
| "parentheses", "brackets", "nested", "undo", "innermost first" | [21 Stack](#pattern-21-stack-the-pile-of-plates) | `const stack = [];` |
| "how many years/steps until", "keep doing until" | [22 Simulation](#pattern-22-simulation-while-loop-the-countdown) | `while (current < target)` |
| "century", "area of shape", "sum 1 to n" | [23 Math Shortcut](#pattern-23-math-shortcut-the-calculator) | a formula, no loop |
| "matrix", "grid", "rows and columns", "board" | [24 Grid Walk](#pattern-24-grid-walk-reading-a-book) | `for (let r...) for (let c...)` |
| "neighbours", "adjacent cells", "mines around" | [25 Neighbour Directions](#pattern-25-neighbour-directions-the-compass) | `const dirs = [[-1,0],[1,0],...];` |
| "column", "below it", "vertical" | [26 Column-First Walk](#pattern-26-column-first-walk-the-elevator) | `for (let c...) for (let r...)` |
| "rotate", "transpose", "border", "new grid" | [27 Build a New Grid](#pattern-27-build-a-new-grid-the-photocopier) | `const result = [];` |
| "spiral", "clockwise", "layer by layer" | [28 Spiral / Boundaries](#pattern-28-spiral--shrinking-boundaries-peeling-an-orange) | `let top = 0, bottom = n - 1, left = 0, right = n - 1;` |
| "sorted", "in order", "rank", "keep -1 in place" | [29 Sort Then Process](#pattern-29-sort-then-process-lining-up-by-height) | `[...arr].sort((a, b) => a - b)` |

> [!IMPORTANT]
> Many questions **combine two patterns**. `allLongestStrings` = Champion (find max) + Filter (keep matching). `moveLettersToFront` = Character Check + Buckets. Name both when explaining.

---

## Part 3: The Patterns

Every pattern has the same parts:
- **Trigger:** words that point to it.
- **Picture:** an everyday image to remember it.
- **Template:** the code shape to type.
- **Real question:** an example from your drills or the GCA.
- **Say it:** one sentence to explain the approach out loud.
- **Trap:** the mistake that usually breaks it.

---

## Group A: Loop Basics

### Pattern 1: Accumulator (The Piggy Bank)

- **Trigger:** "sum", "total", "count how many", "product", "build a string".
- **Picture:** a piggy bank. Start empty, drop in a coin each round, count it at the end.

```javascript
// Template: number total
function sumArray(numbers) {
  let total = 0;               // 1. empty bank
  for (const num of numbers) {
    total += num;              // 2. drop a coin
  }
  return total;                // 3. count after the loop
}

// Variation: counter (add 1 only when a rule passes)
function countLongWords(words) {
  let count = 0;
  for (const word of words) {
    if (word.length > 5) count++;
  }
  return count;
}

// Variation: string builder
function repeatWord(word, times) {
  let result = "";             // empty string container
  for (let i = 0; i < times; i++) {
    result += word;
  }
  return result;
}

console.log(sumArray([1, 2, 3, 4]));        // 10
console.log(repeatWord("Ha", 3));           // "HaHaHa"
```

| Goal | Start value | Why |
|---|---|---|
| Sum / count | `0` | adding to 0 changes nothing |
| Product | `1` | multiplying by 0 would wipe everything |
| String | `""` | empty text |

- **Real question:** `positiveSum`, `squareSum`, `countVowels`, `sumOdd`, `getCount` (Codewars).
- **Say it:** "I keep a running total that starts at 0, add each item in one pass, and return it after the loop. O(n)."
- **Trap:** starting a product at `0`, or forgetting `let` (`total = 0` with no declaration).

---

### Pattern 2: Filter (The Bouncer)

- **Trigger:** "keep only", "remove all", "extract", "all items that".
- **Picture:** a nightclub bouncer. Passes the rule → enters (`push`). Fails → skipped.

```javascript
function onlyPositives(numbers) {
  const result = [];
  for (const num of numbers) {
    if (num > 0) {
      result.push(num);       // push only when the rule passes
    }
  }
  return result;
}

console.log(onlyPositives([1, -4, 7, 0, -2]));  // [1, 7]
// One-liner: numbers.filter(num => num > 0)
```

- **Real question:** `removeAll`, `onlyEvensWithFilter`, `longWordsWithFilter`, `removeNullishWithFilter`.
- **Say it:** "I make an empty result array, walk through once, and push only the items that pass the rule. O(n)."
- **Trap:** `return result.push(x)`. `push` returns the **new length** (a number), not the array.

---

### Pattern 3: Transformer (The Assembly Line)

- **Trigger:** "double every", "uppercase each", "square each", "convert".
- **Picture:** a conveyor belt. Every item gets painted and goes in the box. **Same count in, same count out.**

```javascript
function doubleAll(numbers) {
  const doubled = [];
  for (const num of numbers) {
    doubled.push(num * 2);    // every item, changed
  }
  return doubled;
}

console.log(doubleAll([1, 2, 3]));  // [2, 4, 6]
// One-liner: numbers.map(num => num * 2)

// Capitalize each word
function capitalizeWords(sentence) {
  return sentence
    .split(" ")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
console.log(capitalizeWords("hello big world"));  // "Hello Big World"
```

- **Real question:** `doubleWithMap`, `uppercaseWithMap`, `wordLengthsWithMap`, `capitalizeWords`, `initials`.
- **Say it:** "Every item changes the same way, so I map each one to its new value. Output has the same length. O(n)."
- **Trap:** changing the loop variable (`num = num * 2`) does **not** change the array. Push the new value or use `arr[i] = ...`.

---

### Pattern 4: Champion Tracker (The Title Belt)

- **Trigger:** "largest", "smallest", "longest", "best", "index of the max".
- **Picture:** a boxing champion. The first fighter holds the belt. A stronger challenger takes it.

```javascript
// Template: best value
function findLargest(numbers) {
  let best = numbers[0];            // first item holds the belt
  for (const num of numbers) {
    if (num > best) best = num;     // new champion
  }
  return best;
}

// Variation: best INDEX (needs a counting loop)
function indexOfLargest(numbers) {
  let bestIndex = 0;
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > numbers[bestIndex]) bestIndex = i;
  }
  return bestIndex;
}

// Variation: champion + filter (ALL items that tie for best) -> two passes
function allLongestStrings(words) {
  let maxLen = 0;
  for (const word of words) {                 // pass 1: find the record
    if (word.length > maxLen) maxLen = word.length;
  }
  return words.filter(word => word.length === maxLen);  // pass 2: keep the ties
}

console.log(findLargest([-10, -50, -3]));               // -3
console.log(allLongestStrings(["aba", "aa", "ad", "vcd", "aba"]));  // ["aba","vcd","aba"]
```

- **Real question:** `findSmallest`, `longestWordIn`, `adjacentElementsProduct`, `keyWithBiggestValue`, `biggestRowSum`, `allLongestStrings`.
- **Say it:** "I let the first item be the champion, compare every other item, and replace the champion when I find a better one. O(n)."
- **Trap:** starting at `0` instead of `numbers[0]`. With `[-10, -50, -3]`, starting at 0 wrongly returns 0.
- **Shortcut:** `Math.max(...numbers)` (note the `...`). `Math.max(numbers)` gives `NaN`.

---

### Pattern 5: Early-Exit Search (The Detective)

- **Trigger:** "does it contain", "is every", "find the first", "return the index of", "or -1".
- **Picture:** looking for keys in a bag. The moment your hand touches them, **stop**.

```javascript
// Version 1: "is there ANY?" -> return true inside, false after
function hasNegative(numbers) {
  for (const num of numbers) {
    if (num < 0) return true;     // found -> stop now
  }
  return false;                   // loop finished, nothing found
}

// Version 2: "are ALL ok?" -> look for the first BAD item
function areAllEven(numbers) {
  for (const num of numbers) {
    if (num % 2 !== 0) return false;   // one bad item breaks the rule
  }
  return true;
}

// Version 3: "find the first ITEM" -> return the item itself
function firstDigit(s) {
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") return ch;   // the item, not true!
  }
  return "";                                  // not-found value
}

// Version 4: "find the INDEX" -> counting loop, -1 if missing
function indexOfManual(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

console.log(firstDigit("var_1__int"));        // "1"
console.log(indexOfManual([4, 7, 9], 9));     // 2
```

| Question asks for | Inside the loop | After the loop |
|---|---|---|
| any? | `return true` | `return false` |
| all? | `return false` (on a bad one) | `return true` |
| first item | `return item` | `return null` / `""` / `undefined` (read the question) |
| first index | `return i` | `return -1` |

- **Real question:** `hasNegativeNumber`, `firstDigit`, `positionOf`, `hasZeroRow`, `startsWithVowel`.
- **Say it:** "I scan from the start and return as soon as I find a match. If the loop ends, nothing matched, so I return the not-found value. Worst case O(n)."
- **Traps:** returning `true` when the question wants the item · putting the not-found `return` **inside** the loop (it would fire on the first non-match) · forgetting the not-found case completely.

---

## Group B: Index Patterns

### Pattern 6: Adjacent Pairs (The Neighbours' Handshake)

- **Trigger:** "adjacent", "next to each other", "consecutive", "strictly increasing", "difference between neighbours".
- **Picture:** people in a line shake hands with the person on their right. The **last** person has nobody on their right.

```javascript
function adjacentElementsProduct(arr) {
  let best = arr[0] * arr[1];
  for (let i = 0; i < arr.length - 1; i++) {   // stop one early!
    const product = arr[i] * arr[i + 1];
    if (product > best) best = product;
  }
  return best;
}

// Make array strictly increasing with the fewest +1 moves
function arrayChange(input) {
  const arr = [...input];          // copy, so the input stays untouched
  let moves = 0;
  for (let i = 1; i < arr.length; i++) {       // compare with the one BEFORE
    if (arr[i] <= arr[i - 1]) {
      const needed = arr[i - 1] + 1;
      moves += needed - arr[i];
      arr[i] = needed;
    }
  }
  return moves;
}

console.log(adjacentElementsProduct([3, 6, -2, -5, 7, 3]));  // 21
console.log(arrayChange([1, 1, 1]));                          // 3
```

- **Real question:** `adjacentPairSums`, `adjacentSums`, `adjacentElementsProduct`, `arrayChange`, `almostIncreasingSequence`.
- **Say it:** "I compare each item with its neighbour, so I loop to `length - 1` to avoid reading past the end. O(n)."
- **Trap:** `i < arr.length` with `arr[i + 1]` reads `undefined` on the last round. Pick **one** style: `i` to `length - 1` with `i + 1`, **or** `i` from `1` with `i - 1`.

---

### Pattern 7: Alternate Index (The Two Teams)

- **Trigger:** "every other", "alternate", "even/odd positions", "team 1 and team 2".
- **Picture:** kids counting off "1, 2, 1, 2" to split into two teams.

```javascript
function alternatingSums(weights) {
  let team1 = 0;
  let team2 = 0;
  for (let i = 0; i < weights.length; i++) {
    if (i % 2 === 0) team1 += weights[i];   // positions 0, 2, 4...
    else team2 += weights[i];               // positions 1, 3, 5...
  }
  return [team1, team2];
}

// Every second item: step by 2
function everyOtherItem(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) result.push(arr[i]);
  return result;
}

console.log(alternatingSums([50, 60, 60, 45, 70]));  // [180, 105]
```

- **Real question:** `alternatingSums`, `everyOtherItem`, `everySecond`.
- **Say it:** "The index decides the team: `i % 2 === 0` is team 1, otherwise team 2. One pass, O(n)."
- **Trap:** checking `weights[i] % 2` (the **value**) instead of `i % 2` (the **position**). And `/` instead of `%`.

---

### Pattern 8: Backwards Loop (Rewinding the Tape)

- **Trigger:** "reverse", "from the end", "last occurrence".
- **Picture:** rewinding a video tape from the end to the start.

```javascript
function reverseWithLoop(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {   // start at last index, stop at 0
    result.push(arr[i]);
  }
  return result;
}

console.log(reverseWithLoop([1, 2, 3]));           // [3, 2, 1]
// Shortcuts:
// array:  [...arr].reverse()         (copy first: reverse() changes the original)
// string: s.split("").reverse().join("")
```

- **Real question:** `reverseWithLoop`, `backwards`, `reverseStr`, `reverseWords`.
- **Say it:** "I start at the last index, `length - 1`, and count down to 0. O(n)."
- **Trap:** starting at `arr.length` (that index doesn't exist) or using `i > 0` (skips index 0).

---

### Pattern 9: Swap and Rotate (The Musical Chairs)

- **Trigger:** "swap", "rotate left/right by k", "shift", "move first to last".
- **Picture:** musical chairs. Everybody moves along, and the person at the end wraps to the front.

```javascript
function swapFirstLast(nums) {
  if (nums.length < 2) return [...nums];     // guard: nothing to swap
  const copy = [...nums];
  const last = copy.length - 1;
  [copy[0], copy[last]] = [copy[last], copy[0]];   // destructuring swap
  return copy;
}

function rotateLeft(arr, k) {
  if (arr.length === 0) return [];
  const steps = k % arr.length;              // rotating by length = no change
  return arr.slice(steps).concat(arr.slice(0, steps));
}

console.log(swapFirstLast([1, 2, 3, 4]));   // [4, 2, 3, 1]
console.log(rotateLeft([1, 2, 3, 4, 5], 2)); // [3, 4, 5, 1, 2]
```

- **Real question:** `swapFirstLast`, `rotateLeft`, `areSimilar` (one swap allowed).
- **Say it:** "I copy the array, then swap with destructuring. For rotation, the back part goes first and the front part goes after, using `slice`."
- **Traps:** an empty array has no index 0, which is why the guard `if` is needed · `k` larger than the length, fixed with `% arr.length` · the old 3-variable swap needs a `temp`: `const temp = a[i]; a[i] = a[j]; a[j] = temp;`.

---

## Group C: Rearranging

### Pattern 10: Buckets / Partition (The Sorting Bins)

- **Trigger:** "group by", "X first then Y", "move zeros to the end", "negatives / zeros / positives", "keep the order inside each group".
- **Picture:** recycling bins. Walk once, drop each item in the right bin, then line the bins up.

```javascript
// 3 bins, ONE loop with if / else if / else
function groupBySign(nums) {
  const negatives = [];
  const zeros = [];
  const positives = [];
  for (const num of nums) {
    if (num < 0) negatives.push(num);
    else if (num === 0) zeros.push(num);
    else positives.push(num);
  }
  return [negatives, zeros, positives];      // array of 3 arrays
}

// 2 bins, then JOIN them into one flat result
function moveLettersToFront(s) {
  let letters = "";
  let digits = "";
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") digits += ch;
    else letters += ch;
  }
  return letters + digits;
}

function moveZerosToEnd(nums) {
  const nonZeros = nums.filter(n => n !== 0);
  const zeros = nums.filter(n => n === 0);
  return [...nonZeros, ...zeros];            // spread = flatten bins into one array
}

console.log(groupBySign([1, -2, 0, 3, 0, -4]));  // [[-2,-4],[0,0],[1,3]]
console.log(moveLettersToFront("a1b2c3"));       // "abc123"
console.log(moveZerosToEnd([0, 1, 0, 3, 12]));   // [1, 3, 12, 0, 0]
```

| Want the result as... | Write |
|---|---|
| bins kept separate | `return [binA, binB];` → `[[...], [...]]` |
| one flat array | `return [...binA, ...binB];` or `binA.concat(binB)` |
| one string | `return textA + textB;` or `[...binA, ...binB].join("")` |

- **Real question:** `groupBySign`, `moveLettersToFront`, `moveZerosToEnd`, `evensThenOdds`, `negativesFirst`.
- **Say it:** "I make one bin per group, walk once dropping each item in its bin, then join the bins in the required order. Order inside each bin is kept. O(n)."
- **Traps:** writing 3 separate loops (works, but one loop with `else if` is cleaner) · `return list.push(a, b, c)` returns a **number** · `[letters, digits]` when a flat result was wanted.

---

### Pattern 11: Interleave Two Arrays (The Zipper)

- **Trigger:** "alternate items from two arrays", "merge", "zip", "pair up".
- **Picture:** a zipper. One tooth from the left, one from the right, repeat.

```javascript
function interleave(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result.push(a[i], b[i]);        // push can take several items
  }
  return result;
}

// Different lengths: loop to the longer one and check each side
function interleaveAny(a, b) {
  const result = [];
  const longest = Math.max(a.length, b.length);
  for (let i = 0; i < longest; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}

console.log(interleave([1, 3, 5], [2, 4, 6]));  // [1, 2, 3, 4, 5, 6]
console.log(interleaveAny([1, 2], ["a"]));      // [1, "a", 2]
```

- **Real question:** `interleave`, `combine`.
- **Say it:** "Both arrays share the same index, so one counting loop picks `a[i]` then `b[i]`. O(n)."
- **Trap:** `for...of` gives the item but not the index, and this pattern needs the index to reach the second array.

---

## Group D: Lookup Patterns (Objects, Maps, Sets)

> [!NOTE]
> These are the **O(n) weapons**. Whenever a first idea uses **two nested loops** to "check whether this was seen before", a Set or an object usually turns it into one loop.

### Pattern 12: Tally Counter (The Clipboard)

- **Trigger:** "how many times each", "most frequent", "anagram", "can you build X from Y", "appears once".
- **Picture:** a clipboard tally sheet. Each time a name is called, add a tick next to it.

```javascript
// Template: count everything
function countItems(items) {
  const count = {};
  for (const item of items) {
    count[item] = (count[item] || 0) + 1;    // first time: 0 + 1
  }
  return count;
}

// Tally + Champion: most frequent
function mostFrequent(nums) {
  const count = {};
  for (const n of nums) count[n] = (count[n] || 0) + 1;

  let bestKey = null;
  let bestCount = 0;
  for (const key in count) {                 // for...in walks object KEYS
    if (count[key] > bestCount) {
      bestCount = count[key];
      bestKey = key;
    }
  }
  return Number(bestKey);                    // object keys are always STRINGS
}

// Tally + spend: can I build the note from the magazine letters?
function canFormNote(note, magazine) {
  const available = {};
  for (const ch of magazine) available[ch] = (available[ch] || 0) + 1;
  for (const ch of note) {
    if (!available[ch]) return false;        // 0 or undefined -> missing
    available[ch]--;                         // use one up
  }
  return true;
}

// Anagram: same letters, same counts. Short way: sort both and compare.
function isAnagram(a, b) {
  const clean = s => s.toLowerCase().split("").sort().join("");
  return clean(a) === clean(b);
}

console.log(countItems(["cat", "dog", "cat"]));  // { cat: 2, dog: 1 }
console.log(mostFrequent([3, 1, 3, 2, 3, 1]));   // 3
console.log(canFormNote("aab", "baa"));          // true
console.log(isAnagram("Listen", "Silent"));      // true
```

**Same thing with a `Map`** (keys keep their type, so numbers stay numbers):

```javascript
const count = new Map();
for (const n of [3, 1, 3]) {
  count.set(n, (count.get(n) || 0) + 1);
}
console.log(count.get(3));   // 2
console.log(count.has(7));   // false
```

- **Real question:** `countLetters`, `countWords`, `mostFrequent`, `canFormNote`, `isAnagram`, `commonCharacterCount`, `firstUniqueLetter`, `appearsOnce`, `mostCommonFirstLetter`.
- **Say it:** "I build a frequency object in one pass, so each lookup is instant. Then I read the answer from the counts. O(n) time, O(k) space for k distinct items."
- **Traps:** `count.item` (the literal word "item") instead of `count[item]` · forgetting that object keys come back as strings (`"3"`, not `3`) · `count[item]++` on a missing key gives `NaN`.

---

### Pattern 13: Seen Set (The Guest List)

- **Trigger:** "duplicate", "unique", "distinct", "first repeated", "in both", "only in the first".
- **Picture:** a bouncer with a guest list. "Have I already let you in?" is answered instantly.

```javascript
// First item that appears a second time
function firstDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return n;    // already on the list
    seen.add(n);
  }
  return -1;
}

// Remove duplicates, keep first-seen order
const unique = arr => [...new Set(arr)];

// In both arrays (intersection), no duplicates
function inBoth(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter(x => setB.has(x));
}

// Only in the first (difference)
function onlyInFirst(a, b) {
  const setB = new Set(b);
  return a.filter(x => !setB.has(x));
}

console.log(firstDuplicate([2, 1, 3, 5, 3, 2]));  // 3
console.log(unique([1, 2, 2, 3, 1]));             // [1, 2, 3]
console.log(inBoth([1, 2, 2, 3], [2, 3, 4]));     // [2, 3]
console.log(onlyInFirst([1, 2, 3], [2]));         // [1, 3]
```

- **Real question:** `hasDuplicate`, `firstRepeated`, `firstDuplicate`, `removeDuplicates`, `removeDuplicatesKeepOrder`, `distinctCount`, `inBoth`, `onlyInFirst`, `commonElements`, `differentSquares`.
- **Say it:** "A Set checks membership in constant time, so instead of a nested loop I check `seen.has` as I go. O(n) instead of O(n²)."
- **Traps:** `set.length` (wrong, it's `set.size`) · `set[0]` (Sets have no index, so spread to an array first) · Sets compare arrays by **reference**, so turn small arrays into strings first (`"1,2"`).

---

### Pattern 14: Look-Back Map (The Memory Notebook)

- **Trigger:** "pair that adds up to target", "how many pairs", "same value within k positions".
- **Picture:** a notebook. For each new person, look back in the notebook for their partner, then write their own name down.

```javascript
// Count pairs i < j with nums[i] + nums[j] === target
function countPairsWithSum(nums, target) {
  const seenCount = {};
  let pairs = 0;
  for (const x of nums) {
    const partner = target - x;               // who completes me?
    if (seenCount[partner]) pairs += seenCount[partner];
    seenCount[x] = (seenCount[x] || 0) + 1;   // write myself down AFTER checking
  }
  return pairs;
}

// Same value again within k steps?
function containsCloseDuplicates(nums, k) {
  const lastSeen = new Map();                 // value -> last index
  for (let i = 0; i < nums.length; i++) {
    if (lastSeen.has(nums[i]) && i - lastSeen.get(nums[i]) <= k) return true;
    lastSeen.set(nums[i], i);
  }
  return false;
}

console.log(countPairsWithSum([1, 5, 7, -1, 5], 6));    // 3
console.log(containsCloseDuplicates([1, 2, 3, 1], 3));  // true
```

- **Real question:** `countPairsWithSum`, `containsCloseDuplicates`, Two Sum.
- **Say it:** "For each number I ask: have I already seen its partner `target - x`? A map answers instantly, so it's one pass, O(n)."
- **Trap:** adding the current item **before** checking, which pairs an item with itself.

---

## Group E: Smart Walking

### Pattern 15: Two Pointers from Both Ends (The Bridge)

- **Trigger:** "palindrome", "reverse in place", "pair in a **sorted** array".
- **Picture:** two people walking toward each other from opposite ends of a bridge.

```javascript
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

// Sorted array: is there a pair adding up to target?
function hasPairSorted(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return true;
    if (sum < target) left++;      // need bigger -> move left up
    else right--;                  // need smaller -> move right down
  }
  return false;
}

console.log(isPalindrome("radar"));              // true
console.log(hasPairSorted([1, 2, 4, 7, 11], 9)); // true (2 + 7)
```

- **Real question:** `isPalindrome`, `checkPalindrome`.
- **Say it:** "One pointer at each end, moving inward. That's O(n) time with O(1) extra space."
- **Trap:** `while (left <= right)` is fine, but `right = s.length` (no `- 1`) reads past the end.

---

### Pattern 16: Two Pointers Across Two Arrays (The Two Queues)

- **Trigger:** "two sorted lists", "closest pair between", "merge two sorted".
- **Picture:** two queues. Always serve the person with the smaller ticket, then that queue moves forward.

```javascript
function smallestDifference(a, b) {
  const A = [...a].sort((x, y) => x - y);
  const B = [...b].sort((x, y) => x - y);
  let i = 0;
  let j = 0;
  let best = Infinity;
  while (i < A.length && j < B.length) {
    best = Math.min(best, Math.abs(A[i] - B[j]));
    if (A[i] < B[j]) i++;       // move the smaller one forward
    else j++;
  }
  return best;
}

console.log(smallestDifference([1, 3, 15, 11, 2], [23, 127, 235, 19, 8]));  // 3
```

- **Real question:** `smallestDifference`.
- **Say it:** "After sorting both, I walk them together and always step the smaller side, because that's the only move that can shrink the gap. O(n log n) for sorting."
- **Trap:** sorting numbers without `(x, y) => x - y`.

---

### Pattern 17: Sliding Window (The Moving Frame)

- **Trigger:** "subarray of size k", "k consecutive", "window".
- **Picture:** a picture frame sliding along a wall. One item enters on the right, one leaves on the left.

```javascript
function maxSubarraySumK(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];   // first frame
  let best = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];   // add new right, drop old left
    best = Math.max(best, windowSum);
  }
  return best;
}

console.log(maxSubarraySumK([2, 1, 5, 1, 3, 2], 3));  // 9
```

- **Real question:** `maxSubarraySumK`, `longestEqualSubarray` (mock).
- **Say it:** "Instead of re-adding k items for every window, I add the new item and subtract the one that left. O(n) instead of O(n·k)."
- **Trap:** the item leaving is `nums[i - k]`, not `nums[i - 1]`.

---

### Pattern 18: Running Sum / Prefix Sum (The Scale)

- **Trigger:** "left sum equals right sum", "balance index", "sum of each item with its neighbours".
- **Picture:** a balance scale. Know the total weight, track the left side; the right side is whatever is left over.

```javascript
function equalSplitIndex(nums) {
  const total = nums.reduce((sum, x) => sum + x, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    const rightSum = total - leftSum - nums[i];
    if (leftSum === rightSum) return i;
    leftSum += nums[i];                 // update AFTER checking
  }
  return -1;
}

// Each item plus its neighbours, 0 when off the edge
function neighborSumArray(a) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    const left = i > 0 ? a[i - 1] : 0;
    const right = i < a.length - 1 ? a[i + 1] : 0;
    result.push(left + a[i] + right);
  }
  return result;
}

console.log(equalSplitIndex([1, 7, 3, 6, 5, 6]));  // 3
console.log(neighborSumArray([4, 0, 1, -2, 3]));   // [4, 5, -1, 2, 1]
```

- **Real question:** `equalSplitIndex`, `neighborSumArray`, `isLucky` (first half vs second half).
- **Say it:** "I compute the total once, then keep a running left sum. The right sum is `total - left - current`, so each check is instant. O(n)."
- **Trap:** updating `leftSum` before the check (the current item would count on both sides).

---

## Group F: Numbers, Strings and Stacks

### Pattern 19: Digit Peeling (Peeling an Onion)

- **Trigger:** "digits of n", "sum of digits", "reverse the number", "how many digits divide n".
- **Picture:** peel the last layer (`% 10`), then throw it away (`Math.floor(n / 10)`).

```javascript
function sumDigits(n) {
  let sum = 0;
  while (n > 0) {
    sum += n % 10;               // last digit
    n = Math.floor(n / 10);      // remove last digit
  }
  return sum;
}

function reverseNumber(n) {
  let reversed = 0;
  while (n > 0) {
    reversed = reversed * 10 + (n % 10);  // shift left, add digit
    n = Math.floor(n / 10);
  }
  return reversed;
}

// The string way is often simpler
function countDigitsDivisible(n) {
  let count = 0;
  for (const ch of String(n)) {
    const digit = Number(ch);
    if (digit !== 0 && n % digit === 0) count++;   // never divide by 0
  }
  return count;
}

console.log(sumDigits(1234));             // 10
console.log(reverseNumber(1234));         // 4321
console.log(countDigitsDivisible(1012));  // 3
```

- **Real question:** `sumDigitsWithWhile`, `reverseNumberMath`, `reverseNumber`, `countDigitsDivisible`, `isLucky`, `countDigits`.
- **Say it:** "`n % 10` gives the last digit and `Math.floor(n / 10)` removes it. I repeat until n is 0. The loop runs once per digit."
- **Traps:** `n / 10` without `Math.floor` gives decimals and never reaches exactly 0 · a digit of `0` used as a divisor.

---

### Pattern 20: Character Check and String Building (The Sorting Office)

- **Trigger:** "letters", "digits", "vowels", "uppercase", "remove characters", "first unique letter".
- **Picture:** a post office. Look at each letter's stamp and send it to the right pile.

```javascript
const isDigit  = ch => ch >= "0" && ch <= "9";
const isLetter = ch => ch.toLowerCase() !== ch.toUpperCase();   // only letters have two cases
const isVowel  = ch => "aeiou".includes(ch.toLowerCase());
const isUpper  = ch => ch !== ch.toLowerCase();

function disemvowel(s) {
  let result = "";
  for (const ch of s) {
    if (!isVowel(ch)) result += ch;   // build a NEW string
  }
  return result;
}

console.log(isDigit("7"), isLetter("b"), isLetter("3"));  // true true false
console.log(disemvowel("This website is for losers"));     // "Ths wbst s fr lsrs"
// Regex shortcut (good to recognise): s.replace(/[aeiou]/gi, "")
```

- **Real question:** `countVowels`, `onlyLetters`, `countDigits`, `firstDigit`, `disemvowel`, `getCount`, `swapLetter`, `moveLettersToFront`.
- **Say it:** "I walk the characters once, classify each one, and build a new string, because strings can't be changed in place. O(n)."
- **Traps:** `ch.isLetter()` and `ch.isDigit()` **do not exist** in JavaScript · `s[0] = "X"` silently does nothing (strings are immutable).

---

### Pattern 21: Stack (The Pile of Plates)

- **Trigger:** "parentheses", "brackets balanced", "nested", "innermost first", "undo".
- **Picture:** a pile of plates. You can only add to or take from the **top** (`push` / `pop`). The last one in is the first one out.

```javascript
function isValidBrackets(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;          // nothing left open
}

// Reverse text inside each ( ), innermost first
function reverseInParentheses(s) {
  const stack = [];
  let current = "";
  for (const ch of s) {
    if (ch === "(") {
      stack.push(current);            // save the outside text
      current = "";
    } else if (ch === ")") {
      current = stack.pop() + current.split("").reverse().join("");
    } else {
      current += ch;
    }
  }
  return current;
}

console.log(isValidBrackets("({[]})"), isValidBrackets("(]"));  // true false
console.log(reverseInParentheses("foo(bar(baz))blim"));         // "foobazrabblim"
```

- **Real question:** `reverseInParentheses`, valid brackets (a classic Codewars / interview question).
- **Say it:** "Nested structure means the most recent opening must close first, which is exactly what a stack does. One pass, O(n)."
- **Trap:** forgetting the final check `stack.length === 0` (`"(("` would wrongly pass).

---

### Pattern 22: Simulation While Loop (The Countdown)

- **Trigger:** "how many years until", "how many steps until", "keep halving until".
- **Picture:** a countdown. Repeat the same step and count rounds until the condition is met.

```javascript
function depositProfit(deposit, rate, threshold) {
  let years = 0;
  let money = deposit;
  while (money < threshold) {         // keep going WHILE not there yet
    money += money * (rate / 100);
    years++;
  }
  return years;
}

function countHalvings(n) {
  let steps = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }
  return steps;
}

console.log(depositProfit(100, 20, 170));  // 3
console.log(countHalvings(16));            // 4
```

- **Real question:** `depositProfit`, `yearsToGrow`, `growthInYears`, `countHalvings`.
- **Say it:** "I don't know the number of rounds in advance, so I use a `while` loop that repeats the step and counts until the condition is reached."
- **Traps:** forgetting to change the variable inside the loop (an infinite loop) · writing the condition the wrong way round (`while` is "keep going while…", not "stop when…").

---

### Pattern 23: Math Shortcut (The Calculator)

- **Trigger:** "century", "area of the n-th shape", "sum from 1 to n", "leap year".
- **Picture:** don't count sheep one by one if a calculator gives the answer instantly.

```javascript
const century   = year => Math.ceil(year / 100);           // 1905 -> 20, 2000 -> 20
const shapeArea = n => n * n + (n - 1) * (n - 1);          // 1, 5, 13, 25...
const sumTo     = n => (n * (n + 1)) / 2;                  // 1 + 2 + ... + n
const isLeap    = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

console.log(century(1905), shapeArea(3), sumTo(10), isLeap(1900));  // 20 13 55 false
```

- **Real question:** `century`, `centuryFromYear`, `shapeArea`, `isLeap`, `isLeapYear`, `sumOdd`.
- **Say it:** "There's a direct formula, so this is O(1). Then I check it against the examples."
- **Trap:** `Math.round` instead of `Math.ceil` for century (1901 should be 20, not 19).

---

## Group G: Grids (2D Arrays)

> **Grid basics:** `grid[row][col]`. Rows = `grid.length`. Columns = `grid[0].length`. Row first, column second, like reading a book: line, then position in the line.

### Pattern 24: Grid Walk (Reading a Book)

- **Trigger:** "matrix", "grid", "board", "every cell", "row sums".
- **Picture:** reading a book: each line left to right, then the next line down.

```javascript
function gridTotal(grid) {
  let total = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      total += grid[r][c];
    }
  }
  return total;
}

function rowSums(grid) {
  const sums = [];
  for (const row of grid) {
    let sum = 0;                       // reset for EACH row
    for (const value of row) sum += value;
    sums.push(sum);
  }
  return sums;
}

console.log(gridTotal([[1, 2], [3, 4]]));  // 10
console.log(rowSums([[1, 2], [3, 4]]));    // [3, 7]
```

- **Real question:** `gridTotal`, `biggestInGrid`, `countZeros`, `rowSums`, `flatten`, `mainDiagonal` (`grid[i][i]`).
- **Say it:** "Outer loop for rows, inner loop for columns, so every cell is visited once. O(rows × cols)."
- **Trap:** the per-row container goes **between** the two loops (reset each row), not outside both.

---

### Pattern 25: Neighbour Directions (The Compass)

- **Trigger:** "neighbours", "surrounding cells", "mines around", "adjacent cells".
- **Picture:** a compass with 8 arrows. Try each arrow, but **don't step off the map**.

```javascript
const DIRS_8 = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];
// 4 directions (up, down, left, right): [[-1,0],[1,0],[0,-1],[0,1]]

function minesweeper(board) {
  const rows = board.length;
  const cols = board[0].length;
  const result = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      let mines = 0;
      for (const [dr, dc] of DIRS_8) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc]) mines++;
      }
      row.push(mines);
    }
    result.push(row);
  }
  return result;
}

console.log(minesweeper([[true, false], [false, false]]));  // [[0,1],[1,1]]
```

- **Real question:** `minesweeper`, `neighbourSum`, `countNeighbourMines`, `isEdgeCell`, `battleships` (mock).
- **Say it:** "For each cell I try the 8 direction offsets, skip any that fall outside the grid, and count. O(rows × cols × 8), which is still O(rows × cols)."
- **Trap:** checking `board[nr][nc]` **before** the bounds check. `board[-1]` is `undefined`, and `undefined[0]` crashes.

---

### Pattern 26: Column-First Walk (The Elevator)

- **Trigger:** "column", "below it", "above it", "vertical", "per column".
- **Picture:** an elevator. Go down one shaft (column) floor by floor, then move to the next shaft.

```javascript
// Rooms below a 0 (haunted) don't count
function matrixElementsSum(matrix) {
  let total = 0;
  for (let c = 0; c < matrix[0].length; c++) {   // columns OUTSIDE
    for (let r = 0; r < matrix.length; r++) {    // rows INSIDE
      if (matrix[r][c] === 0) break;             // stop this column only
      total += matrix[r][c];
    }
  }
  return total;
}

console.log(matrixElementsSum([[0, 1, 1, 2], [0, 5, 0, 0], [2, 0, 3, 3]]));  // 9
```

- **Real question:** `matrixElementsSum`, `getColumn`, `columnSums`.
- **Say it:** "The rule is about what's below a cell, so I walk each column top to bottom and `break` at the first 0. `break` only exits the inner loop."
- **Trap:** using the normal row-first order makes "everything below" very hard to track.

---

### Pattern 27: Build a New Grid (The Photocopier)

- **Trigger:** "rotate 90°", "transpose", "add a border", "create an n × m grid".
- **Picture:** a photocopier. Build a fresh page and write each cell to its new spot.

```javascript
// Create an empty grid SAFELY
const makeGrid = (rows, cols, value) =>
  Array.from({ length: rows }, () => new Array(cols).fill(value));

// Transpose: rows become columns -> new[c][r] = old[r][c]
function transpose(grid) {
  const result = makeGrid(grid[0].length, grid.length, 0);
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      result[c][r] = grid[r][c];
    }
  }
  return result;
}

// Rotate clockwise: new row c = old column c read from the BOTTOM up
function rotateImage(grid) {
  const n = grid.length;
  const result = [];
  for (let c = 0; c < n; c++) {
    const newRow = [];
    for (let r = n - 1; r >= 0; r--) newRow.push(grid[r][c]);
    result.push(newRow);
  }
  return result;
}

function addBorder(picture) {
  const line = "*".repeat(picture[0].length + 2);
  return [line, ...picture.map(row => "*" + row + "*"), line];
}

console.log(transpose([[1, 2, 3], [4, 5, 6]]));  // [[1,4],[2,5],[3,6]]
console.log(rotateImage([[1, 2], [3, 4]]));      // [[3,1],[4,2]]
console.log(addBorder(["abc", "ded"]));          // ["*****","*abc*","*ded*","*****"]
```

- **Real question:** `makeGrid`, `identity`, `transpose`, `rotateImage`, `addBorder`.
- **Say it:** "I build a new grid of the right size and work out where each old cell lands. For a clockwise rotation, new row `c` is old column `c` read from bottom to top."
- **Trap:** `new Array(3).fill([])` puts the **same** inner array in every row, so changing one row changes all of them. Use `Array.from({ length }, () => [...])`.

---

### Pattern 28: Spiral / Shrinking Boundaries (Peeling an Orange)

- **Trigger:** "spiral", "clockwise from the top-left", "layer by layer".
- **Picture:** peeling an orange in rings. After each side, that wall moves inward.

```javascript
function spiralNumbers(n) {
  const grid = Array.from({ length: n }, () => new Array(n).fill(0));
  let top = 0, bottom = n - 1, left = 0, right = n - 1;
  let num = 1;
  while (num <= n * n) {
    for (let c = left; c <= right; c++) grid[top][c] = num++;      // → along top
    top++;
    for (let r = top; r <= bottom; r++) grid[r][right] = num++;    // ↓ down right side
    right--;
    for (let c = right; c >= left; c--) grid[bottom][c] = num++;   // ← along bottom
    bottom--;
    for (let r = bottom; r >= top; r--) grid[r][left] = num++;     // ↑ up left side
    left++;
  }
  return grid;
}

console.log(spiralNumbers(3));  // [[1,2,3],[8,9,4],[7,6,5]]
```

- **Real question:** `spiralNumbers`.
- **Say it:** "I keep four walls: top, bottom, left, right. I fill one side, then move that wall inward, until every number is placed. O(n²)."
- **Trap:** forgetting to move a wall after its side is filled, which overwrites cells.

---

## Group H: Sorting

### Pattern 29: Sort Then Process (Lining Up by Height)

- **Trigger:** "sorted", "in order", "rank", "closest", "keep the -1s in place".
- **Picture:** ask everyone to line up by height first. Many questions become easy once things are in order.

```javascript
const ascending  = arr => [...arr].sort((a, b) => a - b);   // copy, then sort numbers
const descending = arr => [...arr].sort((a, b) => b - a);

// Sort by length, then A→Z for ties
const byLengthThenAlpha = words =>
  [...words].sort((a, b) => a.length - b.length || a.localeCompare(b));

// Sort the people, leave trees (-1) where they are
function sortByHeight(a) {
  const people = a.filter(x => x !== -1).sort((x, y) => x - y);
  let next = 0;
  return a.map(x => (x === -1 ? -1 : people[next++]));
}

function sortedSquares(nums) {
  return nums.map(x => x * x).sort((a, b) => a - b);
}

console.log(ascending([10, 9, 1]));                                  // [1, 9, 10]
console.log(byLengthThenAlpha(["bb", "a", "ab"]));                   // ["a", "ab", "bb"]
console.log(sortByHeight([-1, 150, 190, 170, -1, -1, 160, 180]));    // [-1,150,160,170,-1,-1,180,190]
console.log(sortedSquares([-4, -1, 0, 3]));                          // [0, 1, 9, 16]
```

**How the comparator works:** `(a, b) => result`
- result **negative** → `a` goes first
- result **positive** → `b` goes first
- result **0** → keep their order

- **Real question:** `sortNumbers`, `fixSortAscending`, `sortedSquares`, `sortByHeight`, `smallestDifference`, `makeArrayConsecutive2`.
- **Say it:** "Sorting first makes the next step simple. The sort is O(n log n), and the walk after it is O(n)."
- **Traps:** `.sort()` with no comparator sorts as **text**: `[10, 9, 1].sort()` → `[1, 10, 9]` · `.sort()` **changes the original**, so copy with `[...arr]` first.

---

## Part 4: Choosing a Loop Style

| Loop | Use when | Example |
|---|---|---|
| `for (const x of arr)` | only the **items** are needed (most of the time) | sum, filter, count |
| `for (let i = 0; i < arr.length; i++)` | the **index** is needed, neighbours (`i + 1`), two arrays, or stepping by 2 | adjacent pairs, interleave |
| `for (let i = arr.length - 1; i >= 0; i--)` | **backwards** | reverse |
| `for (const key in obj)` | walking an **object's keys** | reading a tally |
| `while (condition)` | the number of rounds is **unknown** | digits, simulation, two pointers |
| `for (const [key, value] of Object.entries(obj))` | an object's keys **and** values | find the key with the biggest value |
| `for (const [key, value] of map)` | a Map's keys and values | reading a Map tally |

```javascript
for (const color of ["red", "green", "blue"]) {
  console.log(color);
}

for (const [name, age] of Object.entries({ Ama: 20, Kofi: 25 })) {
  console.log(name, age);
}
```

---

## Part 5: Loops to Methods Bridge

Once the loop patterns are clear, many loops become one line.

| Tool | Picture | In → Out | Loop pattern it replaces |
|---|---|---|---|
| `.map(x => new)` | assembly line | n items → **n items** | Transformer |
| `.filter(x => test)` | bouncer | n items → **fewer items** | Filter |
| `.reduce((acc, x) => newAcc, start)` | blender | n items → **1 value** | Accumulator |
| `.find(x => test)` | detective | → **first item** or `undefined` | Early-exit (item) |
| `.findIndex(x => test)` | detective | → **first index** or `-1` | Early-exit (index) |
| `.some(x => test)` | "anyone?" | → `true` / `false` | Early-exit (any) |
| `.every(x => test)` | "everyone?" | → `true` / `false` | Early-exit (all) |
| `.includes(x)` | guest list | → `true` / `false` | Search for a value |
| `.forEach(x => ...)` | just visiting | → **`undefined`** | a loop with no result |

```javascript
const nums = [1, 2, 3, 4];

console.log(nums.map(x => x * 2));                 // [2, 4, 6, 8]
console.log(nums.filter(x => x % 2 === 0));        // [2, 4]
console.log(nums.reduce((total, x) => total + x, 0)); // 10
console.log(nums.find(x => x > 2));                // 3
console.log(nums.findIndex(x => x > 2));           // 2
console.log(nums.some(x => x > 3));                // true
console.log(nums.every(x => x > 0));               // true

// reduce with an object start value = Tally pattern
const tally = ["a", "b", "a"].reduce((acc, ch) => {
  acc[ch] = (acc[ch] || 0) + 1;
  return acc;                                      // MUST return acc
}, {});
console.log(tally);                                // { a: 2, b: 1 }
```

**Reading `reduce`:** `(total, x) => total + x, 0`
1. `total` is the running bucket. It starts at the **second argument** (`0`).
2. `x` is the current item.
3. Whatever the arrow returns becomes the next `total`.

> [!NOTE]
> Interviewers often ask: *"Write it with a basic `for` loop first, then refactor it with array methods."* Knowing both makes you stand out.

---

## Part 6: Confusing Syntax, Side by Side

### Top 25 Traps (read daily)

| # | Wrong / confusing | Right | Why |
|---|---|---|---|
| 1 | `results = f()` | `const results = f();` | always declare with `let`/`const` |
| 2 | `for (item of s)` | `for (const item of s)` | the loop variable needs a declaration too |
| 3 | `const total = 0; total += 1;` | `let total = 0;` | `const` can't be reassigned (but a `const` array can still `push`) |
| 4 | `arr.lenght`, `arr.length()` | `arr.length` | a property: no parentheses, "th" at the end |
| 5 | `arr.include(x)` | `arr.includes(x)` | with an **s** |
| 6 | `"*" * 5` | `"*".repeat(5)` | `*` on text gives `NaN` |
| 7 | `n / 2 === 0` for even | `n % 2 === 0` | `%` = remainder, `/` = division |
| 8 | `n % 2 === 1` for odd | `n % 2 !== 0` | `-3 % 2` is `-1`, not `1` |
| 9 | `[10, 9, 1].sort()` | `.sort((a, b) => a - b)` | default sort compares **text** |
| 10 | `[1, 2] === [1, 2]` | compare item by item, or `JSON.stringify(a) === JSON.stringify(b)` | `===` checks whether they are the **same box**, not the same contents |
| 11 | `obj.key` when `key` is a variable | `obj[key]` | dot means the literal name "key" |
| 12 | `return list.push(x)` | `list.push(x); return list;` | `push` returns the new **length** |
| 13 | `return true` when the item was asked for | `return item` | read what the question returns |
| 14 | `return` inside the loop for "all items" | `return` after the loop | an inside `return` stops at round 1 |
| 15 | not-found case missing | `return -1` / `null` / `""` after the loop | every search needs a "nothing found" line |
| 16 | `x = x * 2` inside `for (let x of arr)` | `result.push(x * 2)` or `arr[i] = ...` | the loop variable is a copy |
| 17 | `ch.isLetter()`, `ch.isDigit()` | `ch >= "0" && ch <= "9"` | those methods don't exist in JS |
| 18 | `s[0] = "X"` | `s = "X" + s.slice(1)` | strings can't be changed in place |
| 19 | `Math.max(arr)` | `Math.max(...arr)` | needs the items spread out |
| 20 | `x => { x * 2 }` | `x => x * 2` or `x => { return x * 2; }` | braces need an explicit `return` |
| 21 | `age \|\| "unknown"` when age can be 0 | `age ?? "unknown"` | `0` is falsy, `??` only replaces `null`/`undefined` |
| 22 | `new Array(3).fill([])` | `Array.from({ length: 3 }, () => [])` | `fill` shares one inner array |
| 23 | `set.length`, `set[0]` | `set.size`, `[...set][0]` | Sets have size and no index |
| 24 | `i <= arr.length` | `i < arr.length` | the last index is `length - 1` |
| 25 | leftover test lines from old problems | delete them before running | they call functions that may not exist |

### Variables and Scope

| Thing | Meaning |
|---|---|
| `let` | can change later, block-scoped |
| `const` | can't be **reassigned**, but its array/object contents **can** change (`push`, `obj.x = 1`) |
| `var` | old style, function-scoped, avoid it |
| no keyword | creates an accidental global, a habit to break |

### Equality, Types and Truthiness

| Expression | Result | Note |
|---|---|---|
| `5 == "5"` | `true` | loose, converts types, avoid |
| `5 === "5"` | `false` | strict, always use this |
| `"5" + 3` | `"53"` | `+` with text → joins |
| `"5" - 3` | `2` | `-` converts to a number |
| `Number("12")` / `Number("12px")` | `12` / `NaN` | strict conversion |
| `parseInt("12px")` | `12` | reads digits until it stops |
| `Number("")` | `0` | surprise! |
| `NaN === NaN` | `false` | use `Number.isNaN(x)` |
| `typeof []` | `"object"` | use `Array.isArray(x)` |
| `typeof null` | `"object"` | a famous JS bug |
| Falsy values | `0, "", null, undefined, NaN, false` | everything else is truthy, **including `[]` and `{}`** |
| `a \|\| b` | `b` if `a` is falsy | `0 \|\| 5` → `5` |
| `a ?? b` | `b` only if `a` is `null`/`undefined` | `0 ?? 5` → `0` |

### Numbers and Math

| Expression | Result | Use |
|---|---|---|
| `7 / 2` | `3.5` | real division |
| `Math.floor(7 / 2)` | `3` | integer division (like Python `//`) |
| `7 % 2` | `1` | remainder |
| `Math.floor(-3.5)` / `Math.trunc(-3.5)` | `-4` / `-3` | floor goes **down**, trunc **chops** |
| `Math.ceil(19.01)` | `20` | round **up** (century) |
| `Math.round(2.5)` / `Math.round(-2.5)` | `3` / `-2` | rounds .5 toward +∞ |
| `Math.abs(-4)` | `4` | distance / difference |
| `(3.14159).toFixed(2)` | `"3.14"` | returns a **string** |
| `Infinity` / `-Infinity` | | starting value for min / max champions |

### Strings

| Method | Result | Note |
|---|---|---|
| `s.length` | number | property, no `()` |
| `s[0]`, `s[s.length - 1]`, `s.at(-1)` | first / last char | |
| `s.slice(1, 4)` | chars 1, 2, 3 | end is **not** included; negatives count from the end |
| `s.slice(-3)` | last 3 chars | |
| `s.substring(1, 4)` | like slice | but negatives become 0 |
| `s.split("")` / `s.split(" ")` | array of chars / words | |
| `arr.join("")` / `arr.join(" ")` | glue back into a string | `join()` with no argument uses commas |
| `s.toUpperCase()` / `s.toLowerCase()` | new string | needs `()` |
| `s.trim()` | removes outer spaces | |
| `s.includes("ab")`, `s.startsWith("a")`, `s.endsWith("z")` | boolean | |
| `s.indexOf("a")` | index or `-1` | |
| `s.replace("a", "b")` / `s.replaceAll("a", "b")` | first / all replaced | |
| `s.repeat(3)` | repeated | |
| `s.charCodeAt(0)` / `String.fromCharCode(97)` | `97` / `"a"` | letter maths |
| reverse a string | `s.split("").reverse().join("")` | strings have **no** `.reverse()` |
| `` `Hi ${name}` `` | template | **backticks**, not quotes |

### Arrays: Changes the Original vs Makes a Copy

| ⚠️ Changes the original | ✅ Safe (returns a new value) |
|---|---|
| `push`, `pop`, `shift`, `unshift` | `slice`, `concat`, `[...arr]` |
| `splice` | `map`, `filter`, `reduce` |
| `sort`, `reverse` | `join`, `includes`, `indexOf`, `find` |
| `fill` | `toSorted`, `toReversed` (newer JS) |

### Arrays: What Each Method Returns

| Call | Returns | Trap |
|---|---|---|
| `arr.push(x)` | new **length** | not the array |
| `arr.pop()` / `arr.shift()` | the removed item | |
| `arr.splice(i, n)` | array of the **removed** items | the original loses them |
| `arr.slice(i, j)` | copy of `i` up to (not including) `j` | original is safe |
| `arr.sort()` / `arr.reverse()` | the **same** (changed) array | |
| `arr.indexOf(x)` / `arr.findIndex(f)` | index or `-1` | |
| `arr.find(f)` | item or `undefined` | |
| `arr.includes(x)` | boolean | |
| `arr.forEach(f)` | `undefined` | never `return` a result from it |
| `arr.map(f)` | new array, same length | |
| `Math.max(...[])` | `-Infinity` | empty-array edge case |

**`slice` vs `splice` in one line:** **slice** = photocopy a part (original is safe) · **splice** = scissors (cuts the original).

### Objects, Maps and Sets

| Task | Object `{}` | Map | Set |
|---|---|---|---|
| create | `const o = {};` | `const m = new Map();` | `const s = new Set();` |
| add / set | `o[key] = v` | `m.set(key, v)` | `s.add(x)` |
| read | `o[key]` | `m.get(key)` | — |
| check | `key in o` / `o[key] !== undefined` | `m.has(key)` | `s.has(x)` |
| delete | `delete o[key]` | `m.delete(key)` | `s.delete(x)` |
| size | `Object.keys(o).length` | `m.size` | `s.size` |
| loop | `for (const k in o)` | `for (const [k, v] of m)` | `for (const x of s)` |
| key type | **always string** | any type | — |
| to array | `Object.keys(o)`, `Object.values(o)`, `Object.entries(o)` | `[...m]` | `[...s]` |

- `ages.name` → reads the key literally called `"name"`.
- `ages[name]` → reads the key stored **inside** the variable `name`.
- `for...of` on a plain object → **TypeError**. Use `for...in` or `Object.entries`.
- Copying: `const copy = { ...obj }` / `[...arr]`. Plain `=` only copies the **arrow**, not the box.

### Functions and Arrows

| Write | Means |
|---|---|
| `function add(a, b) { return a + b; }` | regular function |
| `const add = (a, b) => a + b;` | arrow, **implicit** return (no braces) |
| `const add = (a, b) => { return a + b; };` | arrow with braces → **must** write `return` |
| `x => x * 2` | one parameter, so no `()` needed |
| `() => ({ a: 1 })` | return an object: wrap it in `()` |
| `function greet(name = "friend")` | default parameter |
| `arr.map((item, index) => ...)` | callbacks also get the index |
| `cond ? a : b` | ternary: one-line `if/else` that **returns a value** |

### Loops

| Confusion | Rule |
|---|---|
| `for...of` vs `for...in` | **of** = values (arrays, strings) · **in** = keys (objects) |
| `break` vs `continue` vs `return` | `break` leaves the loop · `continue` skips to the next round · `return` leaves the whole **function** |
| `break` in nested loops | exits only the **inner** loop |
| loop to `length - 1` | only when reading `arr[i + 1]` |

---

## Part 7: Daily Self-Quiz

Answer out loud first, then open the answer.

<details><summary>1. "Return all words with the longest length." Which pattern(s)?</summary>

Champion (find the max length) + Filter (keep words with that length). Two passes, O(n).
</details>

<details><summary>2. What does <code>[1, 2, 3].push(4)</code> return?</summary>

`4`, the new length. Not the array.
</details>

<details><summary>3. Why start a champion at <code>arr[0]</code> instead of <code>0</code>?</summary>

With all-negative numbers like `[-5, -2]`, a start of `0` would wrongly win.
</details>

<details><summary>4. "Is there a duplicate?" in O(n). How?</summary>

Seen Set: `if (seen.has(x)) return true; seen.add(x);`, then `return false` after the loop.
</details>

<details><summary>5. What does <code>[10, 1, 5].sort()</code> give, and how is it fixed?</summary>

`[1, 10, 5]` (text order). Fix: `.sort((a, b) => a - b)`.
</details>

<details><summary>6. "Max sum of 3 consecutive numbers." Pattern?</summary>

Sliding Window: add `nums[i]`, subtract `nums[i - 3]`.
</details>

<details><summary>7. How are the last digit and the rest of a number obtained?</summary>

`n % 10` gives the last digit. `Math.floor(n / 10)` gives the rest.
</details>

<details><summary>8. "Reverse inside parentheses, innermost first." Pattern?</summary>

Stack: push the outside text on `(`, pop and attach the reversed inside text on `)`.
</details>

<details><summary>9. <code>slice</code> or <code>splice</code>: which one changes the original?</summary>

`splice` (scissors). `slice` is a photocopy.
</details>

<details><summary>10. In a grid, how do you avoid crashing when checking neighbours?</summary>

Check the bounds **first**: `nr >= 0 && nr < rows && nc >= 0 && nc < cols`, and only then read `grid[nr][nc]`.
</details>

<details><summary>11. <code>ages.name</code> vs <code>ages[name]</code>?</summary>

`ages.name` reads the key literally named "name". `ages[name]` reads the key held in the variable `name`.
</details>

<details><summary>12. "Letters first, then digits, keep the order." Pattern and return line?</summary>

Character Check + Buckets. Build `letters` and `digits` strings in one loop, then `return letters + digits;`.
</details>

<details><summary>13. What is wrong with <code>x =&gt; { x * 2 }</code>?</summary>

Braces mean a block, so nothing is returned (`undefined`). Use `x => x * 2`.
</details>

<details><summary>14. "Find a pair that adds up to the target" in one pass?</summary>

Look-Back Map: for each `x`, check whether `target - x` was already seen, then record `x`.
</details>

<details><summary>15. Say the 7-line approach script from memory.</summary>

Restate → Example → Pattern → Edge cases → Code while narrating → Trace → Cost (Big-O).
</details>

---

## Quick Reference Links

- Personal checklist: [1-personal-checklist.md](../00-start-here/1-personal-checklist.md)
- Common mistakes: [2-my-common-js-mistakes.md](../00-start-here/2-my-common-js-mistakes.md)
- Loops guide: [5-lesson-loops-and-functions.md](../01-foundations/5-lesson-loops-and-functions.md)
- Grid drills (this step): [2-drills-grids.js](2-drills-grids.js)
- Rearranging drills: [3-drills-list-rearranging.js](../02-strings-and-arrays/3-drills-list-rearranging.js)
- Lookup drills: [3-drills-dicts-sets.js](../03-objects-maps-sets/3-drills-dicts-sets.js)
- GCA practice: [0-guide-codesignal-javascript.md](../05-codesignal-gca/0-guide-codesignal-javascript.md)
