import { Injectable } from '@nestjs/common';
import { Prisma, ServiceDiscount } from '@prisma/client';
import { clampNonNegative, mul, round2, sub, toDecimal } from '../../common/utils/money.util';

export interface EffectivePrice {
  basePrice: Prisma.Decimal;
  effectivePrice: Prisma.Decimal;
  discountApplied: Prisma.Decimal;
  badge: string | null;
}

/**
 * Computes the effective price for a service on a given date:
 *   start from the availability `priceOverride` if present, else `basePrice`,
 *   then apply the best active discount in the window (percentage or fixed).
 * Reused by services detail, cart and booking pricing.
 */
@Injectable()
export class ServicePricingService {
  /** Picks the discount that yields the largest reduction among those active on `onDate`. */
  bestActiveDiscount(
    discounts: ServiceDiscount[],
    price: Prisma.Decimal,
    onDate: Date,
  ): { amount: Prisma.Decimal; badge: string | null } {
    let best = { amount: toDecimal(0), badge: null as string | null };
    for (const d of discounts) {
      if (!d.isActive) continue;
      if (d.startAt.getTime() > onDate.getTime() || d.endAt.getTime() < onDate.getTime()) continue;
      const amount =
        d.type === 'PERCENTAGE'
          ? round2(mul(price, toDecimal(d.value).dividedBy(100)))
          : round2(toDecimal(d.value));
      if (amount.greaterThan(best.amount)) {
        best = { amount, badge: d.badge ?? null };
      }
    }
    return best;
  }

  compute(params: {
    basePrice: Prisma.Decimal | number | string;
    priceOverride?: Prisma.Decimal | number | string | null;
    discounts?: ServiceDiscount[];
    onDate?: Date;
  }): EffectivePrice {
    const base = toDecimal(params.basePrice);
    const start =
      params.priceOverride !== undefined && params.priceOverride !== null
        ? toDecimal(params.priceOverride)
        : base;
    const onDate = params.onDate ?? new Date();
    const { amount, badge } = this.bestActiveDiscount(params.discounts ?? [], start, onDate);
    const effective = clampNonNegative(round2(sub(start, amount)));
    return { basePrice: base, effectivePrice: effective, discountApplied: amount, badge };
  }
}
