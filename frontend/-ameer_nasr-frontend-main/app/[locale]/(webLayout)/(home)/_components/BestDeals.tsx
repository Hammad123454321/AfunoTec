"use client";

import { TextPrimary500 } from "@/components/Text";

export type Category =
  | "hotels"
  | "activities"
  | "tours"
  | "transportation"
  | "meetings"
  | "travel"
  | "nosyBee";

export default function BestDeals() {
  return (
    <div className="px-4 py-8 max-w-[1297px] mx-auto">
      <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold text-center leading-11">
        BEST DEALS & <TextPrimary500>PROMOTIONS</TextPrimary500>
      </h1>

      <p className="text-center text-gray-600 mt-2 mb-6 text-lg md:text-xl lg:text-2xl leading-8">
        Find best deals on Hotels, Villas, and much more...
      </p>

      {/* <CategoryTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <SearchBox selectedCategory={selectedCategory} /> */}
    </div>
  );
}
