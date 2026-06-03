import Image from "next/image";
import React from "react";

const WhyChooseUsWithIcons: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-12">
          Why <span className="text-green-600">Choose Us</span>
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Best Prices */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-lg">
              <Image
                src="/Frame.png"
                alt=""
                className="w-8 h-8 text-white"
                width={24}
                height={24}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Best Prices for Locals
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Real Malagasy Rates — Not Tourist Prices. We work directly with hotels, drivers, and activity providers to secure authentic local prices with no inflated costs.
            </p>
          </div>

          {/* Service */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center mb-4 shadow-lg">
              <Image
                src="/service.png"
                alt=""
                className="w-8 h-8 text-white"
                width={24}
                height={24}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-600">
              Customer Service You Can Trust
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Support 7/7 from a Team in Madagascar. Instant help in Malagasy, French, or English. We’re here for booking changes, issues, or travel questions — fast and reliable.
            </p>
          </div>

          {/* Payments */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-lg">
              <Image
                src="/payment.png"
                alt=""
                className="w-8 h-8 text-white"
                width={24}
                height={24}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Safe & Easy Payments</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Secure Online & Mobile Money Payments Only. Pay using Mvola, Airtel Money, Orange Money, or bank cards — safe, fast and fully digital. No cash, no stress.
            </p>
          </div>

          {/* All in One */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center mb-4 shadow-lg">
              <Image
                src="/location.png"
                alt=""
                className="w-8 h-8 text-white"
                width={20}
                height={20}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-600">
              Everything in One Place
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              All Your Travel Needs on One Platform. Hotels, cars, transfers, tours and activities — compare and book everything from one simple, all-in-one booking platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsWithIcons;
