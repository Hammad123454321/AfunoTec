"use client";

import InputField from "@/components/InputField";

export function AvailabilityStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        name="data.checkInDate"
        label="Check-in Date"
        type="date"
        required
      />
      <InputField
        name="data.checkOutDate"
        label="Check-out Date"
        type="date"
        required
      />
    </div>
  );
}
