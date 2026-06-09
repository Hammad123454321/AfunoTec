import * as React from "react";
import { Plane } from "lucide-react";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import Container from "@/components/layout/Container";
import { ProductCarousel } from "@/features/product/components/ProductCarousel";
import { productData } from "@/features/product/data";
import { ProductCardType } from "@/features/product/types/product.types";
import { ProductCard } from "@/features/product/components/ProductCard";
import ExploreButton from "@/components/ExploreButton";

export default function TravelDeals() {
  return (
    <Section
      id="travel-deals"
      title={
        <>
          <Plane
            className="inline-block text-rose-500 -rotate-12"
            size={32}
            aria-hidden
          />
          <TextPrimary500>Travel </TextPrimary500>deals
        </>
      }
      cta={<ExploreButton href="/" />}
    >
      <Container>
        <ProductCarousel<ProductCardType>
          items={productData}
          renderItem={(offer) => (
            <ProductCard
              key={offer.id}
              image={offer.image}
              title={offer.title}
              description={offer.description}
              discount={offer?.discount?.toString()}
              rating={5}
              price={9000}
              redirect={`/tours/${offer.id}`}
            />
          )}
        />
      </Container>
    </Section>
  );
}
