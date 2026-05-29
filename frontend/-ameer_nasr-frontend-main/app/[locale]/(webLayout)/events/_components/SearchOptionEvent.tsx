"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
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

  // Shared input/select styles
  const inputBase = `
    flex-1 outline-none text-sm py-1.5 
    text-gray-700 placeholder-gray-600 bg-transparent
  `;

  const fieldBase = `
    flex items-center gap-3 px-4 py-3
    border-gray-200 bg-white
  `;

  return (
    <div className={`w-full mx-auto max-w-4xl ${className}`}>
      {/* 
        Main container - uses flex-col on mobile, flex-row on md+
        rounded corners, shadow and border are consistent
      */}
      <div
        className={`
          flex flex-col md:flex-row 
          bg-white rounded-lg shadow-md border border-gray-200 
          overflow-hidden divide-y md:divide-y-0 md:divide-x
        `}
      >
        {/* Location field */}
        <div className={`${fieldBase} md:flex-1 border-b md:border-b-0 md:border-r`}>
          <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={locationPlaceholder}
            className={inputBase}
          />
        </div>

        {/* Activity field */}
        <div className={`${fieldBase} md:flex-1 border-b md:border-b-0 md:border-r`}>
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
            className={`
              ${inputBase} cursor-pointer appearance-none pr-8
            `}
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

        {/* Search button - full width on mobile, auto width on desktop */}
        <button
          onClick={handleSearch}
          className={`
            flex items-center justify-center gap-2
            bg-[#1BA0E2] hover:bg-[#1590D2] text-white 
            px-6 py-3 font-medium text-sm transition-colors
            w-full md:w-auto
          `}
        >
          <Search className="w-4 h-4" />
          SEARCH
        </button>
      </div>
    </div>
  );
}