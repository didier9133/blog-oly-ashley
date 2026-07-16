"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CircleStickyCtaProps {
  label: string;
  href: string;
  className?: string;
}

export function CircleStickyCta({
  label,
  href,
  className,
}: CircleStickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const update = () => {
      const heroRect = hero.getBoundingClientRect();
      const pastHero = heroRect.bottom < window.innerHeight * 0.5;
      setVisible(pastHero);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (visible) {
      root.dataset.circleCtaVisible = "true";
    } else {
      root.removeAttribute("data-circle-cta-visible");
    }

    return () => root.removeAttribute("data-circle-cta-visible");
  }, [visible]);

  return (
    <div
      aria-hidden={!visible}
      data-visible={visible}
      className={cn(
        "circle-sticky-cta sm:hidden fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 pt-6",
        "bg-gradient-to-t from-[#F9F8F6] via-[#F9F8F6]/95 to-transparent",
        "transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none",
        className,
      )}
    >
      <a
        href={href}
        tabIndex={visible ? undefined : -1}
        className={cn(
          "flex items-center justify-center w-full",
          "bg-[#d8a08b] text-white px-6 py-4",
          "font-sans font-medium tracking-wide text-base",
          "rounded-full shadow-lg shadow-[#d8a08b]/20",
          "hover:bg-[#c98e78] active:scale-[0.98] transition-all",
        )}
      >
        {label}
      </a>
    </div>
  );
}
