// components/BookingCalendar.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Gift, X } from "lucide-react";
import { useRouter } from "next/navigation";
interface CompleteBookingProps {
  currency?: string;
}

const CalenderBookings = ({ currency = "Rs" }) => {
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

  const handleBooking = () => {
    router.push("/bookings");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white ">
      {/* Top Section - Availability & Dates */}
      <div className=" border-gray-300">
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

        {/* Discount Banner */}
        <div className="bg-[#D9D9D9] text-white py-6  px-3">
          <div className="px-4 ">
            <li className="text-black">
              <span className="text-red-500">All Booking is On Request. </span>
              Please call us on  <span className="text-red-500">
                269-1500
              </span>{" "}
              to confirm availability before booking.
            </li>
            <li className="text-black">
              All guests on the same reservation must book the{" "}
              <span className="text-red-500">same menu.</span>
            </li>
          </div>
        </div>
        {/* Selected Date Display */}
        <div className=" bg-white border-t">
          <p className="text-black bg-[#EBEBEB] font-medium text-center text-xl py-4">
            Select Date
          </p>
          <p className="text-center text-4xl border border-gray-400">-</p>
        </div>

        <div className="mt-8 ">
          <p className="bg-[#253B80] py-4 text-center text-lg text-white">
            All-Inclusive Day Pass
          </p>
        </div>

        <div className="border border-gray-400 my-4">
          <div className="flex justify-between items-center mb-2 px-4 py-2">
            <span className="font-semibold text-gray-800">No. of Adults</span>
            <select
              defaultValue="0"
              className="border border-gray-300 bg-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="0">Select</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="text-red-500 font-semibold">AR0000</span>
          </div>
        </div>

        <div className="mt-4 ">
          <p className="bg-[#253B80] py-2 text-center text-lg text-white">
            Vakans Lekol | All-Inclusive Day Pass
          </p>
        </div>
        <div className="border border-gray-400 my-4">
          <div className="flex justify-between items-center mb-2 px-4 py-2">
            <span className="font-semibold text-gray-800">No. of Adults</span>
            <select
              defaultValue="0"
              className="border border-gray-300 bg-gray-300  rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="0">Select</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subtotal & Book Now */}
        <div className="px-4 py-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base text-gray-900">Subtotal</span>
            <span className="text-2xl font-semibold text-[#4CAF50]">
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

        {/* <div className="border-2  mt-3 "></div> */}
        <div className="mt-3 h-2 w-full bg-gradient-to-r from-red-500 to-green-500"></div>
      </div>
    </div>
  );
};

export default CalenderBookings;
