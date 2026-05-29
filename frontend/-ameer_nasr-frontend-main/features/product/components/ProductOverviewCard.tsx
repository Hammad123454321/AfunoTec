import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductAdType, ProductOverviewDataType } from "../types/product.types";
import { DiscountBadge } from "@/components/Badge";
import { ProductCarousel } from "./ProductCarousel";
import Heading from "@/components/Heading";
import { TextPrimary500 } from "@/components/Text";
import { LucideMapPin, Star, StarHalf, Heart, Flame } from "lucide-react";
import ProductAd from "./ProductAd";
import ProductLink from "./ProductLink";
import Link from "next/link";

export function ProductOverviewCard({
  data,
}: {
  data: ProductOverviewDataType | ProductAdType;
}) {
  const isOverviewData = (
    d: ProductOverviewDataType | ProductAdType,
  ): d is ProductOverviewDataType => "images" in d && "badges" in d;

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />,
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />,
      );
    }

    return stars;
  };

  if (!isOverviewData(data)) {
    return (
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl z-50 mb-6">
        <ProductAd data={data} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl z-50 flex flex-col md:flex-row mb-6">
      {/* Image Section */}
      <div className="relative w-full md:w-[200px] lg:w-[220px] shrink-0">
        {/* Heart Button */}
        <button className="absolute top-3 left-3 z-20 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
          <Heart size={18} className="text-gray-400 group-hover:text-red-500" />
        </button>

        {/* Discount Badge */}
        {data.discount && (
          <div className="absolute top-0 right-0 z-20 bg-red-500 text-white px-3 py-1.5 font-semibold text-sm rounded-bl-xl shadow-md">
            {data.discount}% <br />{" "}
            <span className="font-normal text-xs uppercase">off</span>
          </div>
        )}

        <ProductCarousel
          items={data.images.map((image, index) => ({
            image,
            id: index.toString(),
          }))}
          itemClassName="basis-full overflow-hidden"
          showDots={true}
          showNavigation={false}
          autoplay={true}
          renderItem={(item) => (
            <div className="relative h-[180px] md:h-full min-h-[180px]">
              <Image
                className="w-full h-full object-cover"
                width={380}
                height={380}
                src={item.image}
                alt={data.title}
              />
            </div>
          )}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4 md:p-6 bg-white min-w-0">
        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-2 shrink-0">
          {renderStarRating(data.rating)}
        </div>

        {/* Title */}
        <div className="mb-2">
          <ProductLink href={`${data.id}`}>
            <h3 className="text-base text-left md:text-xl font-serif text-[#00a6e6] hover:underline transition-all leading-tight">
              {data.title}
            </h3>
          </ProductLink>
        </div>

        {/* Features/Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-gray-500 font-medium">
          <span className="bg-[#fff9e6] text-[#b38f00] px-3 py-1 rounded font-semibold uppercase text-[10px] tracking-wider">
            HOTELS
          </span>
          {data.badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="h-4 w-px bg-gray-300" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-left text-sm leading-relaxed mb-4 line-clamp-2">
          {data.description}
        </p>

        {/* Guaranteed Status */}
        <div className="flex items-center gap-1.5 text-[#2d9e4f] font-medium text-sm mb-6">
          <Flame size={16} className="fill-[#e63946] text-[#e63946]" />
          <span>Lowest price guaranteed for this deal</span>
        </div>

        {/* Footer */}
        <div className=" flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <LucideMapPin size={16} className="text-gray-400" />
            <span>{data.location || "South"}</span>
            <span className="text-gray-300 mx-1">·</span>
            <Link
              target="_blank"
              href={`${data.mapLink}`}
              className="text-blue-500 hover:underline"
            >
              Show map
            </Link>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-xs mb-1 font-medium">As from</p>
            <div className="flex flex-col">
              <div className="flex items-baseline justify-end gap-1 text-[#2d9e4f]">
                <span className="text-xl md:text-xl font-serif font-semibold leading-none">
                  MGA {data.price.toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400 text-xs font-medium mt-1">/night</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type BadgeProps = {
  isActive?: boolean;
} & React.ComponentProps<"span">;

export function Badge({ children, isActive, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-sm font-medium border-l-2 border-l-warning-500",
        isActive ? "bg-warning-500 text-white" : "bg-gray-200 text-gray-800",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
