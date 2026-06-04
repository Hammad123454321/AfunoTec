import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import HotelShowcase from "./_components/HotelShowcase";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import RelatedHotels from "./_components/RelatedHotels";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";

// Transportation detail reuses the activity / tour detail layout with
// transportation-specific copy. Once the backend lands these all
// become rows returned by /api/transportation/:slug.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Service Details",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    description:
      "Enjoy a special 15% off on round-trip Ivato Airport private sedan transfers.",
    stayPeriod: "01 Aug - 30 Sep 2025",
    bookBy: "31 August 2025",
  },
];

const PACKAGE_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Inclusions",
    items: [],
    markdown: `**Ivato Airport — Private Sedan Transfer:**

- Private Air-Conditioned Sedan (Toyota Camry Or Equivalent)
- English-Speaking Professional Driver
- Flight Monitoring And 60-Minute Free Wait Time At Airport
- Up To 3 Large Suitcases + 3 Cabin Bags Per Vehicle
- Bottled Water On Board
- All Tolls And Parking Fees Included
- 24/7 Customer Support Hotline
- Free Cancellation Up To 24 Hours Before Pickup`,
  },
  {
    id: 2,
    title: "Additional Stops",
    items: [],
    markdown: `**Optional Add-Ons (Pay At Booking):**

- Extra Luggage – Ar 1,500 Per Bag
- Child Seat – Ar 2,000 (Reserved 12h In Advance)
- Welcome Sign At Arrival Gate – Free
- Second City Stop En Route – Ar 3,000`,
  },
  {
    id: 3,
    title: "Pickup Time",
    items: ["Available 24 hours / 7 days"],
  },
  {
    id: 4,
    title: "Duration",
    items: ["45-60 minutes (depending on traffic)"],
  },
  {
    id: 5,
    title: "Meeting Point",
    items: [
      "Ivato International Airport — Arrivals Hall, Exit Gate B. Driver holds a sign with your name.",
    ],
  },
  {
    id: 6,
    title: "Vehicle Capacity",
    items: [],
    markdown: `- Up To 3 Passengers Per Sedan
- Larger Groups Should Book A 7-Seat SUV Or 12-Seat Mini Coach
- All Vehicles Are Non-Smoking`,
  },
  {
    id: 7,
    title: "Price Validity",
    items: ["Until 31/12/2025 — peak season surcharges may apply"],
  },
  {
    id: 8,
    title: "Cancellation Policy",
    items: [],
    markdown: `- 24+ Hours Before Pickup – Full Refund
- 12-24 Hours Before Pickup – 50% Refund
- Less Than 12 Hours, No-Show – No Refund
- Driver Wait Time Beyond 60 Minutes Charged At Ar 2,000 / 15 Minutes`,
  },
  {
    id: 9,
    title: "Conditions & Additional Info",
    items: [],
    markdown: `**Booking The Airport Transfer — Important Information:**

- Provide Your Flight Number At Booking So We Can Monitor Delays.
- Pickup Address Must Be Within Antananarivo City Limits; Outside Areas Quoted Separately.
- Driver Will Wait Up To 60 Minutes Past Scheduled Arrival Free Of Charge.
- For Departures, Allow Sufficient Buffer Time For Traffic — We Recommend Leaving 4 Hours Before International Flights.
- Payment Accepted In Mvola, Airtel Money, Orange Money, And Bank Card.`,
  },
];

const SERVICE_DETAILS_SECTIONS = [
  {
    id: 1,
    title: "What To Expect?",
    items: [],
    markdown: `- Ivato Airport Private Sedan Transfer — What To Expect?
- Skip The Queue For A Taxi And Step Straight Into Your Own Air-Conditioned Sedan The Moment You Land At Ivato International. Your English-Speaking Driver Tracks Your Flight In Real Time And Waits With A Sign Carrying Your Name At The Arrivals Gate.
- The Sedan Comfortably Seats Three Passengers With Room For Three Large Suitcases And Three Cabin Bags. Complimentary Bottled Water Is Provided On Board, And A USB Charging Port Is Available For Your Devices.
- The Drive From Ivato To Central Antananarivo Takes Around 45-60 Minutes Depending On Traffic. Drivers Are Briefed To Take The Fastest Route And Avoid Tourist-Trap Detours.
- For Departures, Your Driver Will Arrive 15 Minutes Before The Agreed Pickup Time. We Recommend Allowing 4 Hours Before International Flights And 2 Hours Before Domestic Flights To Account For Traffic And Check-In.`,
  },
  {
    id: 2,
    title: "Service Details",
    items: [],
    markdown: `- Ivato Airport Private Sedan Transfer — Door-To-Door Service
- A Stress-Free, Door-To-Door Transfer Between Ivato International Airport And Any Hotel, Restaurant, Or Residence Within Antananarivo City Limits. The Vehicle Is Reserved Exclusively For Your Group — No Sharing With Other Passengers.
- This Service Is Suitable For Business Travellers, Couples, Families With Up To One Child Seat, And Anyone Prioritising Comfort And Reliability Over The Lowest Possible Fare.`,
  },
];

export default function TransportationDetailsPage() {
  return (
    <>
      <HotelShowcase />

      <ProductDetailsMetaInfo
        title="ANTANANARIVO AIRPORT - PRIVATE SEDAN TRANSFER"
        rating={5}
        subtitle="DOOR-TO-DOOR + ENGLISH DRIVER + LUGGAGE INCLUDED + FLIGHT MONITORING + 24/7 SUPPORT"
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
              sections={SERVICE_DETAILS_SECTIONS}
              title="Service"
              highlightText="Details"
              id="package-conditions"
            />
          </div>

          <div className="flex-1 mt-8 lg:mt-0 lg:sticky lg:top-24">
            <BookingCalender
              basePrice={5500}
              discountPrice={6500}
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
