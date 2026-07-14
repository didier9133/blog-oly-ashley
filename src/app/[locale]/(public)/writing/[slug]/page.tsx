import { Suspense } from "react";
import prisma from "@/lib/prisma";

import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
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
import { BASE_URL, fullUrl, localizedHref, ogImageUrl } from "@/lib/url";
import { isSupportedLocale, localizedAlternates } from "@/lib/seo";
import { getPostSeoDecision } from "@/lib/seo-content";
import { ProductCta } from "@/components/product-cta";
import { routing } from "@/i18n/routing";
import { postSlugCandidates, publicPostSlug } from "@/lib/post-slugs";
type Params = Promise<{ locale: string; slug: string }>;

const PATH = CategoryEnum.Blog;

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true, category: { name: PATH } },
    select: { slug_en: true, slug_es: true },
  });

  const params: { locale: string; slug: string }[] = [];
  for (const post of posts) {
    for (const locale of routing.locales) {
      const slug = publicPostSlug(
        locale === "es" ? post.slug_es : post.slug_en,
      );
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
  const slugCandidates = postSlugCandidates(slug);

  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug_en: { in: slugCandidates } },
        { slug_es: { in: slugCandidates } },
      ],
      published: true,
      category: { name: PATH },
    },
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
  const decision = getPostSeoDecision(
    publicPostSlug(post.slug_en),
    publicPostSlug(post.slug_es),
  );
  const supportedLocale = isSupportedLocale(locale) ? locale : "en";
  const pageTitle = decision?.seoTitle?.[supportedLocale] ?? `${title} | Ashley Leon`;
  const seoDescription = decision?.description?.[supportedLocale] ?? description;
  const detailSlug = publicPostSlug(
    locale === "es" ? post.slug_es : post.slug_en,
  );
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${BASE_URL}${post.image}`;

  return {
    title: pageTitle,
    description: seoDescription,
    openGraph: {
      type: "article",
      title: pageTitle,
      description: seoDescription,
      url: fullUrl(locale, `/writing/${detailSlug}`),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [fullUrl(locale, "/about")],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: seoDescription,
      images: [imageUrl],
    },
    alternates: localizedAlternates(locale, {
      en: `/writing/${publicPostSlug(post.slug_en)}`,
      es: `/writing/${publicPostSlug(post.slug_es)}`,
    }),
  };
}

export default async function BlogPostPage(props: { params: Params }) {
  const currentLanguage = await getLocale();
  const { locale, slug } = await props.params;
  const slugCandidates = postSlugCandidates(slug);
  const category = await prisma.category.findFirst({
    where: {
      name: PATH,
    },
  });
  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug_en: { in: slugCandidates } },
        { slug_es: { in: slugCandidates } },
      ],
      published: true,
      category: { name: PATH },
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

  const detailSlug = publicPostSlug(
    locale === "es" ? post.slug_es : post.slug_en,
  );
  if (slug !== detailSlug) {
    permanentRedirect(localizedHref(locale, `/writing/${detailSlug}`));
  }

  const recentPosts: RecentPostItem[] = await prisma.post.findMany({
    where: {
      id: { not: post.id },
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
      slug_es: true,
      updatedAt: true,
      subcategoryId: true,
    },
  });

  const postTraslated = {
    ...post,
    title: currentLanguage === "en" ? post.title_en : post.title_es,
    content: currentLanguage === "en" ? post.content_en : post.content_es,
  };

  const t = await getTranslations("Writing");
  const recentPostsLabel = t("recent-posts");
  const noPostsLabel = t("no-posts");

  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const pageUrl = fullUrl(locale, `/writing/${detailSlug}`);
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${BASE_URL}${post.image}`;
  const supportedLocale = isSupportedLocale(locale) ? locale : "en";
  const seoDecision = getPostSeoDecision(
    publicPostSlug(post.slug_en),
    publicPostSlug(post.slug_es),
  );
  const relatedGuide = seoDecision?.relatedGuide?.[supportedLocale];

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postTraslated.title,
    description: htmlExcerpt(postTraslated.content),
    image: imageUrl,
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
      name: "Ashley Leon",
      logo: { "@type": "ImageObject", url: ogImageUrl(locale) },
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
        name: "Writing",
        item: fullUrl(locale, "/writing"),
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
                <Link href={localizedHref(locale, "/")}>{t("breadcrumb")}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link href={localizedHref(locale, "/writing")}>
                  {t("breadcrumb-blog")}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{postTraslated.title}</BreadcrumbPage>
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
            {relatedGuide ? (
              <aside
                className="not-prose mt-12 border-y border-border bg-paper px-6 py-8 sm:px-8"
                aria-labelledby="related-pillar-heading"
              >
                <p className="font-[family-name:var(--font-lora)] text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                  {relatedGuide.eyebrow}
                </p>
                <h2
                  id="related-pillar-heading"
                  className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium text-foreground sm:text-3xl"
                >
                  {relatedGuide.title}
                </h2>
                <p className="mt-3 font-[family-name:var(--font-lora)] text-base leading-7 text-muted-foreground">
                  {relatedGuide.description}
                </p>
                <Link
                  href={localizedHref(supportedLocale, relatedGuide.href)}
                  className="editorial-link mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {relatedGuide.label}
                  <span className="editorial-link-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </aside>
            ) : null}
            {seoDecision?.productCta && seoDecision.productCta !== "none" ? (
              <ProductCta
                product={seoDecision.productCta}
                placement="end"
                locale={supportedLocale}
                articleSlug={detailSlug}
                articleCategory={supportedLocale === "es" ? seoDecision.categoryEs : seoDecision.category}
                primaryKeyword={seoDecision.primaryKeyword?.[supportedLocale]}
              />
            ) : null}
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
                posts={recentPosts.map((recentPost) => ({
                  ...recentPost,
                  slug_en: publicPostSlug(recentPost.slug_en),
                  slug_es: publicPostSlug(recentPost.slug_es),
                }))}
                currentSubcategoryId={post.subcategoryId}
                currentLanguage={currentLanguage}
                pathPrefix="writing"
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
