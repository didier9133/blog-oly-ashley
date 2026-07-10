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
        <FadeIn className="editorial-container grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="editorial-eyebrow">{eyebrow}</span>
            <h2 className="editorial-display-m mt-5 max-w-3xl text-balance text-foreground">
              {title}
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-10">
            <HeartHandshake
              aria-hidden
              className="mb-7 h-10 w-10 text-primary"
              strokeWidth={1.35}
            />
            <p className="editorial-body text-pretty">{description}</p>
            <Link href={href} className="editorial-link mt-9">
              {cta}
              <span className="editorial-link-arrow">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
