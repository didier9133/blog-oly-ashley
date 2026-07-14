import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PublicItemsNavBar } from "./public-items-nav-bar";
import { LanguageSelector } from "./language-selector";
import { getLocale } from "next-intl/server";
import { localizedHref } from "@/lib/url";

export async function PublicHeader() {
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-50 flex h-16 sm:h-[4.5rem] md:h-[4.75rem] shrink-0 items-center border-b border-foreground/[0.08] bg-[#F9F8F6]">
      <nav className="w-full flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[1760px]">
        <Link
          href={localizedHref(locale, "/")}
          className="min-w-0 flex-shrink-0"
          aria-label={
            locale === "es" ? "Ashley Leon — Inicio" : "Ashley Leon — Home"
          }
        >
          <span className="whitespace-nowrap font-[family-name:var(--font-great-vibes)] text-[1.5rem] font-medium leading-none tracking-tighter text-foreground sm:text-[1.75rem] lg:text-[1.45rem] xl:text-[1.7rem]">
            Ashley Leon
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-start lg:flex">
          <PublicItemsNavBar />
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <LanguageSelector />
          <SidebarTrigger
            aria-label="Abrir menú"
            className="-mr-1 lg:hidden"
          />
        </div>
      </nav>
    </header>
  );
}
