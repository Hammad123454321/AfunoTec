"use client";

import { useState } from "react";
import { ChevronDown, ArrowLeftRight } from "lucide-react";

/**
 * Fallback flight-style booking form shown at the bottom of the
 * Transportation listing when no road/sea transport matches the
 * filters. Matches the Figma frame exactly: One Way / Round Trip /
 * Multi City radios, From / To / Departure / Return / Travelers
 * fields, blue Submit button.
 *
 * Until the airline integration lands, the Submit handler is a no-op;
 * field state is local so the form stays interactive.
 */
type TripType = "one-way" | "round-trip" | "multi-city";

const TRIP_TYPES: ReadonlyArray<{ value: TripType; label: string }> = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "multi-city", label: "Multi City" },
];

export default function NotFoundFlightSearch() {
  const [tripType, setTripType] = useState<TripType>("one-way");

  return (
    <div className="mt-12">
      <p className="text-center text-rose-600 text-sm font-medium mb-4">
        Noted : If no transportation found
      </p>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Trip type radios */}
        <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-200">
          {TRIP_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="trip-type"
                value={type.value}
                checked={tripType === type.value}
                onChange={() => setTripType(type.value)}
                className="w-4 h-4 accent-sky-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>

        {/* 5-column field grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* From */}
          <div className="px-4 py-3 relative">
            <span className="text-xs text-gray-500 block mb-1">From</span>
            <div className="font-semibold text-gray-900">Madagascar</div>
            <div className="text-xs text-gray-500">
              Ivato International Airport
            </div>
            <button
              type="button"
              aria-label="Swap origin and destination"
              className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow z-10"
            >
              <ArrowLeftRight size={12} />
            </button>
          </div>

          {/* To */}
          <div className="px-4 py-3">
            <span className="text-xs text-gray-500 block mb-1">To</span>
            <div className="font-semibold text-gray-900">Nosy Be</div>
            <div className="text-xs text-gray-500">Fascene Airport</div>
          </div>

          {/* Departure */}
          <div className="px-4 py-3">
            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              Departure <ChevronDown size={12} />
            </span>
            <div className="font-semibold text-gray-900">31 JUL 25</div>
            <div className="text-xs text-gray-500">Thursday</div>
          </div>

          {/* Return */}
          <div className="px-4 py-3">
            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              Return <ChevronDown size={12} />
            </span>
            <div className="font-semibold text-gray-900">
              Tap to book return ticket
            </div>
            <div className="text-xs text-gray-500">for more saving</div>
          </div>

          {/* Travelers & Booking Class */}
          <div className="px-4 py-3">
            <span className="text-xs text-gray-500 block mb-1">
              Travelers & Booking Class
            </span>
            <div className="font-semibold text-gray-900">1 Traveler</div>
            <div className="text-xs text-gray-500">Economy</div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          className="bg-[#1BA0E2] hover:bg-[#1590D2] text-white px-12 py-3 rounded font-semibold transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
