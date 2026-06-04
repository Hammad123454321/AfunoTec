import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import { eventsOverviewData } from "@/features/product/data";
import SortWidget from "@/features/search/components/SortWidget";
import EventFilterSidebar from "./_components/EventFilter";
import SearchOptionEvent from "./_components/SearchOptionEvent";
import EventFilterSidebarMobile from "./_components/EventFilterSidebarMobile";

// Events listing has no ProductExplore tile row per the Figma —
// users jump straight from search into the result list because event
// categories are richer than 4 tiles can express (they live in the
// filter sidebar instead).
export default function EventPage() {
  return (
    <Section
      title={
        <div className="uppercase">
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Events
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
        <div className="max-w-4xl mx-auto">
          <SearchOptionEvent />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <div className="flex gap-4 z-50">
            {/* Mobile Filter - Only shows on mobile */}
            <EventFilterSidebarMobile />

            {/* Desktop Filter - Only shows on desktop (lg and above) */}
            <div className="hidden lg:block">
              <EventFilterSidebar />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 z-30">
            <SortWidget />

            {eventsOverviewData.map((item) => (
              <div
                key={item.id}
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
