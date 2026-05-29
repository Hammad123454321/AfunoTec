"use client";

import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Coffee,
  Plane,
  Info,
  Download,
  Heart,
  ShieldCheck,
  Globe,
  Clock,
  ChevronRight,
  Star,
  Hotel,
  UtensilsCrossed,
  Bus,
  Ship,
  Palmtree,
  Map,
  Leaf,
  Gift,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TravelsPage() {
  return (
    <div className="bg-[#fbfcff] min-h-screen pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=800&fit=crop"
          alt="Mountains"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white space-y-6 max-w-3xl px-4">
          <h1 className="text-6xl md:text-7xl font-serif font-black tracking-tight">
            Travel <span className="text-[#2d9e4f]">Deals</span>
          </h1>
          <p className="text-lg font-medium opacity-90 max-w-xl mx-auto leading-relaxed">
            From the icy expanse to the warm south — top international travel
            packages. Exclusive to Baodeal locals and international visitors.
          </p>

          {/* Floating Search Bar */}
          <div className="mt-12 bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full bg-white rounded-xl h-14 px-5 flex items-center gap-3">
              <MapPin className="text-gray-400" size={18} />
              <div className="flex flex-col items-start translate-y-0.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">
                  Where to?
                </span>
                <select className="bg-transparent text-sm font-semibold text-gray-800 outline-none w-full appearance-none">
                  <option>All Destinations</option>
                </select>
              </div>
            </div>
            <div className="flex-1 w-full bg-white rounded-xl h-14 px-5 flex items-center gap-3">
              <Users className="text-gray-400" size={18} />
              <div className="flex flex-col items-start translate-y-0.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">
                  Category
                </span>
                <select className="bg-transparent text-sm font-semibold text-gray-800 outline-none w-full appearance-none">
                  <option>All Packages</option>
                </select>
              </div>
            </div>
            <button className="w-full md:w-32 bg-[#2d9e4f] text-white h-14 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#268c44] transition-all">
              <Search size={18} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE BY DESTINATION */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center space-y-2 mb-16">
            <h2 className="text-4xl font-serif font-black text-gray-900 tracking-tight">
              Explore by <span className="text-[#2d9e4f]">destination</span>
            </h2>
            <p className="text-gray-500 font-medium tracking-tight">
              Where do you want to go next? Choose from our top destinations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Indian Ocean",
                sub: "Mauritius, Seychelles, Maldives",
                img: "https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=400&h=400&fit=crop",
              },
              {
                name: "Europe",
                sub: "France, Italy, Spain, Portugal",
                img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=400&fit=crop",
              },
              {
                name: "Asia",
                sub: "Thailand, Bali, Japan, China",
                img: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=400&fit=crop",
              },
              {
                name: "Africa",
                sub: "South Africa, Kenya, Tanzania",
                img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=400&fit=crop",
              },
              {
                name: "Cruise",
                sub: "World Cruises, Mediterranean",
                img: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&h=400&fit=crop",
              },
              {
                name: "Rodrigues",
                sub: "The gem of the Indian Ocean",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop",
              },
              {
                name: "Middle East",
                sub: "Dubai, Qatar, Saudi Arabia",
                img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop",
              },
              {
                name: "Americas",
                sub: "USA, Canada, Brazil, Mexico",
                img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=400&fit=crop",
              },
            ].map((dest, idx) => (
              <div
                key={idx}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700"
              >
                <Image
                  src={dest.img}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                  <h4 className="text-xl font-serif font-semibold tracking-tight">
                    {dest.name}
                  </h4>
                  <p className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 uppercase tracking-widest mt-1">
                    {dest.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURED TRAVEL PACKAGES */}
      <section className="py-24">
        <Container>
          <div className="space-y-4 mb-20">
            <h2 className="text-4xl font-serif font-black text-gray-900 tracking-tight leading-none">
              Featured <span className="text-[#2d9e4f]">travel packages</span>
            </h2>
            <p className="text-gray-500 font-medium tracking-tight">
              Baodeal handpicked travel packages from around the world curated
              for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16">
            {[
              {
                badge: "POPULAR",
                cat: "INDIAN OCEAN · RÉUNION",
                title: "Réunion Island Escape — 7 Nights",
                features: [
                  { icon: Plane, tText: "Return flights" },
                  { icon: Hotel, tText: "Hotel" },
                  { icon: UtensilsCrossed, tText: "Half Board" },
                ],
                price: "MGA 45,000",
                desc: "Volcanic landscapes, lush forests, and pristine beaches. Réunion is just next door — and closer to home than you'd imagine.",
                img: "https://images.unsplash.com/photo-1544860707-c352cc5a92e3?w=600&h=400&fit=crop",
              },
              {
                badge: "",
                cat: "EUROPE · FRANCE",
                title: "Europamundo — Grand Europe Tour",
                features: [
                  { icon: Plane, tText: "Return flights" },
                  { icon: Bus, tText: "Coach tour" },
                  { icon: Hotel, tText: "Hotels" },
                  { icon: Coffee, tText: "Breakfast" },
                ],
                oldPrice: "MGA 95,000",
                price: "MGA 78,000",
                desc: "Experience the best of Europe in one unforgettable group tour. Paris, Rome, Barcelona and beyond — curated, comfortable, and affordable.",
                img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
              },
              {
                badge: "BEST SELLER",
                cat: "ASIA · INDONESIA",
                title: "Bali Wellness Retreat — 10 Nights",
                features: [
                  { icon: Plane, tText: "Return flights" },
                  { icon: Palmtree, tText: "Villa" },
                  { icon: Star, tText: "Spa included" },
                  { icon: UtensilsCrossed, tText: "All Inclusive" },
                ],
                price: "MGA 62,000",
                desc: "Reconnect with yourself in the land of the gods. Rice terraces, temples, and spa rituals await in this deeply restorative escape.",
                img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
              },
              {
                badge: "",
                cat: "MIDDLE EAST · UAE",
                title: "Dubai City & Desert — 6 Nights",
                features: [
                  { icon: Plane, tText: "Return flights" },
                  { icon: Hotel, tText: "5-star hotel" },
                  { icon: Map, tText: "Desert safari" },
                ],
                price: "MGA 58,000",
                desc: "From sky-high towers to golden sand dunes — Dubai delivers a contrast unlike anywhere else. Includes a classic evening desert safari.",
                img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
              },
              {
                badge: "NEW",
                cat: "AFRICA · KENYA",
                title: "Kenya Safari & Beach Combo — 12 Nights",
                features: [
                  { icon: Plane, tText: "Return flights" },
                  { icon: MapPin, tText: "Safari" },
                  { icon: Palmtree, tText: "Beach resort" },
                  { icon: UtensilsCrossed, tText: "Full Board" },
                ],
                price: "MGA 82,000",
                desc: "Witness the Big Five in Masai Mara, then unwind on Diani Beach. Africa's greatest contrast — all in one trip.",
                img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop",
              },
              {
                badge: "",
                cat: "CRUISE · INDIAN OCEAN",
                title: "Indian Ocean Cruise — 14 Nights",
                features: [
                  { icon: Ship, tText: "All-inclusive cruise" },
                  { icon: Plane, tText: "Flights" },
                  { icon: MapPin, tText: "5 island stops" },
                ],
                oldPrice: "MGA 120,000",
                price: "MGA 98,000",
                desc: "Set sail from Madagascar and explore the gems of the Indian Ocean — Seychelles, Réunion, Mauritius, Maldives, and Comoros.",
                img: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&h=400&fit=crop",
              },
            ].map((pkg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[1rem] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-2xl transition-all duration-700 flex flex-col"
              >
                <div className="relative h-[250px] overflow-hidden">
                  <Image
                    src={pkg.img}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  {pkg.badge && (
                    <div
                      className={cn(
                        "absolute top-5 left-5 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg shadow-lg",
                        pkg.badge === "NEW"
                          ? "bg-[#3496f8]"
                          : pkg.badge === "BEST SELLER"
                            ? "bg-[#2d9e4f]"
                            : "bg-[#2d9e4f]",
                      )}
                    >
                      {pkg.badge}
                    </div>
                  )}
                  <div className="absolute top-5 right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-200 hover:text-red-500 transition-colors shadow-lg">
                    <Heart size={16} />
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="space-y-4 mb-auto">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#2d9e4f]" />
                      <p className="text-[10px] font-semibold text-[#2d9e4f] uppercase tracking-widest">
                        {pkg.cat}
                      </p>
                    </div>
                    <h4 className="text-[20px] font-serif font-semibold text-gray-900 group-hover:text-[#2d9e4f] transition-colors leading-tight line-clamp-1">
                      {pkg.title}
                    </h4>

                    <div className="flex flex-wrap gap-2 py-1">
                      {pkg.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 bg-[#f8f9fa] px-3 py-1.5 rounded-full border border-gray-100 text-[10px] font-semibold text-gray-400"
                        >
                          <f.icon size={11} /> {f.tText}
                        </div>
                      ))}
                    </div>

                    <p className="text-[13px] text-gray-400 font-normal leading-relaxed line-clamp-2">
                      {pkg.desc}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex justify-between items-end mt-10">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-semibold text-gray-400">
                        As from
                      </p>
                      {pkg.oldPrice && (
                        <p className="text-[11px] font-semibold text-gray-300 line-through leading-none mb-1">
                          {pkg.oldPrice}
                        </p>
                      )}
                      <p className="text-[24px] font-serif font-semibold text-[#2d9e3f] leading-none mb-1">
                        {pkg.price}
                      </p>
                      <p className="text-[10px] font-semibold text-gray-400">
                        /person
                      </p>
                    </div>
                    <Link href={`/en/bookings`} className="mb-0.5">
                      <button className="bg-[#0095da] text-white px-7 py-3.5 rounded-xl font-semibold text-[13px] hover:bg-[#007bbd] shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center gap-2">
                        Book now{" "}
                        <ChevronRight
                          size={16}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. PROMO BANNERS */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[320px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1544084944-15269ec7b5a0?w=1200&h=600&fit=crop"
                alt="Christmas"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-6 left-8 bg-[#3d443f]/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/20">
                <Gift size={12} className="text-amber-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Seasonal deal
                </span>
              </div>
              <div className="absolute inset-x-10 bottom-10 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-4xl font-serif font-black text-white leading-tight">
                    Christmas & <br />
                    New Year packages
                  </h3>
                  <p className="text-[13px] text-white/80 font-medium">
                    Celebrate the season somewhere unforgettable. Limited
                    availability — book early.
                  </p>
                </div>
                <button className="bg-white text-gray-900 px-8 py-3.5 rounded-xl text-sm font-black hover:bg-gray-100 transition-all flex items-center gap-2">
                  View packages <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="relative h-[320px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&h=600&fit=crop"
                alt="Spa"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-6 left-8 bg-[#3d443f]/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/20">
                <Leaf size={12} className="text-[#2d9e4f]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Wellness
                </span>
              </div>
              <div className="absolute inset-x-10 bottom-10 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-4xl font-serif font-black text-white leading-tight">
                    Wellness & <br />
                    spa retreats
                  </h3>
                  <p className="text-[13px] text-white/80 font-medium">
                    Rest, restore, reconnect. Curated wellness journeys across
                    Asia and the Indian Ocean.
                  </p>
                </div>
                <button className="bg-white text-gray-900 px-8 py-3.5 rounded-xl text-sm font-black hover:bg-gray-100 transition-all flex items-center gap-2">
                  Explore retreats <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. EXCEPTIONAL EXPERIENCES (Refined Cards & Spacing) */}
      <section className="py-24 bg-white">
        <Container>
          <div className="space-y-4 mb-20">
            <h2 className="text-4xl font-serif font-black text-gray-900 tracking-tight leading-none">
              Exceptional <span className="text-[#3496f8]">Experiences</span>
            </h2>
            <p className="text-gray-500 font-medium tracking-tight">
              Premium packages — exclusive itineraries for discerning
              travellers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                cat: "ASIA · JAPAN",
                title: "Japan Cultural Discovery — Cherry Blossom Season",
                nights: "14 nights",
                type: "Group tour",
                price: "MGA 110,000",
                img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
              },
              {
                cat: "INDIAN OCEAN · MALDIVES",
                title: "Maldives Overwater Villa — Honeymoon Special",
                nights: "7 nights",
                type: "Couples",
                price: "MGA 130,000",
                img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop",
              },
              {
                cat: "EUROPE · SWITZERLAND",
                title: "Swiss Alps Winter Ski — Family Package",
                nights: "8 nights",
                type: "Family",
                price: "MGA 145,000",
                img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
              },
            ].map((exp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-50 shadow-sm flex flex-col group hover:shadow-2xl transition-all duration-700"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={exp.img}
                    alt={exp.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                <div className="p-8 space-y-6 flex flex-col flex-1">
                  <div className="space-y-4 mb-auto">
                    <p className="text-[10px] font-black text-[#2d9e4f] uppercase tracking-widest">
                      {exp.cat}
                    </p>
                    <h4 className="text-[20px] font-serif font-semibold text-gray-900 leading-tight line-clamp-2">
                      {exp.title}
                    </h4>
                    <div className="flex gap-4 items-center pt-1">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 group-hover:text-[#3496f8] transition-colors">
                        <Plane size={14} className="rotate-45" /> {exp.nights}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 group-hover:text-[#3496f8] transition-colors">
                        <Users size={14} /> {exp.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-8 border-t border-gray-50 mt-10">
                    <p className="text-[22px] font-serif font-semibold text-[#2d9e3f]">
                      {exp.price}{" "}
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest ml-1">
                        / person
                      </span>
                    </p>
                    <button className="bg-[#0095da] text-white px-6 py-3 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-[#007bbd] transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                      Book now <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* BROCHURE BANNER */}
          <div className="mt-20 bg-white rounded-[2.5rem] p-12 border border-gray-50 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-colors">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  EXCEPTIONAL EXPERIENCES 2025-26
                </span>
                <h3 className="text-4xl font-serif font-black text-gray-900 leading-tight">
                  Download our full travel brochure
                </h3>
                <p className="text-[15px] text-gray-500 font-medium">
                  Dozens of curated packages — print and plan at your own pace.
                </p>
              </div>
              <button className="bg-[#1a1a1a] text-white px-12 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black hover:scale-105 transition-all shadow-2xl">
                <Download size={22} className="opacity-80" /> Download PDF
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* WHY BOOK THROUGH BAODEAL (Reduced Space Header & Grid) */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center space-y-3 mb-20">
            <h2 className="text-5xl font-serif font-black text-gray-900 tracking-tight leading-none">
              Why book travel{" "}
              <span className="text-[#2d9e4f]">through Baodeal?</span>
            </h2>
            <p className="text-[15px] text-gray-500 font-medium tracking-tight">
              We&apos;re Madagascar-based, partner-verified, and always on your
              side.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Curated for you",
                desc: "Every travel package is personally selected — from Indian Ocean escapes to long-haul adventures, we pick only the best.",
                color: "bg-[#fff9e6] text-[#f59e0b]",
              },
              {
                icon: MessageSquare,
                title: "Local support team",
                desc: "Have a question before or after booking? Our Madagascar-based team is available by phone, WhatsApp, and email.",
                color: "bg-[#eff6ff] text-[#3496f8]",
              },
              {
                icon: MapPin,
                title: "Made for Malagasy travellers",
                desc: "We understand what Malagasy locals need from a travel experience — and we curate packages accordingly.",
                color: "bg-[#eaf7ee] text-[#2d9e4f]",
              },
              {
                icon: Plane,
                title: "Full trip, one place",
                desc: "Flights, hotels, activities, and transfers — find everything you need for your next journey right here.",
                color: "bg-[#f5f3ff] text-[#8b5cf6]",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-8 hover:shadow-2xl hover:border-gray-50 transition-all duration-500 h-full group"
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500",
                    item.color,
                  )}
                >
                  <item.icon size={26} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
