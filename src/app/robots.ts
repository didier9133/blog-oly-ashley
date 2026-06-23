import type { MetadataRoute } from "next";

const BASE_URL = "https://www.raicesreturnings.com";

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
          "/test-upload",
          "/es/test-upload",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/test-upload"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
