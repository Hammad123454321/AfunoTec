import HotelSearch from "@/features/search/components/HotelSearch";
import Container from "@/components/layout/Container";
import ProductExplore from "@/features/product/components/ProductExplore";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import Filter from "@/features/filter/components/Filter";
import SortWidget from "@/features/search/components/SortWidget";
import { adData, productOverviewData } from "@/features/product/data";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import crypto from "crypto";
import ToursFilterSidebar from "./_components/ToursFilter";
import SearchOption from "./_components/SearchOption";
import TourssFilterSidebarMobile from "./_components/ToursFilterSidebarMobile";

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
          Tours & <TextPrimary500>Eco Tourism</TextPrimary500>
        </div>
      }
    >
      <Container>
        <SearchOption />
        <ProductExplore />
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

            {/* Activities List */}
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
