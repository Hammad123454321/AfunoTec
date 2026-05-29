"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CorporateFilterSidebar() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "deal-type": true,
    "duration": true,
    "group-size": true,
   "interest": true,
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

   const handleClearFilters = () => {
    setSelectedFilters({})
  }


  const filters = [
    {
      id: "deal-type",
      label: "Deal Type",
      options: [
        { value: "team-building", label: "Team Building", count: 87 },
        { value: "employee", label: "Employee incentives", count: 46 },
        { value: "executives", label: "Executive offers", count: 34 },
        { value: "anniversaries", label: "Anniversaries", count: 14 },

        { value: "annual-events", label: "Annual Events", count: 87 },
        { value: "product-launch", label: "Product Launch", count: 46 },
        { value: "training", label: "Training", count: 34 },
        {
          value: "clients-entertainment",
          label: "Clients Entertainment",
          count: 14,
        },
        { value: "csr", label: "CSR", count: 34 },
        { value: "go-green", label: "Go Green", count: 14 },
      ],
    },
  ];

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

  // Group Size Filter
  const groupSizeFilter = {
    id: "group-size",
    label: "Group Size",
    options: [
      { value: "small-group", label: "Small Group", count: 78 },
      { value: "large-group", label: "Large Group", count: 43 },
      { value: "private", label: "Private", count: 19 },
      { value: "guided", label: "Guided", count: 39 },
      { value: "vip", label: "VIP", count: 39 },
    ],
  };

  const interestFilter = {
    id: "interest",
    label: "Interest",
    options: [
       { value: "game", label: "Game", count: 78 },
      { value: "fun", label: "Fun", count: 43 },
      { value: "interactive", label: "Interactive", count: 19 },
      { value: "learning", label: "Learning", count: 39 },
      { value: "ecological", label: "Ecological", count: 39 },
      { value: "wellness", label: "Wellness", count: 39 },
      { value: "open-air", label: "Open Air", count: 39 },
      { value: "nature", label: "Nature", count: 39 },
    ],
  };

  const experienceFilter: {
    id: string;
    label: string;
    options: Array<{
      value: string;
      label: string;
      count: number;
      children: Array<{ value: string; label: string }>;
    }>;
  } = {
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

        {/* meal food beverage Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("group-size")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">
              {groupSizeFilter.label}
            </span>
            {expandedSections["group-size"] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections["group-size"] && (
            <div className="px-4 pb-4 space-y-2">
              {groupSizeFilter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters["group-size"]?.includes(
                        option.value,
                      ) || false
                    }
                    onChange={() =>
                      handleCheckbox("group-size", option.value)
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

       
        {/* Your Budget Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("interest")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">
              {interestFilter.label}
            </span>
            {expandedSections["your-budget"] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections["interest"] && (
            <div className="px-4 pb-4 space-y-2">
              {interestFilter.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFilters["interest"]?.includes(option.value) ||
                      false
                    }
                    onChange={() => handleCheckbox("interest", option.value)}
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
