"use client";

import { MapPin, Share2, Heart, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import Heading from "@/components/Heading";

const badges = [
  "All Inclusive",
  "Wedding Ceremony",
  "Food & Drink",
  "Kids' Activities",
  "Restaurant & Bar",
  "Pool & Spa",
];

export default function ProductDetailsMetaInfo() {
  return (
    <section className="py-8 bg-white border-b border-gray-50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Main Info */}
          <div className="flex-1 max-w-3xl">
            <div className="flex items-center gap-1.5 mb-2">
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-[#f59e0b] text-[#f59e0b]"
                />
              ))}
              <span className="text-gray-400 font-medium text-sm ml-2">
                4-Star Resort
              </span>
            </div>

            <Heading
              as="h1"
              size="h5"
              className="text-3xl md:text-4xl text-[#00a6e6] font-serif mb-2 leading-tight"
            >
              Ocean&apos;s Creek Beach Hotel
            </Heading>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 flex-wrap">
              <MapPin size={16} className="text-gray-400" />
              <span>Balaclava, North, Mauritius</span>
              <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                Full Board
              </span>
            </div>

            {/* Badges List */}
            <div className="flex flex-wrap gap-2 mb-8">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-[#eaf7ee] text-[#2d9e3f] px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-tight shadow-sm border border-[#d2ead6]"
                >
                  <span className="mr-1.5">✓</span>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Side Actions (Optional or used for other info) */}
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded-full w-12 h-12 shadow-sm hover:bg-gray-50 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded-full w-12 h-12 shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors group">
              <Heart size={20} className="group-hover:fill-red-500" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
