import { cn } from "@/lib/utils";

/**
 * Canonical set of status labels used across the dashboard tables.
 *
 * Booking / payment lifecycle (per Figma p016, p055–p065 of the
 * service-owner Figma export):
 *   - Active           — confirmed and currently running
 *   - Inactive         — manually disabled by admin / provider
 *   - Pending          — awaiting customer action
 *   - Confirmed        — same as Active but used on bookings page
 *   - Cancelled        — cancelled by customer / admin
 *   - Refunded         — refund issued
 *   - Paid             — payment completed (payment-status column)
 *   - Unpaid           — payment outstanding
 *   - Scheduled        — booking confirmed for a future date
 *   - Expired          — booking window passed without action
 *   - Draft            — service / offer in draft state
 *   - Payment Pending  — payment initiated but not yet captured
 *   - Upcoming         — same as Scheduled, used on dashboard table
 *   - Unblock          — re-activated after being blocked
 *   - Block            — blocked / disabled
 *
 * Anything not in this list falls back to a neutral gray badge so the
 * table never throws on unexpected backend values.
 */
export type StatusKind =
  | "Active"
  | "Inactive"
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Refunded"
  | "Paid"
  | "Unpaid"
  | "Scheduled"
  | "Expired"
  | "Draft"
  | "Payment Pending"
  | "Upcoming"
  | "Unblock"
  | "Block";

type Variant = {
  bg: string;
  text: string;
};

// Tailwind classes per status. Colors mirror the Figma palette directly.
const variants: Record<StatusKind, Variant> = {
  Active: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Confirmed: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Paid: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Inactive: { bg: "bg-rose-100", text: "text-rose-700" },
  Cancelled: { bg: "bg-rose-100", text: "text-rose-700" },
  Unpaid: { bg: "bg-rose-100", text: "text-rose-700" },
  Expired: { bg: "bg-rose-100", text: "text-rose-700" },
  Block: { bg: "bg-rose-100", text: "text-rose-700" },
  Pending: { bg: "bg-amber-100", text: "text-amber-700" },
  "Payment Pending": { bg: "bg-amber-100", text: "text-amber-700" },
  Scheduled: { bg: "bg-sky-100", text: "text-sky-700" },
  Upcoming: { bg: "bg-sky-100", text: "text-sky-700" },
  Unblock: { bg: "bg-sky-100", text: "text-sky-700" },
  Draft: { bg: "bg-slate-200", text: "text-slate-700" },
  Refunded: { bg: "bg-slate-200", text: "text-slate-700" },
};

const neutral: Variant = { bg: "bg-slate-100", text: "text-slate-600" };

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const variant = (variants as Record<string, Variant>)[status] ?? neutral;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        variant.bg,
        variant.text,
        className,
      )}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
