import { FaBolt } from "react-icons/fa";
import { TextPrimary500 } from "@/components/Text";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ProductCardType } from "@/features/product/types/product.types";
import { cn } from "@/lib/utils";

const flashOffers: ProductCardType[] = [
  {
    id: "1",
    image: "/resort1.jpg",
    title: "Sunset Beach Resort Nosy Be",
    description:
      "All Inclusive + Ocean View + Free Airport Transfers",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "2",
    image: "/resort1.jpg",
    title: "Île aux Nattes Paradise Lodge",
    description:
      "Beachfront bungalows + Daily Breakfast + Snorkeling included",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "3",
    image: "/resort1.jpg",
    title: "Palissandre Côte Ouest",
    description:
      "Half Board + Pool Access + Complimentary Activities",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "4",
    image: "/resort1.jpg",
    title: "Manambato Lake Lodge",
    description:
      "Full Board + Pirogue Excursion + Nature Walks",
    price: 9000,
    rating: 4,
    discount: 28,
  },
  {
    id: "5",
    image: "/resort1.jpg",
    title: "Mora Mora Beach Retreat",
    description:
      "Bed & Breakfast + Sunset Cruise + Free Wifi",
    price: 9000,
    rating: 4,
    discount: 28,
  },
];

const gridItems = ["md:col-span-2", "", "", ""];

export default function FlashOffer() {
  return (
    <Section
      title={
        <>
          <FaBolt className="inline text-red-600" />
          Flash <TextPrimary500>Offers</TextPrimary500>
        </>
      }
      description="Limited-time deals you don't want to miss. Book before they're gone."
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashOffers.map((offer, index) => (
            <div key={offer.id} className={cn(gridItems[index])}>
              <ProductCard
                title={offer.title}
                description={offer.description}
                rating={4}
                price={9000}
                image={offer.image}
                overlay={index === 0}
                align="left"
                imageSize={index === 0 ? "lg" : "md"}
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
