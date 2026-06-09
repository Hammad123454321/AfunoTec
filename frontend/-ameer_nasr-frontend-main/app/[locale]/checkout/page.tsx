"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  type Country,
  findCountry,
} from "@/features/checkout/countries";
import {
  applyGiftCard,
  applyPromo,
  applyReference,
  computeTotals,
  type GiftApplied,
  type PromoApplied,
  type ReferenceApplied,
} from "@/features/checkout/discountCodes";

// -----------------------------------------------------------------------------
//  Mocked booking context. Real values come from the cart in M3; until then
//  these constants drive the layout + price summary so the math is testable.
// -----------------------------------------------------------------------------
const BOOKING = {
  hotelName: "RIU Turquoise Mauritius",
  checkIn: "19 Jun",
  checkOut: "26 Jun",
  nights: 7,
  numberOfRooms: 2,
  currencyLabel: "Ar",
  baseTotal: 1_400_000,
};

type Guest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
};

const newGuest = (): Guest => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  countryCode: DEFAULT_COUNTRY.code,
});

// -----------------------------------------------------------------------------
export default function CheckoutPage() {
  // Guests state — one entry per room (PDF "primary guest").
  const [guests, setGuests] = useState<Guest[]>(() =>
    Array.from({ length: BOOKING.numberOfRooms }, newGuest),
  );

  // Discount state — each one starts off as null and becomes the
  // "applied" payload once the user successfully enters a code.
  const [promo, setPromo] = useState<PromoApplied | null>(null);
  const [gift, setGift] = useState<GiftApplied | null>(null);
  const [reference, setReference] = useState<ReferenceApplied | null>(null);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const totals = useMemo(
    () => computeTotals({ baseTotal: BOOKING.baseTotal, promo, gift }),
    [promo, gift],
  );

  const updateGuest = (index: number, patch: Partial<Guest>) =>
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, ...patch } : g)),
    );

  const canSubmit =
    acceptedTerms &&
    guests.every(
      (g) =>
        g.firstName.trim() && g.lastName.trim() && g.email.trim() && g.phone.trim(),
    );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* LEFT — guest form + discount codes */}
          <div className="flex-1 bg-white shadow rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Provide Guest Information
                </h2>
              </div>

              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                <strong>Important:</strong> Provide ALL information EXACTLY as
                it appears in the passport to avoid booking complications.
              </div>

              <div className="mb-6 text-lg font-medium text-gray-700">
                Number of guests for room:{" "}
                <span className="font-semibold">{BOOKING.numberOfRooms}</span>
              </div>

              {guests.map((guest, index) => (
                <GuestRoomSection
                  key={index}
                  roomNumber={index + 1}
                  guest={guest}
                  onChange={(patch) => updateGuest(index, patch)}
                />
              ))}

              {/* Discount codes block */}
              <section className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Have a code?
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Promo, gift card and reference codes can be combined. The
                  total updates live in the summary on the right.
                </p>

                <div className="space-y-4">
                  <PromoCodeRow
                    placeholder="Promo code (e.g. WELCOME10)"
                    applied={promo}
                    onApply={(raw) => {
                      const r = applyPromo(raw);
                      if (r.ok) setPromo(r.applied);
                      return r.ok ? null : r.error;
                    }}
                    onRemove={() => setPromo(null)}
                    appliedSummary={(p) => `${p.code} — ${p.percentOff}% off`}
                    label="Promo"
                  />

                  <PromoCodeRow
                    placeholder="Gift card code (e.g. GIFT50K)"
                    applied={gift}
                    onApply={(raw) => {
                      const r = applyGiftCard(raw);
                      if (r.ok) setGift(r.applied);
                      return r.ok ? null : r.error;
                    }}
                    onRemove={() => setGift(null)}
                    appliedSummary={(g) =>
                      `${g.code} — ${BOOKING.currencyLabel} ${g.amountOff.toLocaleString()} off`
                    }
                    label="Gift card"
                  />

                  <PromoCodeRow
                    placeholder="Reference code (optional)"
                    applied={reference}
                    onApply={(raw) => {
                      const r = applyReference(raw);
                      if (r.ok) setReference(r.applied);
                      return r.ok ? null : r.error;
                    }}
                    onRemove={() => setReference(null)}
                    appliedSummary={(r) => r.code}
                    label="Reference"
                  />
                </div>
              </section>

              <div className="mt-8 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1.5 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    className="text-emerald-700 hover:underline"
                    href="/terms"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    className="text-emerald-700 hover:underline"
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  disabled={!canSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — sticky summary (only sticks at lg+, otherwise it
              would freeze mid-scroll on phones below the form). */}
          <aside className="lg:w-96 mt-6 lg:mt-0">
            <div className="bg-white shadow rounded-xl p-4 sm:p-6 lg:sticky lg:top-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Booking Summary
              </h3>

              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="text-gray-500">Hotel</dt>
                  <dd className="font-medium text-gray-900">
                    {BOOKING.hotelName}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Check-in / Check-out</dt>
                  <dd className="font-medium text-gray-900">
                    {BOOKING.checkIn} — {BOOKING.checkOut}{" "}
                    <span className="text-gray-500">
                      ({BOOKING.nights} nights)
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Rooms</dt>
                  <dd className="font-medium text-gray-900">
                    {BOOKING.numberOfRooms}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 pt-5 border-t space-y-2 text-sm">
                <SummaryRow
                  label="Subtotal"
                  value={`${BOOKING.currencyLabel} ${totals.subtotal.toLocaleString()}`}
                />
                {promo && (
                  <SummaryRow
                    label={`Promo (${promo.code})`}
                    value={`− ${BOOKING.currencyLabel} ${totals.promoOff.toLocaleString()}`}
                    tone="discount"
                  />
                )}
                {gift && (
                  <SummaryRow
                    label={`Gift card (${gift.code})`}
                    value={`− ${BOOKING.currencyLabel} ${totals.giftOff.toLocaleString()}`}
                    tone="discount"
                  />
                )}
                {reference && (
                  <SummaryRow
                    label="Reference"
                    value={reference.code}
                    tone="muted"
                  />
                )}
              </div>

              <div className="pt-5 mt-5 border-t flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span className="font-currency">
                  {BOOKING.currencyLabel} {totals.total.toLocaleString()}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
//  Subcomponents
// -----------------------------------------------------------------------------

function GuestRoomSection({
  roomNumber,
  guest,
  onChange,
}: {
  roomNumber: number;
  guest: Guest;
  onChange: (patch: Partial<Guest>) => void;
}) {
  const country = findCountry(guest.countryCode) ?? DEFAULT_COUNTRY;
  return (
    <div className="mt-10 pt-8 border-t border-gray-200 first:mt-0 first:pt-0 first:border-t-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        Room {roomNumber}: Details of Primary Guest *
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="First Name" required>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter First Name"
            value={guest.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </Field>

        <Field label="Last Name" required>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter Last Name"
            value={guest.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </Field>

        <Field label="Phone Number" required className="sm:col-span-2">
          <div className="flex min-w-0">
            <select
              aria-label="Country dialling code"
              className="shrink-0 max-w-[7.5rem] rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 px-2 sm:px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={country.code}
              onChange={(e) => onChange({ countryCode: e.target.value })}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} +{c.dial}
                </option>
              ))}
            </select>
            <input
              type="tel"
              inputMode="tel"
              className="flex-1 min-w-0 px-3 sm:px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="Enter Phone Number"
              value={guest.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </div>
        </Field>

        <Field label="Email" required className="sm:col-span-2">
          <input
            type="email"
            className={inputClass}
            placeholder="Enter Email"
            value={guest.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </Field>

        <Field label="Country" required className="sm:col-span-2">
          <CountrySelect
            value={guest.countryCode}
            onChange={(code) => onChange({ countryCode: code })}
          />
        </Field>
      </div>
    </div>
  );
}

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  return (
    <select
      className={inputClass + " bg-white"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.name}
        </option>
      ))}
    </select>
  );
}

function PromoCodeRow<T>({
  placeholder,
  label,
  applied,
  onApply,
  onRemove,
  appliedSummary,
}: {
  placeholder: string;
  label: string;
  applied: T | null;
  /** Returns null on success, or an error message to surface. */
  onApply: (raw: string) => string | null;
  onRemove: () => void;
  appliedSummary: (value: T) => string;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-emerald-700">
            {label} applied
          </div>
          <div className="text-sm font-medium text-emerald-900">
            {appliedSummary(applied)}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-medium text-emerald-800 hover:underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          className={inputClass}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
        />
        <button
          type="button"
          className="px-5 rounded-lg bg-gray-900 text-white font-medium hover:bg-black disabled:opacity-50"
          disabled={!draft.trim()}
          onClick={() => {
            const err = onApply(draft);
            if (err) {
              setError(err);
            } else {
              setError(null);
              setDraft("");
            }
          }}
        >
          Apply
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span aria-hidden>*</span>}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "discount" | "muted";
}) {
  return (
    <div className="flex justify-between">
      <span
        className={
          tone === "discount"
            ? "text-emerald-700"
            : tone === "muted"
              ? "text-gray-500"
              : "text-gray-700"
        }
      >
        {label}
      </span>
      <span
        className={
          tone === "discount"
            ? "text-emerald-700 font-medium font-currency"
            : tone === "muted"
              ? "text-gray-500"
              : "text-gray-900 font-medium font-currency"
        }
      >
        {value}
      </span>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition";
