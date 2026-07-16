"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const SECTIONS = [
  { id: "who-for", num: "01", key: "sidebar-who" },
  { id: "manifesto", num: "02", key: "sidebar-manifesto" },
  { id: "workbooks", num: "03", key: "sidebar-book" },
  { id: "circle", num: "04", key: "sidebar-circle" },
  { id: "community", num: "05", key: "sidebar-community" },
  { id: "writing", num: "06", key: "sidebar-fresh" },
] as const;

export function HomeSidebar() {
  const t = useTranslations("Home");
  const [pastHero, setPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  useEffect(() => {
    const sections = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const firstVisible = visible[0]?.target;
        if (firstVisible instanceof HTMLElement) {
          setActiveSection(firstVisible.id);
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={t("sidebar-index")}
      className="relative space-y-12 border-l border-foreground/12 pl-8"
    >
      <div aria-hidden className="absolute -left-px top-0 h-12 w-px bg-primary" />
      <div>
        <span className="editorial-eyebrow tracking-[0.34em] text-foreground/55">
          {t("sidebar-index")}
        </span>
        <ol className="mt-7 space-y-1">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={activeSection === s.id ? "location" : undefined}
                onClick={() => setActiveSection(s.id)}
                className={`group relative flex min-h-10 items-center gap-4 pr-2 font-[family-name:var(--font-lora)] text-[0.8125rem] font-light leading-snug transition-[color,transform] duration-500 hover:translate-x-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                  activeSection === s.id
                    ? "translate-x-1 text-foreground"
                    : "text-foreground/48"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute -left-[2.05rem] h-1.5 w-1.5 rounded-full border transition-all duration-500 ${
                    activeSection === s.id
                      ? "scale-100 border-primary bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_14%,transparent)]"
                      : "scale-75 border-foreground/25 bg-background group-hover:border-primary"
                  }`}
                />
                <span
                  aria-hidden
                  className={`w-5 shrink-0 font-[family-name:var(--font-cormorant-garamond)] text-sm font-light italic transition-colors duration-500 ${
                    activeSection === s.id
                      ? "text-primary"
                      : "text-foreground/35 group-hover:text-primary"
                  }`}
                >
                  {s.num}
                </span>
                <span className="border-b border-transparent pb-0.5 transition-colors duration-500 group-hover:border-foreground/25">
                  {t(s.key)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div
        className={`border-t border-foreground/10 pt-8 transition-all duration-700 ease-out ${
          pastHero
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!pastHero}
      >
        <span className="editorial-eyebrow mb-3 block tracking-[0.34em] text-foreground/55">
          {t("sidebar-cta-eyebrow")}
        </span>
        <p className="font-[family-name:var(--font-lora)] text-[0.8125rem] font-light leading-relaxed text-foreground/60 text-pretty">
          {t("sidebar-cta-desc")}
        </p>
        <a
          href="#newsletter"
          className="editorial-link mt-6 text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {t("sidebar-cta-link")}
          <span className="editorial-link-arrow">→</span>
        </a>
      </div>
    </nav>
  );
}
