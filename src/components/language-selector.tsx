"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const LanguageSelector = () => {
  const currentLanguage = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    if (lang === currentLanguage) return;
    router.replace(pathname, {
      locale: lang,
      scroll: false, // Prevent scrolling to the top
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground/70 px-2">
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
