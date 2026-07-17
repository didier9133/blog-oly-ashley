"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LocalizedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isSpanish = locale === "es";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-[#F9F8F6] px-4 py-20 font-[family-name:var(--font-lora)]">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#bd775c]">
          {isSpanish ? "Algo salió mal" : "Something went wrong"}
        </p>
        <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-4xl font-light italic text-foreground sm:text-5xl">
          {isSpanish
            ? "No pudimos cargar esta página."
            : "We could not load this page."}
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-foreground/70">
          {isSpanish
            ? "Inténtalo de nuevo. Si el problema continúa, vuelve al inicio o escríbeme."
            : "Please try again. If the problem continues, return home or get in touch."}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            {isSpanish ? "Intentar de nuevo" : "Try again"}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}`}>
              {isSpanish ? "Volver al inicio" : "Return home"}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
