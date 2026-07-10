import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { htmlToPlainText } from "@/lib/plain-text";

interface HomeRecentWritingPost {
  href: string;
  id: number;
  title: string;
  content: string | null;
  image: string | null;
}

interface HomeRecentWritingProps {
  eyebrow: string;
  title: string;
  description: string;
  posts: HomeRecentWritingPost[];
  empty: string;
  readMore: string;
  viewAll: string;
  viewAllHref: string;
}

export function HomeRecentWriting({
  eyebrow,
  title,
  description,
  posts,
  empty,
  readMore,
  viewAll,
  viewAllHref,
}: HomeRecentWritingProps) {
  return (
    <section
      id="writing"
      className="relative editorial-breathe"
      style={{ "--bridge-color": "var(--paper)" } as CSSProperties}
    >
      <div className="section-bleed-bridge" />
      <div className="relative mx-auto max-w-[1760px] px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="editorial-container">
          <FadeIn>
            <div className="grid grid-cols-12 items-start gap-6 border-b border-foreground/15 pb-10 lg:gap-10 lg:pb-14">
              <div className="col-span-12 lg:col-span-2">
                <span
                  aria-hidden
                  className="editorial-numeral block text-[7rem] leading-[0.8] sm:text-[9rem] lg:text-[10rem]"
                >
                  02
                </span>
              </div>
              <div className="col-span-12 lg:col-span-6 lg:pt-6">
                <span className="editorial-eyebrow">{eyebrow}</span>
                <h2 className="editorial-display-m mt-5 text-balance text-foreground">
                  {title}
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-4 lg:pt-10">
                <p className="editorial-body text-pretty">{description}</p>
              </div>
            </div>
          </FadeIn>

          {posts.length === 0 ? (
            <p className="editorial-body mt-12">{empty}</p>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 lg:mt-20">
              {posts.map((post, index) => (
                <FadeIn key={post.id} delay={0.12 * index}>
                  <article className="group h-full">
                    <Link href={post.href} className="block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                        <Image
                          src={post.image || "/blog-hero.jpeg"}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 28vw, (min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-breath)] group-hover:scale-[1.04]"
                        />
                      </div>
                    </Link>
                    <span className="editorial-list-num mt-7 block">
                      0{index + 1}
                    </span>
                    <h3 className="editorial-display-s mt-3 text-balance text-foreground">
                      <Link
                        href={post.href}
                        className="transition-colors duration-500 hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="editorial-body mt-5 line-clamp-3 text-pretty">
                      {htmlToPlainText(post.content)}
                    </p>
                    <Link href={post.href} className="editorial-link mt-8">
                      {readMore}
                      <span className="editorial-link-arrow">→</span>
                    </Link>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}

          <FadeIn delay={0.15} className="mt-20 text-center">
            <Link href={viewAllHref} className="editorial-link mx-auto">
              {viewAll}
              <span className="editorial-link-arrow">→</span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
