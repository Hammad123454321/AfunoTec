"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    // Loosely typed so we don't fight `gtag.js` and `fbevents.js`'s
    // own ambient defs (which we don't pull in to keep the bundle
    // small).
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires GA4 + Facebook Pixel page-view events on every client-side
 * route change. The initial pageview is fired here too, after both
 * SDKs are loaded by their respective `<Script>` tags.
 *
 * Mounted once in the root layout. No-op when the IDs are not
 * configured — `GoogleAnalytics` / `FacebookPixel` simply won't
 * inject the SDK and `window.gtag` / `window.fbq` will be undefined.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (gaId && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
        send_to: gaId,
      });
    }

    if (process.env.NEXT_PUBLIC_FB_PIXEL_ID && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}
