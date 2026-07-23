import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PublicItemsNavBar } from "./public-items-nav-bar";
import { LanguageSelector } from "./language-selector";
import { localizedHref } from "@/lib/url";
import { BrandWordmark } from "@/components/brand-wordmark";

export function PublicHeader({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-50 flex h-16 sm:h-[4.5rem] md:h-[4.75rem] shrink-0 items-center border-b border-foreground/[0.08] bg-[#F9F8F6]">
      <nav className="w-full flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[1760px]">
        <Link
          href={localizedHref(locale, "/")}
          className="min-w-0 flex-shrink-0"
          aria-label={
            locale === "es"
              ? "ADL por Ashley Leon — Inicio"
              : "ADL by Ashley Leon — Home"
          }
        >
          <BrandWordmark className="text-[1.8rem] sm:text-[2.05rem] lg:text-[1.85rem] xl:text-[2.05rem]" />
        </Link>

        <div className="hidden min-w-0 flex-1 justify-start lg:flex">
          <PublicItemsNavBar locale={locale} />
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <LanguageSelector />
          <SidebarTrigger
            aria-label={locale === "es" ? "Abrir el menú" : "Open menu"}
            className="-mr-1 lg:hidden"
          />
        </div>
      </nav>
    </header>
  );
}
