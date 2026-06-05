import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ExploreCard {
  /** Small text rendered above the headline. */
  topText: string;
  /** Headline displayed on the card. */
  bottomText: string;
  /** Image asset path under /public. */
  imgSrc: string;
}

/**
 * Default 4-card set used by the Stays landing page (PDF page 6).
 * Other category pages can override via the `activities` prop.
 */
const DEFAULT_ACTIVITIES: ReadonlyArray<ExploreCard> = [
  { topText: "This", bottomText: "Weekend", imgSrc: "/explore/weekend.png" },
  { topText: "All", bottomText: "Inclusive", imgSrc: "/explore/inclusive.png" },
  { topText: "Family", bottomText: "Friendly", imgSrc: "/explore/family.png" },
  { topText: "Free Meal", bottomText: "Upgrades", imgSrc: "/explore/meal.png" },
];

interface ProductExploreProps {
  /**
   * Override the cards rendered. Defaults to the Stays four-card set.
   * Things to Do passes the 5 specific labels from PDF page 8.
   */
  activities?: ReadonlyArray<ExploreCard>;
  /** Optional grid override; auto-picks based on the card count. */
  className?: string;
  /**
   * Visual variant for the overlay text. `default` renders white text
   * (used on the home page). `amber` renders the big orange/yellow
   * accommodation-type labels (Hotels / Apartments / Villas / Lodges)
   * shown on the Stays Figma frame.
   */
  variant?: "default" | "amber";
}

export default function ProductExplore({
  activities = DEFAULT_ACTIVITIES,
  className,
  variant = "default",
}: ProductExploreProps) {
  const gridCols =
    activities.length >= 5
      ? "lg:grid-cols-5"
      : activities.length === 4
        ? "lg:grid-cols-4"
        : "lg:grid-cols-3";

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10",
        gridCols,
        className,
      )}
    >
      {activities.map((item) => (
        <div
          key={`${item.topText}-${item.bottomText}`}
          className="relative group overflow-hidden shadow-sm h-28 sm:h-32 md:h-36 lg:h-40"
        >
          <Image
            src={item.imgSrc}
            alt={`${item.topText} ${item.bottomText}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />

          {/* Centered text content. Amber variant matches the Stays
              Figma — big bold orange/yellow word per tile, no eyebrow. */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-4 text-center",
              variant === "amber" ? "text-amber-400" : "text-white",
            )}
          >
            {item.topText && (
              <span className="text-[10px] sm:text-xs md:text-sm font-medium opacity-90 mb-0.5">
                {item.topText}
              </span>
            )}
            <span
              className={cn(
                "tracking-tight leading-tight",
                variant === "amber"
                  ? "text-sm sm:text-base md:text-lg lg:text-xl font-bold italic drop-shadow-md"
                  : "text-sm sm:text-base md:text-lg lg:text-xl font-serif font-semibold",
              )}
            >
              {item.bottomText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
