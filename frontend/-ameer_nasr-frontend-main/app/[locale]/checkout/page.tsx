// app/booking/guest-information/page.tsx
import React from "react";
import Image from "next/image";

export default function GuestInformationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Main container - flex on larger screens */}
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* LEFT - Form */}
          <div className="flex-1 bg-white shadow rounded-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Steps indicator */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Provide Guest Information
                </h2>
              </div>

              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                <strong>Important:</strong> Provide ALL information EXACTLY as
                they appear in the passport to avoid booking complications.
              </div>

              <div className="mb-6">
                <div className="text-lg font-medium text-gray-700">
                  Number of guests for room:{" "}
                  <span className="font-semibold">2</span>
                </div>
              </div>

              {/* Room 1 */}
              <GuestRoomSection roomNumber={1} />

              {/* Room 2 */}
              <GuestRoomSection roomNumber={2} />

              {/* Agreement */}
              <div className="mt-8 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Terms
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit button */}
              <div className="mt-10">
                <button
                  type="button"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  // disabled={!formIsValid || isSubmitting}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT - Summary Sidebar */}
          <div className="lg:w-96 mt-6 lg:mt-0">
            <div className="bg-white shadow rounded-xl p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Booking Summary
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="text-sm text-gray-500">Hotel</div>
                  <div className="font-medium text-gray-900">
                    RIU Turquoise Mauritius
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">
                    Check-in / Check-out
                  </div>
                  <div className="font-medium text-gray-900">
                    19 Jun — 26 Jun{" "}
                    <span className="text-gray-500 text-sm">(7 nights)</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Fare Type</div>
                  <div className="font-medium text-gray-900">DISCOUNT FARE</div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Booking Code / Promo
                  </div>
                  <div className="font-medium text-gray-900">8808AH</div>
                </div>

                <div className="pt-5 border-t">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total Price</span>
                    <span>USD 0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Room Section Component
function GuestRoomSection({ roomNumber }: { roomNumber: number }) {
  return (
    <div className="mt-10 pt-8 border-t border-gray-200 first:mt-0 first:pt-0 first:border-t-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        Room {roomNumber}: Details of Primary Guest *
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter First Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter Last Name"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
              +880
            </span>
            <input
              type="tel"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter Phone Number"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter Email"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            defaultValue=""
          >
            <option value="" disabled>
              Select Country
            </option>
            <option value="BD">Bangladesh</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            {/* Add more countries as needed */}
          </select>
        </div>
      </div>
    </div>
  );
}
