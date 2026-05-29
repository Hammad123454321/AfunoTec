"use client";
import GalleryComponent from "@/components/Gallery";
import Container from "@/components/layout/Container";
import BookingCalender from "@/features/booking/BookingCalender";
import { ExampleUsage } from "@/features/booking/PriceSelector";
import AdditionalProductInfo from "@/features/product/components/ProductAdditionalInfo";
import ProductDetailsMetaInfo from "@/features/product/components/ProductDetailsMetaInfo";
import PackageSummary from "@/features/product/components/ProductInfo";
import ProductInfoSectionButtons from "@/features/product/components/ProductInfoSectionButtons";
import ProductProof from "@/features/product/components/ProductProof";
import RelatedHotels from "./_components/RelatedHotels";
import RoomsSection from "./_components/RoomSectiont";
import CalenderBookings from "@/features/booking/CalenderBookings";

const demoRooms = [
  {
    title: "Standard Room",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop",
    occupancy: "2 Adults + 2 Children OR 3 Adults",
    area: 28,
    bedding: "1 King Size Bed Or 2 Twin Beds",
  },
  {
    title: "Sea View Room",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
    occupancy: "2 Adults + 2 Children OR 3 Adults",
    area: 28,
    bedding: "1 King Size Bed Or 2 Twin Beds",
  },
  {
    title: "Partial Sea View Room (Lateral)",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=400&fit=crop",
    occupancy: "2 Adults + 2 Children OR 3 Adults",
    area: 28,
    bedding: "1 King Size Bed Or 2 Twin Beds",
  },
  {
    title: "Family Room",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=400&fit=crop",
    occupancy: "2 Adults + 2 Children OR 3 Adults",
    area: 28,
    bedding: "1 King Size Bed Or 2 Twin Beds",
  },
];

export default function NosyBeDetails() {
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

      <ProductProof />

      <Container>
        <RoomsSection
          rooms={demoRooms}
          onDetailsClick={(room) => console.log(room)}
        />
      </Container>
      <AdditionalProductInfo />
      <RelatedHotels />
    </>
  );
}
