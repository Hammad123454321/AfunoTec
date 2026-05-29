"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import { Minus, Plus } from "lucide-react";
import Placeholder from "./Placeholder";

export default function GuestSelector() {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(1); // start with 1 adult
  const [children, setChildren] = useState(0);

  const handleChange = (type: "adults" | "children", delta: number) => {
    if (type === "adults") {
      setAdults((prev) => Math.max(1, prev + delta)); // minimum 1 adult
    } else {
      setChildren((prev) => Math.max(0, prev + delta)); // minimum 0 children
    }
  };

  // Calculate total guests for placeholder
  const totalGuests = adults + children;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className="relative after:absolute w-full justify-start"
        >
          <FaUser className="w-4 h-4 text-rose-500" />
          <Placeholder>{totalGuests}</Placeholder>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-64 p-4 space-y-4 bg-background shadow-lg rounded-xl border"
      >
        {/* Adults */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Adults</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChange("adults", -1)}
              disabled={adults <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-5 text-center font-medium">{adults}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChange("adults", +1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Children</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChange("children", -1)}
              disabled={children <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-5 text-center font-medium">{children}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChange("children", +1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
