import { routing } from "@/i18n/routing";

const FALLBACK_SITE_URL = "https://ashleydianaleon.com";

function normalizeSiteUrl(url: string): string {
  const withProtocol = url.startsWith("http") ? url : `https://${url}`;
  return withProtocol.replace(/\/$/, "");
}

export const BASE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_ENV === "production"
      ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
      : undefined) ??
    FALLBACK_SITE_URL,
);
export const DEFAULT_OG_IMAGE = "/og-image-en-v2.jpeg";
export const SPANISH_OG_IMAGE = "/og-image-es-v2.jpeg";

/** Build a locale-aware path that respects the configured prefix strategy. */
export function localizedHref(locale: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const localizedPath = routing.localePrefix === "always" ||
    locale !== routing.defaultLocale
    ? `/${locale}${cleanPath}`
    : cleanPath;

  // Next.js redirects locale homepages from `/en/` to `/en`. Generate the
  // final URL directly so canonicals, hreflang and sitemap entries agree.
  return localizedPath.length > 1 && localizedPath.endsWith("/")
    ? localizedPath.slice(0, -1)
    : localizedPath;
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
