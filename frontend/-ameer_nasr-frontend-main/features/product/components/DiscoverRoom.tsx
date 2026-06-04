"use client";

import React from "react";
import Image from "next/image";
import { Users, Maximize, Bed } from "lucide-react";
import Heading from "@/components/Heading";
import Container from "@/components/layout/Container";
import { TextPrimary500 } from "@/components/Text";

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
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Sea View Room",
    image: "/deluxeRoom.png",
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Partial Sea View Room (Lateral)",
    image: "/heroImage1.png",
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Family Room",
    image: "/standardRoom.png",
    maxOccupancy: "4 Adults + 2 Children",
    area: "56 m²",
    bedding: "2 King size beds",
  },
];

// Figma uses a compact row layout per room: small image on the left
// (~25-30% width), three inline stat groups, plus a green "More
// Details" CTA on the right. No oversized cards.
export default function DiscoverRooms({ rooms = defaultRooms }: { rooms?: Room[] }) {
  return (
    <section id="rooms" className="py-10 sm:py-14 scroll-mt-24">
      <Container>
        <Heading as="h2" size="h4" weight="bold" className="mb-6 sm:mb-8">
          <span className="uppercase">Discover </span>
          <TextPrimary500>The Rooms</TextPrimary500>
        </Heading>

        <div className="flex flex-col gap-4 sm:gap-5">
          {rooms.map((room) => (
            <article
              key={room.name}
              className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image — fixed aspect, compact width */}
              <div className="relative w-full sm:w-48 md:w-56 h-40 sm:h-32 md:h-36 shrink-0">
                <Image
                  src={room.image}
                  fill
                  alt={room.name}
                  sizes="(min-width: 768px) 220px, (min-width: 640px) 192px, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users size={14} className="text-emerald-600 shrink-0" aria-hidden />
                      <span className="font-semibold">Max Occupancy:</span>
                      <span className="text-gray-600">{room.maxOccupancy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Maximize size={14} className="text-sky-600 shrink-0" aria-hidden />
                      <span className="font-semibold">Area:</span>
                      <span className="text-gray-600">{room.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 sm:col-span-3">
                      <Bed size={14} className="text-rose-500 shrink-0" aria-hidden />
                      <span className="font-semibold">Bedding:</span>
                      <span className="text-gray-600">{room.bedding}</span>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  className="self-start sm:self-center shrink-0 inline-flex items-center px-5 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  More Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
