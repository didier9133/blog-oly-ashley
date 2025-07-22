import { ParallaxHero } from "@/components/parallax-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CategoryEnum } from "@/enums";

import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import NoPostsView from "@/components/empty-post";

import prisma from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Home() {
  const currentLanguage = await getLocale();

  const recentPostOfBlog = await prisma.post.findFirst({
    where: {
      published: true, // Ensure only published posts are included
      category: {
        name: CategoryEnum.Blog, // Filter by the BLOG category
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const recentPostOfBlogTranslated = recentPostOfBlog
    ? {
        ...recentPostOfBlog,
        content:
          currentLanguage === "en"
            ? recentPostOfBlog.content_en
            : recentPostOfBlog.content_es,
        title:
          currentLanguage === "en"
            ? recentPostOfBlog.title_en
            : recentPostOfBlog.title_es,
        slug: recentPostOfBlog.slug_en,
      }
    : null;

  const recentPostOfRecipes = await prisma.post.findFirst({
    where: {
      published: true, // Ensure only published posts are included
      category: {
        name: CategoryEnum.Recipes, // Filter by the RECIPES category
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  const recentPostOfRecipesTranslated = recentPostOfRecipes
    ? {
        ...recentPostOfRecipes,
        content:
          currentLanguage === "en"
            ? recentPostOfRecipes.content_en
            : recentPostOfRecipes.content_es,
        title:
          currentLanguage === "en"
            ? recentPostOfRecipes.title_en
            : recentPostOfRecipes.title_es,
        slug: recentPostOfRecipes.slug_en,
      }
    : null;

  const t = await getTranslations("Home");

  return (
    <main>
      <ParallaxHero imageSrc="/hero-image.jpeg" imageAlt="Hero image">
        <div className="absolute md:top-1/3 md:left-8 xl:left-14">
          <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 md:mb-4 hero-text">
            {t("title")}
          </h1>
          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 font-extrabold mb-2 md:mb-4 hero-text">
            {t("subtitle")}
          </h2>
        </div>
      </ParallaxHero>

      <div className="flex flex-1 flex-col conatiner max-w-4xl m-auto  p-4 pb-20 md:p-20 font-[family-name:var(--font-lora)] text-base">
        <div className=" flex flex-col  justify-center gap-4 w-full ">
          <h2 className="text-3xl font-bold mb-4 text-center font-[family-name:var(--font-cormorant-garamond)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 text-4xl font-extrabold">
              {t("title-description")}
            </span>
            {t("subtitle-description-one")} <br />{" "}
            {t("subtitle-description-two")}
          </h2>
          <p className="text-base md:text-lg lg:text-xl">
            {t("paragraph-description")}
          </p>

          <p className="text-base md:text-lg lg:text-xl">
            {t("paragraph-description-two")}
          </p>
          <p className="text-base md:text-lg lg:text-xl">
            {t("paragraph-description-three")}
          </p>
          <p className="text-base md:text-lg lg:text-xl">
            {t("paragraph-description-four")}
          </p>

          <div className="flex justify-start mt-8">
            <p className="text-left text-lg md:text-xl lg:text-2xl italic font-[family-name:var(--font-cormorant-garamond)]">
              {t("pre-signature")}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 font-semibold">
                {t("signature")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#e0e0d0] to-[#c2c2b2] dark:from-[#504e4e] dark:to-[#625f5f] dark:border-t-4 dark:border-border">
        <div className="flex flex-1 flex-col conatiner max-w-3xl m-auto  p-4 pb-10 md:pt-20 font-[family-name:var(--font-lora)] ">
          <div className=" flex flex-col  justify-center gap-4 w-full ">
            <h2 className="text-3xl font-bold mb-4 text-center font-[family-name:var(--font-cormorant-garamond)]">
              {t("fresh-title-one")} <br />
              <span className="text-important text-4xl font-extrabold">
                Raíces & Returnings
              </span>{" "}
            </h2>{" "}
            <p className="text-base md:text-lg lg:text-xl">
              {t("paragraph-fresh")}
            </p>
          </div>
        </div>

        {!recentPostOfBlogTranslated || !recentPostOfRecipesTranslated ? (
          <NoPostsView />
        ) : (
          <>
            <div className="flex flex-1 flex-col container max-w-3xl mx-auto p-4 font-[family-name:var(--font-lora)]">
              <Card className="overflow-hidden bg-card backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={
                          recentPostOfBlogTranslated.image || "/placeholder.jpg"
                        }
                        alt="Logo"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent dark:from-black/30"></div>
                    </div>
                    <div className="lg:order-1 p-8 lg:p-12 lg:pt-0 flex flex-col justify-center">
                      <CardTitle className="text-lg font-semibold mb-2 text-primary dark:text-primary/90 group-hover:underline transition-all duration-300">
                        {recentPostOfBlogTranslated.title}
                      </CardTitle>
                      <div className="text-sm mb-4 flex-1 line-clamp-8 text-ellipsis overflow-hidden dark:text-gray-200">
                        {DOMPurify.sanitize(
                          recentPostOfBlogTranslated.content ?? "",
                          {
                            ALLOWED_TAGS: [],
                          }
                        )}
                      </div>
                      <div className="flex flex-row mt-6 gap-3">
                        <Link
                          href={`/${CategoryEnum.Blog}/${recentPostOfBlogTranslated?.slug}`}
                        >
                          <Button className="rounded-full">
                            {t("btn-fresh")}
                          </Button>
                        </Link>
                        <Link href={`/${CategoryEnum.Blog}`}>
                          <Button
                            variant="outline"
                            className="px-6 py-2 rounded-full transition-all duration-200 border-primary hover:bg-transparent hover:text-primary text-primary dark:text-primary-foreground dark:hover:text-primary"
                          >
                            {t("btn-all-posts")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-1 flex-col container max-w-3xl mx-auto p-4 pb-20 font-[family-name:var(--font-lora)]">
              <Card className="overflow-hidden bg-card backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="order-1 lg:order-0 p-8 lg:p-12 lg:pt-0 flex flex-col justify-center">
                      <CardTitle className="text-lg font-semibold mb-2 text-primary dark:text-primary/90 group-hover:underline transition-all duration-300">
                        {recentPostOfRecipesTranslated.title}
                      </CardTitle>
                      <div className="text-sm mb-4 flex-1 line-clamp-8 text-ellipsis overflow-hidden dark:text-gray-200">
                        {DOMPurify.sanitize(
                          recentPostOfRecipesTranslated.content ?? "",
                          {
                            ALLOWED_TAGS: [],
                          }
                        )}
                      </div>
                      <div className="flex flex-row mt-6 gap-3">
                        <Link
                          href={`/${CategoryEnum.Recipes}/${recentPostOfRecipesTranslated?.slug}`}
                        >
                          <Button className="rounded-full">
                            {t("btn-fresh")}
                          </Button>
                        </Link>
                        <Link href={`/${CategoryEnum.Recipes}`}>
                          <Button
                            variant="outline"
                            className="px-6 py-2 rounded-full transition-all duration-200 border-primary hover:bg-transparent hover:text-primary text-primary dark:text-primary-foreground dark:hover:text-primary"
                          >
                            {t("btn-fresh-two")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className=" order-0 relative h-80 overflow-hidden">
                      <Image
                        src={recentPostOfRecipesTranslated.image}
                        alt="Logo"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent dark:from-black/30"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
