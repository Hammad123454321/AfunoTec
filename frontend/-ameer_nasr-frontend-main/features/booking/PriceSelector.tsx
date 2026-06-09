"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LucideGift, LucideToggleLeft } from "lucide-react";

interface PricingOption {
  id: string;
  label: string;
  description?: string;
  basePrice: number;
  maxQuantity: number;
  priceMultiplier?: number; // If not provided, uses basePrice * quantity
  customPricing?: { quantity: number; price: number }[]; // For custom pricing tiers
}

interface PricingSelectorProps {
  options?: PricingOption[];
  onSelectionChange?: (selection: Selection) => void;
  title?: string;
  currency?: string;
  showTotal?: boolean;
}

interface Selection {
  [key: string]: number;
}

export default function DynamicPricingSelector({
  options = [
    {
      id: "single-quad",
      label: "Single Quad",
      description: "",
      basePrice: 5500,
      maxQuantity: 5,
    },
    {
      id: "double-quad",
      label: "Double Quad",
      description: "",
      basePrice: 5500,
      maxQuantity: 5,
    },
    {
      id: "single-buggy",
      label: "Single Buggy",
      description: "2 hour Buggy Ride - Discovery Trail",
      basePrice: 6000,
      maxQuantity: 5,
    },
    {
      id: "double-buggy",
      label: "Double Buggy",
      description: "2 hour Buggy Ride - Discovery Trail",
      basePrice: 6000,
      maxQuantity: 5,
    },
  ],
  onSelectionChange,
  title = "Select Your Adventure",
  currency = "Rs",
  showTotal = true,
}: PricingSelectorProps) {
  const [selection, setSelection] = useState<Selection>(
    options.reduce((acc, opt) => ({ ...acc, [opt.id]: 0 }), {}),
  );

  const calculateItemPrice = (option: PricingOption, quantity: number) => {
    if (quantity === 0) return 0;

    // Check for custom pricing tiers
    if (option.customPricing) {
      const tier = option.customPricing.find((t) => t.quantity === quantity);
      return tier ? tier.price : option.basePrice * quantity;
    }

    // Use price multiplier or default to quantity
    const multiplier = option.priceMultiplier || quantity;
    return option.basePrice * multiplier;
  };

  const handleSelectionChange = (optionId: string, value: string) => {
    const newSelection = {
      ...selection,
      [optionId]: parseInt(value),
    };
    setSelection(newSelection);
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  const calculateTotal = () => {
    return options.reduce((total, opt) => {
      const quantity = selection[opt.id] || 0;
      return total + calculateItemPrice(opt, quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selection).reduce((sum, count) => sum + count, 0);
  };

  const formatPrice = (price: number) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded shadow-sm border border-gray-50">
      {/* Header */}
      {title && (
        <div className="px-6 py-4 border-b border-b-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      {/* Options */}
      <div className="divide-y divide-gray-200">
        {options.map((option) => {
          const selectedQuantity = selection[option.id] || 0;
          const itemTotal = calculateItemPrice(option, selectedQuantity);

          return (
            <div
              key={option.id}
              className="px-6 py-5 flex items-center justify-between gap-4"
            >
              {/* Label Section */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {option.label}
                </h3>
                {option.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>

              {/* Select Dropdown */}
              <div className="w-24">
                <Select
                  value={selection[option.id]?.toString() || "0"}
                  onValueChange={(value) =>
                    handleSelectionChange(option.id, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    avoidCollisions
                    sticky="always"
                  >
                    <SelectItem value="0">Select</SelectItem>
                    {[...Array(option.maxQuantity)].map((_, i) => {
                      const qty = i + 1;
                      const price = calculateItemPrice(option, qty);
                      return (
                        <SelectItem key={qty} value={qty.toString()}>
                          {qty} {option.label}
                          {qty > 1 ? "s" : ""} -{" "}
                          <span className="font-currency">
                            {formatPrice(price)}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Section */}
              <div className="w-24 text-right">
                <p className="font-currency text-xl font-semibold text-primary-500">
                  {selectedQuantity > 0
                    ? formatPrice(itemTotal)
                    : formatPrice(option.basePrice)}
                </p>
                {selectedQuantity === 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">per unit</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-5 bg-gray-50 border-t border-t-gray-300 relative before:absolute before:bottom-0 before:left-0 before:right-1/2 before:h-1 before:bg-primary-500 after:absolute after:bottom-0 after:left-1/2 after:right-0 after:h-1 after:bg-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Total Items: {getTotalItems()}
            </p>
            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
              {Object.entries(selection)
                .filter(([_, count]) => count > 0)
                .map(([id, count]) => {
                  const opt = options.find((o) => o.id === id);
                  if (!opt) return null;
                  const price = calculateItemPrice(opt, count);
                  return (
                    <div key={id} className="flex justify-between gap-4">
                      <span>
                        {count}x {opt.label}
                      </span>
                      <span className="font-currency font-medium">{formatPrice(price)}</span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="text-right ml-8">
            <p className="text-sm text-gray-600 font-medium">Total Amount</p>
            <p className="font-currency text-3xl font-semibold text-primary-500">
              {formatPrice(calculateTotal())}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Button className="w-full">Book Now</Button>
          <div className="flex justify-center gap-1 mt-4">
            <div className="size-10 rounded-full flex items-center justify-center bg-blue-500 text-white">
              <LucideGift />
            </div>
            <div className="flex flex-col">
              <span className="text-sm">You will earn</span>
              <strong>0 reward point</strong>
            </div>
          </div>
          <div className="text-xs flex justify-center gap-2 mt-4">
            <div className="flex items-center justify-center gap-2">
              <div className="size-3.5 border border-primary-500" />
              <span className="underline">No booking fees</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="size-3.5 border border-primary-500" />
              <span className="underline">No booking fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage with different data structures
function ExampleUsage() {
  // Example 1: Guest Booking (like your first example)
  const guestOptions: PricingOption[] = [
    {
      id: "adults",
      label: "Adult",
      description: "18+ Years",
      basePrice: 4800,
      maxQuantity: 20,
    },
    {
      id: "teens",
      label: "Teen",
      description: "12 - 17 Years",
      basePrice: 3200,
      maxQuantity: 10,
    },
    {
      id: "children",
      label: "Child",
      description: "4 - 11 Years",
      basePrice: 2600,
      maxQuantity: 10,
    },
    {
      id: "infants",
      label: "Infant",
      description: "0 - 3 Years",
      basePrice: 0,
      maxQuantity: 5,
    },
  ];

  // Example 2: Vehicle Rental (your second example)
  const vehicleOptions: PricingOption[] = [
    {
      id: "single-quad",
      label: "Single Quad",
      basePrice: 5500,
      maxQuantity: 5,
    },
    {
      id: "double-quad",
      label: "Double Quad",
      basePrice: 5500,
      maxQuantity: 5,
    },
    {
      id: "single-buggy",
      label: "Single Buggy",
      description: "2 hour Buggy Ride - Discovery Trail",
      basePrice: 6000,
      maxQuantity: 5,
    },
    {
      id: "double-buggy",
      label: "Double Buggy",
      description: "2 hour Buggy Ride - Discovery Trail",
      basePrice: 6000,
      maxQuantity: 5,
    },
  ];

  // Example 3: Custom Pricing Tiers
  const customPricingOptions: PricingOption[] = [
    {
      id: "premium-package",
      label: "Premium Package",
      description: "Includes all amenities",
      basePrice: 10000,
      maxQuantity: 5,
      customPricing: [
        { quantity: 1, price: 10000 },
        { quantity: 2, price: 18000 }, // Discount for 2
        { quantity: 3, price: 25000 }, // More discount for 3
        { quantity: 4, price: 32000 },
        { quantity: 5, price: 38000 },
      ],
    },
  ];

  const handleSelectionChange = (selection: Selection) => {
    console.log("Selection:", selection);
    // API call here
  };

  return (
    <div className="space-y-8 px-4">
      <DynamicPricingSelector
        title="All Inclusive Day Pass"
        options={guestOptions}
        onSelectionChange={handleSelectionChange}
      />

      {/* <DynamicPricingSelector
        title="Adventure Activities"
        options={vehicleOptions}
        onSelectionChange={handleSelectionChange}
      />

      <DynamicPricingSelector
        title="Premium Packages"
        options={customPricingOptions}
        onSelectionChange={handleSelectionChange}
      /> */}

      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Component Features:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Dynamic pricing based on quantity</li>
          <li>✅ Custom pricing tiers support</li>
          <li>✅ Flexible data structure</li>
          <li>✅ Real-time total calculation</li>
          <li>✅ API-ready with callbacks</li>
          <li>✅ Customizable currency and labels</li>
          <li>✅ Responsive design</li>
        </ul>
      </div> */}
    </div>
  );
}

export { ExampleUsage };
