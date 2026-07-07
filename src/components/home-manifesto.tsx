import type { CSSProperties } from "react";
import { BookOpen, Heart, Leaf } from "lucide-react";
import { FadeIn } from "@/components/fade-in";

interface HomeManifestoProps {
  eyebrow: string;
  title: string;
  quote: string;
  workLabel: string;
  body: string;
  closing: string;
  pillars: Array<{
    title: string;
    desc: string;
  }>;
}

const icons = [BookOpen, Leaf, Heart];

export function HomeManifesto({
  eyebrow,
  title,
  quote,
  workLabel,
  body,
  closing,
  pillars,
}: HomeManifestoProps) {
  return (
    <section
      id="manifesto"
      className="relative editorial-breathe"
      style={{ "--bridge-color": "var(--background)" } as CSSProperties}
    >
      <div className="section-bleed-bridge" />
      <div className="relative mx-auto max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="editorial-container-narrow">
          <FadeIn>
            <div className="grid grid-cols-12 items-start gap-6 lg:gap-10">
              <div className="col-span-12 lg:col-span-2">
                <span
                  aria-hidden
                  className="editorial-numeral block text-[7rem] leading-[0.8] sm:text-[9rem] lg:text-[10rem]"
                >
                  01
                </span>
              </div>
              <div className="col-span-12 lg:col-span-10 lg:pt-6">
                <span className="editorial-eyebrow">{eyebrow}</span>
                <h2 className="editorial-display-m mt-5 text-balance text-foreground">
                  {title}
                </h2>
                <span className="editorial-rule-tick mt-8 block lg:mt-10" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <blockquote className="editorial-pullquote mt-14 text-balance lg:mt-20">
              <span className="text-primary">“</span>
              {quote}
              <span className="text-primary">”</span>
            </blockquote>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 lg:mt-20 lg:gap-12">
              {pillars.map(({ title: pillarTitle, desc }, index) => {
                const Icon = icons[index] ?? BookOpen;
                return (
                  <div key={pillarTitle} className="flex items-start gap-5">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          "color-mix(in oklab, var(--primary) 18%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.5} />
                    </span>
                    <div>
                      <span className="editorial-eyebrow-strong block">
                        {pillarTitle}
                      </span>
                      <p className="editorial-body mt-4 text-pretty">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <span className="editorial-rule mt-16 block lg:mt-24" />
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-2">
                <span className="editorial-eyebrow">{workLabel}</span>
              </div>
              <div className="space-y-6 lg:col-span-9">
                <p className="editorial-body text-pretty">{body}</p>
                <p className="editorial-body text-pretty font-light italic text-foreground">
                  {closing}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
