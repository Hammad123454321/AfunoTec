import { adData, productOverviewData } from "@/features/product/data";
import { TextPrimary500 } from "@/components/Text";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import HotelSearch from "@/features/search/components/HotelSearch";
import ProductExplore from "@/features/product/components/ProductExplore";
import SortWidget from "@/features/search/components/SortWidget";
import StaysFilterSidebar from "./_components/StaysFilter";
import StaysFilterSidebarMobile from "./_components/StaysFilterSidebarMobile";

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
        <div className="underline uppercase">
          Hotel, Apartments <TextPrimary500>and Lodges</TextPrimary500>
        </div>
      }
    >
      <Container>
        <HotelSearch />

        <ProductExplore />
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
          <div className="flex-1  flex flex-col gap-6 z-30">
            <SortWidget />

            {/* Activities List */}
            {productData.map((item) => {
              return (
                <div
                  key={crypto.randomUUID()}
                  className="flex flex-col gap-2  transition-transform duration-300"
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
