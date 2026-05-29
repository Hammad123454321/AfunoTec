"use client";

import Heading from "@/components/Heading";
import { TextPrimary500 } from "@/components/Text";
import { format } from "date-fns";

interface PackageOffer {
  id: number;
  label: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  stayPeriod: string;
  bookBy: string;
}

interface SummarySection {
  id: number;
  title: string;
  items: string[];
  markdown?: string;
}

interface PackageSummaryProps {
  offers?: PackageOffer[];
  sections: SummarySection[];
  title?: string;
  highlightText?: string;
  id: string;
}

// Parse markdown to items array
function parseMarkdownToItems(markdown: string): string[] {
  if (!markdown) return [];

  const lines = markdown.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    // Remove markdown list markers (-, *, +) and bold markers (**)
    return line
      .replace(/^[\s]*[-*+]\s+/, "")
      .replace(/\*\*/g, "")
      .trim();
  });
}

// Offer Card Component
function OfferCard({ offer }: { offer: PackageOffer }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
      <div className="flex-shrink-0">
        <h3 className="text-green-600 font-semibold text-lg md:text-xl mb-4">
          {offer.label}
        </h3>
        <p className="text-lg md:text-xl font-semibold mb-3">
          {format(new Date(offer.startDate), "do MMMM yyyy").toUpperCase()}
        </p>
        <p className="text-lg md:text-xl font-semibold">
          {format(new Date(offer.endDate), "do MMMM yyyy").toUpperCase()}
        </p>
      </div>

      <div className="flex items-center w-full">
        <div className="hidden md:block w-0 h-0 border-y-[14px] border-r-[20px] border-y-transparent border-r-gray-300" />

        <div className="flex-1 bg-gray-300 md:pl-5 p-4 rounded md:rounded-none">
          <h4 className="font-semibold mb-2">{offer.title}</h4>
          <p className="text-sm mb-3">{offer.description}</p>
          <ul className="text-sm space-y-1">
            <li>
              <span className="font-semibold">Stay Period:</span>{" "}
              {offer.stayPeriod}
            </li>
            <li>
              <span className="font-semibold">Book By:</span> {offer.bookBy}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Summary Row Component
function SummaryRow({ section }: { section: SummarySection }) {
  const items = section.markdown
    ? parseMarkdownToItems(section.markdown)
    : section.items;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-300 last:border-b-0">
      <div className="md:col-span-1 flex items-center justify-center text-center text-green-600 font-semibold text-sm md:text-lg border-b md:border-b-0 md:border-r border-gray-300 p-4">
        {section.title}
      </div>

      <div className="md:col-span-3 p-4 space-y-2">
        {items.map((item, index) => {
          const isSubtitle = item.endsWith(":") || item.includes(" | ");
          const hasMenuLink = item.includes("(View Menu Here)");
          const isImportant =
            item.toLowerCase().includes("minimum") ||
            item.toLowerCase().includes("required") ||
            item.toLowerCase().includes("certificate");

          if (isSubtitle) {
            return (
              <p
                key={index}
                className="font-semibold text-black mt-4 first:mt-0"
              >
                {item}
              </p>
            );
          }

          return (
            <div key={index} className="flex items-start gap-2 pl-2">
              <span className="text-sm mt-1">•</span>
              <p
                className={`text-sm ${
                  isImportant ? "text-red-600 font-semibold" : "text-gray-700"
                }`}
              >
                {hasMenuLink ? (
                  <>
                    {item.replace("(View Menu Here)", "")}
                    <span className="text-green-600 underline cursor-pointer">
                      (View Menu Here)
                    </span>
                  </>
                ) : (
                  item
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main Component
export function PackageSummary({
  offers,
  sections,
  title = "PACKAGE",
  highlightText = "SUMMARY",
  id,
}: PackageSummaryProps) {
  return (
    <div id={id} className="bg-white">
      <div className="h-16"></div>
      {offers && offers.length > 0 && (
        <div className="flex flex-col gap-8 mb-12">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      <Heading as="h3" size="h4">
        <span className="uppercase">{title} </span>
        <TextPrimary500>{highlightText}</TextPrimary500>
      </Heading>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {sections.map((section) => (
          <SummaryRow key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

// Example Usage
export default function ExampleUsage() {
  const packageData = {
    offers: [
      {
        id: 1,
        label: "Special Offer",
        title: "Package Details",
        startDate: "2025-07-01",
        endDate: "2025-07-15",
        description: "Enjoy a special 18% discount at Riu Turquoise Mauritius!",
        stayPeriod: "01 Jul - 30 Sep 2025",
        bookBy: "31 July 2025",
      },
      {
        id: 2,
        label: "Honeymoon Offer",
        title: "Romantic Getaway",
        startDate: "2025-08-01",
        endDate: "2025-08-15",
        description: "Exclusive honeymoon package with 25% off plus free spa!",
        stayPeriod: "01 Aug - 30 Nov 2025",
        bookBy: "15 August 2025",
      },
    ],
    sections: [
      {
        id: 1,
        title: "Purchase Inclusions",
        items: [],
        markdown: `**Free Activities At Ile Des Deux Cocos:**

- All inclusive Meal Plan
- Room As Per Section
- Unlimited Drinks 24h A day
- Access to Swimming Pools
- Sports Activities And Entertainment`,
      },
      {
        id: 2,
        title: "Honeymoon Offer",
        items: [],
        markdown: `**Honeymoon offer - inclusions:**

- 1 bottle of Wine or Sparking Wine
- Room Decoration

**Honeymoon Info:**

- A certified wedding certificate, not exceeding 6 months from the check-in date, should be sent to baodeal.net when booking and presented at the hotel upon arrival.
- A minimum of 3 nights is required for Honeymoon Offer`,
      },
      {
        id: 3,
        title: "Meal Plan Details",
        items: [],
        markdown: `**All Inclusive Meal Plan at Riu Turquoise:**

**Breakfast (at main restaurant):**

- Varied buffet - live cooking stations

**Lunch:**

- Buffet (at main restaurant) (View Menu Here)

**Dinner (at main restaurant):**

- Buffet - live cooking stations and assorted desserts`,
      },
      {
        id: 4,
        title: "Facilities",
        items: [],
        markdown: `**Facilities at Riu Turquoise:**

- 4 Restaurants
- 4 Bars
- 4 Swimming Pools
- RiuLand kids' club
- Free WiFi throughout hotel`,
      },
    ],
  };

  return (
    <>
      <PackageSummary
        offers={packageData.offers}
        sections={packageData.sections}
        id={"Package Summary".toLowerCase().replace(" ", "-")}
      />
      <PackageSummary
        sections={packageData.sections}
        title="Package"
        highlightText="Conditions"
        id={"Package Conditions".toLowerCase().replace(" ", "-")}
      />

      {/* <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Title Example</h2>
        <PackageSummary
          offers={packageData.offers}
          sections={packageData.sections}
          title="BOOKING"
          highlightText="DETAILS"
        />
      </div> */}
    </>
  );
}
