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

// Featured-card spans need to be honored only when the parent grid
// actually has enough columns to keep the layout balanced. At `md`
// (2 cols) a col-span-2 fills a whole row by itself which is fine; at
// `lg` (3 cols) the featured card spans 2/3 and the next card fills
// the remaining slot — that's the design intent. Anything narrower
// (single column) needs no span at all.
function featuredSpan(index: number): string {
  if (index !== 0) return "";
  return "md:col-span-2 lg:col-span-2";
}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {flashOffers.map((offer, index) => (
            <div key={offer.id} className={cn(featuredSpan(index))}>
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
