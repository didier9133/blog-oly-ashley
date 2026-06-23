"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroTextRevealProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function HeroTextReveal({
  eyebrow,
  title,
  description,
  bottomSlot,
  className,
  titleClassName,
  descriptionClassName,
}: HeroTextRevealProps) {
  return (
    <motion.div
      className={cn("max-w-2xl", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {eyebrow ? (
        <motion.p
          variants={itemVariants}
          className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[color:var(--hero-eyebrow-fg)] mb-3 sm:mb-5"
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.h1
        variants={itemVariants}
        className={cn(
          "font-[family-name:var(--font-cormorant-garamond)] text-[2rem] sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light leading-[1.05] sm:leading-[1.02] tracking-[-0.01em] text-balance",
          titleClassName,
        )}
      >
        {title}
      </motion.h1>

      {description ? (
        <motion.p
          variants={itemVariants}
          className={cn(
            "mt-4 sm:mt-6 max-w-md font-[family-name:var(--font-lora)] text-sm sm:text-base lg:text-lg text-[color:var(--hero-description-fg)] leading-relaxed",
            descriptionClassName,
          )}
        >
          {description}
        </motion.p>
      ) : null}

      {bottomSlot ? (
        <motion.div variants={itemVariants} className="mt-5 sm:mt-8 max-w-sm">
          {bottomSlot}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
