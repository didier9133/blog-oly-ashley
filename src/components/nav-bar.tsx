import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ItemsNavBar } from "./items-nav-bar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { User } from "lucide-react";

export async function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b lg:justify-center"
      style={{
        background: "var(--card)",
      }}
    >
      <nav
        className="container flex  items-center justify-between mx-2 px-4 md:mx-20 md:p-0 gap-8 font-[family-name:var(--font-cormorant-garamond)]"
        style={{
          margin: "0 auto",
        }}
      >
        <SidebarTrigger className="-ml-1 md:hidden" />
        <Link href="/">
          <div className="relative w-[70px] h-[64px] md:w-[100px] cursor-pointer">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 80px, (max-width: 1200px) 100px, 100px"
              className="object-contain"
            />
          </div>
        </Link>

        <ItemsNavBar />

        <div
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
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
        </div>
      </nav>
    </header>
  );
}
