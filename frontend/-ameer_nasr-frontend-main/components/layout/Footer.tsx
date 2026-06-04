import { socialPaths } from "@/paths";
import Link from "next/link";
import { BsTelephone } from "react-icons/bs";
import {
  FaCcAmex,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaYoutube,
} from "react-icons/fa";

const socialIcons = {
  facebook: <FaFacebookF className="text-2xl text-blue-500" />,
  instagram: (
    <FaInstagram className="text-2xl bg-[linear-gradient(to_right,#405de6,#833ab4,#c13584,#e1306c)] text-white" />
  ),
  youtube: <FaYoutube className="text-2xl text-red-500" />,
  map: <FaMapMarkerAlt />,
  email: <FaEnvelope />,
  phone: <BsTelephone />,
};

// Contact Information.
// TODO(client): the address / phone numbers / email below are placeholders.
// Replace once the client provides the real AfunoTec contact details.
const CONTACT_INFO = {
  address: {
    line1: "TODO: AfunoTec head office",
    line2: "TODO: street + city",
    postalCode: "TODO",
  },
  phone: {
    business: "269 1500",
    hotline: "5256 6138",
  },
  email: "info@afunotec.com",
  hours: {
    weekday: { label: "Monday - Friday", time: "08h00 - 20h00" },
    saturday: { label: "Saturday", time: "08h00 - 16h00" },
    sunday: { label: "Sunday", time: "08h00 - 13h00", note: "(Office Closed)" },
  },
};

// Footer Links
const FOOTER_LINKS = {
  categories: [
    "Stay",
    "Thing to do",
    "TOURS & ECO TOURISM",
    "Travel deal",
    "Car rental and transportation services",
    "Nosy be",
    "Corporate deal",
    "Workplaces",
    "Event",
  ],
  additional: [
    "About Us",
    "Contact Us",
    "Why are we the best?",
    "FAQs",
    "Video Tutorials",
    { text: "afunotec.com by AfunoTec", link: "https://afunotec.com" },
    "Corporate Deals",
    "Madagascar blogs",
    "Influencer Program",
  ],
  legal: [
    "Terms & Conditions",
    "Cookie Policy",
    "Cancellation policy",
    "Cyclone Protocol",
    "Privacy Policy",
  ],
};

// Company Information.
// TODO(client): trading name + registration number need to be confirmed.
const COMPANY_INFO = {
  name: "AfunoTec",
  registrationNumber: "TODO",
  tradingName: "AfunoTec Ltd",
};

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(110deg,#1f9d51_0%,#43bd78_30%,#f3c5d2_72%,#f5a8bc_100%)] text-white">
      {/* Newsletter Section */}
      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="text-base md:text-lg font-semibold uppercase md:px-8 lg:px-16 text-center md:text-left">
            Sign Up For Our Newsletter
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch gap-2">
            <input
              type="email"
              placeholder="Email Address"
              className="px-4 py-2 text-black border border-gray-300 w-full md:w-[300px] bg-white"
              aria-label="Email address"
            />
            <button
              type="button"
              className="bg-[#00bfa4] text-black px-6 py-2 font-semibold whitespace-nowrap cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 sm:gap-8 xl:gap-12 mb-8 sm:mb-12">
            {/* Column 1 - All Categories */}
            <div>
              <div className="font-semibold mb-3 uppercase text-base ">
                All Categories
              </div>
              <hr className="w-9 border-t-2 border-[#03aa94] mb-4" />
              <ul className="space-y-2 list-disc pl-5 ">
                {FOOTER_LINKS.categories.map((item, index) => (
                  <li key={index}>
                    <span className="hover:bg-[#00bfa4] px-3 hover:text-white py-2 cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 - Additional Information */}
            <div>
              <div className="font-semibold mb-3 uppercase text-base ">
                Additional Information
              </div>
              <hr className="w-9 border-t-2 border-[#03aa94] mb-4" />
              <ul className="space-y-2 list-disc pl-5 ">
                {FOOTER_LINKS.additional.map((item, index) =>
                  typeof item === "string" ? (
                    <li key={index}>
                      <span className="hover:bg-[#00bfa4] my-5 px-3 hover:text-white py-2 cursor-pointer">
                        {item}
                      </span>
                    </li>
                  ) : (
                    <li key={index}>
                      <a
                        href={item.link}
                        className="underline hover:text-blue-300"
                      >
                        {item.text}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Column 3 - Legal Information */}
            <div>
              <div className="font-semibold mb-3 uppercase text-base ">
                Legal Information
              </div>
              <hr className="w-9 border-t-2 border-[#03aa94] mb-4" />
              <ul className="space-y-2 list-disc pl-5 ">
                {FOOTER_LINKS.legal.map((item, index) => (
                  <li key={index}>
                    <span className="hover:bg-[#00bfa4] my-5 px-3 hover:text-white py-2 cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Contact Form */}
            <div className="sm:col-span-2 xl:col-span-2">
              <div className="font-semibold mb-3 uppercase text-base ">
                Send Us A Message
              </div>
              <hr className="w-9 border-t-2 border-[#03aa94] mb-4" />
              <div className="text-white/85 mb-4">
                Feel free to contact us by phone, email or by our contact form
              </div>
              <div className="space-y-3 max-w-2xl">
                <input
                  type="text"
                  placeholder="Your Name*"
                  className="w-full px-4 py-2 bg-white text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#00bfa4]"
                  aria-label="Your Name"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Telephone"
                  className="w-full px-4 py-2 bg-white text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#00bfa4]"
                  aria-label="Your Telephone"
                />
                <input
                  type="email"
                  placeholder="Your Email*"
                  className="w-full px-4 py-2 bg-white text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#00bfa4]"
                  aria-label="Your Email"
                  required
                />
                <textarea
                  placeholder="Type your message here...*"
                  className="w-full px-4 py-2 bg-white text-[#404040] h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#00bfa4]"
                  aria-label="Your Message"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="bg-[#00bfa4] text-black px-6 py-2  font-semibold transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="mb-10">
            <div className="font-semibold mb-3 uppercase text-base ">
              Contact Details
            </div>
            <hr className="w-9 border-t-2 border-[#03aa94] mb-6" />
            <div className="flex flex-col lg:flex-row gap-6 justify-between">
              <div className="px-0 sm:px-6 py-4 sm:py-8 max-w-2xl">
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      {CONTACT_INFO.address.line1}, {CONTACT_INFO.address.line2}
                      , {CONTACT_INFO.address.postalCode}
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex items-start gap-3">
                    <BsTelephone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div>
                        <strong className="">Tel (business hours):</strong>{" "}
                        {CONTACT_INFO.phone.business}
                      </div>
                      <div>
                        <strong className="">Tel (Hotline):</strong>{" "}
                        {CONTACT_INFO.phone.hotline}
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="pl-8 space-y-1">
                    <div>
                      <strong className="">
                        {CONTACT_INFO.hours.weekday.label}:
                      </strong>{" "}
                      {CONTACT_INFO.hours.weekday.time}
                    </div>
                    <div>
                      <strong className="">
                        {CONTACT_INFO.hours.saturday.label}:
                      </strong>{" "}
                      {CONTACT_INFO.hours.saturday.time}
                    </div>
                    <div>
                      <strong className="">
                        {CONTACT_INFO.hours.sunday.label}:
                      </strong>{" "}
                      {CONTACT_INFO.hours.sunday.time}{" "}
                      {CONTACT_INFO.hours.sunday.note}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="w-5 h-5 flex-shrink-0" />
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="hover:text-blue-300"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-4 text-sm text-white/85">
                <div className="pb-1 text-white text-lg sm:text-xl">Stay connected</div>
                <div className="flex items-center gap-4 flex-wrap">
                  {Object.entries(socialPaths).map(([social, href]) => (
                    <Link
                      key={social}
                      href={href()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label={social}
                    >
                      {socialIcons[social as keyof typeof socialIcons]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom — copyright on the left, accepted payment
              methods on the right per the Figma. Icons use brand glyphs
              from react-icons/fa so we don't ship raw SVGs. */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center justify-between pt-8 border-t border-white/30">
            <div className="text-xs text-white/80 text-center lg:text-left">
              © {new Date().getFullYear()} {COMPANY_INFO.name}, a Registered
              Tour Operator (No. {COMPANY_INFO.registrationNumber}), Trading as{" "}
              {COMPANY_INFO.tradingName}
            </div>
            <div
              className="flex items-center gap-3 text-white"
              aria-label="Accepted payment methods"
            >
              <FaCcVisa className="text-3xl" aria-label="Visa" />
              <FaCcMastercard className="text-3xl" aria-label="Mastercard" />
              <FaCcAmex className="text-3xl" aria-label="American Express" />
              <FaCcPaypal className="text-3xl" aria-label="PayPal" />
              <FaMobileAlt
                className="text-2xl"
                aria-label="Mobile money (Mvola / Airtel Money / Orange Money)"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
