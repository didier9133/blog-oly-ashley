"use client";

import { useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { localizedHref } from "@/lib/url";
import { PRODUCT_CTAS, type ProductCtaKey } from "@/lib/seo-content";
import type { SupportedLocale } from "@/lib/seo";

export function ProductCta({
  product,
  placement,
  locale,
  articleSlug,
  articleCategory,
  primaryKeyword,
}: {
  product: Exclude<ProductCtaKey, "none">;
  placement: "inline" | "end" | "sidebar";
  locale: SupportedLocale;
  articleSlug: string;
  articleCategory: string;
  primaryKeyword?: string;
}) {
  const copy = PRODUCT_CTAS[locale][product];
  const properties = {
    article_slug: articleSlug,
    article_category: articleCategory,
    primary_keyword: primaryKeyword,
    cta_product: product,
    cta_placement: placement,
    locale,
  };

  useEffect(() => {
    track("blog_product_cta_view", properties);
  }, []); // Track a single impression for this rendered placement.

  return (
    <aside className="not-prose mt-12 border-y border-border/60 bg-[#f5f0eb] px-6 py-8 sm:px-8" aria-labelledby={`cta-${product}-${placement}`}>
      <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#b77761]">{copy.eyebrow}</p>
      <h2 id={`cta-${product}-${placement}`} className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium italic text-foreground sm:text-3xl">{copy.title}</h2>
      <p className="mt-3 font-[family-name:var(--font-lora)] leading-relaxed text-foreground/75">{copy.description}</p>
      <Link
        href={localizedHref(locale, copy.href)}
        onClick={() => track("blog_product_cta_click", properties)}
        className="mt-6 inline-flex rounded-sm bg-[#d8a08b] px-6 py-3 font-[family-name:var(--font-lora)] text-white transition-colors hover:bg-[#c28c77] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b77761] focus-visible:ring-offset-2"
      >
        {copy.label} <span aria-hidden="true" className="ml-2">→</span>
      </Link>
    </aside>
  );
}
