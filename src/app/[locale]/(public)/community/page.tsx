import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fullUrl, BASE_URL } from "@/lib/url";
import { JsonLd } from "@/components/json-ld";
import { localizedAlternates } from "@/lib/seo";
import { ViewItemAnalytics } from "@/components/ecommerce-analytics";
import { OFFER_OG_IMAGES } from "@/lib/offer-og-images";
import { websiteRef } from "@/lib/schema-entities";

const COMMUNITY_URL =
  "https://www.gokollab.com/the-in-between-4dzfnm/home";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Community.metadata" });
  const image = OFFER_OG_IMAGES.community;
  const imageUrl = `${BASE_URL}${image.path}`;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: fullUrl(locale, "/community"),
      images: [
        {
          url: imageUrl,
          width: image.width,
          height: image.height,
          alt: image.alt,
          type: image.contentType,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [{ url: imageUrl, alt: image.alt }],
    },
    alternates: localizedAlternates(locale, {
      en: "/community",
      es: "/community",
    }),
  };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Community" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("metadata.title"),
    description: t("metadata.description"),
    url: fullUrl(locale, "/community"),
    inLanguage: locale,
    isPartOf: websiteRef,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: fullUrl(locale, "") },
      { "@type": "ListItem", position: 2, name: "The In-Between", item: fullUrl(locale, "/community") },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F9F8F6] font-[family-name:var(--font-cormorant-garamond)]">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <ViewItemAnalytics
        itemId="the-in-between"
        itemName="The In-Between"
        itemCategory="community"
        locale={locale}
      />

      {/* Header */}
      <section className="bg-[#f5f0eb] py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[#d8a08b] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
            {t("eyebrow")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground italic leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] max-w-2xl mx-auto">
            {t("lead")}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <p className="text-lg sm:text-xl leading-relaxed text-foreground/80 font-[family-name:var(--font-lora)]">
            {t("paragraph")}
          </p>

          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-light italic text-foreground">
              {t("inside-heading")}
            </h2>
            <ul className="space-y-4">
              {(["inside-1", "inside-2", "inside-3"] as const).map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-3 text-lg leading-relaxed text-foreground/80 font-[family-name:var(--font-lora)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d8a08b]"
                  />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <a
              href={COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-[#d8a08b] px-8 py-4 text-base text-white transition-all duration-300 hover:bg-[#c28c77] font-[family-name:var(--font-lora)] shadow-sm"
            >
              {t("cta")}
              <span aria-hidden="true">→</span>
            </a>
            <p className="mt-5 text-sm text-foreground/50 font-[family-name:var(--font-lora)] italic">
              {t("footnote")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
