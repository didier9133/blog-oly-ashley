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
import Checkout from "@/components/checkout";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";

export async function generateMetadata({
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
  return {
    title: locale === "en" ? book.title_en : book.title_es,
    description: locale === "en" ? book.subtitle_en : book.subtitle_es,
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
  const t = await getTranslations({ locale, namespace: "Ebook" });

  return (
    <div className="min-h-screen font-[family-name:var(--font-cormorant-garamond)] bg-[#F9F8F6]">
      {/* Header */}
      <div className="bg-[#f5f0eb] py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="text-[#de9e86] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
              {t("new-release")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground italic leading-tight transition-all duration-700 ease-out hover:tracking-wide mb-6">
              {locale === "en" ? book.title_en : book.title_es}
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] max-w-2xl mx-auto">
              {locale === "en" ? book.subtitle_en : book.subtitle_es}
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
                    src={
                      locale === "en" ? book.coverImage_en : book.coverImage_es
                    }
                    alt={locale === "en" ? book.title_en : book.title_es}
                    fill
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
                            ? "fill-[#de9e86] text-[#de9e86]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">
                    {book.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({book.reviewCount} {"reseñas"})
                  </span>
                </div>
                <blockquote className="italic text-lg font-[family-name:var(--font-lora)] text-foreground/90 leading-relaxed border-l-2 border-[#de9e86] pl-4">
                  "
                  {locale === "en"
                    ? book.featured_review_en
                    : book.featured_review_es}
                  "
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
                        ${(book.price / 100).toFixed(2)}
                      </span>
                      {book.originalPrice! > book.price && (
                        <>
                          <span className="text-lg text-muted-foreground line-through ml-3">
                            ${(book.originalPrice! / 100).toFixed(2)}
                          </span>
                          <span className="ml-3 bg-[#de9e86]/10 text-[#de9e86] px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
                            {book.discount}% DESC
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                <Separator className="bg-border/50" />
                <div>
                  <div className="grid grid-cols-2 gap-6 text-sm font-sans text-foreground/80">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-[#de9e86]" />
                      <span className="font-medium">
                        {book.pages} {locale === "en" ? "pages" : "páginas"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-[#de9e86]" />
                      <span className="font-medium">
                        {locale === "en" ? book.format_en : book.format_es}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#de9e86]" />
                      <span className="font-medium">
                        {locale === "en" ? book.language_en : book.language_es}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-muted-foreground">
                        ISBN:
                      </span>
                      <span className="font-medium">{book.isbn}</span>
                    </div>
                  </div>
                </div>
                <Separator className="bg-border/50" />

                <div>
                  <CardTitle className="text-2xl font-light text-foreground italic mb-4">
                    {t("about-title")}
                  </CardTitle>
                  <p className="leading-relaxed font-[family-name:var(--font-lora)] text-foreground/80 text-base">
                    {locale === "en"
                      ? book.description_en
                      : book.description_es}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-light text-foreground italic mb-4">
                    {t("features-title")}
                  </h4>
                  <ul className="space-y-3 font-[family-name:var(--font-lora)] text-foreground/80">
                    {(locale === "en"
                      ? book.features_en
                      : book.features_es
                    ).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-[#de9e86] mt-1 text-lg">•</span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-sm bg-card overflow-hidden p-0">
              <CardContent className="p-8 bg-[#f5f0eb]/50 h-full">
                <Checkout
                  ebook_price={book.price}
                  ebook_s3key={locale === "en" ? book.s3Key_en : book.s3Key_es}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
