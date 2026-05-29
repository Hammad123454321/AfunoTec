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
              Best Prices
            </h3>
            <p className="text-sm text-gray-700">Best Price</p>
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
              Service
            </h3>
            <p className="text-sm text-gray-700">Local Dedicated Teams...</p>
          </div>

          {/* Local */}
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
            <h3 className="text-lg font-semibold mb-2 text-red-600">Local</h3>
            <p className="text-sm text-gray-700">100% Malagasy</p>
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
              All in One
            </h3>
            <p className="text-sm text-gray-700">Hotels & activities</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsWithIcons;
