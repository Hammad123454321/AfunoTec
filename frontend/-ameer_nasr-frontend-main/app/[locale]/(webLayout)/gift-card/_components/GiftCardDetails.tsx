import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface GiftCardFeature {
  text: string;
}

interface GiftCardDetailsProps {
  iconSrc?: string;
  iconAlt?: string;
  features?: GiftCardFeature[];
  bgColor?: string;
  accentColor?: string;
}

// Default data for testing
const defaultFeatures: GiftCardFeature[] = [
  { text: "The baodeal.net Gift Card has 1 year of validity" },
  {
    text: "Redeemable towards over 500 amazing offers, discount deals and unique flash promos",
  },
  {
    text: "Instant confirmation of each gift voucher with immediate delivery by email",
  },
  {
    text: "Schedule the delivery date of each Gift Card to be sent automatically on the desired date",
  },
  {
    text: "You can purchase more than one gift card at a time (just add more recipient / change the quantity)",
  },
];

const GiftCardDetails: React.FC<GiftCardDetailsProps> = ({
  iconSrc = "/light-bulb.png",
  iconAlt = "Gift Card Icon",
  features = defaultFeatures,
  bgColor = "bg-gray-100",
  accentColor = "text-green-600",
}) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto mt-12">
      {/* Background Container */}
      <div className={`${bgColor} flex justify-center p-8 md:p-20 relative`}>
        {/* Floating Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-full shadow-lg">
          <Image
            width={80}
            height={80}
            src={iconSrc}
            alt={iconAlt}
            className="w-16 h-16 md:w-20 md:h-20"
          />
        </div>

        {/* Content Card */}
        <div className="bg-white py-8 px-6 md:py-10 md:px-8 mt-10 rounded-lg shadow-sm max-w-4xl w-full">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3 items-start">
                <Star
                  size={18}
                  className={`${accentColor} flex-shrink-0 mt-1`}
                  fill="currentColor"
                />
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardDetails;
