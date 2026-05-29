import ActivitiesDeals from "./_components/ActivitiesDeals";
import AmazingDeals from "./_components/AmazingDeals";
import FlashOffer from "./_components/FlashOffer";
import HotelApartmentsCard from "./_components/HotelApartmentsCard";
import NosyBee from "./_components/NosyBee";
import ToursAndEcoTourism from "./_components/TourAndEcoTourism";
import Transportation from "./_components/Transportation";
import TravelDeals from "./_components/TravelDeals";
import WhyChooseUs from "./_components/WhyChooseUs";
import HomeShowcase from "./_components/HomeShowcase";
import WebSearch from "@/features/search/components/WebSearch";
import TravelSectionImage from "./_components/TravelSectionImage";
import EventSection from "./_components/Event";
import WhyChooseUsWithIcons from "./_components/WhyChooseUs";
// import AdditionalInformation from "./_components/AdditionalInformation";

export default async function Home() {
  return (
    <>
      <HomeShowcase />
      <WebSearch />
      <FlashOffer />
      <HotelApartmentsCard />
      <ActivitiesDeals />
      <TravelSectionImage />
      <ToursAndEcoTourism />
      <TravelDeals />
      <Transportation />
      <TravelSectionImage />
      <NosyBee />
      <EventSection />
      {/* <AmazingDeals /> */}
      {/* <AdditionalInformation /> */}
      <WhyChooseUsWithIcons />
    </>
  );
}
