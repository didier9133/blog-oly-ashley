import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import ImageCardBlogDetail from "@/components/image-card-post";
import NoPostsView from "@/components/empty-post";
import { CategoryEnum } from "@/enums";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { fullUrl, BASE_URL } from "@/lib/url";
type SearchParams = Promise<{ page?: string }>;
const PATH = CategoryEnum.Blog;
const EXCERPT_MAX = 280;

const postSelect = {
  id: true,
  title_en: true,
  title_es: true,
  content_en: true,
  content_es: true,
  image: true,
  slug_en: true,
  updatedAt: true,
  author: { select: { firstName: true, lastName: true } },
} as const;

type PostCard = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  updatedAt: Date;
  authorFirstName: string;
  authorLastName: string;
};

const stripHtml = (html: string | null | undefined) =>
  DOMPurify.sanitize(html ?? "", { ALLOWED_TAGS: [] });

const buildExcerpt = (html: string | null | undefined, max = EXCERPT_MAX) => {
  const text = stripHtml(html).trim();
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
    updatedAt: Date;
    author: { firstName: string; lastName: string };
  },
  currentLanguage: string,
): PostCard => ({
  id: post.id,
  title: currentLanguage === "en" ? post.title_en : post.title_es,
  excerpt: buildExcerpt(
    currentLanguage === "en" ? post.content_en : post.content_es,
  ),
  image: post.image,
  slug: post.slug_en,
  updatedAt: post.updatedAt,
  authorFirstName: post.author.firstName,
  authorLastName: post.author.lastName,
});

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: fullUrl(locale, "/blog"),
      images: [`${BASE_URL}/blog-hero.jpeg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: fullUrl(locale, "/blog"),
      languages: {
        en: fullUrl("en", "/blog"),
        es: fullUrl("es", "/blog"),
        "x-default": fullUrl("en", "/blog"),
      },
    },
  };
}

export default async function Page(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page ?? "1", 10);
  const currentLanguage = await getLocale();
  const t = await getTranslations("Blog");
  const tPagination = await getTranslations("ui.pagination");
  const tPostMeta = await getTranslations("ui.postMeta");

  const total = await prisma.post.count({
    where: {
      published: true,
      category: {
        name: PATH,
      },
    },
  });
  const PAGE_SIZE = page === 1 ? 7 : 6;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (page < 1 || isNaN(page) || page > totalPages) {
    notFound();
  }

  const skip = (page - 1) * PAGE_SIZE;

  const [firstPost, posts] = await Promise.all([
    prisma.post.findFirst({
      where: {
        published: true,
        category: { name: PATH },
      },
      orderBy: { updatedAt: "desc" },
      select: postSelect,
    }),
    prisma.post.findMany({
      where: {
        published: true,
        category: { name: PATH },
      },
      skip,
      take: PAGE_SIZE,
      orderBy: { updatedAt: "desc" },
      select: postSelect,
    }),
  ]);

  if (!firstPost) {
    return <NoPostsView />;
  }

  const firstPostCard = toCard(firstPost, currentLanguage);
  const postsWithoutFirstCards: PostCard[] = posts
    .filter((post) => post.id !== firstPost.id)
    .map((post) => toCard(post, currentLanguage));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog",
    url: `${BASE_URL}/${currentLanguage}/blog`,
    itemListElement: [firstPostCard, ...postsWithoutFirstCards].map(
      (p, i) => ({
        "@type": "ListItem",
        position: (page - 1) * PAGE_SIZE + i + 1,
        url: `${BASE_URL}/${currentLanguage}/blog/${p.slug}`,
        name: p.title,
      }),
    ),
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
          <section className="w-full max-w-6xl mx-auto px-6 pt-12 pb-16">
            <div className="flex flex-col md:flex-row items-stretch gap-12 lg:gap-20">
              {/* Image Side */}
              <div className="w-full md:w-1/2 group transition-all duration-700 flex items-center">
                <Link
                  href={`/${PATH}/${firstPostCard.slug}`}
                  className="block w-full relative aspect-[4/3] overflow-hidden rounded-sm shadow-sm"
                >
                  <Image
                    src={firstPostCard.image || "/blog-hero.jpeg"}
                    alt={firstPostCard.title || "Featured post"}
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
                  <Link
                    href={`/${PATH}/${firstPostCard.slug}`}
                    className="group"
                  >
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
                      {new Date(firstPostCard.updatedAt).toLocaleDateString(
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
                      href={`/${PATH}/${firstPostCard.slug}`}
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

          {/* Divider */}
          <div className="w-full max-w-4xl mx-auto h-px bg-border/50 mb-10"></div>

          {/* Lista de posts */}
          <section className="w-full max-w-4xl grid grid-cols-1 xs sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
            {postsWithoutFirstCards.map((post) => (
              <Link href={`/${PATH}/${post.slug}`} key={post.id}>
                <Card
                  key={post.id}
                  className="group flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 bg-card border border-border cursor-pointer"
                >
                  <CardHeader className="p-0">
                    <ImageCardBlogDetail
                      post={{
                        image: post.image,
                        title: post.title,
                      }}
                    />
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-4">
                    <CardTitle className="text-lg font-semibold mb-2 text-primary lg:text-xl group-hover:underline transition-all duration-300">
                      {post.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-5 text-ellipsis overflow-hidden lg:text-base">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span>
                        {tPostMeta("by")}{" "}
                        <span className="font-medium">{`${post.authorFirstName} ${post.authorLastName}`}</span>
                      </span>
                      <span>
                        {new Date(post.updatedAt).toLocaleDateString(
                          currentLanguage,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
