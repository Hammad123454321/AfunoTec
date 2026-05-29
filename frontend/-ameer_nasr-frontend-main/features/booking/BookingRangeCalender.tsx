"use client";

import { Button } from "@/components/ui/button";
import { LucideTrash } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";

export interface DisabledRange {
  from: Date;
  to: Date;
}

export interface PriceDate {
  date: Date;
  price: number;
}

interface BookingCalendarProps {
  disabledRanges?: DisabledRange[];
  prices?: PriceDate[];
  selectedRange: DateRange | undefined;
  setSelectedRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onRangeSelect?: (range: { from: Date; to: Date }) => void;
}

function rangesOverlap(
  r1: { from: Date; to: Date },
  r2: { from: Date; to: Date }
): boolean {
  return r1.from <= r2.to && r1.to >= r2.from;
}

export function BookingRangeCalendar({
  disabledRanges = [
    { from: new Date(2025, 9, 10), to: new Date(2025, 9, 15) },
    { from: new Date(2025, 9, 25), to: new Date(2025, 9, 27) },
  ],
  prices = [
    { date: new Date(2025, 9, 5), price: 100 },
    { date: new Date(2025, 9, 7), price: 150 },
    { date: new Date(2025, 9, 20), price: 120 },
  ],
  selectedRange,
  setSelectedRange,
  onRangeSelect,
}: BookingCalendarProps) {
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Map disabled ranges for DayPicker
  const disabledDays: { from: Date; to: Date }[] = disabledRanges.map(
    (range) => ({
      from: range.from,
      to: range.to,
    })
  );

  // Get price for a day
  const getPrice = (date: Date): number | null => {
    const found = prices.find(
      (p) =>
        p.date.getFullYear() === date.getFullYear() &&
        p.date.getMonth() === date.getMonth() &&
        p.date.getDate() === date.getDate()
    );
    return found?.price ?? null;
  };

  // Handle range selection
  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setSelectedRange(undefined);
      return;
    }
    if (range.to) {
      const proposedRange: { from: Date; to: Date } = {
        from: range.from,
        to: range.to,
      };
      const overlaps = disabledRanges.some((dr) =>
        rangesOverlap(proposedRange, dr)
      );
      if (!overlaps) {
        setSelectedRange(range);
        if (onRangeSelect) {
          onRangeSelect(proposedRange);
        }
      } else {
        setSelectedRange({ from: range.from });
      }
    } else {
      setSelectedRange({ from: range.from });
    }
  };

  return (
    <div className="relative shadow">
      <div
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        className="shadow border border-gray-100 p-4"
      >
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={disabledDays}
          onDayMouseEnter={(day: Date) => setHoveredPrice(getPrice(day))}
          onDayMouseLeave={() => setHoveredPrice(null)}
        />
      </div>

      {/* Floating Tooltip */}
      {hoveredPrice !== null && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded shadow-lg z-50 flex flex-col gap-1 items-center"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y - 30}px`,
          }}
        >
          <span>Price</span> ${hoveredPrice}
        </div>
      )}
    </div>
  );
}

export default function ParentComponent() {
  // Initialize selectedRange state (undefined as in your snippet)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    undefined
  );

  // Callback for when a complete range is selected
  const handleRangeSelect = (range: { from: Date; to: Date }) => {
    console.log("Selected range:", range);
    // Handle the selected range, e.g., calculate total price or submit booking
  };

  // Programmatically set a new range
  const setNewRange = () => {
    setSelectedRange({
      from: new Date(2025, 9, 4), // October 4, 2025
      to: new Date(2025, 9, 6), // October 6, 2025
    });
  };

  // Clear the selected range
  const clearRange = () => {
    setSelectedRange(undefined);
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          onClick={setNewRange}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Set Range (Oct 4-6, 2025)
        </button>
        <Button onClick={clearRange} size="icon" variant="destructive">
          <LucideTrash />
        </Button>
      </div>
      <BookingRangeCalendar
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        disabledRanges={[
          { from: new Date(2025, 9, 10), to: new Date(2025, 9, 15) }, // October 10-15, 2025
          { from: new Date(2025, 9, 25), to: new Date(2025, 9, 27) }, // October 25-27, 2025
        ]}
        prices={[
          { date: new Date(2025, 9, 5), price: 100 }, // October 5, 2025
          { date: new Date(2025, 9, 7), price: 150 }, // October 7, 2025
          { date: new Date(2025, 9, 20), price: 120 }, // October 20, 2025
        ]}
        onRangeSelect={handleRangeSelect}
      />
    </>
  );
}
