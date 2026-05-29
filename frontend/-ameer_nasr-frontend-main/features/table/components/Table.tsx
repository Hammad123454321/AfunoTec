"use client";

import { cn } from "@/lib/utils";
import { LucideChevronDown, LucideLoader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";

type SortDirection = "asc" | "desc" | null;

type TableHeaderItemProps = {
  prop: string;
  currentSort: string | null;
  sortDirection: SortDirection;
};

export function Table({ children }: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-scroll overflow-y-visible min-h-72 rounded overflow-hidden">
      <table className="border-collapse text-sm sm:text-base shadow-xs border border-primary-50 min-w-xl w-full">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: React.ComponentProps<"thead">) {
  return (
    <thead className="bg-primary-500 text-white sticky top-0 z-10">
      {children}
    </thead>
  );
}

export function TableBody({ children }: React.ComponentProps<"tbody">) {
  return <tbody className="bg-white">{children}</tbody>;
}

export function TableHeaderItem({
  prop,
  currentSort,
  sortDirection,
}: TableHeaderItemProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = currentSort === prop;

  let nextSort: "asc" | "desc" | null = "asc";
  if (isActive) {
    if (sortDirection === "asc") nextSort = "desc";
    else if (sortDirection === "desc") nextSort = null;
  }

  const handleSort = (e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (nextSort) params.set("sort", `${prop}:${nextSort}`);
    else params.delete("sort");
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <th
      className={cn(
        "py-2 text-left align-middle border-b border-primary-100 [&:first-child]:pl-4 [&:last-child]:pr-4 [&:not(:first-child):not(:last-child)]:text-center [&:not(:first-child):not(:last-child)]:px-2"
      )}
    >
      <button
        onClick={handleSort}
        className={cn(
          "w-full flex items-center justify-between gap-1.5 px-2 py-1 truncate font-medium text-gray-50 hover:text-white transition",
          { "text-white": isActive }
        )}
      >
        <span className="truncate">{formatHeaderLabel(prop)}</span>
        <span
          className={cn(
            "flex items-center justify-center transition-all size-4",
            { "rotate-180": sortDirection === "desc" }
          )}
        >
          {isPending ? (
            <LucideLoader className="animate-spin text-white" size={14} />
          ) : (
            <LucideChevronDown
              size={14}
              className={cn(
                "text-white opacity-60 group-hover:opacity-100 transition",
                { "opacity-100": isActive }
              )}
            />
          )}
        </span>
      </button>
    </th>
  );
}

export function TableRow({ children, className }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-primary-100 text-gray-900 text-sm",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableBodyItem({
  children,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      className="py-2 align-top break-words whitespace-normal max-w-[10rem] sm:max-w-none 
      [&:first-child]:text-left [&:first-child]:pl-4 
      [&:last-child]:text-right [&:last-child]:pr-4 
      [&:not(:first-child):not(:last-child)]:text-center [&:not(:first-child):not(:last-child)]:px-2"
      {...props}
    >
      {children}
    </td>
  );
}

function formatHeaderLabel(key: string): string {
  return key
    .replace(/[-_]/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
