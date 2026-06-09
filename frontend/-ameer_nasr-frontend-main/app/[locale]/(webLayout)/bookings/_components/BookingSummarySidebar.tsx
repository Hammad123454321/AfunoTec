"use client";

import {
  CreditCard,
  Headphones,
  ShieldCheck,
  Calendar,
  Phone,
  Star,
  Check,
  Info,
  BedSingle,
  Users,
} from "lucide-react";
import Image from "next/image";
import NeedHelpCard from "./NeedHelpCard";

export default function BookingSummarySidebar() {
  return (
    <div>
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-8 animate-in fade-in duration-700">
        {/* Hotel Image Section */}
        <div className="relative h-44 group overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
            alt="Hotel"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* View Details Button */}
          <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-800 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            View details
          </div>
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 text-white">
            <div className="flex gap-0.5 mb-1 opacity-90">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <h3 className="text-xl font-serif font-semibold tracking-tight">
              Riu Turquoise Mauritius
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Boxes */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-semibold text-gray-400">
                CHECK-IN
              </span>
              <p className="text-sm font-semibold text-gray-800">02 Feb 2026</p>
              <p className="text-[11px] text-gray-400 text-shadow-sm">
                From 14:00
              </p>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-semibold text-gray-400">
                CHECK-OUT
              </span>
              <p className="text-sm font-semibold text-gray-800">04 Feb 2026</p>
              <p className="text-[11px] text-gray-400 text-shadow-sm">
                Before 11:00
              </p>
            </div>
          </div>

          {/* Info Pills */}
          <div className="flex gap-2">
            <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-medium text-gray-500">
              <Users size={12} className="opacity-70" /> 2 travellers
            </div>
            <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-medium text-gray-500">
              <Calendar size={12} className="opacity-70" /> 2 nights
            </div>
            <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-medium text-gray-500">
              <BedSingle size={12} className="opacity-70" /> 1 room
            </div>
          </div>

          {/* Selected Room Card */}
          <div className="bg-[#f9f9f9] p-5 rounded-xl border border-gray-50 space-y-2">
            <span className="text-[10px] font-semibold text-gray-400 tracking-wider">
              SELECTED ROOM
            </span>
            <h4 className="text-[15px] font-semibold text-gray-800">
              Comfort Room — All Inclusive
            </h4>
            <p className="text-[12px] text-gray-400 leading-normal">
              King-size bed · 34 m² · Max 2 adults
            </p>
          </div>

          <div className="h-px bg-gray-100 mx-1" />

          {/* Pricing Breakdown */}
          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Info size={14} className="opacity-40" />
                <span>Hotel fare</span>
              </div>
              <span className="font-semibold text-gray-800">Ar 1,000</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-[#2d9e3f]">
                <Check size={14} />
                <span className="font-medium">Discount applied</span>
              </div>
              <span className="font-semibold text-[#2d9e3f]">- Ar 100</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 pl-6">Taxes & fees</span>
              <span className="font-semibold text-[#2d9e3f]">Included</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 pl-6">Booking fee</span>
              <span className="font-semibold text-[#2d9e3f]">Free</span>
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-1" />

          {/* Total Price Section */}
          <div className="flex justify-between items-center pb-2">
            <div>
              <p className="font-semibold text-[#111111] text-base leading-none mb-1.5">
                Total price
              </p>
              <p className="text-[11px] text-gray-400">All taxes included</p>
            </div>
            <div className="text-right">
              <p className="text-[24px] font-serif font-black text-[#2d9e3f] leading-none">
                Ar 900
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-1" />

          {/* Bottom Support Section */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-[#2d9e3f] text-sm font-medium">
              <Headphones size={16} strokeWidth={2} /> 24/7 customer support
            </div>
            <div className="flex items-center gap-3 text-[#2d9e3f] text-sm font-medium">
              <Check size={16} strokeWidth={2} /> Best price guaranteed
            </div>
            <div className="flex items-center gap-3 text-[#2d9e3f] text-sm font-medium">
              <ShieldCheck size={16} strokeWidth={2} /> Secure SSL payment
            </div>
          </div>
        </div>
      </div>
      <NeedHelpCard />
    </div>
  );
}
