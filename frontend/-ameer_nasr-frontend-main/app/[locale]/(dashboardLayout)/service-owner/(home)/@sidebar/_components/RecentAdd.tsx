"use client";

import React from "react";
import { Hotel, Plane, Activity, Car } from "lucide-react";
import Heading from "@/components/Heading";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Types
type CategoryType = "hotels" | "tour" | "activities" | "transportation";

interface RecentItem {
  id: string;
  name: string;
  image: string;
  category: CategoryType;
  lastBooked: string;
  bookingsCount: number;
}

interface RecentlyAddedProps {
  title?: string;
  data: RecentItem[];
  isLoading?: boolean;
  className?: string;
  onItemClick?: (item: RecentItem) => void;
}

// Category config
const getCategoryConfig = (category: CategoryType) => {
  const config: Record<
    CategoryType,
    { icon: React.ReactNode; color: string; bg: string }
  > = {
    hotels: {
      icon: <Hotel size={14} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    tour: {
      icon: <Plane size={14} />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    activities: {
      icon: <Activity size={14} />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    transportation: {
      icon: <Car size={14} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  };
  return config[category];
};

// Recently Added Item
export function RecentItem({
  item,
  onClick,
}: {
  item: RecentItem;
  onClick?: (item: RecentItem) => void;
}) {
  const categoryConfig = getCategoryConfig(item.category);

  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
      onClick={() => onClick?.(item)}
    >
      {/* Image */}
      <div className="size-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
        <Image
          width={40}
          height={40}
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23e5e7eb" width="48" height="48"/%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 relative">
          <Heading as="h4" size="sm" weight="normal">
            {item.name}
          </Heading>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium capitalize px-2 py-0.5 rounded absolute top-0 right-0 translate-x-full",
              categoryConfig.color,
              categoryConfig.bg
            )}
          >
            {categoryConfig.icon}
            {item.category}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Last Booked: {item.lastBooked}
        </p>
      </div>

      {/* Bookings Badge */}
      <div className="flex-shrink-0">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {item.bookingsCount} Bookings
        </span>
      </div>
    </div>
  );
}

// Main Component
export function RecentlyAdded({
  title = "Recently Added",
  data = [],
  isLoading = false,
  className = "",
  onItemClick,
}: RecentlyAddedProps) {
  if (isLoading) {
    return (
      <div
        className={cn("bg-white rounded border border-gray-100 p-2", className)}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "bg-white rounded border border-gray-100 p-2 space-y-6",
          className
        )}
      >
        <Heading as="h3" size="h6">
          {title}
        </Heading>
        <p className="text-center text-gray-500 py-8">No recent items</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded border border-gray-100 p-2 space-y-6",
        className
      )}
    >
      <Heading as="h3" size="h6">
        {title}
      </Heading>

      <div className="space-y-1">
        {data.map((item) => (
          <RecentItem key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}

// Example Usage
const ExampleUsage: React.FC = () => {
  const sampleData: RecentItem[] = [
    {
      id: "1",
      name: "The Grand Horizon",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop",
      category: "hotels",
      lastBooked: "25 Apr 2025",
      bookingsCount: 4,
    },
    {
      id: "2",
      name: "Dare DevCon",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&h=100&fit=crop",
      category: "tour",
      lastBooked: "25 Apr 2025",
      bookingsCount: 6,
    },
    {
      id: "3",
      name: "SPINNER DOLPHIN",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop",
      category: "activities",
      lastBooked: "25 Apr 2025",
      bookingsCount: 6,
    },
    {
      id: "4",
      name: "TOYOTA SE 400",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop",
      category: "transportation",
      lastBooked: "25 Apr 2025",
      bookingsCount: 6,
    },
    {
      id: "5",
      name: "TOYOTA SE 400",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop",
      category: "transportation",
      lastBooked: "25 Apr 2025",
      bookingsCount: 6,
    },
  ];

  const [data, setData] = React.useState<RecentItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setData(sampleData);
      setLoading(false);
    }, 1500);
  }, []);

  const handleItemClick = (item: RecentItem) => {
    console.log("Clicked:", item.name);
  };

  return (
    <RecentlyAdded
      title="Recently Added"
      data={data}
      isLoading={loading}
      onItemClick={handleItemClick}
    />
  );
};

export default ExampleUsage;
