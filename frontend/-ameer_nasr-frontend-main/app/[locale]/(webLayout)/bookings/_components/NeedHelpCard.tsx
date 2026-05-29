"use client";

import { Phone, MessageSquare } from "lucide-react";

export default function NeedHelpCard() {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md animate-in slide-in-from-bottom duration-1000 mt-6">
      <h4 className="text-[17px] font-serif font-semibold text-gray-900 mb-2">
        Need help with your booking?
      </h4>
      <p className="text-[13px] text-gray-500 font-normal leading-relaxed mb-8">
        Our team is available during business hours to assist you every step of
        the way.
      </p>
      <div className="flex gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#d2ead6] rounded-xl text-[#2d9e3f] text-sm font-semibold hover:bg-[#eaf7ee] transition-all group">
          <Phone
            size={16}
            fill="currentColor"
            className="opacity-0 group-hover:opacity-10 transition-opacity"
          />
          <Phone size={16} strokeWidth={2} /> 269 1500
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#d2ead6] rounded-xl text-[#2d9e3f] text-sm font-semibold hover:bg-[#eaf7ee] transition-all group">
          <MessageSquare size={16} strokeWidth={2} /> Live chat
        </button>
      </div>
    </div>
  );
}
