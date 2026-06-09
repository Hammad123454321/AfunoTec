"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";

const images = [
  { id: 1, src: "/resort2.png", alt: "Workplace hero" },
  { id: 2, src: "/resort4.jpg", alt: "Boardroom interior" },
  { id: 3, src: "/resort2.png", alt: "Reception lobby" },
  { id: 4, src: "/resort4.jpg", alt: "Break-out area" },
  { id: 5, src: "/resort2.png", alt: "Video Gallery", isVideo: true },
];

const VENUE_TITLE = "TANA BOARDROOM - EXECUTIVE DAY HIRE";

export default function HotelShowcase() {
  const [main, ...thumbnails] = images;
  return (
    <section className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[420px] md:h-[520px] overflow-hidden">
        <div className="md:col-span-2 relative group h-full">
          <Image
            src={main.src}
            alt={main.alt}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>

        <div className="md:col-span-1 hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {thumbnails.map((thumb) => (
            <div
              key={thumb.id}
              className="relative group overflow-hidden cursor-pointer"
            >
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                sizes="(min-width: 768px) 17vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {thumb.isVideo && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white gap-2">
                  <Play size={32} className="fill-white" aria-hidden />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">
                    Video Gallery
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f2f4f7] py-3 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium flex-wrap">
            <Link href="/" className="hover:text-blue-500 transition-colors uppercase">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link
              href="/work-places"
              className="hover:text-blue-500 transition-colors uppercase"
            >
              Workplaces & Hubs
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400 uppercase">{VENUE_TITLE}</span>
          </div>
        </Container>
      </div>
    </section>
  );
}
