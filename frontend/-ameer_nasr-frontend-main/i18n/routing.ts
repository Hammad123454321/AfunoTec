import { LOCALE } from "@/constants";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: LOCALE,
  defaultLocale: LOCALE[0],
  localeCookie: true, // keep cookie (optional)
  localePrefix: "as-needed", // <-- hide default locale in URL
});
