import Image from "next/image";
import React from "react";
import { TextPrimary500 } from "@/components/Text";
import { ProductCardType } from "@/features/product/types/product.types";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { ProductCard } from "@/features/product/components/ProductCard";
import { cn } from "@/lib/utils";
import ExploreButton from "@/components/ExploreButton";

const data: ProductCardType[] = [
  {
    id: "1",
    image: "/activitiesImage1.png",
    title: "Preskil Island Resort Mauritius",
    description: "Half Board/ All Inclusive + Complimentary",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "2",
    image: "/activitiesImage1.png",
    title: "Preskil Island Resort Mauritius",
    description: "Half Board/ All Inclusive + Complimentary",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "3",
    image: "/activitiesImage1.png",
    title: "Preskil Island Resort Mauritius",
    description: "Half Board/ All Inclusive + Complimentary",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "4",
    image: "/activitiesImage1.png",
    title: "Preskil Island Resort Mauritius",
    description: "Half Board/ All Inclusive + Complimentary",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "5",
    image: "/activitiesImage1.png",
    title: "Preskil Island Resort Mauritius",
    description: "Half Board/ All Inclusive + Complimentary",
    price: 9000,
    rating: 4,
    discount: 28,
  },
];

const gridItems = [
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export default function ActivitiesDeals() {
  return (
    <Section
      id="activities"
      title={
        <>
          <Image
            src="/activity-icon.png"
            width={36}
            height={36}
            alt="Activity icon"
            className="inline-block"
          />
          Things<TextPrimary500>to do</TextPrimary500>
        </>
      }
      cta={<ExploreButton href="/" />}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {data.map((offer, index) => (
            <div key={offer.id} className={cn(gridItems[index])}>
              <ProductCard
                title={offer.title}
                description={offer.description}
                rating={4}
                price={9000}
                image={offer.image}
                overlay={index === 0 || index === 1}
                imageSize={index === 0 || index === 1 ? "lg" : "md"}
                align="left"
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
