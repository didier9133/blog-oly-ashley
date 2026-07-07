"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const SECTIONS = [
  { id: "book", num: "01", key: "sidebar-book" },
  { id: "manifesto", num: "02", key: "sidebar-manifesto" },
  { id: "find", num: "03", key: "sidebar-find" },
  { id: "fresh", num: "04", key: "sidebar-fresh" },
] as const;

export function HomeSidebar() {
  const t = useTranslations("Home");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Table of contents" className="space-y-12">
      <div>
        <span className="font-[family-name:var(--font-great-vibes)] text-[1.5rem] font-light text-foreground/50 leading-none">
          Ashley Leon
        </span>
      </div>

      <div>
        <span className="editorial-eyebrow tracking-[0.34em] text-foreground/45">
          {t("sidebar-index")}
        </span>
        <ol className="mt-6 space-y-4">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-baseline gap-4 font-[family-name:var(--font-lora)] text-[0.8125rem] font-light leading-snug text-foreground/50 hover:text-foreground/85 transition-colors duration-500"
              >
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-cormorant-garamond)] italic font-light text-sm text-foreground/40 w-5 shrink-0"
                >
                  {s.num}
                </span>
                <span className="border-b border-transparent group-hover:border-foreground/25 transition-colors duration-500 pb-0.5">
                  {t(s.key)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div
        className={`transition-all duration-700 ease-out ${
          pastHero
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!pastHero}
      >
        <span aria-hidden className="editorial-rule-tick mb-6 block opacity-60" />
        <span className="editorial-eyebrow tracking-[0.34em] text-foreground/45 block mb-3">
          {t("sidebar-cta-eyebrow")}
        </span>
        <p className="font-[family-name:var(--font-lora)] text-[0.8125rem] font-light leading-relaxed text-foreground/55 text-pretty">
          {t("sidebar-cta-desc")}
        </p>
        <a href="#newsletter" className="editorial-link mt-6 text-foreground/60">
          {t("sidebar-cta-link")}
          <span className="editorial-link-arrow">→</span>
        </a>
      </div>
    </nav>
  );
}
