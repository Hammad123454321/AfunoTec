"use client";

import React from "react";
import Image from "next/image";
import { Users, MapPin, Bed, ChevronRight, BedDouble } from "lucide-react";
import Heading from "@/components/Heading";
import Container from "@/components/layout/Container";

interface Room {
  name: string;
  image: string;
  maxOccupancy: string;
  area: string;
  bedding: string;
}

const defaultRooms: Room[] = [
  {
    name: "Standard Room",
    image: "/standardRoom.png",
    maxOccupancy: "2 adults + 2 children",
    area: "29 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Deluxe Suite",
    image: "/deluxeRoom.png",
    maxOccupancy: "3 adults + 1 child",
    area: "42 m²",
    bedding: "1 Super King size bed",
  },
  {
    name: "Family Garden View",
    image: "/heroImage1.png",
    maxOccupancy: "4 adults + 2 children",
    area: "56 m²",
    bedding: "2 King size beds",
  },
];

export default function DiscoverRooms({ rooms = defaultRooms }) {
  return (
    <section id="rooms" className="py-20 scroll-mt-24">
      <Container>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm">
            <BedDouble size={22} />
          </div>
          <Heading as="h3" size="h4" className="font-serif">
            <span className="text-gray-900">Discover </span>
            <span className="text-red-500">Rooms</span>
          </Heading>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="group flex flex-col md:flex-row bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Room Image */}
              <div className="md:w-[400px] h-[280px] md:h-auto overflow-hidden relative shrink-0">
                <Image
                  src={room.image}
                  fill
                  alt={room.name}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Room Details */}
              <div className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-serif font-semibold text-[#00a6e6] mb-6 tracking-tight">
                    {room.name}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Users size={20} className="text-[#2d9e4f] mb-1" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Occupancy
                      </span>
                      <p className="text-sm font-semibold text-gray-800">
                        {room.maxOccupancy}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <MapPin size={20} className="text-[#3b82f6] mb-1" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Dimension
                      </span>
                      <p className="text-sm font-semibold text-gray-800">
                        {room.area}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Bed size={20} className="text-[#ef4444] mb-1" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Bedding
                      </span>
                      <p className="text-sm font-semibold text-gray-800">
                        {room.bedding}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="flex items-center justify-between w-full sm:w-fit px-8 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all transform hover:translate-x-2 shadow-lg hover:shadow-red-200">
                  <span>View Room Details</span>
                  <ChevronRight size={20} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
