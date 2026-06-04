"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Events Figma replaces the gallery with a single wide hero poster
// carrying the event title + ticket-price badges. No 2x2 thumbnail
// grid — the poster IS the visual identity of the event.
const EVENT_TITLE = "AFRIC VIBES FESTIVAL";

export default function HotelShowcase() {
  return (
    <section className="relative w-full">
      {/* Hero poster */}
      <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden bg-gray-900">
        <Image
          src="/resort2.png"
          alt={EVENT_TITLE}
          fill
          sizes="100vw"
          className="object-cover opacity-80"
          priority
        />

        {/* Day / Evening ticket price chips pinned top-right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 items-end">
          <div className="bg-white/95 px-4 py-2 rounded text-center">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Day Ticket
            </p>
            <p className="text-base sm:text-lg font-bold text-rose-600 leading-none">
              RS 100
            </p>
          </div>
          <div className="bg-white/95 px-4 py-2 rounded text-center">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Evening Ticket
            </p>
            <p className="text-base sm:text-lg font-bold text-rose-600 leading-none">
              RS 1000
            </p>
          </div>
        </div>

        {/* Title overlay center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] opacity-90 mb-2">
            Celebrating African Culture
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight drop-shadow-lg">
            {EVENT_TITLE}
          </h1>
          <p className="text-sm sm:text-base mt-3 font-semibold drop-shadow">
            26 TH JULY 2025
          </p>
          <p className="text-xs sm:text-sm mt-1 uppercase tracking-wider opacity-90">
            Venue: Café De Vieux Conseil, Port Louis
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-[#f2f4f7] py-3 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium flex-wrap">
            <Link href="/" className="hover:text-blue-500 transition-colors uppercase">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link
              href="/events"
              className="hover:text-blue-500 transition-colors uppercase"
            >
              Events Deals
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400 uppercase">{EVENT_TITLE}</span>
          </div>
        </Container>
      </div>
    </section>
  );
}
