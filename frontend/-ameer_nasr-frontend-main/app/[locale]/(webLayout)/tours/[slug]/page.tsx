import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";
import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import HotelShowcase from "./_components/HotelShowcase";
import RelatedHotels from "./_components/RelatedHotels";

// Tours detail Figma reuses the activity-detail layout with
// tour-specific copy. Once the backend lands these all become rows
// returned by /api/tours/:slug.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Tour Details",
    startDate: "2025-08-01",
    endDate: "2025-08-15",
    description:
      "Enjoy a special 16% off on the Andasibe Rainforest 2-Day Lemur Discovery Tour.",
    stayPeriod: "01 Aug - 30 Nov 2025",
    bookBy: "15 August 2025",
  },
];

const PACKAGE_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Inclusions",
    items: [],
    markdown: `**Andasibe Rainforest — 2 Day Lemur Discovery Tour:**

- Private Air-Conditioned Transport From Antananarivo
- 1 Night Accommodation In A 3-Star Forest Lodge (Standard Room)
- All Park Entrance Fees (Andasibe-Mantadia National Park)
- Licensed English-Speaking Naturalist Guide For 2 Days
- All Meals (1 Breakfast + 2 Lunches + 1 Dinner)
- Bottled Water Throughout The Tour
- Pickup And Drop-Off From Antananarivo Hotels`,
  },
  {
    id: 2,
    title: "Complimentary Tour Activities",
    items: [],
    markdown: `**Included In The Tour:**

- Day Walk Through Analamazaotra Reserve (Spot The Indri Lemur)
- Night Walk Searching For Chameleons And Nocturnal Lemurs
- Visit To The Vakôna Forest Lodge Private Reserve
- Crocodile Farm & Reptile Park Visit
- Hot Drink Welcome On Arrival At The Lodge`,
  },
  {
    id: 3,
    title: "Tour Times",
    items: ["Day 1: 06:00 departure from Antananarivo", "Day 2: 19:00 return"],
  },
  {
    id: 4,
    title: "Duration",
    items: ["2 Days / 1 Night"],
  },
  {
    id: 5,
    title: "Meeting Point",
    items: [
      "Your Hotel Lobby In Antananarivo OR Ivato International Airport (Free Pickup)",
    ],
  },
  {
    id: 6,
    title: "Operating Days",
    items: [],
    markdown: `- Daily Departures Year-Round (Subject To Availability)
- Best Viewing Season: April – November
- Lemurs Are Active Year-Round; Rainy Season May Impact Trail Access`,
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
    markdown: `- 30+ Days Prior To Departure – Full Refund
- 15-29 Days Prior To Departure – 50% Refund
- 7-14 Days Prior To Departure – 25% Refund
- Less Than 7 Days, No-Show & Unexpected Departure – No Refund`,
  },
  {
    id: 9,
    title: "Conditions & Additional Info",
    items: [],
    markdown: `**Booking The Andasibe Rainforest Tour — Reservation:**

- Bring Sturdy Walking Shoes, Light Rain Gear And Insect Repellent.
- The Night Walk Requires A Headlamp (Can Be Rented At The Reserve For Ar 5,000).
- Single Supplement Available For Solo Travellers At Additional Cost.
- Minimum 2 Persons For Departures To Operate; Solo Bookings Confirmed Once Group Reaches Minimum.
- Lemur Sightings Cannot Be Guaranteed But Are Highly Probable In Analamazaotra Reserve.`,
  },
];

const TOUR_DETAILS_SECTIONS = [
  {
    id: 1,
    title: "What To Expect?",
    items: [],
    markdown: `- Andasibe Rainforest 2-Day Lemur Discovery — What To Expect?
- Step Into Madagascar's Most Accessible Rainforest, Just 3 Hours East Of Antananarivo. This Two-Day Tour Combines World-Class Lemur Spotting, Night Walks Under The Canopy, And A Comfortable Forest-Lodge Stay.
- Day 1 Begins With An Early Departure From Antananarivo, A Scenic Drive Through Highland Villages, And A Lunch Stop At The Peyrieras Reserve. Afternoon Visit To The Vakôna Forest Lodge Private Reserve Lets You Get Closer To Black-And-White Ruffed Lemurs In Their Semi-Wild Habitat.
- After Check-In At The Lodge, A Magical Night Walk With Headlamps Reveals Chameleons, Sleeping Birds, And The Eyes Of Nocturnal Mouse Lemurs.
- Day 2 Brings The Highlight: A Guided Trek Through Analamazaotra Reserve In Search Of The Indri — The World's Largest Lemur, Famous For Its Haunting Song. With Patient Tracking And A Bit Of Luck, You'll Hear Their Calls Echo Through The Forest And Spot Multiple Lemur Species Including The Diademed Sifaka.
- After A Bush Lunch And Optional Visit To The Mantadia Crocodile Farm, You'll Return To Antananarivo By Early Evening, Ready To Rest Or Continue Your Madagascar Journey.`,
  },
  {
    id: 2,
    title: "Tour Details",
    items: [],
    markdown: `- Andasibe Rainforest 2-Day Lemur Discovery
- A Two-Day Naturalist-Guided Tour To Andasibe-Mantadia National Park With Comfortable Lodge Accommodation, Private Transport And All Meals Included. Designed For Travellers Who Want To See Madagascar's Iconic Indri Lemur Without The Logistical Headache Of A Self-Drive.
- This Tour Is Suitable For Families, Solo Travellers, Photography Enthusiasts And First-Time Visitors To Madagascar. Trails Range From Easy To Moderate; Average Walking Time Is 3-4 Hours Per Day With Frequent Stops For Wildlife Observation.`,
  },
];

export default function TourDetailsPage() {
  return (
    <div className="bg-[#fcfdfd]">
      <HotelShowcase />

      <ProductDetailsMetaInfo
        title="ANDASIBE RAINFOREST TOUR - 2 DAY LEMUR DISCOVERY"
        rating={5}
        subtitle="PRIVATE TRANSPORT + LODGE STAY + ALL MEALS + GUIDED HIKES + PARK FEES"
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
              sections={TOUR_DETAILS_SECTIONS}
              title="Tour"
              highlightText="Details"
              id="package-conditions"
            />
          </div>

          <div className="flex-1 mt-8 lg:mt-0 lg:sticky lg:top-24">
            <BookingCalender
              basePrice={14250}
              discountPrice={17000}
              durationType="day"
              currency="Ar"
            />
          </div>
        </div>
      </Container>

      <div className="pb-20">
        <RelatedHotels />
      </div>
    </div>
  );
}
