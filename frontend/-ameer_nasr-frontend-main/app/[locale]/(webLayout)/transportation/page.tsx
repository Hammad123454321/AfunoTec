import HotelSearch from "@/features/search/components/HotelSearch";
import Container from "@/components/layout/Container";
import ProductExplore from "@/features/product/components/ProductExplore";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import SortWidget from "@/features/search/components/SortWidget";
import { adData, productOverviewData } from "@/features/product/data";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import crypto from "crypto";
import TransportationFilterSidebar from "./_components/TransportationFilter";
import TransportationFilterSidebarMobile from "./_components/TransportationFilterSidebarMobile";

export default function TransportationPage() {
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
          Transportation & <TextPrimary500>Car Rental</TextPrimary500>
        </div>
      }
    >
      <Container>
        {/* <HotelSearch /> */}
        <ProductExplore />
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
