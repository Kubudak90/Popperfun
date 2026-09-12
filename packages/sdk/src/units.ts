/**
 * Popper.fun unit helpers.
 *
 * Two labeled units — never mix unlabeled integers:
 *   usd6     — human USDC config (6 decimals). Launch forms, thresholds, display.
 *   native18 — curve / native USDC accounting (18 decimals). On-chain reserves.
 *
 * Conversion is exact: 1 usd6 unit = 1e12 native18 units.
 */

export const USD6_DECIMALS = 6;
export const NATIVE18_DECIMALS = 18;

/** 1e12 — multiply usd6 by this to get native18. */
export const USD6_TO_NATIVE18 = 10n ** 12n;

export type Usd6 = bigint & { readonly __unit: "usd6" };
export type Native18 = bigint & { readonly __unit: "native18" };

export function asUsd6(value: bigint): Usd6 {
  return value as Usd6;
}

export function asNative18(value: bigint): Native18 {
  return value as Native18;
}

/**
 * Parse a human USD string ("69000", "69,000.5") into usd6.
 * At most 6 fractional digits. Throws on invalid input.
 */
export function parseUsdToUsd6(human: string): Usd6 {
  const cleaned = human.trim().replace(/,/g, "");
  if (!cleaned || !/^-?\d+(\.\d+)?$/.test(cleaned)) {
    throw new Error(`Invalid USD amount: ${human}`);
  }

  const negative = cleaned.startsWith("-");
  const unsigned = negative ? cleaned.slice(1) : cleaned;
  const [wholeRaw, fracRaw = ""] = unsigned.split(".");

  if (fracRaw.length > USD6_DECIMALS) {
    throw new Error("usd6 supports at most 6 decimal places");
  }

  const frac = fracRaw.padEnd(USD6_DECIMALS, "0");
  const value = BigInt(wholeRaw) * 10n ** BigInt(USD6_DECIMALS) + BigInt(frac || "0");
  return asUsd6(negative ? -value : value);
}

export function formatUsd6(
  amount: Usd6,
  options: { digits?: number; group?: boolean } = {},
): string {
  const digits = options.digits ?? 2;
  const group = options.group ?? true;
  const negative = amount < 0n;
  const abs = negative ? -amount : amount;
  const whole = abs / 10n ** BigInt(USD6_DECIMALS);
  const frac = abs % 10n ** BigInt(USD6_DECIMALS);
  const fracStr = frac
    .toString()
    .padStart(USD6_DECIMALS, "0")
    .slice(0, digits)
    .padEnd(digits, "0");
  const wholeStr = group
    ? whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : whole.toString();
  return `${negative ? "-" : ""}${wholeStr}.${fracStr}`;
}

/** Lift human usd6 config into native18 curve units. */
export function usd6ToNative18(usd6: Usd6): Native18 {
  return asNative18(usd6 * USD6_TO_NATIVE18);
}

/** Truncate native18 curve units down to usd6 (floor). */
export function native18ToUsd6(native18: Native18): Usd6 {
  return asUsd6(native18 / USD6_TO_NATIVE18);
}

export function formatNative18(
  amount: Native18,
  options: { digits?: number } = {},
): string {
  const digits = options.digits ?? 4;
  const negative = amount < 0n;
  const abs = negative ? -amount : amount;
  const whole = abs / 10n ** BigInt(NATIVE18_DECIMALS);
  const frac = abs % 10n ** BigInt(NATIVE18_DECIMALS);
  const fracStr = frac
    .toString()
    .padStart(NATIVE18_DECIMALS, "0")
    .slice(0, digits)
    .padEnd(digits, "0");
  return `${negative ? "-" : ""}${whole.toString()}.${fracStr}`;
}
