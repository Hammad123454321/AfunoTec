"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { TextPrimary500 } from "@/components/Text";
import HotelSearch from "./HotelSearch";
import ActivitySearch from "./ActivitySearch";
import TourSearch from "./ToursSearch";
import TransportationSearch from "./TransportationSearch";
import MeetingSearch from "./MeetingSearch";
import TravelSearch from "./TravelSearch";
import NosyBeeSearch from "./NosyBeeSearch";
import { cn } from "@/lib/utils";

import {
  Home,
  Clock,
  Mountain,
  Truck,
  Users,
  Star,
  MapPin,
} from "lucide-react";

export default function WebSearch() {
  const [activeTab, setActiveTab] = useState("stays");

  const tabs = [
    {
      id: "stays",
      label: "Hotel, Apartments and Lodges",
      icon: <Home className="w-6 h-6" />,
      color: "bg-green-100 text-green-700",
      component: <HotelSearch />,
    },
    {
      id: "things-to-do",
      label: "Things To Do",
      icon: <Clock className="w-6 h-6" />,
      color: "bg-yellow-50 text-yellow-600",
      component: <ActivitySearch />,
    },
    {
      id: "tour",
      label: "Tours & Eco Tourism",
      icon: <Mountain className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-500",
      component: <TourSearch />,
    },
    {
      id: "travel",
      label: "Travel Deals",
      icon: <Star className="w-6 h-6" />,
      color: "bg-emerald-50 text-emerald-600",
      component: <TravelSearch />,
    },
    {
      id: "transportation",
      label: "Transportation & Car Rental",
      icon: <Truck className="w-6 h-6" />,
      color: "bg-pink-50 text-pink-500",
      component: <TransportationSearch />,
    },
    {
      id: "nosybee",
      label: "Nosy Be",
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-red-50 text-red-500",
      component: <NosyBeeSearch />,
    },
    {
      id: "corporate",
      label: "CORPORATE DEALS",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-500",
      component: <MeetingSearch />,
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || null;

  return (
    <Section
      title={
        <>
          THE BEST DEALS & <TextPrimary500>PROMOTIONS</TextPrimary500>
        </>
      }
      description="Handpicked hotels, villas, and experiences at prices made for locals and visitors alike."
      className="overflow-x-clip"
    >
      <Container>
        {/* Desktop Tabs */}
        <div className="hidden lg:flex justify-center items-center gap-8 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="group flex flex-col items-center gap-3 transition-all cursor-pointer"
            >
              <div
                className={cn(
                  "w-14 h-14 flex items-center justify-center rounded-xl transition-all",
                  tab.color,
                  activeTab === tab.id ? "ring-2 ring-primary-500 ring-offset-2" : "opacity-80 group-hover:opacity-100",
                )}
              >
                {tab.icon}
              </div>
              <span
                className={cn(
                  "text-sm xl:text-base transition-colors",
                  activeTab === tab.id
                    ? "text-primary-500 font-semibold"
                    : "text-gray-600 group-hover:text-primary-500",
                )}
              >
                {tab.label}
              </span>
              <div
                className={cn(
                  "h-[2.5px] w-full bg-primary-500 transition-all duration-300 rounded-full",
                  activeTab === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
                )}
              />
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="block lg:hidden mb-4">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Component */}
        <div className="transition-all duration-300 max-w-5xl mx-auto">
          {ActiveComponent}
        </div>
      </Container>
    </Section>
  );
}
