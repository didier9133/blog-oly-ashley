import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { fullUrl } from "@/lib/url";
import { localizedLanguages } from "@/lib/seo";

const LOCALES = ["es", "en"] as const;

// Fechas reales de última modificación por ruta.
// Actualizar manualmente cuando cambie contenido estático significativo.
const STATIC_ROUTES: { path: string; lastModified: string }[] = [
  { path: "", lastModified: "2026-07-10" },
  { path: "/about", lastModified: "2026-07-10" },
  { path: "/writing", lastModified: "2026-07-10" },
  { path: "/workbooks", lastModified: "2026-07-10" },
  { path: "/circle", lastModified: "2026-07-10" },
  { path: "/community", lastModified: "2026-07-10" },
  { path: "/contact", lastModified: "2026-07-10" },
  { path: "/privacy", lastModified: "2026-07-10" },
  { path: "/terms", lastModified: "2026-07-10" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes — lastModified real, sin priority/changeFrequency (ignorados por Google).
  // fullUrl() respects the configured locale prefix strategy.
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_ROUTES.map(({ path, lastModified }) => ({
      url: fullUrl(locale, path),
      lastModified: new Date(lastModified),
      alternates: {
        languages: localizedLanguages({ en: path, es: path }),
      },
    })),
  );

  // Dynamic writing posts — each locale uses its own slug.
  const blogPosts = await prisma.post.findMany({
    where: {
      published: true,
      category: { name: "blog" },
    },
    select: { slug_en: true, slug_es: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const blogEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    blogPosts
      .map((post) => {
        const paths = {
          en: `/writing/${post.slug_en}`,
          es: `/writing/${post.slug_es}`,
        };

        return {
          url: fullUrl(locale, paths[locale]),
          lastModified: post.updatedAt,
          alternates: { languages: localizedLanguages(paths) },
        };
      }),
  );

  // Dynamic ebook detail pages — each locale uses its own slug
  const books = await prisma.book.findMany({
    select: { slug_en: true, slug_es: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const ebookEntries: MetadataRoute.Sitemap = books.flatMap((book) => [
    {
      url: fullUrl("en", `/workbooks/${book.slug_en}`),
      lastModified: book.updatedAt,
      alternates: {
        languages: localizedLanguages({
          en: `/workbooks/${book.slug_en}`,
          es: `/workbooks/${book.slug_es}`,
        }),
      },
    },
    {
      url: fullUrl("es", `/workbooks/${book.slug_es}`),
      lastModified: book.updatedAt,
      alternates: {
        languages: localizedLanguages({
          en: `/workbooks/${book.slug_en}`,
          es: `/workbooks/${book.slug_es}`,
        }),
      },
    },
  ]);

  return [...staticEntries, ...blogEntries, ...ebookEntries];
}
