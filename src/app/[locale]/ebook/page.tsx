import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ebook" });

  return {
    title: t("metadata-title"),
    description: t("metadata-description"),
  };
}

export default async function EbookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ebook" });
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
  if (books.length === 0) {
    return notFound();
  }

  return (
    <>
      {metaPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Meta Pixel"
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative">
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-accent/5"
            aria-hidden
          />
          <div className="container mx-auto px-4 p-16 lg:pb-0">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mb-4">
                {t("breadcrumb")}
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary transition-all duration-700 ease-out hover:tracking-wide">
                {t("title")}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
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
                  className="group overflow-hidden border-border/60 bg-card/90 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/40"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                      <Image
                        src={
                          locale === "en"
                            ? book.coverImage_en
                            : book.coverImage_es
                        }
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {subtitle}
                      </CardDescription>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {description}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(book.rating!)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{book.rating}</span>
                      <span className="text-muted-foreground">
                        ({book.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {book.pages} {locale === "en" ? "pages" : "páginas"}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ${(book.price / 100).toFixed(2)}
                        </span>
                        {book.originalPrice! > book.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${(book.originalPrice! / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {locale === "en" ? "Digital format" : "Formato digital"}
                      </p>
                    </div>

                    <Link
                      href={`/${locale}/ebook/detail/${locale === "en" ? book.slug_en : book.slug_es}`}
                    >
                      <Button className="group/btn">
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
