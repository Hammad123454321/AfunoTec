import Image from "next/image";
import Link from "next/link";
import { Cairo } from "next/font/google";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SearchOptionTravel from "../_components/SearchOptionTravel";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
});

// Per-category Figma 2 content: hero banner copy + main package
// grid + recommended-other-destinations footer. The data lookup is
// keyed by the slug from the URL; unknown slugs fall back to the
// generic copy.
type CategoryContent = {
  /** Section heading rendered above the grid, e.g. "Asia Package". */
  heading: string;
  /** Centered banner tagline (e.g. "IMMERSE IN Asian Cultures"). */
  bannerEyebrow: string;
  bannerHeadline: string;
  bannerImage: string;
  /** Destination tiles (12 in the Figma). */
  packages: ReadonlyArray<{ id: string; name: string; imgSrc: string }>;
};

const FALLBACK_RECOMMENDED: ReadonlyArray<{ name: string; imgSrc: string; href: string }> = [
  { name: "Indian Ocean", imgSrc: "/travels/img5.png", href: "/travels/indian-ocean" },
  { name: "Europamundo", imgSrc: "/travels/img6.png", href: "/travels/europamundo" },
  { name: "Middle East & North Africa", imgSrc: "/travels/img7.png", href: "/travels/mena" },
  { name: "Rodrigues", imgSrc: "/travels/img8.png", href: "/travels/rodrigues" },
];

const CATEGORIES: Record<string, CategoryContent> = {
  asia: {
    heading: "Asia Package",
    bannerEyebrow: "Immerse in",
    bannerHeadline: "Asian Cultures",
    bannerImage: "/travels/img4.png",
    packages: [
      { id: "asia-1", name: "Japan", imgSrc: "/travels/img4.png" },
      { id: "asia-2", name: "Best Of Vietnam", imgSrc: "/travels/img11.png" },
      { id: "asia-3", name: "Capitals of Japan", imgSrc: "/travels/img15.png" },
      { id: "asia-4", name: "Capitals of Korea", imgSrc: "/travels/img14.png" },
      { id: "asia-5", name: "Seoul Highlights", imgSrc: "/travels/img14.png" },
      { id: "asia-6", name: "Chiang Mai, Thailand", imgSrc: "/travels/img11.png" },
      { id: "asia-7", name: "Gili Air, Indonesia", imgSrc: "/travels/img5.png" },
      { id: "asia-8", name: "Luang Prabang, Laos", imgSrc: "/travels/img3.png" },
      { id: "asia-9", name: "Balloon Flights Bagan", imgSrc: "/travels/img4.png" },
      { id: "asia-10", name: "Singapore", imgSrc: "/travels/img15.png" },
      { id: "asia-11", name: "Madina", imgSrc: "/travels/img7.png" },
      { id: "asia-12", name: "Malaysia", imgSrc: "/travels/img3.png" },
    ],
  },
  africa: {
    heading: "Africa Package",
    bannerEyebrow: "Discover",
    bannerHeadline: "African Adventures",
    bannerImage: "/travels/img7.png",
    packages: [
      { id: "africa-1", name: "South Africa", imgSrc: "/travels/img7.png" },
      { id: "africa-2", name: "Kenya Safari", imgSrc: "/travels/img11.png" },
      { id: "africa-3", name: "Tanzania", imgSrc: "/travels/img3.png" },
      { id: "africa-4", name: "Morocco", imgSrc: "/travels/img4.png" },
      { id: "africa-5", name: "Egypt", imgSrc: "/travels/img14.png" },
      { id: "africa-6", name: "Namibia", imgSrc: "/travels/img15.png" },
      { id: "africa-7", name: "Botswana", imgSrc: "/travels/img5.png" },
      { id: "africa-8", name: "Zimbabwe", imgSrc: "/travels/img18.png" },
      { id: "africa-9", name: "Rwanda Gorillas", imgSrc: "/travels/img20.png" },
      { id: "africa-10", name: "Senegal", imgSrc: "/travels/img17.png" },
      { id: "africa-11", name: "Mozambique", imgSrc: "/travels/img8.png" },
      { id: "africa-12", name: "Ethiopia", imgSrc: "/travels/img13.png" },
    ],
  },
  europe: {
    heading: "Europe Package",
    bannerEyebrow: "Explore",
    bannerHeadline: "European Classics",
    bannerImage: "/travels/img18.png",
    packages: [
      { id: "europe-1", name: "Paris", imgSrc: "/travels/img18.png" },
      { id: "europe-2", name: "Rome", imgSrc: "/travels/img11.png" },
      { id: "europe-3", name: "Barcelona", imgSrc: "/travels/img3.png" },
      { id: "europe-4", name: "Amsterdam", imgSrc: "/travels/img15.png" },
      { id: "europe-5", name: "Prague", imgSrc: "/travels/img14.png" },
      { id: "europe-6", name: "Vienna", imgSrc: "/travels/img5.png" },
      { id: "europe-7", name: "Budapest", imgSrc: "/travels/img4.png" },
      { id: "europe-8", name: "Lisbon", imgSrc: "/travels/img17.png" },
    ],
  },
};

// Generic sub-package names used for any slug that isn't in CATEGORIES.
// Each tile reads as `${variant} ${niceName}` so Dubai → "City Tour
// Dubai", "Desert Safari Dubai", etc. — never the bare slug repeated.
const FALLBACK_VARIANTS: ReadonlyArray<string> = [
  "City Tour",
  "Cultural Trip",
  "Adventure Escape",
  "Heritage Walk",
  "Family Holiday",
  "Honeymoon Getaway",
  "Group Tour",
  "Luxury Experience",
];

function getCategoryContent(slug: string): CategoryContent {
  const normalized = slug.toLowerCase();
  if (CATEGORIES[normalized]) return CATEGORIES[normalized];
  // Fallback for unknown slugs — render the same shell with the slug
  // tokenized as the heading so the route never 404s.
  const niceName = normalized
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    heading: `${niceName} Package`,
    bannerEyebrow: "Discover",
    bannerHeadline: niceName,
    bannerImage: "/travels/img11.png",
    packages: FALLBACK_VARIANTS.map((variant, i) => ({
      id: `${normalized}-${i + 1}`,
      name: `${variant} — ${niceName}`,
      imgSrc: "/travels/img11.png",
    })),
  };
}

export default async function TravelCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const content = getCategoryContent(slug);

  return (
    <Section
      className="max-w-[1315px] mx-auto w-full px-4 sm:px-6 lg:px-8"
      title={
        <div className="uppercase">
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Travels
          </span>{" "}
          <TextPrimary500>
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
              Deals
            </span>
          </TextPrimary500>
        </div>
      }
    >
      <Container>
        <SearchOptionTravel />

        {/* Hero banner with eyebrow + handwritten-style headline */}
        <div className="relative mt-10 sm:mt-12 overflow-hidden h-44 sm:h-56 md:h-72">
          <Image
            src={content.bannerImage}
            alt={content.bannerHeadline}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-y-0 left-6 sm:left-12 md:left-16 flex flex-col justify-center text-white">
            <p className="text-xs sm:text-sm uppercase tracking-widest opacity-90">
              {content.bannerEyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl italic font-light mt-1">
              {content.bannerHeadline}
            </h2>
          </div>
        </div>

        {/* Section heading + 4-col destination grid */}
        <h2
          className={`${cairo.className} text-center text-xl sm:text-2xl md:text-3xl lg:text-[35px] font-semibold text-gray-900 mt-10 sm:mt-14 sm:mb-10 mb-6`}
        >
          {content.heading}
        </h2>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {content.packages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/travels/${slug}/${pkg.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}`}
              className="bg-white overflow-hidden border border-gray-200 group cursor-pointer hover:shadow-md transition-shadow flex flex-col w-full max-w-[160px] h-[145px] sm:max-w-[176px] sm:h-[160px] md:max-w-[200px] md:h-[181px] lg:max-w-[248px] lg:h-[225px] xl:max-w-[312px] xl:h-[283px]"
            >
              <div className="relative flex-1 min-h-0">
                <Image
                  src={pkg.imgSrc}
                  alt={pkg.name}
                  fill
                  sizes="(min-width: 1280px) 312px, (min-width: 1024px) 248px, (min-width: 768px) 200px, (min-width: 640px) 176px, 160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-2 py-4 text-center shrink-0 bg-[#EFEFEF]">
                <span className="text-xl lg:text-lg md:text-base sm:text-sm lg:font-semibold font-medium text-gray-800">
                  {pkg.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More button */}
        <div className="flex justify-center mt-8 sm:mt-16">
          <button
            type="button"
            className="bg-[#22A628] hover:bg-[#1d8e22] text-white px-8 py-2.5 rounded-[10px] font-semibold text-[16px] transition-colors"
          >
            Load More
          </button>
        </div>

        {/* You might also like */}
        <h2
          className={`${cairo.className} text-center text-xl sm:text-2xl md:text-3xl lg:text-[35px] font-semibold text-gray-900 md:mt-26 mt-16 mb-6 sm:mb-11`}
        >
          You might also like
        </h2>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {FALLBACK_RECOMMENDED.map((dest) => (
            <Link
              key={dest.name}
              href={dest.href}
              className="relative overflow-hidden group block w-full max-w-[160px] h-[145px] sm:max-w-[176px] sm:h-[160px] md:max-w-[200px] md:h-[181px] lg:max-w-[248px] lg:h-[225px] xl:max-w-[312px] xl:h-[283px]"
            >
              <Image
                src={dest.imgSrc}
                alt={dest.name}
                fill
                sizes="(min-width: 1280px) 312px, (min-width: 1024px) 248px, (min-width: 768px) 200px, (min-width: 640px) 176px, 160px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/45 backdrop-blur-[3px] px-3 py-2">
                <span
                  className={`${cairo.className} text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl font-semibold drop-shadow`}
                >
                  {dest.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
