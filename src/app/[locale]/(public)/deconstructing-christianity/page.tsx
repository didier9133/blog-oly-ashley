import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, Heart, Waypoints } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { PillarCta } from "@/components/pillar-cta";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DECONSTRUCTING_CHRISTIANITY_MODIFIED_AT,
  DECONSTRUCTING_CHRISTIANITY_PATH,
  DECONSTRUCTING_CHRISTIANITY_PUBLISHED_AT,
  getDeconstructingChristianityContent,
} from "@/lib/deconstructing-christianity";
import {
  indexableRobots,
  isSupportedLocale,
  localizedAlternates,
} from "@/lib/seo";
import { BASE_URL, fullUrl, localizedHref, ogImageUrl } from "@/lib/url";
import { organizationRef, personRef } from "@/lib/schema-entities";

const PUBLISHED_DATE = new Date(
  `${DECONSTRUCTING_CHRISTIANITY_PUBLISHED_AT}T12:00:00.000Z`,
);
const MODIFIED_DATE = new Date(
  `${DECONSTRUCTING_CHRISTIANITY_MODIFIED_AT}T12:00:00.000Z`,
);

function getGuideOgImage(locale: "en" | "es") {
  if (locale === "es") {
    return {
      url: `${BASE_URL}/og-deconstructing-christianity-es-v1.png`,
      width: 1730,
      height: 909,
      type: "image/png",
      alt: "Ashley Leon junto al título «Deconstruir el cristianismo»",
    };
  }

  return {
    url: ogImageUrl("en"),
    width: 1200,
    height: 630,
    type: "image/jpeg",
    alt: "Ashley Leon beside the message “Returning to yourself is returning to the sacred”",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return {
      title: "Page not found | Ashley Leon",
      robots: { index: false, follow: false },
    };
  }

  const content = getDeconstructingChristianityContent(locale);
  const image = getGuideOgImage(locale);
  const pageUrl = fullUrl(locale, DECONSTRUCTING_CHRISTIANITY_PATH);
  const aboutUrl = fullUrl(locale, "/about");

  return {
    title: content.seoTitle,
    description: content.description,
    authors: [{ name: "Ashley Leon", url: aboutUrl }],
    creator: "Ashley Leon",
    publisher: "Ashley Leon",
    robots: indexableRobots,
    alternates: localizedAlternates(locale, {
      en: DECONSTRUCTING_CHRISTIANITY_PATH,
      es: DECONSTRUCTING_CHRISTIANITY_PATH,
    }),
    openGraph: {
      type: "article",
      locale: content.ogLocale,
      alternateLocale: [content.alternateOgLocale],
      siteName: "Ashley Leon",
      url: pageUrl,
      title: content.seoTitle,
      description: content.description,
      publishedTime: PUBLISHED_DATE.toISOString(),
      modifiedTime: MODIFIED_DATE.toISOString(),
      authors: [aboutUrl],
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt,
          type: image.type,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle,
      description: content.description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

export default async function DeconstructingChristianityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const content = getDeconstructingChristianityContent(locale);
  const pageUrl = fullUrl(locale, DECONSTRUCTING_CHRISTIANITY_PATH);
  const ogImage = getGuideOgImage(locale);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: content.title,
    description: content.description,
    image: {
      "@type": "ImageObject",
      url: ogImage.url,
      width: ogImage.width,
      height: ogImage.height,
      caption: ogImage.alt,
    },
    url: pageUrl,
    inLanguage: content.inLanguage,
    datePublished: PUBLISHED_DATE.toISOString(),
    dateModified: MODIFIED_DATE.toISOString(),
    author: personRef,
    publisher: organizationRef,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    about: [
      ...content.schemaAbout.map(({ name }) => ({ "@type": "Thing", name })),
      {
        "@type": "DefinedTerm",
        name: "The In-Between",
        description: content.inBetweenSchemaDescription,
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.breadcrumbHome,
        item: fullUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumbPage,
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    inLanguage: content.inLanguage,
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="bg-background text-foreground">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <section className="relative isolate overflow-hidden border-b border-border bg-paper">
        <div
          aria-hidden="true"
          className="absolute -right-28 -top-36 h-[34rem] w-[34rem] rounded-full border border-primary/15"
        />
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-20 h-[24rem] w-[24rem] rounded-full border border-primary/20"
        />
        <div
          aria-hidden="true"
          className="absolute right-16 top-8 h-[14rem] w-[14rem] rounded-full bg-primary/[0.06]"
        />

        <div className="relative mx-auto max-w-[88rem] px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 md:px-8 lg:px-12 lg:pb-24">
          <Breadcrumb
            aria-label={locale === "es" ? "Ruta de navegación" : "Breadcrumb"}
          >
            <BreadcrumbList className="font-[family-name:var(--font-lora)] text-xs uppercase tracking-[0.12em]">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={localizedHref(locale, "/")}>
                    {content.breadcrumbHome}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{content.breadcrumbPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-8">
              <p className="editorial-eyebrow text-primary">
                {content.eyebrow}
              </p>
              <h1 className="mt-6 max-w-[15ch] font-[family-name:var(--font-cormorant-garamond)] text-[clamp(3rem,7.6vw,6.6rem)] font-light leading-[0.92] tracking-[-0.035em] text-balance">
                {content.headlineLead}
                <span className="mt-2 block italic text-primary">
                  {content.headlineEmphasis}
                </span>
              </h1>
              <div className="mt-9 max-w-3xl border-l border-primary pl-5 sm:pl-7">
                <p className="font-[family-name:var(--font-lora)] text-lg leading-8 text-foreground/85 sm:text-xl sm:leading-9">
                  {content.introduction}
                </p>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-lora)] text-sm text-muted-foreground">
                <span>
                  {content.by}{" "}
                  <Link
                    href={localizedHref(locale, "/about")}
                    rel="author"
                    className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Ashley Leon
                  </Link>
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={DECONSTRUCTING_CHRISTIANITY_PUBLISHED_AT}>
                  {content.publishedDate}
                </time>
                <span aria-hidden="true">·</span>
                <span>{content.evergreen}</span>
              </div>
            </div>

            <aside className="relative border-t border-border pt-7 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
              <Waypoints
                aria-hidden="true"
                className="h-9 w-9 text-primary"
                strokeWidth={1.25}
              />
              <p className="mt-5 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-light italic leading-snug">
                {content.asideLead}
              </p>
              <p className="mt-4 font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
                {content.disclaimer}
              </p>
              <a
                href="#meaning"
                className="mt-7 inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-lora)] text-xs font-semibold uppercase tracking-[0.18em] text-primary underline decoration-primary/35 underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {content.begin}
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:px-8 lg:grid-cols-[14rem_minmax(0,48rem)] lg:gap-16 lg:px-12 lg:py-24 xl:gap-24">
        <aside className="hidden lg:block">
          <nav
            aria-label={content.onThisPage}
            className="sticky top-28 border-l border-border pl-6"
          >
            <p className="editorial-eyebrow-strong">{content.inThisGuide}</p>
            <ol className="mt-6 space-y-4">
              {content.sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex gap-3 font-[family-name:var(--font-lora)] text-sm leading-5 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      aria-hidden="true"
                      className="font-[family-name:var(--font-cormorant-garamond)] italic text-primary/70"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0">
          <p className="font-[family-name:var(--font-lora)] text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
            {content.opening}
          </p>

          <section
            id="meaning"
            aria-labelledby="meaning-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="01" id="meaning-heading">
              {content.meaning.heading}
            </SectionHeading>
            <Answer>{content.meaning.answer}</Answer>
            <Body>{content.meaning.beforeDefinitions}</Body>
            <Body>{content.meaning.definitionsIntro}</Body>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {content.meaning.definitions.map((definition) => (
                <DefinitionRow key={definition.term} term={definition.term}>
                  {definition.description}
                </DefinitionRow>
              ))}
            </dl>
            <Body>{content.meaning.conclusion}</Body>
          </section>

          <section
            id="why"
            aria-labelledby="why-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="02" id="why-heading">
              {content.why.heading}
            </SectionHeading>
            <Answer>{content.why.answer}</Answer>
            <Body>{content.why.introduction}</Body>
            <div className="mt-8 border-y border-border">
              {content.why.tensions.map((item, index) => (
                <div
                  key={item.title}
                  className="grid gap-2 border-b border-border py-6 last:border-b-0 sm:grid-cols-[2.5rem_13rem_1fr] sm:gap-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-[family-name:var(--font-cormorant-garamond)] text-xl italic text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-medium leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <blockquote className="my-10 border-l border-primary pl-6 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-light italic leading-snug text-foreground sm:text-3xl">
              {content.why.quote}
              <footer className="mt-5 font-[family-name:var(--font-lora)] text-xs not-italic uppercase tracking-[0.18em] text-muted-foreground">
                {content.why.quoteAttribution}
              </footer>
            </blockquote>
            <Body>{content.why.conclusion}</Body>
          </section>

          <section
            id="in-between"
            aria-labelledby="in-between-heading"
            className="scroll-mt-28 mt-16 bg-book px-6 py-12 sm:px-10 sm:py-14"
          >
            <SectionHeading number="03" id="in-between-heading">
              {content.inBetween.heading}
            </SectionHeading>
            <Answer>{content.inBetween.answer}</Answer>
            <blockquote className="my-10 border-l border-primary pl-6 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-light italic leading-tight text-foreground sm:text-4xl">
              {content.inBetween.quote}
              <footer className="mt-5 font-[family-name:var(--font-lora)] text-xs not-italic uppercase tracking-[0.18em] text-muted-foreground">
                {content.inBetween.quoteAttribution}
              </footer>
            </blockquote>
            <Body>{content.inBetween.framework}</Body>
            <Body>{content.inBetween.conviction}</Body>
          </section>

          <section
            id="experience"
            aria-labelledby="experience-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="04" id="experience-heading">
              {content.experience.heading}
            </SectionHeading>
            <Answer>{content.experience.answer}</Answer>
            <Body>{content.experience.introduction}</Body>
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <ExperienceCard
                icon={<Heart aria-hidden="true" className="h-6 w-6" />}
                title={content.experience.cards[0].title}
                items={content.experience.cards[0].items}
              />
              <ExperienceCard
                icon={<Waypoints aria-hidden="true" className="h-6 w-6" />}
                title={content.experience.cards[1].title}
                items={content.experience.cards[1].items}
              />
            </div>
            <blockquote className="my-10 border-l border-primary pl-6 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-light italic leading-snug text-foreground sm:text-3xl">
              {content.experience.quote}
              <footer className="mt-5 font-[family-name:var(--font-lora)] text-xs not-italic uppercase tracking-[0.18em] text-muted-foreground">
                {content.experience.quoteAttribution}
              </footer>
            </blockquote>
            <Body>{content.experience.conclusion}</Body>
          </section>

          <section
            id="leaving"
            aria-labelledby="leaving-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="05" id="leaving-heading">
              {content.leaving.heading}
            </SectionHeading>
            <Answer>{content.leaving.answer}</Answer>
            <Body>{content.leaving.introduction}</Body>
            <div className="mt-9 border-y border-border">
              {content.leaving.outcomes.map(({ title, description }, index) => (
                <div
                  key={title}
                  className="grid gap-2 border-b border-border py-6 last:border-b-0 sm:grid-cols-[2.5rem_8rem_1fr] sm:gap-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-[family-name:var(--font-cormorant-garamond)] text-xl italic text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium">
                    {title}
                  </h3>
                  <p className="font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <Body>{content.leaving.conclusion}</Body>
          </section>

          <section
            id="religious-harm"
            aria-labelledby="religious-harm-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="06" id="religious-harm-heading">
              {content.religiousHarm.heading}
            </SectionHeading>
            <Answer>{content.religiousHarm.answer}</Answer>
            <Body>{content.religiousHarm.explanation}</Body>
            <div className="mt-8 border-l-2 border-accent bg-accent/[0.08] px-6 py-6">
              <p className="font-[family-name:var(--font-lora)] text-sm leading-7 text-foreground/80">
                {content.religiousHarm.careNote}
              </p>
            </div>
          </section>

          <section
            id="next"
            aria-labelledby="next-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="07" id="next-heading">
              {content.next.heading}
            </SectionHeading>
            <Answer>{content.next.answer}</Answer>
            <ol className="mt-9 space-y-0 border-y border-border">
              {content.next.steps.map((step, index) => (
                <NextStep
                  key={step.title}
                  number={String(index + 1).padStart(2, "0")}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </ol>
            <Body>
              {content.next.essayPrefix}{" "}
              <Link
                href={localizedHref(locale, content.next.essayHref)}
                className="text-foreground underline decoration-primary/45 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {content.next.essayTitle}
              </Link>{" "}
              {content.next.essaySuffix}
            </Body>
          </section>

          <PillarCta
            kind="workbook"
            locale={locale}
            placement="after-next-steps"
            href={localizedHref(locale, content.workbookCta.href)}
            eyebrow={content.workbookCta.eyebrow}
            title={content.workbookCta.title}
            description={content.workbookCta.description}
            label={content.workbookCta.label}
            className="mt-16"
          />

          <section
            id="faq"
            aria-labelledby="faq-heading"
            className="scroll-mt-28 border-t border-border pt-14 mt-16"
          >
            <SectionHeading number="08" id="faq-heading">
              {content.faqHeading}
            </SectionHeading>
            <p className="mt-6 font-[family-name:var(--font-lora)] text-base leading-7 text-muted-foreground">
              {content.faqIntro}
            </p>
            <div className="mt-9 divide-y divide-border border-y border-border">
              {content.faqs.map((faq, index) => (
                <details key={faq.question} className="group">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 font-[family-name:var(--font-cormorant-garamond)] text-xl font-medium leading-tight marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden sm:text-2xl">
                    <span className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className="font-light italic text-primary/75"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-2xl font-light text-primary transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 pl-10 pr-8 font-[family-name:var(--font-lora)] text-base leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="author-heading"
            className="mt-16 grid gap-7 border-y border-border py-9 sm:grid-cols-[8rem_1fr] sm:items-center"
          >
            <Image
              src="/profile4.jpeg"
              alt={
                locale === "es"
                  ? "Retrato de Ashley Leon"
                  : "Portrait of Ashley Leon"
              }
              width={240}
              height={300}
              sizes="128px"
              className="aspect-[4/5] w-32 object-cover object-[center_60%]"
            />
            <div>
              <p className="editorial-eyebrow text-primary">
                {content.authorEyebrow}
              </p>
              <h2
                id="author-heading"
                className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-light"
              >
                {content.authorName}
              </h2>
              <p className="mt-3 font-[family-name:var(--font-lora)] text-sm leading-7 text-muted-foreground">
                {content.authorBio}
              </p>
              <Link
                href={localizedHref(locale, "/about")}
                className="editorial-link mt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {content.authorLinkLabel}
                <span className="editorial-link-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </section>

          <PillarCta
            kind="community"
            locale={locale}
            placement="article-footer"
            href={localizedHref(locale, content.communityCta.href)}
            eyebrow={content.communityCta.eyebrow}
            title={content.communityCta.title}
            description={content.communityCta.description}
            label={content.communityCta.label}
            className="mt-16"
          />
        </article>
      </div>
    </main>
  );
}

function SectionHeading({
  number,
  id,
  children,
}: {
  number: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-3 sm:grid-cols-[3.5rem_1fr] sm:gap-5">
      <span
        aria-hidden="true"
        className="pt-1 font-[family-name:var(--font-cormorant-garamond)] text-xl font-light italic text-primary"
      >
        {number}
      </span>
      <h2
        id={id}
        className="font-[family-name:var(--font-cormorant-garamond)] text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.02] tracking-[-0.02em] text-balance"
      >
        {children}
      </h2>
    </div>
  );
}

function Answer({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-7 font-[family-name:var(--font-lora)] text-lg font-medium leading-8 text-foreground sm:text-xl sm:leading-9">
      {children}
    </p>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 font-[family-name:var(--font-lora)] text-base leading-8 text-muted-foreground">
      {children}
    </p>
  );
}

function DefinitionRow({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-medium text-foreground">
        {term}
      </dt>
      <dd className="font-[family-name:var(--font-lora)] text-sm leading-7 text-muted-foreground">
        {children}
      </dd>
    </div>
  );
}

function ExperienceCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: readonly string[];
}) {
  return (
    <div className="border border-border bg-paper p-6">
      <div className="text-primary">{icon}</div>
      <h3 className="mt-4 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 font-[family-name:var(--font-lora)] text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="text-primary">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NextStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <li className="grid gap-3 border-b border-border py-7 last:border-b-0 sm:grid-cols-[3rem_12rem_1fr] sm:gap-5">
      <span
        aria-hidden="true"
        className="font-[family-name:var(--font-cormorant-garamond)] text-xl italic text-primary"
      >
        {number}
      </span>
      <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium leading-tight">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-lora)] text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </li>
  );
}
