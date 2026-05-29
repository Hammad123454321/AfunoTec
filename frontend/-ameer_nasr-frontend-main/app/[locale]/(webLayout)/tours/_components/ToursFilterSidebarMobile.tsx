
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

interface ExperienceOption {
  value: string;
  label: string;
  count: number;
  children: Array<{ value: string; label: string }>;
}

interface ExperienceFilter {
  id: string;
  label: string;
  options: ExperienceOption[];
}

export default function ToursFilterSidebarMobile() {
  // State to control mobile menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "tour-category": true,
    "food-beverage": true,
    "duration": true,
    "your-budget": true,
   " experience": true,
    "location": true,
  });

  const [inputValue, setInputValue] = useState<string>("");
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
    setInputValue("");
  };

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const filters: Filter[] = [
    {
      id: "tour-category",
      label: "Tour Category",
      options: [
        { value: "adventure", label: "Adventure & Discovery Tours", count: 87 },
        { value: "island", label: "Island & Coastal Tours", count: 46 },
        {
          value: "eco",
          label: "Eco & Wildliffe Expeditions",
          count: 34,
        },
        { value: "cultural", label: "Cultural & Historical Tours", count: 14 },
      ],
    },
  ];

  const mealFoodFeaturesFilter: Filter = {
    id: "food-beverage",
    label: "Food & Beverage",
    options: [
      { value: "all-inclusive", label: "All-Inclusive", count: 78 },
      { value: "full", label: "Full Board", count: 43 },
      { value: "breackfast", label: "Breakfast & Dinner", count: 19 },
      { value: "breackfastonly", label: " Breakfast only", count: 39 },
      { value: "snacks", label: "Snacks a drinks", count: 39 },
      { value: "lunch", label: "Lunch only", count: 62 },
    ],
  };

  const durationFilter: Filter = {
    id: "duration",
    label: "Duration",
    options: [
      { value: "0-3", label: "0-3 hours", count: 78 },
      { value: "3-5", label: "3-5 hours", count: 43 },
      { value: "5-7", label: "5-7 hours", count: 19 },
      { value: "fullday", label: "Full day your", count: 19 },
      { value: "nighttour", label: "Night Tour", count: 39 },
      { value: "2days", label: "2 Days tour", count: 39 },
      { value: "3-6", label: "3-6 days", count: 39 },
      { value: "5+", label: "5+", count: 39 },
    ],
  };

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

  const experienceFilter: ExperienceFilter = {
    id: "experience",
    label: "Experience",
    options: [
      { value: "nature", label: "Nature spot", count: 78, children: [] },
      { value: "adventure", label: "Adventure", count: 43, children: [] },
      { value: "cultural", label: "Cultural", count: 19, children: [] },
      { value: "ecological", label: "Ecological", count: 39, children: [] },
      { value: "romantic", label: "Romantic", count: 39, children: [] },
      { value: "family", label: "Family", count: 62, children: [] },
      { value: "kids", label: "Kids friendly", count: 62, children: [] },
    ],
  };

  const locationFilter: LocationFilter = {
    id: "location",
    label: "Location",
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
              {/* Regular Filters - Tour Category */}
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

              {/* Meal & Food Beverage Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("food-beverage")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {mealFoodFeaturesFilter.label}
                  </span>
                  {expandedSections["food-beverage"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["food-beverage"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {mealFoodFeaturesFilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["food-beverage"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("food-beverage", option.value)
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

              {/* Duration Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("duration")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {durationFilter.label}
                  </span>
                  {expandedSections["duration"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["duration"] && (
                  <div className="px-4 pb-4 space-y-2">
                    {durationFilter.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFilters["duration"]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={() =>
                            handleCheckbox("duration", option.value)
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

              {/* Experience Filter */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("experience")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {experienceFilter.label}
                  </span>
                  {expandedSections["experience"] ? (
                    <ChevronUp size={18} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-600" />
                  )}
                </button>
                {expandedSections["experience"] && (
                  <div className="px-4 pb-4 space-y-1">
                    {experienceFilter.options.map((location) => (
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
                        {expandedLocations[location.value] &&
                          location.children.length > 0 && (
                            <div className="ml-6 space-y-2 mt-2">
                              {location.children.map((child) => (
                                <label
                                  key={child.value}
                                  className="flex items-center cursor-pointer group"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedFilters["experience"]?.includes(
                                        child.value,
                                      ) || false
                                    }
                                    onChange={() =>
                                      handleCheckbox("experience", child.value)
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