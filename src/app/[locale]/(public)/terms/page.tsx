import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";
import {
  indexableRobots,
  localizedAlternates,
  localizedOpenGraph,
} from "@/lib/seo";
import { fullUrl, ogImageUrl } from "@/lib/url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title =
    locale === "es"
      ? "Términos y condiciones | Ashley Leon"
      : "Terms of Service | Ashley Leon";
  const description =
    locale === "es"
      ? "Lee los términos que regulan el uso del sitio de Ashley Leon, sus contenidos, compras digitales, propiedad intelectual y responsabilidades."
      : "Read the terms governing use of Ashley Leon's website, its content, digital purchases, intellectual property, and user responsibilities.";
  const image = ogImageUrl(locale);
  const imageAlt = t("ogImageAlt");

  return {
    title,
    description,
    robots: indexableRobots,
    openGraph: {
      ...localizedOpenGraph(locale),
      type: "website",
      title,
      description,
      url: fullUrl(locale, "/terms"),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
    alternates: localizedAlternates(locale, { en: "/terms", es: "/terms" }),
  };
}

const SECTION_KEYS = [
  "acceptance",
  "useOfSite",
  "intellectualProperty",
  "userConduct",
  "purchases",
  "thirdParty",
  "disclaimers",
  "liability",
  "indemnification",
  "termination",
  "governingLaw",
  "changes",
] as const;

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return (
    <main className="min-h-screen px-4 py-10 sm:py-20">
      <div className="container max-w-4xl mx-auto font-[family-name:var(--font-cormorant-garamond)]">
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-semibold text-primary">
            {t("title")}
          </h1>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {t("lastUpdatedLabel")} {t("lastUpdatedDate")}
          </p>
          <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
        </header>

        <div className="mt-10 space-y-8">
          {SECTION_KEYS.map((sectionKey) => (
            <section key={sectionKey} className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
                {t(`sections.${sectionKey}.title`)}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                {t(`sections.${sectionKey}.body`)}
              </p>
            </section>
          ))}

          <section className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
              {t("sections.contact.title")}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
              {t("sections.contact.body")}
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
              <a
                href={`mailto:${CONTACT_NOTIFICATION_EMAIL}`}
                className="underline underline-offset-4 hover:text-primary transition-colors"
              >
                {CONTACT_NOTIFICATION_EMAIL}
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href={`/${locale}`}
            className="text-sm uppercase tracking-wide text-muted-foreground hover:text-primary transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
