"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, HelpCircle, X, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  tooltip?: string;
  basePrice?: number;
  discountPrice?: number;
  durationType?: "day" | "night";
  type?: "single" | "range";
  /**
   * Display currency. Defaults to "Rs" because the booking demo data
   * shown in the Figma is a Mauritius hotel; pass `currency="MGA"` for
   * Madagascar inventory.
   */
  currency?: string;
};

// Figma fixes October 2020 as the demo month. Until a real month picker
// lands we render that snapshot verbatim so the layout matches.
type CalendarMonth = {
  label: string;
  /** 0=Mon … 6=Sun. October 1st 2020 was a Thursday → index 3. */
  startDayOffset: number;
  daysInMonth: number;
};

const DEMO_MONTH: CalendarMonth = {
  label: "October 2020",
  startDayOffset: 3,
  daysInMonth: 31,
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function BookingCalender({
  basePrice = 9900,
  discountPrice = 11900,
  durationType = "night",
  currency = "Rs",
}: Props) {
  const month = DEMO_MONTH;
  const days = Array.from({ length: month.daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 flex flex-col">
      {/* Price Header — white background, red price + grey strikethrough.
          Matches the Figma frame exactly. */}
      <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 px-4 py-3 border-b border-gray-200">
        <span className="font-currency text-rose-600 font-bold text-lg leading-none">
          From {currency} {new Intl.NumberFormat("en-US").format(basePrice)}/
        </span>
        <span className="text-gray-900 text-sm flex items-center gap-1 capitalize">
          {durationType}
          <HelpCircle
            size={14}
            className="text-gray-400"
            aria-label="Price information"
          />
        </span>
        <span className="ml-auto text-gray-400 text-sm">
          <span className="font-currency line-through">
            {currency} {new Intl.NumberFormat("en-US").format(discountPrice)}/
          </span>{" "}
          <span className="capitalize">{durationType}</span>
        </span>
      </div>

      {/* "Selected Check In" green bar */}
      <div className="bg-[#22a628] text-white px-4 py-2.5 text-sm font-medium">
        Selected Check In
      </div>

      {/* Month nav */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">{month.label}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-7 gap-y-3 text-center">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="text-xs font-medium text-gray-500 pb-2"
            >
              {day}
            </span>
          ))}

          {Array.from({ length: month.startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => (
            <button
              key={day}
              type="button"
              className={cn(
                "h-9 w-9 mx-auto flex items-center justify-center rounded text-sm transition-colors",
                "text-gray-700 hover:bg-gray-100",
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Legend row */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="w-3 h-3 border border-gray-300" aria-hidden />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="w-3 h-3 bg-gray-300" aria-hidden />
          <span>Not Available</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700"
        >
          <X size={14} aria-hidden />
          <span>Clear Date</span>
        </button>
      </div>

      {/* How-to-order video link */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-center gap-2 text-rose-600 text-sm">
        <span>How to order ( step by Step Video )</span>
        <span className="inline-flex items-center justify-center w-5 h-5 bg-rose-600 rounded-sm">
          <Youtube size={14} className="text-white" fill="currentColor" />
        </span>
      </div>

      {/* Check-In / Check-Out / Nights grid */}
      <div className="grid grid-cols-3 border-t border-gray-200">
        {[
          { label: "Check-IN", value: "-" },
          { label: "Check-Out", value: "-" },
          { label: "Nights", value: "-" },
        ].map((cell, idx) => (
          <div
            key={cell.label}
            className={cn(
              "px-3 py-3 text-center",
              idx < 2 && "border-r border-gray-200",
            )}
          >
            <div className="text-xs text-gray-400 mb-1">{cell.label}</div>
            <div className="text-base text-gray-700">{cell.value}</div>
          </div>
        ))}
      </div>

      {/* Discount banner */}
      <div className="bg-[#1e3a8a] text-white text-center px-4 py-3 border-t border-gray-200">
        <p className="text-sm leading-tight">Click on the Booking Options to</p>
        <p className="text-sm font-bold leading-tight tracking-wide">
          See the DISCOUNTED PRICE
        </p>
      </div>

      {/* Subtotal + Book Now */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base text-gray-900">Subtotal</span>
          <span className="text-xl font-bold text-[#22a628]">
            {currency} 0
          </span>
        </div>
        <Link href="/bookings">
          <button
            type="button"
            className="w-full py-3 bg-[#22a628] text-white text-base font-bold rounded hover:bg-[#1d8e22] transition-colors"
          >
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
}
