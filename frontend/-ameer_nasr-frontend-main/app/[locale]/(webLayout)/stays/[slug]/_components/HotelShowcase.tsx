"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const images = [
  { id: 1, src: "/resort2.png", alt: "Main Resort View" },
  { id: 2, src: "/resort4.jpg", alt: "Resort Detail 1" },
  { id: 3, src: "/resort2.png", alt: "Resort Detail 2" },
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
            <h1 className="text-3xl md:text-5xl font-serif font-semibold text-shadow mb-2">
              Ocean&apos;s Creek Beach Hotel
            </h1>
            <p className="text-sm md:text-lg font-medium opacity-90 max-w-2xl leading-relaxed">
              Experience the ultimate beachfront luxury in Mauritius with
              stunning views
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
            {/* View All Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer">
              <span className="text-white font-semibold text-lg">
                + View All
              </span>
            </div>
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
              href="/stays"
              className="hover:text-blue-500 transition-colors"
            >
              Stays Deals
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400">
              Ocean&apos;s Creek Beach Hotel
            </span>
          </div>
        </Container>
      </div>
    </section>
  );
}
