import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = "https://www.raicesreturnings.com";
const LOCALES = ["es", "en"] as const;

// Fechas reales de última modificación por ruta.
// Actualizar manualmente cuando cambie contenido estático significativo.
const STATIC_ROUTES: { path: string; lastModified: string }[] = [
  { path: "", lastModified: "2026-02-11" },
  { path: "/about", lastModified: "2025-11-07" },
  { path: "/blog", lastModified: "2026-02-11" },
  { path: "/recipes", lastModified: "2025-11-17" },
  { path: "/ebook", lastModified: "2025-11-07" },
  { path: "/our-love", lastModified: "2025-09-01" },
  { path: "/contact", lastModified: "2025-07-31" },
  { path: "/privacy", lastModified: "2025-07-31" },
  { path: "/terms", lastModified: "2025-07-31" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes — lastModified real, sin priority/changeFrequency (ignorados por Google)
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_ROUTES.map(({ path, lastModified }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(lastModified),
    })),
  );

  // Dynamic blog posts — route always uses slug_en for both locales
  const blogPosts = await prisma.post.findMany({
    where: {
      published: true,
      category: { name: "blog" },
    },
    select: { slug_en: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const blogEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    blogPosts.map((post) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug_en}`,
      lastModified: post.updatedAt,
    })),
  );

  // Dynamic recipe posts — route always uses slug_en for both locales
  const recipePosts = await prisma.post.findMany({
    where: {
      published: true,
      category: { name: "recipes" },
    },
    select: { slug_en: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const recipeEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    recipePosts.map((post) => ({
      url: `${BASE_URL}/${locale}/recipes/${post.slug_en}`,
      lastModified: post.updatedAt,
    })),
  );

  // Dynamic ebook detail pages — each locale uses its own slug
  const books = await prisma.book.findMany({
    select: { slug_en: true, slug_es: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const ebookEntries: MetadataRoute.Sitemap = books.flatMap((book) => [
    {
      url: `${BASE_URL}/en/ebook/detail/${book.slug_en}`,
      lastModified: book.updatedAt,
    },
    {
      url: `${BASE_URL}/es/ebook/detail/${book.slug_es}`,
      lastModified: book.updatedAt,
    },
  ]);

  return [...staticEntries, ...blogEntries, ...recipeEntries, ...ebookEntries];
}
