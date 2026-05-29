"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Placeholder from "./Placeholder";

export interface DropdownSelectOption {
  label: string;
  value: string | number;
}

interface DropdownSelectProps {
  options: DropdownSelectOption[];
  value: DropdownSelectOption | null;
  onChange: (option: DropdownSelectOption) => void;
  placeholder: string | React.ReactNode;
  className?: string;
}

export default function DropdownSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: DropdownSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className={cn("justify-between w-full", className)}
          size="lg"
        >
          <Placeholder className="flex items-center gap-2">
            {value ? value.label : placeholder}
          </Placeholder>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 border-transparent"
        align="start"
      >
        <div className="flex flex-col">
          {options.map((option) => (
            <Button
              key={option.value}
              onClick={() => onChange(option)}
              variant="ghost"
              size="lg"
              className={cn(
                "w-full text-left! px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-start",
                value?.value === option.value ? "font-semibold" : ""
              )}
            >
              <span>{option.label}</span>
              {value?.value === option.value && <Check className="w-4 h-4" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
