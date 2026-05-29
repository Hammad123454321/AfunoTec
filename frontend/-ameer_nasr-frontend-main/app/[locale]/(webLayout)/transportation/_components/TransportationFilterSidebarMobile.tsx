// ==========================================
// MOBILE DEVICE FILTER SIDEBAR COMPONENT - TRANSPORTATION
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

interface LocationOption {
  value: string;
  label: string;
  children: Array<{
    value: string;
    label: string;
  }>;
}

interface LocationFilter {
  id: string;
  label: string;
  options: LocationOption[];
}

export default function TransportationFilterSidebarMobile() {
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

  // Transportation Filter
  const filters: Filter[] = [
    {
      id: "transportation",
      label: "Transportation",
      options: [
        { value: "airport-transfer", label: "Airport Transfer", count: 78 },
        { value: "boat-ferry", label: "Boat & Ferry", count: 43 },
        { value: "car-rental", label: "Car Rental", count: 19 },
        { value: "shuttles", label: "Shuttles", count: 39 },
        { value: "luxury", label: "Luxury", count: 78 },
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

  // Travel Type Filter
  const travelTypeFilter: Filter = {
    id: "travel-type",
    label: "Travel Type",
    options: [
      { value: "small-group", label: "Small Group", count: 78 },
      { value: "large-group", label: "Large Group", count: 43 },
      { value: "private", label: "Private", count: 19 },
      { value: "guided", label: "Guided", count: 39 },
      { value: "vip", label: "VIP", count: 39 },
    ],
  };

  // Transportation Type Filter
  const transportationfilter: Filter = {
    id: "transportation-type",
    label: "Transportation",
    options: [
      { value: "car", label: "Car", count: 78 },
      { value: "bus", label: "Bus", count: 43 },
      { value: "boat", label: "Boat & catamaran", count: 19 },
      { value: "coach", label: "Coach", count: 39 },
      { value: "luxury", label: "Luxury", count: 39 },
    ],
  };

  // Location Filter
  const locationFilter: LocationFilter = {
    id: "location",
    label: "Location of departure",
    options: [
      {
        value: "center",
        label: "Center",
        children: [
          { value: "antananarivo", label: "Antananarivo" },
          { value: "antsirabe", label: "Antsirabe" },
          { value: "other-center", label: "Other" },
        ],
      },
      {
        value: "north",
        label: "North",
        children: [
          { value: "diego", label: "Diego" },
          { value: "ambilobe", label: "Ambilobe" },
          { value: "other-north", label: "Other" },
        ],
      },
      {
        value: "south",
        label: "South",
        children: [
          { value: "toliara", label: "Toliara" },
          { value: "isalo", label: "Isalo" },
          { value: "other-south", label: "Other" },
        ],
      },
      {
        value: "east",
        label: "East",
        children: [
          { value: "toamasina", label: "Toamasina" },
          { value: "isalo-east", label: "Isalo" },
          { value: "other-east", label: "Other" },
        ],
      },
      {
        value: "west",
        label: "West",
        children: [
          { value: "mahajanage", label: "Mahajanage" },
          { value: "morondave", label: "Morondava" },
          { value: "other-west", label: "Other" },
        ],
      },
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
              {/* Transportation Category Filter */}
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

              {/* Transportation Type Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("transportation-type")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {transportationfilter.label}
                  </span>
                  {expandedSections["transportation-type"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["transportation-type"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {transportationfilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["transportation-type"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("transportation-type", option.value)
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

              {/* Travel Type Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("travel-type")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {travelTypeFilter.label}
                  </span>
                  {expandedSections["travel-type"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["travel-type"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {travelTypeFilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["travel-type"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("travel-type", option.value)
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

              {/* Location Filter with Nested Options */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("location")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {locationFilter.label}
                  </span>
                  {expandedSections["location"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["location"] && (
                  <div className="px-4 pb-4 space-y-1">
                    {locationFilter.options.map((location) => (
                      <div key={location.value}>
                        <div className="flex items-center justify-between py-1">
                          <button
                            onClick={() => toggleLocation(location.value)}
                            className="flex justify-between items-center flex-1 text-left hover:text-blue-500"
                          >
                            <span className="text-sm text-gray-700 font-medium">
                              {location.label}
                            </span>
                            {expandedLocations[location.value] ? (
                              <ChevronUp
                                size={16}
                                className="text-gray-500 mr-1"
                              />
                            ) : (
                              <ChevronDown
                                size={16}
                                className="text-gray-500 mr-1"
                              />
                            )}
                          </button>
                        </div>
                        {expandedLocations[location.value] && (
                          <div className="ml-6 space-y-2 mt-2">
                            {location.children.map((child) => (
                              <label
                                key={child.value}
                                className="flex items-center cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedFilters["location"]?.includes(
                                      child.value,
                                    ) || false
                                  }
                                  onChange={() =>
                                    handleCheckbox("location", child.value)
                                  }
                                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-gray-600 group-hover:text-blue-500 flex-1 text-left">
                                  {child.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
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