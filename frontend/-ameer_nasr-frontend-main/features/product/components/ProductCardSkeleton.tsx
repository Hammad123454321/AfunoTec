"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="relative h-full overflow-hidden flex flex-col gap-2 shadow border border-gray-100 rounded-xl p-2 animate-in fade-in duration-300">
      {/* Discount Badge */}
      <div className="absolute top-3 left-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Image */}
      <div className="overflow-hidden relative w-full h-54 lg:h-64 rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="p-4 pt-4 flex flex-col gap-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between gap-2 flex-wrap mt-3">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}
