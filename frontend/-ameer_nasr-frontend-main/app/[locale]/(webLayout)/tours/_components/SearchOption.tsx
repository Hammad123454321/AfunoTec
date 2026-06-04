"use client";

import { useState } from "react";
import { Calendar, MapPin, Search } from "lucide-react";

// Tours-listing search: Booking Date + Choose Location + SEARCH.
// Matches the Tours Figma frame (two fields, no activity-type select).
export default function ToursSearchOption({
  className = "",
}: {
  className?: string;
}) {
  const [bookingDate, setBookingDate] = useState("");
  const [location, setLocation] = useState("");

  const inputBase = `
    flex-1 outline-none text-sm py-1.5
    text-gray-700 placeholder-gray-600 bg-transparent
  `;

  const fieldBase = `
    flex items-center gap-3 px-4 py-3
    border-gray-200 bg-white
  `;

  return (
    <div className={`w-full mx-auto max-w-4xl ${className}`}>
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden divide-y md:divide-y-0 md:divide-x">
        {/* Booking date */}
        <div
          className={`${fieldBase} md:flex-1 border-b md:border-b-0 md:border-r`}
        >
          <Calendar className="w-5 h-5 text-red-600 flex-shrink-0" />
          <input
            type="text"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            placeholder="Booking Date"
            className={inputBase}
            aria-label="Booking date"
          />
        </div>

        {/* Choose location */}
        <div
          className={`${fieldBase} md:flex-1 border-b md:border-b-0 md:border-r`}
        >
          <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Choose Location"
            className={inputBase}
            aria-label="Choose location"
          />
        </div>

        {/* Search button */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-[#1BA0E2] hover:bg-[#1590D2] text-white px-6 py-3 font-medium text-sm transition-colors w-full md:w-auto"
        >
          <Search className="w-4 h-4" />
          SEARCH
        </button>
      </div>
    </div>
  );
}