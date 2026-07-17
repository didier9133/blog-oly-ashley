import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Coffee, House } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const locale = useLocale();
  return (
    <div className="font-[family-name:var(--font-lora)]">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative Elements */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 text-rose-200 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute -top-2 -right-6 text-amber-200 animate-bounce">
              <Heart className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-2 left-8 text-stone-200 animate-pulse">
              <Coffee className="h-6 w-6" />
            </div>
            <Image
              src="/meditation.png"
              alt={t("imageAlt")}
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
          </div>

          {/* Main Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-light text-stone-700 tracking-wide font-[family-name:var(--font-cormorant-garamond)]">
              {t("title")}
            </h1>
            <p className="text-lg text-stone-500 font-light max-w-md mx-auto leading-relaxed">
              {t("message")}
            </p>
          </div>

          {/* Subtle Quote */}
          <div className="mb-12">
            <blockquote className="text-stone-400 italic text-sm font-light">
              {t("subtleQuote")}
            </blockquote>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center">
            <Link href={`/${locale}`}>
              <Button size="lg">
                <House className="h-5 w-5 mr-2" />
                {t("returnHome")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    </div>
  );
}
