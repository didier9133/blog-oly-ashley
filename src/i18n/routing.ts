import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "es"],

  // Used when no locale matches
  defaultLocale: "en",

  // Use explicit locale URLs so social scrapers cache each language separately.
  localePrefix: "always",

  // Locale is explicit in every public URL, so a response cookie is
  // unnecessary and would make otherwise cacheable pages private.
  localeCookie: false,

  // Next.js metadata owns canonical/hreflang output. Disabling the middleware
  // Link header prevents a second, conflicting x-default on localized pages.
  alternateLinks: false,
});
