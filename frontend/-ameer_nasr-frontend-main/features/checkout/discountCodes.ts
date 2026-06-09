/**
 * Client-side discount-code validators.
 *
 * Every function returns either a typed "applied" object or an error
 * string so the UI can render an inline message. Real validation
 * (network call, atomic stock check, server-side coupon eligibility)
 * lands in M3 — for now we mock just enough of the response shape
 * for the checkout summary to recompute.
 */

export type PromoApplied = {
  type: "promo";
  code: string;
  /** 0–100. */
  percentOff: number;
};

export type GiftApplied = {
  type: "gift";
  code: string;
  /** Currency-units (Ar). Subtracted after the promo. */
  amountOff: number;
};

export type ReferenceApplied = {
  type: "reference";
  code: string;
};

export type DiscountResult<T> =
  | { ok: true; applied: T }
  | { ok: false; error: string };

// A tiny mock table so the M1 happy-path can be tested. The real
// validator does a backend call in M3 and removes these constants.
const MOCK_PROMO: Record<string, number> = {
  WELCOME10: 10,
  SAVE20: 20,
  AFUNO25: 25,
};

const MOCK_GIFTS: Record<string, number> = {
  GIFT50K: 50_000,
  GIFT100K: 100_000,
};

const REFERENCE_PATTERN = /^[A-Z0-9]{6,16}$/;

export function applyPromo(raw: string): DiscountResult<PromoApplied> {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a promo code." };
  const percentOff = MOCK_PROMO[code];
  if (!percentOff) return { ok: false, error: "Promo code not recognised." };
  return { ok: true, applied: { type: "promo", code, percentOff } };
}

export function applyGiftCard(raw: string): DiscountResult<GiftApplied> {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a gift card code." };
  const amountOff = MOCK_GIFTS[code];
  if (!amountOff) return { ok: false, error: "Gift card not recognised." };
  return { ok: true, applied: { type: "gift", code, amountOff } };
}

export function applyReference(raw: string): DiscountResult<ReferenceApplied> {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a reference code." };
  if (!REFERENCE_PATTERN.test(code)) {
    return {
      ok: false,
      error: "Reference codes are 6–16 letters / digits.",
    };
  }
  return { ok: true, applied: { type: "reference", code } };
}

/**
 * Computes the breakdown the price summary panel renders. Pure
 * function — easy to unit-test and reuse.
 */
export function computeTotals(input: {
  baseTotal: number;
  promo?: PromoApplied | null;
  gift?: GiftApplied | null;
}): {
  subtotal: number;
  promoOff: number;
  giftOff: number;
  total: number;
} {
  const subtotal = Math.max(0, input.baseTotal);
  const promoOff = input.promo
    ? Math.round((subtotal * input.promo.percentOff) / 100)
    : 0;
  const afterPromo = subtotal - promoOff;
  const giftOff = input.gift
    ? Math.min(afterPromo, input.gift.amountOff)
    : 0;
  const total = Math.max(0, afterPromo - giftOff);
  return { subtotal, promoOff, giftOff, total };
}
