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
            <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 xl:mt-20 xl:grid-cols-12 xl:gap-x-7">
              {posts.map((post, index) => (
                <FadeIn
                  key={post.id}
                  delay={0.12 * index}
                  className={
                    index === 0
                      ? "md:col-span-2 xl:col-span-6"
                      : "md:col-span-1 xl:col-span-3"
                  }
                >
                  <article className="group h-full">
                    <Link
                      href={post.href}
                      className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      <div
                        className={`relative overflow-hidden bg-sand ${
                          index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"
                        }`}
                      >
                        <Image
                          src={post.image || "/blog-hero.jpeg"}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 28vw, (min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-breath)] group-hover:scale-[1.045]"
                        />
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,14,11,0.2),transparent_42%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        />
                        <span className="absolute bottom-0 left-0 bg-paper px-4 py-3 font-[family-name:var(--font-cormorant-garamond)] text-lg font-light italic text-primary">
                          0{index + 1}
                        </span>
                      </div>
                    </Link>
                    <h3
                      className={`mt-7 text-balance font-[family-name:var(--font-cormorant-garamond)] font-normal leading-[1.06] tracking-[-0.018em] text-foreground ${
                        index === 0
                          ? "text-[clamp(2rem,3.2vw,3.25rem)]"
                          : "text-[clamp(1.6rem,2.3vw,2.25rem)]"
                      }`}
                    >
                      <Link
                        href={post.href}
                        className="transition-colors duration-500 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p
                      className={`editorial-body mt-5 text-pretty ${
                        index === 0 ? "max-w-2xl line-clamp-2" : "line-clamp-3"
                      }`}
                    >
                      {htmlToPlainText(post.content)}
                    </p>
                    <Link
                      href={post.href}
                      className="editorial-link mt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {readMore}
                      <span className="editorial-link-arrow">→</span>
                    </Link>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}

          <FadeIn delay={0.15} className="mt-20 text-center">
            <Link
              href={viewAllHref}
              className="editorial-link mx-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {viewAll}
              <span className="editorial-link-arrow">→</span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
