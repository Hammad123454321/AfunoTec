"use client";
import { useRouter } from "next/navigation";

const EmptyCartPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Content */}
        <div className="text-center px-8 py-12">
          {/* Header Text */}
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
            Your Cart is currently empty
          </h1>
          <p className="text-gray-500 text-base mb-12">
            Looks like you haven&apos;t made your choice yet.
          </p>

          {/* Shopping Cart Illustration */}
          <div className="relative mb-12 flex justify-center">
            <img
              src="/cart.png"
              alt="Empty Shopping Cart"
              className="w-64 h-64 md:w-80 md:h-80 object-contain mx-auto"
            />
          </div>

          {/* Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3.5 px-8 rounded-md transition-colors shadow-sm"
            onClick={() => {
              router.push("/");
            }}
          >
            Go Back to Home Page
          </button>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-200 mt-8"></div>
      </div>
    </div>
  );
};

export default EmptyCartPage;
