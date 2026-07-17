import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { fullUrl, ogImageUrl } from "@/lib/url";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { getPersonSchema, personRef, websiteRef } from "@/lib/schema-entities";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, tSite] = await Promise.all([
    getTranslations({ locale, namespace: "About.metadata" }),
    getTranslations({ locale, namespace: "metadata" }),
  ]);
  const title = t("title");
  const description = t("description");
  const image = ogImageUrl(locale);
  const imageAlt = tSite("ogImageAlt");

  return {
    title,
    description,
    openGraph: {
      ...localizedOpenGraph(locale),
      type: "website",
      title,
      description,
      url: fullUrl(locale, "/about"),
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
    alternates: localizedAlternates(locale, { en: "/about", es: "/about" }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${fullUrl(locale, "/about")}#profile-page`,
    name: t("metadata.title"),
    description: t("metadata.description"),
    url: fullUrl(locale, "/about"),
    inLanguage: locale,
    isPartOf: websiteRef,
    mainEntity: personRef,
  };

  return (
    <>
      <JsonLd data={aboutPageSchema} />
      <JsonLd data={getPersonSchema(locale)} />
      <main className="min-h-screen bg-[#F9F8F6] font-[family-name:var(--font-cormorant-garamond)] py-16 lg:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <section className="w-full flex flex-col md:flex-row items-stretch gap-12 lg:gap-20">
            <div className="w-full md:w-1/2 group transition-all duration-700 flex items-center">
              <Image
                src="/profile4.jpeg"
                alt={t("image-alt")}
                width={800}
                height={1000}
                className="rounded-sm shadow-sm object-cover w-full h-auto aspect-[4/5] scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                priority
              />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
              <span className="text-[#d8a08b] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
                {t("eyebrow")}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground italic leading-tight mb-8">
                {t("title")}
              </h1>
              <div className="space-y-6 text-left">
                <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] whitespace-pre-line">
                  {t("paragraph-1")}
                </p>
                <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] whitespace-pre-line">
                  {t("paragraph-2")}
                </p>
                <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] whitespace-pre-line">
                  {t("paragraph-3")}
                </p>
                <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] whitespace-pre-line">
                  {t("paragraph-4")}
                </p>
              </div>
              <div className="mt-10">
                <Link
                  href={
                    locale === "es"
                      ? "/es/workbooks/reconstruyendo-la-reverencia"
                      : "/en/workbooks/rebuilding-reverence"
                  }
                  className="inline-flex items-center gap-2 rounded-sm bg-[#d8a08b] px-8 py-4 text-base text-white transition-all duration-300 hover:bg-[#c28c77] font-[family-name:var(--font-lora)] shadow-sm"
                >
                  {t("cta")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
