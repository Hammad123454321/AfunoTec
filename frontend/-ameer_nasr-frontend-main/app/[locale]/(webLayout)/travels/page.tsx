import Image from "next/image";
import Link from "next/link";
import { Cairo } from "next/font/google";
import { Download } from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SearchOptionTravel from "./_components/SearchOptionTravel";
import TwoDestinationsBanner from "./_components/TwoDestinationsBanner";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
});

// Figma source data. Once the backend lands these become rows in the
// `travel_destinations` table.

type DestinationTile = {
  name: string;
  imgSrc: string;
  href: string;
  /** Faded / coming-soon style used by the 4 tiles after the main grid. */
  muted?: boolean;
};

const TRENDING_PACKAGES: ReadonlyArray<{ id: string; imgSrc: string; alt: string }> = [
  { id: "trending-1", imgSrc: "/travels/img1.jpg", alt: "Burj Al Arab Dubai" },
  { id: "trending-2", imgSrc: "/travels/img3.jpg", alt: "Modern city skyline" },
  { id: "trending-3", imgSrc: "/travels/img4.png", alt: "Hot air balloons Cappadocia" },
  { id: "trending-4", imgSrc: "/travels/img5.png", alt: "Reflective temple" },
];

const DESTINATIONS: ReadonlyArray<DestinationTile> = [
  { name: "Dubai", imgSrc: "/travels/img1.jpg", href: "/travels/dubai" },
  { name: "South East Asia", imgSrc: "/travels/img3.jpg", href: "/travels/asia" },
  { name: "Turkey", imgSrc: "/travels/img4.png", href: "/travels/turkey" },
  { name: "Bali", imgSrc: "/travels/img5.png", href: "/travels/bali" },
  { name: "Africa", imgSrc: "/travels/img7.png", href: "/travels/africa" },
  { name: "Europe", imgSrc: "/travels/img18.png", href: "/travels/europe" },
  { name: "India", imgSrc: "/travels/img14.png", href: "/travels/india" },
  { name: "Asia", imgSrc: "/travels/img4.png", href: "/travels/asia" },
  { name: "Indian Ocean", imgSrc: "/travels/img5.png", href: "/travels/indian-ocean" },
  { name: "Europamundo", imgSrc: "/travels/img6.png", href: "/travels/europamundo" },
  { name: "Middle East & North Africa", imgSrc: "/travels/img7.png", href: "/travels/mena" },
  { name: "Rodrigues", imgSrc: "/travels/img8.png", href: "/travels/rodrigues" },
  { name: "Indian Ocean", imgSrc: "/travels/img20.png", href: "/travels/indian-ocean-2" },
  { name: "Cruise", imgSrc: "/travels/img10.png", href: "/travels/cruise" },
  { name: "Religious", imgSrc: "/travels/img12.png", href: "/travels/religious" },
  { name: "Prestige", imgSrc: "/travels/img17.png", href: "/travels/prestige" },
];

// The four faded tiles that sit below the main grid. Figma renders them
// at reduced opacity, implying they're upcoming categories.
const UPCOMING_TILES: ReadonlyArray<DestinationTile> = [
  {
    name: "North & South America",
    imgSrc: "/travels/img13.png",
    href: "/travels/americas",
    muted: true,
  },
  {
    name: "Exceptional Experiences",
    imgSrc: "/travels/img17.png",
    href: "/travels/exceptional",
    muted: true,
  },
  {
    name: "Events & Concert",
    imgSrc: "/travels/img15.png",
    href: "/travels/events",
    muted: true,
  },
  {
    name: "Christmas & New Year",
    imgSrc: "/travels/img9.png",
    href: "/travels/christmas",
    muted: true,
  },
];

function DestinationCard({ destination }: { destination: DestinationTile }) {
  return (
    <Link
      href={destination.href}
      className="relative w-full max-w-[312px] h-[210px] sm:h-[240px] md:h-[283px] overflow-hidden group block"
 
    >
      <Image
        src={destination.imgSrc}
        alt={destination.name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
          destination.muted ? "opacity-60" : ""
        }`}
      />
      {/* Semi-transparent label panel pinned to the top of each tile,
          per the Figma. */}
      <div className="absolute inset-x-0 top-1 bg-black/35 backdrop-blur-[1px] px-3 py-2.5">
        <span
          className={`${cairo.className} text-white text-lg sm:text-2xl md:text-3xl drop-shadow`}
        >
          {destination.name}
        </span>
      </div>
    </Link>
  );
}

export default function TravelsPage() {
  return (
    <Section
      className="max-w-[1321px] mx-auto w-full px-4 sm:px-6 lg:px-8"
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
        {/* Search bar */}
        <SearchOptionTravel />

        {/* "Two Destinations, One Unforgettable Journey" carousel.
            Client component so the prev/next arrows actually cycle
            through slides on the frontend. */}
        <TwoDestinationsBanner />

        {/* Trending Packages — 4 small thumbnail tiles, no text.
            Figma sizes them roughly as 1/4 of the row at ~140px tall
            on desktop; we use a max-width on the row + smaller tiles
            so they don't bleed across the full container. */}
        <div className="mt-8 sm:mt-12">
          <h2
            className={`${cairo.className} text-center text-lg sm:text-xl md:text-3xl font-semibold text-gray-900 mb-8 sm:mb-11`}
          >
            Trending Packages
          </h2>
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {TRENDING_PACKAGES.map((item) => (
              <div
                key={item.id}
                className="relative h-20 sm:h-24 md:h-28 lg:w-[312px] lg:h-[283px] overflow-hidden group cursor-pointer"
                style={{ maxWidth: "100%" }}
              >
                <Image
                  src={item.imgSrc}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 312px, (min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
    
        </div>

        {/* Main destination grid — 4 columns × 4 rows = 16 tiles */}
        <div className="mt-10 sm:mt-14 lg:mt-[168px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
   
          {DESTINATIONS.map((dest) => (
            <DestinationCard key={`${dest.name}-${dest.href}`} destination={dest} />
          ))}
        </div>

        {/* Upcoming faded tiles */}
        <div className="mt-6 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {UPCOMING_TILES.map((dest) => (
            <DestinationCard key={dest.name} destination={dest} />
          ))}
        </div>

        {/* Exceptional Experiences download banner — italic eyebrow +
            bold uppercase headline + small year badge + DOWNLOAD pill.
            Per the Figma the heading block sits left-of-center and the
            background is a darkened castle/landmark image. */}
        <div className="mt-16 sm:24 md:mt-40 relative overflow-hidden h-44 sm:h-52 md:h-60">
          <Image
            src="/travels/img17.png"
            alt="Exceptional Experiences 2025-26"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-6 sm:px-10 md:px-16 max-w-md">
            <div>
              <p className="text-white italic font-light text-base sm:text-lg leading-none mb-1 [font-family:cursive]">
                Exceptional
              </p>
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.15em] uppercase leading-none">
                Experiences
              </h2>
              <p className="text-white/85 text-xs sm:text-sm mt-1 tracking-widest">
                2025-26
              </p>
            </div>
            <button
              type="button"
              className="bg-white text-gray-900 px-6 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
