/**
 * SOLUTIONS for q2_data_manipulation.js
 */

function allLongestStrings(words) {
  const maxLen = Math.max(...words.map(w => w.length));
  return words.filter(w => w.length === maxLen);
}

function addBorder(picture) {
  const width = picture[0].length + 2;
  const border = "*".repeat(width);
  const middle = picture.map(row => `*${row}*`);
  return [border, ...middle, border];
}

function sortedSquares(nums) {
  return nums.map(x => x * x).sort((a, b) => a - b);
}

function isAnagram(a, b) {
  const sortStr = s => s.split("").sort().join("");
  return sortStr(a) === sortStr(b);
}

function firstDigit(s) {
  for (const c of s) {
    if (c >= "0" && c <= "9") {
      return c;
    }
  }
  return "";
}

function alternatingSums(a) {
  let team1 = 0;
  let team2 = 0;
  for (let i = 0; i < a.length; i++) {
    if (i % 2 === 0) {
      team1 += a[i];
    } else {
      team2 += a[i];
    }
  }
  return [team1, team2];
}

module.exports = {
  allLongestStrings,
  addBorder,
  sortedSquares,
  isAnagram,
  firstDigit,
  alternatingSums
};

