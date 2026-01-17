import {
  parseCsvLine,
  parseCsvQuotedField,
  parseCsvUnquotedField,
} from "../src/utils/csv-utils";

test("parseCsvLine", () => {
  const testCases: [string, string[]][] = [
    ["a", ["a"]],
    ["a,a", ["a", "a"]],
    ["a,a,a", ["a", "a", "a"]],
    ["a a,a,a", ["a a", "a", "a"]],
    ['"a"', ["a"]],
    ['"a",a', ["a", "a"]],
    ['a,a,"a"', ["a", "a", "a"]],
    ['"a a","a","a"', ["a a", "a", "a"]],
    ['"a, a","a",a', ["a, a", "a", "a"]],
  ];
  for (let [input, expected] of testCases) {
    let got = parseCsvLine(input);
    console.log("GOT", got);
    expect(JSON.stringify(got)).toBe(JSON.stringify(expected));
  }
});

test("parseCsvQuotedField", () => {
  const testCases: [string, number][][] = [
    [
      ['"a"', 0],
      ["a", 4],
    ],
    [
      ['"a a"', 0],
      ["a a", 6],
    ],
    [
      ['"a,a"', 0],
      ["a,a", 6],
    ],
    [
      ['"a","b"', 4],
      ["b", 8],
    ],
    [
      ['"a,b","c"', 6],
      ["c", 10],
    ],
  ];
  for (let [[input, index], [expectedField, expectedIndex]] of testCases) {
    let [gotField, gotIndex] = parseCsvQuotedField(input, index);
    expect(gotField).toBe(expectedField);
    expect(gotIndex).toBe(expectedIndex);
  }
});

test("parseCsvUnquotedField", () => {
  const testCases: [string, number][][] = [
    [
      ["a", 0],
      ["a", 2],
    ],
    [
      ["a a", 0],
      ["a a", 4],
    ],
    [
      ["a,b", 0],
      ["a", 2],
    ],
    [
      ["a,b", 2],
      ["b", 4],
    ],
  ];
  for (let [[input, index], [expectedField, expectedIndex]] of testCases) {
    let [gotField, gotIndex] = parseCsvUnquotedField(input, index);
    expect(gotField).toBe(expectedField);
    expect(gotIndex).toBe(expectedIndex);
  }
});
