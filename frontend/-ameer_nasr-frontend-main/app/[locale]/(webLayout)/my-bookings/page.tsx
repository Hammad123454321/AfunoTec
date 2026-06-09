"use client";

import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
  MoreVertical,
  Star,
  CreditCard,
  ChevronRight,
  Download,
  Eye,
  RefreshCw,
  Plus,
  User,
  ClipboardList,
  Settings,
  Heart,
  Camera,
  Wallet,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BookingStatus = "confirmed" | "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  hotelName: string;
  ref: string;
  dates: string;
  details: string;
  location: string;
  price: string;
  status: BookingStatus;
  paymentMethod: string;
  image: string;
  timeLabel: string;
  specialRef?: string;
}

const allBookings: Booking[] = [
  {
    id: "1",
    hotelName: "Riu Turquoise Mauritius",
    ref: "BDL-20482",
    dates: "02 Feb — 04 Feb 2026",
    details: "2 guests · 1 room",
    location: "North, Mauritius",
    price: "Ar 900",
    status: "confirmed",
    paymentMethod: "Paid via MVola",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=320&h=200&fit=crop",
    timeLabel: "In 17 days",
    specialRef: "Comfort Room — All Inclusive",
  },
  {
    id: "2",
    hotelName: "Preskil Island Resort Mauritius",
    ref: "BDL-20411",
    dates: "20 Mar — 25 Mar 2026",
    details: "2 guests · 1 room",
    location: "South, Mauritius",
    price: "Ar 6,200",
    status: "upcoming",
    paymentMethod: "Paid via Credit Card",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=320&h=200&fit=crop",
    timeLabel: "In 33 days",
    specialRef: "Superior Room — Half Board",
  },
  {
    id: "3",
    hotelName: "Tamassa Bel Ombre",
    ref: "BDL-19874",
    dates: "10 Jan — 14 Jan 2026",
    details: "2 guests · 1 room",
    location: "South, Mauritius",
    price: "Ar 8,200",
    status: "completed",
    paymentMethod: "Paid via MVola",
    image:
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=320&h=200&fit=crop",
    timeLabel: "64 days ago",
    specialRef: "All Inclusive Overnight Stay",
  },
  {
    id: "4",
    hotelName: "Ocean's Creek Beach Hotel",
    ref: "BDL-19603",
    dates: "05 Dec — 08 Dec 2025",
    details: "2 guests · 1 room",
    location: "North, Mauritius",
    price: "Ar 4,100",
    status: "cancelled",
    paymentMethod: "Refund processed",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=320&h=200&fit=crop",
    timeLabel: "Cancelled on 01 Dec 2025",
    specialRef: "Canceled",
  },
];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredBookings = useMemo(() => {
    if (activeTab === "All") return allBookings;

    return allBookings.filter((booking) => {
      if (
        activeTab === "Upcoming" &&
        (booking.status === "upcoming" || booking.status === "confirmed")
      )
        return true;
      if (activeTab === "Completed" && booking.status === "completed")
        return true;
      if (activeTab === "Cancelled" && booking.status === "cancelled")
        return true;
      return false;
    });
  }, [activeTab]);

  return (
    <div className="bg-[#fbfcff] min-h-screen">
      <Container className="py-12 md:py-20">
        <div className="lg:flex lg:gap-12 items-start relative">
          {/* SIDEBAR (Left) */}
          <div className="hidden lg:block w-72 shrink-0 space-y-6 lg:sticky lg:top-8">
            {/* Profile Card */}
            <div className="bg-white rounded-[1.5rem] p-8 text-center border border-gray-100 shadow-sm space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-[#eaf7ee] rounded-full border-2 border-[#2d9e4f]/20 flex items-center justify-center text-3xl font-serif font-black text-[#2d9e4f]">
                  RJ
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[#2d9e4f] shadow-sm">
                  <Camera size={14} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-black text-gray-900 leading-tight">
                  Rakoto Jean
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  rakoto@email.mg
                </p>
              </div>
              <div className="bg-[#fff9e6] py-2 px-4 rounded-full border border-amber-100 inline-flex items-center gap-2">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none">
                  900 reward points
                </span>
              </div>
            </div>

            {/* Navigation Card */}
            <div className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm">
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-[#eaf7ee] text-[#2d9e4f] font-black text-sm">
                  <ClipboardList size={18} /> My bookings
                </button>
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-gray-400 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  <User size={18} /> My profile
                </button>
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-gray-400 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  <Heart size={18} /> Wishlist
                </button>
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-gray-400 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  <Settings size={18} /> Settings
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT (Right) */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-4xl font-serif font-black text-gray-900 tracking-tight">
                  My <span className="text-[#2d9e4f]">bookings</span>
                </h2>
              </div>
              <button className="bg-[#2d9e4f] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#208442] shadow-xl shadow-green-50 transition-all self-start md:self-end">
                <Plus size={16} /> New booking
              </button>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "TOTAL BOOKINGS",
                  value: allBookings.length,
                  sub: "Since account created",
                },
                {
                  label: "UPCOMING",
                  value: allBookings.filter(
                    (b) => b.status === "upcoming" || b.status === "confirmed",
                  ).length,
                  sub: "Next: 02 Feb 2026",
                  active: true,
                },
                {
                  label: "COMPLETED",
                  value: allBookings.filter((b) => b.status === "completed")
                    .length,
                  sub: "Stays completed",
                },
                { label: "TOTAL SPENT", value: "Ar 42,500", prefix: true },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2"
                >
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-serif font-black",
                      stat.active ? "text-[#3496f8]" : "text-gray-900",
                      stat.prefix && "font-currency",
                    )}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Tab Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2 p-1 bg-white border border-gray-100 rounded-xl w-fit">
                {[
                  { id: "All", label: `All (${allBookings.length})` },
                  {
                    id: "Upcoming",
                    label: `Upcoming (${allBookings.filter((b) => b.status === "upcoming" || b.status === "confirmed").length})`,
                  },
                  {
                    id: "Completed",
                    label: `Completed (${allBookings.filter((b) => b.status === "completed").length})`,
                  },
                  {
                    id: "Cancelled",
                    label: `Cancelled (${allBookings.filter((b) => b.status === "cancelled").length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-[#2d9e4f] text-white shadow-md"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                  Sort:
                </span>
                <select className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 outline-none shadow-sm cursor-pointer min-w-[160px]">
                  <option>Most recent</option>
                  <option>Older first</option>
                </select>
              </div>
            </div>

            {/* Booking List */}
            <div className="space-y-6">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-700"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Card Image */}
                      <div className="relative w-full md:w-[320px] h-[240px] md:h-auto overflow-hidden shrink-0">
                        <Image
                          src={booking.image}
                          alt={booking.hotelName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                      </div>

                      {/* Card Details */}
                      <div className="flex-1 p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8">
                        <div className="space-y-6">
                          <div className="space-y-1">
                            <h4 className="text-[22px] font-serif font-black text-gray-900 leading-tight group-hover:text-[#2d9e4f] transition-colors">
                              {booking.hotelName}
                            </h4>
                            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                              Ref:{" "}
                              <span className="text-gray-600">
                                {booking.ref}
                              </span>
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                <Calendar size={14} className="text-gray-400" />{" "}
                                {booking.dates}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                <Users size={14} className="text-gray-400" />{" "}
                                {booking.details}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                              <MapPin size={14} className="text-gray-400" />{" "}
                              {booking.location}
                            </div>
                            <p className="text-[13px] text-gray-400 font-medium">
                              {booking.specialRef} · {booking.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-between text-left md:text-right">
                          <div
                            className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                              booking.status === "confirmed"
                                ? "bg-[#eaf7ee] text-[#2d9e4f] border-[#d2ead6]"
                                : booking.status === "upcoming"
                                  ? "bg-[#eff6ff] text-[#3496f8] border-blue-50"
                                  : booking.status === "completed"
                                    ? "bg-gray-100 text-gray-400 border-gray-200"
                                    : "bg-[#fff2f2] text-[#ef4444] border-[#ffe4e4]",
                            )}
                          >
                            {booking.status === "confirmed" && "✓ Confirmed"}
                            {booking.status === "upcoming" && "● Upcoming"}
                            {booking.status === "completed" && "Completed"}
                            {booking.status === "cancelled" && "✕ Cancelled"}
                          </div>
                          <div className="space-y-0.5 mt-6 md:mt-0">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                              {booking.status === "cancelled"
                                ? "Refunded"
                                : "Total paid"}
                            </p>
                            <p className="text-[24px] font-serif font-black text-[#2d9e3f] font-currency">
                              {booking.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                            {booking.status === "completed" ? (
                              <>
                                <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:border-[#2d9e4f] shadow-sm transition-all">
                                  <Eye size={14} /> View
                                </button>
                                <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:border-[#2d9e4f] shadow-sm transition-all">
                                  <Star size={14} /> Review
                                </button>
                                <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:border-[#2d9e4f] shadow-sm transition-all">
                                  <RefreshCw size={14} /> Rebook
                                </button>
                              </>
                            ) : booking.status === "cancelled" ? (
                              <>
                                <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:border-[#2d9e4f] shadow-sm transition-all">
                                  <Settings size={14} /> Details
                                </button>
                                <button className="flex items-center gap-2 bg-[#2d9e4f] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#208442] shadow-xl shadow-green-50 transition-all">
                                  <RefreshCw size={14} /> Rebook
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:border-[#2d9e4f] shadow-sm transition-all">
                                  <Eye size={14} /> View
                                </button>
                                <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:border-[#2d9e4f] shadow-sm transition-all">
                                  <Download size={14} /> PDF
                                </button>
                                <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:border-red-400 shadow-sm transition-all">
                                  <XCircle size={14} /> Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Bar */}
                    <div className="px-10 py-3 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex gap-6 items-center">
                        <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                          <CreditCard size={12} />{" "}
                          {booking.paymentMethod === "Paid via Credit Card"
                            ? "Visa •••• 4821"
                            : "Secure payment · MVola"}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                          <FileText size={12} />{" "}
                          {booking.status === "cancelled"
                            ? "Cancellation email sent"
                            : "Confirmation sent by email & SMS"}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                          booking.status === "confirmed"
                            ? "bg-[#eaf7ee] text-[#2d9e4f]"
                            : booking.status === "upcoming"
                              ? "bg-[#eff6ff] text-[#3496f8]"
                              : "bg-gray-200 text-gray-500",
                        )}
                      >
                        {booking.timeLabel}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[1.5rem] p-12 text-center border border-gray-100 space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <ClipboardList size={32} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-serif font-black text-gray-900">
                      No bookings found
                    </h4>
                    <p className="text-sm text-gray-400 font-medium">
                      Try changing your filters or browse our destinations to
                      start a new trip.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
