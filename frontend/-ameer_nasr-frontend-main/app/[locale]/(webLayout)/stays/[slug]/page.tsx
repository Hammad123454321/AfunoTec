import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import HotelShowcase from "./_components/HotelShowcase";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import RelatedHotels from "./_components/RelatedHotels";
import { AdditionalProductInfo } from "@/features/product/components/ProductAdditionalInfo";
import { WhyStayHere } from "@/features/product/components/ProductProof";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import BookingCalender from "@/features/booking/BookingCalender";
import DiscoverRooms from "@/features/product/components/DiscoverRoom";

// PDF + Figma source data. Once the backend lands these fields move
// into the hotel record returned by /api/stays/:slug.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Package Details",
    startDate: "2025-07-01",
    endDate: "2025-07-15",
    description: "Enjoy a special 5% discount at the Turquoise Aparthotel!",
    stayPeriod: "01 Jul - 30 Sep 2025",
    bookBy: "31 July 2025",
  },
  {
    id: 2,
    label: "Honeymoon Offer",
    title: "Romantic Getaway",
    startDate: "2025-07-01",
    endDate: "2025-07-15",
    description:
      "Buy 7/N1 Get 1/N Free — 7-day Honeymoon Promotion offer at Riu Turquoise. Celebrate Love With A Range Of Romantic Perks, Discounts And Meal Choices.",
    stayPeriod: "01 Jul - 30 Sep 2025",
    bookBy: "15 August 2025",
  },
];

const PACKAGE_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Purchase Inclusions",
    items: [],
    markdown: `**All Inclusive Meal Plan:**

- Room As Per Selection
- Unlimited Drinks 24h A Day
- Access To Swimming Pools
- Sports Activities And Entertainment
- Live Music And Shows
- Access To "RiuLand" Kids Club
- Free Wifi Throughout Hotel`,
  },
  {
    id: 2,
    title: "Honeymoon Offer",
    items: [],
    markdown: `**Honeymoon Offer:**

- 1 Bottle of Wine or Sparkling Wine
- Room Decoration
- Free Spa Discount

**Honeymoon Info:**

- A Certified Wedding Certificate, Not Exceeding 6 Months From The Check-In Date, Should Be Sent To baodeal.net When Booking And Presented At The Hotel Upon Arrival.
- A Minimum Of 3 Nights Is Required For Honeymoon Offer.`,
  },
  {
    id: 3,
    title: "Meal Plan Details",
    items: [],
    markdown: `**All Inclusive Meal Plan At Riu Turquoise:**

**Breakfast (At Main Restaurant):**

- Varied Buffet — Live Cooking Stations

**Lunch:**

- Buffet OR Main Restaurant — Live Cooking Stations And Assorted Desserts (View Menu Here)

**Dinner (At Main Restaurant):**

- Buffet — Live Cooking Stations And Assorted Desserts
- Vegetarian Options Available

**Snacks (Outside Mealtimes):**

- Snackbar
- Steakhouse
- Domestic And A Selection Of International Beverages (Served 24 Hours A Day)`,
  },
  {
    id: 4,
    title: "Facilities",
    items: [],
    markdown: `**Facilities At Riu Turquoise:**

- 4 Restaurants
- 4 Bars
- 4 Swimming Pools
- "RiuLand" Kids' Club
- Free WiFi Throughout Hotel
- Gym
- Wellness Centre
- Boutiques/Stores
- Initial Parking (Open Air, Limited Places, Unguarded)`,
  },
  {
    id: 5,
    title: "Complimentary Activities",
    items: [],
    markdown: `**Complimentary Activities At The RiuFit Area (Daily):**

- Aerobics
- Group Fitness Activities In The RiuFit Area (Daily)
- Stand Up Paddle Surfing
- Windsurfing Equipment For Beginners
- Kayaking
- Snorkelling Equipment
- 1 Introductory Scuba-Diving Lesson In Pool`,
  },
];

const PACKAGE_CONDITIONS_SECTIONS = [
  {
    id: 1,
    title: "Validity",
    items: ["Jan — Dec 2025"],
  },
  {
    id: 2,
    title: "Minimum Night Stay",
    items: [],
    markdown: `- Minimum 1 Night Until 30 Sep 2025
- Minimum 2 Night As From 01 Oct 2025`,
  },
  {
    id: 3,
    title: "Conditions",
    items: [],
    markdown: `- Riu Turquoise — Booking Conditions
- A Valid Mauritian National Identity Card Or Residence Permit Should Be Presented Upon Check-In, Failure To Do So Will Entitle The Hotel To Charge The Current Public Rate.
- Rates Are Non-Refundable, Applicable For Mauritian Only And Are In Mauritian Rupees (Rs).
- Price May Vary Between Days, Months And Seasons (See Calendar For Price-Per-Specific Date).
- Guests Under 18 Are Not Allowed To Use The Reception From And Gowns.
- The Room Is Maintained To Guests Over 18 Years Old.
- Sports Shoes Are Compulsory When Using The Gym.
- All Hotel Guests Are Required To Wear An "All-Inclusive" Wristband For Identification Purposes.
- A Certified Wedding Certificate Not Exceeding 6 Months Should Be Sent At The Time Of Booking And Presented Upon Arrival At The Hotel.
- Note: A Non-Smoking Environment Is Maintained, With Smoking Allowed Only In Designated Areas.`,
  },
  {
    id: 4,
    title: "Cancellation Policy",
    items: [],
    markdown: `- All Seasons (Except Peak) — As Per Deal/Etc.
- Peak Season: 22 Dec — 06 Jan And A 100% Cancellation Fee Applies To All Bookings.`,
  },
  {
    id: 5,
    title: "Time",
    items: ["Check-In: 14:00", "Check-Out: 12:00"],
  },
];

const ROOMS = [
  {
    name: "Standard Room",
    image: "/standardRoom.png",
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Sea View Room",
    image: "/heroImage1.png",
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Partial Sea View Room (Lateral)",
    image: "/resort2.png",
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Family Room",
    image: "/resort4.jpg",
    maxOccupancy: "4 Adults + 2 Children",
    area: "56 m²",
    bedding: "2 King size beds",
  },
];

const WHY_STAY = {
  subtitle: "Riu Turquoise (All Inclusive) — Overview",
  description:
    "The newly renovated Hotel Riu Turquoise in Mauritius is the ultimate destination for a family holiday on the stunning beaches of Le Morne peninsula. With Riu's exclusive 24-hour All-Inclusive service, families can enjoy an unforgettable getaway in one of the world's most beautiful locations. Whether you're lounging by the pool or exploring the array of activities tailored for all ages including rejuvenating experiences at the Renova Spa, your dream holiday awaits in the embrace of paradise.",
  features: [
    [
      "All Inclusive Beachfront Resort",
      "4 Bars",
      "4 Restaurants",
      "4 Swimming Pools",
      "Kids Club",
      "Gym & Wellness Centre",
    ],
    [
      "Complimentary Activities",
      "Gift Shop",
      "Daily Entertainments",
      "Evening Programme",
      "Free Wi-Fi",
    ],
  ],
};

const ADDITIONAL_INFO = [
  {
    id: 1,
    image: "/additionalInfoImage.png",
    title: "Spa & Wellness",
    description: "Rejuvenate at the Renova Spa with premium treatments.",
    span: "wide" as const,
  },
  {
    id: 2,
    image: "/additionalInfoImage.png",
    title: "Pool Area",
    description: "Four pools across the resort, including a kids' pool.",
    span: "wide" as const,
  },
  {
    id: 3,
    image: "/additionalInfoImage.png",
    title: "Beach Front",
    description: "Direct access to the white-sand Le Morne peninsula beach.",
    span: "normal" as const,
  },
  {
    id: 4,
    image: "/additionalInfoImage.png",
    title: "Family Activities",
    description: "RiuLand kids' club and daily entertainment for all ages.",
    span: "normal" as const,
  },
  {
    id: 5,
    image: "/additionalInfoImage.png",
    title: "Dining",
    description: "Four restaurants and four bars with all-inclusive service.",
    span: "normal" as const,
  },
];

export default function HotelDetailPage() {
  return (
    <>
      <HotelShowcase />
      <ProductDetailsMetaInfo
        title="RIU TURQUOISE MAURITIUS - ALL INCLUSIV"
        rating={5}
        description="The newly renovated Hotel Riu Turquoise in Mauritius is the ultimate destination for a family holiday on the stunning beaches of Le Morne peninsula, with Riu's exclusive 24-hour All-Inclusive service, families can enjoy an unforgettable getaway in one of the world's most beautiful locations."
        features={[
          "Air Service Available",
          "Beachfront Hotel",
          "Pool with Kid's Club",
          "Swimming Pool",
          "Entertainment programmes",
          "Restaurants + Bars",
        ]}
      />

      <ProductInfoSectionButtons
        items={[
          "Package Summary",
          "Package Conditions",
          "Rooms",
          "Highlights",
          "Reviews",
        ]}
      />

      {/* Body: 2-column shell with PackageSummary + PackageConditions on
          the left and the sticky booking calendar on the right. */}
      <Container className="py-8 lg:py-12">
        <div className="lg:flex lg:gap-8 items-start relative">
          <div className="flex-[3] space-y-12">
            <PackageSummary
              offers={PACKAGE_OFFERS}
              sections={PACKAGE_SUMMARY_SECTIONS}
              id="package-summary"
            />
            <PackageSummary
              sections={PACKAGE_CONDITIONS_SECTIONS}
              title="Package"
              highlightText="Conditions"
              id="package-conditions"
            />
          </div>
          <div className="flex-1 mt-8 lg:mt-0 lg:sticky lg:top-24">
            <BookingCalender
              basePrice={9900}
              discountPrice={11900}
              durationType="night"
              currency="Ar"
            />
          </div>
        </div>
      </Container>

      <DiscoverRooms rooms={ROOMS} />

      <Section align="left" id="highlights">
        <Container>
          <WhyStayHere
            subtitle={WHY_STAY.subtitle}
            description={WHY_STAY.description}
            features={WHY_STAY.features}
          />
        </Container>
      </Section>

      <AdditionalProductInfo cards={ADDITIONAL_INFO} />

      <div id="reviews">
        <RelatedHotels />
      </div>
    </>
  );
}
