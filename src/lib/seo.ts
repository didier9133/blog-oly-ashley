import type { Metadata } from "next";
import { fullUrl } from "@/lib/url";

export const SUPPORTED_LOCALES = ["en", "es"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function localizedAlternates(
  locale: string,
  paths: Record<SupportedLocale, string>,
): NonNullable<Metadata["alternates"]> {
  const currentLocale = isSupportedLocale(locale) ? locale : "en";

  return {
    canonical: fullUrl(currentLocale, paths[currentLocale]),
    languages: localizedLanguages(paths),
  };
}

export function localizedLanguages(paths: Record<SupportedLocale, string>) {
  return {
    en: fullUrl("en", paths.en),
    es: fullUrl("es", paths.es),
    "x-default": fullUrl("en", paths.en),
  };
}

/** Build a canonical and hreflang set for content available in one language. */
export function singleLocaleAlternates(
  locale: SupportedLocale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const url = fullUrl(locale, path);

  return {
    canonical: url,
    languages: {
      [locale]: url,
      "x-default": url,
    },
  };
}

export const indexableRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const transactionalRobots: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};
