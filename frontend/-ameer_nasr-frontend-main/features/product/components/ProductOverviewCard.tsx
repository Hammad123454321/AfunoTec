import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductAdType, ProductOverviewDataType } from "../types/product.types";
import { ProductCarousel } from "./ProductCarousel";
import { LucideMapPin, Star, Heart } from "lucide-react";
import ProductAd from "./ProductAd";
import ProductLink from "./ProductLink";
import Link from "next/link";
import DiscountRibbon from "@/components/DiscountRibbon";

/**
 * Map of the `offers` string returned by the product feed to its
 * visual treatment. Matches the Figma stays-listing chips exactly.
 */
const OFFER_STYLES: Record<string, string> = {
  "Limited Offer": "bg-emerald-500 text-white",
  "Low Room": "bg-rose-500 text-white",
  "Save 10% Off": "bg-amber-500 text-white",
};

/** Render five stars filled per the rating value (supports half stars). */
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span key={i} className="relative inline-block leading-none">
            <Star
              size={size}
              className="fill-gray-200 text-gray-200"
              aria-hidden
            />
            {(filled || half) && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star
                  size={size}
                  className="fill-yellow-400 text-yellow-400"
                  aria-hidden
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function ProductOverviewCard({
  data,
}: {
  data: ProductOverviewDataType | ProductAdType;
}) {
  const isOverviewData = (
    d: ProductOverviewDataType | ProductAdType,
  ): d is ProductOverviewDataType => "images" in d && "badges" in d;

  if (!isOverviewData(data)) {
    return (
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl z-50 mb-6">
        <ProductAd data={data} />
      </div>
    );
  }

  // Figma tag row: first badge is the highlighted orange "category" chip
  // (e.g. WATER & SEA), middle badges are pipe-separated gray text, and
  // the `location` value is pinned to the right as a blue chip (East /
  // North / South / etc).
  const [primaryBadge, ...inlineBadges] = data.badges;
  const locationBadge = data.location;
  const offerStyle =
    data.offers && OFFER_STYLES[data.offers] ? OFFER_STYLES[data.offers] : null;

  return (
    <div className="relative overflow-hidden bg-white border border-gray-200 rounded-lg z-10 flex flex-col md:flex-row mb-4 sm:mb-6">
      {/* DiscountRibbon attaches to the whole card, not the image, so
          the corner fold is consistent regardless of carousel state. */}
      {!!data.discount && (
        <DiscountRibbon
          percentage={Number(data.discount)}
          label="Off"
          tone="rose"
        />
      )}

      {/* Image Section */}
      <div className="relative w-full md:w-[230px] lg:w-[260px] shrink-0 h-44 sm:h-52 md:h-auto md:min-h-[200px]">
        <ProductCarousel
          items={data.images.map((image, index) => ({
            image,
            id: index.toString(),
          }))}
          itemClassName="basis-full overflow-hidden"
          showDots={true}
          showNavigation={false}
          autoplay={true}
          renderItem={(item) => (
            <div className="relative w-full h-44 sm:h-52 md:h-full md:min-h-[200px] overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                fill
                sizes="(min-width: 768px) 260px, 100vw"
                src={item.image}
                alt={data.title}
              />

              {/* Heart Button — pinned over each slide so it stays in
                  the same place as the user pages through the carousel. */}
              <button
                type="button"
                className="absolute top-3 left-3 z-20 w-8 h-8 flex items-center justify-center bg-white/85 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                aria-label="Save to wishlist"
              >
                <Heart
                  size={16}
                  className="text-gray-500 hover:text-rose-500"
                />
              </button>
            </div>
          )}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-5 bg-white min-w-0">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2 shrink-0">
          <StarRating rating={data.rating} />
          {typeof data.score === "number" && (
            <span className="text-xs text-gray-500 font-medium">
              {data.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mb-2">
          <ProductLink href={`${data.id}`}>
            <h3 className="text-base sm:text-lg md:text-xl text-left uppercase font-semibold text-[#1f7be0] hover:underline transition-all leading-snug">
              {data.title}
            </h3>
          </ProductLink>
        </div>

        {/* Tag row: highlighted primary chip + pipe-separated badges +
            blue location chip pinned right. */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3 text-xs">
          {primaryBadge && (
            <span className="bg-amber-400 text-amber-900 px-2.5 py-1 rounded font-bold uppercase text-[10px] tracking-wider">
              {primaryBadge}
            </span>
          )}
          {inlineBadges.map((badge, idx) => (
            <span
              key={idx}
              className="flex items-center gap-2 text-gray-500"
            >
              <span className="text-gray-300" aria-hidden>
                |
              </span>
              <span>{badge}</span>
            </span>
          ))}
          {locationBadge && (
            <span className="ml-auto bg-[#1f7be0] text-white px-3 py-0.5 rounded text-[11px] font-semibold">
              {locationBadge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-left text-sm leading-relaxed mb-3 line-clamp-2">
          {data.description}
        </p>

        {/* Footer: pin + location + Show map + stars + numeric rating
            + status chip; price column on the right. */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-600 text-sm">
            <LucideMapPin size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-700">{locationBadge},</span>
            <Link
              target="_blank"
              href={`${data.mapLink}`}
              className="text-[#1f7be0] underline hover:opacity-80"
            >
              Show map
            </Link>
            <StarRating rating={data.rating} size={13} />
            <span className="text-xs font-semibold text-gray-700">
              {data.rating.toFixed(1)}
            </span>
            {offerStyle && (
              <span
                className={cn(
                  "ml-2 px-3 py-1 rounded text-xs font-semibold",
                  offerStyle,
                )}
              >
                {data.offers}
              </span>
            )}
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="flex items-baseline sm:justify-end gap-2">
              <span className="text-gray-500 text-xs">As From</span>
              <span className="text-base sm:text-lg font-bold leading-none text-[#1f7be0]">
                Ar {data.price.toLocaleString()}
              </span>
            </div>
            {data.oldPrice > data.price && (
              <div className="flex items-baseline sm:justify-end gap-2 mt-1">
                <span className="text-gray-400 text-xs">As From</span>
                <span className="text-rose-500 text-xs line-through">
                  Ar {data.oldPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type BadgeProps = {
  isActive?: boolean;
} & React.ComponentProps<"span">;

export function Badge({ children, isActive, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-sm font-medium border-l-2 border-l-warning-500",
        isActive ? "bg-warning-500 text-white" : "bg-gray-200 text-gray-800",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
