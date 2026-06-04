import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import ProductExplore, {
  type ExploreCard,
} from "@/features/product/components/ProductExplore";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import { adData, thingsToDoOverviewData } from "@/features/product/data";
import SortWidget from "@/features/search/components/SortWidget";
import crypto from "crypto";
import ThingsToDoFilterSidebar from "./_componets/ThingsToDoFilter";
import LocationActivitySearch from "./_componets/SearchOption";
import ThingsToDoFilterSidebarMobile from "./_componets/ThingsToDoFilterSidebarMobile";

// Four activity-type tiles. "Day packages and recreational" is an
// offering type rather than a destination category, so it's surfaced
// via the filter sidebar instead of the tile row.
const THINGS_TO_DO_ACTIVITIES: ReadonlyArray<ExploreCard> = [
  {
    topText: "",
    bottomText: "Land & adventures experiences",
    imgSrc: "/explore/family.png",
  },
  {
    topText: "",
    bottomText: "Sea & coastal adventures",
    imgSrc: "/explore/weekend.png",
  },
  {
    topText: "",
    bottomText: "Eco tourism",
    imgSrc: "/explore/meal.png",
  },
  {
    topText: "",
    bottomText: "Wellness & leisure",
    imgSrc: "/explore/inclusive.png",
  },
];

export default function ActivitiesPage() {
  const productData = thingsToDoOverviewData.flatMap((item, index) => {
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
            Things
          </span>{" "}
          <TextPrimary500>
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
              To Do
            </span>
          </TextPrimary500>
        </div>
      }
    >
      <Container>
        <div className="max-w-4xl mx-auto">
          <LocationActivitySearch />
        </div>

        <ProductExplore
          activities={THINGS_TO_DO_ACTIVITIES}
          variant="amber"
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex gap-4 z-50">
            {/* Mobile Filter - Only shows on mobile */}
            <ThingsToDoFilterSidebarMobile />

            {/* Desktop Filter - Only shows on desktop (lg and above) */}
            <div className="hidden lg:block">
              <ThingsToDoFilterSidebar />
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
      </Container>
    </Section>
  );
}
