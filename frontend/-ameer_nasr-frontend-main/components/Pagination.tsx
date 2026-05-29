// components/Pagination.tsx
"use client";

import React from "react";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
      <span>
        Showing data {itemsPerPage * (currentPage - 1) + 1} to{" "}
        {Math.min(itemsPerPage * currentPage, totalItems)} of {totalItems} entries
      </span>

      <div className="flex items-center gap-1">
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-2 rounded text-[#404B52] ${
              currentPage === i + 1
                ? "bg-[#707FDD] text-white border border-[#5932EA]"
                : ""
            }`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
