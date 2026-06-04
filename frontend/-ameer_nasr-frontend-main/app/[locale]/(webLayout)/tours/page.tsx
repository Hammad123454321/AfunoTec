import Container from "@/components/layout/Container";
import ProductExplore, {
  type ExploreCard,
} from "@/features/product/components/ProductExplore";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SortWidget from "@/features/search/components/SortWidget";
import { adData, toursOverviewData } from "@/features/product/data";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import crypto from "crypto";
import ToursFilterSidebar from "./_components/ToursFilter";
import SearchOption from "./_components/SearchOption";
import TourssFilterSidebarMobile from "./_components/ToursFilterSidebarMobile";

// Four tour-category tiles per the Tours Figma. Same single-label
// amber treatment as Stays / Things to Do.
const TOUR_ACTIVITIES: ReadonlyArray<ExploreCard> = [
  {
    topText: "",
    bottomText: "Adventure and discovery tours",
    imgSrc: "/explore/family.png",
  },
  {
    topText: "",
    bottomText: "Island and coastal tours",
    imgSrc: "/explore/weekend.png",
  },
  {
    topText: "",
    bottomText: "Eco and wildlife expedition",
    imgSrc: "/explore/meal.png",
  },
  {
    topText: "",
    bottomText: "Cultural and historical tours",
    imgSrc: "/explore/inclusive.png",
  },
];

export default function ToursPage() {
  const productData = toursOverviewData.flatMap((item, index) => {
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
            Tours &
          </span>{" "}
          <TextPrimary500>
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
              Eco Tourism
            </span>
          </TextPrimary500>
        </div>
      }
    >
      <Container>
        <SearchOption />

        <ProductExplore activities={TOUR_ACTIVITIES} variant="amber" />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex gap-4 z-50">
            {/* Mobile Filter - Only shows on mobile */}
            <TourssFilterSidebarMobile />

            {/* Desktop Filter - Only shows on desktop (lg and above) */}
            <div className="hidden lg:block">
              <ToursFilterSidebar />
            </div>
          </div>

          {/* Right Side: Search Bar + Card List */}
          <div className="flex-1 flex flex-col gap-6 z-30">
            <SortWidget />

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
