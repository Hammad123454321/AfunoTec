"use client";

import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

interface CategoryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  className?: string;
}

export const CategoryDropdown = memo(function CategoryDropdown({
  value,
  onChange,
  placeholder = "Select an option",
  options = [],
  disabled = false,
  className,
}: CategoryDropdownProps) {
  const safeValue = value || "";

  return (
    <Select
      key={safeValue} // Force remount on value change
      value={safeValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-52", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
