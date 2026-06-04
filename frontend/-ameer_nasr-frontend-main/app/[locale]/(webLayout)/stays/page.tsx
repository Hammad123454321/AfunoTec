import { adData, productOverviewData } from "@/features/product/data";
import { TextPrimary500 } from "@/components/Text";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import HotelSearch from "@/features/search/components/HotelSearch";
import ProductExplore, {
  type ExploreCard,
} from "@/features/product/components/ProductExplore";
import SortWidget from "@/features/search/components/SortWidget";
import StaysFilterSidebar from "./_components/StaysFilter";
import StaysFilterSidebarMobile from "./_components/StaysFilterSidebarMobile";

// Figma "Stays" landing has four accommodation-type tiles (Hotels /
// Apartments / Villas / Lodges) with big orange overlay text. Same
// ExploreCard shape, single-line label rendered as `bottomText` and
// the `topText` left blank so we get one big word per tile.
const STAYS_ACCOMMODATION_TILES: ReadonlyArray<ExploreCard> = [
  { topText: "", bottomText: "Hotels", imgSrc: "/explore/family.png" },
  { topText: "", bottomText: "Apartments", imgSrc: "/explore/weekend.png" },
  { topText: "", bottomText: "Villas", imgSrc: "/explore/inclusive.png" },
  { topText: "", bottomText: "Lodges", imgSrc: "/explore/meal.png" },
];

export default function HotelsPage() {
  const productData = productOverviewData.flatMap((item, index) => {
    if (index >= 4 && index % 4 === 0) {
      return [adData, item];
    }
    return item;
  });

  return (
    <Section
      title={
        <div className="uppercase">
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Hotels, Apartments
          </span>{" "}
          <TextPrimary500>
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
              and Lodges
            </span>
          </TextPrimary500>
        </div>
      }
    >
      <Container>
        <HotelSearch />

        <ProductExplore
          activities={STAYS_ACCOMMODATION_TILES}
          variant="amber"
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex gap-4 z-50">
            {/* Mobile Filter - Only shows on mobile */}
            <StaysFilterSidebarMobile />

            {/* Desktop Filter - Only shows on desktop (lg and above) */}
            <div className="hidden lg:block">
              <StaysFilterSidebar />
            </div>
          </div>

          {/* Right Side: Search Bar + Card List */}
          <div className="flex-1 flex flex-col gap-6 z-30">
            <SortWidget />

            {/* Result cards */}
            {productData.map((item) => (
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
