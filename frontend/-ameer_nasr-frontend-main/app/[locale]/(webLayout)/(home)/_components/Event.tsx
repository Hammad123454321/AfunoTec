import * as React from "react";
import Image from "next/image";
import { TextPrimary500 } from "@/components/Text";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { ProductCarousel } from "@/features/product/components/ProductCarousel";
import { ProductCardType } from "@/features/product/types/product.types";
import { eventData } from "@/features/product/data";
import { ProductCard } from "@/features/product/components/ProductCard";
import ExploreButton from "@/components/ExploreButton";

export default function EventSection() {
  return (
    <Section
      title={
        <>
          <Image
            src="/activity-icon.png"
            width={36}
            height={36}
            alt="Corporate deal icon"
            className="inline-block"
          />
          
          <TextPrimary500>Corporate deal</TextPrimary500>
        </>
      }
      cta={<ExploreButton href="/" />}
    >
      <Container>
        <ProductCarousel<ProductCardType>
          items={eventData}
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              discount={product?.discount?.toString()}
              rating={5}
              price={9000}
              redirect={`/nosy-bee/${product.id}`}
            />
          )}
        />
      </Container>
    </Section>
  );
}
