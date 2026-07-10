import type { MetadataRoute } from "next";

const BASE_URL = "https://ashleydianaleon.com";
const PUBLIC_BLOCKLIST = [
  "/dashboard/",
  "/api/",
  "/test-upload",
  "/es/test-upload",
  "/recipes",
  "/es/recipes",
  "/circle/success",
  "/es/circle/success",
  "/workbooks/success",
  "/es/workbooks/success",
  "/our-love",
  "/es/our-love",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/_next/static/",
          "/*.woff2$",
          "/*.webmanifest$",
          ...PUBLIC_BLOCKLIST.slice(2),
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
