import Image from "next/image";
import { FormSubscribeNewsletter } from "@/components/subscribe-newsletter";
import Link from "next/link";
import { Download, Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";
import { localizedHref } from "@/lib/url";
import { BrandWordmark } from "@/components/brand-wordmark";

export async function Footer({ locale }: { locale: string }) {
  const currentYear = new Date().getFullYear();
  const [t, navT] = await Promise.all([
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "navigation" }),
  ]);
  const href = (path: string) => localizedHref(locale, path);

  return (
    <footer className="mt-auto flex flex-col w-full">
      {/* Top Section: Free guide lead magnet */}
      <div
        id="newsletter"
        className="relative w-full overflow-hidden bg-[#62684f] py-20 md:py-28"
      >
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute -left-24 bottom-[-12rem] size-[28rem] rounded-full border border-[#f1c8b7]/20" />
        <div className="absolute -right-44 top-[-14rem] size-[34rem] rounded-full bg-[#bd775c]/15 blur-3xl" />

        <div className="relative z-10 container mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[0.72fr_1.28fr] md:gap-16 md:px-10 lg:gap-24">
          <div className="relative mx-auto w-[12.5rem] sm:w-[15rem] md:w-full md:max-w-[17rem]">
            <div className="absolute -inset-4 translate-x-5 translate-y-5 rotate-3 border border-[#e8ddcc]/25 bg-[#4e5340]" />
            <div className="relative -rotate-2 overflow-hidden rounded-[2px] bg-[#f2eee6] shadow-[0_28px_70px_rgba(24,25,19,0.42)] transition-transform duration-700 hover:rotate-0 hover:scale-[1.015] motion-reduce:transform-none">
              <Image
                src="/which-binary-guide-cover.jpg"
                alt={t("lead-magnet-cover-alt")}
                width={612}
                height={792}
                sizes="(max-width: 767px) 240px, 272px"
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
            <span className="absolute -bottom-5 -right-5 inline-flex size-14 items-center justify-center rounded-full bg-[#bd775c] text-white shadow-lg sm:size-16">
              <Download className="size-5 sm:size-6" aria-hidden="true" />
            </span>
          </div>

          <div className="text-center text-white md:text-left">
            <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#efc8b8]">
              {t("lead-magnet-eyebrow")}
            </p>
            <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-[2.75rem] font-medium leading-[0.98] text-white sm:text-5xl lg:text-6xl">
              {t("stay-in-loop")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lora)] text-sm leading-7 text-[#f7f2e8]/85 sm:text-base md:mx-0">
              {t("newsletter-desc")}
            </p>
            <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#e8ddcc]">
              {t("lead-magnet-details")}
            </p>

            <FormSubscribeNewsletter
              showLabel={false}
              variant="transparent"
              className="mt-8 w-full"
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
              <h3>
                <BrandWordmark className="text-[3.25rem] !text-white" />
              </h3>
              <p className="text-sm leading-relaxed font-sans max-w-md text-white/70">
                {t("brand-desc")}
              </p>

              <div className="flex items-center gap-5 pt-4">
                <SocialLink
                  href="https://www.instagram.com/ashleydianaleon"
                  label={t("social.instagram")}
                >
                  <Instagram className="w-5 h-5" />
                </SocialLink>
                <SocialLink
                  href="https://www.facebook.com/ashley.leon.684699"
                  label={t("social.facebook")}
                >
                  <Facebook className="w-5 h-5" />
                </SocialLink>
                <SocialLink
                  href="https://www.youtube.com/@ashleydianaleon"
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
