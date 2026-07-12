"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";
import { localizedHref } from "@/lib/url";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-15V4PSKHYK";

const COPY = {
  en: {
    title: "Cookies & privacy",
    body: "We use analytics to understand what content is useful to you and improve this site. We do not send your personal information.",
    accept: "Accept",
    reject: "Decline",
    settings: "Cookies",
    privacy: "Privacy policy",
  },
  es: {
    title: "Cookies y privacidad",
    body: "Usamos analítica para entender qué contenido te resulta útil y mejorar este sitio. No enviamos tus datos personales.",
    accept: "Aceptar",
    reject: "Rechazar",
    settings: "Cookies",
    privacy: "Política de privacidad",
  },
} as const;

export function GoogleAnalyticsConsent({ locale }: { locale: string }) {
  const language = locale === "es" ? "es" : "en";
  const copy = COPY[language];
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const storedConsent = getAnalyticsConsent();
    if (storedConsent) setAnalyticsConsent(storedConsent);
    setConsent(storedConsent);
    setReady(true);
  }, []);

  function choose(nextConsent: AnalyticsConsent) {
    setAnalyticsConsent(nextConsent);
    setConsent(nextConsent);
    setSettingsOpen(false);
  }

  const showDialog = ready && (consent === null || settingsOpen);

  return (
    <>
      {consent === "granted" ? (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      ) : null}

      {showDialog ? (
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="analytics-consent-title"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl border border-border bg-[#F9F8F6] p-5 shadow-2xl sm:p-6"
        >
          <h2
            id="analytics-consent-title"
            className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium text-foreground"
          >
            {copy.title}
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/75">
            {copy.body}{" "}
            <Link
              href={localizedHref(language, "/privacy")}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {copy.privacy}
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="min-h-11 border border-foreground/25 px-5 py-2.5 font-sans text-sm text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b77761]"
            >
              {copy.reject}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="min-h-11 bg-[#d8a08b] px-5 py-2.5 font-sans text-sm text-white transition-colors hover:bg-[#c28c77] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b77761] focus-visible:ring-offset-2"
            >
              {copy.accept}
            </button>
          </div>
        </section>
      ) : ready ? (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-3 left-3 z-[90] rounded-full border border-border bg-[#F9F8F6] px-3 py-2 font-sans text-xs text-foreground/75 shadow-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b77761]"
        >
          {copy.settings}
        </button>
      ) : null}
    </>
  );
}
