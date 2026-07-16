import type { CSSProperties } from "react";
import { FadeIn } from "@/components/fade-in";

interface HomeSectionWhoForProps {
  eyebrow: string;
  title: string;
  quotes: Array<{
    quote: string;
    label: string;
  }>;
}

export function HomeSectionWhoFor({
  eyebrow,
  title,
  quotes,
}: HomeSectionWhoForProps) {
  return (
    <section
      id="who-for"
      className="relative editorial-breathe-sm"
      style={{ "--bridge-color": "var(--book)" } as CSSProperties}
    >
      <div className="section-bleed-bridge" />
      <div className="relative mx-auto max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="editorial-container">
          <FadeIn>
            <span className="editorial-eyebrow">{eyebrow}</span>
            <h2 className="editorial-display-m mt-5 max-w-3xl text-balance text-foreground">
              {title}
            </h2>
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start lg:mt-16 lg:gap-5">
            {quotes.map((item, index) => (
              <FadeIn
                key={item.label}
                delay={0.12 * index}
                className={`group relative overflow-hidden border border-primary/18 bg-[color-mix(in_oklab,var(--book)_82%,var(--paper))] p-7 transition-[transform,border-color,box-shadow] duration-700 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_28px_70px_-48px_rgba(76,42,31,0.55)] sm:p-9 md:min-h-[20rem] ${
                  index === 0
                    ? "md:col-span-5 lg:min-h-[23rem]"
                    : index === 1
                      ? "md:col-span-3 md:mt-16 lg:min-h-[20rem]"
                      : "md:col-span-4 md:mt-5 lg:min-h-[22rem]"
                }`}
              >
                <span
                  aria-hidden
                  className="absolute -right-2 -top-7 font-[family-name:var(--font-cormorant-garamond)] text-[8rem] font-light italic leading-none text-primary/[0.08] transition-transform duration-700 group-hover:-translate-x-1 group-hover:translate-y-1"
                >
                  0{index + 1}
                </span>
                <span aria-hidden className="mb-10 block h-px w-9 bg-primary/70" />
                <blockquote className="relative font-[family-name:var(--font-cormorant-garamond)] text-[1.6rem] font-light italic leading-[1.13] text-foreground text-balance lg:text-[clamp(1.65rem,2.1vw,2.25rem)]">
                  “{item.quote}”
                </blockquote>
                <span className="editorial-eyebrow-strong relative mt-10 block border-t border-foreground/10 pt-5">
                  {item.label}
                </span>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
