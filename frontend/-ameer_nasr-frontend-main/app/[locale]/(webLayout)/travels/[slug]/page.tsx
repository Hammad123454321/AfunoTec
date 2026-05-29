import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import RelatedHotels from "./_components/RelatedHotels";
import AdditionalProductInfo from "@/features/product/components/ProductAdditionalInfo";
import ProductProof from "@/features/product/components/ProductProof";
import PackageSummary from "@/features/product/components/ProductInfo";
import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import GalleryComponent from "@/components/Gallery";

export default function TravelDetails() {
  return (
    <>
      <GalleryComponent />
      <ProductDetailsMetaInfo />
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
            <BookingCalender
              tooltip="Select your travel dates"
              basePrice={1000}
              discountPrice={800}
              durationType="night"
            />
            {/* <CalenderBookings /> */}
          </div>
        </div>
      </Container>

      <ProductProof />
      <AdditionalProductInfo />
      <RelatedHotels />
    </>
  );
}
