"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ANALYTICS_CONSENT_EVENT,
  trackAnalyticsEvent,
  type SeoAnalyticsEvent,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

type PillarCtaKind = "workbook" | "community";

const CTA_EVENTS: Record<
  PillarCtaKind,
  { view: SeoAnalyticsEvent; click: SeoAnalyticsEvent }
> = {
  workbook: {
    view: "pillar_workbook_cta_view",
    click: "pillar_workbook_cta_click",
  },
  community: {
    view: "pillar_community_cta_view",
    click: "pillar_community_cta_click",
  },
};

export function PillarCta({
  kind,
  locale,
  href,
  eyebrow,
  title,
  description,
  label,
  placement,
  className,
}: {
  kind: PillarCtaKind;
  locale: "en" | "es";
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  placement: "after-next-steps" | "article-footer";
  className?: string;
}) {
  const ctaRef = useRef<HTMLElement>(null);
  const events = CTA_EVENTS[kind];
  const properties = useMemo(
    () => ({
      page_slug: "deconstructing-christianity",
      page_type: "seo_pillar",
      cta_destination:
        kind === "workbook" ? "rebuilding-reverence" : "the-in-between",
      cta_placement: placement,
      locale,
    }),
    [kind, locale, placement],
  );

  useEffect(() => {
    const element = ctaRef.current;
    if (!element) return;

    let visible = false;
    let tracked = false;
    let observer: IntersectionObserver | undefined;

    const trackView = () => {
      if (!visible || tracked) return;
      tracked = trackAnalyticsEvent(events.view, properties);
      if (tracked) observer?.disconnect();
    };

    if (typeof IntersectionObserver === "undefined") {
      visible = true;
      trackView();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          trackView();
        },
        { threshold: 0.5 },
      );
      observer.observe(element);
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, trackView);

    return () => {
      observer?.disconnect();
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, trackView);
    };
  }, [events.view, properties]);

  const headingId = `pillar-${kind}-cta-heading`;

  return (
    <aside
      ref={ctaRef}
      aria-labelledby={headingId}
      className={cn(
        "border border-border/70 px-6 py-8 sm:px-9 sm:py-10",
        kind === "workbook"
          ? "bg-moss text-[#fbf7f1]"
          : "bg-paper text-foreground",
        className,
      )}
    >
      <p
        className={cn(
          "font-[family-name:var(--font-lora)] text-[0.68rem] font-semibold uppercase tracking-[0.28em]",
          kind === "workbook" ? "text-[#e4b19c]" : "text-primary",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className={cn(
          "mt-4 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-light leading-tight sm:text-4xl",
          kind === "workbook" ? "text-[#fbf7f1]" : "text-foreground",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-4 max-w-2xl font-[family-name:var(--font-lora)] text-base leading-7",
          kind === "workbook" ? "text-[#fbf7f1]/78" : "text-muted-foreground",
        )}
      >
        {description}
      </p>
      <Link
        href={href}
        onClick={() => trackAnalyticsEvent(events.click, properties)}
        className={cn(
          "mt-7 inline-flex min-h-11 items-center gap-3 border px-5 py-3 font-[family-name:var(--font-lora)] text-xs font-semibold uppercase tracking-[0.17em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          kind === "workbook"
            ? "border-[#fbf7f1]/70 text-[#fbf7f1] hover:bg-[#fbf7f1] hover:text-moss focus-visible:ring-offset-moss"
            : "border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-offset-paper",
        )}
      >
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
