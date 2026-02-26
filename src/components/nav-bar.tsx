import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ItemsNavBar } from "./items-nav-bar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { LanguageSelector } from "./language-selector";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center gap-2 border-b border-foreground/10 bg-[#F9F8F6] w-full">
      <nav className="container w-full flex items-center justify-between px-4 md:px-12 mx-auto gap-2 md:gap-8">
        <Link href="/" className="flex-shrink-0">
          <span className="font-[family-name:var(--font-great-vibes)] text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
            Raíces <span className="italic">&amp;</span> Returnings
          </span>
        </Link>

        <div className="flex-1 flex justify-center md:flex">
          <ItemsNavBar />
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-4 flex-shrink-0">
          <LanguageSelector />
          <SignedOut>
            <SignInButton>
              <Button
                variant={"ghost"}
                size="icon"
                className="rounded-full hover:bg-foreground/5"
              >
                <User className="w-5 h-5 text-foreground/80" />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </SignedIn>

          <SidebarTrigger className="-ml-1 md:hidden" />
        </div>
      </nav>
    </header>
  );
}
