import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import HotelShowcase from "./_components/HotelShowcase";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import RelatedHotels from "./_components/RelatedHotels";
import AdditionalProductInfo from "@/features/product/components/ProductAdditionalInfo";
import ProductProof from "@/features/product/components/ProductProof";
import PackageSummary from "@/features/product/components/ProductInfo";
import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";
import DiscoverRooms from "@/features/product/components/DiscoverRoom";

export default function EventDetails() {
  return (
    <>
      <HotelShowcase />
      <ProductDetailsMetaInfo />
      <ProductAICard />
      <ProductInfoSectionButtons
        items={[
          "Package Summary",
          "Package Conditions",
          //"Rooms",
          "Additional Information",
        ]}
      />
      <Container>
        <div className="lg:flex lg:gap-8 items-start relative py-12">
          <div className="flex-[3]">
            <PackageSummary />
          </div>
          <div className="flex-1 lg:sticky lg:top-24">
            <BookingCalender
              tooltip="Select your dates"
              basePrice={1000}
              discountPrice={0}
              durationType="night"
              type="single"
            />
            {/* <CalenderBookings /> */}
          </div>
        </div>
      </Container>

      <ProductProof />
      <AdditionalProductInfo />
      <DiscoverRooms />
      <RelatedHotels />
    </>
  );
}
