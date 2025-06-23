import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
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

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ category?: string }>;

const PATH = CategoryEnum.Recipes;

export default async function BlogPostPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const category = await prisma.category.findFirst({
    where: {
      name: PATH,
    },
  });
  const post = await prisma.post.findFirst({
    where: {
      slug,
      published: true, // Ensure only published posts are included
    },
  });

  if (!post || !category) return notFound();

  let recentPosts = await prisma.post.findMany({
    where: {
      slug: {
        not: slug, // Exclude the current post
      },
      subcategoryId: Number(searchParams.category) || post.subcategoryId, // Filter by the same subcategory
      published: true, // Ensure only published posts are included
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  if (!recentPosts || recentPosts.length === 0) {
    recentPosts = await prisma.post.findMany({
      where: {
        slug: {
          not: slug, // Exclude the current post
        },
        published: true, // Ensure only published posts are included
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });
  }

  return (
    <div className="container  w-full max-w-4xl flex flex-col md:flex-row gap-4 lg:gap-8  mx-auto py-10 px-4">
      {/* Contenido principal */}
      <div className="w-full md:w-[75%]">
        {/* breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <Link href={`/${PATH}`}>{PATH}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Imagen del post */}
        <ImageBlogDetail
          post={{
            ...post,
          }}
        />
        <h1 className="text-3xl font-bold mb-4 text-primary font-[family-name:var(--font-cormorant-garamond)]">
          {post.title}
        </h1>
        <div className="text-muted-foreground text-sm mb-6 flex gap-4">
          <span>
            {new Date(post.updatedAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <article className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed break-words transition-colors duration-300">
          <RichTextEditor content={post.content!} isEditable={false} />
        </article>
      </div>

      <Separator orientation="vertical" className="hidden md:flex" />

      {/* Sidebar de posts recientes */}
      <aside className="w-full md:w-[25%] mt-10 md:mt-0 lg:pl-6">
        <div className="max-w-sm w-full mx-auto md:mx-0">
          <ComboboxDemo categoryId={category.id} />
          <Separator className="flex my-4" />
          <div>
            <h3 className="text-base font-semibold mb-2 transition-colors duration-700">
              Recent Posts
            </h3>
            <ul className="space-y-4">
              {recentPosts.map((recent) => (
                <li key={recent.id}>
                  <Link
                    href={`/${PATH}/${recent.slug}`}
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
                          "es-ES",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
