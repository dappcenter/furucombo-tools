export function isHexString(str: string): boolean {
  return !!str.match(/[0-9a-fA-F]+$/g);
}

export function parseHex2Num(str: string): number {
  if (!isHexString(str)) {
    throw new Error("is not valid input string");
  }
  return parseInt(str, 16);
}
