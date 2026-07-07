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

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-primary/20 bg-primary/20 md:grid-cols-3">
            {quotes.map((item, index) => (
              <FadeIn
                key={item.label}
                delay={0.12 * index}
                className="bg-[color-mix(in_oklab,var(--book)_82%,var(--paper))] p-7 sm:p-9"
              >
                <blockquote className="font-[family-name:var(--font-cormorant-garamond)] text-[1.55rem] font-light italic leading-tight text-foreground text-balance">
                  “{item.quote}”
                </blockquote>
                <span className="editorial-eyebrow-strong mt-8 block">
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
