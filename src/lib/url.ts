import { routing } from "@/i18n/routing";

export const BASE_URL = "https://ashleyleon.com";
export const DEFAULT_OG_IMAGE = "/og-image-en.jpeg";
export const SPANISH_OG_IMAGE = "/og-image-es.jpeg";

/**
 * Build a locale-aware path that respects `localePrefix: "as-needed"`.
 * The default locale (en) renders without prefix; other locales are prefixed.
 */
export function localizedHref(locale: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const isDefault =
    locale === routing.defaultLocale && routing.localePrefix === "as-needed";
  return isDefault ? cleanPath : `/${locale}${cleanPath}`;
}

export function fullUrl(locale: string, path: string): string {
  return `${BASE_URL}${localizedHref(locale, path)}`;
}

export function ogImagePath(locale: string): string {
  return locale === "es" ? SPANISH_OG_IMAGE : DEFAULT_OG_IMAGE;
}

export function ogImageUrl(locale: string): string {
  return `${BASE_URL}${ogImagePath(locale)}`;
}
