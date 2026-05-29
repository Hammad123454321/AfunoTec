import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import Filter from "@/features/filter/components/Filter";
import ProductExplore from "@/features/product/components/ProductExplore";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import { productOverviewData } from "@/features/product/data";
import HotelSearch from "@/features/search/components/HotelSearch";
import SortWidget from "@/features/search/components/SortWidget";
import EventFilterSidebar from "./_components/cultureFilter";

export default function CulturePage() {
  return (
    <Section
      title={
        <div className="underline uppercase">
          <TextPrimary500> Culture</TextPrimary500>
        </div>
      }
    >
      <Container>
        <HotelSearch />
        <ProductExplore />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <EventFilterSidebar />

          <div className="flex-1 flex flex-col gap-6">
            <SortWidget />

            {productOverviewData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 shadow transition-transform duration-300 "
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
