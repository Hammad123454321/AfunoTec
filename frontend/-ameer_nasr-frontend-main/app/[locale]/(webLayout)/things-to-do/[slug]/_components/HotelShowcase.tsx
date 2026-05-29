"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const images = [
  { id: 1, src: "/resort2.png", alt: "Activity Image 1" },
  { id: 2, src: "/resort4.jpg", alt: "Activity Image 2" },
  { id: 3, src: "/resort2.png", alt: "Activity Image 3" },
];

export default function HotelShowcase() {
  return (
    <section className="relative w-full">
      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[600px] overflow-hidden">
        {/* Main Large Image */}
        <div className="md:col-span-3 relative group h-full">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Bottom Overlay Title */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-12 text-white">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#2d9e3f] mb-3 drop-shadow-md">
              Exclusive Adventure
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-semibold text-shadow mb-2">
              Luxury Day At Ile Des Deux Cocos Island
            </h1>
            <p className="text-sm md:text-lg font-medium opacity-90 max-w-2xl leading-relaxed">
              Discover pristine beaches and crystal clear waters with our
              premium day tour
            </p>
          </div>
        </div>

        {/* Smaller Images Stack */}
        <div className="md:col-span-1 hidden md:flex flex-col gap-2 h-full">
          <div className="relative flex-1 group overflow-hidden">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="relative flex-1 group overflow-hidden">
            <Image
              src={images[2].src}
              alt={images[2].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-[#f2f4f7] py-3 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-blue-500 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link
              href="/things-to-do"
              className="hover:text-blue-500 transition-colors"
            >
              Things to do
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400">Ile Des Deux Cocos Island</span>
          </div>
        </Container>
      </div>
    </section>
  );
}
