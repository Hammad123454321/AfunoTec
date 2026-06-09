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
    image: "/heroImage1.png",
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Partial Sea View Room (Lateral)",
    image: "/resort2.png",
    maxOccupancy: "2 Adults + 1 Child",
    area: "31 m²",
    bedding: "1 King size bed or 2 Twin beds",
  },
  {
    name: "Family Room",
    image: "/resort4.jpg",
    maxOccupancy: "4 Adults + 2 Children",
    area: "56 m²",
    bedding: "2 King size beds",
  },
];

// Figma uses a compact row layout per room: small image on the left
// (~25-30% width), three inline stat groups, plus a green "More
// Details" CTA on the right.
export default function DiscoverRooms({
  rooms = defaultRooms,
}: {
  rooms?: Room[];
}) {
  return (
    <section id="rooms" className="py-10 sm:py-14 scroll-mt-24">
      <Container>
        <Heading as="h2" size="h4" weight="bold" className="mb-6 sm:mb-8">
          <span className="uppercase">Discover </span>
          <TextPrimary500>The Rooms</TextPrimary500>
        </Heading>

        <div className="flex flex-col gap-3 sm:gap-4">
          {rooms.map((room) => (
            <article
              key={room.name}
              className="flex flex-col sm:flex-row bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Small fixed-size image */}
              <div className="relative w-full sm:w-40 md:w-44 h-32 sm:h-32 md:h-36 shrink-0 bg-gray-100">
                <Image
                  src={room.image}
                  fill
                  alt={room.name}
                  sizes="(min-width: 768px) 176px, (min-width: 640px) 160px, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Content panel — title, stacked stats, button bottom-left */}
              <div className="flex-1 flex flex-col gap-2 p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  {room.name}
                </h3>

                <dl className="flex flex-col gap-1 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-gray-700">
                    <Users
                      size={14}
                      className="text-emerald-600 shrink-0 mt-0.5"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold">Max Occupancy:</span>{" "}
                      <span className="text-gray-600">{room.maxOccupancy}</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <Maximize
                      size={14}
                      className="text-sky-600 shrink-0 mt-0.5"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold">Area:</span>{" "}
                      <span className="text-gray-600">{room.area}</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <Bed
                      size={14}
                      className="text-rose-500 shrink-0 mt-0.5"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold">Bedding:</span>{" "}
                      <span className="text-gray-600">{room.bedding}</span>
                    </span>
                  </div>
                </dl>

                <button
                  type="button"
                  className="mt-1 self-start inline-flex items-center gap-1 px-4 py-1.5 rounded bg-white border border-rose-500 text-rose-500 text-xs sm:text-sm font-semibold hover:bg-rose-50 transition-colors"
                >
                  More Details
                  <span aria-hidden>›</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
