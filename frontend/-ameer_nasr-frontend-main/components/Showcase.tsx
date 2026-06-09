"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShowcaseSlides } from "@/types/showcase.type";

type Props = {
  slides: ShowcaseSlides;
};

export default function Showcase({ slides }: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id}>
            <div className="relative w-full h-[52vh] min-h-[360px] sm:h-[60vh] md:h-[66vh] lg:h-[72vh] xl:h-[76vh] overflow-hidden">
              <Image
                fill
                src={slide.src}
                alt={slide.title}
                priority={index === 0}
                sizes="100vw"
                className="size-full object-cover"
              />

              {/* Dim overlay so the text always has enough contrast
                  regardless of the underlying image. */}
              <div
                className="absolute inset-0 bg-black/40 pointer-events-none"
                aria-hidden
              />

              {/* Heading + sub-heading + CTA stack. Anchored center
                  with a max width so the line lengths stay readable
                  even on ultra-wide screens. */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-10">
                <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg max-w-4xl leading-tight">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="mt-3 sm:mt-4 text-white/90 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed drop-shadow-md">
                    {slide.subtitle}
                  </p>
                )}
                {slide.ctaLabel && (
                  <Link
                    href={slide.ctaHref ?? "#"}
                    className="mt-6 sm:mt-8 inline-flex items-center bg-[#22A628] hover:bg-[#1d8e22] text-white font-semibold px-6 sm:px-8 py-3 rounded-md shadow-lg transition-colors"
                  >
                    {slide.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
