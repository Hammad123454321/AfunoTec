import Container from "@/components/layout/Container";
import ProductExplore, {
  type ExploreCard,
} from "@/features/product/components/ProductExplore";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SortWidget from "@/features/search/components/SortWidget";
import { workplacesOverviewData } from "@/features/product/data";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import crypto from "crypto";
import WorkPlaceFilterSidebar from "./_components/WorkPlaceFilter";
import SearchOptionWorkPlace from "./_components/SearchOptionWorkPlace";
import WorkPlaceFilterSidebarMobile from "./_components/WorkPlaceFilterSidebarMobile";

const WORKPLACE_TILES: ReadonlyArray<ExploreCard> = [
  { topText: "", bottomText: "Conference room", imgSrc: "/explore/family.png" },
  { topText: "", bottomText: "Office rental", imgSrc: "/explore/weekend.png" },
  { topText: "", bottomText: "Meeting room", imgSrc: "/explore/inclusive.png" },
  { topText: "", bottomText: "Co-working", imgSrc: "/explore/meal.png" },
];

export default function WorkPlacesPage() {
  return (
    <Section
      title={
        <div className="uppercase">
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Workplaces
          </span>{" "}
          <TextPrimary500>
            <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
              & Hubs
            </span>
          </TextPrimary500>
        </div>
      }
    >
      <Container>
        <SearchOptionWorkPlace />

        <ProductExplore activities={WORKPLACE_TILES} variant="amber" />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex gap-4 z-50">
            {/* Mobile Filter - Only shows on mobile */}
            <WorkPlaceFilterSidebarMobile />

            {/* Desktop Filter - Only shows on desktop (lg and above) */}
            <div className="hidden lg:block">
              <WorkPlaceFilterSidebar />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 z-30">
            <SortWidget />

            {workplacesOverviewData.map((item) => (
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
