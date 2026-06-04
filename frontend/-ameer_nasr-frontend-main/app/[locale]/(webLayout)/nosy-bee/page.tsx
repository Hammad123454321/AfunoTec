import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import Container from "@/components/layout/Container";
import HotelSearch from "@/features/search/components/HotelSearch";
import ProductExplore, {
  type ExploreCard,
} from "@/features/product/components/ProductExplore";
import SortWidget from "@/features/search/components/SortWidget";
import { nosyBeOverviewData } from "@/features/product/data";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import crypto from "crypto";
import NosyBeeFilterSidebar from "./_components/NosyBee";
import NosyBeeFilterSidebarMobile from "./_components/NosyBeeFilterSidebarMobile";

// Nosy Be is a destination meta-category — its 4 explore tiles point
// to the four sub-services available on the island (Stays, Things to
// do, Travels packages, Transportation) so users can drill into any
// type of booking without leaving the destination.
const NOSY_BE_TILES: ReadonlyArray<ExploreCard> = [
  { topText: "", bottomText: "Stays", imgSrc: "/explore/family.png" },
  { topText: "", bottomText: "Things to do", imgSrc: "/explore/weekend.png" },
  {
    topText: "",
    bottomText: "Travels and packages",
    imgSrc: "/explore/inclusive.png",
  },
  {
    topText: "",
    bottomText: "Transportation",
    imgSrc: "/explore/meal.png",
  },
];

export default function NosyBePage() {
  return (
    <Section
      title={
        <div className="uppercase">
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Nosy
          </span>{" "}
          <TextPrimary500>
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
              Be
            </span>
          </TextPrimary500>
        </div>
      }
    >
      <Container>
        <HotelSearch />

        <ProductExplore activities={NOSY_BE_TILES} variant="amber" />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex gap-4 z-50">
            {/* Mobile Filter - Only shows on mobile */}
            <NosyBeeFilterSidebarMobile />

            {/* Desktop Filter - Only shows on desktop (lg and above) */}
            <div className="hidden lg:block">
              <NosyBeeFilterSidebar />
            </div>
          </div>

          {/* Right Side: Search Bar + Card List */}
          <div className="flex-1 flex flex-col gap-6 z-30">
            <SortWidget />

            {nosyBeOverviewData.map((item) => (
              <div
                key={crypto.randomUUID()}
                className="flex flex-col gap-2 transition-transform duration-300"
              >
                <ProductOverviewCard data={item} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
