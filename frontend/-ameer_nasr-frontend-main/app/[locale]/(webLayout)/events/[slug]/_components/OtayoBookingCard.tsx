"use client";

/**
 * Events booking card — unlike Stays / Tours which have a full
 * calendar + price builder, Events redirect external booking to
 * Otayo (the regional ticketing partner). The card therefore
 * shows the base price + a single "Book Now" CTA that opens
 * Otayo in a new tab.
 */
type Props = {
  /** Starting per-person price in Ariary. */
  basePrice?: number;
  /** External Otayo booking URL. */
  otayoUrl?: string;
};

export default function OtayoBookingCard({
  basePrice = 9900,
  otayoUrl = "https://www.otayo.com",
}: Props) {
  const formatted = new Intl.NumberFormat("en-US").format(basePrice);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
      {/* Price header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-xs text-gray-500 mb-1">From</p>
        <div className="flex items-baseline gap-2">
          <span className="text-rose-600 text-2xl font-bold leading-none font-currency">
            Rs {formatted}/
          </span>
          <span className="text-gray-700 text-sm">Person</span>
        </div>
      </div>

      {/* Book on Otayo CTA + partner logo */}
      <div className="px-5 py-5 flex flex-col items-center gap-4">
        <a
          href={otayoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded transition-colors"
        >
          Book on Otayo
        </a>

        {/* Otayo logotype — placeholder text mark until the
            real PNG asset ships in /public. */}
        <div className="w-full bg-rose-600 text-white text-center py-3 rounded font-bold italic text-2xl tracking-wide">
          Otayo<span className="text-white/80 text-base font-medium">.com</span>
        </div>

        <a
          href={otayoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded transition-colors"
        >
          Book Now
        </a>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          *Please note that you will be redirected to the otayo website
          to proceed with your booking.
        </p>
      </div>
    </div>
  );
}
