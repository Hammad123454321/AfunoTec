import type { Metadata } from "next";

import { DM_Sans, Inter } from "next/font/google";
import { Suspense } from "react";

import GoogleTranslateProvider from "@/components/GlobalTranslateProvider";
import { CurrencyProvider } from "@/components/MultiCurrency";
import ReduxProvider from "@/redux/ReduxProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import "@/styles/calendar.css";
import "@/styles/globals.css";
import "@/styles/translate.css";
import "@mdxeditor/editor/style.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Toaster } from "sonner";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "AfunoTec — Madagascar Booking Platform",
    template: "%s — AfunoTec",
  },
  description:
    "Book hotels, tours, transfers, activities and travels across Madagascar with AfunoTec — real local rates, instant Mvola / Airtel / Orange payments.",
  other: {
    google: "notranslate",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.className} ${inter.variable} ${sans.className} ${sans.variable}`}
      suppressHydrationWarning
    >
      <NextIntlClientProvider>
        <CurrencyProvider>
          <body>
            {/* Analytics — render only when their IDs are configured. */}
            <GoogleAnalytics />
            <FacebookPixel />
            {/* useSearchParams in PageViewTracker requires a Suspense boundary. */}
            <Suspense fallback={null}>
              <PageViewTracker />
            </Suspense>

            <ReduxProvider>
              <GoogleTranslateProvider>{children}</GoogleTranslateProvider>
              <Toaster />
            </ReduxProvider>
          </body>
        </CurrencyProvider>
      </NextIntlClientProvider>
    </html>
  );
}
