"use client";

import { useState } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Guest, BookingData } from "@/types/booking";
import { Building2, DollarSign } from "lucide-react";

interface Props {
  roomCount?: number;
  onSubmit: (data: BookingData) => void;
}

// type MobileInputProps = {
//   value?: string;
//   onChange?: (value: string) => void;
// };

export default function GuestInformation({ roomCount = 2, onSubmit }: Props) {
  const [rooms, setRooms] = useState<Guest[]>(
    Array.from({ length: roomCount }).map(() => ({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      country: "",
    })),
  );

  const [phone, setPhone] = useState("");
  const [value, setValue] = useState<string>("");

  const updateRoom = (index: number, field: keyof Guest, value: string) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  return (
    <div className="flex flex-col md:flex-row  justify-between  gap-5">
      <div className="bg-white border rounded p-8  lg:w-3/5">
        {/* Header */}
        <h2 className="font-semibold text-lg mb-4">
          PROVIDE GUEST INFORMATION
        </h2>

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 text-xs text-gray-700 p-3 rounded mb-6">
          ⚠️ Provide all the information{" "}
          <strong>EXACTLY AS THEY APPEAR IN THE PASSPORT</strong> to avoid
          booking complications
        </div>

        {/* Guest count */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          Number of guests for room: {roomCount}
        </p>

        <div className="">
          {/* Rooms */}
          <div className="space-y-8">
            {rooms.map((room, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold mb-3">
                  Room {index + 1}: Details of Primary Guest{" "}
                  <span className="text-red-500">*</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="border-2 border-gray-500 bg-[#EBEBEB] px-3 py-2 text-sm "
                    placeholder="Enter First Name"
                    value={room.firstName}
                    required
                    onChange={(e) =>
                      updateRoom(index, "firstName", e.target.value)
                    }
                  />

                  <input
                    className="border-2 border-gray-500 bg-[#EBEBEB] px-3 py-2 text-sm"
                    placeholder="Enter Last Name"
                    required
                    value={room.lastName}
                    onChange={(e) =>
                      updateRoom(index, "lastName", e.target.value)
                    }
                  />

                  <PhoneInput
                    // @ts-ignore
                    international
                    required
                    country="fr"
                    value={value}
                    onChange={(val) => setValue(val)}
                  />

                  <input
                    className="border-2 border-gray-500 bg-[#EBEBEB] px-3 py-2 text-sm"
                    placeholder="Enter Email"
                    required
                    value={room.email}
                    onChange={(e) => updateRoom(index, "email", e.target.value)}
                  />

                  <input
                    className="border-2 border-gray-500 bg-[#EBEBEB] px-3 py-2 text-sm col-span-2"
                    placeholder="Country Name"
                    required
                    value={room.country}
                    onChange={(e) =>
                      updateRoom(index, "country", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => onSubmit({ rooms })}
            className="mt-10 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded text-sm font-semibold cursor-pointer"
          >
            Proceed by Payment
          </button>
        </div>
      </div>
      <div className="lg:w-2/5">
        <div className="bg-white rounded-lg p-5 shadow-sm mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <Building2 width="80" strokeWidth={1} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  RIU TURQUOISE MAURITIUS
                </h3>
                <p className="text-xs text-gray-500">2TRAVELER, 2 NIGHTS</p>
              </div>
            </div>
            <span className="bg-blue-400 text-white text-xs font-semibold px-3 py-1 rounded">
              Details
            </span>
          </div>

          <div className="flex justify-between my-4">
            <div>
              <p className="text-gray-500 font-semibold">Check In</p>
              <p>02 Feb, 2026</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold">Checkout</p>
              <p>02 Feb, 2026</p>
            </div>
          </div>

          {/* Price Details */}
          <div className="space-y-2.5 border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                  <DollarSign />
                </div>
                <span className="text-sm text-gray-600">HOTEL FARE</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 font-currency">
                1000AR
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <span className="text-sm text-[#F3AF1B]">DISCOUNT</span>
              </div>
              <span className="text-sm font-semibold text-[#F3AF1B] font-currency">
                -100AR
              </span>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200">
            <span className="text-sm font-semibold text-gray-900">
              TOTAL PRICE
            </span>
            <span className="text-lg font-semibold text-gray-900 font-currency">0000</span>
          </div>

          <div className="flex items-start gap-2 mt-4">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mt-0.5 accent-green-500 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-600 cursor-pointer leading-tight"
            >
              I agree to the Terms and Privacy Policy
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
