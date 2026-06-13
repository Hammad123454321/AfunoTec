import { Injectable } from '@nestjs/common';
import {
  clampNonNegative,
  Decimal,
  DecimalInput,
  mul,
  round2,
  sub,
  toDecimal,
} from '../../common/utils/money.util';

/** A discount as stored on the embedded Service.discounts array (Decimal128 value). */
export interface PricingDiscount {
  type: string;
  value: DecimalInput;
  badge?: string | null;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
}

export interface EffectivePrice {
  basePrice: Decimal;
  effectivePrice: Decimal;
  discountApplied: Decimal;
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
    discounts: PricingDiscount[],
    price: Decimal,
    onDate: Date,
  ): { amount: Decimal; badge: string | null } {
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
    basePrice: DecimalInput;
    priceOverride?: DecimalInput | null;
    discounts?: PricingDiscount[];
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
