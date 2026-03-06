import prisma from "@/lib/prisma";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { ComboboxDemo } from "@/components/ui/combobox";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import RichTextEditor from "@/components/rich-text-editor";
import ImageBlogDetail from "@/components/image-post-detail";

import { Slash } from "lucide-react";
import ImageRecentBlog from "@/components/image-recent-post";
import { CategoryEnum } from "@/enums";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";

const BASE_URL = "https://www.raicesreturnings.com";
type Params = Promise<{ locale: string; slug: string }>;
type SearchParams = Promise<{ category?: string }>;

const PATH = CategoryEnum.Blog;

/** Strip HTML tags and return plain text excerpt (max 160 chars) */
function htmlExcerpt(html: string | null | undefined, max = 160): string {
  if (!html) return "";
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length <= max ? plain : plain.slice(0, max - 1).trimEnd() + "…";
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug_en: slug, published: true },
    select: {
      title_en: true,
      title_es: true,
      content_en: true,
      content_es: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      slug_en: true,
      slug_es: true,
    },
  });

  if (!post) return {};

  const title = locale === "en" ? post.title_en : post.title_es;
  const content = locale === "en" ? post.content_en : post.content_es;
  const description = htmlExcerpt(content);
  const pageTitle = `${title} | Raíces & Returnings`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      type: "article",
      title: pageTitle,
      description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: title }],
      publishedTime: post.createdAt.toISOString(),
      authors: ["https://www.raicesreturnings.com/about"],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [post.image],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        en: `${BASE_URL}/en/blog/${post.slug_en}`,
        es: `${BASE_URL}/es/blog/${post.slug_en}`,
        "x-default": `${BASE_URL}/en/blog/${post.slug_en}`,
      },
    },
  };
}

export default async function BlogPostPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const currentLanguage = await getLocale();
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const category = await prisma.category.findFirst({
    where: {
      name: PATH,
    },
  });
  const post = await prisma.post.findFirst({
    where: {
      slug_en: slug,
      published: true, // Ensure only published posts are included
    },
    include: { author: true },
  });
  if (!post || !category) return notFound();

  let recentPosts = await prisma.post.findMany({
    where: {
      slug_en: {
        not: slug, // Exclude the current post
      },
      subcategoryId: Number(searchParams.category) || post.subcategoryId, // Filter by the same subcategory
      published: true, // Ensure only published posts are included
      category: {
        name: PATH, // Ensure the post belongs to the correct category
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  if (!recentPosts || recentPosts.length === 0) {
    recentPosts = await prisma.post.findMany({
      where: {
        slug_en: {
          not: slug, // Exclude the current post
        },
        published: true, // Ensure only published posts are included
        category: {
          name: PATH, // Ensure the post belongs to the correct category
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });
  }

  const postTraslated = {
    ...post,
    title: currentLanguage === "en" ? post.title_en : post.title_es,
    content: currentLanguage === "en" ? post.content_en : post.content_es,
  };

  const recentPostsTranslated = recentPosts.map((recent) => ({
    ...recent,
    title: currentLanguage === "en" ? recent.title_en : recent.title_es,
    slug: recent.slug_en,
  }));

  const t = await getTranslations("Blog");

  const { locale } = await props.params;
  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const pageUrl = `${BASE_URL}/${locale}/blog/${slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postTraslated.title,
    description: htmlExcerpt(postTraslated.content),
    image: post.image,
    url: pageUrl,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
      url: `${BASE_URL}/${locale}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Raíces & Returnings",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.jpeg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${BASE_URL}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: postTraslated.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="container w-full max-w-4xl flex flex-col md:flex-row gap-4 lg:gap-8 mx-auto py-10 px-4">
        {/* Contenido principal */}
        <div className="w-full md:w-[75%]">
          {/* breadcrumbs */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/">{t("breadcrumb")}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link href="/blog">{t("breadcrumb-blog")}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentLanguage === "en" ? slug : postTraslated.slug_es}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Imagen del post */}
          <ImageBlogDetail
            post={{
              ...post,
              title: postTraslated.title,
            }}
          />
          <h1 className="text-3xl font-bold mb-4 text-primary font-[family-name:var(--font-cormorant-garamond)]">
            {postTraslated.title}
          </h1>
          <div className="text-muted-foreground text-sm mb-6 flex gap-4">
            <span>
              {new Date(post.createdAt).toLocaleDateString(currentLanguage, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <Link href={`/${locale}/about`} className="hover:underline">
              {authorName}
            </Link>
          </div>
          <article className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed break-words transition-colors duration-300">
            <RichTextEditor
              content={postTraslated.content!}
              isEditable={false}
            />
          </article>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />

        {/* Sidebar de posts recientes */}
        <aside className="w-full md:w-[25%] mt-10 md:mt-0 lg:pl-6">
          <div className="max-w-sm w-full mx-auto md:mx-0">
            <ComboboxDemo
              categoryId={category.id}
              categoryName={category.name}
            />
            <Separator className="flex my-4" />
            <div>
              <h3 className="text-base font-semibold mb-2 transition-colors duration-700">
                {t("recent-posts")}
              </h3>
              <ul className="space-y-4">
                {recentPostsTranslated.map((recent) => (
                  <li key={recent.id}>
                    <Link
                      href={`/blog/${recent.slug}`}
                      className="flex items-center gap-2"
                    >
                      <ImageRecentBlog
                        post={{
                          title: recent.title,
                          image: recent.image,
                        }}
                      />
                      <div>
                        <div className="font-medium text-xs text-primary line-clamp-2">
                          {recent.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(recent.updatedAt).toLocaleDateString(
                            currentLanguage,
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {recentPostsTranslated.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t("no-posts")}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
