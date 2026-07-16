import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { BASE_URL, fullUrl } from "@/lib/url";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Checkout from "@/components/checkout";
import { CircleNav, type NavItem } from "@/components/circle-nav";
import { localizedAlternates, transactionalRobots } from "@/lib/seo";
import { OFFER_OG_IMAGES } from "@/lib/offer-og-images";

const EARLY_PRICE = Number(process.env.NEXT_PUBLIC_CIRCLE_EARLY_PRICE) || 197;
const REGULAR_PRICE = Number(process.env.NEXT_PUBLIC_CIRCLE_REGULAR_PRICE) || 297;
const PRICE_CENTS = EARLY_PRICE * 100;
const SPOTS_REMAINING =
  Number(process.env.NEXT_PUBLIC_CIRCLE_SPOTS_REMAINING) || 10;
const CAPACITY = Number(process.env.NEXT_PUBLIC_CIRCLE_CAPACITY) || 15;
const PRODUCT_S3KEY = "live-sessions/rebuilding-reverence-circle";
const PRODUCT_TYPE = "live_session";
const SUCCESS_PATH = "/circle/success";
const CIRCLE_CHECKOUT_IMAGES = {
  en: {
    src: "/circle-checkout-en.png",
    alt: "The Rebuilding Reverence Circle live group experience",
  },
  es: {
    src: "/circle-checkout-es.png",
    alt: "Comunidad para reconstruir la fe",
  },
} as const;

function getCircleCheckoutImage(locale: string) {
  return locale === "es" ? CIRCLE_CHECKOUT_IMAGES.es : CIRCLE_CHECKOUT_IMAGES.en;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Circle" });
  const image = OFFER_OG_IMAGES.circle;
  const imageUrl = `${BASE_URL}${image.path}`;
  const title = t("cohort-status.heading");
  const description = t("earlyRateNote", { regular: REGULAR_PRICE.toFixed(0) });

  return {
    title,
    description,
    robots: transactionalRobots,
    openGraph: {
      title,
      description,
      url: fullUrl(locale, "/circle/reserve"),
      images: [
        {
          url: imageUrl,
          width: image.width,
          height: image.height,
          alt: image.alt,
          type: image.contentType,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: image.alt }],
    },
    alternates: localizedAlternates(locale, {
      en: "/circle/reserve",
      es: "/circle/reserve",
    }),
  };
}

export default async function ReservePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Circle" });

  const coverImage = getCircleCheckoutImage(locale);
  const productName = t("hero.title");
  const price = EARLY_PRICE.toFixed(0);
  const regularPrice = REGULAR_PRICE.toFixed(0);

  const navItems: NavItem[] = [
    { id: "inside", label: t("nav.inside") },
    { id: "weeks", label: t("nav.weeks") },
    { id: "for-you", label: t("nav.forYou") },
    { id: "promise", label: t("nav.promise") },
    { id: "how", label: t("nav.how") },
    { id: "questions", label: t("nav.questions") },
  ];

  const sessionsUrl = `/${locale}/circle`;

  return (
    <>
      <CircleNav
        items={navItems}
        sectionHrefPrefix={sessionsUrl}
      />
      <div className="font-[family-name:var(--font-cormorant-garamond)] bg-[#F9F8F6]">
        <section id="reserve" className="bg-[#f5f0eb] pt-32 sm:pt-40 pb-16 lg:pb-24">
          <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: status + price */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-6">
                  {t("cohort-status.heading")}
                </h2>
                <p className="text-3xl sm:text-4xl font-light text-foreground mb-3">
                  {SPOTS_REMAINING === 0
                    ? t("cohort-status.waitlist")
                    : t("cohort-status.spotsRemaining", { count: SPOTS_REMAINING, total: CAPACITY })}
                </p>
                <p className="font-[family-name:var(--font-lora)] text-foreground/70 text-sm leading-relaxed">
                  {t("cohort-status.spotsNote")}
                </p>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-light text-foreground italic">${price}</span>
                  <span className="text-xl text-foreground/40 line-through font-[family-name:var(--font-lora)]">
                    ${regularPrice}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-lora)] text-foreground/70 text-sm leading-relaxed">
                  {t("earlyRateNote", { regular: regularPrice })}
                </p>
              </div>
            </div>

            {/* Right: image + checkout */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-border/50 shadow-md rounded-sm bg-card">
                <CardContent className="p-0">
                  <div className="aspect-[2/3] bg-[#f5f0eb] flex items-center justify-center relative">
                    <Image
                      src={coverImage.src}
                      alt={coverImage.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card
                id="checkout"
                className="border-border/50 shadow-sm rounded-sm bg-card overflow-hidden p-0 scroll-mt-32"
              >
                <CardContent className="p-8 bg-[#f5f0eb]/50">
                  {SPOTS_REMAINING === 0 ? (
                    <a
                      href={`/${locale}/contact`}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-[#d8a08b] px-6 py-3 font-sans text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#c28c77]"
                    >
                      {t("cohort-status.waitlistCta")}
                    </a>
                  ) : (
                    <Checkout
                      ebook_price={PRICE_CENTS}
                      ebook_s3key={PRODUCT_S3KEY}
                      productName={productName}
                      productType={PRODUCT_TYPE}
                      successPath={SUCCESS_PATH}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
