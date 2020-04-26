import {ArrDiffs, arrayDiffs, isEqual} from "./obj-utils";

test("isEqual", () => {
  const cases: [any, any, boolean][] = [
    [undefined, undefined, true],
    [null, null, true],
    [null, undefined, true],
    [0, 0, true],
    [0, 1, false],
    [0, NaN, false],
    ["", "", true],
    ["a", "a", true],
    ["a", "b", false],
    ["a", 0, false],
    [true, true, true],
    [true, false, false],
    [true, 1, false],
    [[], [], true],
    [["a"], ["a"], true],
    [["a"], ["b"], false],
    [["a", "b"], ["a", "b"], true],
    [["a", "b"], ["b", "a"], true],
    [{}, {}, true],
    [{a: 1, b: 2}, {a: 1, b: 2}, true],
    [{a: 1, b: 2}, {b: 2, a: 1}, true],
    [{a: 1, b: 2}, {a: 1, b: 2, c: 3}, false],
    [{a: 1, b: ["a", "b"]}, {b: ["b", "a"], a: 1}, true],
    [{a: 1, b: ["a", "c"]}, {b: ["b", "a"], a: 1}, false],
    [{a: 1, b: {c: 1, d: 2}}, {b: {d: 2, c: 1}, a: 1}, true],
    [{a: 1, b: {c: 1, d: ["a", "b"]}}, {b: {d: ["b", "a"], c: 1}, a: 1}, true],
  ];

  for (const [a, b, expectedEquality] of cases) {
    expect(isEqual(a, b)).toEqual(expectedEquality);
  }
});

test("arrayDiffs", () => {
  const cases: [string[], string[], ArrDiffs<string>][] = [
    [[], [], []],
    [["a", "b", "c"], ["a", "b", "c"], []],
    [["a", "b", "c"], ["a", "b", "c", "d"], [{type: "create", idx: 3, item: "d"}]],
    [["a", "b", "c"], ["a", "d", "c"], [{type: "update", idx: 1, item: "d"}]],
    [["a", "b", "c"], ["a", "b"], [{type: "delete", idx: 2}]],
    [
      ["a", "b", "c"],
      ["a", "d"],
      [
        {type: "update", idx: 1, item: "d"},
        {type: "delete", idx: 2},
      ],
    ],
    [
      ["a", "b", "c"],
      ["c", "c", "c", "c"],
      [
        {type: "update", idx: 0, item: "c"},
        {type: "update", idx: 1, item: "c"},
        {type: "create", idx: 3, item: "c"},
      ],
    ],
  ];

  for (const [a, b, expectedDiff] of cases) {
    expect(arrayDiffs(a, b)).toEqual(expectedDiff);
  }
});
