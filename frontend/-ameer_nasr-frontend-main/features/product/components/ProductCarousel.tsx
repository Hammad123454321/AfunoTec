import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemClassName?: string;
  showNavigation?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
};

const delays = [3500, 4000, 4500, 5000];

export function ProductCarousel<T extends { id: string }>({
  items,
  renderItem,
  itemClassName = "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4",
  showNavigation = true,
  showDots = false,
  autoplay = false,
}: CarouselProps<T>) {
  return (
    <Carousel
      showDots={showDots}
      autoplay={autoplay}
      autoplayDelay={delays[Math.floor(Math.random() * delays.length)]}
      opts={{ align: "start" }}
    >
      <CarouselContent className="p-1">
        {items.map((item, index) => (
          <CarouselItem key={item.id} className={itemClassName}>
            <div className="mx-auto h-full">{renderItem(item, index)}</div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {showNavigation && (
        <div className="hidden xl:block">
          <CarouselPrevious className="absolute top-1/2 z-10" />
          <CarouselNext className="absolute top-1/2 z-10" />
        </div>
      )}
    </Carousel>
  );
}
