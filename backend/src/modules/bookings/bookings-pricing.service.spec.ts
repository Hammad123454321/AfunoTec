import { DiscountBadge, DiscountType } from '../../common/enums';
import { Decimal } from '../../common/utils/money.util';
import { ServicePricingService } from '../services/service-pricing.service';
import { BookingsPricingService, PricingDiscount, PricingRoom } from './bookings-pricing.service';

function makeDiscount(overrides: Partial<{
  type: DiscountType;
  value: number;
  isActive: boolean;
  startAt: Date;
  endAt: Date;
}> = {}): PricingDiscount {
  return {
    type: (overrides.type ?? 'PERCENTAGE') as DiscountType,
    value: new Decimal(overrides.value ?? 10),
    badge: null as DiscountBadge | null,
    isActive: overrides.isActive ?? true,
    startAt: overrides.startAt ?? new Date('2000-01-01'),
    endAt: overrides.endAt ?? new Date('2099-12-31'),
  };
}

function makeRoom(overrides: Partial<{ basePrice: number; name: string; qty: number }> = {}): PricingRoom {
  return {
    name: overrides.name ?? 'Sea View',
    basePrice: new Decimal(overrides.basePrice ?? 200),
    qty: overrides.qty ?? 1,
  };
}

describe('BookingsPricingService', () => {
  let service: BookingsPricingService;

  beforeEach(() => {
    service = new BookingsPricingService(new ServicePricingService());
  });

  describe('unit-based pricing (no rooms)', () => {
    it('computes subtotal = effectivePrice × units', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(100),
        discounts: [],
        rooms: [],
        units: 3,
      });

      expect(result.subtotal.toNumber()).toBe(300);
      expect(result.discountAmount.toNumber()).toBe(0);
      expect(result.total.toNumber()).toBe(300);
      expect(result.currency).toBe('MGA');
    });

    it('applies a percentage discount across all units', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(100),
        discounts: [makeDiscount({ type: 'PERCENTAGE' as DiscountType, value: 20 })],
        rooms: [],
        units: 2,
      });

      // subtotal = basePrice(100) × 2 = 200 (gross); discount = 20/unit × 2 = 40; total = 160
      expect(result.subtotal.toNumber()).toBe(200);
      expect(result.discountAmount.toNumber()).toBe(40);
      expect(result.total.toNumber()).toBe(160);
    });

    it('applies a fixed discount per unit', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(150),
        discounts: [makeDiscount({ type: 'FIXED' as DiscountType, value: 25 })],
        rooms: [],
        units: 2,
      });

      // subtotal = basePrice(150) × 2 = 300 (gross); discount = 25/unit × 2 = 50; total = 250
      expect(result.subtotal.toNumber()).toBe(300);
      expect(result.discountAmount.toNumber()).toBe(50);
      expect(result.total.toNumber()).toBe(250);
    });

    it('ignores inactive discounts', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(100),
        discounts: [makeDiscount({ isActive: false })],
        rooms: [],
        units: 1,
      });

      expect(result.discountAmount.toNumber()).toBe(0);
      expect(result.total.toNumber()).toBe(100);
    });
  });

  describe('room-based pricing', () => {
    it('sums room subtotals correctly for multiple rooms', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(200),
        discounts: [],
        rooms: [
          makeRoom({ basePrice: 200, qty: 1 }),
          makeRoom({ basePrice: 300, qty: 2 }),
        ],
        units: 1,
      });

      // 200×1 + 300×2 = 800
      expect(result.subtotal.toNumber()).toBe(800);
      expect(result.total.toNumber()).toBe(800);
    });

    it('produces a line item per room type', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(100),
        discounts: [],
        rooms: [makeRoom({ name: 'Deluxe', basePrice: 500, qty: 2 })],
        units: 1,
      });

      const serviceItem = result.lineItems.find((li) => li.type === 'service');
      expect(serviceItem).toBeDefined();
      expect(serviceItem!.label).toContain('Deluxe');
    });
  });

  describe('currency conversion', () => {
    it('converts MGA amounts to USD at the given rate', () => {
      // 1 USD = 4500 MGA  → rateToMga = 4500
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(9000),
        discounts: [],
        rooms: [],
        units: 1,
        currency: 'USD',
        currencyRate: 4500,
      });

      // 9000 MGA ÷ 4500 = 2.00 USD
      expect(result.currency).toBe('USD');
      expect(result.total.toNumber()).toBe(2);
      expect(result.exchangeRateToMga).not.toBeNull();
    });

    it('does not set exchangeRateToMga when currency is MGA', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(1000),
        discounts: [],
        rooms: [],
        units: 1,
        currency: 'MGA',
      });

      expect(result.exchangeRateToMga).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('clamps discount so total is never negative', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(50),
        discounts: [makeDiscount({ type: 'FIXED' as DiscountType, value: 200 })],
        rooms: [],
        units: 1,
      });

      expect(result.total.toNumber()).toBeGreaterThanOrEqual(0);
    });

    it('defaults units to 1 when called with 0', () => {
      const result = service.compute({
        serviceId: 's1',
        basePrice: new Decimal(100),
        discounts: [],
        rooms: [],
        units: 0,
      });

      expect(result.subtotal.toNumber()).toBe(100);
    });
  });
});
