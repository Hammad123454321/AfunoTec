"use client";

import { useState } from "react";

type SortOption = "lowest-price" | "best-sellers";

type Props = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSortChange?: (sortBy: SortOption) => void;
  defaultSort?: SortOption;
};

export default function SortWidget({
  placeholder = "Search...",
  onSearch,
  onSortChange,
  defaultSort = "lowest-price",
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState<SortOption>(defaultSort);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSortClick = (sortBy: SortOption) => {
    setActiveSort(sortBy);
    onSortChange?.(sortBy);
  };

  const sortButtons = [
    { id: "lowest-price" as SortOption, label: "Lowest Price" },
    { id: "best-sellers" as SortOption, label: "Best Sellers" },
  ];

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-0 md:items-stretch">
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full border border-gray-300 px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      />

      {/* Sort Buttons Container */}
      <div className="flex items-center border border-gray-300 md:border-l-0 w-full md:w-auto md:min-w-[400px]">
        <span className="text-gray-400 text-sm md:text-base px-3 md:px-4 whitespace-nowrap">
          Sort By
        </span>

        <div className="flex flex-1 divide-x divide-gray-300">
          {sortButtons.map((button, index) => (
            <button
              key={button.id}
              onClick={() => handleSortClick(button.id)}
              aria-pressed={activeSort === button.id}
              className={`
                flex-1 px-3 py-2 text-sm lg:text-base font-semibold 
                transition-colors duration-200
                hover:bg-gray-50 active:bg-gray-100
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
                ${
                  activeSort === button.id
                    ? "text-black bg-gray-50"
                    : "text-gray-600"
                }
              `}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
