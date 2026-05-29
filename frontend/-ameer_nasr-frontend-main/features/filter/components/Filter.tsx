'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FilterSidebar() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'accommodation-type': true,
    'special-offers': true,
    'budget': true,
    'meal-plan': true,
    'location': true,
    'star-rating': true,
    'key-features': true,
  });

  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleLocation = (value: string) => {
    setExpandedLocations(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  const handleCheckbox = (filterId: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [filterId]: current.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [filterId]: [...current, value]
        };
      }
    });
  };

  const filters = [
    {
      id: "accommodation-type",
      label: "Accommodation Type",
      options: [
        { value: "hotels", label: "Hotels", count: 87 },
        { value: "apartments", label: "Apartments", count: 46 },
        { value: "villas", label: "Villas", count: 34 },
        { value: "guesthouses", label: "Guesthouses", count: 14 },
        { value: "lodges", label: "Lodges", count: 18 },
        { value: "unique-outdoor", label: "Unique & Outdoor", count: 7 },
      ],
    },
    {
      id: "special-offers",
      label: "Special Offers",
      options: [
        { value: "super-discount", label: "Super Discount", count: 54 },
        { value: "honeymoon", label: "Honeymoon Offers", count: 4 },
        { value: "spa-discount", label: "Spa Discount", count: 10 },
        { value: "meal-upgrade", label: "Meal Upgrade", count: 10 },
      ],
    },
    {
      id: "budget",
      label: "Your Budget",
      options: [
        { value: "0-250000", label: "Ar 0 - 250,000 / night", count: 8 },
        { value: "100001-250000", label: "Ar 100,001 - 250,000 / night", count: 12 },
        { value: "250000-500000", label: "Ar 250,000 - 500,000 / night", count: 16 },
        { value: "500001-1000000", label: "Ar 500,001 - 1,000,000 / night", count: 22 },
        { value: "1000001", label: "Ar 1,000,001 - + / night", count: 14 },
      ],
    },
    {
      id: "meal-plan",
      label: "Meal Plan",
      options: [
        { value: "all-inclusive", label: "All Inclusive", count: 44 },
        { value: "full-board", label: "Full Board", count: 46 },
        { value: "half-board", label: "Half Board", count: 38 },
        { value: "breakfast-dinner", label: "Breakfast & Dinner", count: 91 },
        { value: "bed-breakfast", label: "Bed & Breakfast", count: 57 },
        { value: "room-only", label: "Room Only", count: 4 },
        { value: "self-catering", label: "Self Catering", count: 63 },
      ],
    },
  ];

  const locationFilter = {
    id: "location",
    label: "Location",
    options: [
      {
        value: "north",
        label: "Northern Madagascar",
        count: 85,
        children: [
          { value: "antsiranana", label: "Antsiranana (Diego Suarez)", count: 25 },
          { value: "nosy-be", label: "Nosy Be", count: 30 },
          { value: "antsiranana-rural", label: "Antsiranana Rural", count: 15 },
          { value: "ambilobe", label: "Ambilobe", count: 10 },
          { value: "vohemar", label: "Vohemar", count: 5 },
        ],
      },
      {
        value: "south",
        label: "Southern Madagascar",
        count: 37,
        children: [
          { value: "toliara", label: "Toliara (Tulear)", count: 12 },
          { value: "taolagnaro", label: "Taolagnaro (Fort Dauphin)", count: 10 },
          { value: "ambovombe", label: "Ambovombe", count: 8 },
          { value: "manakara", label: "Manakara", count: 7 },
        ],
      },
      {
        value: "east",
        label: "Eastern Madagascar",
        count: 26,
        children: [
          { value: "toamasina", label: "Toamasina (Tamatave)", count: 15 },
          { value: "sainte-marie", label: "Île Sainte-Marie", count: 6 },
          { value: "mananara", label: "Mananara", count: 3 },
          { value: "maroantsetra", label: "Maroantsetra", count: 2 },
        ],
      },
      {
        value: "west",
        label: "Western Madagascar",
        count: 25,
        children: [
          { value: "mahanoro", label: "Mahanoro", count: 8 },
          { value: "morondava", label: "Morondava", count: 7 },
          { value: "mahajanga", label: "Mahajanga (Majunga)", count: 6 },
          { value: "belo-sur-tsiribihina", label: "Belo-sur-Tsiribihina", count: 4 },
        ],
      },
      {
        value: "central",
        label: "Central Madagascar",
        count: 10,
        children: [
          { value: "antananarivo", label: "Antananarivo", count: 6 },
          { value: "antsirabe", label: "Antsirabe", count: 2 },
          { value: "ambositra", label: "Ambositra", count: 1 },
          { value: "fianarantsoa", label: "Fianarantsoa", count: 1 },
        ],
      },
      {
        value: "northwest",
        label: "Northwest Madagascar",
        count: 18,
        children: [
          { value: "mahajanga-north", label: "Mahajanga North", count: 8 },
          { value: "soalala", label: "Soalala", count: 5 },
          { value: "mitsinjo", label: "Mitsinjo", count: 3 },
          { value: "katsepy", label: "Katsepy", count: 2 },
        ],
      },
    ],
  };

  const starRatingFilter = {
    id: "star-rating",
    label: "Star Rating",
    options: [
      { value: "5-star-deluxe", label: "★★★★★ DELUXE", count: 10 },
      { value: "5-star", label: "★★★★★", count: 27 },
      { value: "4-star", label: "★★★★", count: 42 },
      { value: "3-star", label: "★★★", count: 47 },
      { value: "2-star", label: "★★", count: 2 },
      { value: "unrated", label: "Unrated", count: 55 },
    ],
  };

  const keyFeaturesFilter = {
    id: "key-features",
    label: "Key Features",
    options: [
      { value: "on-beach", label: "On the Beach", count: 78 },
      { value: "across-beach", label: "Across from Beach", count: 43 },
      { value: "adults-only", label: "Adults Only", count: 19 },
      { value: "kids-club", label: "Kids Club", count: 39 },
      { value: "water-sports", label: "Free Water Sports", count: 62 },
      { value: "family-friendly", label: "Family-friendly", count: 139 },
      { value: "luxury", label: "Luxury", count: 62 },
      { value: "private-pool", label: "Private Pool", count: 31 },
      { value: "heated-pool", label: "Heated Pool", count: 12 },
      { value: "late-checkout", label: "Late Checkout", count: 10 },
      { value: "nature-lovers", label: "Nature Lovers", count: 20 },
      { value: "jacuzzi-beach", label: "Jacuzzi at Beach", count: 24 },
      { value: "jacuzzi-room", label: "Jacuzzi in Room", count: 13 },
      { value: "bathtub", label: "Bathtub", count: 56 },
      { value: "halal", label: "Halal", count: 81 },
      { value: "spa-facilities", label: "Spa Facilities", count: 78 },
      { value: "wheelchair-accessible", label: "Wheelchair Accessible", count: 4 },
      { value: "gym", label: "Gym Facilities", count: 72 },
      { value: "boathouse", label: "Boathouse Facilities", count: 39 },
      { value: "boutique", label: "Boutique Hotel", count: 53 },
      { value: "nightlife", label: "Nightlife", count: 4 },
      { value: "kitchenette", label: "Kitchen/Kitchenette", count: 67 },
    ],
  };

  return (
    <div className="w-72 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#22A628] text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter By</h2>
        <Button variant="outline" className='bg-[#22A628] hover:bg-[#22A628] hover:border-white hover:text-white'>Clear</Button>
      </div>

      <div >
        {/* Regular Filters */}
        {filters.map((filter) => (
          <div key={filter.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(filter.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-800 text-sm">{filter.label}</span>
              {expandedSections[filter.id] ? (
                <ChevronUp size={18} className="text-gray-600" />
              ) : (
                <ChevronDown size={18} className="text-gray-600" />
              )}
            </button>
            {expandedSections[filter.id] && (
              <div className="px-4 pb-4 space-y-2">
                {filter.options.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.id]?.includes(option.value) || false}
                      onChange={() => handleCheckbox(filter.id, option.value)}
                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-500 flex-1">
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-400">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Location Filter with Nested Options */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">{locationFilter.label}</span>
            {expandedSections['location'] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections['location'] && (
            <div className="px-4 pb-4 space-y-1">
              {locationFilter.options.map((location) => (
                <div key={location.value}>
                  <div className="flex items-center justify-between py-1">
                    <button
                      onClick={() => toggleLocation(location.value)}
                      className="flex items-center flex-1 text-left hover:text-blue-500"
                    >
                      {expandedLocations[location.value] ? (
                        <ChevronUp size={16} className="text-gray-500 mr-1" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500 mr-1" />
                      )}
                      <span className="text-sm text-gray-700 font-medium">{location.label}</span>
                    </button>
                    <span className="text-xs text-gray-400">({location.count})</span>
                  </div>
                  {expandedLocations[location.value] && (
                    <div className="ml-6 space-y-2 mt-2">
                      {location.children.map((child) => (
                        <label key={child.value} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters['location']?.includes(child.value) || false}
                            onChange={() => handleCheckbox('location', child.value)}
                            className="w-4 h-4 accent-blue-500 cursor-pointer"
                          />
                          <span className="ml-2 text-sm text-gray-600 group-hover:text-blue-500 flex-1">
                            {child.label}
                          </span>
                          <span className="text-xs text-gray-400">({child.count})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Star Rating Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('star-rating')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">{starRatingFilter.label}</span>
            {expandedSections['star-rating'] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections['star-rating'] && (
            <div className="px-4 pb-4 space-y-2">
              {starRatingFilter.options.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFilters['star-rating']?.includes(option.value) || false}
                    onChange={() => handleCheckbox('star-rating', option.value)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-[#F3AF1B] group-hover:text-[#F3AF1B] flex-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-400">({option.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Key Features Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('key-features')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-800 text-sm">{keyFeaturesFilter.label}</span>
            {expandedSections['key-features'] ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>
          {expandedSections['key-features'] && (
            <div className="px-4 pb-4 space-y-2">
              {keyFeaturesFilter.options.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFilters['key-features']?.includes(option.value) || false}
                    onChange={() => handleCheckbox('key-features', option.value)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-500 flex-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-400">({option.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

       
      </div>
    </div>
  );
}