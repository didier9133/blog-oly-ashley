import { getImageProps } from "next/image";
import Link from "next/link";
import { HomeCircleCta } from "@/components/home-circle-cta";
import { HomeCommunityCta } from "@/components/home-community-cta";
import { HomeFeaturedRebuildingReverence } from "@/components/home-featured-rebuilding-reverence";
import { HomeManifesto } from "@/components/home-manifesto";
import { HomeRecentWriting } from "@/components/home-recent-writing";
import { HomeSectionWhoFor } from "@/components/home-section-who-for";
import { HomeSidebar } from "@/components/home-sidebar";
import { JsonLd } from "@/components/json-ld";
import { CategoryEnum } from "@/enums";
import prisma from "@/lib/prisma";
import { fullUrl, localizedHref } from "@/lib/url";
import { getTranslations } from "next-intl/server";
import { publicPostSlug } from "@/lib/post-slugs";
import { htmlExcerpt } from "@/lib/plain-text";
import {
  organizationSchema,
  personRef,
  personSchema,
  websiteRef,
  websiteSchema,
} from "@/lib/schema-entities";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const HERO_IMAGE = "/ashley-hero-2026.jpeg";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: currentLanguage } = await params;
  const t = await getTranslations({
    locale: currentLanguage,
    namespace: "Home",
  });

  const [recentWriting, featuredBook] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, category: { name: CategoryEnum.Blog } },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title_en: true,
        title_es: true,
        content_en: true,
        content_es: true,
        image: true,
        slug_en: true,
        slug_es: true,
      },
    }),
    prisma.book.findFirst({
      where: {
        OR: [
          { slug_en: "rebuilding-reverence" },
          { slug_es: "reconstruyendo-la-reverencia" },
        ],
      },
    }),
  ]);

  const promotedBook = featuredBook
    ? {
        title:
          currentLanguage === "en"
            ? featuredBook.title_en
            : featuredBook.title_es,
        subtitle:
          currentLanguage === "en"
            ? featuredBook.subtitle_en
            : featuredBook.subtitle_es,
        coverImage:
          currentLanguage === "en"
            ? featuredBook.coverImage_en
            : featuredBook.coverImage_es,
        slug:
          currentLanguage === "en"
            ? featuredBook.slug_en
            : featuredBook.slug_es,
        locale: currentLanguage === "en" ? ("en" as const) : ("es" as const),
      }
    : null;

  const writingPosts = recentWriting.map((post) => ({
    href: localizedHref(
      currentLanguage,
      `/writing/${publicPostSlug(currentLanguage === "es" ? post.slug_es : post.slug_en)}`,
    ),
    id: post.id,
    title: currentLanguage === "en" ? post.title_en : post.title_es,
    excerpt: htmlExcerpt(
      currentLanguage === "en" ? post.content_en : post.content_es,
    ),
    image: post.image,
  }));

  const primaryWorkbookPath =
    currentLanguage === "en"
      ? "/workbooks/rebuilding-reverence"
      : "/workbooks/reconstruyendo-la-reverencia";
  const primaryWorkbookHref = localizedHref(
    currentLanguage,
    primaryWorkbookPath,
  );
  const writingHref = localizedHref(currentLanguage, "/writing");
  const circleHref = localizedHref(currentLanguage, "/circle");
  const communityHref = localizedHref(currentLanguage, "/community");
  const homeUrl = fullUrl(currentLanguage, "/");

  const aiSummaryEn =
    "Ashley Leon is a writer, workshop facilitator, and certified holistic mind-body coach creating resources for people navigating faith deconstruction, queer spirituality, and healing after religion. Her primary offering is Rebuilding Reverence, a $33 guided 30-day workbook. She also runs the Rebuilding Reverence Circle, a live 4-week group workshop capped at 15 people, an online community called The In-Between, and offers a second workbook, Queer & Called. Her work is affirming, non-doctrinal, and coaching-based, not therapy.";
  const aiSummaryEs =
    "Ashley Leon es escritora, facilitadora de talleres y coach holística certificada de cuerpo-mente. Crea recursos para personas atravesando deconstrucción de fe, identidad, pertenencia y sanación después de la religión. Su oferta principal es Rebuilding Reverence, una guía práctica guiada de 30 días por $33. También facilita The Rebuilding Reverence Circle, una experiencia grupal en vivo de 4 semanas con cupo de 15 personas, una comunidad privada llamada The In-Between y una segunda guía práctica sobre fe, identidad y llamado. Su trabajo es honesto, no doctrinal y basado en coaching, no terapia.";

  const aiSummarySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Ashley Leon | Rebuilding Faith, Identity & Reverence After Deconstruction",
    url: homeUrl,
    inLanguage: currentLanguage,
    isPartOf: websiteRef,
    about: personRef,
    description: currentLanguage === "es" ? aiSummaryEs : aiSummaryEn,
  };

  const heroDesktopSizes =
    "(min-width: 1280px) calc(100vw - 300px), 100vw";
  const { props: heroDesktopProps } = getImageProps({
    src: HERO_IMAGE,
    alt: "",
    fill: true,
    priority: true,
    quality: 85,
    sizes: heroDesktopSizes,
  });
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={personSchema} />
      <JsonLd data={aiSummarySchema} />
      <main className="home-page relative isolate bg-background text-foreground">
        <div className="relative z-10 mx-auto max-w-[1760px] min-[1280px]:flex min-[1280px]:gap-10">
          <div className="min-[1280px]:min-w-0 min-[1280px]:flex-1">
            <section
              id="hero"
              className="home-hero relative isolate -mt-16 overflow-hidden bg-[#f7f1eb] sm:-mt-[72px] md:mt-0 md:h-[calc(100svh-4.75rem)] md:min-h-[46rem] md:max-h-[68rem]"
            >
              <div
                aria-hidden
                className="absolute inset-0 overflow-hidden"
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={HERO_IMAGE}
                  />
                  <source
                    media="(min-width: 768px)"
                    srcSet={heroDesktopProps.srcSet}
                    sizes={heroDesktopSizes}
                  />
                  <img
                    {...heroDesktopProps}
                    alt=""
                    srcSet={undefined}
                    sizes={undefined}
                    className="home-hero-media object-cover object-[57%_center] min-[390px]:object-[59%_center] sm:object-[72%_center] md:object-[61%_44%] xl:object-[61%_43%]"
                  />
                </picture>
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,246,240,0.66)_0%,rgba(250,246,240,0.44)_42%,rgba(250,246,240,0.12)_68%,rgba(250,246,240,0)_100%)] md:hidden"
              />
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(250,246,240,0.94)_0%,rgba(250,246,240,0.84)_28%,rgba(250,246,240,0.24)_46%,rgba(250,246,240,0.02)_64%,rgba(250,246,240,0.08)_82%,rgba(250,246,240,0.42)_100%)] md:block"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,246,240,0.02)_0%,rgba(250,246,240,0.12)_42%,rgba(246,234,226,0.78)_100%)] md:bg-[radial-gradient(circle_at_24%_28%,rgba(255,255,255,0.6),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,0.16),transparent_38%,rgba(235,215,204,0.18)_100%)]"
              />
              <div aria-hidden className="home-hero-texture absolute inset-0" />
              <div
                aria-hidden
                className="absolute bottom-0 right-[9%] hidden h-[82%] w-px bg-white/65 shadow-[18px_0_0_rgba(255,255,255,0.42),36px_0_0_rgba(255,255,255,0.25)] md:block"
              />

              <div className="relative z-30 grid min-h-[calc(100svh-4rem)] grid-cols-1 items-end gap-8 px-4 pb-32 pt-[18svh] min-[390px]:pb-36 min-[390px]:pt-[20svh] sm:px-6 sm:pb-32 sm:pt-[38vh] md:h-full md:min-h-0 md:grid-cols-12 md:items-center md:px-8 md:py-8 lg:px-12 lg:py-10">
                <div className="max-w-[34rem] pb-7 md:col-span-6 md:pb-0">
                  <span className="home-hero-reveal home-hero-reveal-1 editorial-eyebrow hero-eyebrow-contrast hidden sm:inline-flex items-center gap-4">
                    <span aria-hidden className="h-px w-7 bg-primary/65" />
                    {t("hero-eyebrow")}
                  </span>
                  <h1 className="home-hero-reveal home-hero-reveal-2 mt-5 max-w-[12ch] font-[family-name:var(--font-cormorant-garamond)] text-[clamp(2.45rem,11vw,2.85rem)] font-light leading-[0.92] tracking-[-0.02em] text-foreground text-balance sm:mt-6 sm:max-w-none sm:text-[clamp(3.2rem,5.8vw,5.35rem)] md:text-[clamp(3.15rem,4.25vw,4.75rem)] md:tracking-[-0.03em] xl:text-[clamp(3.45rem,4.2vw,5rem)]">
                    {t("hero-title-one")} {" "}
                    <span className="block">
                      {t("hero-title-two")}{" "}
                      <em className="not-italic text-primary">
                        {t("hero-title-highlight")}
                      </em>
                    </span>
                  </h1>
                  <span className="home-hero-rule mt-5 block sm:mt-8 md:mt-6" />
                  <p className="home-hero-reveal home-hero-reveal-3 editorial-lede mt-4 max-w-[35ch] text-[0.95rem] leading-[1.42] text-pretty sm:mt-8 sm:text-[clamp(1.0625rem,1.4vw,1.25rem)] sm:leading-[1.65] md:mt-6 md:text-[clamp(1rem,1.05vw,1.125rem)] md:leading-[1.62]">
                    {t("hero-description")}
                  </p>
                  <div className="home-hero-reveal home-hero-reveal-4 mt-5 flex w-full max-w-[25rem] flex-col gap-2 sm:mt-9 sm:grid sm:max-w-[34rem] sm:grid-cols-[1.55fr_1fr] sm:gap-3 md:mt-7">
                    <Link
                      href={primaryWorkbookHref}
                      className="home-hero-button group inline-flex min-h-9 flex-1 items-center justify-between gap-3 bg-[#8f513b] px-4 py-2.5 font-[family-name:var(--font-lora)] text-[0.66rem] font-bold uppercase leading-tight tracking-[0.12em] text-[#fffaf5] transition-[background-color,transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:bg-[#784330] hover:shadow-[0_14px_34px_-18px_rgba(92,45,31,0.75)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f513b] sm:min-h-12 sm:px-6 sm:py-4 sm:text-[0.69rem] sm:tracking-[0.16em] md:min-h-11 md:py-3"
                    >
                      <span className="min-w-0 text-balance">{t("cta-journals")}</span>
                      <span
                        aria-hidden
                        className="transition-transform duration-500 group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </Link>
                    <Link
                      href={writingHref}
                      className="home-hero-button group inline-flex min-h-9 flex-1 items-center justify-between gap-3 border border-primary/45 bg-[#fbf7f1]/30 px-4 py-2.5 font-[family-name:var(--font-lora)] text-[0.66rem] font-bold uppercase leading-tight tracking-[0.12em] text-foreground backdrop-blur-[2px] transition-[border-color,color,background-color,transform] duration-500 hover:-translate-y-0.5 hover:border-primary hover:bg-[#fbf7f1]/55 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:min-h-12 sm:px-6 sm:py-4 sm:text-[0.69rem] sm:tracking-[0.16em] md:min-h-11 md:py-3"
                    >
                      <span className="min-w-0 text-balance">{t("cta-explore")}</span>
                      <span
                        aria-hidden
                        className="transition-transform duration-500 group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="home-hero-reveal home-hero-reveal-5 pointer-events-none absolute bottom-8 left-8 z-30 hidden items-center gap-4 md:flex lg:left-12">
                <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-foreground/15">
                  <span className="home-hero-scroll-line absolute inset-x-0 top-0 h-5 bg-primary" />
                </span>
                <span className="font-[family-name:var(--font-lora)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-foreground/55">
                  {t("hero-est")}
                </span>
              </div>

              <div
                aria-hidden
                className="absolute bottom-10 right-[5.5%] z-30 hidden origin-bottom-right -rotate-90 font-[family-name:var(--font-lora)] text-[0.56rem] font-medium uppercase tracking-[0.38em] text-foreground/45 md:block"
              >
                Ashley Leon · Field Notes
              </div>

              <svg
                className="pointer-events-none absolute bottom-[-46px] left-0 z-20 h-[100px] w-full sm:bottom-[-1px] sm:h-[150px] md:hidden"
                viewBox="0 0 1440 180"
                preserveAspectRatio="none"
                fill="var(--book)"
                aria-hidden="true"
              >
                <path d="M0,126 C290,48 628,20 990,72 C1168,98 1306,139 1440,152 L1440,180 L0,180 Z" />
              </svg>
            </section>

            <HomeSectionWhoFor
              eyebrow={t("who-eyebrow")}
              title={t("who-title")}
              quotes={[
                { quote: t("who-quote-1"), label: t("who-label-1") },
                { quote: t("who-quote-2"), label: t("who-label-2") },
                { quote: t("who-quote-3"), label: t("who-label-3") },
              ]}
            />

            <HomeManifesto
              eyebrow={t("manifesto-eyebrow")}
              title={t("manifesto-title")}
              quote={t("paragraph-description-two")}
              workLabel={t("manifesto-work-label")}
              body={t("paragraph-description")}
              closing={`${t("paragraph-description-three")} ${t(
                "paragraph-description-four",
              )}`}
              pillars={[
                {
                  title: t("manifesto-pillar-1-title"),
                  desc: t("manifesto-pillar-1-desc"),
                },
                {
                  title: t("manifesto-pillar-2-title"),
                  desc: t("manifesto-pillar-2-desc"),
                },
                {
                  title: t("manifesto-pillar-3-title"),
                  desc: t("manifesto-pillar-3-desc"),
                },
              ]}
            />

            <span id="book" className="sr-only" aria-hidden="true" />
            <HomeFeaturedRebuildingReverence
              book={promotedBook}
              eyebrow={t("book-eyebrow")}
              tagline={t("book-tagline")}
              blurbStart={t("book-blurb-start")}
              blurbHighlight={t("book-blurb-highlight")}
              blurbEnd={t("book-blurb-end")}
              cta={t("book-cta")}
              emptyState={t("book-empty")}
            />

            <span id="find" className="sr-only" aria-hidden="true" />
            <HomeCircleCta
              eyebrow={t("circle-eyebrow")}
              title={t("circle-title")}
              description={t("circle-description")}
              cta={t("circle-cta")}
              href={circleHref}
            />

            <HomeCommunityCta
              eyebrow={t("community-eyebrow")}
              title={t("community-title")}
              description={t("community-description")}
              cta={t("community-cta")}
              href={communityHref}
            />

            <span id="fresh" className="sr-only" aria-hidden="true" />
            <HomeRecentWriting
              eyebrow={t("fresh-eyebrow")}
              title={t("fresh-title-two")}
              description={t("paragraph-fresh")}
              posts={writingPosts}
              empty={t("writing-empty")}
              readMore={t("btn-fresh")}
              viewAll={t("fresh-view-all")}
              viewAllHref={writingHref}
            />
          </div>

          <aside
            aria-label={t("sidebar-index")}
            className="hidden w-[260px] shrink-0 pr-4 sm:pr-6 md:pr-8 min-[1280px]:block min-[1280px]:pr-10"
          >
            <div className="sticky top-[5rem] pb-12 pt-[7.5rem] md:top-[5.5rem]">
              <HomeSidebar />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
