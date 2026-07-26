import type { Metadata } from "next";
import Image from "next/image";
import { ChurchHurtGuideForm } from "@/components/church-hurt-guide-form";
import { JsonLd } from "@/components/json-ld";
import {
  indexableRobots,
  localizedAlternates,
  localizedOpenGraph,
  type SupportedLocale,
} from "@/lib/seo";
import { personRef, websiteRef } from "@/lib/schema-entities";
import { fullUrl, ogImageUrl } from "@/lib/url";

const PATH = "/church-hurt-guide";
const PATHS = { en: PATH, es: PATH } as const;

const COPY = {
  en: {
    metadataTitle: "Church Hurt Reflection Guide | Free PDF | Ashley Leon",
    metadataDescription:
      "A free reflection guide for naming the tension church hurt can leave between faith, identity, and belonging—without pressure or a prescribed conclusion.",
    keywords: [
      "church hurt",
      "church hurt reflection guide",
      "faith after church hurt",
      "religious deconstruction",
    ],
    ogAlt:
      "Which Binary Are You Standing In? — a free church hurt reflection guide by Ashley Leon",
    eyebrow: "Free · Five short reflections",
    headline: "When Faith, Identity, and Belonging Stop Fitting Together",
    supporting:
      "Every next step can start to feel like choosing a side — stay or leave, believe or doubt, forgive or walk away. This free reflection guide helps you name the tension underneath it, without telling you what to believe or where your questions should lead.",
    bridge:
      "— five short reflections. Start with the one that sounds most like your life right now.",
    coverAlt: "Cover of Which Binary Are You Standing In? by Ashley Leon",
    aboutName: "Church hurt",
    guideDescription:
      "A free five-reflection guide for naming the tension church hurt can leave between faith, identity, and belonging.",
  },
  es: {
    metadataTitle: "Dolor vivido en la iglesia | Guía gratuita | Ashley Leon",
    metadataDescription:
      "Una guía gratuita para ponerle nombre a la tensión entre fe, identidad y pertenencia después de una experiencia dolorosa en la iglesia, sin respuestas impuestas.",
    keywords: [
      "dolor vivido en la iglesia",
      "heridas de la iglesia",
      "deconstrucción de la fe",
      "guía de reflexión sobre la fe",
    ],
    ogAlt:
      "Which Binary Are You Standing In? — guía gratuita de reflexión de Ashley Leon",
    eyebrow: "Gratis · Cinco reflexiones breves",
    headline: "Cuando la fe, la identidad y la pertenencia dejan de encajar",
    supporting:
      "Cada paso puede sentirse como si tuvieras que elegir un lado: quedarte o irte, creer o dudar, perdonar o alejarte. Esta guía de reflexión gratuita te ayuda a ponerle nombre a la tensión que hay debajo, sin decirte qué creer ni hacia dónde deberían llevarte tus preguntas.",
    bridge:
      "— cinco reflexiones breves. Empieza por la que más se parezca a lo que estás viviendo hoy.",
    coverAlt: "Portada de Which Binary Are You Standing In? de Ashley Leon",
    aboutName: "Dolor causado por experiencias en la iglesia",
    guideDescription:
      "Una guía gratuita con cinco reflexiones para reconocer la tensión entre la fe, la identidad y el sentido de pertenencia después de una experiencia dolorosa en la iglesia.",
  },
} as const satisfies Record<SupportedLocale, Record<string, unknown>>;

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: SupportedLocale = locale === "es" ? "es" : "en";
  const copy = COPY[currentLocale];
  const image = ogImageUrl(currentLocale);

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    keywords: [...copy.keywords],
    authors: [{ name: "Ashley Leon" }],
    creator: "Ashley Leon",
    publisher: "Ashley Leon",
    robots: indexableRobots,
    alternates: localizedAlternates(currentLocale, PATHS),
    openGraph: {
      type: "website",
      ...localizedOpenGraph(currentLocale),
      url: fullUrl(currentLocale, PATH),
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: copy.ogAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      images: [
        {
          url: image,
          alt: copy.ogAlt,
        },
      ],
    },
  };
}

export default async function ChurchHurtGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: SupportedLocale = locale === "es" ? "es" : "en";
  const copy = COPY[currentLocale];
  const pageUrl = fullUrl(currentLocale, PATH);
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: copy.headline,
    description: copy.metadataDescription,
    url: pageUrl,
    inLanguage: currentLocale,
    isPartOf: websiteRef,
    about: {
      "@type": "Thing",
      name: copy.aboutName,
    },
    mainEntity: {
      "@id": `${pageUrl}#guide`,
    },
  };
  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "@id": `${pageUrl}#guide`,
    name: "Which Binary Are You Standing In?",
    description: copy.guideDescription,
    url: pageUrl,
    inLanguage: "en",
    isAccessibleForFree: true,
    numberOfPages: 9,
    author: personRef,
  };

  return (
    <>
      <JsonLd data={pageSchema} />
      <JsonLd data={guideSchema} />

      <main
        data-page="church-hurt-guide"
        className="min-h-svh bg-[#f2ece4] text-[#27231f]"
      >
        <section
          aria-labelledby="church-hurt-guide-title"
          className="relative isolate overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute -left-48 top-24 size-[34rem] rounded-full border border-[#9b5941]/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-28 -top-36 size-[38rem] rounded-full bg-[#bd775c]/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,#6f655c_0.7px,transparent_0)] [background-size:28px_28px]"
          />

          <div className="relative mx-auto grid min-h-[calc(100svh-4.75rem)] max-w-[90rem] items-center gap-14 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.12fr)_minmax(19rem,0.7fr)] lg:gap-20 lg:px-12 lg:py-10 xl:gap-28">
            <div className="max-w-[47rem]">
              <p className="inline-flex items-center gap-3 font-sans text-[0.66rem] font-bold uppercase tracking-[0.23em] text-[#8f513b]">
                <span aria-hidden="true" className="h-px w-8 bg-[#8f513b]/60" />
                {copy.eyebrow}
              </p>

              <h1
                id="church-hurt-guide-title"
                className="mt-5 max-w-[16ch] font-[family-name:var(--font-cormorant-garamond)] text-[clamp(3.15rem,6.2vw,5rem)] font-light leading-[0.9] tracking-[-0.035em] text-balance"
              >
                {copy.headline}
              </h1>

              <p className="mt-6 max-w-[42rem] font-[family-name:var(--font-lora)] text-[1rem] leading-8 text-[#504a44] sm:text-[1.08rem]">
                {copy.supporting}
              </p>

              <div className="mt-7 max-w-[47rem]">
                <ChurchHurtGuideForm locale={currentLocale} />
              </div>

              <div className="my-7 h-px max-w-[42rem] bg-[#756b62]/18" />

              <p className="max-w-[42rem] font-[family-name:var(--font-lora)] text-sm leading-7 text-[#5d554e] sm:text-[0.95rem]">
                <em className="font-medium text-[#342f2a]">
                  Which Binary Are You Standing In?
                </em>{" "}
                {copy.bridge}
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[25rem] lg:mx-0 lg:justify-self-end">
              <div
                aria-hidden="true"
                className="absolute -inset-5 translate-x-6 translate-y-6 rotate-3 border border-[#62584f]/14 bg-[#ddd2c6]"
              />
              <div
                aria-hidden="true"
                className="absolute -left-12 top-20 hidden h-px w-20 bg-[#8f513b]/45 sm:block"
              />
              <figure className="relative -rotate-2 overflow-hidden bg-[#f5f0e8] shadow-[0_38px_90px_-42px_rgba(49,38,31,0.82)] transition-transform duration-700 motion-safe:hover:rotate-0 motion-safe:hover:scale-[1.01]">
                <Image
                  src="/which-binary-guide-cover.jpg"
                  alt={copy.coverAlt}
                  width={612}
                  height={792}
                  sizes="(max-width: 1023px) 400px, 25rem"
                  className="h-auto w-full"
                  priority
                />
              </figure>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
