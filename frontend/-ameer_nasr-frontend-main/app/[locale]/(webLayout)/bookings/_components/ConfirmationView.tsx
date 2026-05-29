"use client";

import {
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Download,
  Share2,
  Phone,
  MessageSquare,
  Mail,
  XCircle,
  Bookmark,
  Briefcase,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ConfirmationView() {
  return (
    <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
      {/* 1. SUCCESS BANNER (Image 5) */}
      <div className="bg-[#2d9e4f] rounded-[2rem] p-10 text-white shadow-xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="w-16 h-16 bg-[#5db677] rounded-full flex items-center justify-center shrink-0 border-4 border-white/10">
          <CheckCircle2 size={32} strokeWidth={3} className="text-white" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-serif font-semibold mb-2">
            Your booking is confirmed!
          </h2>
          <p className="text-sm font-medium opacity-90 leading-relaxed">
            Congratulations — your stay at{" "}
            <span className="font-semibold">Riu Turquoise Mauritius</span> is
            booked. A confirmation has been sent to{" "}
            <span className="font-semibold">rakoto@email.mg</span> and by SMS to
            your registered number.
          </p>
        </div>

        <div className="text-center md:text-right space-y-1 min-w-[200px]">
          <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
            BOOKING REFERENCE
          </span>
          <p className="text-4xl font-serif font-semibold ">BDL-20482</p>
          <p className="text-[10px] font-semibold opacity-60">
            Save this for check-in
          </p>
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          {/* Booking Details Card (Image 4) */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-serif font-semibold text-gray-900">
                Booking details
              </h3>
              <div className="flex items-center gap-2 bg-[#eaf7ee] text-[#2d9e4f] px-3 py-1 rounded-full text-[11px] font-semibold border border-[#d2ead6]">
                <CheckCircle2 size={12} /> Confirmed
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Hotel Header */}
              <div className="flex gap-6 items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop"
                    alt="hotel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex gap-0.5 opacity-90">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <h4 className="text-xl font-serif font-semibold text-gray-800">
                    Riu Turquoise Mauritius
                  </h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                    <MapPin size={12} className="text-gray-400" /> North,
                    Mauritius
                  </p>
                </div>
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-6 border-r border-gray-100 space-y-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">
                    CHECK-IN
                  </span>
                  <p className="text-lg font-semibold text-gray-800 leading-tight">
                    02 Feb 2026
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium tracking-tight">
                    From 14:00
                  </p>
                </div>
                <div className="p-6 border-r border-gray-100 space-y-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">
                    CHECK-OUT
                  </span>
                  <p className="text-lg font-semibold text-gray-800 leading-tight">
                    04 Feb 2026
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium tracking-tight">
                    Before 11:00
                  </p>
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">
                    DURATION
                  </span>
                  <p className="text-lg font-semibold text-gray-800 leading-tight">
                    2 nights
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium tracking-tight">
                    1 room · 2 guests
                  </p>
                </div>
              </div>

              {/* Specs List */}
              <div className="space-y-4 pt-4 border-t border-gray-50 text-sm font-medium">
                {[
                  {
                    label: "Room type",
                    value: "Comfort Room — All Inclusive",
                    strong: true,
                  },
                  { label: "Meal plan", value: "All Inclusive" },
                  { label: "Booking date", value: "15 Mar 2026 · 16:42" },
                  { label: "Payment method", value: "MVola · 034 XX XXX XX" },
                  {
                    label: "Amount paid",
                    value: "MGA 900",
                    color: "text-[#2d9e3f]",
                  },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        "text-gray-800",
                        row.strong && "font-semibold",
                        row.color,
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guests Card (Image 3) */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 pb-4">
              <h3 className="text-xl font-serif font-semibold text-gray-900">
                Guests
              </h3>
            </div>
            <div className="p-8 pt-4 space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-xl shadow-sm">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-800">
                    Rakoto Jean
                  </span>
                  <span className="bg-[#eaf7ee] text-[#2d9e4f] text-[9px] font-semibold uppercase px-2 py-0.5 rounded">
                    Primary guest
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-xl shadow-sm">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-800">
                    Rakoto Marie
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium italic">
                Please present a valid Malagasy National Identity Card or
                passport at check-in. The hotel may request ID verification for
                all guests.
              </p>
            </div>
          </div>

          {/* What Happens Next Section (Image 3) */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-xl font-serif font-semibold text-gray-900 leading-tight">
                What happens next?
              </h3>
            </div>
            <div className="p-8 space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Check your email & SMS",
                  desc: "A full booking confirmation has been sent to rakoto@email.mg and by SMS to your number. It includes your booking reference, hotel contact details, and check-in instructions.",
                  color: "bg-[#eaf7ee] text-[#a855f7]",
                },
                {
                  icon: Bookmark,
                  title: "Save your booking reference",
                  desc: "Your reference number is BDL-20482. Keep it handy — you'll need it at check-in and if you need to contact us or the hotel about your stay.",
                  color: "bg-[#f0f9ff] text-[#f59e0b]",
                },
                {
                  icon: Briefcase,
                  title: "Arrive ready",
                  desc: "Check-in starts at 14:00 on 02 Feb 2026. Bring your NIC or passport and the name used for this booking. The hotel's address and contact details are in your confirmation email.",
                  color: "bg-[#fff2f2] text-[#ef4444]",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#fbfcff] p-6 rounded-2xl border border-gray-100 flex gap-6 group hover:bg-white transition-colors duration-500"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 bg-white shadow-sm",
                      item.color,
                    )}
                  >
                    <item.icon size={22} className="opacity-70" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-gray-900 leading-none mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[13px] text-gray-500 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR (Image 1) */}
        <div className="space-y-8 lg:sticky lg:top-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Image */}
            <div className="relative h-36">
              <Image
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop"
                alt="hotel"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 text-white text-shadow-sm">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-[10px]">
                      ★
                    </span>
                  ))}
                </div>
                <h4 className="text-base font-serif font-black">
                  Riu Turquoise Mauritius
                </h4>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Reference Box */}
              <div className="bg-[#eaf7ee]/50 px-5 py-6 rounded-xl border border-[#2d9e4f]/20 text-center space-y-1">
                <span className="text-[9px] font-black text-[#2d9e3f] uppercase tracking-widest opacity-80">
                  BOOKING REFERENCE
                </span>
                <p className="text-3xl font-serif font-semibold text-[#208442] tracking-tighter">
                  BDL-20482
                </p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-4 text-[13px] font-medium pt-1">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Hotel fare</span>
                  <span className="font-semibold text-gray-800">MGA 1,000</span>
                </div>
                <div className="flex justify-between items-center text-[#2d9e3f]">
                  <span className="">Promo (WELCOME10)</span>
                  <span className="font-semibold">- MGA 100</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Taxes & fees</span>
                  <span className="font-semibold text-[#2d9e3f]">Included</span>
                </div>
              </div>

              <div className="h-px bg-gray-50" />

              {/* Total Paid Section */}
              <div className="flex justify-between items-baseline pt-2">
                <div>
                  <p className="text-base font-semibold text-gray-900 leading-none mb-1.5">
                    Total paid
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    All taxes included
                  </p>
                </div>
                <p className="text-3xl font-serif font-semibold text-[#2d9e3f]">
                  MGA 900
                </p>
              </div>

              {/* Payment Badge */}
              <div className="bg-[#eaf7ee] px-4 py-3 rounded-xl text-center text-[#2d9e3f] text-[11px] font-semibold flex items-center justify-center gap-2 border border-[#d2ead6]">
                <CheckCircle2 size={14} /> Payment received · MVola
              </div>

              {/* Confirmation Actions */}
              <div className="space-y-3 pt-2">
                <button className="w-full bg-[#2d9e4f] text-white py-[14px] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#208442] shadow-sm transition-all text-sm">
                  <Download size={18} /> Download confirmation PDF
                </button>
                <button className="w-full bg-white border border-gray-100 text-gray-800 py-[14px] rounded-xl font-semibold flex items-center justify-center gap-2 hover:border-[#2d9e4f] hover:text-[#2d9e4f] transition-all text-sm shadow-sm">
                  <Share2 size={18} /> Share booking details
                </button>
                <button className="w-full bg-white border border-[#fff2f2] text-[#ef4444] py-[14px] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#fff2f2] transition-all text-sm shadow-sm">
                  <XCircle size={18} /> Cancel booking
                </button>
              </div>

              {/* Support Links */}
              <div className="pt-8 border-t border-gray-50 flex flex-col gap-4">
                <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest pl-1">
                  NEED HELP?
                </span>
                {[
                  { icon: Phone, text: "Call 269 1500" },
                  { icon: MessageSquare, text: "Start live chat" },
                  { icon: Mail, text: "Email info@baodeal.net" },
                ].map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-sm font-semibold text-[#3496f8] hover:underline cursor-pointer group"
                  >
                    <link.icon
                      size={16}
                      className="opacity-80 group-hover:opacity-100"
                    />
                    <span>{link.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Experiences (Image 2) */}
      <div className="pt-24 space-y-12 pb-12">
        <div className="space-y-2">
          <h3 className="text-3xl font-serif font-semibold text-gray-900 tracking-tight leading-none">
            You might also enjoy
          </h3>
          <p className="text-[13px] text-gray-500 font-medium">
            Activities and experiences near your hotel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Snorkeling day trip",
              loc: "North coast · Half day · Equipment included",
              price: "MGA 1,200",
              img: "https://images.unsplash.com/photo-1563220475-7140f09a5658?w=400&h=300&fit=crop",
              stars: 5,
            },
            {
              title: "Dolphin watching cruise",
              loc: "Tamarin Bay · Morning · Breakfast on board",
              price: "MGA 2,500",
              img: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=300&fit=crop",
              stars: 4,
            },
            {
              title: "Shanti Spa — 90 min ritual",
              loc: "In-hotel · Hammam + massage + sauna",
              price: "MGA 3,800",
              img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
              stars: 5,
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-xl transition-all duration-700"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <div className="p-8 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-serif font-black text-gray-800 group-hover:text-[#2d9e4f] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                    {card.loc}
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <p className="text-xl font-serif font-semibold text-[#2d9e3f] leading-none">
                    {card.price}
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(card.stars)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
