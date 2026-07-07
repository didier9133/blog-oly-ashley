import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { fullUrl, BASE_URL, localizedHref } from "@/lib/url";
import { workbookPriceCents } from "@/lib/workbook-pricing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Workbooks" });

  return {
    title: t("metadata-title"),
    description: t("metadata-description"),
    openGraph: {
      title: t("metadata-title"),
      description: t("metadata-description"),
      url: fullUrl(locale, "/workbooks"),
      images: [`${BASE_URL}/og-image.jpeg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata-title"),
      description: t("metadata-description"),
    },
    alternates: {
      canonical: fullUrl(locale, "/workbooks"),
      languages: {
        en: fullUrl("en", "/workbooks"),
        es: fullUrl("es", "/workbooks"),
        "x-default": fullUrl("en", "/workbooks"),
      },
    },
  };
}

export default async function WorkbooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Workbooks" });

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
  if (books.length === 0) {
    return notFound();
  }

  const orderedBooks = [...books].sort((a, b) => {
    const aPrimary =
      a.slug_en === "rebuilding-reverence" ||
      a.slug_es === "reconstruyendo-la-reverencia";
    const bPrimary =
      b.slug_en === "rebuilding-reverence" ||
      b.slug_es === "reconstruyendo-la-reverencia";

    if (aPrimary === bPrimary) return 0;
    return aPrimary ? -1 : 1;
  });

  const workbookFaqs =
    locale === "en"
      ? [
          {
            q: "Is this a physical book or digital?",
            a: "A digital guided workbook you can start immediately.",
          },
          {
            q: "Do I need to still be religious to use it?",
            a: "No. It is for anyone in the in-between — leaving, questioning, rebuilding, or somewhere unnamed.",
          },
          {
            q: "Is this affirming of LGBTQ+ people?",
            a: "Fully. All of you belongs here — your body, your sexuality, your questions.",
          },
          {
            q: "Is this therapy?",
            a: "No. Ashley is a certified holistic mind-body coach, not a licensed therapist. This is reflective, coaching-based spiritual formation.",
          },
          {
            q: "Do I have to choose between my faith and my queerness to use Queer & Called?",
            a: "No. This work is about integration, not choosing. It is non-doctrinal and does not require you to belong to any tradition.",
          },
        ]
      : [
          {
            q: "¿Es un libro físico o digital?",
            a: "Es una guía práctica digital guiada que puedes comenzar de inmediato.",
          },
          {
            q: "¿Necesito seguir siendo religiosa para usarlo?",
            a: "No. Es para cualquier persona en El proceso: saliendo, cuestionando, reconstruyendo o en un lugar todavía sin nombre.",
          },
          {
            q: "¿Afirma a las personas LGBTQ+?",
            a: "Completamente. Todo de ti pertenece aquí: tu cuerpo, tu sexualidad y tus preguntas.",
          },
          {
            q: "¿Esto es terapia?",
            a: "No. Ashley es coach holística certificada de cuerpo-mente, no terapeuta licenciada. Este es un recurso reflexivo y basado en coaching.",
          },
          {
            q: "¿Tengo que elegir entre mi fe y mi queerness para usar Queer & Called?",
            a: "No. Este trabajo trata de integración, no de elegir. Es no doctrinal y no requiere que pertenezcas a ninguna tradición.",
          },
        ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("metadata-title"),
    description: t("metadata-description"),
    url: fullUrl(locale, "/workbooks"),
    mainEntity: orderedBooks.map((book) => ({
      "@type": "Product",
      name: locale === "en" ? book.title_en : book.title_es,
      description: locale === "en" ? book.description_en : book.description_es,
      image:
        locale === "en"
          ? `${BASE_URL}${book.coverImage_en}`
          : `${BASE_URL}${book.coverImage_es}`,
      brand: { "@type": "Brand", name: "Ashley Leon" },
      offers: {
        "@type": "Offer",
        price: (workbookPriceCents(book.price) / 100).toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: fullUrl(
          locale,
          `/workbooks/${locale === "en" ? book.slug_en : book.slug_es}`,
        ),
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: workbookFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={faqSchema} />
      {orderedBooks.map((book) => {
        const bookTitle = locale === "en" ? book.title_en : book.title_es;
        const bookImage =
          locale === "en" ? book.coverImage_en : book.coverImage_es;
        const bookSlug = locale === "en" ? book.slug_en : book.slug_es;
        const imageUrl = bookImage.startsWith("http")
          ? bookImage
          : `${BASE_URL}${bookImage}`;

        return (
          <JsonLd
            key={book.id}
            data={{
              "@context": "https://schema.org",
              "@type": "Product",
              name: bookTitle,
              brand: { "@type": "Brand", name: "Ashley Leon" },
              description:
                locale === "en" ? book.description_en : book.description_es,
              image: imageUrl,
              url: fullUrl(locale, `/workbooks/${bookSlug}`),
              offers: {
                "@type": "Offer",
                price: (workbookPriceCents(book.price) / 100).toFixed(2),
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            }}
          />
        );
      })}
      <div className="min-h-screen font-[family-name:var(--font-cormorant-garamond)] bg-[#F9F8F6]">
        {/* Hero Section */}
        <div className="relative bg-[#f5f0eb] py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="text-[#d8a08b] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
                {t("breadcrumb")}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground italic leading-tight transition-all duration-700 ease-out hover:tracking-wide">
                {t("title")}
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {orderedBooks.map((book) => {
              const title = locale === "en" ? book.title_en : book.title_es;
              const subtitle =
                locale === "en" ? book.subtitle_en : book.subtitle_es;
              const bookSlug =
                locale === "en" ? book.slug_en : book.slug_es;
              const isPrimary =
                book.slug_en === "rebuilding-reverence" ||
                book.slug_es === "reconstruyendo-la-reverencia";

              const description =
                locale === "en" ? book.description_en : book.description_es;

              return (
                <Card
                  key={book.id}
                  className="group flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 bg-card border border-border rounded-sm overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f0eb]">
                      <Image
                        src={
                          locale === "en"
                            ? book.coverImage_en
                            : book.coverImage_es
                        }
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-semibold text-foreground lg:text-3xl group-hover:text-[#d8a08b] transition-colors duration-300 line-clamp-2">
                        {title}
                      </CardTitle>
                      {isPrimary ? (
                        <span className="inline-flex w-fit rounded-sm bg-[#d8a08b]/15 px-3 py-1 font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#a86551]">
                          {locale === "en" ? "Start here" : "Empieza aquí"}
                        </span>
                      ) : null}
                      <CardDescription className="text-sm font-[family-name:var(--font-lora)] text-muted-foreground line-clamp-2">
                        {subtitle}
                      </CardDescription>
                    </div>

                    <p className="text-base font-[family-name:var(--font-lora)] text-muted-foreground line-clamp-3 flex-1">
                      {description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-sans mt-auto pt-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(book.rating!)
                                ? "fill-[#d8a08b] text-[#d8a08b]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-foreground">
                        {book.rating}
                      </span>
                      <span className="text-muted-foreground">
                        ({book.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-sans">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {book.pages} {locale === "en" ? "pages" : "páginas"}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-border/50 mt-4">
                    <div className="space-y-1 pt-4">
                      <div className="flex items-baseline gap-2 font-sans">
                        <span className="text-2xl font-bold text-foreground">
                          ${(workbookPriceCents(book.price) / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        {locale === "en" ? "Digital format" : "Formato digital"}
                      </p>
                    </div>

                    <Link
                      href={localizedHref(locale, `/workbooks/${bookSlug}`)}
                      className="pt-4"
                    >
                      <Button className="group/btn rounded-sm px-6 py-4 font-[family-name:var(--font-lora)] text-base bg-[#d8a08b] text-white hover:bg-[#c28c77] transition-all duration-300 shadow-sm">
                        {locale === "en"
                          ? `Get ${title} — $33`
                          : `Obtener ${title} — $33`}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        <section className="container mx-auto px-4 pb-20 lg:pb-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-light italic text-foreground sm:text-4xl">
              {locale === "en" ? "Workbook questions." : "Preguntas sobre las guías prácticas."}
            </h2>
            <div className="space-y-5">
              {workbookFaqs.map((faq) => (
                <div
                  key={faq.q}
                  className="border-t border-border/70 pt-5"
                >
                  <h3 className="font-[family-name:var(--font-lora)] text-base font-semibold text-foreground">
                    {faq.q}
                  </h3>
                  <p className="mt-2 font-[family-name:var(--font-lora)] text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
