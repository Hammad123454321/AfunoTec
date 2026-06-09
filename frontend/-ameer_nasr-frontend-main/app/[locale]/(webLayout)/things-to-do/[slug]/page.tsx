import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";
import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import HotelShowcase from "./_components/HotelShowcase";
import RelatedHotels from "./_components/RelatedHotels";

// Figma source data. Once the backend lands these all come from
// /api/things-to-do/:slug.
const PACKAGE_OFFERS = [
  {
    id: 1,
    label: "Special Offer",
    title: "Package Details",
    startDate: "2025-07-01",
    endDate: "2025-07-15",
    description:
      "Enjoy a special 18% discount at Ile aux Cerfs Aparthotel!",
    stayPeriod: "01 Jul - 30 Sep 2025",
    bookBy: "31 July 2025",
  },
];

const PACKAGE_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Inclusions",
    items: [],
    markdown: `**Odysea — Oceanarium Mauritius — Package Inclusions:**

- Entrance Ticket
- Visit The 1st Oceanarium In Mauritius & In The Indian Ocean
- Access To The Different Domains (Coral Reef, Inland Open Sea, Invertebrates, Lagoon, Mangroves & Beaches, Sub Oceanic View)
- Learn About The Marine World Like Never Before
- Discover 45 Aquatic Habitats With 200 Species Through Glass Spheres, Large Tanks, Large Window Panes And Tunnels
- Access To The Gift Shop
- Access To The Outdoor Food Area
- Optional: Guided Visit (1h30mins)`,
  },
  {
    id: 2,
    title: "Complimentary Island Activities",
    items: [],
    markdown: `**Free Activities At Ile Des Deux Cocos:**

- Giant Chess
- Bocce Ball
- Beach Volley
- Frisbee
- Badminton
- Archery
- Snorkeling Or Glass-Bottom In The Blue Bay Marine Park`,
  },
  {
    id: 3,
    title: "Activity Time",
    items: ["09:00 - 17:00"],
  },
  {
    id: 4,
    title: "Duration",
    items: ["5 Hours 30 Minutes"],
  },
  {
    id: 5,
    title: "Meeting Point",
    items: [
      "Private Jetty At Ile Des Deux Cocos, Blue Bay (Approx. 500m From Blue Bay Public Beach)",
    ],
  },
  {
    id: 6,
    title: "Operating Days",
    items: [],
    markdown: `- Tuesday, Thursday, Saturday (March – August)
- Saturday Is On Request (March – August). Please Call Us On 269-1500 To Confirm Availability
- Everyday (September – October)`,
  },
  {
    id: 7,
    title: "Price Validity",
    items: ["Until 31/10/2025"],
  },
  {
    id: 8,
    title: "Cancellation Policy",
    items: [],
    markdown: `- 20-21 Days Prior To The Activity – 25%
- 6-9 Days Prior To The Activity – 50%
- 1-3 Days Prior To The Activity – 75%
- Less Than 3 Days Before, No-Show & Unexpected Departure – 100%`,
  },
  {
    id: 9,
    title: "Conditions & Additional Info",
    items: [],
    markdown: `**Booking The Luxury Day At Ile Des Deux Cocos Island — Reservation:**

- All Participants Will Be Required To Sign A Disclaimer Form Prior To The Activity.
- You Are Advised To Arrive 15 Minutes Before Your Allocated Start Time. The Start And Finish Times Are Fixed. The Activity Will Still End At The Allocated Time, Even If You Arrived Late.
- In Case Of More Members Of The Group Are Late, It Will Not Be Possible To Incorporate Them Into The Group After The Briefing Has Started.
- The Activity Is Subject To Availability And Weather Conditions.
- Mauritian ID Card Or Resident Permit Must Be Shown Upon Arrival.`,
  },
];

const ACTIVITY_DETAILS_SECTIONS = [
  {
    id: 1,
    title: "What To Expect?",
    items: [],
    markdown: `- Luxury Day At Ile Des Deux Cocos Island – What To Expect?
- Step Into A Day Of Pure Bliss At Ile Des Deux Cocos, Where Unparalleled Comfort And Exceptional Service Await. Ideal For Gatherings Of Friends, Families, Or Colleagues, This Island Retreat Promises An Unforgettable Experience.
- Your Journey Begins At The Ile Des Deux Cocos Jetty, Just A Brief 5-Minute Shuttle Boat Ride Southeast. As You Step Ashore, You'll Receive A Warm Welcome With A Refreshing Cool Towel And A Welcome Drink, Instantly Immersing Yourself In The Island's Charm.
- Indulge In The Island's World-Class Offerings, From Exploring The Vibrant Underwater World During Snorkelling Or Glass-Bottom Boat Adventures To Engaging In Friendly Beach Volleyball Matches, Challenging Games Of Giant Chess, Or Leisurely Rounds Of Badminton.
- The Day Continues With A Delectable Lunch Served Amidst Picturesque Surroundings. Whether You Savor In Cozy Tents With Plush Sofas, Each Bite Of The Expertly Crafted Dishes Tantalizes Your Taste Buds.
- As You Relish Your Meal, The Ambiance Is Further Enhanced By The Soothing Melodies Of Live Music, Creating A Perfect Backdrop For A Memorable Dining Experience. As Ile Des Deux Cocos Invites You To Bask In The Joy Of Shared Moments, Making Your Visit A Cherished Memory Of Delightful Activities, Exquisite Cuisine, And Genuine Camaraderie.`,
  },
  {
    id: 2,
    title: "Activity Details",
    items: [],
    markdown: `- Luxury Day At Ile Des Deux Cocos Island
- A Day Of Pure Luxury With An All-Inclusive Package At Ile Des Deux Cocos Island Where You Will Enjoy Delicious Food, A Trip To Blue Bay Marine Park, Refreshing Drinks, Fun Activities And Much More.
- Whether You Choose To Meander Along The Sandy Beaches, Drift Into The Gentle Island Way Of Life Under A Palm Tree, Have Fun With The Number Of Beach Games On Offer Or Explore The Outstanding Underwater Marine Life, Ile Des Deux Cocos Offers An Exceptional And Unforgettable Experience In True VIP Style!`,
  },
];

export default function ThingsToDoDetails() {
  return (
    <>
      <HotelShowcase />

      <ProductDetailsMetaInfo
        title="LUXURY DAY AT ILE DES DEUX COCOS ISLAND"
        rating={4}
        subtitle="BOAT TRANSFERS + LUNCH BUFFET + SELECTION OF UNLIMITED DRINKS + FREE ACTIVITIES"
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
          <div className="flex-[3] space-y-12">
            <PackageSummary
              offers={PACKAGE_OFFERS}
              sections={PACKAGE_SUMMARY_SECTIONS}
              id="package-summary"
            />
            <PackageSummary
              sections={ACTIVITY_DETAILS_SECTIONS}
              title="Activity"
              highlightText="Details"
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

      <RelatedHotels />
    </>
  );
}
