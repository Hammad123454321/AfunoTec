"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { LucideChevronsLeft, LucideChevronsRight } from "lucide-react";
import PageLimits from "./PageLimits";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export default function Pagination({
  totalPages,
  currentPage,
  pageSize,
}: PaginationProps) {
  const searchParams = new URLSearchParams(useSearchParams());
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateToPage = (page: number) => {
    page = Math.max(1, Math.min(page, totalPages));
    const params = new URLSearchParams(searchParams.toString());
    page === 1 ? params.delete("page") : params.set("page", page.toString());
    params.set("limit", pageSize.toString());
    const url = `?${params.toString()}`;
    startTransition(() => {
      router.push(url, { scroll: false });
    });
  };

  // Always show 5 pages, but don't exceed maxPages
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(startPage + 4, totalPages);

  // Adjust startPage if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    totalPages >= 1 && (
      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-400 text-sm">
          Showing <strong className="font-medium">{currentPage}</strong> of{" "}
          <strong className="font-medium">{totalPages}</strong>
        </span>
        <nav className="flex justify-center gap-2 flex-wrap">
          <Button
            size="sm"
            disabled={currentPage === 1 || isPending}
            onClick={() => navigateToPage(currentPage - 1)}
            variant="ghost"
          >
            <LucideChevronsLeft />
          </Button>

          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => navigateToPage(page)}
              size="sm"
              disabled={isPending}
              variant="ghost"
              className={`transition-colors border border-transparent ${
                page === currentPage && " text-blue-400! border-blue-500!"
              }`}
            >
              {page}
            </Button>
          ))}

          <Button
            size="sm"
            disabled={currentPage >= totalPages || isPending}
            onClick={() => navigateToPage(currentPage + 1)}
            variant="ghost"
          >
            <LucideChevronsRight />
          </Button>
        </nav>
        <PageLimits />
      </div>
    )
  );
}
