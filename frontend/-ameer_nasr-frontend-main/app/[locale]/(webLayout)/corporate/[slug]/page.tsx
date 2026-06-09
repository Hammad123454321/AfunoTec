import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";
import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import HotelShowcase from "./_components/HotelShowcase";
import RelatedHotels from "./_components/RelatedHotels";

// Corporate detail reuses the activity / tour / transportation detail
// template with corporate-event-specific copy.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Package Details",
    startDate: "2025-08-01",
    endDate: "2025-09-30",
    description:
      "Enjoy a special 18% off on the Sunset Beats and Bites Beach Party package.",
    stayPeriod: "01 Aug - 30 Nov 2025",
    bookBy: "30 September 2025",
  },
];

const PACKAGE_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Inclusions",
    items: [],
    markdown: `**Sunset Beats and Bites — Team Building Package:**

- Exclusive Beach Venue Hire (4 Hours)
- Professional DJ + Sound System For 4 Hours
- BBQ Grill Stations With 4 Protein Choices (Beef, Chicken, Fish, Vegetarian)
- 5 Sides + 3 Sauces + Bread Selection
- Welcome Cocktail On Arrival
- Open Bar (Local Beer, Wine, Soft Drinks) For 3 Hours
- Group Cooking Challenge With Facilitator
- Beach Volleyball Net + Equipment
- Event Manager On-Site Throughout`,
  },
  {
    id: 2,
    title: "Complimentary Activities",
    items: [],
    markdown: `**Free Group Activities:**

- Beach Volleyball Tournament
- Sandcastle Building Competition (Team-Based)
- Glow Sticks + LED Decor After Sunset
- Group Photo Shoot With Resort Photographer
- Beach Games Equipment (Frisbee, Kite, Paddles)`,
  },
  {
    id: 3,
    title: "Event Time",
    items: ["16:00 – 21:00 (Sunset Hours)"],
  },
  {
    id: 4,
    title: "Duration",
    items: ["5 Hours"],
  },
  {
    id: 5,
    title: "Meeting Point",
    items: [
      "Andilana Beach Front Pavilion — 5 minutes walk from Andilana Beach Resort lobby",
    ],
  },
  {
    id: 6,
    title: "Operating Days",
    items: [],
    markdown: `- Wednesday, Friday, Saturday (May – November)
- Other Days On Request (Minimum 30 Guests)
- Closed During Heavy Cyclone Season (Jan – Mar — Weather-Dependent)`,
  },
  {
    id: 7,
    title: "Group Size",
    items: ["Minimum 20 / Maximum 80 guests per event"],
  },
  {
    id: 8,
    title: "Cancellation Policy",
    items: [],
    markdown: `- 30+ Days Before Event – Full Refund Less Deposit
- 15-29 Days Before Event – 50% Refund
- 7-14 Days Before Event – 25% Refund
- Less Than 7 Days, No-Show – No Refund
- Weather-Related Cancellation (Cyclone Alert): Full Reschedule At No Extra Cost`,
  },
  {
    id: 9,
    title: "Conditions & Additional Info",
    items: [],
    markdown: `**Booking The Sunset Beats and Bites Package — Important Information:**

- 50% Deposit Required At Booking To Confirm The Venue.
- Final Headcount Required 7 Days Before Event For Catering And Bar Stocking.
- Dietary Restrictions And Allergies Must Be Communicated 5 Days In Advance.
- Bring Comfortable Beach Attire — Sandals Or Bare Feet On The Sand.
- Local Tax (TVA 20%) Included In The Quoted Price.
- Payment Accepted In Mvola, Airtel Money, Orange Money, Bank Card, And Corporate Invoice.`,
  },
];

const EVENT_DETAILS_SECTIONS = [
  {
    id: 1,
    title: "What To Expect?",
    items: [],
    markdown: `- Sunset Beats and Bites — A Team-Building Beach Party Like No Other
- Step Onto The White Sand At 16:00 To A Welcome Cocktail And The First Beats Of Our Resident DJ. Your Team Will Immediately Feel The Energy Of The Beach Venue — Casual, Coastal, And Built For Connection.
- The Afternoon Builds With Beach Volleyball, Sandcastle Challenges, And A Group Photo Shoot That Captures Your Team In Action. Our Facilitator Splits The Group Into Mixed Teams For A Light-Hearted Cooking Challenge: Each Team Picks Their Protein, Spices, And Sides, Then Grills Their Creation Side-By-Side At Our BBQ Stations.
- As The Sun Sets, The Open Bar Opens And The Music Shifts From Lounge To Dance. Glow Sticks, LED Decor, And A Bonfire Round Off The Evening — Your Colleagues Won't Forget This One.
- The Event Manager Stays On-Site Throughout To Handle Logistics, So You Can Relax And Enjoy The Time With Your Team.`,
  },
  {
    id: 2,
    title: "Event Details",
    items: [],
    markdown: `- Sunset Beats and Bites — Corporate Beach Party Package
- A 5-Hour All-Inclusive Beach Party Package Designed For Corporate Teams Of 20 To 80 Guests. Includes Exclusive Venue Hire, DJ, BBQ Catering, Open Bar, Facilitated Activities And On-Site Event Manager.
- Suitable For Team Building, Client Entertainment, Year-End Parties, Product Launches, And Sales Incentive Trips. Custom Branding (Banners, Signage, Branded Welcome Drinks) Available On Request — Pricing Quoted Separately.`,
  },
];

export default function CorporateEventDetailPage() {
  return (
    <>
      <HotelShowcase />

      <ProductDetailsMetaInfo
        title="SUNSET BEATS AND BITES - TEAM BUILDING BEACH PARTY"
        rating={5}
        subtitle="VENUE HIRE + DJ + BBQ CATERING + OPEN BAR + FACILITATED ACTIVITIES"
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
              sections={EVENT_DETAILS_SECTIONS}
              title="Event"
              highlightText="Details"
              id="package-conditions"
            />
          </div>

          <div className="flex-1 mt-8 lg:mt-0 lg:sticky lg:top-24">
            <BookingCalender
              basePrice={9250}
              discountPrice={12500}
              durationType="day"
              currency="Ar"
            />
          </div>
        </div>
      </Container>

      <RelatedHotels />
    </>
  );
}
