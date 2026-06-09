import { Prisma } from '@prisma/client';

/**
 * Monetary helpers built on Prisma.Decimal so money math never touches IEEE-754
 * floats. All amounts are stored as Decimal(18,2) with an explicit currency;
 * conversion happens only at the read boundary via `convert`.
 */

export type DecimalInput = Prisma.Decimal | number | string;

export function toDecimal(value: DecimalInput): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

export function add(a: DecimalInput, b: DecimalInput): Prisma.Decimal {
  return toDecimal(a).plus(toDecimal(b));
}

export function sub(a: DecimalInput, b: DecimalInput): Prisma.Decimal {
  return toDecimal(a).minus(toDecimal(b));
}

export function mul(a: DecimalInput, b: DecimalInput): Prisma.Decimal {
  return toDecimal(a).times(toDecimal(b));
}

/** Sums a list of amounts, starting from zero. */
export function sum(values: DecimalInput[]): Prisma.Decimal {
  return values.reduce<Prisma.Decimal>((acc, v) => acc.plus(toDecimal(v)), new Prisma.Decimal(0));
}

/** Rounds to 2 decimal places (half-up) for storage/display. */
export function round2(value: DecimalInput): Prisma.Decimal {
  return toDecimal(value).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

/** Clamps a value to be at least zero (e.g. so a discount can't make a total negative). */
export function clampNonNegative(value: DecimalInput): Prisma.Decimal {
  const d = toDecimal(value);
  return d.isNegative() ? new Prisma.Decimal(0) : d;
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
): Prisma.Decimal {
  const from = toDecimal(fromRateToMga);
  const to = toDecimal(toRateToMga);
  if (to.isZero()) {
    throw new Error('Target currency rate cannot be zero');
  }
  return round2(toDecimal(amount).times(from).dividedBy(to));
}
