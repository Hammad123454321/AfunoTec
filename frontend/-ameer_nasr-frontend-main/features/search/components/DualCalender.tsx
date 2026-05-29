"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

export function DualCalender({
  open,
  setOpen,
  date,
  setDate,
  label,
}: {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  label: React.ReactNode | string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="px-4 py-3 self-start lg:self-center"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-rose-500" />
              {label}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-max p-4 rounded-lg shadow-lg">
          <div className="flex gap-4">
            <ShadCalendar
              mode="range"
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="w-full"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
