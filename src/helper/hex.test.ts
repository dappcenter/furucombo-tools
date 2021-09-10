import { isHexString, parseHex2Num } from "./hex";

describe("parse hex to number", () => {
  test("01", () => {
    expect(parseHex2Num("01")).toStrictEqual(1);
  });

  test("0x01", () => {
    expect(parseHex2Num("0x01")).toStrictEqual(1);
  });

  test("0xa0", () => {
    expect(parseHex2Num("0xa0")).toStrictEqual(160);
  });

  test("a", () => {
    expect(parseHex2Num("a")).toStrictEqual(10);
  });

  test("0x0z", () => {
    expect(() => parseHex2Num("0x0z")).toThrowError(
      "is not valid input string"
    );
  });
});

describe("is hex", () => {
  test("hex", () => {
    expect(isHexString("0x2")).toBeTruthy();
    expect(isHexString("a")).toBeTruthy();
  });
  test("non hex", () => {
    expect(isHexString("0xg")).toBeFalsy();
    expect(isHexString("z")).toBeFalsy();
  });
});
