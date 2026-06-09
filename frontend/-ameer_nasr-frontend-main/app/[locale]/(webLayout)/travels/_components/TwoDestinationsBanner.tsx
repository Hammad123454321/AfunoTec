"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Each slide pairs two destinations with a tagline. Order matches the
// Figma "Two Destinations, One Unforgettable Journey" banner row.
const SLIDES: ReadonlyArray<{
  id: string;
  imgSrc: string;
  alt: string;
  headline: string;
}> = [
  {
    id: "asia-europe",
    imgSrc: "/travels/img11.png",
    alt: "Asia + Europe paired journey",
    headline: "Two Destinations, One Unforgettable Journey.",
  },
  {
    id: "africa-middle-east",
    imgSrc: "/travels/img7.png",
    alt: "Africa + Middle East paired journey",
    headline: "Africa & Middle East — One Continental Adventure.",
  },
  {
    id: "indian-ocean-asia",
    imgSrc: "/travels/img5.png",
    alt: "Indian Ocean + Asia paired journey",
    headline: "Indian Ocean Beaches Meet Asia's Cultural Heart.",
  },
];

export default function TwoDestinationsBanner() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const prev = () =>
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <div className="relative mt-10 sm:mt-12 overflow-hidden h-44 sm:h-56 md:h-72">
      <Image
        key={slide.id}
        src={slide.imgSrc}
        alt={slide.alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-center px-6">
          {slide.headline}
        </h2>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700 shadow z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700 shadow z-10"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
