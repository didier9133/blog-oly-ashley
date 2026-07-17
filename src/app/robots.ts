import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/url";

const PUBLIC_BLOCKLIST = [
  "/dashboard",
  "/en/dashboard",
  "/es/dashboard",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PUBLIC_BLOCKLIST,
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
