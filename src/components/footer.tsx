import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";
import { localizedHref } from "@/lib/url";
import { BrandWordmark } from "@/components/brand-wordmark";
import { FooterChurchHurtGuideCta } from "@/components/footer-church-hurt-guide-cta";

export async function Footer({ locale }: { locale: string }) {
  const currentYear = new Date().getFullYear();
  const [t, navT] = await Promise.all([
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "navigation" }),
  ]);
  const href = (path: string) => localizedHref(locale, path);
  const churchHurtGuideHref = localizedHref(locale, "/church-hurt-guide");

  return (
    <footer className="mt-auto flex flex-col w-full">
      <FooterChurchHurtGuideCta
        href={churchHurtGuideHref}
        eyebrow={t("lead-magnet-landing-eyebrow")}
        title={t("lead-magnet-landing-title")}
        description={t("lead-magnet-landing-desc")}
        cta={t("lead-magnet-landing-cta")}
        coverAlt={t("lead-magnet-cover-alt")}
      />

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
                    <Link
                      href={href("/writing")}
                      className="hover:text-white transition-colors"
                    >
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
                    <Link
                      href={href("/workbooks")}
                      className="hover:text-white transition-colors"
                    >
                      {navT("workbooks")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={href("/circle")}
                      className="hover:text-white transition-colors"
                    >
                      {navT("circle")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={href("/community")}
                      className="hover:text-white transition-colors"
                    >
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
                    <Link
                      href={href("/about")}
                      className="hover:text-white transition-colors"
                    >
                      {navT("about")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={href("/contact")}
                      className="hover:text-white transition-colors"
                    >
                      {navT("contact")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`${href("/")}#newsletter`}
                      className="hover:text-white transition-colors"
                    >
                      {navT("subscribe")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={href("/privacy")}
                      className="hover:text-white transition-colors"
                    >
                      {t("privacy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={href("/terms")}
                      className="hover:text-white transition-colors"
                    >
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
