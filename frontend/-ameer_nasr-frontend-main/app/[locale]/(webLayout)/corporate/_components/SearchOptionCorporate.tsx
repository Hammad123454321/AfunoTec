"use client";

import { useState } from "react";
import { MapPin, Tag, Search } from "lucide-react";
import Image from "next/image";

interface LocationActivitySearchProps {
  onSearch?: (location: string, activityType: string) => void;
  locationPlaceholder?: string;
  activityPlaceholder?: string;
  className?: string;
}

export default function SearchOptionCorporate({
  onSearch,
  locationPlaceholder = "Choose your Preferred location",
  activityPlaceholder = "Select the Event Type",
  className = "",
}: LocationActivitySearchProps) {
  const [location, setLocation] = useState("");
  const [activityType, setActivityType] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(location, activityType);
    }
    console.log("Searching:", { location, activityType });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
   <div className={`w-full mx-auto ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center bg-white rounded-lg pr-3 shadow-md overflow-hidden border border-gray-200">
        {/* Location Input */}
        <div className="flex items-center flex-1 px-4 py-3 gap-3 border-r border-gray-200">
          <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={locationPlaceholder}
            className="flex-1 outline-none text-sm py-1.5 text-gray-700 placeholder-gray-600 bg-transparent"
          />
        </div>

        {/* Activity Type Dropdown */}
        <div className="flex items-center flex-1 px-4 py-3 gap-3 border-r border-gray-200">
          <Image 
            src="/Vector.png"
            alt="Activity Icon"
            width={20}
            height={20}
            className="flex-shrink-0"
          />
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="flex-1 py-1.5 outline-none text-sm text-gray-700 bg-transparent cursor-pointer appearance-none pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "12px",
            }}
          >
            <option value="" disabled>
              {activityPlaceholder}
            </option>
            <option value="adventure">Adventure Activities</option>
            <option value="water">Water Sports</option>
            <option value="cultural">Cultural Tours</option>
            <option value="wildlife">Wildlife Safari</option>
            <option value="relaxation">Relaxation & Spa</option>
            <option value="food">Food & Dining</option>
            <option value="nightlife">Nightlife</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-[#1BA0E2] hover:bg-[#1590D2] cursor-pointer text-white px-3 py-3 flex items-center gap-2 transition-colors font-medium text-sm flex-shrink-0 rounded-r-lg"
        >
          <Search className="w-4 h-4" />
          SEARCH
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Location Input */}
        <div className="flex items-center px-4 py-3 gap-3 border-b border-gray-200">
          <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={locationPlaceholder}
            className="flex-1 outline-none text-sm py-1.5 text-gray-700 placeholder-gray-600 bg-transparent"
          />
        </div>

        {/* Activity Type Dropdown */}
        <div className="flex items-center px-4 py-3 gap-3 border-b border-gray-200">
          <Image 
            src="/Vector.png"
            alt="Activity Icon"
            width={20}
            height={20}
            className="flex-shrink-0"
          />
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="flex-1 py-1.5 outline-none text-sm text-gray-700 bg-transparent cursor-pointer appearance-none pr-8"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "12px",
            }}
          >
            <option value="" disabled>
              {activityPlaceholder}
            </option>
            <option value="adventure">Adventure Activities</option>
            <option value="water">Water Sports</option>
            <option value="cultural">Cultural Tours</option>
            <option value="wildlife">Wildlife Safari</option>
            <option value="relaxation">Relaxation & Spa</option>
            <option value="food">Food & Dining</option>
            <option value="nightlife">Nightlife</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-[#1BA0E2] hover:bg-[#1590D2] cursor-pointer text-white px-4 py-3 flex items-center justify-center gap-2 transition-colors font-medium text-sm"
        >
          <Search className="w-4 h-4" />
          SEARCH
        </button>
      </div>
    </div>
  );
}