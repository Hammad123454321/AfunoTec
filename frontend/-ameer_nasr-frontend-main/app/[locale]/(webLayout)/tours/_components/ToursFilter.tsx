"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ToursFilterSidebar() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "tour-category": true,
    "food-beverage": true,
   " duration": true,
    "your-budget": true,
   "experience": true,
    "location": true,
  });

  const [inputValue, setInputValue] = useState<string>("");

  const handleApply = () => {
    console.log("Applied value:", inputValue);
    // Add your apply logic here
  };

  const [expandedLocations, setExpandedLocations] = useState<
    Record<string, boolean>
  >({});
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLocation = (value: string) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const handleCheckbox = (filterId: string, value: string) => {
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

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const filters = [
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

  // Meal & Food Beverage Filter
  const mealFoodFeaturesFilter = {
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

  // duration

  const durationFilter = {
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

  const yourBudget = {
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

  const experienceFilter = {
    id: "experience",
    label: "experience",
    options: [
      { value: "nature", label: "Nature spot", count: 78, },
      { value: "adventure", label: "Adventure", count: 43,  },
     { value: "cultural", label: "Cultural", count: 19,  },
     { value: "ecological", label: "Ecological", count: 39,  },
     { value: "romantic", label: "Romantic", count: 39,  },
      { value: "family", label: "Family", count: 62,  },
     { value: "kids", label: "Kids friendly", count: 62, },
    ],
  };

  const locationFilter = {
    id: "location",
    label: "Location",
    options: [
      {
        value: "center",
        label: "Center",
        children: [
          { value: "antananarivo", label: "Antananarivo" },
          { value: "antsirabe", label: "Antsirabe" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "north",
        label: "North",
        children: [
          { value: "diego", label: "Diego" },
          { value: "ambilobe", label: "Ambilobe" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "south",
        label: "South",
        children: [
          { value: "toliara", label: "Toliara" },
          { value: "isalo", label: "Isalo" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "east",
        label: "East",
        children: [
          { value: "toamasina", label: "Toamasina" },
          { value: "isalo", label: "Isalo" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "west",
        label: "West",
        children: [
          { value: "mahajanage", label: "Mahajanage" },
          { value: "morondave", label: "Morondava" },
          { value: "other", label: "Other" },
        ],
      },
    ],
  };

  return (
    <div className="w-72 mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#22A628] text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter By</h2>
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="bg-[#22A628] hover:bg-[#22A628] hover:border-white hover:text-white"
        >
          Clear
        </Button>
      </div>

      <div>
        {/* Regular Filters */}
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
                        selectedFilters[filter.id]?.includes(option.value) ||
                        false
                      }
                      onChange={() => handleCheckbox(filter.id, option.value)}
                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({option.count})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* meal food beverage Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("meal-food-beverage")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">
              {mealFoodFeaturesFilter.label}
            </span>
            {expandedSections["meal-food-beverage"] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections["meal-food-beverage"] && (
            <div className="px-4 pb-4 space-y-2">
              {mealFoodFeaturesFilter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters["meal-food-beverage"]?.includes(
                        option.value,
                      ) || false
                    }
                    onChange={() =>
                      handleCheckbox("meal-food-beverage", option.value)
                    }
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* duration Filter */}
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
                      selectedFilters["duration"]?.includes(option.value) ||
                      false
                    }
                    onChange={() => handleCheckbox("duration", option.value)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
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
                      selectedFilters["star-rating"]?.includes(option.value) ||
                      false
                    }
                    onChange={() => handleCheckbox("star-rating", option.value)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-left  flex-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

          {/* Your Experience Filter  */}
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
            <div className="px-4 pb-4 space-y-2">
              {experienceFilter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters["star-rating"]?.includes(option.value) ||
                      false
                    }
                    onChange={() => handleCheckbox("star-rating", option.value)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-left  flex-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
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
                        <ChevronUp size={16} className="text-gray-500 mr-1" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500 mr-1" />
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
  );
}
