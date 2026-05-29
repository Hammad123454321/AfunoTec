import Heading from "@/components/Heading";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import Image from "next/image";

interface InfoCard {
  id: number;
  image: string;
  title: string;
  description: string;
  span?: "wide" | "normal"; // wide = 2 columns, normal = 1 column
}

interface AdditionalInfoProps {
  cards: InfoCard[];
  title?: string;
  highlightText?: string;
}

export function AdditionalProductInfo({
  cards,
  title = "ADDITIONAL",
  highlightText = "HOTEL INFO",
}: AdditionalInfoProps) {
  return (
    <Section
      title={
        <TextPrimary500>
          {title} {highlightText}
        </TextPrimary500>
      }
      align="left"
      id="additional-information"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative h-[400px] rounded overflow-hidden group ${
                card.span === "wide" ? "md:col-span-2" : ""
              }`}
            >
              {/* Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 space-y-2 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                <Heading as="h3" size="h5" weight="normal">
                  {card.title}
                </Heading>
                <p className="text-sm md:text-base leading-relaxed text-gray-200">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Example Usage
export default function ExampleUsage() {
  // This would come from your API
  const infoCards = [
    {
      id: 1,
      image: "/additionalInfoImage.png",
      title: "Luxury Accommodation",
      description:
        "Experience unparalleled comfort in our elegantly designed rooms featuring modern amenities and breathtaking views.",
      span: "wide" as const,
    },
    {
      id: 2,
      image: "/additionalInfoImage.png",
      title: "World-Class Dining",
      description:
        "Savor exquisite cuisines prepared by our award-winning chefs using the finest local ingredients.",
      span: "normal" as const,
    },
    {
      id: 3,
      image: "/additionalInfoImage.png",
      title: "Spa & Wellness",
      description:
        "Rejuvenate your body and mind at our state-of-the-art spa with premium treatments and facilities.",
      span: "normal" as const,
    },
    {
      id: 4,
      image: "/additionalInfoImage.png",
      title: "Beach Activities",
      description:
        "Enjoy a wide range of water sports and beach activities in our pristine private beach area.",
      span: "normal" as const,
    },
    {
      id: 5,
      image: "/additionalInfoImage.png",
      title: "Event Spaces",
      description:
        "Host your special events in our versatile venues equipped with modern technology and professional service.",
      span: "normal" as const,
    },
  ];

  return (
    <>
      {/* With API data
      <AdditionalProductInfo
        cards={infoCards}
        title="DISCOVER"
        highlightText="OUR FACILITIES"
      /> */}
      {/* Default usage */}
      <AdditionalProductInfo cards={infoCards} />
    </>
  );
}
