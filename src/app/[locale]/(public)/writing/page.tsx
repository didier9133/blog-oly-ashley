import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import NoPostsView from "@/components/empty-post";
import { CategoryEnum } from "@/enums";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { fullUrl, BASE_URL, localizedHref, ogImageUrl } from "@/lib/url";
import { htmlToPlainText } from "@/lib/plain-text";
import { localizedAlternates, localizedOpenGraph } from "@/lib/seo";
import { publicPostSlug } from "@/lib/post-slugs";
import { resolveSpanishPostContent } from "@/lib/spanish-post-content";
import { getPostSeoDecision } from "@/lib/seo-content";
type SearchParams = Promise<{ page?: string }>;
const CATEGORY = CategoryEnum.Blog;
const PATH = "writing";
const EXCERPT_MAX = 280;
const FIRST_PAGE_SIZE = 7;
const FOLLOWING_PAGE_SIZE = 6;

const postSelect = {
  id: true,
  title_en: true,
  title_es: true,
  content_en: true,
  content_es: true,
  image: true,
  slug_en: true,
  slug_es: true,
  createdAt: true,
  author: { select: { firstName: true, lastName: true } },
} as const;

type PostCard = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  href: string;
  publishedAt: Date;
  authorFirstName: string;
  authorLastName: string;
};

const buildExcerpt = (html: string | null | undefined, max = EXCERPT_MAX) => {
  const text = htmlToPlainText(html);
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
};

const toCard = (
  post: {
    id: number;
    title_en: string;
    title_es: string;
    content_en: string | null;
    content_es: string | null;
    image: string;
    slug_en: string;
    slug_es: string;
    createdAt: Date;
    author: { firstName: string; lastName: string };
  },
  currentLanguage: string,
): PostCard => {
  const decision = getPostSeoDecision(
    publicPostSlug(post.slug_en),
    publicPostSlug(post.slug_es),
  );
  const locale = currentLanguage === "es" ? "es" : "en";
  const content =
    locale === "es"
      ? resolveSpanishPostContent(post.slug_en, post.content_es)
      : post.content_en;

  return {
    id: post.id,
    title:
      decision?.displayTitle?.[locale] ??
      (locale === "en" ? post.title_en : post.title_es),
    excerpt: buildExcerpt(content),
    image: post.image,
    slug: publicPostSlug(locale === "es" ? post.slug_es : post.slug_en),
    href: localizedHref(
      currentLanguage,
      `/${PATH}/${publicPostSlug(locale === "es" ? post.slug_es : post.slug_en)}`,
    ),
    publishedAt: post.createdAt,
    authorFirstName: post.author.firstName,
    authorLastName: post.author.lastName,
  };
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: "Writing.metadata" });
  const tSite = await getTranslations({ locale, namespace: "metadata" });
  const parsedPage = Number.parseInt(query?.page ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 1 ? parsedPage : 1;
  const baseTitle = t("title");
  const title =
    page > 1
      ? locale === "es"
        ? `Ensayos sobre fe y deconstrucción — Página ${page} | Ashley Leon`
        : `Essays on Faith and Deconstruction — Page ${page} | Ashley Leon`
      : baseTitle;
  const description = t("description");
  const path = page > 1 ? `/writing?page=${page}` : "/writing";
  const image =
    locale === "es"
      ? {
          url: ogImageUrl(locale),
          width: 1200,
          height: 630,
          alt: tSite("ogImageAlt"),
          type: "image/jpeg",
        }
      : {
          url: `${BASE_URL}/blog-hero.webp`,
          width: 1920,
          height: 1080,
          alt: "Hands writing on a laptop beside a reflection journal",
          type: "image/webp",
        };

  return {
    title,
    description,
    openGraph: {
      ...localizedOpenGraph(locale),
      type: "website",
      title,
      description,
      url: fullUrl(locale, path),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
    alternates: localizedAlternates(locale, { en: path, es: path }),
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page ?? "1", 10);
  const { locale: currentLanguage } = await props.params;
  const t = await getTranslations({
    locale: currentLanguage,
    namespace: "Writing",
  });
  const tPagination = await getTranslations({
    locale: currentLanguage,
    namespace: "ui.pagination",
  });

  const total = await prisma.post.count({
    where: {
      published: true,
      category: {
        name: CATEGORY,
      },
    },
  });
  const totalPages =
    total === 0
      ? 0
      : total <= FIRST_PAGE_SIZE
        ? 1
        : 1 +
          Math.ceil((total - FIRST_PAGE_SIZE) / FOLLOWING_PAGE_SIZE);

  if (
    page < 1 ||
    isNaN(page) ||
    (totalPages === 0 ? page !== 1 : page > totalPages)
  ) {
    notFound();
  }

  const pageSize = page === 1 ? FIRST_PAGE_SIZE : FOLLOWING_PAGE_SIZE;
  const skip =
    page === 1
      ? 0
      : FIRST_PAGE_SIZE + (page - 2) * FOLLOWING_PAGE_SIZE;

  const [firstPost, posts] = await Promise.all([
    page === 1
      ? prisma.post.findFirst({
          where: {
            published: true,
            category: { name: CATEGORY },
          },
          orderBy: { createdAt: "desc" },
          select: postSelect,
        })
      : Promise.resolve(null),
    prisma.post.findMany({
      where: {
        published: true,
        category: { name: CATEGORY },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: postSelect,
    }),
  ]);

  if (total === 0 || (page === 1 && !firstPost)) {
    return <NoPostsView />;
  }

  const firstPostCard = firstPost
    ? toCard(firstPost, currentLanguage)
    : undefined;
  const listCards: PostCard[] = posts
    .filter((post) => post.id !== firstPost?.id)
    .map((post) => toCard(post, currentLanguage));
  const schemaCards = firstPostCard
    ? [firstPostCard, ...listCards]
    : listCards;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: currentLanguage === "es" ? "Ensayos" : "Writing",
    url: fullUrl(
      currentLanguage,
      page > 1 ? `/writing?page=${page}` : "/writing",
    ),
    itemListElement: schemaCards.map((p, i) => ({
      "@type": "ListItem",
      position: skip + i + 1,
      url: fullUrl(currentLanguage, `/writing/${p.slug}`),
      name: p.title,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center   font-[family-name:var(--font-cormorant-garamond)]">
      <JsonLd data={itemListSchema} />
      {/* HERO */}

      {!totalPages ? (
        <NoPostsView />
      ) : (
        <>
          {/* Page H1 */}
          <h1 className="sr-only">{t("page-title")}</h1>

          {/* FEATURED POST HERO */}
          {firstPostCard ? (
            <section className="w-full max-w-6xl mx-auto px-6 pt-12 pb-16">
            <div className="flex flex-col md:flex-row items-stretch gap-12 lg:gap-20">
              {/* Image Side */}
              <div className="w-full md:w-1/2 group transition-all duration-700 flex items-center">
                <Link
                  href={firstPostCard.href}
                  className="block w-full relative aspect-[4/3] overflow-hidden rounded-sm shadow-sm"
                >
                  <Image
                    src={firstPostCard.image || "/blog-hero.webp"}
                    alt={
                      firstPostCard.title ||
                      (currentLanguage === "es"
                        ? "Artículo destacado"
                        : "Featured post")
                    }
                    fill
                    className="object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                    priority
                  />
                </Link>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-between py-2">
                <div>
                  <span className="text-[#d8a08b] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
                    {t("featured-post")}
                  </span>
                  <Link href={firstPostCard.href} className="group">
                    <h2 className="text-4xl sm:text-5xl font-light mb-6 text-foreground italic leading-tight group-hover:text-[#d8a08b] transition-colors duration-300">
                      {firstPostCard.title}
                    </h2>
                  </Link>
                  <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] mb-8 line-clamp-4 text-ellipsis overflow-hidden">
                    {firstPostCard.excerpt}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-sans mb-8">
                    <span className="font-medium">{`${firstPostCard.authorFirstName} ${firstPostCard.authorLastName}`}</span>
                    <span>•</span>
                    <span>
                      {new Date(firstPostCard.publishedAt).toLocaleDateString(
                        currentLanguage,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <Link
                      href={firstPostCard.href}
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto rounded-sm px-8 py-6 font-[family-name:var(--font-lora)] text-base bg-[#d8a08b] text-white hover:bg-[#c28c77] transition-all duration-300 shadow-sm">
                        {t("read-more")}
                      </Button>
                    </Link>
                    <Link
                      href="https://substack.com/@ashleyleon?utm_campaign=profile&utm_medium=profile-page"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto rounded-sm px-8 py-6 font-[family-name:var(--font-lora)] text-base border-foreground/20 text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-all duration-300"
                      >
                        {t("visit-substack")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            </section>
          ) : null}

          {/* Divider */}
          {firstPostCard ? (
            <div className="w-full max-w-4xl mx-auto h-px bg-border/50 mb-10" />
          ) : null}

          {/* Lista de posts */}
          <section className="w-full max-w-4xl grid grid-cols-1 gap-8 px-6 my-10 sm:grid-cols-2 md:grid-cols-3 md:px-0">
            {listCards.map((post, index) => (
              <article className="group h-full" key={post.id}>
                <Link href={post.href} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <Image
                      src={post.image || "/blog-hero.jpeg"}
                      alt={post.title}
                      fill
                      sizes="(min-width: 768px) 28vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-breath)] group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
                <span className="editorial-list-num mt-7 block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="editorial-display-s mt-3 text-balance text-foreground">
                  <Link
                    href={post.href}
                    className="transition-colors duration-500 hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="editorial-body mt-5 line-clamp-3 text-pretty">
                  {post.excerpt}
                </p>
                <Link href={post.href} className="editorial-link mt-8">
                  {t("read-more")}
                  <span className="editorial-link-arrow">→</span>
                </Link>
              </article>
            ))}
          </section>

          {/* Paginación */}
          <Pagination className="mb-10" ariaLabel={tPagination("navLabel")}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${page - 1}`}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  label={tPagination("previous")}
                  ariaLabel={tPagination("previousAria")}
                />
              </PaginationItem>
              {/* Pagination logic */}
              {totalPages <= 4 ? (
                Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={`?page=${i + 1}`}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))
              ) : (
                <>
                  {page <= 2 && (
                    <>
                      {[1, 2, 3].map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href={`?page=${p}`}
                            isActive={page === p}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationEllipsis
                          srLabel={tPagination("morePages")}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href={`?page=${totalPages}`}
                          isActive={page === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  {page === 3 && (
                    <>
                      {[2, 3, 4].map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href={`?page=${p}`}
                            isActive={page === p}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationEllipsis
                          srLabel={tPagination("morePages")}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href={`?page=${totalPages}`}
                          isActive={page === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  {page > 3 && page < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink href={`?page=${page - 1}`}>
                          {page - 1}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href={`?page=${page}`} isActive>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href={`?page=${page + 1}`}>
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis
                          srLabel={tPagination("morePages")}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href={`?page=${totalPages}`}>
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  {page >= totalPages - 2 && (
                    <>
                      {Array.from(
                        { length: 4 },
                        (_, i) => totalPages - 3 + i,
                      ).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href={`?page=${p}`}
                            isActive={page === p}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    </>
                  )}
                </>
              )}
              <PaginationItem>
                <PaginationNext
                  href={`?page=${page + 1}`}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                  label={tPagination("next")}
                  ariaLabel={tPagination("nextAria")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
