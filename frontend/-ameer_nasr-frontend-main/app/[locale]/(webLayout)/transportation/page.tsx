import Container from "@/components/layout/Container";
import ProductExplore, {
  type ExploreCard,
} from "@/features/product/components/ProductExplore";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SortWidget from "@/features/search/components/SortWidget";
import { transportationOverviewData } from "@/features/product/data";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import crypto from "crypto";
import TransportationFilterSidebar from "./_components/TransportationFilter";
import TransportationFilterSidebarMobile from "./_components/TransportationFilterSidebarMobile";
import NotFoundFlightSearch from "./_components/NotFoundFlightSearch";

// Four transportation-type tiles per the Figma. Same single-label
// amber treatment as the other category landings.
const TRANSPORTATION_TILES: ReadonlyArray<ExploreCard> = [
  {
    topText: "",
    bottomText: "Car Rental",
    imgSrc: "/explore/family.png",
  },
  {
    topText: "",
    bottomText: "Airport Transfers",
    imgSrc: "/explore/weekend.png",
  },
  {
    topText: "",
    bottomText: "Taxi within city",
    imgSrc: "/explore/inclusive.png",
  },
  {
    topText: "",
    bottomText: "Transport Around the Island",
    imgSrc: "/explore/meal.png",
  },
];

export default function TransportationPage() {
  // Transportation Figma omits the AD banner between rows that the other
  // listings have — render straight through.
  const productData = transportationOverviewData;
  return (
    <Section
      title={
        <div className="uppercase">
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Transportation &
          </span>{" "}
          <TextPrimary500>
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
              Car Rental
            </span>
          </TextPrimary500>
        </div>
      }
    >
      <Container>
        <ProductExplore activities={TRANSPORTATION_TILES} variant="amber" />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex gap-4 z-50">
            {/* Mobile Filter - Only shows on mobile */}
            <TransportationFilterSidebarMobile />

            {/* Desktop Filter - Only shows on desktop (lg and above) */}
            <div className="hidden lg:block">
              <TransportationFilterSidebar />
            </div>
          </div>

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

        {/* Fallback flight-style search shown when no transportation
            matches the user's filters. */}
        <NotFoundFlightSearch />
      </Container>
    </Section>
  );
}
