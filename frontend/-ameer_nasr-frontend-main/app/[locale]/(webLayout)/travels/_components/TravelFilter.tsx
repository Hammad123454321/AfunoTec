"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tr } from "date-fns/locale";

export default function TravelFilter() {
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
  // Transportation Filter

  const filters = [
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

  // your-budget Filter
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

  

  return (
    <div className="w-72 mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#22A628] text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter By</h2>
        <Button
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

        {/* your-budget Filter */}
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
      </div>
    </div>
  );
}
