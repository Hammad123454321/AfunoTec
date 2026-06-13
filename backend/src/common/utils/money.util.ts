import Decimal from 'decimal.js';
import { Types } from 'mongoose';

/**
 * Monetary helpers built on decimal.js so money math never touches IEEE-754
 * floats. All amounts are stored in MongoDB as BSON `Decimal128` with an
 * explicit currency; arithmetic happens on `Decimal`, and conversion to/from
 * `Decimal128` occurs only at the persistence boundary (see `toDecimal128` /
 * `fromDecimal128`). Conversion between currencies happens at the read boundary
 * via `convert`.
 *
 * NOTE: decimal.js is the same library Prisma's `Decimal` wrapped, so the public
 * arithmetic API (`plus/minus/times/dividedBy/toDecimalPlaces/ROUND_HALF_UP/
 * isNegative/isZero`) is unchanged — call sites that did money math are source-
 * compatible.
 */

export { Decimal };

export type DecimalInput = Decimal | Types.Decimal128 | number | string;

/** Normalizes any supported input (incl. BSON Decimal128) into a decimal.js value. */
export function toDecimal(value: DecimalInput): Decimal {
  if (value instanceof Types.Decimal128) {
    return new Decimal(value.toString());
  }
  return new Decimal(value as Decimal.Value);
}

/** Converts a decimal value into a BSON `Decimal128` for persistence (2dp). */
export function toDecimal128(value: DecimalInput): Types.Decimal128 {
  return Types.Decimal128.fromString(round2(value).toFixed(2));
}

/** Reads a stored `Decimal128` (or null) back into a decimal.js value (or null). */
export function fromDecimal128(value: Types.Decimal128 | null | undefined): Decimal | null {
  return value == null ? null : new Decimal(value.toString());
}

export function add(a: DecimalInput, b: DecimalInput): Decimal {
  return toDecimal(a).plus(toDecimal(b));
}

export function sub(a: DecimalInput, b: DecimalInput): Decimal {
  return toDecimal(a).minus(toDecimal(b));
}

export function mul(a: DecimalInput, b: DecimalInput): Decimal {
  return toDecimal(a).times(toDecimal(b));
}

/** Sums a list of amounts, starting from zero. */
export function sum(values: DecimalInput[]): Decimal {
  return values.reduce<Decimal>((acc, v) => acc.plus(toDecimal(v)), new Decimal(0));
}

/** Rounds to 2 decimal places (half-up) for storage/display. */
export function round2(value: DecimalInput): Decimal {
  return toDecimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

/** Clamps a value to be at least zero (e.g. so a discount can't make a total negative). */
export function clampNonNegative(value: DecimalInput): Decimal {
  const d = toDecimal(value);
  return d.isNegative() ? new Decimal(0) : d;
}

/**
 * Converts an amount between currencies using their MGA base rates
 * (1 unit of currency = `rateToMga` MGA). Both rates are Currency.rateToMga.
 *   amountInTarget = amount * (fromRateToMga / toRateToMga)
 */
export function convert(
  amount: DecimalInput,
  fromRateToMga: DecimalInput,
  toRateToMga: DecimalInput,
): Decimal {
  const from = toDecimal(fromRateToMga);
  const to = toDecimal(toRateToMga);
  if (to.isZero()) {
    throw new Error('Target currency rate cannot be zero');
  }
  return round2(toDecimal(amount).times(from).dividedBy(to));
}
