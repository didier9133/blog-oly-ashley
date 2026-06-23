import Image from "next/image";
import { cn } from "@/lib/utils";
import { FilmGrain } from "@/components/film-grain";
import { HeroTextReveal } from "@/components/hero-text-reveal";
import { ScrollHint } from "@/components/scroll-hint";

interface FullBleedHeroProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  bottomSlot?: React.ReactNode;
  imagePriority?: boolean;
  className?: string;
  showScrollHint?: boolean;
  scrollHintLabel?: string;
}

export function FullBleedHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  bottomSlot,
  imagePriority = true,
  className,
  showScrollHint = true,
  scrollHintLabel,
}: FullBleedHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-[100svh] lg:min-h-[calc(100vh-80px)] flex flex-col justify-end overflow-hidden bg-[#0a0a0a] isolate",
        "2xl:max-w-[1760px] 2xl:mx-auto",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden motion-reduce:overflow-visible"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={imagePriority}
          sizes="(min-width: 1536px) 1760px, 100vw"
          className="object-cover object-[center_20%] sm:object-[center_25%] lg:object-[center_30%] motion-safe:animate-ken-burns will-change-transform"
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.55)_100%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
      />

      <FilmGrain />

      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-12 pb-28 sm:pb-32 lg:pb-36 text-white">
        <HeroTextReveal
          eyebrow={eyebrow}
          title={title}
          description={description}
          bottomSlot={bottomSlot}
        />
      </div>

      {showScrollHint ? <ScrollHint label={scrollHintLabel} /> : null}
    </section>
  );
}
