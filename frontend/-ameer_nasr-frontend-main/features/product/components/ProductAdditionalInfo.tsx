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
        // Figma: dark first word + green highlight + thin emerald
        // underline directly below the heading. The inline-block wrap
        // keeps the underline tight to the text width.
        <span className="inline-block border-b-2 border-emerald-500 pb-1.5">
          <span className="text-gray-900">{title}</span>{" "}
          <TextPrimary500>{highlightText}</TextPrimary500>
        </span>
      }
      align="left"
      id="additional-information"
    >
      <Container>
        {/* 6-col base grid. `wide` cards take half the row (col-span-3),
            `normal` cards take a third (col-span-2). The Figma "2 on
            top + 3 on bottom" layout falls out naturally when callers
            pass [wide, wide, normal, normal, normal]. */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative h-44 sm:h-52 md:h-60 overflow-hidden group ${
                card.span === "wide" ? "md:col-span-3" : "md:col-span-2"
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

              {/* Bottom-anchored content panel — matches the Figma
                  semi-transparent dark band with title + short copy. */}
              <div className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-white">
                <h3 className="text-sm font-semibold leading-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] leading-snug text-gray-100/90 line-clamp-2">
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
