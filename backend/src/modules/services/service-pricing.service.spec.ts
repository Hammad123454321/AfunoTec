import { Prisma, ServiceDiscount } from '@prisma/client';
import { ServicePricingService } from './service-pricing.service';

function discount(overrides: Partial<ServiceDiscount> = {}): ServiceDiscount {
  return {
    id: 'd1',
    serviceId: 's1',
    type: 'PERCENTAGE',
    value: new Prisma.Decimal(10),
    badge: 'SAVE_PERCENT',
    startAt: new Date('2026-01-01'),
    endAt: new Date('2027-01-01'),
    isActive: true,
    createdAt: new Date(),
    ...overrides,
  } as ServiceDiscount;
}

describe('ServicePricingService', () => {
  const pricing = new ServicePricingService();
  const onDate = new Date('2026-06-01');

  it('returns the base price when there are no discounts', () => {
    const r = pricing.compute({ basePrice: 200000, discounts: [], onDate });
    expect(r.effectivePrice.toString()).toBe('200000');
    expect(r.discountApplied.toString()).toBe('0');
  });

  it('applies a percentage discount', () => {
    const r = pricing.compute({ basePrice: 200000, discounts: [discount()], onDate });
    expect(r.effectivePrice.toString()).toBe('180000');
    expect(r.badge).toBe('SAVE_PERCENT');
  });

  it('applies a fixed discount', () => {
    const r = pricing.compute({
      basePrice: 200000,
      discounts: [discount({ type: 'FIXED', value: new Prisma.Decimal(50000), badge: 'SAVE_VALUE' })],
      onDate,
    });
    expect(r.effectivePrice.toString()).toBe('150000');
  });

  it('prefers the availability price override over base', () => {
    const r = pricing.compute({ basePrice: 200000, priceOverride: 150000, discounts: [], onDate });
    expect(r.effectivePrice.toString()).toBe('150000');
  });

  it('ignores discounts outside their active window', () => {
    const r = pricing.compute({
      basePrice: 200000,
      discounts: [discount({ startAt: new Date('2027-01-01'), endAt: new Date('2027-02-01') })],
      onDate,
    });
    expect(r.effectivePrice.toString()).toBe('200000');
  });

  it('ignores inactive discounts', () => {
    const r = pricing.compute({ basePrice: 200000, discounts: [discount({ isActive: false })], onDate });
    expect(r.effectivePrice.toString()).toBe('200000');
  });

  it('picks the largest discount when several apply', () => {
    const r = pricing.compute({
      basePrice: 200000,
      discounts: [
        discount({ id: 'a', value: new Prisma.Decimal(10) }), // -20000
        discount({ id: 'b', type: 'FIXED', value: new Prisma.Decimal(50000) }), // -50000
      ],
      onDate,
    });
    expect(r.effectivePrice.toString()).toBe('150000');
  });

  it('never goes below zero', () => {
    const r = pricing.compute({
      basePrice: 100,
      discounts: [discount({ type: 'FIXED', value: new Prisma.Decimal(99999) })],
      onDate,
    });
    expect(r.effectivePrice.toString()).toBe('0');
  });
});
