import { interpolateString } from "./util";

describe("interpolateString", () => {
  it("interpolates variables into the string", () => {
    const result = interpolateString("test ${one} ${two} 3", {
      one: 1,
      two: 2
    });
    expect(result).toBe("test 1 2 3");
  });

  it("ignores extra parameters", () => {
    const result = interpolateString("test ${one}", {
      one: 1,
      two: 2
    });
    expect(result).toBe("test 1");
  });

  it("does not execute arbitrary code", () => {
    expect(() =>
      interpolateString(
        '` + (function () { throw Error("evil"); })() + `${a}',
        { a: 0 }
      )
    ).not.toThrowError("evil");
  });
});
