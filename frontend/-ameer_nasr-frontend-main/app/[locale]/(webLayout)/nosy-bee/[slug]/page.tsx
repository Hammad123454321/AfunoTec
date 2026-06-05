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

// Nosy Be detail follows the Hotel Detail template (PACKAGE SUMMARY /
// CONDITIONS / ROOMS / HIGHLIGHTS / ADDITIONAL INFO) with content
// specific to Andilana Beach Resort.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Package Details",
    startDate: "2025-07-01",
    endDate: "2025-07-15",
    description:
      "Enjoy a special 18% off at Andilana Beach Resort all-inclusive package.",
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
      "Buy 7/N1 Get 1/N Free — 7-day Honeymoon Promotion at Andilana Beach Resort. Includes romantic dinner, spa credit and room decoration.",
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

- Room As Per Selection (Garden / Sea View / Family)
- Unlimited Drinks 24h A Day Including Local Beer, Wine, Cocktails
- Access To All 4 Swimming Pools On The Resort
- Daily Sports Activities And Entertainment
- Live Music And Sunset Shows On The Beach
- Free WiFi Throughout The Resort
- Kids Club For Ages 4-12 (Year-Round)
- Beach Front Towel Service`,
  },
  {
    id: 2,
    title: "Honeymoon Offer",
    items: [],
    markdown: `**Honeymoon Offer:**

- 1 Bottle Of Sparkling Wine On Arrival
- Romantic Room Decoration With Rose Petals
- Couples Massage Credit (45 Minutes)
- Sunset Dinner On The Beach (1 Evening)

**Honeymoon Info:**

- A Certified Wedding Certificate, Not Exceeding 6 Months From The Check-In Date, Should Be Sent To AfunoTec When Booking And Presented At The Hotel Upon Arrival.
- A Minimum Of 3 Nights Is Required For Honeymoon Offer.`,
  },
  {
    id: 3,
    title: "Meal Plan Details",
    items: [],
    markdown: `**All Inclusive Meal Plan At Andilana Beach Resort:**

**Breakfast (At Main Restaurant):**

- Varied Buffet — Live Cooking Stations With Omelette And Crepe Bar

**Lunch:**

- Buffet At Main Restaurant + A La Carte Beach Grill
- Wood-Fired Pizza Station Open Until 16:00

**Dinner (At Main Restaurant):**

- Buffet — Live Cooking Stations And Themed Nights (Italian, Indian, Malagasy)
- 2 Themed A La Carte Restaurants Available With Reservation

**Snacks (Outside Mealtimes):**

- Beach Bar (Sandwiches, Salads, Fresh Fruit, 24h)
- Pool Bar (Grills + Drinks 10:00 - 22:00)
- Coffee Bar With Pastries (06:00 - 20:00)`,
  },
  {
    id: 4,
    title: "Facilities",
    items: [],
    markdown: `**Facilities At Andilana Beach Resort:**

- 4 Restaurants (2 Buffet + 2 A La Carte)
- 5 Bars (Beach, Pool, Lobby, Lounge, Disco)
- 4 Swimming Pools Including 1 Adults-Only
- Kids' Club + Dedicated Children's Pool
- Spa & Wellness Centre (Treatments Extra)
- Free WiFi Throughout Hotel
- Fully-Equipped Gym Open 24h
- 2 Tennis Courts + Beach Volleyball
- Boutique, ATM, Currency Exchange On-Site`,
  },
  {
    id: 5,
    title: "Complimentary Activities",
    items: [],
    markdown: `**Complimentary Activities (Daily):**

- Beach Yoga (Morning)
- Aqua Aerobics In The Main Pool
- Snorkelling Equipment Rental
- Kayaks And Paddle Boards On The Beach
- Beach Volleyball + Tennis Courts
- Evening Entertainment Programme (Live Music, Shows)
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
    markdown: `- Minimum 3 Nights All Year
- Minimum 5 Nights During Peak Season (15 Dec – 05 Jan)`,
  },
  {
    id: 3,
    title: "Conditions",
    items: [],
    markdown: `- Andilana Beach Resort — Booking Conditions
- A Valid Mauritian National Identity Card Or Residence Permit Should Be Presented Upon Check-In.
- Rates Are Non-Refundable, Applicable For Malagasy Residents Only And Are In Malagasy Ariary (Ar).
- Price May Vary Between Days, Months And Seasons (See Calendar For Price-Per-Specific Date).
- Guests Under 18 Are Not Allowed To Use The Spa Or Gym Without A Parent.
- All Hotel Guests Are Required To Wear An "All-Inclusive" Wristband For Identification Purposes.
- Note: A Non-Smoking Environment Is Maintained, With Smoking Allowed Only In Designated Areas.`,
  },
  {
    id: 4,
    title: "Cancellation Policy",
    items: [],
    markdown: `- 30+ Days Before Arrival — Full Refund Less Deposit
- 15-29 Days Before Arrival — 50% Refund
- 7-14 Days Before Arrival — 25% Refund
- Less Than 7 Days, No-Show — No Refund
- Peak Season (22 Dec — 06 Jan): 100% Cancellation Fee Applies To All Bookings.`,
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
    maxOccupancy: "2 Adults + 2 Children OR 3 Adults",
    area: "28 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Sea View Room",
    image: "/heroImage1.png",
    maxOccupancy: "2 Adults + 2 Children OR 3 Adults",
    area: "28 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Partial Sea View Room (Lateral)",
    image: "/resort2.png",
    maxOccupancy: "2 Adults + 2 Children OR 3 Adults",
    area: "28 m²",
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
  subtitle: "Andilana Beach Resort (All Inclusive) — Overview",
  description:
    "Set on the northwestern tip of Nosy Be island, Andilana Beach Resort enjoys one of the most stunning beachfronts in Madagascar. A short transfer from Fascene Airport delivers you to a vibrant all-inclusive resort built for families, couples and groups alike. With 4 restaurants, 5 bars, 4 pools and direct beach access, every comfort is within easy reach — and the white-sand beach and crystal lagoon are right outside your door.",
  features: [
    [
      "All Inclusive Beachfront Resort",
      "5 Bars",
      "4 Restaurants",
      "4 Swimming Pools",
      "Kids Club",
      "Gym & Wellness Centre",
    ],
    [
      "Complimentary Activities",
      "Direct Beach Access",
      "Daily Entertainment",
      "Evening Programme",
      "Free Wi-Fi",
    ],
  ],
};

const ADDITIONAL_INFO = [
  {
    id: 1,
    image: "/additionalInfoImage.png",
    title: "Beach Front",
    description: "Direct access to Andilana's renowned white-sand beach.",
    span: "wide" as const,
  },
  {
    id: 2,
    image: "/additionalInfoImage.png",
    title: "Pool Area",
    description: "Four pools including an adults-only and kids' pool.",
    span: "wide" as const,
  },
  {
    id: 3,
    image: "/additionalInfoImage.png",
    title: "Spa & Wellness",
    description: "Treatments using Malagasy oils and local botanicals.",
    span: "normal" as const,
  },
  {
    id: 4,
    image: "/additionalInfoImage.png",
    title: "Family Activities",
    description: "Daily kids' club programme + family entertainment evenings.",
    span: "normal" as const,
  },
  {
    id: 5,
    image: "/additionalInfoImage.png",
    title: "Dining",
    description: "Buffet + A La Carte + 24h beach bar — all inclusive.",
    span: "normal" as const,
  },
];

export default function NosyBeHotelDetailPage() {
  return (
    <>
      <HotelShowcase />

      <ProductDetailsMetaInfo
        title="ANDILANA BEACH RESORT NOSY BE - ALL INCLUSIVE"
        rating={5}
        description="Set on the northwestern tip of Nosy Be island, Andilana Beach Resort enjoys one of the most stunning beachfronts in Madagascar. With 4 restaurants, 5 bars, 4 pools and direct beach access, every comfort is within easy reach — and the white-sand beach and crystal lagoon are right outside your door."
        features={[
          "Beach Front Access",
          "Beachfront Resort",
          "Pool with Kid's Club",
          "4 Swimming Pools",
          "Daily Entertainment",
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
