import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";
import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import PackageSummary from "@/features/product/components/ProductInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import HotelShowcase from "./_components/HotelShowcase";
import RelatedHotels from "./_components/RelatedHotels";

export default function ThingsToDoDetails() {
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
      
      <Container className="py-12">
        <div className="lg:flex lg:gap-8 items-start relative">
          <div className="flex-[3]">
            <PackageSummary />
          </div>
          <div className="flex-1 lg:sticky lg:top-24">
            <div className="my-20">
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
        </div>
      </Container>

      <RelatedHotels />
    </>
  );
}
