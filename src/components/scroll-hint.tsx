"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollHintProps {
  className?: string;
  label?: string;
}

export function ScrollHint({ className, label = "Scroll" }: ScrollHintProps) {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setHidden(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      aria-hidden
      style={{ opacity: hidden ? 0 : scrollOpacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ delay: 2.4, duration: 1.2, ease: "easeOut" }}
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-6 sm:bottom-8 z-10 flex flex-col items-center text-white/70 motion-reduce:hidden transition-opacity duration-500",
        className,
      )}
    >
      <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.4em] mb-3">
        {label}
      </span>
      <div className="relative h-10 w-px bg-white/30 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-3 bg-white/80 animate-scroll-line" />
      </div>
      <ChevronDown
        className="mt-2 h-4 w-4 animate-bounce-down"
        strokeWidth={1.5}
      />
    </motion.div>
  );
}
