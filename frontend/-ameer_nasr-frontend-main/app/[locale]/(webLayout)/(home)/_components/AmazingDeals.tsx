import ExploreButton from "@/components/ExploreButton";
import Heading from "@/components/Heading";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import { cn } from "@/lib/utils";
import Image from "next/image";

// 1. Define the data type
type DealImageType = {
  id: number;
  image: string;
  title: string;
  bgColor: string;
};

// 2. Sample image data
const dealImages: DealImageType[] = [
  {
    id: 1,
    image: "/amazingNosyBee.png",
    title: "Nosy Be",
    bgColor: "bg-primary-500",
  },
  {
    id: 2,
    image: "/amazingToursAndEco.png",
    title: "Tours and Eco Tourism",
    bgColor: "bg-warning-500",
  },
  {
    id: 3,
    image: "/amazingEvents.png",
    title: "Events",
    bgColor: "bg-blue-500",
  },
];

export default function AmazingDeals() {
  return (
    <Section
      title={
        <>
          <Image
            src="/toursImage.png"
            width={36}
            height={36}
            alt="Tours Icon"
            className=" "
          />
          Other Amazing <TextPrimary500>Deals</TextPrimary500>
        </>
      }
      cta={<ExploreButton href="/" />}
    >
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dealImages.map((deal) => (
            <div key={deal.id} className="relative w-full flex justify-center">
              <Image
                src={deal.image}
                alt={deal.title}
                width={424}
                height={424}
                className="w-full aspect-square object-cover"
              />

              <div
                className={cn(
                  "absolute inset-x-4 flex items-center justify-center top-1/2 -translate-y-1/2 py-4 text-white",
                  deal.bgColor
                )}
              >
                <Heading size="h5" as="h3">
                  {deal.title}
                </Heading>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
