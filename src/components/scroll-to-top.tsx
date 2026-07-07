"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return false;

  const target = document.getElementById(decodeURIComponent(hash));
  if (!target) return false;

  const scrollMarginTop = Number.parseFloat(
    window.getComputedStyle(target).scrollMarginTop,
  );
  const offset = Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo(0, Math.max(0, top));
  return true;
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";

    const frame = window.requestAnimationFrame(() => {
      if (scrollToHash()) return;
      window.scrollTo(0, 0);
    });
    const timeouts = [100, 600, 1600].map((delay) =>
      window.setTimeout(scrollToHash, delay),
    );

    const handleHashChange = () => {
      window.requestAnimationFrame(scrollToHash);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(frame);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return null;
}
