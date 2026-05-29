"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  tooltip?: string;
  basePrice?: number;
  discountPrice?: number;
  durationType?: "day" | "night";
  type?: "single" | "range";
};

type MealPlan = {
  id: string;
  name: string;
};

const mealPlans: MealPlan[] = [
  { id: "hb", name: "Half Board" },
  { id: "ai", name: "All Inclusive" },
  { id: "re-hb", name: "Romantic Escape · Half Board" },
  { id: "re-ai", name: "Romantic Escape · All Inclusive" },
];

export default function BookingCalender({
  basePrice = 9000,
  discountPrice = 11250,
  durationType = "night",
  tooltip,
  type = "single",
}: Props) {
  const [currentMonth] = useState("March 2026");
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOffset = 6; // Start on Sunday (index 6 if Mon=0)

  return (
    <div className="w-full max-w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
      {/* Header - Green Price Section */}
      <div className="bg-[#2d9e4f] p-8 text-white">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm font-medium opacity-90">From</span>
          <h2 className="text-base md:text-xl font-serif font-semibold leading-none tracking-tight">
            MGA {new Intl.NumberFormat("en-US").format(basePrice)}
          </h2>
          <span className="text-sm font-medium opacity-90">
            /{durationType}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm opacity-80">
          <span className="line-through">
            MGA{" "}
            {new Intl.NumberFormat("en-US").format(
              discountPrice || basePrice * 1.2,
            )}{" "}
            /{durationType}
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded font-semibold">
            Save 20%
          </span>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            SELECT YOUR DATES
          </h3>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-full text-gray-400 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-serif font-semibold text-gray-800">
              {currentMonth}
            </span>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-full text-gray-400 hover:bg-gray-50 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-gray-300 mb-2"
              >
                {day}
              </span>
            ))}

            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => {
              const isSelected = day === 15;
              return (
                <button
                  key={day}
                  className={cn(
                    "h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-sm font-semibold transition-all",
                    isSelected
                      ? "bg-[#2d9e3f] text-white shadow-lg shadow-green-100"
                      : "text-gray-400 hover:bg-gray-50",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2d9e3f]" />
              <span className="text-xs font-semibold text-gray-400">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 border-2 border-[#2d9e3f] rounded-sm" />
              <span className="text-xs font-semibold text-gray-400">
                Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-gray-100 rounded-sm" />
              <span className="text-xs font-semibold text-gray-400">
                Unavailable
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* Check-in/Out Display */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1">
              CHECK-IN
            </p>
            <p className="text-lg font-semibold text-gray-400">_</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1">
              CHECK-OUT
            </p>
            <p className="text-lg font-semibold text-gray-400">_</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1">
              NIGHTS
            </p>
            <p className="text-lg font-semibold text-gray-400">_</p>
          </div>
        </div>

        {/* Meal Plans */}
        <div className="space-y-4 pt-4 text-sm font-semibold text-gray-600">
          {mealPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 grow"
            >
              <span>{plan.name}</span>
              <button className="text-[#ef4444] hover:underline transition-all font-serif">
                Select dates &rarr;
              </button>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="flex items-center justify-between pt-8">
          <span className="text-xl font-semibold text-gray-800">Subtotal</span>
          <div className="text-right">
            <p className="text-xl font-serif font-semibold text-[#2d9e3f]">
              MGA 0
            </p>
          </div>
        </div>

        {/* Book Now Button */}
        <Link href={`/bookings`}>
          <button className="w-full py-5 bg-[#2d9e3f] text-white text-lg font-semibold rounded-2xl hover:bg-[#268c44] transition-all shadow-xl shadow-green-100 transform active:scale-95 mb-5">
            Book now
          </button>
        </Link>
      </div>
    </div>
  );
}
