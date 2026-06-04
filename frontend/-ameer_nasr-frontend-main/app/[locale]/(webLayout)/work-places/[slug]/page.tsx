import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import RelatedHotels from "./_components/RelatedHotels";
import ProductAICard from "@/features/product/components/ProductAICard";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import HotelShowcase from "./_components/HotelShowcase";

// Workplaces detail reuses the activity / tour / corporate detail
// template with workplace-rental specific copy.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Package Details",
    startDate: "2025-08-01",
    endDate: "2025-09-30",
    description:
      "Enjoy a special 18% off when you book 3 or more boardroom days in a month.",
    stayPeriod: "01 Aug - 30 Nov 2025",
    bookBy: "30 September 2025",
  },
];

const PACKAGE_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Inclusions",
    items: [],
    markdown: `**Tana Boardroom — Executive Day Hire Package:**

- Exclusive Use Of The Boardroom For 8 Hours
- Seating For Up To 14 Executives Around The Conference Table
- 75" Wall-Mounted Display With HDMI + USB-C
- Conference Phone With International Dialling
- 2 Whiteboards + 4 Flipcharts + Stationery
- Soundproofed Walls For Confidential Meetings
- Unlimited Tea, Coffee, And Filtered Water
- Mid-Morning + Mid-Afternoon Snack Service
- 3-Course Plated Lunch For Up To 14 Guests
- On-Site Event Coordinator`,
  },
  {
    id: 2,
    title: "Complimentary Amenities",
    items: [],
    markdown: `**Free Services:**

- High-Speed Fibre WiFi (1 Gbps Symmetric)
- Print / Scan / Copy Service (Up To 100 Pages)
- Welcome Stationery Kit (Notepad + Pen Per Seat)
- 24/7 Building Security
- Free On-Site Parking For All Attendees
- Designated Phone Booth For Private Calls`,
  },
  {
    id: 3,
    title: "Operating Hours",
    items: ["Monday – Friday: 07:00 – 19:00", "Saturday on request"],
  },
  {
    id: 4,
    title: "Duration",
    items: ["8 Hours (Standard Day Hire)"],
  },
  {
    id: 5,
    title: "Meeting Point",
    items: [
      "Tana Business Park — Building B, 3rd Floor. Reception will direct you to the boardroom.",
    ],
  },
  {
    id: 6,
    title: "Capacity",
    items: [],
    markdown: `- Up To 14 Executives Around The Boardroom Table
- 18 With Additional Perimeter Seating
- Layouts Available: Boardroom, U-Shape, Theatre (On Request)`,
  },
  {
    id: 7,
    title: "Price Validity",
    items: ["Until 31/12/2025"],
  },
  {
    id: 8,
    title: "Cancellation Policy",
    items: [],
    markdown: `- 14+ Days Before Booking – Full Refund
- 7-13 Days Before Booking – 50% Refund
- 3-6 Days Before Booking – 25% Refund
- Less Than 3 Days, No-Show – No Refund
- Reschedule Available Up To 48 Hours Before At No Extra Cost`,
  },
  {
    id: 9,
    title: "Conditions & Additional Info",
    items: [],
    markdown: `**Booking The Tana Boardroom — Important Information:**

- 50% Deposit Required At Booking To Confirm The Room.
- Final Headcount Required 48 Hours Before For Catering And Stationery.
- Dietary Restrictions And Allergies Must Be Communicated 24 Hours In Advance.
- A/V Equipment Must Be Tested 30 Minutes Before Meeting Start.
- VAT (TVA 20%) Included In The Quoted Price.
- Payment Accepted In Mvola, Airtel Money, Orange Money, Bank Card, And Corporate Invoice.`,
  },
];

const VENUE_DETAILS_SECTIONS = [
  {
    id: 1,
    title: "What To Expect?",
    items: [],
    markdown: `- Tana Boardroom — A Professional Setting For Decisive Days
- Step Into A Soundproof, Climate-Controlled Boardroom Designed For The Most Demanding Executive Discussions. The 14-Seat Conference Table Faces A 75-Inch Display And Conference Phone, Ready For Hybrid Meetings From The First Minute.
- Your Day Begins At Reception With A Welcome Coffee Service While Our On-Site Coordinator Walks You Through The A/V Setup. Whiteboards And Flipcharts Are Positioned For Easy Capture, And A Designated Phone Booth Just Outside The Room Handles Private Calls Without Disrupting The Group.
- A Mid-Morning Snack Service Keeps The Energy Up Through The Working Session, And A Three-Course Plated Lunch Is Served At The Adjacent Dining Area. The Mid-Afternoon Snack Brings Sharper Choices — Espresso, Cold Pressed Juices — To Carry The Group Through To The End Of The Day.
- A Quiet Goodbye With Wi-Fi-Enabled Departure Forms And Optional Group Photo Round Off A Day That Felt Effortless From Start To End.`,
  },
  {
    id: 2,
    title: "Venue Details",
    items: [],
    markdown: `- Tana Boardroom — Executive Day Hire
- An 8-Hour Soundproof Boardroom Hire For Up To 14 Executives, Includes Full A/V, Conference Phone, Stationery, Tea And Coffee Service, Mid-Day Snacks, And A Plated 3-Course Lunch. Located On The 3rd Floor Of Tana Business Park With Secure Access And Free Parking.
- Suitable For Strategy Sessions, Quarterly Reviews, Board Meetings, Client Presentations, And Confidential Negotiations. Custom Layouts (U-Shape, Theatre) Available On Request With 24 Hours Notice.`,
  },
];

export default function WorkPlaceDetails() {
  return (
    <>
      <HotelShowcase />

      <ProductDetailsMetaInfo
        title="TANA BOARDROOM - EXECUTIVE DAY HIRE"
        rating={5}
        subtitle="SOUNDPROOF + A/V READY + CATERING + ON-SITE COORDINATOR + FREE PARKING"
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
              sections={VENUE_DETAILS_SECTIONS}
              title="Venue"
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
