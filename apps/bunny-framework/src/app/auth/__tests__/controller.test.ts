// sum.test.js
import { expect, test } from "bun:test";

// sum.js
export function sum(a: number, b: number) {
  return a + b;
}

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
