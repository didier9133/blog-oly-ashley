import Image from "next/image";
import { FormSubscribeNewsletter } from "@/components/subscribe-newsletter";
import Link from "next/link";
import { Instagram, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const navT = useTranslations("navigation");

  return (
    <footer className="bg-[#fcfbf9] border-t border-[#e5e0dc] pt-20 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-20">
        {/* Newsletter Section - Hero Style in Footer */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto mb-20">
          <div className="space-y-3">
            <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl md:text-5xl font-medium text-[#c47456]">
              {t("stay-in-loop")}
            </h3>
            <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              {t("newsletter-desc")}
            </p>
          </div>

          <div className="w-full pt-2">
            <FormSubscribeNewsletter
              showLabel={false}
              className="max-w-md mx-auto"
            />
          </div>
        </div>

        <div className="border-t border-[#e5e0dc]/60 w-full mb-16"></div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-4 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="inline-block relative w-[100px] h-[60px]">
              <Image
                src="/logo.svg"
                alt="Raices & Returnings Logo"
                fill
                sizes="100px"
                className="object-contain object-center lg:object-left"
              />
            </Link>
            <p className="text-sm text-muted-foreground/80 leading-relaxed font-sans max-w-sm">
              {t("brand-desc")}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5 pt-2">
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
                href="https://raices-and-returnings.printify.me/"
                label={t("social.shop")}
              >
                <ShoppingBag className="w-5 h-5" />
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

          {/* Navigation Links */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 pt-4">
            {/* Explore */}
            <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
              <FooterHeading>{t("explore")}</FooterHeading>
              <ul className="space-y-3 text-sm text-foreground/80 font-sans">
                <FooterLink href="/blog">{navT("blog")}</FooterLink>
                <FooterLink href="/recipes">{navT("recipes")}</FooterLink>
                <FooterLink href="/ebook">{navT("ebook")}</FooterLink>
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
              <FooterHeading>{t("company")}</FooterHeading>
              <ul className="space-y-3 text-sm text-foreground/80 font-sans">
                <FooterLink href="/about">{navT("about")}</FooterLink>
                <FooterLink href="/contact">{navT("contact")}</FooterLink>
                <FooterLink href="/privacy">{t("privacy")}</FooterLink>
                <FooterLink href="/terms">{t("terms")}</FooterLink>
              </ul>
            </div>

            {/* Support / Legal */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1 items-center md:items-start text-center md:text-left mt-8 md:mt-0">
              <FooterHeading>{t("connect")}</FooterHeading>
              <ul className="space-y-3 text-sm text-foreground/80 font-sans">
                <li className="text-muted-foreground">
                  <a
                    href={`mailto:${CONTACT_NOTIFICATION_EMAIL}`}
                    className="hover:text-[#c47456] transition-colors duration-200"
                  >
                    {CONTACT_NOTIFICATION_EMAIL}
                  </a>
                </li>
                <li className="text-muted-foreground">{t("based-in")}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-[#e5e0dc] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-widest text-[#8a8a78] font-medium">
          <p>
            &copy; {currentYear} Raíces & Returnings. {t("rights-reserved")}
          </p>
          <p className="hidden md:block">
            {t("designed-by")}{" "}
            <a href="#" target="_blank" className="hover:text-[#c47456]">
              Decscode
            </a>
          </p>
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
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#e5e0dc] text-foreground/70 hover:bg-[#c47456] hover:text-white hover:border-[#c47456] transition-all duration-300"
    >
      {children}
    </a>
  );
}
