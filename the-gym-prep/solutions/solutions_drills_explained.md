# Solutions & Explanations — The Gym JavaScript Drills

Every drill from [`drills_js_basics.js`](../01-foundations/2-drills-js-basics.js) and [`codewars_practice.js`](../06-the-gym-interview/3-codewars-practice.js) explained in simple teaching English with line-by-line notes.

---

## Part 1: Solutions for `drills_js_basics.js`

### Section A: Numbers and Math

#### 1. `add(a, b)`
```javascript
// Add two numbers and return the sum
function add(a, b) {
  return a + b;
}
```

#### 2. `isEven(n)`
```javascript
// A number is even if dividing by 2 leaves a remainder of 0
function isEven(n) {
  return n % 2 === 0;
}
```

#### 3. `intDivide(a, b)`
```javascript
// Math.floor rounds down to the nearest whole integer (like Python a // b)
function intDivide(a, b) {
  return Math.floor(a / b);
}
```

#### 4. `opposite(n)`
```javascript
// Negating a number turns positive to negative, and negative to positive
function opposite(n) {
  return -n;
}
```

#### 5. `maxOfThree(a, b, c)`
```javascript
// Math.max returns the largest argument
function maxOfThree(a, b, c) {
  return Math.max(a, b, c);
}
```

---

### Section B: Strings

#### 6. `firstChar(s)`
```javascript
// Index 0 is the first character
function firstChar(s) {
  return s[0];
}
```

#### 7. `lastChar(s)`
```javascript
// s[s.length - 1] gets the last character (or s.at(-1))
function lastChar(s) {
  return s[s.length - 1];
}
```

#### 8. `shout(s)`
```javascript
// .toUpperCase() converts all letters to uppercase
function shout(s) {
  return s.toUpperCase();
}
```

#### 9. `trimSpaces(s)`
```javascript
// .trim() removes spaces from both ends
function trimSpaces(s) {
  return s.trim();
}
```

#### 10. `reverseStr(s)`
```javascript
// Split string to array -> reverse array -> join back to string
function reverseStr(s) {
  return s.split("").reverse().join("");
}
```

#### 11. `startsWithVowel(s)`
```javascript
// Check if the lowercase first letter is included in "aeiou"
function startsWithVowel(s) {
  const first = s[0].toLowerCase();
  return "aeiou".includes(first);
}
```

---

### Section C: Arrays

#### 12. `getLength(arr)`
```javascript
// .length gives the number of elements
function getLength(arr) {
  return arr.length;
}
```

#### 13. `addToEnd(arr, x)`
```javascript
// .push(x) adds x to the end of arr, then return arr
function addToEnd(arr, x) {
  arr.push(x);
  return arr;
}
```

#### 14. `withoutLast(arr)`
```javascript
// .slice(0, -1) returns a copy without the last item
function withoutLast(arr) {
  return arr.slice(0, -1);
}
```

#### 15. `sumArray(arr)`
```javascript
// Accumulator pattern: add every number to total
function sumArray(arr) {
  let total = 0;
  for (const x of arr) {
    total += x;
  }
  return total;
}
```

#### 16. `doubleAll(arr)`
```javascript
// .map() multiplies every item by 2 and returns a new array
function doubleAll(arr) {
  return arr.map((x) => x * 2);
}
```

#### 17. `onlyPositives(arr)`
```javascript
// .filter() keeps numbers greater than 0
function onlyPositives(arr) {
  return arr.filter((x) => x > 0);
}
```

#### 18. `findSmallest(arr)`
```javascript
// Math.min with the spread operator (...) finds the smallest item
function findSmallest(arr) {
  return Math.min(...arr);
}
```

#### 19. `sortNumbers(arr)`
```javascript
// Always provide a comparison function (a, b) => a - b to sort numbers!
function sortNumbers(arr) {
  return arr.slice().sort((a, b) => a - b);
}
```

---

### Section D: Objects

#### 20. `getAge(person)`
```javascript
// Dot notation or bracket notation accesses the property
function getAge(person) {
  return person.age;
}
```

#### 21. `hasProperty(obj, key)`
```javascript
// The 'in' operator checks if key exists in object
function hasProperty(obj, key) {
  return key in obj;
}
```

#### 22. `getAllKeys(obj)`
```javascript
// Object.keys returns array of all property names
function getAllKeys(obj) {
  return Object.keys(obj);
}
```

#### 23. `getAllValues(obj)`
```javascript
// Object.values returns array of all values
function getAllValues(obj) {
  return Object.values(obj);
}
```

---

### Section E: Classic Interview Patterns

#### 24. `isPalindrome(s)`
```javascript
// Clean text and compare with its reversed version
function isPalindrome(s) {
  const clean = s.toLowerCase();
  const reversed = clean.split("").reverse().join("");
  return clean === reversed;
}
```

#### 25. `countVowels(s)`
```javascript
// Count characters that are vowels
function countVowels(s) {
  let count = 0;
  const vowels = "aeiouAEIOU";
  for (const char of s) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}
```

---

## Part 2: Solutions for `codewars_practice.js`

```javascript
// Kata 1: Multiply
function multiply(a, b) {
  return a * b;
}

// Kata 2: Even or Odd
function evenOrOdd(number) {
  return number % 2 === 0 ? "Even" : "Odd";
}

// Kata 3: Opposite number
function opposite(number) {
  return -number;
}

// Kata 4: Return Negative
function makeNegative(num) {
  return -Math.abs(num);
}

// Kata 5: Sum of positive
function positiveSum(arr) {
  let sum = 0;
  for (const x of arr) {
    if (x > 0) sum += x;
  }
  return sum;
}

// Kata 6: String repeat
function repeatStr(n, s) {
  return s.repeat(n);
}

// Kata 7: Remove First and Last Character
function removeChar(str) {
  return str.slice(1, -1);
}

// Kata 8: Square(n) Sum
function squareSum(numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n * n;
  }
  return total;
}

// Kata 9: Find the smallest integer in the array
function findSmallestInt(args) {
  return Math.min(...args);
}

// Kata 10: Vowel Count
function getCount(str) {
  let count = 0;
  for (const ch of str) {
    if ("aeiou".includes(ch)) count++;
  }
  return count;
}
```



---

## Part 3: Solutions for `drills_common_mistakes.js`

```javascript
// Mistake 1: Sort numbers ascending
function fixSortAscending(nums) {
  return nums.slice().sort((a, b) => a - b);
}

// Mistake 2: Sort numbers descending
function fixSortDescending(nums) {
  return nums.slice().sort((a, b) => b - a);
}

// Mistake 3: Numeric addition of string and number
function fixAddStringNumber(strNum, intNum) {
  return Number(strNum) + intNum;
}

// Mistake 4: Integer division
function fixIntegerDivision(a, b) {
  return Math.floor(a / b);
}

// Mistake 5: Pure append without mutating original
function fixPureAppend(arr, x) {
  return [...arr, x];
}

// Mistake 6: Check for any even number (don't exit on first odd!)
function fixContainsEven(nums) {
  for (const n of nums) {
    if (n % 2 === 0) return true;
  }
  return false;
}

// Mistake 7: Bracket notation for dynamic object keys
function fixDynamicAccess(obj, keyName) {
  return obj[keyName];
}

// Mistake 8: String length property (no parentheses)
function fixStringLength(str) {
  return str.length;
}
```

---

## Part 4: Solutions for `drills_objects_maps.js`

```javascript
// 1. Safe Property Lookup
function safeGet(obj, key, fallback = 0) {
  return key in obj ? obj[key] : fallback;
}

// 2. Character Frequency Counter
function countChars(str) {
  const counts = {};
  for (const ch of str) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}

// 3. Most Frequent Character
function mostFrequent(str) {
  const counts = countChars(str);
  let bestChar = "";
  let maxCount = 0;
  for (const [ch, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      bestChar = ch;
    }
  }
  return bestChar;
}

// 4. Merge Two Objects
function mergeObjects(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

// 5. Invert Keys and Values
function invertObj(obj) {
  const inverted = {};
  for (const [k, v] of Object.entries(obj)) {
    inverted[v] = k;
  }
  return inverted;
}

// 6. Remove Duplicates using Set
function uniqueItems(arr) {
  return [...new Set(arr)];
}

// 7. Common Items in Both Arrays
function commonItems(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((x) => set2.has(x));
}
```

---

## Part 5: Solutions for `mock_interview_test.js`

```javascript
// Challenge 1: Sum of Multiples
function sumOfMultiples(n, m) {
  if (n <= 0 || m <= 0 || n >= m) return 0;
  let total = 0;
  for (let i = n; i < m; i += n) {
    total += i;
  }
  return total;
}

// Challenge 2: Disemvowel Trolls
function disemvowel(str) {
  const vowels = "aeiouAEIOU";
  let result = "";
  for (const ch of str) {
    if (!vowels.includes(ch)) {
      result += ch;
    }
  }
  return result;
}
```
