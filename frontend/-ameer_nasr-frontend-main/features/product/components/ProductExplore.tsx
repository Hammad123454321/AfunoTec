import Heading from "@/components/Heading";
import Image from "next/image";

interface CardItem {
  topText: string;
  bottomText: string;
  imgSrc: string;
}

const activities: CardItem[] = [
  { topText: "This", bottomText: "Weekend", imgSrc: "/explore/weekend.png" },
  { topText: "All", bottomText: "Inclusive", imgSrc: "/explore/inclusive.png" },
  { topText: "Family", bottomText: "Friendly", imgSrc: "/explore/family.png" },
  { topText: "Free Meal", bottomText: "Upgrades", imgSrc: "/explore/meal.png" },
];

export default function ProductExplore() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {activities.map((item, idx) => (
        <div
          key={idx}
          className="relative group rounded-3xl overflow-hidden shadow-lg h-[400px]"
        >
          <Image
            src={item.imgSrc}
            alt={item.bottomText}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />

          {/* Centered Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
            <span className="text-lg font-medium opacity-90 mb-1">
              {item.topText}
            </span>
            <span className="text-3xl md:text-4xl font-serif font-semibold tracking-tight">
              {item.bottomText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
