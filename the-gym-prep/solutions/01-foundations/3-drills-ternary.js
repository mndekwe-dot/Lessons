/**
 * SOLUTIONS — The Ternary Operator (? :)
 */

// 1.1 Return "even" if n is even, "odd" if odd. 4 -> "even", 7 -> "odd"
function evenOrOddTernary(n) {
  return n % 2 === 0 ? "even" : "odd";
}

// 1.2 Return "adult" if age >= 18, otherwise "minor". 20 -> "adult", 15 -> "minor"
function checkAgeTernary(age) {
  return age >= 18 ? "adult" : "minor";
}

// 1.3 Return "PASS" if score >= 50, otherwise "FAIL". 75 -> "PASS", 40 -> "FAIL"
function passOrFail(score) {
  return score >= 50 ? "PASS" : "FAIL";
}

// 1.4 Absolute value: if n is negative, return -n, else return n. -5 -> 5, 12 -> 12
function absoluteTernary(n) {
  return n < 0 ? -n : n;
}

// 2.1 Return the larger of two numbers. (10, 25) -> 25
function maxOfTwo(a, b) {
  return a > b ? a : b;
}

// 2.2 Return the smaller of two numbers. (10, 25) -> 10
function minOfTwo(a, b) {
  return a < b ? a : b;
}

// 3.1 Pluralize: 1 -> "1 item", 3 -> "3 items", 0 -> "0 items"
function pluralizeItem(count) {
  return count === 1 ? "1 item" : `${count} items`;
}

// 3.2 If name is empty string "", return "Guest", otherwise return name. "Ama" -> "Ama", "" -> "Guest"
function defaultName(name) {
  return name === "" ? "Guest" : name;
}

// 4.1 Return "positive", "negative", or "zero". 5 -> "positive", -3 -> "negative", 0 -> "zero"
function numberSign(n) {
  return n > 0 ? "positive" : n < 0 ? "negative" : "zero";
}

// 4.2 Grade: score >= 80 -> "A", score >= 60 -> "B", otherwise "F". 85 -> "A", 65 -> "B", 40 -> "F"
function letterGrade(score) {
  return score >= 80 ? "A" : score >= 60 ? "B" : "F";
}

// 5.1 Given array of numbers, return array of "EVEN" or "ODD" strings using .map() and ternary.
// [1, 2, 3] -> ["ODD", "EVEN", "ODD"]
function mapEvenOrOdd(arr) {
  return arr.map(n => n % 2 === 0 ? "EVEN" : "ODD");
}

// 5.2 Cap values at max 100: [40, 150, 80, 200] -> [40, 100, 80, 100] using .map() and ternary.
function clampMax100(arr) {
  return arr.map(n => n > 100 ? 100 : n);
}

module.exports = {
  evenOrOddTernary,
  checkAgeTernary,
  passOrFail,
  absoluteTernary,
  maxOfTwo,
  minOfTwo,
  pluralizeItem,
  defaultName,
  numberSign,
  letterGrade,
  mapEvenOrOdd,
  clampMax100
};

