import Link from "next/link";
import { FadeIn } from "@/components/fade-in";

interface HeroContentProps {
  eyebrow?: string;
  signature?: string;
  titleOne: string;
  titleHighlight: string;
  titleTwo: string;
  description: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  className?: string;
  spacing?: "default" | "tight";
}

export function HeroContent({
  eyebrow,
  signature,
  titleOne,
  titleHighlight,
  titleTwo,
  description,
  ctaPrimary,
  ctaSecondary,
  className,
  spacing = "default",
}: HeroContentProps) {
  const isTight = spacing === "tight";
  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {eyebrow && signature ? (
        <FadeIn delay={0.1} duration={0.9}>
          <div className={`flex items-center gap-4 ${isTight ? "mb-8" : "mb-8 sm:mb-10"}`}>
            <span className="block w-px h-10 bg-foreground/30 origin-top animate-reveal-line" />
            <span className="editorial-eyebrow">
              {eyebrow} · {signature}
            </span>
          </div>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.25} duration={1.1}>
        <h1 className="editorial-display-l text-foreground text-balance !leading-[0.96]">
          <span className="block">
            {titleOne}{" "}
            <em className="not-italic font-normal text-foreground tracking-[-0.03em] relative inline-block px-[0.2em] mx-[-0.04em]">
              <span
                aria-hidden
                className="absolute -inset-x-[0.06em] -inset-y-[0.08em] -z-10 bg-[#f0d9cf]/85 rounded-[1px]"
              />
              {titleHighlight}
            </em>
            <span className="text-foreground block mt-1">{titleTwo}</span>
          </span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.45} duration={1}>
        <p
          className={`editorial-lede text-pretty max-w-md ${
            isTight ? "mt-6" : "mt-7 sm:mt-8"
          }`}
        >
          {description}
        </p>
      </FadeIn>

      <FadeIn
        delay={0.6}
        duration={0.9}
        className={`flex flex-col gap-3 items-start ${
          isTight ? "mt-7" : "mt-8 sm:mt-9"
        }`}
      >
        <Link
          href={ctaPrimary.href}
          className="group inline-flex items-center justify-between gap-3 w-full font-[family-name:var(--font-lora)] text-sm sm:text-[0.9375rem] font-bold uppercase tracking-[0.03em] text-primary-foreground bg-primary hover:bg-primary/[0.92] px-7 py-4 rounded-sm transition-colors duration-500 ease-out shadow-sm"
        >
          <span>{ctaPrimary.label}</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-[var(--ease-breath)] group-hover:translate-x-1.5"
          >
            →
          </span>
        </Link>
        {ctaSecondary ? (
          <Link
            href={ctaSecondary.href}
            className="group inline-flex items-center justify-between gap-3 w-full font-[family-name:var(--font-lora)] text-sm sm:text-[0.9375rem] font-semibold tracking-[0.03em] text-foreground bg-transparent border border-foreground/30 hover:border-foreground/70 hover:text-primary px-7 py-4 rounded-sm transition-colors duration-500 ease-out"
          >
            <span>{ctaSecondary.label}</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-[var(--ease-breath)] group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        ) : null}
      </FadeIn>
    </div>
  );
}
