import { ParallaxHero } from "@/components/parallax-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CategoryEnum } from "@/enums";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import NoPostsView from "@/components/empty-post";

export default async function Home() {
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

  return (
    <main>
      <ParallaxHero imageSrc="/hero-image.jpeg" imageAlt="Hero image">
        <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl lg:text-6xl font-bold mb-4 hero-text">
          Between Flavors, Bodies, and Borders
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto font-[family-name:var(--font-lora)] hero-text">
          Recipes with history, everyday stories, and unfiltered queer life.
        </p>
      </ParallaxHero>

      <div className="flex flex-1 flex-col conatiner max-w-4xl m-auto  p-4 pb-20 md:p-20 font-[family-name:var(--font-lora)] text-base">
        <div className=" flex flex-col  justify-center gap-4 w-full ">
          <h2 className="text-3xl font-bold mb-4 text-center font-[family-name:var(--font-cormorant-garamond)]">
            Queer Flavors: Stories, Tastes, and Soul in a Digital Sanctuary for
            Free Bodies and Spirits
          </h2>
          <p>
            Welcome to our intimate corner where stovetops, words, and queer
            pride collide with Latinx spice. We are Ashley and Oly, a digital
            refuge created by two migrant women who cook stories to feed quiet
            revolutions. Here, every recipe holds a secret of identity, every
            story seasons the sacred in the mundane, and every reflection is an
            act of loving resistance. We dance between pots and memories,
            weaving an altar where queerness isn’t just celebrated—it’s lived
            with spiritual depth. Our words are windows to see yourself, our
            shared meals are rituals of belonging, and our conversations about
            migration are maps for bodies rewriting home. The mission? To invite
            you to a feast where activism tastes like dulce de leche,
            spirituality smells like freshly cut herbs, and transformation is
            the flavor of freedom. This isn’t just a blog. It’s a tender,
            unapologetic yes to existing in full color.
          </p>

          <p>
            Join us as we explore the intersection of food, culture, and
            identity.
          </p>
          <p>
            Whether you&apos;re looking for recipes, stories, or just a place to
            feel at home, we hope you find something that resonates with you.
          </p>
          <p>
            Thank you for being here with us. We can&apos;t wait to share our
            journey with you!
          </p>
          <p>With love,</p>
          <p>The Queer Kitchen Team</p>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#e0e0d0] to-[#c2c2b2]">
        <div className="flex flex-1 flex-col conatiner max-w-4xl m-auto  p-4 pb-20 md:p-20 font-[family-name:var(--font-lora)] ">
          <div className=" flex flex-col  justify-center gap-4 w-full ">
            <h2 className="text-3xl font-bold mb-4 text-center font-[family-name:var(--font-cormorant-garamond)]">
              The latest Raices & Returnings Originals
            </h2>
            <p>
              Welcome to our intimate corner where stovetops, words, and queer
              pride collide with Latinx spice. We are Ashley and Oly, a digital
              refuge created by two migrant
            </p>
          </div>
        </div>

        {!recentPostOfBlog || !recentPostOfRecipes ? (
          <NoPostsView />
        ) : (
          <>
            <div className=" flex flex-1 flex-col container max-w-3xl mx-auto  p-4  font-[family-name:var(--font-lora)] ">
              <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-stone-200/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative h-80   overflow-hidden">
                      <Image
                        src={recentPostOfBlog.image}
                        alt="Logo"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover  transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                    </div>
                    <div className="lg:order-1 p-8 lg:p-12 lg:pt-0 flex flex-col justify-center">
                      <CardTitle className="text-lg font-semibold mb-2 text-primary group-hover:underline transition-all duration-300">
                        {recentPostOfBlog.title}
                      </CardTitle>
                      <div className="text-sm mb-4 flex-1 line-clamp-8 text-ellipsis overflow-hidden">
                        {DOMPurify.sanitize(recentPostOfBlog.content ?? "", {
                          ALLOWED_TAGS: [],
                        })}
                      </div>
                      <div className="flex flex-row mt-6  gap-3">
                        <Link
                          href={`/${CategoryEnum.Blog}/${recentPostOfBlog?.slug}`}
                        >
                          <Button className="rounded-full">Read More</Button>
                        </Link>
                        <Link href={`/${CategoryEnum.Blog}`}>
                          <Button
                            variant="outline"
                            className="px-6 py-2 rounded-full transition-all duration-200  border-primary  hover:bg-transparent hover:text-primary text-primary"
                          >
                            All Blog Posts
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className=" flex flex-1 flex-col container max-w-3xl mx-auto  p-4 md:pb-20  font-[family-name:var(--font-lora)] ">
              <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-stone-200/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 lg: gap-0">
                    <div className="order:1 lg:order-0 p-8 lg:p-12 lg:pt-0 flex flex-col justify-center">
                      <CardTitle className="text-lg font-semibold mb-2 text-primary group-hover:underline transition-all duration-300">
                        {recentPostOfRecipes.title}
                      </CardTitle>
                      <div className="text-sm mb-4 flex-1 line-clamp-8 text-ellipsis overflow-hidden">
                        {DOMPurify.sanitize(recentPostOfRecipes.content ?? "", {
                          ALLOWED_TAGS: [],
                        })}
                      </div>
                      <div className="flex flex-row mt-6 gap-3">
                        <Link
                          href={`/${CategoryEnum.Recipes}/${recentPostOfRecipes?.slug}`}
                        >
                          <Button className="rounded-full">Read More</Button>
                        </Link>
                        <Link href={`/${CategoryEnum.Recipes}`}>
                          <Button
                            variant="outline"
                            className="px-6 py-2 rounded-full transition-all duration-200  border-primary  hover:bg-transparent hover:text-primary text-primary"
                          >
                            All Recipes Posts
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="relative h-80  overflow-hidden">
                      <Image
                        src={recentPostOfRecipes.image}
                        alt="Logo"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
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
