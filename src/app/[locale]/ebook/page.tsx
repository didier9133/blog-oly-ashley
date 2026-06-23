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

const BASE_URL = "https://www.raicesreturnings.com";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ebook" });

  return {
    title: t("metadata-title"),
    description: t("metadata-description"),
    openGraph: {
      title: t("metadata-title"),
      description: t("metadata-description"),
      url: `${BASE_URL}/${locale}/ebook`,
      images: [`${BASE_URL}/og-image.jpeg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata-title"),
      description: t("metadata-description"),
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/ebook`,
      languages: {
        en: `${BASE_URL}/en/ebook`,
        es: `${BASE_URL}/es/ebook`,
        "x-default": `${BASE_URL}/en/ebook`,
      },
    },
  };
}

export default async function EbookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ebook" });

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
  if (books.length === 0) {
    return notFound();
  }

  return (
    <>
      {books.map((book) => {
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
              "@type": "Book",
              name: bookTitle,
              author: { "@type": "Person", name: "Ashley Diana León" },
              publisher: {
                "@type": "Organization",
                name: "Raíces & Returnings",
              },
              bookFormat: "EBook",
              numberOfPages: book.pages,
              image: imageUrl,
              isbn: book.isbn,
              url: `${BASE_URL}/${locale}/ebook/detail/${bookSlug}`,
              offers: {
                "@type": "Offer",
                price: (book.price / 100).toFixed(2),
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
            {books.map((book) => {
              const title = locale === "en" ? book.title_en : book.title_es;
              const subtitle =
                locale === "en" ? book.subtitle_en : book.subtitle_es;

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
                          ${(book.price / 100).toFixed(2)}
                        </span>
                        {book.originalPrice! > book.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${(book.originalPrice! / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-sans">
                        {locale === "en" ? "Digital format" : "Formato digital"}
                      </p>
                    </div>

                    <Link
                      href={`/${locale}/ebook/detail/${locale === "en" ? book.slug_en : book.slug_es}`}
                      className="pt-4"
                    >
                      <Button className="group/btn rounded-sm px-6 py-4 font-[family-name:var(--font-lora)] text-base bg-[#d8a08b] text-white hover:bg-[#c28c77] transition-all duration-300 shadow-sm">
                        {t("details-button")}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
