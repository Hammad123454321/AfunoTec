"use client";

import { Bed, Maximize, Users } from "lucide-react";
import React from "react";

// Define the Room type
interface Room {
  title: string;
  image: string;
  occupancy: string;
  area: number;
  bedding: string;
}

// Define component props type
interface RoomsSectionProps {
  rooms?: Room[];
  onDetailsClick?: (room: Room) => void;
}

const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms = [],
  onDetailsClick,
}) => {
  return (
    <div className="max-w-2xl  py-12">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">
        <span className="text-gray-900">DISCOVER </span>
        <span className="text-green-600 border-b-2 border-green-600">
          THE ROOMS
        </span>
      </h2>

      {/* Rooms List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0"
          >
            {/* Image */}
            <img
              src={room.image}
              alt={room.title}
              className="w-24 h-24 object-cover rounded flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">{room.title}</h3>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-500" />
                  <span>
                    <strong>Max Occupancy:</strong> {room.occupancy}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-red-500" />
                  <span>
                    <strong>Area:</strong> {room.area} M²
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-red-500" />
                  <span>
                    <strong>Bedding:</strong> {room.bedding}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDetailsClick && onDetailsClick(room)}
                className="mt-3 px-4 py-1.5 text-sm text-red-500 border border-red-500 rounded hover:bg-red-50 transition-colors"
              >
                More Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsSection;
