"use client";
import React, { useState } from "react";
import { Youtube, Gift, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface RoomOption {
  id: string;
  type: string;
  details: string;
  price: number;
}

interface CompleteBookingProps {
  currency?: string;
}

const CompleteBooking: React.FC<CompleteBookingProps> = ({
  currency = "Rs",
}) => {
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [nights, setNights] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [expandedAll, setExpandedAll] = useState(true);
  const [expandedHoneymoon, setExpandedHoneymoon] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  const clearDate = () => {
    setCheckIn("");
    setCheckOut("");
    setNights(0);
  };

  const allInclusiveOptions: RoomOption[] = [
    { id: "ai-1", type: "Half Board", details: "", price: 0 },
    { id: "ai-2", type: "Full Board", details: "", price: 0 },
    {
      id: "ai-3",
      type: "Half Board + Full Board (3day Special Offer)",
      details: "",
      price: 0,
    },
    { id: "ai-4", type: "Couple Suite", details: "1 Adult", price: 7760 },
    {
      id: "ai-5",
      type: "Couple Suite",
      details: "1 Adult + 1 Child (0-6)",
      price: 7760,
    },
    {
      id: "ai-6",
      type: "Couple Suite",
      details: "1 Adult + 1 Child (7-12)",
      price: 8620,
    },
    {
      id: "ai-7",
      type: "Couple Suite",
      details: "1 Adult + 1 Teen (13-17)",
      price: 8620,
    },
    { id: "ai-8", type: "Couple Suite", details: "2 Adults", price: 8620 },
  ];

  const honeymoonOptions: RoomOption[] = [
    { id: "hm-1", type: "Half Board", details: "", price: 0 },
    { id: "hm-2", type: "Full Board", details: "", price: 0 },
    {
      id: "hm-3",
      type: "Half Board + Full Board (3day Special Offer)",
      details: "",
      price: 0,
    },
    { id: "hm-4", type: "Couple Suite", details: "1 Adult", price: 7760 },
    {
      id: "hm-5",
      type: "Couple Suite",
      details: "1 Adult + 1 Child (0-6)",
      price: 7760,
    },
    {
      id: "hm-6",
      type: "Couple Suite",
      details: "1 Adult + 1 Child (7-12)",
      price: 8620,
    },
    {
      id: "hm-7",
      type: "Couple Suite",
      details: "1 Adult + 1 Teen (13-17)",
      price: 8620,
    },
    { id: "hm-8", type: "Couple Suite", details: "2 Adults", price: 8620 },
  ];

  const displayedAllOptions = expandedAll
    ? allInclusiveOptions
    : allInclusiveOptions.slice(0, 5);
  const displayedHoneymoonOptions = expandedHoneymoon
    ? honeymoonOptions
    : honeymoonOptions.slice(0, 5);

  const locale = useLocale();

  const handleBooking = () => {
    router.push(`/${locale}/bookings`);
  };

  return (
    <div className="max-w-[437px]  font-sans ">
      {/* Top Section - Availability & Dates */}
      <div className="">
        {/* Availability */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300 bg-white">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-black">Available</span>
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={!isAvailable}
              onChange={(e) => setIsAvailable(!e.target.checked)}
              className="w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-gray-600">Not Available</span>
          </label>
          <button
            className="ml-auto flex items-center gap-1 bg-transparent border-none text-[#4CAF50] text-sm cursor-pointer font-medium hover:opacity-80"
            onClick={clearDate}
          >
            <X size={16} />
            <span>Clear Date</span>
          </button>
        </div>

        {/* Video Link */}
        <div className="flex items-center justify-center gap-2 px-3 py-3 bg-white border-b border-gray-300 text-[#C41E3A] text-sm font-medium cursor-pointer hover:opacity-90">
          <Youtube size={20} />
          <span>How to order ( step by Step Video )</span>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-3 border-b border-gray-300">
          <div className="flex flex-col items-center px-3 py-3 border-r border-gray-300">
            <label className="text-[13px] text-gray-400 mb-2">Check-IN</label>
            <input
              type="text"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="-"
              className="w-full text-center border-none text-base text-gray-800 outline-none placeholder:text-gray-800"
            />
          </div>
          <div className="flex flex-col items-center px-3 py-3 border-r border-gray-300">
            <label className="text-[13px] text-gray-400 mb-2">Check-Out</label>
            <input
              type="text"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="-"
              className="w-full text-center border-none text-base text-gray-800 outline-none placeholder:text-gray-800"
            />
          </div>
          <div className="flex flex-col items-center px-3 py-3">
            <label className="text-[13px] text-gray-400 mb-2">Nights</label>
            <input
              type="text"
              value={nights || "-"}
              onChange={(e) => setNights(parseInt(e.target.value) || 0)}
              placeholder="-"
              className="w-full text-center border-none text-base text-gray-800 outline-none placeholder:text-gray-800"
            />
          </div>
        </div>

        {/* Discount Banner */}
        <div className="bg-[#1e3a8a] text-white text-center px-4 py-4">
          <p className="m-0 text-sm leading-tight">
            Click on the Booking Options to
          </p>
          <p className="m-0 text-[15px] leading-tight font-semibold">
            See the DISCOUNTED PRICE
          </p>
        </div>
      </div>

      {/* All Inclusive Section */}
      <div className="">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-normal text-gray-900">All Inclusive</h3>
            <span className="text-sm font-medium text-[#C41E3A]">
              Rate/ Nights
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {displayedAllOptions.map((option) => (
            <label
              key={option.id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3"
            >
              <input
                type="checkbox"
                checked={selectedRooms[option.id] || false}
                onChange={(e) =>
                  setSelectedRooms((prev) => ({
                    ...prev,
                    [option.id]: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer appearance-none checked:bg-[#4CAF50] checked:border-[#4CAF50] relative mt-0.5 flex-shrink-0
                  before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-2 before:h-2 before:bg-white before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 checked:before:opacity-100"
              />
              <div className="flex justify-between items-start flex-1">
                <div className="flex-1">
                  <div className="text-sm text-gray-800">{option.type}</div>
                  {option.details && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.details}
                    </div>
                  )}
                </div>
                <div className="font-currency text-sm font-medium text-[#C41E3A] whitespace-nowrap ml-4">
                  {option.price > 0
                    ? `${currency} ${option.price.toLocaleString()}`
                    : "Rate / Night"}
                </div>
              </div>
            </label>
          ))}
        </div>
        {allInclusiveOptions.length > 5 && (
          <div className="px-4 py-3 text-center border-t border-gray-100">
            <button
              onClick={() => setExpandedAll(!expandedAll)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center w-full"
            >
              <span>{expandedAll ? "Show Less" : "Show More"}</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${expandedAll ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Honeymoon Section */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-normal text-gray-900">
              All Inclusive - Honeymoon Offer (Min 3 Nights)
            </h3>
            <span className="text-sm font-medium text-[#C41E3A]">
              Rate/ Nights
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {displayedHoneymoonOptions.map((option) => (
            <label
              key={option.id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3"
            >
              <input
                type="checkbox"
                checked={selectedRooms[option.id] || false}
                onChange={(e) =>
                  setSelectedRooms((prev) => ({
                    ...prev,
                    [option.id]: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer appearance-none checked:bg-[#4CAF50] checked:border-[#4CAF50] relative mt-0.5 flex-shrink-0
                  before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-2 before:h-2 before:bg-white before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 checked:before:opacity-100"
              />
              <div className="flex justify-between items-start flex-1">
                <div className="flex-1">
                  <div className="text-sm text-gray-800">{option.type}</div>
                  {option.details && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.details}
                    </div>
                  )}
                </div>
                <div className="font-currency text-sm font-medium text-[#C41E3A] whitespace-nowrap ml-4">
                  {option.price > 0
                    ? `${currency} ${option.price.toLocaleString()}`
                    : "Rate / Night"}
                </div>
              </div>
            </label>
          ))}
        </div>
        {honeymoonOptions.length > 5 && (
          <div className="px-4 py-3 text-center border-t border-gray-100">
            <button
              onClick={() => setExpandedHoneymoon(!expandedHoneymoon)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center w-full"
            >
              <span>{expandedHoneymoon ? "Show Less" : "Show More"}</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${expandedHoneymoon ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Subtotal & Book Now */}
      <div className="px-4 py-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base text-gray-900">Subtotal</span>
          <span className="font-currency text-2xl font-semibold text-[#4CAF50]">
            {currency} {subtotal}
          </span>
        </div>
        <button
          onClick={handleBooking}
          className="w-full py-3.5 bg-[#4CAF50] text-white text-base font-semibold rounded hover:bg-[#45a049] transition-colors cursor-pointer"
        >
          Book Now
        </button>
      </div>

      {/* Rewards */}
      <div className="px-4 py-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-[#03A9F4] rounded-full flex items-center justify-center">
            <Gift size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">We will Earn</span>
            <span className="text-sm font-semibold text-gray-900">
              0 Reward Point
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-white flex items-center justify-center gap-6 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-gray-500">No Booking Fees</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-gray-500">No Credit Card Fees</span>
        </label>
      </div>

      <div className="mt-3 h-2 w-full bg-gradient-to-r from-red-500 to-green-500 mt-6"></div>
    </div>
  );
};

export default CompleteBooking;
