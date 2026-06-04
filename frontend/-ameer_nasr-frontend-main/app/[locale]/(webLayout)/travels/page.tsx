import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SearchOptionTravel from "./_components/SearchOptionTravel";

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
      className="relative h-44 sm:h-48 md:h-52 rounded-lg overflow-hidden group block"
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
      <div className="absolute inset-x-0 top-0 bg-black/35 backdrop-blur-[1px] px-3 py-2.5">
        <span className="text-white text-base sm:text-lg font-semibold drop-shadow">
          {destination.name}
        </span>
      </div>
    </Link>
  );
}

export default function TravelsPage() {
  return (
    <Section
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

        {/* "Two Destinations, One Unforgettable Journey" banner with
            left/right carousel arrows. Placeholder for the real banner
            once the design team supplies the artwork. */}
        <div className="relative mt-10 sm:mt-12 rounded-xl overflow-hidden h-44 sm:h-56 md:h-72">
          <Image
            src="/travels/img11.png"
            alt="Two destinations banner"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-center px-6">
              Two Destinations, One Unforgettable Journey.
            </h2>
          </div>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700 shadow"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700 shadow"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Trending Packages — 4 small image tiles, no text */}
        <div className="mt-10 sm:mt-14">
          <h2 className="text-center text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
            Trending Packages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {TRENDING_PACKAGES.map((item) => (
              <div
                key={item.id}
                className="relative h-32 sm:h-36 md:h-40 rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.imgSrc}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main destination grid — 4 columns × 4 rows = 16 tiles */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {DESTINATIONS.map((dest) => (
            <DestinationCard key={`${dest.name}-${dest.href}`} destination={dest} />
          ))}
        </div>

        {/* Upcoming faded tiles */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {UPCOMING_TILES.map((dest) => (
            <DestinationCard key={dest.name} destination={dest} />
          ))}
        </div>

        {/* Exceptional Experiences download banner */}
        <div className="mt-10 sm:mt-14 relative rounded-xl overflow-hidden h-44 sm:h-52 md:h-60">
          <Image
            src="/travels/img17.png"
            alt="Exceptional Experiences 2025-26"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 px-6 sm:px-10 md:px-16">
            <div>
              <p className="text-white italic font-light text-sm sm:text-base">
                Exceptional
              </p>
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider uppercase">
                Experiences
              </h2>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                2025-26
              </p>
            </div>
            <button
              type="button"
              className="bg-white text-gray-900 px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Download size={14} /> DOWNLOAD
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
