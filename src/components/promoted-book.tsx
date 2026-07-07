import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";
import { localizedHref } from "@/lib/url";

export interface PromotedBookData {
  title: string;
  subtitle: string;
  coverImage: string;
  slug: string;
  locale: "en" | "es";
}

interface PromotedBookProps {
  book: PromotedBookData | null;
  eyebrow: string;
  tagline: string;
  blurbStart: string;
  blurbHighlight: string;
  blurbEnd: string;
  cta: string;
  emptyState: string;
  fallbackHref: string;
  variant?: "default" | "compact";
  className?: string;
}

export function PromotedBook({
  book,
  eyebrow,
  tagline,
  blurbStart,
  blurbHighlight,
  blurbEnd,
  cta,
  emptyState,
  fallbackHref,
  variant = "default",
  className,
}: PromotedBookProps) {
  const href = book
    ? localizedHref(book.locale, `/workbooks/${book.slug}`)
    : fallbackHref;
  const isCompact = variant === "compact";

  return (
    <section
      aria-label="Featured offering"
      className={cn(
        "relative overflow-hidden",
        isCompact && "flex h-full items-center",
        className,
      )}
    >
      {isCompact ? (
        <div className="relative w-full px-6 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16 flex flex-col gap-7">
          <FadeIn delay={0.05} duration={0.9}>
            <span className="editorial-eyebrow">{eyebrow}</span>
          </FadeIn>

          <FadeIn delay={0.15} duration={1.1} className="mx-auto w-full max-w-[200px] sm:max-w-[220px]">
            <div className="relative mx-auto w-full">
              <div
                aria-hidden
                className="absolute inset-x-4 -bottom-4 h-6 rounded-[60%] bg-ink/15 blur-2xl dark:bg-black/40"
              />
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-sm bg-paper shadow-[0_24px_50px_-18px_rgba(43,43,43,0.35),0_6px_14px_-6px_rgba(43,43,43,0.18)] ring-1 ring-foreground/10"
                style={{ transform: "rotate(-3deg)" }}
              >
                {book ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(min-width: 1024px) 220px, 60vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-paper px-4 text-center">
                    <span className="editorial-eyebrow text-[0.55rem]">
                      {tagline}
                    </span>
                    <span className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-lg italic text-foreground/60">
                      Coming soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25} duration={1}>
            <h2 className="editorial-display-s mt-1 text-foreground text-balance">
              {book ? (
                <>
                  {book.title}
                  {book.subtitle ? (
                    <span className="mt-1 block text-[0.65em] font-light italic text-foreground/60">
                      {book.subtitle}
                    </span>
                  ) : null}
                </>
              ) : (
                tagline
              )}
            </h2>
          </FadeIn>

          <FadeIn delay={0.35} duration={1}>
            <p className="text-[0.9rem] leading-[1.7] text-pretty text-foreground/75 font-[family-name:var(--font-lora)]">
              {book ? (
                <>
                  {blurbStart}
                  <span className="font-semibold italic text-foreground">
                    {blurbHighlight}
                  </span>
                  {blurbEnd}
                </>
              ) : (
                emptyState
              )}
            </p>
          </FadeIn>

          <FadeIn delay={0.45} duration={0.9}>
            <Link
              href={href}
              className="inline-flex items-center gap-2 font-[family-name:var(--font-lora)] text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-foreground border-b border-foreground/30 hover:border-foreground/70 pb-1 transition-colors duration-500"
            >
              {cta}
              <span aria-hidden>→</span>
            </Link>
          </FadeIn>
        </div>
      ) : (
        <div className="editorial-container relative grid grid-cols-1 items-center gap-10 py-20 sm:py-24 md:grid-cols-12 md:gap-12 md:py-28 lg:gap-16 lg:py-36">
          <FadeIn className="md:col-span-5 lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px]">
              <div
                aria-hidden
                className="absolute inset-x-6 -bottom-8 h-10 rounded-[60%] bg-ink/12 blur-2xl dark:bg-black/40"
              />
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-sm bg-paper shadow-[0_36px_80px_-24px_rgba(43,43,43,0.32),0_8px_18px_-8px_rgba(43,43,43,0.16)] ring-1 ring-foreground/8"
                style={{ transform: "rotate(-3deg)" }}
              >
                {book ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(min-width: 768px) 360px, 80vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-paper px-6 text-center">
                    <span className="editorial-eyebrow">{tagline}</span>
                    <span className="mt-4 font-[family-name:var(--font-cormorant-garamond)] text-2xl italic text-foreground/60">
                      Coming soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <div className="md:col-span-7 lg:col-span-7">
            <FadeIn delay={0.1}>
              <span className="editorial-eyebrow tracking-[0.34em]">{eyebrow}</span>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="editorial-display-m mt-5 text-foreground text-balance">
                {book ? (
                  <>
                    {book.title}
                    {book.subtitle ? (
                      <span className="mt-3 block font-[family-name:var(--font-cormorant-garamond)] text-[clamp(0.8125rem,1.3vw,1.0625rem)] font-light italic uppercase tracking-[0.06em] leading-[1.3] text-foreground/55 max-w-[30ch]">
                        {book.subtitle}
                      </span>
                    ) : null}
                  </>
                ) : (
                  tagline
                )}
              </h2>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="editorial-body mt-8 max-w-xl text-pretty">
                {book ? (
                  <>
                    {blurbStart}
                    <span className="font-semibold text-foreground italic">
                      {blurbHighlight}
                    </span>
                    {blurbEnd}
                  </>
                ) : (
                  emptyState
                )}
              </p>
            </FadeIn>

            <FadeIn delay={0.4} className="mt-10">
              <Link href={href} className="editorial-link">
                {cta}
                <span className="editorial-link-arrow">→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      )}
    </section>
  );
}
