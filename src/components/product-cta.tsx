"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { localizedHref } from "@/lib/url";
import { PRODUCT_CTAS, type ProductCtaKey } from "@/lib/seo-content";
import type { SupportedLocale } from "@/lib/seo";
import {
  ANALYTICS_CONSENT_EVENT,
  trackAnalyticsEvent,
} from "@/lib/analytics";

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
  const ctaRef = useRef<HTMLElement>(null);
  const copy = PRODUCT_CTAS[locale][product];
  const properties = useMemo(
    () => ({
      article_slug: articleSlug,
      article_category: articleCategory,
      primary_keyword: primaryKeyword,
      cta_product: product,
      cta_placement: placement,
      locale,
    }),
    [
      articleCategory,
      articleSlug,
      locale,
      placement,
      primaryKeyword,
      product,
    ],
  );

  useEffect(() => {
    const element = ctaRef.current;
    if (!element) return;

    let visible = false;
    let tracked = false;
    const trackView = () => {
      if (!visible || tracked) return;
      tracked = trackAnalyticsEvent("blog_product_cta_view", properties);
      if (tracked) observer.disconnect();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        trackView();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, trackView);

    return () => {
      observer.disconnect();
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, trackView);
    };
  }, [properties]);

  return (
    <aside ref={ctaRef} className="not-prose mt-12 border-y border-border/60 bg-[#f5f0eb] px-6 py-8 sm:px-8" aria-labelledby={`cta-${product}-${placement}`}>
      <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#b77761]">{copy.eyebrow}</p>
      <h2 id={`cta-${product}-${placement}`} className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium italic text-foreground sm:text-3xl">{copy.title}</h2>
      <p className="mt-3 font-[family-name:var(--font-lora)] leading-relaxed text-foreground/75">{copy.description}</p>
      <Link
        href={localizedHref(locale, copy.href)}
        onClick={() =>
          trackAnalyticsEvent("blog_product_cta_click", properties)
        }
        className="mt-6 inline-flex rounded-sm bg-[#d8a08b] px-6 py-3 font-[family-name:var(--font-lora)] text-white transition-colors hover:bg-[#c28c77] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b77761] focus-visible:ring-offset-2"
      >
        {copy.label} <span aria-hidden="true" className="ml-2">→</span>
      </Link>
    </aside>
  );
}
