import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { BASE_URL, fullUrl } from "@/lib/url";
import { localizedAlternates } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { CircleNav, type NavItem } from "@/components/circle-nav";
import { CircleStickyCta } from "@/components/circle-sticky-cta";
import { CircleFaq } from "@/components/circle-faq";
import { ViewItemAnalytics } from "@/components/ecommerce-analytics";
import { OFFER_OG_IMAGES } from "@/lib/offer-og-images";
import { organizationRef } from "@/lib/schema-entities";

const EARLY_PRICE = Number(process.env.NEXT_PUBLIC_CIRCLE_EARLY_PRICE) || 197;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Circle" });
  const image = OFFER_OG_IMAGES.circle;
  const imageUrl = `${BASE_URL}${image.path}`;

  return {
    title: t("metadata-title"),
    description: t("metadata-description"),
    openGraph: {
      title: t("metadata-title"),
      description: t("metadata-description"),
      url: fullUrl(locale, "/circle"),
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
      title: t("metadata-title"),
      description: t("metadata-description"),
      images: [{ url: imageUrl, alt: image.alt }],
    },
    alternates: localizedAlternates(locale, { en: "/circle", es: "/circle" }),
  };
}

type WeekItem = { name: string; desc: string };
type InsideItem = { title: string; desc: string };
type QAItem = { q: string; a: string };

export default async function CirclePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Circle" });

  const productName = t("hero.title");
  const price = EARLY_PRICE.toFixed(0);

  const openingLines = t.raw("opening.lines") as string[];
  const weeks = t.raw("four-weeks.weeks") as WeekItem[];
  const insideItems = t.raw("whats-inside.items") as InsideItem[];
  const enrollmentSteps = t.raw("enrollment.steps") as string[];
  const faqs = t.raw("questions.items") as QAItem[];

  const navItems: NavItem[] = [
    { id: "inside", label: t("nav.inside") },
    { id: "weeks", label: t("nav.weeks") },
    { id: "for-you", label: t("nav.forYou") },
    { id: "promise", label: t("nav.promise") },
    { id: "how", label: t("nav.how") },
    { id: "questions", label: t("nav.questions") },
  ];

  const courseSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${fullUrl(locale, "/circle")}#course`,
    name: productName,
    description: t("metadata-description"),
    url: fullUrl(locale, "/circle"),
    inLanguage: locale,
    provider: organizationRef,
    offers: {
      "@type": "Offer",
      price: EARLY_PRICE.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: fullUrl(locale, "/circle"),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: fullUrl(locale, "") },
      { "@type": "ListItem", position: 2, name: productName, item: fullUrl(locale, "/circle") },
    ],
  };

  return (
    <>
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ViewItemAnalytics
        itemId="rebuilding-reverence-circle"
        itemName={productName}
        itemCategory="live-group"
        locale={locale}
        value={EARLY_PRICE}
        currency="USD"
      />
      <div id="nav-sentinel" aria-hidden className="h-px w-px" />
      <CircleNav
        items={navItems}
        reserveLabel={t("nav.reserveCta", { price })}
        reserveHref={`/${locale}/circle/reserve`}
      />
      <CircleStickyCta
        label={t("nav.reserveCta", { price })}
        href={`/${locale}/circle/reserve`}
      />
      <div className="font-[family-name:var(--font-cormorant-garamond)] bg-[#F9F8F6]">
        {/* Hero */}
        <section id="hero" className="bg-[#f5f0eb] py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-[#d8a08b] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground italic leading-tight mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>
        </section>

        {/* Opening */}
        <section className="py-16 lg:py-20">
          <div className="max-w-2xl mx-auto px-4 text-center space-y-3 font-[family-name:var(--font-lora)] text-foreground/80 text-lg leading-relaxed">
            {openingLines.map((line, i) =>
              line === "A circle." || line === "Un círculo." ? (
                <p key={i} className="text-2xl sm:text-3xl font-light text-foreground italic">
                  {line}
                </p>
              ) : i === openingLines.length - 1 ? (
                <p key={i} className="text-xl font-light text-foreground italic pt-2">
                  {line}
                </p>
              ) : (
                <p key={i}>{line}</p>
              )
            )}
          </div>
        </section>

        {/* What the Circle is */}
        <section className="bg-[#f5f0eb] py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8 text-center">
              {t("what-circle-is.heading")}
            </h2>
            <div className="space-y-6 font-[family-name:var(--font-lora)] text-foreground/80 text-lg leading-relaxed">
              <p>{t("what-circle-is.paragraph1")}</p>
              <p className="italic">{t("what-circle-is.paragraph2")}</p>
              <p>{t("what-circle-is.paragraph3")}</p>
              <p>{t("what-circle-is.paragraph4")}</p>
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section id="inside" className="py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8 text-center">
              {t("whats-inside.heading")}
            </h2>
            <div className="space-y-8">
              {insideItems.map((item, i) => (
                <div key={i}>
                  <h3 className="text-xl font-light text-foreground italic mb-2">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-lora)] text-foreground/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Four Weeks */}
        <section id="weeks" className="bg-[#f5f0eb] py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8 text-center">
              {t("four-weeks.heading")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {weeks.map((w, i) => (
                <Card key={i} className="border-border/50 shadow-sm rounded-sm bg-card">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-light text-foreground italic mb-2">
                      {w.name}
                    </h3>
                    <p className="font-[family-name:var(--font-lora)] text-foreground/70 leading-relaxed">
                      {w.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <section id="for-you" className="py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8">
              {t("who-for.heading")}
            </h2>
            <div className="space-y-5 font-[family-name:var(--font-lora)] text-foreground/80 text-lg leading-relaxed">
              <p>{t("who-for.paragraph1")}</p>
              <p>{t("who-for.paragraph2")}</p>
              <p>{t("who-for.paragraph3")}</p>
              <p className="text-2xl font-light text-foreground italic">{t("who-for.truth")}</p>
              <p>{t("who-for.paragraph4")}</p>
              <p className="text-2xl font-light text-foreground italic">{t("who-for.belong")}</p>
            </div>
          </div>
        </section>

        {/* Ashley's promise */}
        <section id="promise" className="bg-[#f5f0eb] py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8 text-center">
              {t("ashley-promise.heading")}
            </h2>
            <div className="space-y-6 font-[family-name:var(--font-lora)] text-foreground/80 text-lg leading-relaxed">
              <p>{t("ashley-promise.paragraph1")}</p>
              <p>{t("ashley-promise.paragraph2")}</p>
              <p>{t("ashley-promise.paragraph3")}</p>
              <p className="text-2xl font-light text-foreground italic">
                {t("ashley-promise.closing")}
              </p>
            </div>
          </div>
        </section>

        {/* How Enrollment Works */}
        <section id="how" className="py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8 text-center">
              {t("enrollment.heading")}
            </h2>
            <div className="space-y-6 font-[family-name:var(--font-lora)] text-foreground/80 text-lg leading-relaxed">
              <p>{t("enrollment.paragraph1")}</p>
              <p>{t("enrollment.paragraph2")}</p>
              <p className="font-medium text-foreground">{t("enrollment.intro")}</p>
              <ol className="space-y-4 list-none">
                {enrollmentSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-[#d8a08b] font-sans font-bold text-lg mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="italic">{t("enrollment.note")}</p>
            </div>
          </div>
        </section>

        {/* Current Cohort Status + Checkout moved to /circle/reserve */}

        {/* Questions */}
        <section id="questions" className="py-16 lg:py-20 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8 text-center">
              {t("questions.heading")}
            </h2>
            <CircleFaq items={faqs} />
          </div>
        </section>

        {/* One more thing */}
        <section className="bg-[#f5f0eb] py-20 lg:py-28 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground italic mb-8">
              {t("closing.heading")}
            </h2>
            <div className="space-y-6 font-[family-name:var(--font-lora)] text-foreground/80 text-lg leading-relaxed">
              <p>{t("closing.paragraph1")}</p>
              <p>{t("closing.paragraph2")}</p>
              <p className="text-2xl font-light text-foreground italic">
                {t("closing.paragraph3")}
              </p>
            </div>
            <div className="mt-10 space-y-2 font-[family-name:var(--font-lora)] text-foreground/70">
              <p className="italic">{t("closing.finalLine")}</p>
              <p className="text-[#d8a08b] font-bold uppercase tracking-[0.2em] font-sans text-sm">
                {t("closing.finalLine2")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
