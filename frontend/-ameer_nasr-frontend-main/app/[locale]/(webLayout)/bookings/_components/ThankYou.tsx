import Link from "next/link";
import React from "react";

interface ThankYouProps {
  handleGoHome: () => void;
}

const ThankYou = ({ handleGoHome }: ThankYouProps) => {
  return (
    <div className="text-center">
      {/* Celebration Icon */}
      <div className="mb-8 relative inline-block">
        <div className="w-32 h-32 mx-auto relative">
          {/* Party Popper */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              {/* Confetti pieces */}
              <rect
                x="75"
                y="15"
                width="6"
                height="6"
                fill="#EF4444"
                transform="rotate(45 75 15)"
              />
              <rect
                x="90"
                y="10"
                width="8"
                height="8"
                fill="#F59E0B"
                transform="rotate(20 90 10)"
              />
              <circle cx="95" cy="25" r="3" fill="#10B981" />
              <rect x="30" y="20" width="5" height="5" fill="#F59E0B" />
              <circle cx="25" cy="12" r="2.5" fill="#EF4444" />
              <rect
                x="105"
                y="35"
                width="6"
                height="6"
                fill="#EF4444"
                transform="rotate(30 105 35)"
              />

              {/* Streamers */}
              <path
                d="M 85 30 Q 90 40, 95 50"
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 75 25 Q 78 38, 80 52"
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 95 28 Q 100 42, 102 58"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 35 25 Q 32 38, 30 52"
                stroke="#8B5CF6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />

              {/* Party Popper Cone */}
              <path d="M 40 95 L 55 50 L 70 95 Z" fill="#EF4444" />
              <ellipse cx="55" cy="95" rx="15" ry="5" fill="#DC2626" />

              {/* Popper details */}
              <circle cx="48" cy="70" r="2.5" fill="#FEF3C7" />
              <circle cx="55" cy="78" r="2.5" fill="#FEF3C7" />
              <circle cx="62" cy="70" r="2.5" fill="#FEF3C7" />
              <circle cx="52" cy="85" r="2" fill="#FEF3C7" />
              <circle cx="58" cy="85" r="2" fill="#FEF3C7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Thank You Text */}
      <h1 className="text-4xl font-semibold text-green-500 mb-4">Thank You</h1>

      {/* Success Message */}
      <h2 className="text-xl font-semibold text-green-600 mb-6">
        Payment Done Successfully
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-8 px-4">
        A confirmation email has been sent with your details. We look forward to
        serving you. Have a great day!
      </p>

      {/* Go to Home Button */}
      <Link
        href={"/"}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded transition-colors inline-flex items-center gap-2"
      >
        Go to Home
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M6 12L10 8L6 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
};

export default ThankYou;
