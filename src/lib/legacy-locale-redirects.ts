/**
 * URLs published before locale prefixes became mandatory.
 *
 * Keep these as explicit permanent redirects instead of relying on the
 * next-intl middleware, whose locale negotiation uses a temporary redirect.
 * The permanent signal consolidates every legacy English URL into the
 * canonical `/en` URL selected by metadata and the sitemap.
 */
export const LEGACY_UNPREFIXED_LOCALE_REDIRECTS = [
  { source: "/", destination: "/en" },
  { source: "/about", destination: "/en/about" },
  { source: "/writing", destination: "/en/writing" },
  { source: "/writing/:slug*", destination: "/en/writing/:slug*" },
  { source: "/workbooks", destination: "/en/workbooks" },
  { source: "/workbooks/:path*", destination: "/en/workbooks/:path*" },
  { source: "/circle", destination: "/en/circle" },
  { source: "/circle/:path*", destination: "/en/circle/:path*" },
  { source: "/community", destination: "/en/community" },
  { source: "/community/:path*", destination: "/en/community/:path*" },
  { source: "/contact", destination: "/en/contact" },
  { source: "/privacy", destination: "/en/privacy" },
  { source: "/terms", destination: "/en/terms" },
  {
    source: "/deconstructing-christianity",
    destination: "/en/deconstructing-christianity",
  },
  {
    source: "/church-hurt-guide",
    destination: "/en/church-hurt-guide",
  },
  { source: "/recipes", destination: "/en/recipes" },
  { source: "/recipes/:slug*", destination: "/en/recipes/:slug*" },
] as const;
