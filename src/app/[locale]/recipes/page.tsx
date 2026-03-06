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
import { ParallaxHero } from "@/components/parallax-hero";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify"; // Assuming you have a DOMPurify setup
import ImageCardBlogDetail from "@/components/image-card-post";
import NoPostsView from "@/components/empty-post";
import { CategoryEnum } from "@/enums";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

const BASE_URL = "https://www.raicesreturnings.com";
type SearchParams = Promise<{ page?: string }>;
const PATH = CategoryEnum.Recipes;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Recipes.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/recipes`,
      images: [`${BASE_URL}/recipes-hero.jpeg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/recipes`,
      languages: {
        en: `${BASE_URL}/en/recipes`,
        es: `${BASE_URL}/es/recipes`,
        "x-default": `${BASE_URL}/en/recipes`,
      },
    },
  };
}

export default async function Page(props: { searchParams?: SearchParams }) {
  const currentLanguage = await getLocale();
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page ?? "1", 10);
  const total = await prisma.post.count({
    where: {
      published: true,
      category: {
        name: PATH,
      },
    },
  });
  const PAGE_SIZE = page === 1 ? 7 : 6; // Cambia el tamaño de página según la página actual
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const t = await getTranslations("Blog");
  const tPagination = await getTranslations("ui.pagination");
  const tPostMeta = await getTranslations("ui.postMeta");

  if (page < 1 || isNaN(page)) {
    console.error("Invalid page number:", page, "Total pages:", totalPages);
    notFound();
  }

  const skip = (page - 1) * PAGE_SIZE;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      category: {
        name: PATH, // Asegúrate de que solo se obtienen posts de la categoría "blog"
      },
    },
    skip: skip,
    take: PAGE_SIZE,
    orderBy: { updatedAt: "desc" },
    include: { author: true },
  });

  // El primer post (más reciente)
  const [firstPost] = await prisma.post.findMany({
    where: {
      published: true,
      category: {
        name: PATH, // Asegúrate de que solo se obtiene el post de la categoría "blog"
      },
    },
    take: 1,
    orderBy: { updatedAt: "desc" },
    include: { author: true },
  });

  console.log("Posts:", firstPost);

  if (!firstPost) {
    return <NoPostsView />;
  }

  const firstPostTranslated = {
    ...firstPost,
    title: currentLanguage === "en" ? firstPost.title_en : firstPost.title_es,
    content:
      currentLanguage === "en" ? firstPost.content_en : firstPost.content_es,
    slug: firstPost.slug_en,
  };

  // Los posts menos el primero (más reciente)
  const postsWithoutFirst = posts.filter((post) => post.id !== firstPost?.id);
  const postsWithoutFirstTranslated = postsWithoutFirst.map((post) => ({
    ...post,
    title: currentLanguage === "en" ? post.title_en : post.title_es,
    content: currentLanguage === "en" ? post.content_en : post.content_es,
    slug: post.slug_en,
  }));

  const allPagePosts = [firstPostTranslated, ...postsWithoutFirstTranslated];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: currentLanguage === "en" ? "Recipes" : "Recetas",
    url: `${BASE_URL}/${currentLanguage}/recipes`,
    itemListElement: allPagePosts.map((p, i) => ({
      "@type": "ListItem",
      position: (page - 1) * PAGE_SIZE + i + 1,
      url: `${BASE_URL}/${currentLanguage}/recipes/${p.slug}`,
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
          <h1 className="sr-only">{t("recipes-page-title")}</h1>

          {/* FEATURED POST HERO */}
          <section className="w-full max-w-6xl mx-auto px-6 pt-12 pb-16">
            <div className="flex flex-col md:flex-row items-stretch gap-12 lg:gap-20">
              {/* Image Side */}
              <div className="w-full md:w-1/2 group transition-all duration-700 flex items-center">
                <Link
                  href={`/${PATH}/${firstPostTranslated?.slug}`}
                  className="block w-full relative aspect-[4/3] overflow-hidden rounded-sm shadow-sm"
                >
                  <Image
                    src={firstPostTranslated?.image || "/recipes-hero.jpeg"}
                    alt={firstPostTranslated?.title || "Featured post"}
                    fill
                    className="object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                    priority
                  />
                </Link>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-between py-2">
                <div>
                  <span className="text-[#de9e86] text-sm uppercase tracking-[0.2em] font-bold mb-6 block font-sans">
                    {t("featured-post")}
                  </span>
                  <Link
                    href={`/${PATH}/${firstPostTranslated?.slug}`}
                    className="group"
                  >
                    <h2 className="text-4xl sm:text-5xl font-light mb-6 text-foreground italic leading-tight group-hover:text-[#de9e86] transition-colors duration-300">
                      {firstPostTranslated?.title}
                    </h2>
                  </Link>
                  <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-[family-name:var(--font-lora)] mb-8 line-clamp-4 text-ellipsis overflow-hidden">
                    {DOMPurify.sanitize(firstPostTranslated?.content ?? "", {
                      ALLOWED_TAGS: [],
                    })}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-sans mb-8">
                    <span className="font-medium">{`${firstPostTranslated?.author.firstName} ${firstPostTranslated?.author.lastName}`}</span>
                    <span>•</span>
                    <span>
                      {new Date(
                        firstPostTranslated?.updatedAt,
                      ).toLocaleDateString(currentLanguage, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <Link
                      href={`/${PATH}/${firstPostTranslated?.slug}`}
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto rounded-sm px-8 py-6 font-[family-name:var(--font-lora)] text-base bg-[#de9e86] text-white hover:bg-[#c88a72] transition-all duration-300 shadow-sm">
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
            {postsWithoutFirstTranslated.map((post) => (
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
                      {DOMPurify.sanitize(post?.content ?? "", {
                        ALLOWED_TAGS: [],
                      })}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span>
                        {tPostMeta("by")}{" "}
                        <span className="font-medium">{`${post.author.firstName} ${post.author.lastName}`}</span>
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
                // Show all pages if 4 or less
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
                // More than 4 pages
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
