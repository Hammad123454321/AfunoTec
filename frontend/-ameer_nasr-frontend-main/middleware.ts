import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "mg"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // Match all routes except _next and static files
  ],
};
