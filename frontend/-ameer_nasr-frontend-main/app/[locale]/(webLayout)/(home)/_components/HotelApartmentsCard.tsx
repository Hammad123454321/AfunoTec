import * as React from "react";
import Image from "next/image";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import { ProductCard } from "@/features/product/components/ProductCard";
import Container from "@/components/layout/Container";
import { ProductCarousel } from "@/features/product/components/ProductCarousel";
import { ProductCardType } from "@/features/product/types/product.types";
import { productData } from "@/features/product/data";

export default function HotelApartmentsCard() {
  return (
    <Section
      align="center"
      title={
        <>
          <Image
            src="/hotelApartments.png"
            width={36}
            height={36}
            alt="Tours Icon"
            className=" "
          />
          Hotels <TextPrimary500>Stay</TextPrimary500>
        </>
      }

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
