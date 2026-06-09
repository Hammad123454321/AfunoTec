import React, { useState } from "react";
import { X, Check, Building2, DollarSign } from "lucide-react";
import ThankYou from "./ThankYou";

export default function PaymentInterface({ guestData }: { guestData: any }) {
  const [selectedCoupon, setSelectedCoupon] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const coupons = [
    { title: "LOREM IPSUM", discount: "UP TO 76% OR $1 7AY PAYMENT" },
    { title: "LOREM IPSUM", discount: "UP TO 76% OR $1 7AY PAYMENT" },
    { title: "LOREM IPSUM", discount: "UP TO 57% OR $1 7AY PAYMENT" },
    { title: "LOREM IPSUM", discount: "UP TO 76% OR $1 7AY PAYMENT" },
  ];

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowThankYou(true);
    }, 3000);
  };

  const handleGoHome = () => {
    setShowThankYou(false);
    setAgreeTerms(false);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <ThankYou handleGoHome={handleGoHome} />
      </div>
    );
  }

  return (
    <div className=" p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row  justify-between gap-6">
        {/* Left Section - Payment Options */}
        <div className="lg:w-3/5">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">
            CHOOSE PAYMENT OPTION
          </h1>

          {/* Coupon Section */}
          <div className="bg-orange-50 p-5 rounded-lg mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              COUPON DISCOUNT APPLIED
            </h2>

            <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm mb-4">
              <span className="font-semibold text-gray-900">LOREM IPSUM</span>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50">
                  <X size={20} className="text-gray-600" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-green-500 rounded hover:bg-green-600">
                  <Check size={20} className="text-white" strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Coupon Grid */}
            <div className="grid grid-cols-2 gap-3">
              {coupons.map((coupon, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCoupon(index)}
                  className={`bg-white rounded-lg p-3.5 cursor-pointer transition-all hover:shadow-md ${
                    selectedCoupon === index ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight">
                    {coupon.discount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Payment Methods */}
          <div className="bg-white rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              OTHER PAYMENT METHODS
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Coupon Is Applied Currently. Please Be Informed That Selecting A
              Different Method Will Cancel This Coupon.
            </p>
          </div>
        </div>

        {/* Right Section - Booking Summary */}
        <div className="lg:w-2/5">
          {/* Hotel Details Card */}
          <div className="bg-white rounded-lg p-5 shadow-sm mb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <Building2 strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    RIU TURQUOISE MAURITIUS
                  </h3>
                  <p className="text-xs text-gray-500">2TRAVELER, 2 NIGHTS</p>
                </div>
              </div>
              <span className="bg-blue-400 text-white text-xs font-semibold px-3 py-1 rounded">
                Details
              </span>
            </div>

            {/* Price Details */}
            <div className="space-y-2.5 border-t pt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                    <DollarSign strokeWidth={1} />
                  </div>
                  <span className="text-sm text-gray-600">HOTEL FARE</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 font-currency">
                  1000AR
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400">%</span>
                  </div>
                  <span className="text-sm text-red-500">DISCOUNT</span>
                </div>
                <span className="text-sm font-semibold text-red-500 font-currency">
                  -100AR
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200">
              <span className="text-sm font-semibold text-gray-900">
                TOTAL PRICE
              </span>
              <span className="text-lg font-semibold text-gray-900 font-currency">0000</span>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                required
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-green-500 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs text-gray-600 cursor-pointer leading-tight"
              >
                I agree to the Terms and Privacy Policy
              </label>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`w-full text-white font-semibold py-3 rounded mt-4 transition-colors cursor-pointer ${
                isProcessing
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
