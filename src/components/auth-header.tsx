import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ItemsNavBar } from "./items-nav-bar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { LanguageSelector } from "./language-selector";
import { BrandWordmark } from "@/components/brand-wordmark";

export async function AuthHeader({ locale }: { locale: string }) {
  const isSpanish = locale === "es";

  return (
    <header className="sticky top-0 z-50 flex h-16 sm:h-[4.5rem] md:h-[4.75rem] shrink-0 items-center border-b border-foreground/[0.08] bg-[#F9F8F6]">
      <nav className="w-full flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[1760px]">
        <Link
          href={`/${locale}`}
          className="flex-shrink-0 min-w-0 md:hidden"
          aria-label={
            isSpanish
              ? "ADL por Ashley Leon — Inicio"
              : "ADL by Ashley Leon — Home"
          }
        >
          <BrandWordmark className="text-[1.8rem] sm:text-[2.05rem]" />
        </Link>

        <div className="hidden md:flex flex-1 justify-start min-w-0">
          <ItemsNavBar />
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <LanguageSelector />
          <SignedOut>
            <SignInButton>
              <Button
                variant={"ghost"}
                size="icon"
                aria-label={isSpanish ? "Iniciar sesión" : "Sign in"}
                className="rounded-full hover:bg-foreground/5 h-10 w-10"
              >
                <User className="w-5 h-5 text-foreground/80" />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="h-10 w-10 flex items-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                    userButtonBox: "h-10 w-10",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SidebarTrigger
            aria-label={isSpanish ? "Abrir menú" : "Open menu"}
            className="md:hidden -mr-1"
          />
        </div>
      </nav>
    </header>
  );
}
