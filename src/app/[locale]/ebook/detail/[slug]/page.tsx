import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen">
      {/* Header */}
      <div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              {t("new-release")}
            </Badge>
            <h1 className="text-important text-4xl sm:text-6xl font-bold mb-4 text-primary transition-all duration-700 ease-out hover:tracking-wide">
              {locale === "en" ? book.title_en : book.title_es}
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {locale === "en" ? book.subtitle_en : book.subtitle_es}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Book Image & Quick Actions */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center relative">
                  <Image
                    src={
                      locale === "en" ? book.coverImage_en : book.coverImage_es
                    }
                    alt={locale === "en" ? book.title_en : book.title_es}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(book.rating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{book.rating}</span>
                  <span>
                    ({book.reviewCount} {"reseñas"})
                  </span>
                </div>
                <blockquote className="italic">
                  {locale === "en"
                    ? book.featured_review_en
                    : book.featured_review_es}
                </blockquote>
                <p className="text-sm  mt-2">- {book.reviewerName}</p>
              </CardContent>
            </Card>
          </div>

          {/* Book Details & Purchase */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{book.author}</CardTitle>
                    <CardDescription className="flex items-center text-lg mt-1">
                      <span className="text-2xl font-bold">
                        ${(book.price / 100).toFixed(2)}
                      </span>
                      {book.originalPrice! > book.price && (
                        <>
                          <span className="text-lg line-through ml-2">
                            ${(book.originalPrice! / 100).toFixed(2)}
                          </span>
                          <Badge variant="destructive" className="ml-2">
                            {book.discount}% DESC
                          </Badge>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />
                <div>
                  {/* <h3 className="font-semibold mb-3">{t("payment-title")}</h3> */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{book.pages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {locale === "en" ? book.format_en : book.format_es}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {locale === "en" ? book.language_en : book.language_es}
                      </span>
                    </div>
                    <div>
                      <span>ISBN: {book.isbn}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <CardTitle>{t("about-title")}</CardTitle>
                <p className="leading-relaxed mb-6">
                  {locale === "en" ? book.description_en : book.description_es}
                </p>

                <div>
                  <h4 className="font-semibold mb-3">{t("features-title")}</h4>
                  <ul className="space-y-2">
                    {(locale === "en"
                      ? book.features_en
                      : book.features_es
                    ).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className=" mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
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
