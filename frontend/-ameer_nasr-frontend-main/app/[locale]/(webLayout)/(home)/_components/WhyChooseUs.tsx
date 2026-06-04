import Image from "next/image";
import React from "react";

type Feature = {
  /** Big heading on the colored circle. */
  heading: string;
  /** One-line eyebrow shown right under the heading. */
  eyebrow: string;
  /** Full paragraph beneath the eyebrow. */
  description: string;
  /** Static asset under /public. */
  iconSrc: string;
  /** Tailwind classes for circle + heading color. */
  variant: "red" | "green";
};

const FEATURES: ReadonlyArray<Feature> = [
  {
    heading: "Best Prices for Locals",
    eyebrow: "Real Malagasy Rates — Not Tourist Prices.",
    description:
      "We work directly with hotels, drivers, and activity providers to secure authentic local prices with no inflated costs.",
    iconSrc: "/Frame.png",
    variant: "red",
  },
  {
    heading: "Customer Service You Can Trust",
    eyebrow: "Support 7/7 from a Team in Madagascar.",
    description:
      "Instant help in Malagasy, French, or English. We're here for booking changes, issues, or travel questions — fast and reliable.",
    iconSrc: "/service.png",
    variant: "green",
  },
  {
    heading: "Safe & Easy Payments",
    eyebrow: "Secure Online & Mobile Money Payments Only.",
    description:
      "Pay using Mvola, Airtel Money, Orange Money, or bank cards — safe, fast and fully digital. No cash, no stress.",
    iconSrc: "/payment.png",
    variant: "red",
  },
  {
    heading: "Everything in One Place",
    eyebrow: "All Your Travel Needs on One Platform.",
    description:
      "Hotels, cars, transfers, tours and activities — compare and book everything from one simple, all-in-one booking platform.",
    iconSrc: "/location.png",
    variant: "green",
  },
];

const variantStyles: Record<Feature["variant"], { circle: string; title: string }> = {
  red: { circle: "bg-red-600", title: "text-red-600" },
  green: { circle: "bg-green-600", title: "text-green-600" },
};

const WhyChooseUs: React.FC = () => {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 sm:mb-12">
          Why <span className="text-green-600">Choose Us</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {FEATURES.map((feature) => {
            const styles = variantStyles[feature.variant];
            return (
              <article
                key={feature.heading}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg ${styles.circle}`}
                >
                  <Image
                    src={feature.iconSrc}
                    alt=""
                    className="w-8 h-8 text-white"
                    width={24}
                    height={24}
                  />
                </div>
                <h3
                  className={`text-lg font-semibold mb-2 ${styles.title}`}
                >
                  {feature.heading}
                </h3>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {feature.eyebrow}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
