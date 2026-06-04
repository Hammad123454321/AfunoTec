import { cn } from "@/lib/utils";

/**
 * Color tone for the ribbon. Keys map to a `{ bg, text }` Tailwind
 * pair so the consumer doesn't have to know the design tokens. Add
 * more here as the design system grows — never expose raw `bg-*`
 * strings to the consumer; that would leak the implementation.
 */
const TONES = {
  rose: { bg: "bg-rose-600", text: "text-white" },
  emerald: { bg: "bg-emerald-600", text: "text-white" },
  amber: { bg: "bg-amber-500", text: "text-amber-950" },
  sky: { bg: "bg-sky-600", text: "text-white" },
} as const;

type Tone = keyof typeof TONES;

export type DiscountRibbonProps = {
  /** Discount percent — rendered as `${percentage}% off`. */
  percentage: number;
  /** Word shown after the percentage. Defaults to "Off". */
  label?: string;
  /** Color tone — defaults to "rose" to match the AfunoTec listing cards. */
  tone?: Tone;
  /**
   * Corner the ribbon lives in. Defaults to top-right because that's
   * the canonical placement; reverse direction for `top-left`.
   */
  corner?: "top-right" | "top-left";
  /** Optional extra Tailwind classes on the outer clipping square. */
  className?: string;
};

/**
 * Corner ribbon for displaying a discount badge. Drop it into any
 * `position: relative` container; it pins to the chosen corner via
 * `position: absolute` and is decorative (pointer-events: none) so it
 * never intercepts clicks meant for the card.
 *
 *   <article className="relative">
 *     ...
 *     <DiscountRibbon percentage={25} />
 *   </article>
 *
 * The shape is built with the standard "overflow-hidden square +
 * rotated rectangle" technique (see css-tricks.com/snippets/css/corner-ribbon/).
 * No clip-path or pseudo-elements required — works in every browser
 * Next.js targets and survives carousel re-renders / responsive
 * reflows because the geometry is fully self-contained.
 */
export default function DiscountRibbon({
  percentage,
  label = "Off",
  tone = "rose",
  corner = "top-right",
  className,
}: DiscountRibbonProps) {
  if (!Number.isFinite(percentage) || percentage <= 0) return null;

  const { bg, text } = TONES[tone];
  const isLeft = corner === "top-left";

  return (
    <div
      aria-hidden
      className={cn(
        "absolute top-0 z-20 w-[90px] h-[90px] overflow-hidden pointer-events-none",
        isLeft ? "left-0" : "right-0",
        className,
      )}
    >
      <span
        className={cn(
          "absolute block w-[140px] py-1 text-center text-[11px] font-bold uppercase tracking-wider shadow-md",
          bg,
          text,
          // Pinned outside the clipping square so the visible portion
          // forms a tight diagonal strip exactly hugging the corner.
          isLeft
            ? "-left-[35px] top-[18px] -rotate-45"
            : "-right-[35px] top-[18px] rotate-45",
        )}
      >
        {percentage}% {label}
      </span>
    </div>
  );
}
