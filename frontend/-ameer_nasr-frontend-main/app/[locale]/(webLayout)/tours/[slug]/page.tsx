import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import ProductAICard from "@/features/product/components/ProductAICard";
import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import PackageSummary from "@/features/product/components/ProductInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import HotelShowcase from "./_components/HotelShowcase";
import RelatedHotels from "./_components/RelatedHotels";
import CalenderBookings from "@/features/booking/CalenderBookings";
import ProductProof from "@/features/product/components/ProductProof";
import AdditionalProductInfo from "@/features/product/components/ProductAdditionalInfo";

export default function NosyBeDetails() {
  return (
    <div className="bg-[#fcfdfd]">
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
          {/* Main Left Content */}
          <div className="flex-[3] min-w-0">
            <PackageSummary />
            <ProductProof />
            <AdditionalProductInfo />
          </div>

          {/* Sticky Right Sidebar */}
          <div className="flex-1 lg:sticky lg:top-24 mt-12 lg:mt-0 transition-all duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
              <BookingCalender
                tooltip="Select your dates"
                basePrice={1000}
                discountPrice={0}
                durationType="person"
                type="single"
              />
              <div className="p-6 pt-0">
                {/* <CalenderBookings /> */}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="pb-20">
        <RelatedHotels />
      </div>
    </div>
  );
}
