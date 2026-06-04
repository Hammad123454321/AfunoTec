import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import HotelShowcase from "./_components/HotelShowcase";
import OtayoBookingCard from "./_components/OtayoBookingCard";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import RelatedHotels from "./_components/RelatedHotels";
import { PackageSummary } from "@/features/product/components/ProductInfo";
import Container from "@/components/layout/Container";
import ContactForm from "../../corporate/ContactForm";

// Events detail Figma is unique: 2 tabs only (EVENTS SUMMARY / EVENTS
// DETAILS), an external Otayo booking sidebar instead of the in-app
// calendar, and an inline contact form before the related-offers
// carousel.
const EVENT_SUMMARY_SECTIONS = [
  {
    id: 1,
    title: "Conditions",
    items: [],
    markdown: `- Tickets Are Non-Refundable And Non-Exchangeable.
- Event Closing Time May Be Subject To Change.
- The Day Pass Is Open To All, With No Age Restrictions. The Evening Pass Is Reserved For People Aged 13 And Over.
- It Is Forbidden To Bring Food And Drink From Outside.
- By Taking Part In The Event, You Agree To Be Photographed And Filmed By The Organising Team. These Images May Be Shared On Social Networks.
- Catering And Bars Are Available At The Café Du Vieux Conseil.
- Remember To Arrive Early To Make Yourself Comfortable And Get The Best Experience.
- The Venue Doesn't Have A Car Park, But Nearby Parking Is Available — Owners Are Responsible For Their Vehicles.
- Only Part Of The Restaurant Is Protected From Bad Weather.
- Dress Code: Afric Vibes Festival`,
  },
  {
    id: 2,
    title: "Event Lineup",
    items: [],
    markdown: `**Afric Vibes Festival: What To Expect?**

- Vibrant Celebration Of African Culture
- Live Music Performance
- Art Exhibition
- Face Painting With Traditional Motifs
- Fashion Show In The Colours Of The Continent
- Slam Poetry
- Dance Performances
- Music: Afrobeats, Amapiano & Dancehall
- DJ Sets (Line-Up To Be Announced Very Soon)`,
  },
  {
    id: 3,
    title: "Activity Time",
    items: ["10:00 - 19:30"],
  },
  {
    id: 4,
    title: "Duration",
    items: ["5 Hours 30 Minutes"],
  },
  {
    id: 5,
    title: "Venue",
    items: ["Café De Vieux Conseil, Port Louis"],
  },
  {
    id: 6,
    title: "Ticket Category",
    items: [],
    markdown: `**Tickets For Afric Vibes Festival:**

- Day Pass (Rs 100) — Open To All Ages
- Evening Pass (Rs 1000) — 13 Years And Over`,
  },
];

const EVENT_DESCRIPTION_SECTIONS = [
  {
    id: 1,
    title: "About Afric Vibes Festival",
    items: [],
    markdown: `- On July 26, Africa Will Take Over The Café Du Vieux Conseil With The Afric Vibes Festival, A Vibrant Celebration Of The Culture, Music, And Talents That Define The Heartbeat Of The African Continent.
- This One-Of-A-Kind Event Features A Dynamic Lineup Of African Musicians, Traditional Drummers, And DJs Spinning Afrobeats, Amapiano, And Dancehall.
- Beyond Music, The Festival Showcases A Powerful Blend Of Live Dance Performances, Fashion Shows, Art Exhibitions, And Spoken Word Poetry, As Well As Interactive Activities Like Face Painting.
- From Morning To Night, Afric Vibes Brings People Together To Move, Express, Create, And Celebrate A Soulful Fusion Of Heritage And Contemporary Afro Energy, Offering Something For Everyone In A Space Of Joy, Connection, And Cultural Pride. It's An Experience To Be Relished... With A Bang!
- **Dress Code: Afric Vibes Festival**`,
  },
];

export default function EventDetails() {
  return (
    <>
      <HotelShowcase />

      <ProductDetailsMetaInfo
        title="AFRIC VIBES FESTIVAL"
        rating={4}
        subtitle="26 JULY 2025: VIBRANT CELEBRATION OF AFRICAN CULTURE AT CAFÉ DU VIEUX CONSEIL"
        description="On July 26, Africa will take over the Café Du Vieux Conseil with the Afric Vibes Festival, a vibrant celebration of the culture, music, and talents that define the heartbeat of the African continent."
        features={[
          "Afrobeats/Amapianos/Dancehall",
          "DJ Sets",
          "Open To All As From 13 Years Old",
        ]}
      />

      <ProductInfoSectionButtons
        items={["Events Summary", "Events Details"]}
      />

      <Container className="py-8 lg:py-12">
        <div className="lg:flex lg:gap-8 items-start relative">
          <div className="flex-[3] min-w-0 space-y-12">
            <PackageSummary
              sections={EVENT_SUMMARY_SECTIONS}
              title="Event"
              highlightText="Summary"
              id="events-summary"
            />
            <PackageSummary
              sections={EVENT_DESCRIPTION_SECTIONS}
              title="Event"
              highlightText="Description"
              id="events-details"
            />
          </div>

          <div className="flex-1 mt-8 lg:mt-0 lg:sticky lg:top-24">
            <OtayoBookingCard
              basePrice={9900}
              otayoUrl="https://www.otayo.com"
            />
          </div>
        </div>
      </Container>

      {/* Inline contact form for ticket enquiries — same shape as the
          Corporate page's "Fill in the form below". */}
      <ContactForm />

      <RelatedHotels />
    </>
  );
}
