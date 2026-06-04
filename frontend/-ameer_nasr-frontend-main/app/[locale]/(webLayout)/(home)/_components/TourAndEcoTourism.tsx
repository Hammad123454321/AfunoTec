import * as React from "react";
import { Mountain } from "lucide-react";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import Container from "@/components/layout/Container";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ProductCarousel } from "@/features/product/components/ProductCarousel";
import { ProductCardType } from "@/features/product/types/product.types";
import { productData } from "@/features/product/data";
import ExploreButton from "@/components/ExploreButton";

export default function ToursAndEcoTourism() {
  return (
    <Section
      id="tours"
      title={
        <>
          <Mountain
            className="inline-block text-green-600"
            size={32}
            aria-hidden
          />
          Tours & <TextPrimary500>Eco Tourism</TextPrimary500>
        </>
      }
      cta={<ExploreButton href="/" />}
    >
      <Container>
        <ProductCarousel<ProductCardType>
          items={productData}
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              discount={product?.discount?.toString()}
              rating={5}
              price={9000}
              redirect={`/tours/${product.id}`}
            />
          )}
        />
      </Container>
    </Section>
  );
}
