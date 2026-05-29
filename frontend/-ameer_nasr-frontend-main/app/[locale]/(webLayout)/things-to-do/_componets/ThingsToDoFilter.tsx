"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThingsToDoFilterSidebar() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "activity-type": true,
    "location": true,
    "activity-category": true,
    "your-budget": true,
    "day-package-features": true,
    "most-popular": true,
    "meal-food-beverage": true,
    "duration": true,
    "child-age": true,
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
    setSelectedFilters({})
  }


  const filters = [
    {
      id: "activity-type",
      label: "Activity Type",
      options: [
        { value: "sea", label: "Sea & Coastal Adventures", count: 87 },
        { value: "land", label: "Land Adventures Activities", count: 46 },
        {
          value: "day-packages",
          label: "Day packages and recreational activities",
          count: 34,
        },
        { value: "eco", label: "Eco-Tourism", count: 14 },
        { value: "wellness", label: "Wellness & Leisure", count: 18 },
      ],
    },
  ];

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

  const activityCategory = {
    id: "activity-category",
    label: "Activity Category",
    options: [
      { value: "adventure", label: "Adventure", count: 87 },
      { value: "family", label: "Family", count: 46 },
      { value: "group", label: "Group", count: 34 },
      { value: "romantic", label: "Romantic", count: 14 },
      { value: "team-building", label: "Team Building", count: 18 },
      { value: "Honeymoon", label: "Honeymoon", count: 18 },
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

  const dayPackageFeatures = {
    id: "day-package-features",
    label: "Day Package Features",
    options: [
      { value: "beachfront", label: "Beachfront", count: 87 },
      { value: "nature", label: "Nature", count: 46 },
      { value: "city", label: "City centre", count: 34 },
      { value: "entertainment", label: "Entertainment", count: 14 },
      { value: "maximum", label: "Maximum privacy", count: 18 },
      { value: "perfect", label: "Perfect with kids", count: 18 },
      { value: "heated", label: "Heated swimming Pool", count: 18 },
      { value: "sauna", label: "Sauna", count: 18 },
      { value: "hammam", label: "Hammam", count: 18 },
    ],
  };

  const mostPopularFeaturesFilter = {
    id: "most-popular",
    label: "Most Popular",
    options: [
      { value: "special-offer", label: "Special Offer", count: 78 },
      { value: "recreational-areas", label: "Recreational Areas", count: 43 },
      { value: "day-package", label: "Day Package", count: 19 },
      { value: "sea-and-coastal", label: "Sea and Coastal", count: 39 },
      { value: "catamaran", label: "Catamaran Cruises", count: 39 },
      { value: "dolphins", label: "Dolphins & Whales", count: 62 },
      { value: "evening-activities", label: "Evening Activities", count: 139 },
      { value: "family-friendly", label: "Family-friendly", count: 62 },
      { value: "fishing", label: "Fishing", count: 31 },
      { value: "diving", label: "Diving & Snorkeling", count: 12 },
      { value: "hike", label: "Hike & Nature Trips", count: 10 },
      { value: "kayak", label: "Kayak", count: 20 },
      { value: "island", label: "Island Trips", count: 24 },
      { value: "kids", label: "Kids Parks", count: 13 },
      { value: "Nessee", label: "Nessee & Submarine", count: 56 },
      { value: "parasailing", label: "Parasailing", count: 81 },
      { value: "park", label: "Park", count: 78 },
      { value: "quad", label: "Quad Biking", count: 4 },
      { value: "speedboats", label: "Speedboats", count: 72 },
      { value: "underwater", label: "Underwater Sea Walk", count: 39 },
      { value: "water", label: "Water Sports", count: 53 },
      { value: "flight", label: "Flight", count: 4 },
      { value: "spa", label: "Spa and Massage", count: 67 },
      { value: "golf", label: "Golf", count: 67 },
    ],
  };

  /// Meal & Food Beverage Filter
  const mealFoodFeaturesFilter = {
    id: "meal-food-beverage",
    label: "Meal & Food Beverage",
    options: [
      { value: "all-inclusive", label: "All-Inclusive", count: 78 },
      { value: "full", label: "Full Board", count: 43 },
      { value: "breackfast", label: "Breakfast & Dinner", count: 19 },
      { value: "bedandbreackfast", label: "Bed & Breakfast", count: 39 },
      { value: "snacks", label: "Snacks & drinks", count: 39 },
      { value: "lunch", label: "Lunch only", count: 62 },
    ],
  };

  // duration

  const durationFilter = {
    id: "duration",
    label: "Duration",
    options: [
      { value: "0-2", label: "0-2 hours", count: 78 },
      { value: "2-4", label: "2-4 hours", count: 43 },
      { value: "4-6", label: "4-6 hours", count: 19 },
      { value: "6-8", label: "6-8 hours", count: 39 },
      { value: "8+", label: "8+ hours", count: 39 },
    ],
  };

  // child age filter

  const childAgeFilter = {
    id: "child-age",
    label: "Child Age",
    options: [
      { value: "private", label: "Private" },
      { value: "shared", label: "Shared" },
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

        {/* Activity Category Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("activity-category")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">
              {activityCategory.label}
            </span>
            {expandedSections["activity-category"] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections["activity-category"] && (
            <div className="px-4 pb-4 space-y-2">
              {activityCategory.options.map((option) => (
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

        {/* Your day package Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("day-package-features")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">
              {dayPackageFeatures.label}
            </span>
            {expandedSections["day-package-features"] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections["day-package-features"] && (
            <div className="px-4 pb-4 space-y-2">
              {dayPackageFeatures.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters["day-package-features"]?.includes(
                        option.value,
                      ) || false
                    }
                    onChange={() =>
                      handleCheckbox("day-package-features", option.value)
                    }
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

        {/* Key Features Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("key-features")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">
              {mostPopularFeaturesFilter.label}
            </span>
            {expandedSections["key-features"] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections["key-features"] && (
            <div className="px-4 pb-4 space-y-2">
              {mostPopularFeaturesFilter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters["key-features"]?.includes(option.value) ||
                      false
                    }
                    onChange={() =>
                      handleCheckbox("key-features", option.value)
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

        {/* duration Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("child-age")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">
              {childAgeFilter.label}
            </span>
            {expandedSections["child-age"] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>

          {expandedSections["child-age"] && (
            <div className="px-4 pb-4 space-y-2">
              <div className="flex items-center gap-2 p-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />

                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Help"
                >
                  <HelpCircle size={20} />
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
              {childAgeFilter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters["child-age"]?.includes(option.value) ||
                      false
                    }
                    onChange={() => handleCheckbox("child-age", option.value)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
