import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PublicItemsNavBar } from "./public-items-nav-bar";
import { LanguageSelector } from "./language-selector";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 sm:h-[4.5rem] md:h-[4.75rem] shrink-0 items-center border-b border-foreground/[0.08] bg-[#F9F8F6]">
      <nav className="w-full flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[1760px]">
        <Link
          href="/"
          className="flex-shrink-0 min-w-0 md:hidden"
          aria-label="Ashley Leon — Inicio"
        >
          <span className="font-[family-name:var(--font-great-vibes)] text-[1.5rem] sm:text-[1.75rem] font-medium text-foreground tracking-tighter leading-none whitespace-nowrap">
            Ashley Leon
          </span>
        </Link>

        <div className="hidden md:flex flex-1 justify-start min-w-0">
          <PublicItemsNavBar />
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <LanguageSelector />
          <SidebarTrigger
            aria-label="Abrir menú"
            className="md:hidden -mr-1"
          />
        </div>
      </nav>
    </header>
  );
}
