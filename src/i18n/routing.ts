import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "es"],

  // Used when no locale matches
  defaultLocale: "en",

  // Don't prefix default locale URLs (avoids 500ms redirect from / → /en)
  localePrefix: "as-needed",
});
