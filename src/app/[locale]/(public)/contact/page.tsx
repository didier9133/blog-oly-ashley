import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fullUrl, BASE_URL, ogImageUrl } from "@/lib/url";
import { JsonLd } from "@/components/json-ld";
import { localizedAlternates } from "@/lib/seo";
import ContactForm from "./contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: fullUrl(locale, "/contact"),
      images: [ogImageUrl(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImageUrl(locale)],
    },
    alternates: localizedAlternates(locale, { en: "/contact", es: "/contact" }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("metadata.title"),
    description: t("metadata.description"),
    url: fullUrl(locale, "/contact"),
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "Ashley Leon",
      url: BASE_URL,
    },
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-cormorant-garamond)] bg-[#F9F8F6]">
      <JsonLd data={jsonLd} />

      {/* Header */}
      <div className="bg-[#f5f0eb] py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <span className="text-[#d8a08b] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground italic leading-tight transition-all duration-700 ease-out hover:tracking-wide mb-6">
              {t("title")}
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] max-w-2xl mx-auto">
              {t("paragraph")}
            </p>
          </div>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
