"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type NavItem = { id: string; label: string };

interface CircleNavProps {
  items: NavItem[];
  reserveLabel?: string;
  reserveHref?: string;
  sectionHrefPrefix?: string;
  className?: string;
}

export function CircleNav({
  items,
  reserveLabel,
  reserveHref,
  sectionHrefPrefix,
  className,
}: CircleNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting);
        setIsStuck(!entry.isIntersecting);
      },
      { rootMargin: "-1px 0px 0px 0px", threshold: [0, 1] },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (sectionHrefPrefix) {
      e.preventDefault();
      window.location.assign(`${sectionHrefPrefix}#${id}`);
      return;
    }

    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Circle sections"
      className={cn(
        "fixed inset-x-0 z-40 transition-all duration-300",
        "top-16 sm:top-[4.5rem] md:top-[4.75rem]",
        hidden
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100",
        className,
      )}
    >
      <div
        className={cn(
          "border-b transition-colors duration-300",
          isStuck
            ? "bg-[#F9F8F6]/85 backdrop-blur-md border-border/40 shadow-sm"
            : "bg-[#F9F8F6]/70 backdrop-blur-sm border-transparent",
        )}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between gap-3 h-14 sm:h-16">
            <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide py-2">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id} className="shrink-0">
                    <a
                      href={
                        sectionHrefPrefix
                          ? `${sectionHrefPrefix}#${item.id}`
                          : `#${item.id}`
                      }
                      onClick={(e) => handleClick(e, item.id)}
                      className={cn(
                        "relative inline-flex items-center px-3 py-2",
                        "font-sans text-xs sm:text-sm tracking-wide",
                        "transition-colors duration-200",
                        "after:absolute after:left-3 after:right-3 after:bottom-1 after:h-px after:origin-center",
                        "after:bg-foreground/35 after:transition-transform after:duration-300",
                        isActive
                          ? "font-medium text-foreground after:scale-x-100"
                          : "text-foreground/70 after:scale-x-0 hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            {reserveLabel && reserveHref ? (
              <a
                href={reserveHref}
                className={cn(
                  "hidden sm:inline-flex shrink-0 items-center",
                  "bg-[#d8a08b] text-white px-4 py-2 rounded-full",
                  "font-sans text-xs sm:text-sm font-medium tracking-wide",
                  "shadow-sm shadow-[#d8a08b]/25",
                  "hover:bg-[#c98e78] hover:shadow-md hover:shadow-[#d8a08b]/30",
                  "transition-all duration-200",
                )}
              >
                {reserveLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
