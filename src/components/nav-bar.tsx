import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ItemsNavBar } from "./items-nav-bar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { LanguageSelector } from "./language-selector";

export async function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b"
      style={{
        background: "var(--card)",
      }}
    >
      <nav className="container w-full flex items-center justify-between px-4 md:px-20 mx-auto gap-16 font-[family-name:var(--font-cormorant-garamond)]">
        <Link href="/">
          <div className="relative w-[70px] h-[64px] md:w-[100px] cursor-pointer">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 80px, (max-width: 1200px) 100px, 100px"
              className="object-contain object-left dark:[filter:brightness(0)_invert(1)]"
              priority
            />
          </div>
        </Link>

        <ItemsNavBar />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            gap: "0.5rem",
          }}
        >
          <LanguageSelector />
          <SignedOut>
            <SignInButton>
              <Button
                variant={"ghost"}
                size="icon"
                className="rounded-full hover:bg-primary"
              >
                <User />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
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
