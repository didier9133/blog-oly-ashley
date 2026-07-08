"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { localizedHref } from "@/lib/url";

export const LanguageSelector = () => {
  const currentLanguage = useLocale();
  const pathname = usePathname();

  const handleLanguageChange = (lang: "en" | "es") => {
    if (lang === currentLanguage) return;

    const pathWithoutLocale =
      (pathname ?? "/").replace(/^\/(en|es)(?=\/|$)/, "") || "/";
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.assign(localizedHref(lang, pathWithoutLocale));
  };

  return (
    <div className="flex items-center gap-2 text-xs font-medium tracking-[0.04em] text-foreground/60 px-2">
      <button
        onClick={() => handleLanguageChange("es")}
        className={cn(
          "hover:text-foreground transition-colors",
          currentLanguage === "es" && "text-foreground font-semibold",
        )}
      >
        ES
      </button>
      <span className="text-foreground/30 font-light">|</span>
      <button
        onClick={() => handleLanguageChange("en")}
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
