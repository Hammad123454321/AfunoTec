"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

/**
 * Fallback flight-style booking form shown at the bottom of the
 * Transportation listing when no road/sea transport matches the
 * filters. Fully interactive on the frontend — all fields are
 * editable, From/To can be swapped, departure / return are date
 * inputs, travelers + class are real controls. The Submit action is
 * a non-network handler that captures the form payload and surfaces
 * it in a toast-style confirmation banner until the airline API
 * integration lands.
 */
type TripType = "one-way" | "round-trip" | "multi-city";
type BookingClass = "Economy" | "Premium Economy" | "Business" | "First";

const TRIP_TYPES: ReadonlyArray<{ value: TripType; label: string }> = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "multi-city", label: "Multi City" },
];

const BOOKING_CLASSES: ReadonlyArray<BookingClass> = [
  "Economy",
  "Premium Economy",
  "Business",
  "First",
];

type Endpoint = {
  city: string;
  airport: string;
};

const DEFAULT_FROM: Endpoint = {
  city: "Madagascar",
  airport: "Ivato International Airport",
};

const DEFAULT_TO: Endpoint = {
  city: "Nosy Be",
  airport: "Fascene Airport",
};

function formatDayName(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

export default function NotFoundFlightSearch() {
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [from, setFrom] = useState<Endpoint>(DEFAULT_FROM);
  const [to, setTo] = useState<Endpoint>(DEFAULT_TO);
  const [departure, setDeparture] = useState<string>("2025-07-31");
  const [returnDate, setReturnDate] = useState<string>("");
  const [travelers, setTravelers] = useState<number>(1);
  const [bookingClass, setBookingClass] = useState<BookingClass>("Economy");
  const [submitted, setSubmitted] = useState<null | {
    summary: string;
  }>(null);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const departureDayName = useMemo(() => formatDayName(departure), [departure]);
  const returnDayName = useMemo(() => formatDayName(returnDate), [returnDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = [
      `${from.city} → ${to.city}`,
      `Departure: ${departure || "—"}`,
      tripType === "round-trip" ? `Return: ${returnDate || "—"}` : null,
      `${travelers} traveler${travelers === 1 ? "" : "s"} (${bookingClass})`,
      `Trip type: ${tripType}`,
    ].filter(Boolean);
    setSubmitted({ summary: parts.join(" • ") });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-12">
      <p className="text-center text-rose-600 text-sm font-medium mb-4">
        Noted : If no transportation found
      </p>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Trip type radios */}
        <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-200 flex-wrap">
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
            <label className="text-xs text-gray-500 block mb-1">From</label>
            <input
              type="text"
              value={from.city}
              onChange={(e) => setFrom({ ...from, city: e.target.value })}
              className="w-full font-semibold text-gray-900 bg-transparent outline-none focus:border-b focus:border-sky-500"
              aria-label="From city"
            />
            <input
              type="text"
              value={from.airport}
              onChange={(e) => setFrom({ ...from, airport: e.target.value })}
              className="w-full text-xs text-gray-500 bg-transparent outline-none focus:border-b focus:border-sky-500"
              aria-label="From airport"
            />
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow z-10"
            >
              <ArrowLeftRight size={12} />
            </button>
          </div>

          {/* To */}
          <div className="px-4 py-3">
            <label className="text-xs text-gray-500 block mb-1">To</label>
            <input
              type="text"
              value={to.city}
              onChange={(e) => setTo({ ...to, city: e.target.value })}
              className="w-full font-semibold text-gray-900 bg-transparent outline-none focus:border-b focus:border-sky-500"
              aria-label="To city"
            />
            <input
              type="text"
              value={to.airport}
              onChange={(e) => setTo({ ...to, airport: e.target.value })}
              className="w-full text-xs text-gray-500 bg-transparent outline-none focus:border-b focus:border-sky-500"
              aria-label="To airport"
            />
          </div>

          {/* Departure */}
          <div className="px-4 py-3">
            <label className="text-xs text-gray-500 block mb-1">
              Departure
            </label>
            <input
              type="date"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
              aria-label="Departure date"
              required
            />
            <div className="text-xs text-gray-500 min-h-[16px]">
              {departureDayName}
            </div>
          </div>

          {/* Return */}
          <div className="px-4 py-3">
            <label className="text-xs text-gray-500 block mb-1">Return</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              disabled={tripType === "one-way"}
              className="w-full font-semibold text-gray-900 bg-transparent outline-none cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
              aria-label="Return date"
              placeholder="Tap to book return ticket"
            />
            <div className="text-xs text-gray-500 min-h-[16px]">
              {tripType === "one-way"
                ? "One way — no return"
                : returnDayName || "for more saving"}
            </div>
          </div>

          {/* Travelers & Booking Class */}
          <div className="px-4 py-3">
            <label className="text-xs text-gray-500 block mb-1">
              Travelers & Booking Class
            </label>
            <input
              type="number"
              min={1}
              max={9}
              value={travelers}
              onChange={(e) =>
                setTravelers(
                  Math.max(1, Math.min(9, Number(e.target.value) || 1)),
                )
              }
              className="w-full font-semibold text-gray-900 bg-transparent outline-none"
              aria-label="Number of travelers"
            />
            <select
              value={bookingClass}
              onChange={(e) => setBookingClass(e.target.value as BookingClass)}
              className="w-full text-xs text-gray-500 bg-transparent outline-none cursor-pointer"
              aria-label="Booking class"
            >
              {BOOKING_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="bg-[#1BA0E2] hover:bg-[#1590D2] text-white px-12 py-3 rounded font-semibold transition-colors"
        >
          Submit
        </button>
      </div>

      {/* Confirmation banner — non-network feedback that the form ran. */}
      {submitted && (
        <div className="mt-4 max-w-3xl mx-auto bg-emerald-50 border border-emerald-200 text-emerald-800 rounded px-4 py-3 text-sm text-center">
          <strong>Search request captured:</strong> {submitted.summary}
        </div>
      )}
    </form>
  );
}
