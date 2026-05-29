"use client";

import {
  User,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  Lock,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function GuestInformationForm({
  onProceed,
}: {
  onProceed: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
      {/* SECTION 1: Guest Information */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#2d9e4f] text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-serif text-gray-900 leading-tight">
                Guest information
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Please fill in details exactly as they appear on each
                guest&apos;s ID or passport
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Orange Alert Banner */}
          <div className="bg-[#fff9eb] border border-[#ffecbf] p-6 rounded-xl flex gap-4 items-start">
            <AlertTriangle
              className="text-[#f59e0b] mt-0.5 shrink-0"
              size={18}
            />
            <p className="text-[13px] text-[#92400e] leading-snug">
              Provide all information{" "}
              <span className="font-semibold">
                exactly as it appears on the passport or national ID
              </span>{" "}
              to avoid complications at check-in.
            </p>
          </div>

          {/* Guest/Room Summary Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#eaf7ee] px-4 py-1.5 rounded-full text-[#2d9e3f] text-xs font-medium border border-[#d2ead6]">
              <User size={14} className="opacity-70" /> 2 guests · 1 room
            </div>
            <span className="text-[12px] text-gray-500 font-normal">
              — primary guest details cover all room occupants
            </span>
          </div>

          {/* Form Section Header with Line */}
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide whitespace-nowrap">
              ROOM 1 — PRIMARY GUEST <span className="text-[#e02424]">*</span>
            </h3>
            <div className="h-px bg-gray-100 flex-1" />
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-1">
                FIRST NAME
              </label>
              <input
                type="text"
                placeholder="As on passport"
                className="w-full h-[54px] bg-white border border-gray-200 rounded-xl px-5 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-[#2d9e4f] focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-1">
                LAST NAME
              </label>
              <input
                type="text"
                placeholder="As on passport"
                className="w-full h-[54px] bg-white border border-gray-200 rounded-xl px-5 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-[#2d9e4f] focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-1">
                PHONE NUMBER
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl h-[54px] overflow-hidden focus-within:border-[#2d9e4f] transition-all">
                <div className="flex items-center px-4 gap-2 border-r border-gray-100 bg-white group cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="text-[13px] font-semibold text-gray-800">
                    MG +261
                  </span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="flex-1 bg-white px-5 text-sm font-medium text-gray-700 placeholder:text-gray-300 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full h-[54px] bg-white border border-gray-200 rounded-xl px-5 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-[#2d9e4f] focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-1">
                COUNTRY OF RESIDENCE
              </label>
              <div className="relative">
                <select className="w-full h-[54px] bg-white border border-gray-200 rounded-xl px-5 text-sm font-medium text-gray-700 appearance-none focus:border-[#2d9e4f] focus:outline-none transition-all cursor-pointer">
                  <option>Select your country</option>
                  <option>Mauritius</option>
                  <option>Madagascar</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box at Bottom of Section */}
          <div className="bg-[#fcfcfc] p-5 rounded-xl border border-gray-100 flex gap-4 items-center">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2d9e4f] shadow-sm">
              <User size={16} strokeWidth={2} />
            </div>
            <p className="text-[12px] text-gray-500 font-normal leading-normal">
              The primary guest&apos;s details cover all guests in this room. No
              additional information is needed for the second guest.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Special Requests */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <Plus size={16} className="text-gray-400" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-serif text-gray-900 leading-tight">
                Special requests
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Optional — we&apos;ll do our best to accommodate
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-4">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-1">
            ANY REQUESTS FOR THE HOTEL?
          </label>
          <textarea
            rows={4}
            placeholder="e.g. early check-in, sea-view room, dietary requirements, anniversary setup..."
            className="w-full bg-white border border-gray-200 rounded-xl p-5 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-[#2d9e4f] focus:outline-none transition-all resize-none"
          />
          <p className="text-[12px] text-gray-400 font-normal italic">
            Special requests are not guaranteed. The hotel will confirm
            availability on arrival.
          </p>
        </div>
      </div>

      {/* SECTION 3: Confirmation and Button */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 space-y-6 shadow-sm">
        {/* Checkbox with styled container */}
        <div className="bg-[#fcfcfc] p-6 pr-10 rounded-xl border border-gray-100 flex gap-4">
          <div className="mt-0.5">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#2d9e4f] focus:ring-0 cursor-pointer accent-[#2d9e4f]"
            />
          </div>
          <label
            htmlFor="terms-checkbox"
            className="text-[13px] text-gray-500 font-normal leading-relaxed cursor-pointer select-none"
          >
            I have read and agree to the{" "}
            <Link
              href="#"
              className="text-[#2d9e4f] font-semibold hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-[#2d9e4f] font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
            . I confirm the guest information provided is accurate and matches
            official ID documents.
          </label>
        </div>

        <div className="space-y-4 text-center">
          <button
            onClick={onProceed}
            disabled={!agreed}
            className="w-full bg-[#2d9e4f] text-white py-[18px] rounded-xl font-semibold text-base flex items-center justify-center gap-3 hover:bg-[#268c44] transition-all group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-100/50"
          >
            <Lock
              size={18}
              fill="currentColor"
              className="text-white shadow-sm"
            />
            <span>Proceed to payment</span>
            <ChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <p className="text-[12px] text-gray-400 font-normal px-10">
            Your payment is protected by 256-bit SSL encryption. Best price
            guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
