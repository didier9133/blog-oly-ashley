import { routing } from "@/i18n/routing";

const FALLBACK_SITE_URL = "https://ashleydianaleon.com";

function normalizeSiteUrl(url: string): string {
  const withProtocol = url.startsWith("http") ? url : `https://${url}`;
  return withProtocol.replace(/\/$/, "");
}

export const BASE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL) ??
    process.env.VERCEL_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    FALLBACK_SITE_URL,
);
export const DEFAULT_OG_IMAGE = "/og-image-en-v2.jpeg";
export const SPANISH_OG_IMAGE = "/og-image-es-v2.jpeg";

/** Build a locale-aware path that respects the configured prefix strategy. */
export function localizedHref(locale: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return routing.localePrefix === "always" ||
    locale !== routing.defaultLocale
    ? `/${locale}${cleanPath}`
    : cleanPath;
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
