import * as React from "react";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ProductCarousel } from "@/features/product/components/ProductCarousel";
import { ProductCardType } from "@/features/product/types/product.types";

type Props = {
  items: ProductCardType[];
  title: React.ReactNode;
};

export default function RelatedProducts({ title, items = [] }: Props) {
  return (
    <Section id="tours" title={title}>
      <Container>
        <ProductCarousel<ProductCardType>
          items={items}
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
