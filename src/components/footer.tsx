import Image from "next/image";
import { FormSubscribeNewsletter } from "@/components/subscribe-newsletter";
import Link from "next/link";
import { Instagram, Youtube, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";
import { localizedHref } from "@/lib/url";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = useLocale();
  const t = useTranslations("footer");
  const navT = useTranslations("navigation");
  const href = (path: string) => localizedHref(locale, path);

  return (
    <footer className="mt-auto flex flex-col w-full">
      {/* Top Section: Newsletter with Background Image */}
      <div
        id="newsletter"
        className="relative w-full py-24 md:py-32 overflow-hidden bg-[#6b705c]"
      >
        <Image
          src="/new_logo.webp"
          alt=""
          fill
          className="object-cover opacity-15"
          loading="lazy"
        />
        {/* Olive green overlay */}
        <div className="absolute inset-0 bg-[#6b705c]/90"></div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center text-white">
          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-4xl md:text-6xl mb-6 font-medium text-white">
            {t("stay-in-loop")}
          </h2>
          <div className="max-w-2xl mx-auto text-white mb-8 font-sans text-sm md:text-base leading-relaxed text-center">
            {t.rich("newsletter-desc", {
              title: (chunks) => (
                <p className="font-semibold text-white mt-8 mb-4 text-lg tracking-wide">
                  {chunks}
                </p>
              ),
              list: (chunks) => (
                <ul className="flex flex-col items-start w-full max-w-md mx-auto space-y-2 text-left">
                  {chunks}
                </ul>
              ),
              item: (chunks) => (
                <li className="flex items-start text-white w-full">
                  <span className="mr-2 text-white shrink-0">•</span>
                  <span className="break-words">{chunks}</span>
                </li>
              ),
            })}
          </div>

          <div className="w-full max-w-md mx-auto">
            <FormSubscribeNewsletter
              showLabel={false}
              variant="transparent"
              className="w-full"
            />
          </div>

        </div>
      </div>

      {/* Bottom Section: Dark Footer */}
      <div className="bg-[#2b2b2b] text-white/80 pt-20 pb-8">
        <div className="container mx-auto px-4 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-12 lg:col-span-6 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="font-[family-name:var(--font-great-vibes)] text-4xl text-white">
                Ashley Leon
              </h3>
              <p className="text-sm leading-relaxed font-sans max-w-md text-white/70">
                {t("brand-desc")}
              </p>

              <div className="flex items-center gap-5 pt-4">
                <SocialLink
                  href="https://www.instagram.com/ashleyleon"
                  label={t("social.instagram")}
                >
                  <Instagram className="w-5 h-5" />
                </SocialLink>
                <SocialLink
                  href="https://www.youtube.com/@ashleyleon"
                  label={t("social.youtube")}
                >
                  <Youtube className="w-5 h-5" />
                </SocialLink>
                <SocialLink
                  href="https://ashleyleon.substack.com"
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
              <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
                <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white">
                  {t("explore")}
                </h4>
                <ul className="space-y-4 text-sm font-sans text-white/70">
                  <li>
                    <Link href={href("/writing")} className="hover:text-white transition-colors">
                      {navT("writing")}
                    </Link>
                  </li>
                  {locale === "en" ? (
                    <li>
                      <Link
                        href={href("/deconstructing-christianity")}
                        className="transition-colors hover:text-white"
                      >
                        {navT("deconstructing-christianity-full")}
                      </Link>
                    </li>
                  ) : null}
                  <li>
                    <Link href={href("/workbooks")} className="hover:text-white transition-colors">
                      {navT("workbooks")}
                    </Link>
                  </li>
                  <li>
                    <Link href={href("/circle")} className="hover:text-white transition-colors">
                      {navT("circle")}
                    </Link>
                  </li>
                  <li>
                    <Link href={href("/community")} className="hover:text-white transition-colors">
                      {navT("community")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
                <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-white">
                  {t("company")}
                </h4>
                <ul className="space-y-4 text-sm font-sans text-white/70">
                  <li>
                    <Link href={href("/about")} className="hover:text-white transition-colors">
                      {navT("about")}
                    </Link>
                  </li>
                  <li>
                    <Link href={href("/contact")} className="hover:text-white transition-colors">
                      {navT("contact")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`${href("/")}#newsletter`} className="hover:text-white transition-colors">
                      {navT("subscribe")}
                    </Link>
                  </li>
                  <li>
                    <Link href={href("/privacy")} className="hover:text-white transition-colors">
                      {t("privacy")}
                    </Link>
                  </li>
                  <li>
                    <Link href={href("/terms")} className="hover:text-white transition-colors">
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
              &copy; {currentYear} Ashley Leon. {t("rights-reserved")}
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-center">
              <a
                href={`mailto:${CONTACT_NOTIFICATION_EMAIL}`}
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
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
