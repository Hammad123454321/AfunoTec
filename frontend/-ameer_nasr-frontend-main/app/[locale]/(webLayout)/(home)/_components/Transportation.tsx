import * as React from "react";
import Image from "next/image";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import { ProductCarousel } from "@/features/product/components/ProductCarousel";
import Container from "@/components/layout/Container";
import { ProductCardType } from "@/features/product/types/product.types";
import { productData } from "@/features/product/data";
import { ProductCard } from "@/features/product/components/ProductCard";
import ExploreButton from "@/components/ExploreButton";

export default function Transportation() {
  return (
    <Section
      id="transportation"
      title={
        <>
          <Image
            src="/transport-icon.png"
            width={36}
            height={36}
            alt="Transportation icon"
            className="inline-block"
          />
          Transportation & <TextPrimary500>Car Rental</TextPrimary500>
        </>
      }
      cta={<ExploreButton href="/transportation" />}
    >
      <Container>
        <ProductCarousel<ProductCardType>
          items={productData}
          renderItem={(data) => (
            <ProductCard
              key={data.id}
              image={data.image}
              title={data.title}
              description={data.description}
              discount={data?.discount?.toString()}
              rating={5}
              price={9000}
              redirect={`/tours/${data.id}`}
            />
          )}
        />
      </Container>
    </Section>
  );
}
