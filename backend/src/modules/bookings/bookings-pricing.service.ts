import { Injectable } from '@nestjs/common';
import { ServicePricingService } from '../services/service-pricing.service';
import {
  add,
  clampNonNegative,
  mul,
  round2,
  toDecimal,
  convert,
  Decimal,
  DecimalInput,
} from '../../common/utils/money.util';

export interface BookingLineItem {
  label: string;
  amount: string;
  type: 'service' | 'addon' | 'fee' | 'tax' | 'discount';
}

export interface BookingPriceResult {
  subtotal: Decimal;
  discountAmount: Decimal;
  taxAmount: Decimal;
  feeAmount: Decimal;
  total: Decimal;
  currency: string;
  exchangeRateToMga: Decimal | null;
  lineItems: BookingLineItem[];
}

/** A service discount as accepted by the pricing computation (embedded shape). */
export interface PricingDiscount {
  type: string;
  value: DecimalInput;
  badge?: string | null;
  isActive: boolean;
  startAt: Date;
  endAt: Date;
}

/** A resolved room request: an embedded ServiceRoom plus the requested quantity. */
export interface PricingRoom {
  name?: string | null;
  basePrice?: DecimalInput | null;
  qty: number;
}

interface PriceParams {
  serviceId: string;
  basePrice: DecimalInput;
  discounts: PricingDiscount[];
  rooms: PricingRoom[];
  units: number;
  checkInDate?: Date | null;
  /** Requested output currency (defaults to MGA). */
  currency?: string;
  /** rateToMga of the requested currency (1 when MGA). */
  currencyRate?: number;
}

@Injectable()
export class BookingsPricingService {
  constructor(private readonly pricingService: ServicePricingService) {}

  compute(params: PriceParams): BookingPriceResult {
    const onDate = params.checkInDate ?? new Date();
    const basePrice = toDecimal(params.basePrice);
    const { discountApplied } = this.pricingService.compute({
      basePrice,
      discounts: params.discounts as never,
      onDate,
    });

    const units = Math.max(1, params.units);
    const lineItems: BookingLineItem[] = [];

    let subtotal = toDecimal(0);

    if (params.rooms.length > 0) {
      // Room-based: subtotal = sum(roomBasePrice × qty). Discount applied separately below.
      for (const room of params.rooms) {
        const roomPrice = toDecimal(room.basePrice ?? 0);
        const roomSubtotal = round2(mul(roomPrice, room.qty));
        subtotal = add(subtotal, roomSubtotal);
        lineItems.push({
          label: `${room.name ?? 'Room'} × ${room.qty}`,
          amount: roomSubtotal.toString(),
          type: 'service',
        });
      }
    } else {
      // Unit-based: subtotal = basePrice × units (gross before discount)
      const unitSubtotal = round2(mul(basePrice, units));
      subtotal = unitSubtotal;
      lineItems.push({
        label: `Service × ${units}`,
        amount: unitSubtotal.toString(),
        type: 'service',
      });
    }

    // discountAmount is the absolute saving (always computed from discountApplied)
    const discountAmount =
      params.rooms.length > 0
        ? round2(
            subtotal
              .times(discountApplied)
              .dividedBy(basePrice.isZero() ? 1 : basePrice),
          )
        : round2(mul(discountApplied, units));

    if (discountAmount.greaterThan(0)) {
      lineItems.push({
        label: 'Discount',
        amount: discountAmount.negated().toString(),
        type: 'discount',
      });
    }

    const taxAmount = toDecimal(0);
    const feeAmount = toDecimal(0);

    const total = clampNonNegative(round2(
      subtotal.minus(discountAmount).plus(taxAmount).plus(feeAmount),
    ));

    // Currency conversion
    const currencyRate = toDecimal(params.currencyRate ?? 1);
    const outputCurrency = params.currency ?? 'MGA';
    const exchangeRateToMga = outputCurrency !== 'MGA' ? currencyRate : null;

    const convertAmount = (d: Decimal) =>
      outputCurrency !== 'MGA' && !currencyRate.isZero()
        ? convert(d, 1, currencyRate)
        : d;

    return {
      subtotal: convertAmount(subtotal),
      discountAmount: convertAmount(discountAmount),
      taxAmount,
      feeAmount,
      total: convertAmount(total),
      currency: outputCurrency,
      exchangeRateToMga,
      lineItems: lineItems.map((li) => ({
        ...li,
        amount: convertAmount(toDecimal(li.amount)).toString(),
      })),
    };
  }
}
