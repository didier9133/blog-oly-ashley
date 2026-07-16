import type { CSSProperties } from "react";
import Link from "next/link";
import { UsersRound } from "lucide-react";
import { FadeIn } from "@/components/fade-in";

interface HomeCircleCtaProps {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

export function HomeCircleCta({
  eyebrow,
  title,
  description,
  cta,
  href,
}: HomeCircleCtaProps) {
  return (
    <section
      id="circle"
      className="relative editorial-breathe-sm"
      style={{ "--bridge-color": "var(--sand)" } as CSSProperties}
    >
      <div className="section-bleed-bridge" />
      <div className="relative mx-auto max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-12">
        <FadeIn className="editorial-container group relative grid grid-cols-1 items-center gap-8 overflow-hidden bg-moss px-7 py-12 text-[#fbf7f1] shadow-[0_30px_90px_-58px_rgba(26,23,20,0.8)] sm:px-10 md:grid-cols-12 md:gap-12 md:px-12 md:py-16 lg:px-16">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-14 right-3 font-[family-name:var(--font-cormorant-garamond)] text-[12rem] font-light italic leading-none text-white/[0.045] transition-transform duration-[1200ms] group-hover:-translate-x-3 lg:text-[18rem]"
          >
            03
          </span>
          <div className="relative md:col-span-2">
            <span className="flex h-16 w-16 items-center justify-center border border-[#fbf7f1]/30 text-[#e6ad92]">
              <UsersRound className="h-7 w-7" strokeWidth={1.4} />
            </span>
          </div>
          <div className="relative md:col-span-7">
            <span className="editorial-eyebrow !text-[#fbf7f1]/60">{eyebrow}</span>
            <h2 className="editorial-display-m mt-4 text-balance !text-[#fbf7f1]">
              {title}
            </h2>
            <p className="editorial-body mt-5 max-w-2xl text-pretty !text-[#fbf7f1]/70">
              {description}
            </p>
          </div>
          <div className="relative md:col-span-3 md:text-right">
            <Link
              href={href}
              className="editorial-link !border-[#fbf7f1]/35 !text-[#fbf7f1] hover:!border-[#e6ad92] hover:!text-[#e6ad92] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6ad92]"
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
