import Container from "@/components/layout/Container";
import ProductExplore from "@/features/product/components/ProductExplore";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SortWidget from "@/features/search/components/SortWidget";
import { adData, productOverviewData } from "@/features/product/data";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import WorkPlaceFilterSidebar from "./_components/WorkPlaceFilter";
import SearchOptionWorkPlace from "./_components/SearchOptionWorkPlace";
import WorkPlaceFilterSidebarMobile from "./_components/WorkPlaceFilterSidebarMobile";

export default function Page() {
  const productData = productOverviewData.flatMap((item, index) => {
    if (index >= 4 && index % 4 === 0) {
      return [adData, item];
    }
    return item;
  });
  return (
    <Section
      title={
        <div className="underline uppercase">
          Workplaces <TextPrimary500>& Hubs</TextPrimary500>
        </div>
      }
    >
      <Container>
        <SearchOptionWorkPlace />
        <ProductExplore />
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

            {productData.map((item) => {
              return (
                <div
                  key={crypto.randomUUID()}
                  className="flex flex-col gap-2 shadow transition-transform duration-300 "
                >
                  <ProductOverviewCard data={item} />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
