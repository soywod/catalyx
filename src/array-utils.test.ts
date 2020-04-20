import {ArrDiffs, arrayDiffs} from "./array-utils"

test("String array diff", () => {
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
        {type: "delete", idx: 2},
        {type: "update", idx: 1, item: "d"},
      ],
    ],
    [
      ["a", "b", "c"],
      ["c", "c", "c", "c"],
      [
        {type: "create", idx: 3, item: "c"},
        {type: "update", idx: 1, item: "c"},
        {type: "update", idx: 0, item: "c"},
      ],
    ],
  ]

  for (const [a, b, expectedDiff] of cases) {
    expect(arrayDiffs(a, b)).toEqual(expectedDiff)
  }
})
