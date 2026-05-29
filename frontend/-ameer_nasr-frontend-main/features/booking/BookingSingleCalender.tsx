"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";

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
  defaultSelectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function BookingSingleCalender({
  disabledRanges = [
    { from: new Date(2025, 9, 10), to: new Date(2025, 9, 15) },
    { from: new Date(2025, 9, 25), to: new Date(2025, 9, 27) },
  ],
  prices = [
    { date: new Date(2025, 9, 5), price: 100 },
    { date: new Date(2025, 9, 7), price: 150 },
    { date: new Date(2025, 9, 20), price: 120 },
  ],
  defaultSelectedDate,
  onDateSelect,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultSelectedDate
  );
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Callback to parent
  useEffect(() => {
    if (selectedDate && onDateSelect) {
      onDateSelect(selectedDate);
    }
  }, [selectedDate, onDateSelect]);

  // Map disabled ranges for DayPicker
  const disabledDays = disabledRanges.map((range) => ({
    from: range.from,
    to: range.to,
  }));

  // Get price for a day
  const getPrice = (date: Date) => {
    const found = prices.find(
      (p) =>
        p.date.getFullYear() === date.getFullYear() &&
        p.date.getMonth() === date.getMonth() &&
        p.date.getDate() === date.getDate()
    );
    return found?.price ?? null;
  };

  return (
    <div className="relative">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        className="shadow border border-gray-100 p-4"
      >
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) return;
            const isDisabled = disabledRanges.some(
              (range) => date >= range.from && date <= range.to
            );
            if (!isDisabled) setSelectedDate(date);
          }}
          disabled={disabledDays}
          onDayMouseEnter={(day) => setHoveredPrice(getPrice(day))}
          onDayMouseLeave={() => setHoveredPrice(null)}
        />
      </div>

      {hoveredPrice !== null && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded shadow-lg z-50 flex flex-col gap-1 items-center w-24"
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
