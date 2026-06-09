"use client";
import Container from "@/components/layout/Container";
import { TextPrimary500 } from "@/components/Text";
import RelatedProducts from "@/features/product/components/ProductRelatedCards";
import { productData } from "@/features/product/data";
import { useAppSelector } from "@/redux/hook";
import { Calendar, Heart, Home, MapPin, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmptyCartPage from "./_components/EmptyCart";
import Link from "next/link";
import Image from "next/image";

// Types for API integration
interface BookingDate {
  checkIn: string;
  checkOut: string;
}

interface RoomDetails {
  type: string;
  view: string;
  occupancy: string;
  beds: string;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  location?: string;
  rating?: number;
  dates: BookingDate;
  roomDetails: RoomDetails;
  price: number;
  currency?: string;
}

interface CartSummary {
  subtotal: number;
  discount?: number;
  total: number;
  currency?: string;
}

interface CartData {
  items: CartItem[];
  summary: CartSummary;
}

// Mock API call - Replace with your actual API
const fetchCartData = async (): Promise<CartData | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return null for empty cart, or return cart data
  const hasItems = true; // Change to false to test empty cart

  if (!hasItems) {
    return null;
  }

  return {
    items: [
      {
        id: "1",
        name: "Ria Turquoise Mauritius - All Inclusive",
        image:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=200&fit=crop",
        location: "Belle Mare, East Coast, Mauritius",
        rating: 4.5,
        dates: {
          checkIn: "28th July 2025",
          checkOut: "30th July 2025",
        },
        roomDetails: {
          type: "Standard Room",
          view: "Sea View",
          occupancy: "2 Adult",
          beds: "1 Double + 2 Children",
        },
        price: 8524.274,
        currency: "AED",
      },
    ],
    summary: {
      subtotal: 8524.274,
      total: 8524.274,
      currency: "AED",
    },
  };
};

// Main Cart Component with Items
const CartWithItems = ({
  cartData,
  onRemoveItem,
  onAddToWishlist,
  onApplyCoupon,
  onContinueBooking,
  onContinueShopping,
}: {
  cartData: CartData;
  onRemoveItem: (id: string) => void;
  onAddToWishlist: (id: string) => void;
  onApplyCoupon: (code: string) => void;
  onContinueBooking: () => void;
  onContinueShopping: () => void;
}) => {
  const [couponCode, setCouponCode] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              HOME
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">Your Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            Here are the great deal packages you have added to your cart
          </p>
        </div>

        {/* Alert Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-red-800">
              <strong>Need Assistance?</strong> Not sure about anything?{" "}
              <Link href="#" className="underline font-medium">
                Contact Us
              </Link>
            </p>
          </div>
        </div>

        {/* Cart Items Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Table Header */}
          <div className="bg-green-600 text-white rounded-t-lg">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold">
              <div className="col-span-1">Actions</div>
              <div className="col-span-4">Item Summary</div>
              <div className="col-span-3">Dates</div>
              <div className="col-span-3">Booking Summary</div>
              <div className="col-span-1">Subtotal</div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="divide-y">
            {cartData.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 px-6 py-6 items-start"
              >
                {/* Actions Column */}
                <div className="col-span-1 flex flex-col gap-3">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => onAddToWishlist(item.id)}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
                    title="Add to Wishlist"
                  >
                    <Heart size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                    <Calendar size={18} />
                  </button>
                </div>

                {/* Item Summary Column */}
                <div className="col-span-4 flex gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-green-700 font-semibold mb-1">
                      {item.name}
                    </h3>
                    {item.location && (
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <MapPin size={12} />
                        {item.location}
                      </p>
                    )}
                    {item.rating && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-yellow-500">★★★★★</span>
                        <span className="text-gray-600">Excellent</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates Column */}
                <div className="col-span-3 text-sm">
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs mb-1">Check In:</p>
                    <p className="font-medium">{item.dates.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Check Out:</p>
                    <p className="font-medium">{item.dates.checkOut}</p>
                  </div>
                </div>

                {/* Booking Summary Column */}
                <div className="col-span-3 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <Home
                      size={14}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Room Type:</p>
                      <p className="font-medium">{item.roomDetails.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={14}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-500">View Type:</p>
                      <p className="font-medium">{item.roomDetails.view}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users
                      size={14}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Occupancy:</p>
                      <p className="font-medium">
                        {item.roomDetails.occupancy}
                      </p>
                      <p className="font-medium">{item.roomDetails.beds}</p>
                    </div>
                  </div>
                </div>

                {/* Subtotal Column */}
                <div className="col-span-1 text-right">
                  <p className="text-red-600 font-semibold text-lg font-currency">
                    {item.currency}{" "}
                    {item.price.toLocaleString("en-US", {
                      minimumFractionDigits: 3,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-md">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Enter Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => onApplyCoupon(couponCode)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Bottom Section with Image and Summary */}
        <div className="relative overflow-hidden shadow-lg">
          {/* Background Image */}
          <div
            className="h-96 bg-cover bg-center relative"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop)",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>

            {/* Cart Total Card */}
            <div className="absolute top-6 right-6 bg-white rounded-lg shadow-xl p-6 w-80">
              <div className="border-l-4 border-green-600 pl-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Cart Totals
                </h3>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-2xl font-semibold text-gray-800">
                  <span className="font-currency">{cartData.summary.currency}</span>
                  <span className="font-currency">
                    {cartData.summary.total.toLocaleString("en-US", {
                      minimumFractionDigits: 3,
                    })}
                  </span>
                </div>
                {cartData.summary.discount && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discount:</span>
                    <span className="font-currency">
                      -{cartData.summary.currency} {cartData.summary.discount}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-green-800">
                  Complete this booking for additional savings
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onContinueBooking}
                  className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-3 rounded transition-colors"
                >
                  Continue Booking
                </button>
                <button
                  onClick={onContinueShopping}
                  className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-3 rounded transition-colors"
                >
                  Confirm Shopping
                </button>
              </div>
            </div>

            {/* Floating Help Button */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component that handles API call and conditional rendering
const ShoppingCartPage = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);
  console.log("user", user);

  // Fetch cart data on component mount
  useEffect(() => {
    const loadCartData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCartData();
        setCartData(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartData();
  }, []);

  // API integration handlers
  const handleRemoveItem = async (itemId: string) => {
    // API call to remove item
    console.log("Remove item:", itemId);
    if (!cartData) return;

    const updatedItems = cartData.items.filter((item) => item.id !== itemId);

    if (updatedItems.length === 0) {
      setCartData(null);
    } else {
      setCartData({
        ...cartData,
        items: updatedItems,
      });
    }
  };

  const handleAddToWishlist = async (itemId: string) => {
    // API call to add to wishlist
    console.log("Add to wishlist:", itemId);
  };

  const handleApplyCoupon = async (code: string) => {
    // API call to apply coupon
    console.log("Apply coupon:", code);
  };

  const handleContinueBooking = () => {
    // Navigate to booking page
    console.log("Continue to booking");
  };

  const handleContinueShopping = () => {
    if (!user) {
      router.push("/auth");
    }
    // Navigate to shopping/listing page
    console.log("Continue shopping");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // If cart is empty or null, show EmptyCartPage
  if (!cartData || cartData.items.length === 0) {
    return <EmptyCartPage />;
  }

  // Show cart with items
  return (
    <Container>
      <CartWithItems
        cartData={cartData}
        onRemoveItem={handleRemoveItem}
        onAddToWishlist={handleAddToWishlist}
        onApplyCoupon={handleApplyCoupon}
        onContinueBooking={handleContinueBooking}
        onContinueShopping={handleContinueShopping}
      />
      <RelatedProducts
        title={
          <>
            FLASH OFFERS<TextPrimary500>ON DEALS.MU</TextPrimary500>
          </>
        }
        items={productData}
      />
    </Container>
  );
};

export default ShoppingCartPage;
