import type { MetadataRoute } from "next";

const BASE_URL = "https://www.raicesreturnings.com";
const LOCALES = ["es", "en"] as const;
const ROUTES = [
  "",
  "/about",
  "/blog",
  "/contact",
  "/recipes",
  "/our-love",
  "/ebook",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
