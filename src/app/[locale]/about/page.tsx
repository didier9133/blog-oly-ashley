import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

const BASE_URL = "https://www.raicesreturnings.com";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/about`,
      images: [`${BASE_URL}/og-image.jpeg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        en: `${BASE_URL}/en/about`,
        es: `${BASE_URL}/es/about`,
        "x-default": `${BASE_URL}/en/about`,
      },
    },
  };
}

export default async function Page() {
  const t = await getTranslations("About");
  const locale = await getLocale();
  const pageUrl = `${BASE_URL}/${locale}/about`;

  const ashleySchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ashley León",
    url: `${pageUrl}#ashley`,
    jobTitle: "Writer & Spiritual Guide",
    worksFor: {
      "@type": "Organization",
      name: "Raíces & Returnings",
      url: BASE_URL,
    },
    sameAs: [BASE_URL],
  };

  const olySchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Oly Contreras",
    url: `${pageUrl}#oly`,
    jobTitle: "Recipe Developer & Co-founder",
    worksFor: {
      "@type": "Organization",
      name: "Raíces & Returnings",
      url: BASE_URL,
    },
    sameAs: [BASE_URL],
  };

  return (
    <>
      <JsonLd data={ashleySchema} />
      <JsonLd data={olySchema} />
      <div className="container max-w-6xl mx-auto flex flex-col items-center min-h-screen px-6 py-16 sm:py-24 font-[family-name:var(--font-cormorant-garamond)]">
        {/* SECCIÓN 1: About Raíces & Returnings */}
        <section className="w-full flex flex-col md:flex-row items-stretch gap-12 lg:gap-20 mb-24">
          <div className="w-full md:w-1/2 group transition-all duration-700 flex items-center">
            <Image
              src="/teamphoto2.jpeg"
              alt={t("image-alt")}
              width={800}
              height={600}
              className="rounded-sm shadow-sm object-cover w-full h-auto aspect-[4/3] scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              priority
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-light mb-8 text-[#de9e86] italic leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] text-left whitespace-pre-line">
              {t("intro")}
            </p>
          </div>
        </section>

        {/* SECCIÓN 2: Ashley */}
        <section className="w-full flex flex-col-reverse md:flex-row items-stretch gap-12 lg:gap-20 mb-24">
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
            <h3 className="text-4xl sm:text-5xl font-light mb-2 text-foreground italic">
              Ashley
            </h3>
            <span className="text-[#de9e86] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
              {t("description-ashley")}
            </span>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] text-left whitespace-pre-line">
              {t("description-paragraph-ashley")}
            </p>
          </div>
          <div className="w-full md:w-1/2 group transition-all duration-700 flex items-center">
            <Image
              src="/profile4.jpeg"
              alt="Ashley"
              width={800}
              height={600}
              className="rounded-sm shadow-sm object-cover w-full h-auto aspect-[4/5] scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              priority
            />
          </div>
        </section>

        {/* SECCIÓN 3: Olydi */}
        <section className="w-full flex flex-col md:flex-row items-stretch gap-12 lg:gap-20 mb-24">
          <div className="w-full md:w-1/2 group transition-all duration-700 flex items-center">
            <Image
              src="/profile3.jpeg"
              alt="Olydi"
              width={800}
              height={600}
              className="rounded-sm shadow-sm object-cover w-full h-auto aspect-[4/5] scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              priority
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
            <h3 className="text-4xl sm:text-5xl font-light mb-2 text-foreground italic">
              Olydi
            </h3>
            <span className="text-[#de9e86] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
              {t("description-oly")}
            </span>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] text-left whitespace-pre-line">
              {t("description-paragraph-oly")}
            </p>
          </div>
        </section>

        {/* SECCIÓN 4: Conclusión */}
        <section className="w-full max-w-3xl mx-auto text-center mt-12 mb-24 px-4">
          <p className="text-xl sm:text-2xl text-foreground/90 leading-relaxed font-[family-name:var(--font-lora)] whitespace-pre-line italic [&>span]:whitespace-nowrap">
            {t.rich("conclusion", {
              nowrap: (chunks) => <span>{chunks}</span>,
            })}
          </p>
        </section>
      </div>
    </>
  );
}
