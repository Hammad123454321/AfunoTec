'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EventFilterSidebar() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'event-type': true,
    'location': true,
    'venue-name': true,
    'Your budget': true,
    'Special Offers': true,
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


   const handleClearFilters = () => {
    setSelectedFilters({})
  }

  const filters = [
    {
      id: "event-type",
      label: "Event Type",
      options: [
        { value: "concerts", label: "Concerts", count: 87 },
        { value: "clubbing", label: "Clubbing", count: 46 },
        { value: "festivals", label: "Festivals", count: 34 },
        { value: "spectacle", label: "Spectacle", count: 14 },
        
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
          { value: "antananarivo", label: "Antananarivo"},
          { value: "antsirabe", label: "Antsirabe" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "north",
        label: "North",
        children: [
          { value: "diego", label: "Diego"},
          { value: "ambilobe", label: "Ambilobe" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "south",
        label: "South",
        children: [
          { value: "toliara", label: "Toliara"},
          { value: "isalo", label: "Isalo" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "east",
        label: "East",
        children: [
          { value: "toamasina", label: "Toamasina"},
          { value: "isalo", label: "Isalo" },
          { value: "other", label: "Other" },
        ],
      },
      {
        value: "west",
        label: "West",
        children: [
          { value: "mahajanage", label: "Mahajanage"},
          { value: "morondave", label: "Morondava" },
          { value: "other", label: "Other" },
        ],
      },
      
    ],
  };

  

  const keyFeaturesFilter = {
    id: "venue-name",
    label: "Venue Name",
    options: [
  { value: "caudan-arts-centre", label: "Caudan Arts Centre", count: 84 },
  { value: "domaine-de-labourdonnais", label: "Domaine de Labourdonnais", count: 84 },
  { value: "le-suffren-hotel-marina", label: "Le Suffren Hotel & Marina", count: 84 },
  { value: "cafe-du-vieux-conseil", label: "Café du Vieux Conseil", count: 84 },
  { value: "hennessy-park-hotel", label: "Hennessy Park Hotel", count: 84 },
  {
    value: "7-cascades-restaurant-lodges-henrietta",
    label: "7 Cascades Restaurant & Lodges, Henrietta",
    count: 84,
  },
  {
    value: "jam-inn-domaine-de-sainte-marie",
    label: "Jam Inn, Domaine de Sainte Marie",
    count: 84,
  },
  {
    value: "trianon-convention-centre-quatre-bornes",
    label: "Trianon Convention Centre, Quatre Bornes",
    count: 84,
  },
  { value: "jj-auditorium-phoenix", label: "J&J Auditorium, Phoenix", count: 84 },
  { value: "svicc-pailles", label: "SVICC, Pailles", count: 84 },
  { value: "lagoon-attitude-hotel", label: "Lagoon Attitude Hotel", count: 84 },
  { value: "la-mariposa-tamarin", label: "La Mariposa, Tamarin", count: 84 },
  {
    value: "jin-fei-business-industrial-park",
    label: "JIN FEI – Business Industrial Park",
    count: 84,
  },
]
  };

  return (
    <div className="w-72 mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#22A628] text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter By</h2>
        <Button 
        onClick={handleClearFilters}
         variant="outline" className='bg-[#22A628] hover:bg-[#22A628] hover:border-white hover:text-white'>Clear</Button>
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
                    <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
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
                      className="flex justify-between items-center flex-1 text-left hover:text-blue-500"
                    >
                         <span className="text-sm text-gray-700 font-medium">{location.label}</span>
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
                        <label key={child.value} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFilters['location']?.includes(child.value) || false}
                            onChange={() => handleCheckbox('location', child.value)}
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
                  <span className="ml-2 text-sm text-left text-gray-700 group-hover:text-blue-500 flex-1">
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