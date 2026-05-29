import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import Filter from "@/features/filter/components/Filter";
import ProductExplore from "@/features/product/components/ProductExplore";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import { adData, productOverviewData } from "@/features/product/data";
import ActivitySearch from "@/features/search/components/ActivitySearch";
import SortWidget from "@/features/search/components/SortWidget";
import crypto from "crypto";
import ContactForm from "./ContactForm";
import CorporateFilterSidebar from "./_components/CorporateFilters";
import SearchOptionCorporate from "./_components/SearchOptionCorporate";
import CorporateFilterSidebarMobile from "./_components/CorporateFilterSidebarMobile";

export default function CorporatePage() {
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
          CORPORATE <TextPrimary500> DEALS</TextPrimary500>
        </div>
      }
    >
      <Container>
        <div className="max-w-4xl mx-auto">
          <SearchOptionCorporate />
        </div>

        <ProductExplore />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          

          <div className="flex gap-4 z-50">
                      {/* Mobile Filter - Only shows on mobile */}
                      <CorporateFilterSidebarMobile />
          
                      {/* Desktop Filter - Only shows on desktop (lg and above) */}
                      <div className="hidden lg:block">
                       <CorporateFilterSidebar />
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
      <ContactForm></ContactForm>
    </Section>
  );
}
