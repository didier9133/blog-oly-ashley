import { Suspense } from "react";
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
import {
  RecentPostsList,
  type RecentPostItem,
} from "@/components/recent-posts-list";

import { Slash } from "lucide-react";
import { CategoryEnum } from "@/enums";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { fullUrl, BASE_URL } from "@/lib/url";
import { routing } from "@/i18n/routing";
type Params = Promise<{ locale: string; slug: string }>;

const PATH = CategoryEnum.Blog;

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug_en: true, slug_es: true },
  });

  const params: { locale: string; slug: string }[] = [];
  for (const post of posts) {
    for (const locale of routing.locales) {
      const slug = locale === "es" ? post.slug_es : post.slug_en;
      if (slug) {
        params.push({ locale, slug });
      }
    }
  }
  return params;
}

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
      url: fullUrl(locale, `/blog/${slug}`),
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
      canonical: fullUrl(locale, `/blog/${slug}`),
      languages: {
        en: fullUrl("en", `/blog/${post.slug_en}`),
        es: fullUrl("es", `/blog/${post.slug_en}`),
        "x-default": fullUrl("en", `/blog/${post.slug_en}`),
      },
    },
  };
}

export default async function BlogPostPage(props: { params: Params }) {
  const currentLanguage = await getLocale();
  const { slug } = await props.params;
  const category = await prisma.category.findFirst({
    where: {
      name: PATH,
    },
  });
  const post = await prisma.post.findFirst({
    where: {
      slug_en: slug,
      published: true,
    },
    select: {
      id: true,
      title_en: true,
      title_es: true,
      content_en: true,
      content_es: true,
      image: true,
      video: true,
      slug_en: true,
      slug_es: true,
      subcategoryId: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { firstName: true, lastName: true } },
    },
  });
  if (!post || !category) return notFound();

  const recentPosts: RecentPostItem[] = await prisma.post.findMany({
    where: {
      slug_en: { not: slug },
      published: true,
      category: { name: PATH },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title_en: true,
      title_es: true,
      image: true,
      slug_en: true,
      updatedAt: true,
      subcategoryId: true,
    },
  });

  const postTraslated = {
    ...post,
    title: currentLanguage === "en" ? post.title_en : post.title_es,
    content: currentLanguage === "en" ? post.content_en : post.content_es,
  };

  const t = await getTranslations("Blog");
  const recentPostsLabel = t("recent-posts");
  const noPostsLabel = t("no-posts");

  const { locale } = await props.params;
  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const pageUrl = fullUrl(locale, `/blog/${slug}`);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postTraslated.title,
    description: htmlExcerpt(postTraslated.content),
    image: post.image,
    url: pageUrl,
    inLanguage: locale,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
      url: fullUrl(locale, "/about"),
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
        item: fullUrl(locale, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: fullUrl(locale, "/blog"),
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
              image: post.image,
              title: postTraslated.title,
              video: post.video,
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
            <Suspense
              fallback={
                <div className="h-10 w-full max-w-[350px] rounded-md border bg-muted/40 animate-pulse" />
              }
            >
              <ComboboxDemo
                categoryId={category.id}
                categoryName={category.name}
              />
            </Suspense>
            <Separator className="flex my-4" />
            <Suspense
              fallback={
                <h3 className="text-base font-semibold mb-2">
                  {recentPostsLabel}
                </h3>
              }
            >
              <RecentPostsList
                posts={recentPosts}
                currentSubcategoryId={post.subcategoryId}
                currentLanguage={currentLanguage}
                pathPrefix="blog"
                recentPostsLabel={recentPostsLabel}
                noPostsLabel={noPostsLabel}
              />
            </Suspense>
          </div>
        </aside>
      </div>
    </>
  );
}
