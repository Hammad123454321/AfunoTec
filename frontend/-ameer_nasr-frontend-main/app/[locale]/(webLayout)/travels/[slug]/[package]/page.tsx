import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import RelatedHotels from "../_components/RelatedHotels";
import ProductAICard from "@/features/product/components/ProductAICard";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import PackageShowcase from "./_components/PackageShowcase";

// Travel package detail. URL shape is /travels/[category]/[package],
// e.g. /travels/africa/south-africa. The render reuses the activity /
// tour detail template with travel-package-specific copy.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Package Details",
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    description:
      "Enjoy a special 15% off on the South Africa Safari & Cape Town package.",
    stayPeriod: "01 Sep - 31 Dec 2025",
    bookBy: "30 September 2025",
  },
];

const PACKAGE_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Inclusions",
    items: [],
    markdown: `**South Africa Safari & Cape Town — 9 Nights:**

- Return International Flights From Antananarivo (Via Johannesburg)
- 4 Nights Game Lodge In Kruger National Park
- 5 Nights Boutique Hotel In Cape Town
- Daily Breakfast And 4 Lunches On Safari
- Two Game Drives Per Day With Experienced Ranger
- All Park Entrance Fees And Conservation Levies
- Private Airport And Inter-City Transfers
- Cape Peninsula Half-Day Tour + Wine Estate Visit`,
  },
  {
    id: 2,
    title: "Complimentary Activities",
    items: [],
    markdown: `**Included In The Package:**

- Welcome Drink At Each Property
- Sundowner Game Drive In Kruger
- Table Mountain Cable Car Ticket (Weather Permitting)
- Cape Of Good Hope Photo Stop
- Bo-Kaap Walking Tour With Local Guide`,
  },
  {
    id: 3,
    title: "Travel Dates",
    items: [
      "Daily departures from Antananarivo (subject to flight availability)",
    ],
  },
  {
    id: 4,
    title: "Duration",
    items: ["9 Nights / 10 Days"],
  },
  {
    id: 5,
    title: "Meeting Point",
    items: [
      "Ivato International Airport, Antananarivo — 3 hours before flight departure",
    ],
  },
  {
    id: 6,
    title: "Operating Period",
    items: [],
    markdown: `- Daily Departures Year-Round Subject To Flight Availability
- Best Game Viewing: May – Sep (Dry Season)
- Best Cape Town Weather: Nov – Mar`,
  },
  {
    id: 7,
    title: "Price Validity",
    items: ["Until 31/12/2026 — flight surcharges may apply"],
  },
  {
    id: 8,
    title: "Cancellation Policy",
    items: [],
    markdown: `- 60+ Days Prior To Departure – Full Refund Less Deposit
- 30-59 Days Prior To Departure – 50% Refund
- 15-29 Days Prior To Departure – 25% Refund
- Less Than 15 Days, No-Show & Unexpected Departure – No Refund`,
  },
  {
    id: 9,
    title: "Conditions & Additional Info",
    items: [],
    markdown: `**Booking The Safari Package — Important Information:**

- Valid Passport Required With Minimum 6 Months Validity Beyond Return Date.
- Yellow Fever Vaccination Certificate Required For Re-Entry To Madagascar.
- Minimum 2 Persons For Departures To Operate; Solo Bookings Confirmed Once Group Reaches Minimum.
- Game Sightings Cannot Be Guaranteed But Are Highly Probable In Kruger National Park.
- Children Under 6 Are Not Permitted On Open-Vehicle Game Drives.`,
  },
];

const PACKAGE_DETAILS_SECTIONS = [
  {
    id: 1,
    title: "What To Expect?",
    items: [],
    markdown: `- South Africa Safari & Cape Town — Africa's Greatest Contrast
- Combine The Wild Drama Of Kruger National Park With The Cosmopolitan Charm Of Cape Town In One Carefully Crafted 9-Night Itinerary. Designed For Travellers Who Want Both Wildlife And Wine, Safari And Sea.
- Your Adventure Begins With Four Nights At A Game Lodge Inside Kruger Reserve. Two Game Drives Per Day With An Experienced Ranger Maximise Your Chances Of Encountering Africa's Big Five — Lion, Leopard, Elephant, Rhino, And Buffalo.
- After Your Safari, Fly To Cape Town For Five Nights In A Boutique Hotel With Easy Access To The Waterfront, Table Mountain, And The Cape Peninsula. Explore Bo-Kaap's Colourful Streets, Take The Cable Car Up Table Mountain, And Sample Award-Winning Wines In The Stellenbosch And Constantia Valleys.
- Optional Add-Ons Available For Hot Air Balloon Safaris, Helicopter Tours, And Shark Cage Diving.`,
  },
  {
    id: 2,
    title: "Package Details",
    items: [],
    markdown: `- South Africa Safari & Cape Town — 9 Nights / 10 Days
- A Curated Travel Package Combining International Flights From Antananarivo, Game-Lodge Accommodation In Kruger, Boutique Hotel In Cape Town, All Breakfasts And Selected Lunches, Two Game Drives Per Day, And Half-Day Cape Peninsula Tour With Wine Estate Visit.
- This Package Is Designed For Couples, Small Groups, And Adventurous Solo Travellers. Family Departures Available With Adapted Itineraries For Children Aged 6+.`,
  },
];

export default async function TravelPackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; package: string; locale: string }>;
}) {
  await params; // Reserved for backend lookup once the API lands.

  return (
    <>
      <PackageShowcase />

      <ProductDetailsMetaInfo
        title="SOUTH AFRICA SAFARI - 9 NIGHTS PACKAGE"
        rating={5}
        subtitle="RETURN FLIGHTS + GAME LODGE + CAPE TOWN HOTEL + DAILY BREAKFAST + GAME DRIVES"
        description={undefined}
        features={[]}
      />

      <ProductAICard />

      <ProductInfoSectionButtons
        items={[
          "Package Summary",
          "Package Conditions",
          "Rooms",
          "Highlights",
          "Reviews",
        ]}
      />

      <Container className="py-8 lg:py-12">
        <div className="lg:flex lg:gap-8 items-start relative">
          <div className="flex-[3] min-w-0 space-y-12">
            <PackageSummary
              offers={PACKAGE_OFFERS}
              sections={PACKAGE_SUMMARY_SECTIONS}
              id="package-summary"
            />
            <PackageSummary
              sections={PACKAGE_DETAILS_SECTIONS}
              title="Package"
              highlightText="Details"
              id="package-conditions"
            />
          </div>

          <div className="flex-1 mt-8 lg:mt-0 lg:sticky lg:top-24">
            <BookingCalender
              basePrice={82000}
              discountPrice={95000}
              durationType="night"
              currency="Ar"
            />
          </div>
        </div>
      </Container>

      <RelatedHotels />
    </>
  );
}
