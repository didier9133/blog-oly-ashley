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
        <FadeIn className="editorial-container grid grid-cols-1 items-center gap-8 border-y border-foreground/15 py-12 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/35 text-primary">
              <UsersRound className="h-7 w-7" strokeWidth={1.4} />
            </span>
          </div>
          <div className="md:col-span-7">
            <span className="editorial-eyebrow">{eyebrow}</span>
            <h2 className="editorial-display-m mt-4 text-balance text-foreground">
              {title}
            </h2>
            <p className="editorial-body mt-5 max-w-2xl text-pretty">
              {description}
            </p>
          </div>
          <div className="md:col-span-3 md:text-right">
            <Link href={href} className="editorial-link">
              {cta}
              <span className="editorial-link-arrow">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
