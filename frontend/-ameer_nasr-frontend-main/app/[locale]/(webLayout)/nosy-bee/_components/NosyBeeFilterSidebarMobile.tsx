// ==========================================
// MOBILE DEVICE FILTER SIDEBAR COMPONENT - NOSY BE
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

interface ActivityOption {
  value: string;
  label: string;
  count: number;
  children: Array<{ value: string; label: string }>;
}

interface ActivityFilter {
  id: string;
  label: string;
  options: ActivityOption[];
}

interface LocationOption {
  value: string;
  label: string;
  children: Array<{ value: string; label: string }>;
}

interface LocationFilter {
  id: string;
  label: string;
  options: LocationOption[];
}

export default function NosyBeeFilterSidebarMobile() {
  // State to control mobile menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "package-category": true,
    "stay-type": true,
    "things-to-do-tours": true,
    transportation: true,
    activity: true,
    "special-offers": true,
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

  // Package Category Filter
  const filters: Filter[] = [
    {
      id: "package-category",
      label: "Package Category",
      options: [
        { value: "stay", label: "Stay", count: 87 },
        { value: "thingstodo", label: "Things to do tours", count: 46 },
        {
          value: "travel-packages",
          label: "Travel Packages",
          count: 34,
        },
        { value: "transportation", label: "Transportation", count: 14 },
      ],
    },
  ];

  // Stay Type Filter
  const stayTypeFeaturesFilter: Filter = {
    id: "stay-type",
    label: "Stay Type",
    options: [
      { value: "hotels", label: "Hotels", count: 78 },
      { value: "apartment", label: "Apartments", count: 43 },
      { value: "villas", label: "Villas", count: 19 },
      { value: "lodges", label: "Lodges", count: 39 },
    ],
  };

  // Things to Do Tours Filter
  const thingsToDoTours: Filter = {
    id: "things-to-do-tours",
    label: "Things to Do Tours",
    options: [
      { value: "land-and-adventures", label: "Land & Adventures", count: 78 },
      {
        value: "sea-and-coastal",
        label: "Sea & Coastal adventures",
        count: 43,
      },
      {
        value: "day-packages",
        label: "Day Packages and recreational",
        count: 19,
      },
      { value: "eco-tourism", label: "Eco-tourism", count: 39 },
      { value: "wellness", label: "Wellness & leisure", count: 78 },
      { value: "adventure", label: "Adventure & discovery", count: 43 },
      { value: "sea-coastal", label: "Sea & Coastal", count: 19 },
    ],
  };

  // Transportation Filter
  const transportationFilter: Filter = {
    id: "transportation",
    label: "Transportation",
    options: [
      { value: "airport-transfer", label: "Airport Transfer", count: 78 },
      { value: "boat-ferry", label: "Boat & Ferry", count: 43 },
      { value: "car-rental", label: "Car Rental", count: 19 },
      { value: "shuttles", label: "Shuttles", count: 39 },
      { value: "luxury", label: "Luxury", count: 78 },
    ],
  };

  // Activity Type Filter
  const activityTypeFilter: ActivityFilter = {
    id: "activity-type",
    label: "Activity Type",
    options: [
      { value: "water-sea", label: "Water & Sea", count: 78, children: [] },
      {
        value: "land-excursion",
        label: "Land Excursion",
        count: 43,
        children: [],
      },
      {
        value: "nosy-be-tours",
        label: "Nosy Be Tours",
        count: 19,
        children: [],
      },
      {
        value: "underwater-and-snorkeling",
        label: "Underwater & Snorkeling",
        count: 39,
        children: [],
      },
      {
        value: "recreational-area",
        label: "Recreational Area",
        count: 39,
        children: [],
      },
      {
        value: "hotel-day-packages",
        label: "Hotel Day Packages",
        count: 62,
        children: [],
      },
    ],
  };

  // Special Offers Filter
  const specialOffersFilter: Filter = {
    id: "special-offers",
    label: "Special Offers",
    options: [
      { value: "super-dicount", label: "Super Discount", count: 78 },
      { value: "honeymoon", label: "Honeymoon Offers", count: 43 },
    ],
  };

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

  // Location Filter
  const locationFilter: LocationFilter = {
    id: "location",
    label: "Location",
    options: [
      { value: "nosy-be", label: "Nosy Be", children: [] },
      { value: "antananarivo", label: "Antananarivo", children: [] },
      { value: "toliara", label: "Toliara", children: [] },
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
              {/* Package Category Filter */}
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
              ))}

              {/* Stay Type Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("stay-type")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {stayTypeFeaturesFilter.label}
                  </span>
                  {expandedSections["stay-type"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["stay-type"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {stayTypeFeaturesFilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["stay-type"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("stay-type", option.value)
                          }
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
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

              {/* Things to Do Tours Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("things-to-do-tours")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {thingsToDoTours.label}
                  </span>
                  {expandedSections["things-to-do-tours"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["things-to-do-tours"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {thingsToDoTours.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["things-to-do-tours"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("things-to-do-tours", option.value)
                          }
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
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

              {/* Transportation Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("transportation")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {transportationFilter.label}
                  </span>
                  {expandedSections["transportation"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["transportation"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {transportationFilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["transportation"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("transportation", option.value)
                          }
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
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

              {/* Activity Type Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("activity")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {activityTypeFilter.label}
                  </span>
                  {expandedSections["activity"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["activity"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {activityTypeFilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["activity"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("activity", option.value)
                          }
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
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

              {/* Special Offers Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("special-offers")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {specialOffersFilter.label}
                  </span>
                  {expandedSections["special-offers"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["special-offers"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {specialOffersFilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["special-offers"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("special-offers", option.value)
                          }
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
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