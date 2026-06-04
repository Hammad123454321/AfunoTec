import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import ProductExplore, {
  type ExploreCard,
} from "@/features/product/components/ProductExplore";
import { ProductOverviewCard } from "@/features/product/components/ProductOverviewCard";
import { corporateOverviewData } from "@/features/product/data";
import SortWidget from "@/features/search/components/SortWidget";
import crypto from "crypto";
import ContactForm from "./ContactForm";
import CorporateFilterSidebar from "./_components/CorporateFilters";
import SearchOptionCorporate from "./_components/SearchOptionCorporate";
import CorporateFilterSidebarMobile from "./_components/CorporateFilterSidebarMobile";

const CORPORATE_TILES: ReadonlyArray<ExploreCard> = [
  {
    topText: "",
    bottomText: "Team building",
    imgSrc: "/explore/family.png",
  },
  {
    topText: "",
    bottomText: "Client entertainment & Training",
    imgSrc: "/explore/weekend.png",
  },
  {
    topText: "",
    bottomText: "Employee & Executives offers",
    imgSrc: "/explore/inclusive.png",
  },
  {
    topText: "",
    bottomText: "Sustainability, CSR & GO Green",
    imgSrc: "/explore/meal.png",
  },
];

export default function CorporatePage() {
  return (
    <Section
      title={
        <div className="uppercase">
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Corporate
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
          <SearchOptionCorporate />
        </div>

        <ProductExplore activities={CORPORATE_TILES} variant="amber" />

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

            {corporateOverviewData.map((item) => (
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

      {/* Fill-in-the-form-below contact CTA at the bottom of the page. */}
      <ContactForm />
    </Section>
  );
}
