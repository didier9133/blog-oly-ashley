import { routing } from "@/i18n/routing";

export const BASE_URL = "https://ashleyleon.com";

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
