// ==========================================
// MOBILE DEVICE FILTER SIDEBAR COMPONENT - TRAVEL
// ==========================================
// This component is specifically designed for mobile devices
// Features:
// - Hamburger menu icon in header
// - Full-screen overlay when opened
// - Slide-in animation from right
// - All filter options hidden by default
// - Opens on hamburger icon click
// - Scrollable filter content
// ==========================================

"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Type definitions for better TypeScript support
interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface Filter {
  id: string;
  label: string;
  options: FilterOption[];
}

export default function TravelFilterMobile() {
  // State to control mobile menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "places-and-continents": true,
    "your-budget": true,
  });

  const [expandedLocations, setExpandedLocations] = useState<
    Record<string, boolean>
  >({});
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const toggleSection = (id: string): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLocation = (value: string): void => {
    setExpandedLocations((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const handleCheckbox = (filterId: string, value: string): void => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [filterId]: current.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [filterId]: [...current, value],
        };
      }
    });
  };

  const handleClearFilters = (): void => {
    setSelectedFilters({});
  };

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Places and Continents Filter
  const filters: Filter[] = [
    {
      id: "places-and-continents",
      label: "Places and Continents",
      options: [
        { value: "mauritius-rodrigues", label: "Mauritius & Rodrigues", count: 78 },
        { value: "comoros", label: "Comoros", count: 43 },
        { value: "mayotte", label: "Mayotte", count: 19 },
        { value: "seychelles", label: "Seychelles", count: 39 },
        { value: "africa", label: "Africa", count: 78 },
        { value: "asia", label: "Asia", count: 0 },
        { value: "europe", label: "Europe", count: 0 },
        { value: "middle-east", label: "Middle East", count: 0 },
        { value: "america", label: "America", count: 0 },
      ],
    },
  ];

  // Your Budget Filter
  const yourBudget: Filter = {
    id: "your-budget",
    label: "Your Budget",
    options: [
      { value: "0-250000", label: "Ar 0 - 250,000 ", count: 8 },
      { value: "100001-250000", label: "Ar 100,001 - 250,000 ", count: 12 },
      { value: "250000-500000", label: "Ar 250,000 - 500,000 ", count: 16 },
      { value: "500001-1000000", label: "Ar 500,001 - 1,000,000 ", count: 22 },
      { value: "1000001", label: "Ar 1,000,001  + ", count: 14 },
    ],
  };

  return (
    <>
      {/* MOBILE HEADER - Only visible on mobile devices (hidden on desktop) */}
      <div className="w-full lg:hidden bg-[#22A628] text-white p-4 flex items-center justify-between rounded-lg">
        <h2 className="text-lg font-semibold">Filter By</h2>
        {/* Hamburger Icon - Right side */}
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-[#1d8f22] rounded-md transition-colors"
          aria-label="Toggle filter menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY - Full screen when menu is open (only on mobile) */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggleMenu}
        >
          {/* MOBILE FILTER PANEL - Slides in from right */}
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Filter Header - Fixed at top */}
            <div className="bg-[#22A628] text-white p-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold">Filter By</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="bg-[#22A628] hover:bg-[#1d8f22] hover:border-white hover:text-white text-sm px-3 py-1"
                >
                  Clear
                </Button>
                {/* Close Icon */}
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-[#1d8f22] rounded-md transition-colors"
                  aria-label="Close filter menu"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Filter Content - Scrollable area */}
            <div className="flex-1 overflow-y-auto">
              {/* Places and Continents Filter */}
              {filters.map((filter) => (
                <div key={filter.id} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection(filter.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-800 text-sm">
                      {filter.label}
                    </span>
                    {expandedSections[filter.id] ? (
                      <ChevronUp size={18} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-600" />
                    )}
                  </button>
                  {expandedSections[filter.id] && (
                    <div className="px-4 pb-4 space-y-2">
                      {filter.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={
                              selectedFilters[filter.id]?.includes(
                                option.value,
                              ) || false
                            }
                            onChange={() =>
                              handleCheckbox(filter.id, option.value)
                            }
                            className="w-4 h-4 accent-blue-500 cursor-pointer"
                          />
                          <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-400">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Your Budget Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("your-budget")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {yourBudget.label}
                  </span>
                  {expandedSections["your-budget"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["your-budget"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {yourBudget.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["your-budget"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("your-budget", option.value)
                          }
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-left flex-1">
                          {option.label}
                        </span>
                        {option.count && (
                          <span className="text-xs text-gray-400">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}