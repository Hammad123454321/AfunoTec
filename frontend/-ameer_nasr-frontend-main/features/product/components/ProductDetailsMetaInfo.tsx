"use client";

import { Heart, Share2, MapPin, Star } from "lucide-react";
import Container from "@/components/layout/Container";

export type ProductDetailsMetaInfoProps = {
  /** Uppercase title rendered as the page's H1. */
  title: string;
  /** Star rating 0–5; renders one filled star per integer. */
  rating?: number;
  /** Optional cyan subtitle row (e.g. "BOAT TRANSFERS + LUNCH BUFFET + ..."). */
  subtitle?: string;
  /**
   * Long description paragraph. Hotel pages always have one; activity
   * detail pages may omit it because the description lives below the
   * subtitle row.
   */
  description?: string;
  /**
   * Right-column checkmark feature list. Pass an empty array (or omit)
   * to hide the right column entirely, which makes the title block
   * span full width — the Things to Do detail layout uses this.
   */
  features?: ReadonlyArray<string>;
};

const HOTEL_DEFAULTS: Required<Pick<ProductDetailsMetaInfoProps, "rating" | "features">> & {
  description: string;
} = {
  rating: 5,
  description:
    "The newly renovated Hotel Riu Turquoise in Mauritius is the ultimate destination for a family holiday on the stunning beaches of Le Morne peninsula.",
  features: [
    "Air Service Available",
    "Beachfront Hotel",
    "Pool with Kid's Club",
    "Swimming Pool",
    "Entertainment programmes",
    "Restaurants + Bars",
  ],
};

type IconButtonProps = {
  icon: React.ReactNode;
  label: string;
  variant: "map" | "wishlist" | "share";
  onClick?: () => void;
};

function ActionButton({ icon, label, variant, onClick }: IconButtonProps) {
  const tone = {
    map: "text-emerald-600",
    wishlist: "text-rose-500",
    share: "text-sky-500",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors"
    >
      <span className={tone}>{icon}</span>
      {label}
    </button>
  );
}

export default function ProductDetailsMetaInfo({
  title = "RIU TURQUOISE MAURITIUS - ALL INCLUSIV",
  rating = HOTEL_DEFAULTS.rating,
  subtitle,
  description = HOTEL_DEFAULTS.description,
  features = HOTEL_DEFAULTS.features,
}: Partial<ProductDetailsMetaInfoProps> = {}) {
  const hasRightColumn = features && features.length > 0;
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-100">
      <Container>
        <div
          className={
            hasRightColumn
              ? "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10"
              : "grid grid-cols-1 gap-6"
          }
        >
          {/* Left column: title, rating, subtitle, action row, description. */}
          <div className={hasRightColumn ? "lg:col-span-2" : ""}>
            {/* Title block: rating + action buttons row, then the H1. */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#f59e0b] text-[#f59e0b]"
                    aria-hidden
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <ActionButton
                  icon={<MapPin size={16} aria-hidden />}
                  label="View Map"
                  variant="map"
                />
                <ActionButton
                  icon={<Heart size={16} aria-hidden />}
                  label="Wishlist"
                  variant="wishlist"
                />
                <ActionButton
                  icon={<Share2 size={16} aria-hidden />}
                  label="Share"
                  variant="share"
                />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-bold uppercase tracking-tight text-gray-900 mb-3 leading-tight">
              {title}
            </h1>

            {/* Cyan tagline row — activity detail pages use this for
                package inclusions ("BOAT TRANSFERS + ..."); hotel
                pages typically omit it. */}
            {subtitle && (
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#1ba0e2] mb-4">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl">
                {description}
              </p>
            )}
          </div>

          {/* Right column: 2-column checkmark list (hotel pages only). */}
          {hasRightColumn && (
            <div className="lg:col-span-1">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-2 gap-x-4">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <span
                      className="mt-0.5 text-emerald-600 font-bold"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
