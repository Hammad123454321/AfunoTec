"use client";

import React from "react";
import { Gift, Clock, Copy, Check, Tag } from "lucide-react";

// Types
interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  isUsed?: boolean;
  category?: string;
}

interface CouponGuideItem {
  type: string;
  howToIdentify: string;
  howToRedeem: string;
}

interface MyCouponsPageProps {
  coupons?: Coupon[];
  isLoading?: boolean;
  onApplyCode?: (code: string) => void;
}

// Utility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Coupon Card Component
const CouponCard: React.FC<{
  coupon: Coupon;
  onApply?: (code: string) => void;
}> = ({ coupon, onApply }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = false; // new Date(coupon.expiryDate) < new Date();

  return (
    <div
      className={cn(
        "relative bg-white rounded-xl border-2 overflow-hidden transition-all",
        isExpired
          ? "border-gray-200 opacity-60"
          : "border-primary-200 hover:shadow-lg hover:border-primary-400",
      )}
    >
      {/* Left Badge */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-white text-center transform -rotate-90">
          <p className="text-xs font-medium whitespace-nowrap">
            {coupon.discount}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="pl-24 pr-6 py-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
              <Tag size={16} className="text-red-500" />
            </div>
            <p className="text-sm text-gray-600">{coupon.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            <span>
              {isExpired ? "Expired" : `Valid till ${coupon.expiryDate}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1"
              disabled={isExpired}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  {coupon.code}
                </>
              )}
            </button>
            {onApply && !isExpired && (
              <button
                onClick={() => onApply(coupon.code)}
                className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Apply Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export function MyCouponsPage({
  coupons = [],
  isLoading = false,
  onApplyCode,
}: MyCouponsPageProps) {
  const guideData: CouponGuideItem[] = [
    {
      type: "Discount Coupon",
      howToIdentify:
        "If you receive a coupon that includes a cash discount, a percentage discount or rupee amount value coupon, this means, that you can benefit from a reduced price when purchasing any of the said packages.",
      howToRedeem:
        "Copy the coupon code and then enter the coupon code on the Cart page for the discount to be applied immediately on your order.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-pink-500 rounded-3xl p-8 text-white overflow-hidden relative">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-semibold mb-4">My Earned Coupons</h1>
              <ul className="space-y-2 text-sm text-primary-50">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Deals our offers you special coupons for special occasions -
                    from birthdays, festive periods or any reason to celebrate.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Benefit from amazing discounts, cash rewards & unique offers
                    with our coupons.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Make sure to check this page for new coupon offers.
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Gift size={200} className="text-white opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gift size={120} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Coupon Section */}
        <div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-blue-500"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-blue-500 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg">
                My Coupon
              </span>
            </div>
          </div>

          {coupons.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <Gift size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No coupons available yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Check back later for exciting offers!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onApply={onApplyCode}
                />
              ))}
            </div>
          )}
        </div>

        {/* How to use Coupons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-200">
            How to use Coupons?
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">
                    Coupon Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    How to identify
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    How to redeem
                  </th>
                </tr>
              </thead>
              <tbody>
                {guideData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-blue-600 font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.howToIdentify}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.howToRedeem}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example Usage
const ExampleUsage: React.FC = () => {
  const sampleCoupons: Coupon[] = [
    {
      id: "1",
      code: "FINFIRST25",
      title: "Plage - Extra Rs 1000 Off",
      description: "Constance Belle Mare",
      discount: "Get 1000 Off",
      expiryDate: "30 Sep 2025",
      category: "travel",
    },
    {
      id: "2",
      code: "SUMMER50",
      title: "Summer Special - 50% Off",
      description: "Valid on all hotel bookings",
      discount: "Save 50%",
      expiryDate: "15 Aug 2025",
      category: "hotel",
    },
    {
      id: "3",
      code: "EXPIRED10",
      title: "Winter Sale - 10% Off",
      description: "All winter packages",
      discount: "Get 10% Off",
      expiryDate: "31 Dec 2023",
      category: "package",
    },
  ];

  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setCoupons(sampleCoupons);
      setLoading(false);
    }, 1500);
  }, []);

  const handleApplyCode = (code: string) => {
    console.log("Applying coupon code:", code);
    alert(`Coupon ${code} applied successfully!`);
  };

  return (
    <MyCouponsPage
      coupons={coupons}
      isLoading={loading}
      onApplyCode={handleApplyCode}
    />
  );
};

export default ExampleUsage;
