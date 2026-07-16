import type { CSSProperties } from "react";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { FadeIn } from "@/components/fade-in";

interface HomeCommunityCtaProps {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

export function HomeCommunityCta({
  eyebrow,
  title,
  description,
  cta,
  href,
}: HomeCommunityCtaProps) {
  return (
    <section
      id="community"
      className="relative editorial-breathe-sm"
      style={{ "--bridge-color": "var(--book)" } as CSSProperties}
    >
      <div className="section-bleed-bridge" />
      <div className="relative mx-auto max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-12">
        <FadeIn className="editorial-container group relative grid grid-cols-1 gap-10 overflow-hidden border border-primary/20 bg-[color-mix(in_oklab,var(--book)_76%,var(--paper))] px-7 py-12 sm:px-10 md:grid-cols-12 md:px-12 md:py-16 lg:px-16">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-12 font-[family-name:var(--font-cormorant-garamond)] text-[12rem] font-light italic leading-none text-primary/[0.075] transition-transform duration-[1200ms] group-hover:-translate-x-3 lg:text-[17rem]"
          >
            04
          </span>
          <div className="relative md:col-span-7">
            <span className="editorial-eyebrow">{eyebrow}</span>
            <h2 className="editorial-display-m mt-5 max-w-3xl text-balance text-foreground">
              {title}
            </h2>
          </div>
          <div className="relative md:col-span-5 md:pt-10">
            <HeartHandshake
              aria-hidden
              className="mb-7 h-10 w-10 transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-105 text-primary"
              strokeWidth={1.35}
            />
            <p className="editorial-body text-pretty">{description}</p>
            <Link
              href={href}
              className="editorial-link mt-9 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {cta}
              <span className="editorial-link-arrow">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
