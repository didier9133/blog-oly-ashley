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

type SearchParams = Promise<{ page?: string }>;
const PATH = CategoryEnum.Recipes;

export default async function Page(props: { searchParams?: SearchParams }) {
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

  // Los posts menos el primero (más reciente)
  const postsWithoutFirst = posts.filter((post) => post.id !== firstPost?.id);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center   font-[family-name:var(--font-cormorant-garamond)]">
      {/* HERO */}

      {!totalPages ? (
        <NoPostsView />
      ) : (
        <>
          <ParallaxHero
            imageSrc="/recipes-hero.jpeg"
            imageAlt="Hero image"
            className="w-full sm:w-[50%]"
          >
            <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl lg:text-6xl font-bold mb-4 hero-text">
              {firstPost?.title}
            </h1>

            <p className=" text-sm mb-4 flex-1 line-clamp-4 text-ellipsis overflow-hidden hero-text">
              {DOMPurify.sanitize(firstPost?.content ?? "", {
                ALLOWED_TAGS: [],
              })}
            </p>

            <div className="flex items-center justify-end text-xs text-white mt-auto hero-text">
              <Link href={`/${PATH}/${firstPost?.slug}`}>
                <Button variant={"ghost"}>
                  Read More <ChevronRight />
                </Button>
              </Link>
            </div>
          </ParallaxHero>

          {/* Lista de posts */}
          <section className="w-full max-w-4xl grid grid-cols-1 xs sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
            {postsWithoutFirst.map((post) => (
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
                    <CardTitle className="text-lg font-semibold mb-2 text-primary group-hover:underline transition-all duration-300">
                      {post.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-5 text-ellipsis overflow-hidden">
                      {DOMPurify.sanitize(post?.content ?? "", {
                        ALLOWED_TAGS: [],
                      })}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span>
                        By{" "}
                        <span className="font-medium">{`${post.author.firstName} ${post.author.lastName}`}</span>
                      </span>
                      <span>
                        {new Date(post.updatedAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>

          {/* Paginación */}
          <Pagination className="mb-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${page - 1}`}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                        <PaginationEllipsis />
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
                        <PaginationEllipsis />
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
                        <PaginationEllipsis />
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
                        (_, i) => totalPages - 3 + i
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
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
