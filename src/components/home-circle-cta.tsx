import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
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
        <FadeIn className="editorial-container group relative grid grid-cols-1 overflow-hidden bg-moss text-[#fbf7f1] shadow-[0_30px_90px_-58px_rgba(26,23,20,0.8)] md:grid-cols-12">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-14 right-3 z-10 font-[family-name:var(--font-cormorant-garamond)] text-[12rem] font-light italic leading-none text-white/[0.045] transition-transform duration-[1200ms] group-hover:-translate-x-3 lg:text-[18rem]"
          >
            03
          </span>
          <div className="relative min-h-[20rem] overflow-hidden md:col-span-5 md:min-h-[34rem] lg:min-h-[31rem]">
            <Image
              src="/adl-circle-community-clean.jpg"
              alt=""
              fill
              sizes="(min-width: 1280px) 35vw, (min-width: 768px) 42vw, 100vw"
              className="object-cover object-[center_18%] transition-transform duration-[1400ms] ease-out motion-safe:group-hover:scale-[1.035]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,56,45,0.02)_35%,rgba(44,56,45,0.34)_100%)] md:bg-[linear-gradient(90deg,rgba(44,56,45,0)_55%,rgba(44,56,45,0.56)_100%)]"
            />
            <span
              aria-hidden
              className="absolute inset-x-8 bottom-7 h-px bg-[#fbf7f1]/40 md:inset-x-auto md:inset-y-10 md:bottom-auto md:right-0 md:h-auto md:w-px"
            />
          </div>
          <div className="relative z-20 flex flex-col justify-center px-7 py-12 sm:px-10 md:col-span-7 md:px-12 md:py-16 lg:px-16">
            <span className="editorial-eyebrow !text-[#fbf7f1]/60">{eyebrow}</span>
            <h2 className="editorial-display-m mt-4 max-w-[16ch] text-balance !text-[#fbf7f1]">
              {title}
            </h2>
            <p className="editorial-body mt-5 max-w-2xl text-pretty !text-[#fbf7f1]/70">
              {description}
            </p>
            <Link
              href={href}
              className="editorial-link mt-8 self-start !border-[#fbf7f1]/35 !text-[#fbf7f1] hover:!border-[#e6ad92] hover:!text-[#e6ad92] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6ad92]"
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
