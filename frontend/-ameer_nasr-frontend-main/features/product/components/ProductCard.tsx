import Image from "next/image";
import Heading from "@/components/Heading";
import { cn } from "@/lib/utils";
import { LucideStar } from "lucide-react";
import { ProductCardType } from "../types/product.types";
import Link from "next/link";
import { DiscountBadge } from "@/components/Badge";

export function ProductCard({
  image,
  title,
  description,
  overlay = false,
  align,
  discount = "",
  price,
  rating = 5,
  redirect,
  imageSize = "md",
}: Omit<ProductCardType, "id">) {
  return (
    <div className="relative h-full overflow-hidden flex flex-col gap-2 shadow border border-gray-100 group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:cursor-pointer">
      {discount && <DiscountBadge>{discount}</DiscountBadge>}

      <div
        className={cn(
          "overflow-hidden relative w-full",
          // mobile-first: keep the card image proportional to viewport
          // width so it never explodes on phones, then step up at
          // larger breakpoints. `lg` cards (featured tiles in
          // FlashOffer) get extra height once there is room.
          imageSize === "md" && "h-44 sm:h-48 md:h-52 lg:h-56",
          imageSize === "lg" && "h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96",
        )}
      >
        <Image
          className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={image}
          alt={title}
        />
      </div>

      <div
        className={cn("p-4 pt-4 flex flex-col gap-2", {
          "absolute bottom-0 inset-x-0 bg-black/70 text-white": overlay,
          "": !overlay,
        })}
      >
        <div
          className={cn(
            "flex flex-col gap-2 text-left",
            align === "center" && "justify-center items-center text-center"
          )}
        >
          {redirect ? (
            <Link href={redirect} className="after:absolute after:inset-0">
              <Heading
                size="h5"
                align={align === "center" ? "center" : "left"}
                className={cn(
                  "text-gray-950 line-clamp-2",
                  overlay && "text-white text-shadow"
                )}
              >
                {title}
              </Heading>
            </Link>
          ) : (
            <Heading
              size="h5"
              align={align === "center" ? "center" : "left"}
              className={cn(
                "text-gray-950 line-clamp-2",
                overlay && "text-white text-shadow"
              )}
            >
              {title}
            </Heading>
          )}
          <p
            className={cn(
              "text-gray-900 font-medium line-clamp-2 text-left text-sm lg:text-base",
              align === "center" &&
              "text-gray-900 font-medium line-clamp-2 text-center",
              overlay && "text-white text-shadow"
            )}
          >
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap mt-2">
          <div className="flex gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
              <LucideStar
                key={i}
                className="fill-highlight-500 stroke-highlight-500 transition-transform duration-300 group-hover:scale-110"
                size={16}
              />
            ))}
          </div>
          <p
            className={cn(
              "text-xs md:text-md lg:text-base",
              overlay && "text-shadow"
            )}
          >
            As from{" "}
            <strong
              className={cn("font-currency font-semibold", {
                "text-danger-400": overlay,
                "text-danger-500": !overlay,
              })}
            >
              {price}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
