import {toKebabCase} from "./str-utils";

test("toKebabCase", () => {
  const cases: [string, string][] = [
    ["", ""],
    ["Test", "test"],
    ["Test2", "test-2"],
    ["Test22", "test-22"],
    ["TestTest", "test-test"],
    ["TestTest2", "test-test-2"],
    ["TestTest22", "test-test-22"],
    ["TestTEST", "test-test"],
    ["TestTEST2", "test-test-2"],
    ["TestTEST22", "test-test-22"],
  ];

  for (const [str, expectedStr] of cases) {
    expect(toKebabCase(str)).toEqual(expectedStr);
  }
});
