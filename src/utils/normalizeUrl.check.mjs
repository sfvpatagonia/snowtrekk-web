import { strictEqual } from "node:assert/strict";
import { normalizeUrl } from "./normalizeUrl.js";

const cases = [
  ["www.x.com", "https://www.x.com/"],
  ["http://x.com", "http://x.com/"],
  ["https://x.com", "https://x.com/"],
  ["  x.com ", "https://x.com/"],
  ["https:https://x.com", "https://x.com/"],
  ["http://https://x.com", "https://x.com/"],
  ["", null],
  ["not a url", null],
  ["foo", null],
  ["https://https://x.com", "https://x.com/"],
];

cases.forEach(([input, expected]) => {
  strictEqual(normalizeUrl(input), expected, `normalizeUrl(${JSON.stringify(input)})`);
});

console.log(`OK ${cases.length}/${cases.length}`);
