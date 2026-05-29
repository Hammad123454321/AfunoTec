"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Generic types
interface FilterOption {
  label: string;
  value: string;
}

interface GenericUrlFilterProps {
  options: FilterOption[];
  paramKey: string;
  placeholder?: string;
  allLabel?: string;
  allValue?: string;
  width?: string;
  resetPage?: boolean;
  onChangeCallback?: (value: string) => void;
  variant?: "ghost" | "button";
}

const filterVariant = {
  ghost:
    "border border-primary-500 text-primary-500 shadow-none outline-none focus-visible:ring-0",
  button:
    "bg-primary-500 text-white shadow-none outline-none focus-visible:ring-0",
};

export function GenericUrlFilter({
  options,
  paramKey,
  placeholder = "Select an option",
  allLabel = "All",
  allValue = "all",
  width = "w-[180px]",
  resetPage = true,
  onChangeCallback,
  variant = "ghost",
}: GenericUrlFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = React.useTransition();

  const currentValue = searchParams.get(paramKey) || allValue;

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (val === allValue) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, val);
    }

    // Reset to page 1 when filtering (optional)
    if (resetPage) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });

    // Optional callback
    if (onChangeCallback) {
      onChangeCallback(val);
    }
  };

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "cursor-pointer",
          width,
          "border",
          filterVariant[variant]
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allValue}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================
// EXAMPLE USAGE - Your original component
// ============================================

const CALL_STATUSES: FilterOption[] = [
  { label: "Initiated", value: "initiated" },
  { label: "Ringing", value: "ringing" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Busy", value: "busy" },
  { label: "No Answer", value: "no-answer" },
  { label: "Canceled", value: "canceled" },
];

type FilterProps = {
  placeholder: string;
  paramKey: string;
  allLabel: string;
  options: FilterOption[];
  variant?: "ghost" | "button";
};

export function TableFilter({
  placeholder,
  options,
  allLabel,
  variant = "ghost",
  paramKey,
}: FilterProps) {
  return (
    <GenericUrlFilter
      options={options}
      paramKey={paramKey}
      placeholder={placeholder}
      allLabel={allLabel}
      variant={variant}
      allValue="all"
    />
  );
}

// ============================================
// MORE EXAMPLES
// ============================================

// Example 1: Priority Filter
const PRIORITY_OPTIONS: FilterOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

export function PriorityFilter() {
  return (
    <GenericUrlFilter
      options={PRIORITY_OPTIONS}
      paramKey="priority"
      placeholder="Filter by priority"
      allLabel="All priorities"
      width="w-[200px]"
    />
  );
}

// Example 2: Category Filter with callback
const CATEGORY_OPTIONS: FilterOption[] = [
  { label: "Technology", value: "tech" },
  { label: "Business", value: "business" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
];

export function CategoryFilter() {
  const handleCategoryChange = (value: string) => {
    console.log("Category changed to:", value);
    // You can trigger analytics, API calls, etc.
  };

  return (
    <GenericUrlFilter
      options={CATEGORY_OPTIONS}
      paramKey="category"
      placeholder="Select category"
      allLabel="All categories"
      onChangeCallback={handleCategoryChange}
    />
  );
}

// Example 3: Date Range Filter (no page reset)
const DATE_RANGE_OPTIONS: FilterOption[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last year", value: "1y" },
];

export function DateRangeFilter() {
  return (
    <GenericUrlFilter
      options={DATE_RANGE_OPTIONS}
      paramKey="date_range"
      placeholder="Select date range"
      allLabel="All time"
      resetPage={false} // Don't reset page for date filters
    />
  );
}

// Example 4: Auto-generated labels from values
const STATUSES_SIMPLE = [
  "initiated",
  "ringing",
  "in-progress",
  "completed",
  "failed",
];

// Helper function to convert array to FilterOption[]
const createOptions = (values: string[]): FilterOption[] => {
  return values.map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1).replace("-", " "),
    value,
  }));
};

export function SimpleStatusFilter() {
  return (
    <GenericUrlFilter
      options={createOptions(STATUSES_SIMPLE)}
      paramKey="status"
      placeholder="Filter by status"
    />
  );
}
