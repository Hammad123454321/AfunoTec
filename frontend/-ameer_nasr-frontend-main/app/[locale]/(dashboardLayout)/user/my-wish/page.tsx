"use client";
import React, { useState, useEffect } from "react";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";

// Types
interface WishlistItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

// Mock API function
const fetchWishlist = async (): Promise<WishlistItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      title: "Luxury Beach Resort Package",
      description: "3 Nights stay with breakfast included",
      price: 12500,
      originalPrice: 15000,
      discount: 17,
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      category: "Hotel",
      rating: 4.8,
      reviews: 128,
    },
    {
      id: "2",
      title: "Spa & Wellness Weekend",
      description: "Full body massage and wellness treatments",
      price: 8500,
      originalPrice: 10000,
      discount: 15,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
      category: "Spa",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: "3",
      title: "Adventure Tour Package",
      description: "Mountain hiking and camping experience",
      price: 6500,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
      category: "Activities",
      rating: 4.7,
      reviews: 156,
    },
  ];
};

// Wishlist Item Card
const WishlistCard = ({
  item,
  onRemove,
  onBook,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onBook: (id: string) => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        {/* Image */}
        <div className="w-64 h-48 bg-gray-200 flex-shrink-0">
          <Image
            width={256}
            height={192}
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-2">
                {item.category}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 hover:bg-red-50 rounded-full transition group"
              title="Remove from wishlist"
            >
              <Trash2
                size={20}
                className="text-gray-400 group-hover:text-red-500"
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm font-semibold ml-1">{item.rating}</span>
            </div>
            <span className="text-gray-400 text-sm">
              ({item.reviews} reviews)
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-gray-900">
                  Rs {item.price.toLocaleString()}
                </span>
                {item.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-sm">
                      Rs {item.originalPrice.toLocaleString()}
                    </span>
                    {item.discount && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {item.discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => onBook(item.id)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              <ShoppingCart size={18} />
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State
const EmptyWishlist = () => {
  return (
    <div className="text-center py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">
          You can easily add items to your wishlist by clicking this button:
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-medium">
          <Heart size={20} fill="currentColor" />
          Wishlist
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await fetchWishlist();
      setWishlist(data);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    // In real app: await removeFromWishlist(id);
  };

  const handleBook = (id: string) => {
    console.log("Booking item:", id);
    // Navigate to booking page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-semibold mb-4">My Wishlist</h1>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
            Planning your next getaway? Looking for something to gift your loved
            ones? Or maybe something just caught your eye? The Wishlist makes it
            easier for you to keep track of all the deals and offers you are
            interested in – all conveniently in one place! Whenever the time is
            right, you&apos;re just a click away from booking any of the deals.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} in
                your wishlist
              </h2>
            </div>
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
