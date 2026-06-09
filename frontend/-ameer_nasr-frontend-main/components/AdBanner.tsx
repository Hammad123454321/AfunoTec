import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Canonical ad placement slots used across the storefront.
 *
 * Each landing page reserves two banner slots (PDF page 4). Admins
 * pick which creative fills each slot from the dashboard (M3 work).
 * Until then, callers can pass `imageUrl` / `href` directly so the
 * layout renders with a placeholder.
 */
export type AdPlacement =
  | "home_top"
  | "home_bottom"
  | "category_top"
  | "category_bottom"
  | "detail_top"
  | "detail_bottom";

type Props = {
  /** Where the banner sits on the page. Used by admin tooling later. */
  placement: AdPlacement;
  /** Banner image URL. Falls back to the bundled placeholder. */
  imageUrl?: string;
  /** Click target. If omitted the banner renders as a plain figure. */
  href?: string;
  /** Accessible label / alt text. */
  alt?: string;
  /** Optional Tailwind classes to tweak per-instance layout. */
  className?: string;
  /** Override the responsive aspect ratio. Default 5/1 (wide banner). */
  aspect?: string;
};

const PLACEHOLDER = "/ad.png";

export function AdBanner({
  placement,
  imageUrl,
  href,
  alt = "Sponsored",
  className,
  aspect = "aspect-[5/1]",
}: Props) {
  const src = imageUrl ?? PLACEHOLDER;

  const figure = (
    <figure
      data-ad-placement={placement}
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-gray-100",
        aspect,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="object-cover"
        // Banners come from admins/3rd-party creative; let Next.js know
        // they aren't critical-path.
        priority={false}
      />
    </figure>
  );

  if (!href) return figure;

  // External URLs (different host) get rel=noopener for safety.
  const isExternal = /^https?:\/\//i.test(href);
  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={alt}
    >
      {figure}
    </Link>
  );
}

export default AdBanner;
