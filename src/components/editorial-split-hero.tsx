"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { FilmGrain } from "@/components/film-grain";
import { HeroTextReveal } from "@/components/hero-text-reveal";
import { ScrollHint } from "@/components/scroll-hint";

interface EditorialSplitHeroProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  imagePriority?: boolean;
  signature?: React.ReactNode;
  className?: string;
}

const frameVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 0.4, duration: 1.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.4, duration: 1, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const railVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.8, duration: 1.2 } },
};

export function EditorialSplitHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  bottomSlot,
  imagePriority = true,
  signature,
  className,
}: EditorialSplitHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-[100svh] xl:min-h-[calc(100vh-80px)] flex flex-col bg-[#0a0a0a] xl:bg-[#F9F8F6] isolate overflow-hidden",
        className,
      )}
    >
      <div className="xl:hidden relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden motion-reduce:overflow-visible"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={imagePriority}
            sizes="100vw"
            className="object-cover object-[center_25%] motion-safe:animate-ken-burns will-change-transform"
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
        <div className="relative z-10 w-full px-5 sm:px-8 lg:px-12 pb-28 sm:pb-32 lg:pb-36 text-white flex flex-col justify-end min-h-[100svh]">
          <HeroTextReveal
            eyebrow={eyebrow}
            title={title}
            description={description}
            bottomSlot={bottomSlot}
          />
        </div>
        <ScrollHint />
      </div>

      <div className="hidden xl:flex hero-editorial flex-col flex-1 w-full max-w-[1760px] mx-auto px-12 2xl:px-20 py-16 2xl:py-24 text-foreground">
        <div className="flex items-center gap-6 border-b border-foreground/15 pb-5 mb-10 2xl:mb-14">
          <span className="h-px flex-1 bg-foreground/15" />
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-foreground/60 whitespace-nowrap">
            Raíces &amp; Returnings Editorial — Nº 01
          </span>
          <span className="h-px flex-1 bg-foreground/15" />
        </div>

        <div className="grid grid-cols-12 gap-12 2xl:gap-20 items-center flex-1 w-full">
          <div className="col-span-5 flex flex-col gap-10">
            <HeroTextReveal
              eyebrow={eyebrow}
              title={title}
              description={description}
              bottomSlot={bottomSlot}
              className="max-w-xl"
              titleClassName="xl:text-[4.25rem] 2xl:text-[5.25rem] xl:leading-[1.0] 2xl:leading-[0.98]"
              descriptionClassName="xl:max-w-[28rem] xl:text-[1.05rem] xl:leading-[1.7]"
            />
            {signature ? (
              <motion.div
                variants={footerVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 pt-6 border-t border-[#bd775c]/30"
              >
                <span className="h-px w-10 bg-[#bd775c]/55" />
                <span className="text-[#bd775c]/65 text-base leading-none">✦</span>
                <span className="font-[family-name:var(--font-great-vibes)] text-[2.5rem] 2xl:text-[3rem] text-[#bd775c] leading-none">
                  {signature}
                </span>
              </motion.div>
            ) : null}
          </div>

          <div className="col-span-7 flex items-center justify-end">
            <motion.div
              variants={frameVariants}
              initial="hidden"
              animate="visible"
              className="relative w-full max-w-[660px] rounded-sm bg-[#f5f0eb] shadow-[0_40px_90px_-25px_rgba(43,43,43,0.45),0_8px_20px_-8px_rgba(43,43,43,0.25)] ring-1 ring-[#bd775c]/10"
            >
              <div className="relative aspect-[4/5] m-4 mb-3 overflow-hidden rounded-sm">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  priority={imagePriority}
                  sizes="(min-width: 1536px) 660px, 55vw"
                  className="object-cover object-center motion-safe:animate-ken-burns-editorial will-change-transform"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#bd775c]/[0.05] to-[#b89e69]/[0.05] mix-blend-overlay"
                />
                <FilmGrain opacity={0.09} />
              </div>
              <span className="block text-center font-sans text-[9px] uppercase tracking-[0.3em] text-foreground/55 pb-4">
                Fig. 01 — Oly &amp; Ashley
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="hidden xl:flex absolute bottom-6 left-12 2xl:left-20 items-center gap-3 font-sans text-[10px] uppercase tracking-[0.4em] text-foreground/40 select-none pointer-events-none"
      >
        <span className="h-px w-6 bg-foreground/30" />
        <span>Folio I</span>
      </div>

      <motion.aside
        aria-hidden
        variants={railVariants}
        initial="hidden"
        animate="visible"
        className="hidden xl:flex absolute right-4 2xl:right-8 top-0 bottom-0 flex-col items-center justify-center gap-7 text-foreground/45 select-none pointer-events-none"
      >
        <span className="text-[#bd775c]/60 text-sm leading-none">✦</span>
        <span className="[writing-mode:vertical-rl] font-sans text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
          Issue Nº 01
        </span>
        <span className="h-px w-8 bg-foreground/20" />
        <span className="[writing-mode:vertical-rl] font-sans text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
          Est. MMXXV
        </span>
        <span className="h-px w-8 bg-foreground/20" />
        <span className="[writing-mode:vertical-rl] font-sans text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
          Contents
        </span>
      </motion.aside>
    </section>
  );
}
