import { ParallaxHero } from "@/components/parallax-hero";
import { Button } from "@/components/ui/button";
import { CategoryEnum } from "@/enums";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import NoPostsView from "@/components/empty-post";
import prisma from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/fade-in";
import { SubstackHeroSubscribe } from "@/components/substack-hero-subscribe";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

export default async function Home() {
  const currentLanguage = await getLocale();

  // Optimized fetching (parallel)
  const [recentPostOfBlog, recentPostOfRecipes] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, category: { name: CategoryEnum.Blog } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.post.findFirst({
      where: { published: true, category: { name: CategoryEnum.Recipes } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const translatePost = (post: any) =>
    post
      ? {
          ...post,
          content: currentLanguage === "en" ? post.content_en : post.content_es,
          title: currentLanguage === "en" ? post.title_en : post.title_es,
          slug: post.slug_en,
        }
      : null;

  const blogPost = translatePost(recentPostOfBlog);
  const recipePost = translatePost(recentPostOfRecipes);

  const t = await getTranslations("Home");

  return (
    <main className="bg-[#F9F8F6]">
      {/* ------------------------------------------------------------- */}
      {/* MOBILE HERO (Split Design: Image Top / Content Bottom)        */}
      {/* ------------------------------------------------------------- */}
      <div className="block lg:hidden bg-[#F9F8F6]">
        {/* 1. IMAGE BLOCK (Shorter Viewport Height) */}
        <div className="relative w-full h-[55vh] overflow-hidden">
             <Image
                src="/hero-image.jpeg"
                alt="Oly & Ashley"
                fill
                className="object-cover object-top"
                priority
              />
        </div>

        {/* 2. CONTENT BLOCK (Beige Background) */}
        <div className="px-6 py-10 text-left bg-[#f5f0eb] relative">
             <FadeIn delay={0.2} duration={0.8}>
                {/* "Lifestyle & Food" Label - Left */}
                <span className="block font-sans text-[10px] tracking-[0.35em] font-bold text-foreground/80 mb-2 uppercase text-left">
                    Lifestyle & Food
                </span>

                <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl text-foreground leading-[0.85] mb-8 relative block w-full">
                  {/* Step 1: Raíces */}
                  <span className="block font-light tracking-tight text-left">
                    Raíces
                  </span>
                  
                  {/* Step 2: Returnings (Indented Left, Relaxed Vertical) */}
                  <span className="block font-light tracking-tight text-left ml-14 -mt-1">
                    Returnings
                  </span>
                </h1>
                
                {/* Paragraph - Left Aligned */}
                <p className="text-xs font-sans text-muted-foreground uppercase tracking-[0.15em] mb-10 text-balance text-left">
                  Conscious recipes, life stories & cultural connection.
                </p>

                {/* Email Subscription Bar (Substack) */}
                <SubstackHeroSubscribe />
             </FadeIn>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP HERO (Boxed Split Layout with Organic Shapes)         */}
      {/* ------------------------------------------------------------- */}
      <section className="hidden lg:flex relative h-[calc(100vh-64px)] items-center justify-center bg-[#f5f0eb] overflow-hidden">
        {/* Organic Background Shapes - COLOR INTENSIFIED + MORE SHAPES */}
        <div className="absolute top-0 right-0 w-1/2 h-full z-0 pointer-events-none">
          {/* Main Blob - Richer Terracotta/Clay Tone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-[#de9e86] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] -z-10 opacity-60 mix-blend-multiply blur-2xl animate-pulse duration-[5000ms]"></div>

          {/* Secondary Accent Blob - Deep Sage/Olive */}
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-[#b5c4a6] rounded-full mix-blend-multiply blur-3xl opacity-70 -z-10"></div>

          {/* Third Accent - Warm Mustard/Gold for Highlights */}
          <div className="absolute bottom-[20%] right-[30%] w-[30%] h-[30%] bg-[#e3cba3] rounded-full mix-blend-multiply blur-2xl opacity-60 -z-10"></div>

          {/* Hand-drawn style decorative element (SVG) */}
          <svg
            className="absolute bottom-[5%] left-[5%] w-64 h-64 text-[#d4a373]/30 -z-10 rotate-12"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M43.8,-76.4C56.9,-69.7,68,-58.5,76.3,-45.5C84.7,-32.5,90.2,-17.7,89.3,-3.3C88.4,11,81.1,24.9,71.6,36.5C62.1,48.1,50.3,57.4,37.6,63.9C24.9,70.4,11.3,74.1,-1.8,77.2C-14.9,80.3,-27.5,82.8,-39.3,78.2C-51.1,73.6,-62.1,61.9,-70.6,49C-79.1,36.1,-85.1,22,-84.9,8.1C-84.7,-5.8,-78.3,-19.5,-69.1,-31.6C-59.9,-43.7,-47.9,-54.2,-35.1,-61C-22.3,-67.9,-8.7,-71.1,5.5,-80.6L19.7,-90.1"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Textured Arch behind text - Stronger borders */}
        <div className="absolute top-0 left-0 w-1/2 h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-[10%] -top-[10%] w-[60%] h-[60%] border-[3px] border-[#de9e86]/20 rounded-full z-0"></div>
          <div className="absolute -left-[15%] -top-[15%] w-[70%] h-[70%] border-[3px] border-[#b5c4a6]/20 rounded-full z-0 opacity-60"></div>
        </div>

        {/* Main Container matching Header alignment */}
        <div className="container mx-auto px-4 md:px-20 h-full flex flex-row items-stretch gap-8 py-12 relative z-10 w-full">
          {/* Left Column: Typography - Stepped Layout */}
          <div className="w-[55%] flex flex-col justify-center relative -mt-10 z-20">
            {/* Decorative Top Label */}
            <div className="absolute top-0 left-0 font-[family-name:var(--font-lora)] text-xs tracking-[0.2em] uppercase text-[#de9e86] font-bold opacity-80">
              Est. 2025 — Vol. 01
            </div>

            <FadeIn delay={0.2} duration={0.8} className="w-full">
              <div className="mb-10 relative">
                {/* & Symbol - Re-aligned, Colored & Faded as per specific feedback */}
                <span className="absolute -left-12 -top-12 text-[12rem] xl:text-[14rem] font-[family-name:var(--font-cormorant-garamond)] italic text-[#d4a373] -z-10 select-none opacity-10">
                  &
                </span>

                <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-foreground leading-[0.85] relative">
                  <span className="block font-sans text-xs tracking-[0.35em] font-bold text-foreground/80 mb-6 uppercase">
                    Lifestyle & Food
                  </span>
                  
                  {/* Step 1: Left Aligned */}
                  <span className="block text-[5.5rem] xl:text-[7.5rem] 2xl:text-[9rem] font-light tracking-tight text-foreground drop-shadow-sm whitespace-nowrap">
                    Raíces
                  </span>
                  
                  {/* Step 2: Indented "Walking" towards image */}
                  <span className="block text-[5.5rem] xl:text-[7.5rem] 2xl:text-[9rem] font-light tracking-tight text-foreground ml-20 xl:ml-32 drop-shadow-sm whitespace-nowrap relative z-30">
                    Returnings
                  </span>
                </h1>
              </div>

              {/* ENHANCED DESCRIPTION BLOCK - Aligned with "Raíces" for anchor */}
              <div className="max-w-md relative mt-8 ml-2">
                
                <p className="font-[family-name:var(--font-lora)] text-xl text-foreground/80 leading-relaxed relative z-10 font-medium mb-10 w-full max-w-md">
                  Recetas conscientes, historias de vida y conexión cultural. Únete a nuestra mesa y recibe una nueva historia cada semana.
                </p>

                <div className="relative z-10 w-full">
                  <SubstackHeroSubscribe />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Image Grid/Collage - Clean separation */}
          <div className="flex-1 h-full relative z-0">
            <FadeIn delay={0.4} className="w-full h-full">
              {/* Using Flex with precise gaps instead of Grid to guarantee visual equality */}
              <div className="flex flex-row h-full w-full gap-5">
                {/* Main Large Image (2/3 width) */}
                <div className="flex-[2] relative rounded-sm overflow-hidden shadow-sm h-full">
                  <Image
                    src="/hero-image.jpeg"
                    alt="Oly & Ashley Main"
                    fill
                    className="object-cover transition-transform duration-[20s] ease-linear hover:scale-105"
                    sizes="33vw"
                    priority
                  />
                </div>

                {/* Right Column Stack (1/3 width) */}
                <div className="flex-1 flex flex-col gap-5 h-full">
                  {/* Top Detail Image */}
                  <div className="flex-1 relative rounded-sm overflow-hidden shadow-sm">
                    <Image
                      src="/blog-hero.jpeg"
                      alt="Detail"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                      sizes="20vw"
                    />
                  </div>

                  {/* Bottom Texture Image */}
                  <div className="flex-1 relative rounded-sm overflow-hidden shadow-sm">
                    <div className="absolute inset-0 bg-secondary/10 z-10 mix-blend-multiply"></div>
                    <Image
                      src="/recipes-hero.jpeg"
                      alt="Texture"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                      sizes="20vw"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- INTRO SECTION --- */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="container max-w-4xl mx-auto px-6 md:px-12 text-center">
          
          {/* 1. LEAD PARAGRAPH (Combined & Flowing) */}
          <FadeIn>
            <div className="mb-16">
              {/* Decorative separator */}
              <div className="mx-auto h-12 w-[1px] bg-[#de9e86] mb-8 opacity-60"></div>
              
              <div className="font-[family-name:var(--font-cormorant-garamond)] text-3xl md:text-5xl leading-tight text-foreground/90">
                 <span className="block mb-2 italic text-[#de9e86]">
                   Una receta, ritual, y reflexión a la vez.
                 </span>
                 <p className="font-light text-2xl md:text-4xl text-foreground/80 mt-6 leading-relaxed">
                   {t("paragraph-description")}
                 </p>
              </div>
            </div>
          </FadeIn>

          <div className="font-[family-name:var(--font-lora)] text-lg text-foreground/70 leading-relaxed md:leading-loose space-y-12">
            
            {/* 2. CORE VALUE (Highlighted "Heart" of the message) */}
            <FadeIn delay={0.2}>
               <div className="relative py-16 md:py-20 px-10 md:px-24 bg-[#faf9f8] border border-[#de9e86]/10 rounded-sm mx-auto max-w-3xl">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#de9e86]/40"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#de9e86]/40"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#de9e86]/40"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#de9e86]/40"></div>
                  
                  <p className="font-[family-name:var(--font-cormorant-garamond)] text-xl md:text-2xl text-foreground font-normal italic text-balance">
                     {t("paragraph-description-two")}
                  </p>
               </div>
            </FadeIn>

            {/* 3. CONCLUSIONS (Distinct statements) */}
            <FadeIn delay={0.4}>
              <div className="space-y-8 mt-16">
                 <p className="font-bold text-xs uppercase tracking-[0.25em] text-[#de9e86] mb-4">
                    — {t("paragraph-description-three").replace(".", "")} —
                 </p>
                 <p className="font-[family-name:var(--font-cormorant-garamond)] text-3xl md:text-4xl italic text-foreground">
                    {t("paragraph-description-four")}
                 </p>
              </div>
            </FadeIn>
          </div>

          {/* 4. SIGNATURE (Centered & Spaced) */}
          <FadeIn delay={0.5} className="mt-24 md:mt-32">
             <div className="flex flex-col items-center justify-center gap-6">
               <span className="font-[family-name:var(--font-lora)] text-sm italic text-muted-foreground tracking-widest relative">
                  <span className="absolute -left-8 top-1/2 w-6 h-[1px] bg-[#de9e86]/40"></span>
                  {t("pre-signature")}
                  <span className="absolute -right-8 top-1/2 w-6 h-[1px] bg-[#de9e86]/40"></span>
               </span>
               <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl md:text-6xl text-[#de9e86] font-light tracking-wide">
                 {t("signature")}
               </h3>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- FRESH FROM SECTION --- */}
      <section className="py-24 md:py-32 bg-[#F9F7F2]">
        <div className="container mx-auto px-4 md:px-20">
          
          {/* HEADER: Aligned & Clean */}
          <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6 border-b border-[#de9e86]/20 pb-8">
            <div>
              <span className="font-[family-name:var(--font-lora)] text-lg text-muted-foreground block mb-2">
                Lo más reciente de:
              </span>
              <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl md:text-7xl font-light text-foreground italic">
                Raíces & Returnings
              </h2>
            </div>
            
            {/* Right text aligned with User Icon (far right) but text-left for readability */}
            <div className="max-w-sm text-left hidden md:block -mr-3">
               <p className="font-[family-name:var(--font-lora)] text-muted-foreground text-sm leading-relaxed">
                 {t("paragraph-fresh")}
               </p>
            </div>
          </FadeIn>

          {!blogPost || !recipePost ? (
            <NoPostsView />
          ) : (
            <div className="space-y-40">
              
              {/* 1. BLOG ARTICLE (Image Left / Text Right) - STICKY TEXT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 group">
                {/* Image */}
                <FadeIn className="lg:col-span-7 relative">
                  <div 
                    className="relative w-full overflow-hidden bg-[#faf9f8] shadow-sm rounded-sm"
                    style={{ aspectRatio: '4/5' }}
                  >
                    <Image
                      src={blogPost.image || "/placeholder.jpg"}
                      alt={blogPost.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  </div>
                </FadeIn>

                {/* Text (Left Aligned) */}
                <div className="lg:col-span-5 relative h-full">
                  <div className="sticky top-16 h-fit flex flex-col text-left items-start transition-all duration-500">
                    <FadeIn>
                      <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#de9e86] mb-5 block">
                        Blog Story
                      </span>
                      <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-4xl md:text-5xl font-medium mb-5 leading-[1.1] text-foreground">
                        <Link
                          href={`/${CategoryEnum.Blog}/${blogPost.slug}`}
                          className="hover:underline decoration-1 underline-offset-4 transition-all"
                        >
                          {blogPost.title}
                        </Link>
                      </h3>
                      <div className="font-[family-name:var(--font-lora)] text-muted-foreground mb-6 text-lg leading-relaxed line-clamp-3">
                        {DOMPurify.sanitize(blogPost.content ?? "", {
                          ALLOWED_TAGS: [],
                        })}
                      </div>

                      <Link
                        href={`/${CategoryEnum.Blog}/${blogPost.slug}`}
                        className="group/btn inline-flex items-center gap-3 uppercase text-xs font-bold tracking-widest text-foreground hover:text-[#de9e86] transition-colors mt-2"
                      >
                        {t("btn-fresh")}
                        <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                      </Link>
                    </FadeIn>
                  </div>
                </div>
              </div>

              {/* 2. RECIPE ARTICLE (Text Left / Image Right) - STICKY TEXT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 group">
                {/* Text (Left Aligned - even though it's on the left side) */}
                <div className="lg:col-span-5 lg:order-1 relative h-full">
                  <div className="sticky top-16 h-fit flex flex-col text-left items-start transition-all duration-500">
                    <FadeIn>
                      <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#de9e86] mb-5 block">
                        Latest Kitchen Creation
                      </span>
                      
                      <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-4xl md:text-5xl font-medium mb-5 leading-[1.1] text-foreground">
                        <Link
                          href={`/${CategoryEnum.Recipes}/${recipePost.slug}`}
                          className="hover:underline decoration-1 underline-offset-4 transition-all"
                        >
                          {recipePost.title}
                        </Link>
                      </h3>

                      <div className="font-[family-name:var(--font-lora)] text-muted-foreground mb-6 text-lg leading-relaxed line-clamp-3">
                        {DOMPurify.sanitize(recipePost.content ?? "", {
                          ALLOWED_TAGS: [],
                        })}
                      </div>

                      <Link
                        href={`/${CategoryEnum.Recipes}/${recipePost.slug}`}
                        className="group/btn inline-flex items-center gap-3 uppercase text-xs font-bold tracking-widest text-foreground hover:text-[#de9e86] transition-colors mt-2"
                      >
                        {t("btn-fresh")}
                        <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                      </Link>
                    </FadeIn>
                  </div>
                </div>

                {/* Image */}
                <FadeIn className="lg:col-span-7 lg:order-2 relative">
                  <div 
                    className="relative w-full overflow-hidden bg-[#faf9f8] shadow-sm rounded-sm"
                    style={{ aspectRatio: '4/5' }}
                  >
                     <Image
                      src={recipePost.image || "/placeholder.jpg"}
                      alt={recipePost.title}
                      fill
                      className="object-cover object-right scale-110 origin-right transition-transform duration-1000 ease-out group-hover:scale-115"
                    />
                  </div>
                </FadeIn>
              </div>
            </div>
          )}

          {/* View All Footer Link */}
          <FadeIn className="text-center mt-32">
            <Link
              href={`/${CategoryEnum.Blog}`}
              className="inline-block px-12 py-4 border border-foreground/10 uppercase tracking-[0.3em] text-xs font-bold hover:bg-foreground hover:text-background transition-all duration-500 rounded-sm"
            >
              View All Stories
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
