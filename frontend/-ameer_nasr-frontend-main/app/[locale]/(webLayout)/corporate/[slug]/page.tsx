import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";
import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import PackageSummary from "@/features/product/components/ProductInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import HotelShowcase from "./_components/HotelShowcase";
import RelatedHotels from "./_components/RelatedHotels";

export default function NosyBeDetails() {
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
        <div className="lg:flex lg:gap-6">
          <div className="flex-4">
            <PackageSummary />
          </div>
          <div className="flex-1">
            <BookingCalender
              tooltip="Select your dates"
              basePrice={1000}
              discountPrice={0}
              durationType="night"
              type="single"
            />
            {/* <ExampleUsage /> */}
            {/* <CalenderBookings /> */}
          </div>
        </div>
      </Container>

      {/* <ProductProof /> */}
      {/* <AdditionalProductInfo /> */}
      <RelatedHotels />
    </>
  );
}
