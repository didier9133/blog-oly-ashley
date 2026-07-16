"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { localizedHref } from "@/lib/url";

export const LanguageSelector = () => {
  const currentLanguage = useLocale();
  const pathname = usePathname();
  const pathWithoutLocale =
    (pathname ?? "/").replace(/^\/(en|es)(?=\/|$)/, "") || "/";
  const spanishVersionUnavailable =
    pathWithoutLocale === "/deconstructing-christianity";

  const handleLanguageChange = (lang: "en" | "es") => {
    if (lang === currentLanguage) return;
    if (lang === "es" && spanishVersionUnavailable) return;

    window.location.assign(localizedHref(lang, pathWithoutLocale));
  };

  return (
    <div className="flex items-center gap-2 text-xs font-medium tracking-[0.04em] text-foreground/60 px-2">
      <button
        type="button"
        onClick={() => handleLanguageChange("es")}
        disabled={spanishVersionUnavailable}
        aria-label={
          spanishVersionUnavailable
            ? "ES — Spanish version not available yet"
            : "ES — Switch to Spanish"
        }
        title={
          spanishVersionUnavailable
            ? "Spanish version not available yet"
            : undefined
        }
        className={cn(
          "hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-foreground/60",
          currentLanguage === "es" && "text-foreground font-semibold",
        )}
      >
        ES
      </button>
      <span className="text-foreground/30 font-light">|</span>
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        aria-label="EN — Switch to English"
        className={cn(
          "hover:text-foreground transition-colors",
          currentLanguage === "en" && "text-foreground font-semibold",
        )}
      >
        EN
      </button>
    </div>
  );
};
