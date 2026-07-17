import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import Checkout from "@/components/checkout";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { BASE_URL, fullUrl, localizedHref } from "@/lib/url";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { isSupportedLocale } from "@/lib/seo";
import { workbookPriceCents } from "@/lib/workbook-pricing";
import { getWorkbookSeo } from "@/lib/seo-content";
import { ViewItemAnalytics } from "@/components/ecommerce-analytics";
import { getWorkbookOgImage } from "@/lib/offer-og-images";
import { normalizeValidIsbn13 } from "@/lib/isbn";
import { personRef } from "@/lib/schema-entities";
import {
  getWorkbookContent,
  getWorkbookCoverImage,
} from "@/lib/workbook-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const book = await prisma.book.findFirst({
    where: {
      OR: [{ slug_en: slug }, { slug_es: slug }],
    },
  });
  if (!book) return notFound();

  const supportedLocale = isSupportedLocale(locale) ? locale : "en";
  const content = getWorkbookContent(book, supportedLocale);
  const title = content.title;
  const seo = getWorkbookSeo(supportedLocale, book.slug_en);
  const metadataTitle = seo?.title ?? `${title} | Ashley Leon`;
  const description = seo?.description ?? content.subtitle;
  const coverImage = getWorkbookCoverImage(book, supportedLocale);
  const detailSlug = locale === "en" ? book.slug_en : book.slug_es;
  const offerOgImage = getWorkbookOgImage(book.slug_en, supportedLocale);
  const imageUrl = offerOgImage
    ? `${BASE_URL}${offerOgImage.path}`
    : coverImage.startsWith("http")
      ? coverImage
      : `${BASE_URL}${coverImage}`;
  const imageAlt = offerOgImage?.alt ?? title;

  return {
    title: metadataTitle,
    description,
    openGraph: {
      ...localizedOpenGraph(locale),
      type: "website",
      title: metadataTitle,
      description,
      url: fullUrl(locale, `/workbooks/${detailSlug}`),
      images: [
        {
          url: imageUrl,
          width: offerOgImage?.width ?? 800,
          height: offerOgImage?.height ?? 1067,
          alt: imageAlt,
          type: offerOgImage?.contentType,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    alternates: localizedAlternates(locale, {
      en: `/workbooks/${book.slug_en}`,
      es: `/workbooks/${book.slug_es}`,
    }),
  };
}

export default async function PageDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const book = await prisma.book.findFirst({
    where: {
      OR: [{ slug_en: slug }, { slug_es: slug }],
    },
  });
  if (!book) return notFound();
  const canonicalSlug = locale === "en" ? book.slug_en : book.slug_es;
  if (slug !== canonicalSlug) {
    permanentRedirect(
      localizedHref(locale, `/workbooks/${canonicalSlug}`),
    );
  }
  const t = await getTranslations({ locale, namespace: "Workbooks" });

  const supportedLocale = isSupportedLocale(locale) ? locale : "en";
  const content = getWorkbookContent(book, supportedLocale);
  const bookTitle = content.title;
  const bookDescription = content.description;
  const coverImage = getWorkbookCoverImage(book, supportedLocale);
  const imageUrl = coverImage.startsWith("http")
    ? coverImage
    : `${BASE_URL}${coverImage}`;
  const detailSlug = locale === "en" ? book.slug_en : book.slug_es;
  const pageUrl = fullUrl(locale, `/workbooks/${detailSlug}`);
  const priceCents = workbookPriceCents(book.price);
  const seo = getWorkbookSeo(supportedLocale, book.slug_en);
  const intentHeadingId = `${book.slug_en}-intent-heading`;
  const validIsbn = normalizeValidIsbn13(book.isbn);
  const reviewLabel =
    supportedLocale === "es"
      ? book.reviewCount === 1
        ? "reseña"
        : "reseñas"
      : book.reviewCount === 1
        ? "review"
        : "reviews";

  const bookSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Book", "Product"],
    "@id": `${pageUrl}#book`,
    name: bookTitle,
    sku: book.slug_en,
    brand: { "@type": "Brand", name: "Ashley Leon" },
    description:
      supportedLocale === "es"
        ? bookDescription
        : (seo?.description ?? bookDescription),
    author: personRef,
    bookFormat: "https://schema.org/EBook",
    numberOfPages: book.pages,
    image: imageUrl,
    inLanguage: supportedLocale,
    url: pageUrl,
    offers: {
      "@type": "Offer",
      price: (priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
  };
  if (validIsbn) bookSchema.isbn = validIsbn;
  if (book.rating && book.reviewCount) {
    bookSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: book.rating,
      reviewCount: book.reviewCount,
    };
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "es" ? "Inicio" : "Home",
        item: fullUrl(locale, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "es" ? "Guías" : "Workbooks",
        item: fullUrl(locale, "/workbooks"),
      },
      { "@type": "ListItem", position: 3, name: bookTitle, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={bookSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ViewItemAnalytics
        itemId={book.slug_en}
        itemName={bookTitle}
        itemCategory="workbook"
        locale={locale}
        value={priceCents / 100}
        currency="USD"
      />
      <div className="min-h-screen font-[family-name:var(--font-cormorant-garamond)] bg-[#F9F8F6]">
        {/* Header */}
        <div className="bg-[#f5f0eb] py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <span className="text-[#d8a08b] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
                {t("new-release")}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground italic leading-tight transition-all duration-700 ease-out hover:tracking-wide mb-6">
                {bookTitle}
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] max-w-2xl mx-auto">
                {supportedLocale === "es"
                  ? content.subtitle
                  : (seo?.supportingLine ?? content.subtitle)}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Book Image & Quick Actions */}
            <div className="space-y-8">
              <Card className="overflow-hidden border-border/50 shadow-md rounded-sm bg-card">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-[#f5f0eb] flex items-center justify-center relative">
                    <Image
                      src={coverImage}
                      alt={
                        supportedLocale === "es"
                          ? `Portada de ${bookTitle}`
                          : `Cover of ${bookTitle}`
                      }
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="border-border/50 shadow-sm rounded-sm bg-card">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="flex items-center gap-2 mb-6 font-sans">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
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
                      ({book.reviewCount} {reviewLabel})
                    </span>
                  </div>
                  <blockquote className="italic text-lg font-[family-name:var(--font-lora)] text-foreground/90 leading-relaxed border-l-2 border-[#d8a08b] pl-4">
                    &ldquo;
                    {content.featuredReview}
                    &rdquo;
                  </blockquote>
                  <p className="text-sm font-sans text-muted-foreground mt-4 font-medium">
                    - {book.reviewerName}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Book Details & Purchase */}
            <div className="space-y-8">
              <Card className="border-border/50 shadow-sm rounded-sm bg-card">
                <CardHeader className="pb-4 pt-8 px-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-light text-foreground italic mb-2">
                        {book.author}
                      </CardTitle>
                      <CardDescription className="flex items-center text-lg mt-2 font-sans">
                        <span className="text-3xl font-bold text-foreground">
                          ${(priceCents / 100).toFixed(2)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 px-8 pb-8">
                  <Separator className="bg-border/50" />
                  <div>
                    <div className="grid grid-cols-2 gap-6 text-sm font-sans text-foreground/80">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-[#d8a08b]" />
                        <span className="font-medium">
                          {book.pages} {locale === "en" ? "pages" : "páginas"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-[#d8a08b]" />
                        <span className="font-medium">{content.format}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-[#d8a08b]" />
                        <span className="font-medium">{content.language}</span>
                      </div>
                      {validIsbn ? (
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-muted-foreground">
                            ISBN:
                          </span>
                          <span className="font-medium">{validIsbn}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm rounded-sm bg-card overflow-hidden p-0">
                <CardContent className="p-8 bg-[#f5f0eb]/50 h-full">
                  <Checkout
                    ebook_price={priceCents}
                    ebook_s3key={
                      locale === "en" ? book.s3Key_en : book.s3Key_es
                    }
                    productName={bookTitle}
                  />
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm rounded-sm bg-card">
                <CardContent className="space-y-8 px-8 py-8">
                  <div>
                    <h2 className="text-2xl font-light text-foreground italic mb-4">
                      {t("about-title")}
                    </h2>
                    <p className="leading-relaxed font-[family-name:var(--font-lora)] text-foreground/80 text-base">
                      {bookDescription}
                    </p>
                  </div>

                  {seo?.intentSection ? (
                    <section
                      aria-labelledby={intentHeadingId}
                      className="border-l-2 border-[#d8a08b] pl-5"
                    >
                      <h2
                        id={intentHeadingId}
                        className="text-2xl font-light text-foreground italic mb-4"
                      >
                        {seo.intentSection.title}
                      </h2>
                      <p className="leading-relaxed font-[family-name:var(--font-lora)] text-foreground/80 text-base">
                        {seo.intentSection.body}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed font-sans text-muted-foreground">
                        {seo.intentSection.disclaimer}
                      </p>
                      {book.slug_en === "rebuilding-reverence" ? (
                        <p className="mt-5 text-sm leading-7 font-[family-name:var(--font-lora)] text-foreground/75">
                          {supportedLocale === "es"
                            ? "¿Todavía estás tratando de ponerle nombre a este proceso? Empieza con la guía "
                            : "Still naming what this process means for you? Start with the guide "}
                          <Link
                            href={localizedHref(
                              supportedLocale,
                              "/deconstructing-christianity",
                            )}
                            className="text-foreground underline decoration-[#d8a08b] underline-offset-4 transition-colors hover:text-[#a86551] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {supportedLocale === "es"
                              ? "Deconstruir el cristianismo: qué significa y qué viene después"
                              : "Deconstructing Christianity: What It Means and What Comes Next"}
                          </Link>
                          .
                        </p>
                      ) : null}
                    </section>
                  ) : null}

                  <div>
                    <h2 className="text-xl font-light text-foreground italic mb-4">
                      {t("features-title")}
                    </h2>
                    <ul className="space-y-3 font-[family-name:var(--font-lora)] text-foreground/80">
                      {content.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-[#d8a08b] mt-1 text-lg">•</span>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
