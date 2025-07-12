"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

export const LanguageSelector = () => {
  const currentLanguage = useLocale();
  const t = useTranslations("language-selector");
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    router.replace(pathname, {
      locale: lang,
      scroll: false, // Prevent scrolling to the top
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {t(currentLanguage)}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          <span className="mr-2">🇺🇸</span>
          {t("en")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("es")}>
          <span className="mr-2">🇪🇸</span>
          {t("es")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
