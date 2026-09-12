import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatNative18,
  formatUsd6,
  native18ToUsd6,
  parseUsdToUsd6,
  USD6_TO_NATIVE18,
  usd6ToNative18,
} from "./units";

test("parseUsdToUsd6 reads human USDC into usd6", () => {
  assert.equal(parseUsdToUsd6("69000"), 69_000_000000n);
  assert.equal(parseUsdToUsd6("69,000.5"), 69_000_500000n);
  assert.equal(parseUsdToUsd6("1.234567"), 1_234567n);
});

test("formatUsd6 groups and pads", () => {
  assert.equal(formatUsd6(parseUsdToUsd6("69000")), "69,000.00");
  assert.equal(formatUsd6(parseUsdToUsd6("1.2"), { digits: 6, group: false }), "1.200000");
});

test("usd6ToNative18 multiplies by 1e12 and round-trips", () => {
  const usd6 = parseUsdToUsd6("69000");
  const native18 = usd6ToNative18(usd6);
  assert.equal(native18, usd6 * USD6_TO_NATIVE18);
  assert.equal(native18ToUsd6(native18), usd6);
  assert.equal(formatNative18(native18, { digits: 0 }).startsWith("69000"), true);
});

test("rejects more than 6 fractional digits", () => {
  assert.throws(() => parseUsdToUsd6("1.2345678"), /6 decimal/);
});
