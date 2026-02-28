import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = "https://www.raicesreturnings.com";
const LOCALES = ["es", "en"] as const;

const STATIC_ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/recipes", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/ebook", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/our-love", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes for each locale
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
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
      changeFrequency: "monthly" as const,
      priority: 0.7,
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
      changeFrequency: "monthly" as const,
      priority: 0.75,
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
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/es/ebook/detail/${book.slug_es}`,
      lastModified: book.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  return [...staticEntries, ...blogEntries, ...recipeEntries, ...ebookEntries];
}
