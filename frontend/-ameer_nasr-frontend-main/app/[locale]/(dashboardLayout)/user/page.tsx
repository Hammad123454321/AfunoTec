import React from "react";
import { ClipboardList, Heart, Tag, Gift } from "lucide-react";

export default function DealsDashboard() {
  const quickActions = [
    {
      id: 1,
      title: "Order Details",
      icon: ClipboardList,
      color: "bg-gradient-to-br from-red-700 to-red-900",
      path: "/orders",
    },
    {
      id: 2,
      title: "My Wishlist",
      icon: Heart,
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      path: "/wishlist",
    },
    {
      id: 3,
      title: "My Coupon",
      icon: Tag,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      path: "/coupons",
    },
    {
      id: 4,
      title: "Gift Card",
      icon: Gift,
      color: "bg-gradient-to-br from-green-600 to-green-700",
      path: "/gift-cards",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className={`${action.color} text-white rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center gap-3`}
            >
              <IconComponent size={40} strokeWidth={2} />
              <span className="text-lg font-semibold">{action.title}</span>
            </button>
          );
        })}
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-12">
        <h1 className="text-4xl font-semibold text-gray-900 text-center mb-12">
          Welcome to your <span className="text-gray-900">baodeal.net</span>{" "}
          account
        </h1>

        {/* Illustration */}
        <div className="flex justify-center">
          <svg viewBox="0 0 1200 600" className="w-full max-w-4xl">
            {/* Background circles */}
            <circle cx="200" cy="300" r="150" fill="#E8F4FF" opacity="0.6" />
            <circle cx="1000" cy="350" r="180" fill="#E8F4FF" opacity="0.6" />

            {/* Left person sitting with shopping bag */}
            <g transform="translate(150, 380)">
              <rect
                x="20"
                y="50"
                width="60"
                height="70"
                rx="8"
                fill="#5B9FED"
              />
              <circle cx="35" cy="30" r="18" fill="#FFB87D" />
              <rect
                x="-10"
                y="50"
                width="30"
                height="50"
                rx="6"
                fill="#FF9966"
              />
              <rect x="0" y="100" width="15" height="30" fill="#CC6633" />
              <rect x="20" y="100" width="15" height="30" fill="#CC6633" />
            </g>

            {/* Shopping bag (left) */}
            <g transform="translate(200, 450)">
              <rect x="0" y="10" width="40" height="45" rx="4" fill="#5B9FED" />
              <path
                d="M 10 10 Q 20 -5 30 10"
                stroke="#5B9FED"
                strokeWidth="3"
                fill="none"
              />
            </g>

            {/* Star icon (left) */}
            <g transform="translate(250, 330)">
              <rect x="0" y="0" width="60" height="60" rx="12" fill="#FFB84D" />
              <path
                d="M 30 15 L 35 25 L 45 25 L 37 32 L 40 42 L 30 36 L 20 42 L 23 32 L 15 25 L 25 25 Z"
                fill="white"
              />
              <circle cx="35" cy="75" r="3" fill="#FFB84D" opacity="0.5" />
              <circle cx="30" cy="85" r="2" fill="#FFB84D" opacity="0.3" />
            </g>

            {/* Second person with box */}
            <g transform="translate(380, 380)">
              <rect
                x="20"
                y="50"
                width="50"
                height="80"
                rx="6"
                fill="#7DD3D3"
              />
              <circle cx="45" cy="35" r="16" fill="#FFB87D" />
              <rect
                x="70"
                y="60"
                width="35"
                height="30"
                rx="4"
                fill="#FF9966"
              />
              <rect x="20" y="130" width="15" height="30" fill="#4A5568" />
              <rect x="40" y="130" width="15" height="30" fill="#4A5568" />
            </g>

            {/* Heart icon */}
            <g transform="translate(340, 290)">
              <rect x="0" y="0" width="60" height="60" rx="12" fill="#E63E7D" />
              <path
                d="M 30 40 L 20 28 Q 15 23 20 18 Q 25 13 30 18 Q 35 13 40 18 Q 45 23 40 28 Z"
                fill="white"
              />
            </g>

            {/* Gift/Discount bubble */}
            <g transform="translate(480, 250)">
              <rect x="0" y="0" width="90" height="70" rx="12" fill="#AED581" />
              <rect x="20" y="15" width="25" height="25" rx="3" fill="white" />
              <path
                d="M 32 25 L 32 15 M 27 25 L 37 25"
                stroke="#AED581"
                strokeWidth="2"
              />
              <text x="52" y="35" fontSize="24" fill="white" fontWeight="bold">
                %
              </text>
              <circle cx="15" cy="85" r="4" fill="#AED581" opacity="0.5" />
              <circle cx="25" cy="95" r="3" fill="#AED581" opacity="0.3" />
            </g>

            {/* Central person */}
            <g transform="translate(550, 350)">
              <rect
                x="20"
                y="60"
                width="60"
                height="100"
                rx="8"
                fill="#FF9966"
              />
              <circle cx="50" cy="40" r="20" fill="#D4695B" />
              <rect x="0" y="60" width="30" height="60" rx="6" fill="#7DD3D3" />
              <rect x="20" y="160" width="20" height="40" fill="#4A5568" />
              <rect x="45" y="160" width="20" height="40" fill="#4A5568" />
            </g>

            {/* Large phone/tablet */}
            <g transform="translate(750, 240)">
              <rect
                x="0"
                y="0"
                width="180"
                height="300"
                rx="12"
                fill="#5B9FED"
              />
              <rect x="8" y="8" width="164" height="240" rx="6" fill="white" />

              {/* Shopping bag on screen */}
              <g transform="translate(50, 60)">
                <rect
                  x="0"
                  y="20"
                  width="80"
                  height="90"
                  rx="6"
                  fill="#FF9966"
                />
                <path
                  d="M 20 20 Q 40 0 60 20"
                  stroke="#FF9966"
                  strokeWidth="4"
                  fill="none"
                />
                <text
                  x="25"
                  y="75"
                  fontSize="36"
                  fill="white"
                  fontWeight="bold"
                >
                  %
                </text>
              </g>

              {/* Lines representing text */}
              <rect
                x="20"
                y="180"
                width="80"
                height="4"
                rx="2"
                fill="#5B9FED"
                opacity="0.3"
              />
              <rect
                x="20"
                y="195"
                width="60"
                height="4"
                rx="2"
                fill="#5B9FED"
                opacity="0.3"
              />

              {/* Checkmark */}
              <g transform="translate(50, 210)">
                <circle cx="0" cy="0" r="30" fill="#5B9FED" opacity="0.2" />
                <path
                  d="M -12 0 L -5 10 L 12 -10"
                  stroke="#5B9FED"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Home button */}
              <circle cx="90" cy="280" r="8" fill="#4A5568" opacity="0.3" />
            </g>

            {/* Plant decoration */}
            <g transform="translate(680, 480)">
              <ellipse
                cx="0"
                cy="20"
                rx="35"
                ry="15"
                fill="#AED581"
                opacity="0.6"
              />
              <ellipse
                cx="-20"
                cy="0"
                rx="30"
                ry="40"
                fill="#AED581"
                opacity="0.8"
              />
              <ellipse
                cx="20"
                cy="5"
                rx="25"
                ry="35"
                fill="#AED581"
                opacity="0.7"
              />
            </g>

            {/* Right person with phone */}
            <g transform="translate(950, 400)">
              <rect
                x="20"
                y="60"
                width="55"
                height="80"
                rx="6"
                fill="#4A5568"
              />
              <circle cx="47" cy="40" r="18" fill="#FFB87D" />
              <rect
                x="75"
                y="80"
                width="18"
                height="28"
                rx="3"
                fill="#E8F4FF"
              />
              <rect x="0" y="60" width="30" height="55" rx="6" fill="#5B9FED" />
              <rect x="25" y="140" width="18" height="35" fill="#2D3748" />
              <rect x="45" y="140" width="18" height="35" fill="#2D3748" />
            </g>

            {/* Credit card icon */}
            <g transform="translate(1050, 320)">
              <rect x="0" y="0" width="80" height="60" rx="12" fill="#E8F4FF" />
              <rect
                x="10"
                y="15"
                width="60"
                height="35"
                rx="6"
                fill="#FFB84D"
              />
              <rect x="15" y="20" width="50" height="8" fill="#FF9966" />
              <circle cx="25" cy="38" r="4" fill="white" />
              <circle cx="35" cy="75" r="3" fill="#FFB84D" opacity="0.5" />
              <circle cx="45" cy="85" r="2" fill="#FFB84D" opacity="0.3" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
