import Image from "next/image";
import { FormSubscribeNewsletter } from "@/components/subscribe-newsletter";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 px-4  mt-auto lg:px-0 bg-card ">
      <div className="container  flex flex-col items-center justify-between gap-4 mx-auto md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <Link
              href="https://www.instagram.com/ashleydianaleon?igsh=MWhnMnozZWlhd2Z0bA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </Link>

            {/* TikTok */}
            <Link
              href="https://www.tiktok.com/@raicesreturnings?_r=1&_t=ZP-91GXu9vLIMx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary"
              aria-label="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M19.321 5.562a5.123 5.123 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.286-1.926-1.355-3.338H12.5v11.967c0 1.334-1.09 2.424-2.424 2.424S7.652 14.301 7.652 12.967c0-1.334 1.09-2.424 2.424-2.424.178 0 .352.019.519.055V6.556a6.43 6.43 0 0 0-.519-.021c-3.54 0-6.424 2.884-6.424 6.424s2.884 6.424 6.424 6.424 6.424-2.884 6.424-6.424V9.225c1.378.872 2.984 1.338 4.635 1.338v-4c-1.076 0-2.078-.347-2.865-.997v-.004z" />
              </svg>
            </Link>

            {/* Shop */}
            <Link
              href="https://raices-and-returnings.printify.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary"
              aria-label="Shop"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </Link>

            {/* Substack */}
            <Link
              href="https://substack.com/@ashleyleon?r=5jsm1y&utm_medium=ios&utm_source=profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary"
              aria-label="Substack"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
              </svg>
            </Link>

            <ModeToggle />
          </div>
        </div>
        <FormSubscribeNewsletter />
        <div className="flex items-center">
          <div className="relative w-[80px] h-[50px]">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              sizes="80px"
              className="object-contain  dark:[filter:brightness(0)_invert(1)]"
            />
          </div>
        </div>
      </div>
      <p className="text-center text-sm  my-10 text-foreground/60">
        &copy; 2023-{new Date().getFullYear()}{" "}
        <a href="#" className="hover:underline" target="_blank">
          @decscode
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
