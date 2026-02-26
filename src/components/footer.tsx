import Image from "next/image";
import { FormSubscribeNewsletter } from "@/components/subscribe-newsletter";
import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const navT = useTranslations("navigation");

  return (
    <footer className="mt-auto flex flex-col w-full">
      {/* Top Section: Newsletter with Background Image */}
      <div id="newsletter" className="relative w-full py-24 md:py-32 overflow-hidden">
        <Image
          src="/background-image.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Olive green overlay */}
        <div className="absolute inset-0 bg-[#6b705c]/85"></div>
        
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center text-white">
          <span className="text-xs font-bold tracking-[0.2em] uppercase mb-4 opacity-90 font-sans">
            {t("join-community")}
          </span>
          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-4xl md:text-6xl mb-6 font-medium">
            {t("stay-in-loop")}
          </h2>
          <p className="max-w-xl mx-auto text-white/90 mb-8 font-sans text-sm md:text-base leading-relaxed whitespace-pre-line text-left sm:text-center">
            {t("newsletter-desc")}
          </p>
          
          <div className="w-full max-w-md mx-auto">
            <FormSubscribeNewsletter
              showLabel={false}
              variant="transparent"
              className="w-full"
            />
          </div>
          
          <p className="text-xs text-white/70 mt-6 font-sans">
            {t("respect-inbox")}
          </p>
        </div>
      </div>

      {/* Bottom Section: Dark Footer */}
      <div className="bg-[#2b2b2b] text-white/80 pt-20 pb-8">
        <div className="container mx-auto px-4 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-12 lg:col-span-6 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl text-white">
                Raíces & Returnings
              </h3>
              <p className="text-sm leading-relaxed font-sans max-w-md text-white/70">
                {t("brand-desc")}
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-5 pt-4">
                <SocialLink
                  href="https://www.instagram.com/ashleydianaleon"
                  label={t("social.instagram")}
                >
                  <Instagram className="w-5 h-5" />
                </SocialLink>
                <SocialLink
                  href="https://www.tiktok.com/@raicesreturnings"
                  label={t("social.tiktok")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M19.321 5.562a5.123 5.123 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.286-1.926-1.355-3.338H12.5v11.967c0 1.334-1.09 2.424-2.424 2.424S7.652 14.301 7.652 12.967c0-1.334 1.09-2.424 2.424-2.424.178 0 .352.019.519.055V6.556a6.43 6.43 0 0 0-.519-.021c-3.54 0-6.424 2.884-6.424 6.424s2.884 6.424 6.424 6.424 6.424-2.884 6.424-6.424V9.225c1.378.872 2.984 1.338 4.635 1.338v-4c-1.076 0-2.078-.347-2.865-.997v-.004z" />
                  </svg>
                </SocialLink>
                <SocialLink
                  href="https://www.youtube.com/@WhispersfortheInBetween"
                  label={t("social.youtube")}
                >
                  <Youtube className="w-5 h-5" />
                </SocialLink>
                <SocialLink
                  href="https://substack.com/@ashleyleon"
                  label={t("social.substack")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                  </svg>
                </SocialLink>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-12 lg:col-span-6 grid grid-cols-2 gap-8">
              {/* Explore */}
              <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
                <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white">
                  {t("explore")}
                </h4>
                <ul className="space-y-4 text-sm font-sans text-white/70">
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">
                      {navT("blog")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/recipes" className="hover:text-white transition-colors">
                      {navT("recipes")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/ebook" className="hover:text-white transition-colors">
                      {navT("ebook")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
                <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white">
                  {t("company")}
                </h4>
                <ul className="space-y-4 text-sm font-sans text-white/70">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      {navT("about")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      {navT("contact")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      {t("privacy")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      {t("terms")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-white/50">
            <p>
              &copy; {currentYear} Raíces & Returnings. {t("rights-reserved")}
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-center">
              <a
                href={`mailto:${CONTACT_NOTIFICATION_EMAIL}`}
                className="hover:text-white transition-colors"
              >
                {CONTACT_NOTIFICATION_EMAIL}
              </a>
              <span>{t("based-in")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-[family-name:var(--font-cormorant-garamond)] text-lg font-semibold text-[#2b2b2b]">
      {children}
    </h4>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="hover:text-[#c47456] transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white hover:text-[#2b2b2b] hover:border-white transition-all duration-300"
    >
      {children}
    </a>
  );
}
