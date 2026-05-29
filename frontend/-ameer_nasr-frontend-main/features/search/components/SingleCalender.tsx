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
import Placeholder from "./Placeholder";

interface SingleCalendarProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  label?: string;
}

export function SingleCalendar({
  date,
  setDate,
  open,
  setOpen,
  label = "Select date",
}: SingleCalendarProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3"
            size="lg"
          >
            <CalendarIcon className="w-5 h-5 text-rose-500 mr-2" />
            <Placeholder>{date ? format(date, "PPP") : label}</Placeholder>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-4 rounded-lg shadow-lg">
          <ShadCalendar
            mode="single"
            selected={date}
            onSelect={(selected) => {
              setDate(selected);
              setOpen(false); // auto-close popover
            }}
            numberOfMonths={1}
            className="w-full"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
