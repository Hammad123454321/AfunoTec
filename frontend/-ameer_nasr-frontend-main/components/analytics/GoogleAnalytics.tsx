import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js) loader.
 *
 * Only renders when `NEXT_PUBLIC_GA_ID` is set, so dev / preview /
 * misconfigured environments never ship analytics noise. SPA page
 * views are handled separately by `PageViewTracker.tsx`.
 *
 * Docs: https://developers.google.com/analytics/devguides/collection/ga4
 */
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          // send_page_view: false because PageViewTracker handles SPA
          // navigations explicitly. The initial pageview is fired
          // from there too.
          gtag('config', '${id}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
