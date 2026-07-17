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

  const handleLanguageChange = (lang: "en" | "es") => {
    if (lang === currentLanguage) return;

    window.location.assign(localizedHref(lang, pathWithoutLocale));
  };

  return (
    <div className="flex items-center gap-2 text-xs font-medium tracking-[0.04em] text-foreground/60 px-2">
      <button
        type="button"
        onClick={() => handleLanguageChange("es")}
        aria-label={
          currentLanguage === "es"
            ? "Español, idioma actual"
            : "Switch to Spanish"
        }
        className={cn(
          "hover:text-foreground transition-colors",
          currentLanguage === "es" && "text-foreground font-semibold",
        )}
      >
        ES
      </button>
      <span className="text-foreground/30 font-light">|</span>
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        aria-label={
          currentLanguage === "es"
            ? "Cambiar a inglés"
            : "English, current language"
        }
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
