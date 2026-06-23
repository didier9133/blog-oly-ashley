import { FadeIn } from "@/components/fade-in";
import { HeroImage } from "@/components/hero-image";
import { HeroContent } from "@/components/hero-content";
import {
  PromotedBook,
  type PromotedBookData,
} from "@/components/promoted-book";
import { HomeSidebar } from "@/components/home-sidebar";
import NoPostsView from "@/components/empty-post";
import { CategoryEnum } from "@/enums";
import { JsonLd } from "@/components/json-ld";
import { getLocale, getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Leaf, Heart } from "lucide-react";

export const revalidate = 3600;

export default async function Home() {
  const currentLanguage = await getLocale();

  const [recentPostOfBlog, recentPostOfRecipes, featuredBook] =
    await Promise.all([
      prisma.post.findFirst({
        where: { published: true, category: { name: CategoryEnum.Blog } },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title_en: true,
          title_es: true,
          content_en: true,
          content_es: true,
          image: true,
          slug_en: true,
        },
      }),
      prisma.post.findFirst({
        where: { published: true, category: { name: CategoryEnum.Recipes } },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title_en: true,
          title_es: true,
          content_en: true,
          content_es: true,
          image: true,
          slug_en: true,
        },
      }),
      prisma.book.findFirst({ orderBy: { createdAt: "desc" } }),
    ]);

  const translatePost = (post: typeof recentPostOfBlog) =>
    post
      ? {
          ...post,
          content: currentLanguage === "en" ? post.content_en : post.content_es,
          title: currentLanguage === "en" ? post.title_en : post.title_es,
          slug: post.slug_en,
        }
      : null;

  const blogPost = translatePost(recentPostOfBlog);
  const recipePost = translatePost(recentPostOfRecipes);

  const promotedBook: PromotedBookData | null = featuredBook
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
        locale: currentLanguage === "en" ? "en" : "es",
      }
    : null;

  const t = await getTranslations("Home");

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Raíces & Returnings",
    url: "https://www.raicesreturnings.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.raicesreturnings.com/og-image.jpeg",
      width: 1200,
      height: 630,
    },
    sameAs: [
      "https://www.instagram.com/raicesreturnings",
      "https://www.tiktok.com/@raicesreturnings",
      "https://www.youtube.com/@raicesreturnings",
      "https://raicesreturnings.substack.com",
    ],
    contactPoint: {
      "@type": "schema.org/ContactPoint",
      email: "support@raicesreturnings.com",
      contactType: "customer support",
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Raíces & Returnings",
    url: "https://www.raicesreturnings.com",
    inLanguage: ["en", "es"],
    publisher: {
      "@type": "Organization",
      name: "Raíces & Returnings",
    },
  };

  const sanitize = (html: string | null | undefined) =>
    DOMPurify.sanitize(html ?? "", { ALLOWED_TAGS: [] });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      <main className="bg-background text-foreground">
        <div className="max-w-[1760px] mx-auto min-[1280px]:flex min-[1280px]:gap-10">
        <div className="min-[1280px]:flex-1 min-[1280px]:min-w-0">
        {/* ============================================================== */}
        {/* HERO — Editorial split (text left / image right)               */}
        {/* Responsive: mobile = stacked (image top, text below)           */}
        {/*             md+    = split with image bleeding to right edge   */}
        {/* Wave SVG transitions into the book section below               */}
        {/* ============================================================== */}
        <section
          id="hero"
          className="relative bg-background -mt-16 sm:-mt-[72px] md:-mt-20"
        >
          {/* ---------- Mobile / Tablet: stacked with full-bleed image ---------- */}
          <div className="md:hidden relative w-full">
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] overflow-hidden bg-sand">
              <HeroImage
                src="/hero-image.webp"
                alt={t("alt-hero-main")}
                sizes="(min-width: 768px) 0px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                variant="clean"
                objectPosition="object-[center_25%]"
                priority
              />
            </div>
          </div>

          {/* ---------- Desktop: text on left, image aligned to navbar right edge ---------- */}
          <div className="hidden md:block relative z-10 py-16 md:py-20 lg:py-24">
            <div className="relative max-w-[1760px] mx-auto min-h-[75vh] sm:min-h-[80vh] lg:min-h-[85vh]">
              {/* Image — absolute, constrained to navbar's right edge */}
                <div className="absolute right-0 -inset-y-[25px] w-[55%] lg:w-[58%]">
                <div
                  className="relative h-full w-full overflow-hidden bg-sand"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 10%, rgba(0,0,0,0.5) 22%, rgba(0,0,0,0.82) 36%, black 50%, black 100%)",
                    maskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 10%, rgba(0,0,0,0.5) 22%, rgba(0,0,0,0.82) 36%, black 50%, black 100%)",
                  }}
                >
                  <HeroImage
                    src="/hero-image.webp"
                    alt={t("alt-hero-main")}
                    sizes="(min-width: 1024px) 60vw, (min-width: 1536px) 1152px, 100vw"
                    variant="clean"
                    objectPosition="object-center"
                    priority={false}
                  />
                </div>
              </div>

              <div className="relative z-10 flex items-end min-h-[75vh] sm:min-h-[80vh] lg:min-h-[85vh] px-4 sm:px-6 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
                <div className="grid grid-cols-12 items-center gap-8 lg:gap-12 w-full">
                  <HeroContent
                    className="col-span-12 md:col-span-6 lg:col-span-6 max-w-[30rem]"
                    titleOne={t("hero-title-one")}
                    titleHighlight={t("hero-title-highlight")}
                    titleTwo={t("hero-title-two")}
                    description={t("hero-description")}
                    ctaPrimary={{ label: t("cta-journals"), href: "/ebook" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile text content (renders below the full-bleed image) */}
          <div className="md:hidden relative z-10 max-w-[1760px] mx-auto px-4 sm:px-6 pt-12 sm:pt-14 pb-16 sm:pb-20">
            <HeroContent
              spacing="tight"
              titleOne={t("hero-title-one")}
              titleHighlight={t("hero-title-highlight")}
              titleTwo={t("hero-title-two")}
              description={t("hero-description")}
              ctaPrimary={{ label: t("cta-journals"), href: "/ebook" }}
            />
          </div>

          {/* Soft bottom edge: a hill-shaped curve that bleeds into the
              workbook section below. The horizontal gradient fades from
              transparent on the left to the book color on the right so
              the curve and the section read as one continuous shape. The
              slight negative bottom overlap with the section eliminates
              any subpixel seam from anti-aliasing. */}
          <svg
            className="absolute bottom-[-18px] sm:bottom-[-23px] md:bottom-[-28px] lg:bottom-[-34px] left-0 z-20 w-full h-[120px] sm:h-[150px] md:h-[215px] lg:h-[265px] pointer-events-none"
            viewBox="0 0 1440 140"
            preserveAspectRatio="none"
            fill="url(#bookWaveGradient)"
            aria-hidden="true"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
            }}
          >
            <defs>
              <linearGradient
                id="bookWaveGradient"
                x1="0"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--book)" stopOpacity="0" />
                <stop offset="10%" stopColor="var(--book)" stopOpacity="0.32" />
                <stop offset="25%" stopColor="var(--book)" stopOpacity="0.62" />
                <stop offset="35%" stopColor="var(--book)" stopOpacity="0.88" />
                <stop offset="50%" stopColor="var(--book)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--book)" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d="M0,84 C360,12 1080,12 1440,84 L1440,140 L0,140 Z" />
          </svg>
        </section>

        {/* ============================================================== */}
        {/* FEATURED BOOK                                                  */}
        {/* ============================================================== */}
        <section
          id="book"
          className="relative -mt-px"
          style={{ "--bridge-color": "var(--book)" } as React.CSSProperties}
        >
          <div className="section-bleed-bridge" />
          <div className="relative max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <PromotedBook
              book={promotedBook}
              eyebrow={t("book-eyebrow")}
              tagline={t("book-tagline")}
              blurbStart={t("book-blurb-start")}
              blurbHighlight={t("book-blurb-highlight")}
              blurbEnd={t("book-blurb-end")}
              cta={t("book-cta")}
              emptyState={t("book-empty")}
              fallbackHref="/ebook"
              className="bg-transparent w-full"
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* MANIFESTO — Quiet, generous, a single column of intention      */}
        {/* ============================================================== */}
        <section
          id="manifesto"
          className="relative editorial-breathe"
          style={{ "--bridge-color": "var(--paper)" } as React.CSSProperties}
        >
          <div className="section-bleed-bridge" />
          <div className="relative max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="editorial-container-narrow">
            {/* Section header */}
            <FadeIn>
              <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start mb-14 lg:mb-20">
                <div className="col-span-12 lg:col-span-2">
                  <span
                    aria-hidden
                    className="editorial-numeral block text-[7rem] sm:text-[9rem] lg:text-[10rem] leading-[0.8]"
                  >
                    01
                  </span>
                </div>
                <div className="col-span-12 lg:col-span-10 lg:pt-6">
                  <span className="editorial-eyebrow">
                    {t("manifesto-eyebrow")}
                  </span>
                  <h2 className="editorial-display-m mt-5 text-foreground text-balance">
                    {t("manifesto-title")}
                  </h2>
                  <span className="editorial-rule-tick block mt-8 lg:mt-10" />
                </div>
              </div>
            </FadeIn>

            {/* Pull quote */}
            <FadeIn delay={0.15}>
              <blockquote className="editorial-pullquote text-balance">
                <span className="text-primary">“</span>
                {t("paragraph-description-two")}
                <span className="text-primary">”</span>
              </blockquote>
            </FadeIn>

            {/* Pillar grid */}
            <FadeIn delay={0.25}>
              <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
                {[
                  {
                    icon: BookOpen,
                    title: t("manifesto-pillar-1-title"),
                    desc: t("manifesto-pillar-1-desc"),
                  },
                  {
                    icon: Leaf,
                    title: t("manifesto-pillar-2-title"),
                    desc: t("manifesto-pillar-2-desc"),
                  },
                  {
                    icon: Heart,
                    title: t("manifesto-pillar-3-title"),
                    desc: t("manifesto-pillar-3-desc"),
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-5">
                    <span
                      aria-hidden
                      className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full"
                      style={{
                        background:
                          "color-mix(in oklab, var(--primary) 18%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      <Icon className="w-[1.1rem] h-[1.1rem]" strokeWidth={1.5} />
                    </span>
                    <div>
                      <span className="editorial-eyebrow-strong block">
                        {title}
                      </span>
                      <p className="editorial-body mt-4 text-pretty">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Divider */}
            <FadeIn delay={0.35}>
              <span className="editorial-rule block mt-16 lg:mt-24" />
            </FadeIn>

            {/* The work */}
            <FadeIn delay={0.4}>
              <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                <div className="lg:col-span-2">
                  <span className="editorial-eyebrow">The work</span>
                </div>
                <div className="lg:col-span-9 space-y-6">
                  <p className="editorial-body text-pretty">
                    {t("paragraph-description")}
                  </p>
                  <p className="editorial-body text-pretty italic font-light text-foreground">
                    {t("paragraph-description-three")}{" "}
                    {t("paragraph-description-four")}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* WHAT YOU'LL FIND — Editorial typographic list                  */}
        {/* ============================================================== */}
        <section
          id="find"
          className="relative editorial-breathe"
          style={{ "--bridge-color": "var(--sand)" } as React.CSSProperties}
        >
          <div className="section-bleed-bridge" />
          <div className="relative max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="editorial-container">
            <FadeIn>
              <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start mb-16 lg:mb-24">
                <div className="col-span-12 lg:col-span-2">
                  <span
                    aria-hidden
                    className="editorial-numeral block text-[7rem] sm:text-[9rem] lg:text-[10rem] leading-[0.8]"
                  >
                    02
                  </span>
                </div>
                <div className="col-span-12 lg:col-span-6 lg:pt-6">
                  <span className="editorial-eyebrow">{t("find-label")}</span>
                  <h2 className="editorial-display-m mt-5 text-foreground text-balance">
                    {t("find-title")}
                  </h2>
                </div>
                <div className="col-span-12 lg:col-span-4 lg:pt-10">
                  <p className="editorial-body text-pretty">
                    {t("find-blurb")}
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <ol className="editorial-list max-w-4xl">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="editorial-list-item group">
                    <span aria-hidden className="editorial-list-num">
                      0{i}
                    </span>
                    <div>
                      <h3 className="editorial-list-title">
                        {t(`find-item-${i}`)}
                      </h3>
                      <p className="editorial-list-desc">
                        {t(`find-item-${i}-desc`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="mt-16 lg:mt-20 flex flex-wrap items-center gap-x-10 gap-y-5">
                <a
                  href="https://substack.com/@ashleyleon?utm_campaign=profile&utm_medium=profile-page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link"
                >
                  {t("cta-explore")}
                  <span className="editorial-link-arrow">→</span>
                </a>
                <Link href="/ebook" className="editorial-link">
                  {t("cta-journals")}
                  <span className="editorial-link-arrow">→</span>
                </Link>
                <a
                  href="https://www.youtube.com/@WhispersfortheInBetween"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link"
                >
                  {t("cta-youtube")}
                  <span className="editorial-link-arrow">→</span>
                </a>
              </div>
            </FadeIn>
          </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* FRESH FROM — Two latest offerings, asymmetric & sticky         */}
        {/* ============================================================== */}
        <section
          id="fresh"
          className="relative editorial-breathe"
          style={{ "--bridge-color": "var(--background)" } as React.CSSProperties}
        >
          <div className="section-bleed-bridge" />
          <div className="relative max-w-[1760px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="editorial-container">
            <FadeIn>
              <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start pb-10 lg:pb-14 mb-20 lg:mb-28 border-b border-foreground/15">
                <div className="col-span-12 lg:col-span-2">
                  <span
                    aria-hidden
                    className="editorial-numeral block text-[7rem] sm:text-[9rem] lg:text-[10rem] leading-[0.8]"
                  >
                    03
                  </span>
                </div>
                <div className="col-span-12 lg:col-span-6 lg:pt-6">
                  <span className="editorial-eyebrow">
                    {t("fresh-eyebrow")}
                  </span>
                  <h2 className="editorial-display-m mt-5 text-foreground text-balance">
                    {t("fresh-title-two")}
                  </h2>
                  <p className="editorial-body mt-6 text-sm lg:text-base max-w-md text-pretty">
                    {t("fresh-title-one")}
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-4 lg:pt-10">
                  <p className="editorial-body text-pretty">
                    {t("paragraph-fresh")}
                  </p>
                </div>
              </div>
            </FadeIn>

            {!blogPost || !recipePost ? (
              <NoPostsView />
            ) : (
              <div className="space-y-28 lg:space-y-40">
                {/* Post 01 — image left, text right */}
                <article
                  key={blogPost.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 group"
                >
                  <FadeIn className="lg:col-span-7 relative">
                    <div
                      className="relative w-full overflow-hidden bg-sand"
                      style={{ aspectRatio: "4/5" }}
                    >
                      <Image
                        src={blogPost.image || "/placeholder.jpg"}
                        alt={blogPost.title}
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="object-cover transition-transform duration-[2s] ease-[var(--ease-breath)] group-hover:scale-[1.04]"
                      />
                    </div>
                  </FadeIn>

                  <div className="lg:col-span-5 relative h-full">
                    <div className="sticky top-20 md:top-24 h-fit flex flex-col text-left items-start">
                      <FadeIn>
                        <div className="flex items-center gap-4 mb-7">
                          <span className="editorial-list-num">01</span>
                          <span className="editorial-eyebrow-strong">
                            {t("fresh-blog-label")}
                          </span>
                        </div>
                        <h3 className="editorial-display-s text-foreground text-balance">
                          <Link
                            href={`/${CategoryEnum.Blog}/${blogPost.slug}`}
                            className="transition-colors duration-700 hover:text-primary"
                          >
                            {blogPost.title}
                          </Link>
                        </h3>
                        <p className="editorial-body mt-6 text-pretty line-clamp-4">
                          {sanitize(blogPost.content)}
                        </p>
                        <Link
                          href={`/${CategoryEnum.Blog}/${blogPost.slug}`}
                          className="editorial-link mt-8"
                        >
                          {t("btn-fresh")}
                          <span className="editorial-link-arrow">→</span>
                        </Link>
                      </FadeIn>
                    </div>
                  </div>
                </article>

                {/* Post 02 — text left, image right */}
                <article
                  key={recipePost.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 group"
                >
                  <div className="lg:col-span-5 lg:order-1 relative h-full">
                    <div className="sticky top-20 md:top-24 h-fit flex flex-col text-left items-start">
                      <FadeIn>
                        <div className="flex items-center gap-4 mb-7">
                          <span className="editorial-list-num">02</span>
                          <span className="editorial-eyebrow-strong">
                            {t("fresh-recipe-label")}
                          </span>
                        </div>
                        <h3 className="editorial-display-s text-foreground text-balance">
                          <Link
                            href={`/${CategoryEnum.Recipes}/${recipePost.slug}`}
                            className="transition-colors duration-700 hover:text-primary"
                          >
                            {recipePost.title}
                          </Link>
                        </h3>
                        <p className="editorial-body mt-6 text-pretty line-clamp-4">
                          {sanitize(recipePost.content)}
                        </p>
                        <Link
                          href={`/${CategoryEnum.Recipes}/${recipePost.slug}`}
                          className="editorial-link mt-8"
                        >
                          {t("btn-fresh")}
                          <span className="editorial-link-arrow">→</span>
                        </Link>
                      </FadeIn>
                    </div>
                  </div>

                  <FadeIn className="lg:col-span-7 lg:order-2 relative">
                    <div
                      className="relative w-full overflow-hidden bg-sand"
                      style={{ aspectRatio: "4/5" }}
                    >
                      <Image
                        src={recipePost.image || "/placeholder.jpg"}
                        alt={recipePost.title}
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="object-cover transition-transform duration-[2s] ease-[var(--ease-breath)] group-hover:scale-[1.04]"
                      />
                    </div>
                  </FadeIn>
                </article>
              </div>
            )}

            <FadeIn delay={0.15} className="mt-24 lg:mt-32 text-center">
              <Link
                href={`/${CategoryEnum.Blog}`}
                className="editorial-link mx-auto"
              >
                {t("fresh-view-all")}
                <span className="editorial-link-arrow">→</span>
              </Link>
            </FadeIn>
          </div>
          </div>
        </section>

        </div>
        <aside
          aria-label="Page navigation"
          className="hidden lg:block w-[260px] shrink-0 pr-4 sm:pr-6 md:pr-8 lg:pr-10"
        >
          <div className="sticky top-[5rem] md:top-[5.5rem] pt-[7.5rem] pb-12">
            <HomeSidebar />
          </div>
        </aside>
        </div>
      </main>
    </>
  );
}
