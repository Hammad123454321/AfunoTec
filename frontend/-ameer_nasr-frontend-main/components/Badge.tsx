"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * The existing percent-off ribbon (kept for backwards compatibility).
 * Renders the iconic top-right corner ribbon used on listing cards.
 */
export function DiscountBadge({ children }: React.PropsWithChildren) {
  return (
    <span className="absolute z-10 top-0 right-0 size-[72px] bg-danger-600 discount-clip text-right p-1 text-white text-md">
      <span className="font-semibold">{children}%</span>
      <span
        className="block -translate-y-1 font-semibold text-xs"
        translate="no"
      >
        Off
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
//  Inline badges — the four new variants defined in the client PDF (page 7).
//  They share a common base style so the listings stay visually consistent.
// ---------------------------------------------------------------------------

type InlineBadgeProps = {
  className?: string;
  children: React.ReactNode;
};

function InlineBadge({
  className,
  children,
  tone,
}: InlineBadgeProps & { tone: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        tone,
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * "Low rooms" pill — shown when the remaining inventory falls below
 * a threshold (PDF default: <5). The threshold is consumer-controlled
 * so callers can pass through whatever the backend reports.
 */
export function LowRoomsLeftBadge({
  roomsLeft,
  threshold = 5,
  className,
}: {
  roomsLeft: number;
  /** Hide the badge above this number of rooms. Default 5 per PDF. */
  threshold?: number;
  className?: string;
}) {
  if (roomsLeft >= threshold || roomsLeft <= 0) return null;
  const label =
    roomsLeft === 1 ? "Only 1 room left" : `Only ${roomsLeft} rooms left`;
  return (
    <InlineBadge
      tone="bg-rose-100 text-rose-700"
      className={className}
    >
      {label}
    </InlineBadge>
  );
}

/**
 * "Limited time offer" pill with an optional countdown to the
 * expiry. The countdown updates once per second and stops the
 * interval cleanly when the badge unmounts.
 */
export function LimitedTimeOfferBadge({
  expiresAt,
  className,
}: {
  /** ISO-8601 string or Date. When omitted the badge still renders. */
  expiresAt?: string | Date;
  className?: string;
}) {
  const target = expiresAt
    ? typeof expiresAt === "string"
      ? new Date(expiresAt)
      : expiresAt
    : null;

  const [remaining, setRemaining] = useState<string | null>(() =>
    target ? formatRemaining(target.getTime() - Date.now()) : null,
  );

  useEffect(() => {
    if (!target) return;
    const tick = () =>
      setRemaining(formatRemaining(target.getTime() - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  // If the offer has already expired, hide the badge.
  if (target && target.getTime() <= Date.now()) return null;

  return (
    <InlineBadge tone="bg-amber-100 text-amber-800" className={className}>
      Limited offer{remaining ? ` · ${remaining}` : ""}
    </InlineBadge>
  );
}

/**
 * "Many viewing now" pill — triggers above a viewer count or can be
 * forced on by an admin override. Caller passes a count (typed) and
 * optional override boolean.
 */
export function ManyViewingNowBadge({
  viewers,
  threshold = 10,
  manualOverride = false,
  className,
}: {
  viewers: number;
  /** Threshold above which the badge appears. PDF default: ≥10. */
  threshold?: number;
  /** Force the badge on regardless of `viewers`. */
  manualOverride?: boolean;
  className?: string;
}) {
  if (!manualOverride && viewers < threshold) return null;
  return (
    <InlineBadge tone="bg-sky-100 text-sky-700" className={className}>
      🔥 {viewers}+ viewing now
    </InlineBadge>
  );
}

/**
 * "Save N currency" pill — absolute (non-percent) discount, sibling
 * of the existing `DiscountBadge`. Caller passes the numeric amount
 * and a currency symbol (defaults to "Ar" per Madagascar).
 */
export function SaveValueBadge({
  amount,
  currency = "Ar",
  className,
}: {
  amount: number;
  /** Currency symbol. Defaults to Ariary. */
  currency?: string;
  className?: string;
}) {
  if (amount <= 0) return null;
  return (
    <InlineBadge tone="bg-emerald-100 text-emerald-800" className={className}>
      Save{" "}
      <span className="font-currency">
        {currency} {amount.toLocaleString()}
      </span>
    </InlineBadge>
  );
}

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

function formatRemaining(ms: number): string {
  if (ms <= 0) return "ended";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  return `${seconds}s`;
}
