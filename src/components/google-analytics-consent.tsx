"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  shouldLoadGoogleAnalytics,
  type AnalyticsConsent,
} from "@/lib/analytics";
import { localizedHref } from "@/lib/url";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-15V4PSKHYK";

const COPY = {
  en: {
    title: "Cookies & privacy",
    body: "With your permission, analytics helps us understand what resonates and improve the site. We never send your personal information.",
    mobileBody: "Optional analytics to improve the site.",
    accept: "Accept",
    reject: "Decline",
    settings: "Cookies",
    privacy: "Privacy policy",
  },
  es: {
    title: "Cookies y privacidad",
    body: "Con tu permiso, la analítica nos ayuda a saber qué contenidos te acompañan y a mejorar el sitio. Nunca enviamos tus datos personales.",
    mobileBody: "Analítica opcional para mejorar el sitio.",
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
  const analyticsEnabled = shouldLoadGoogleAnalytics(
    consent,
    process.env.NODE_ENV,
  );

  return (
    <>
      {analyticsEnabled ? (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      ) : null}

      {showDialog ? (
        <section
          role="dialog"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
          className="analytics-consent-banner fixed inset-x-0 bottom-0 z-[90] border-t border-[#2b2b2b]/15 bg-[#f7f2ea] transition-[bottom] duration-300"
        >
          <div className="mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:flex sm:gap-5 sm:px-5 sm:py-3 lg:px-8">
            <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-3">
              <h2
                id="analytics-consent-title"
                className="sr-only shrink-0 font-[family-name:var(--font-cormorant-garamond)] text-lg font-semibold leading-tight text-foreground sm:not-sr-only"
              >
                {copy.title}
              </h2>
              <p
                id="analytics-consent-description"
                className="font-sans text-[0.7rem] leading-[1.35] text-foreground/70 sm:text-sm"
              >
                <span className="sm:hidden">{copy.mobileBody}</span>
                <span className="hidden sm:inline">{copy.body}</span>
                <span aria-hidden="true" className="hidden sm:inline">
                  {" "}
                  ·{" "}
                </span>
                <span aria-hidden="true" className="sm:hidden">
                  {" "}
                </span>
                <Link
                  href={localizedHref(language, "/privacy")}
                  className="whitespace-nowrap underline decoration-foreground/35 underline-offset-4 transition-colors hover:text-foreground"
                >
                  {copy.privacy}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="min-h-10 min-w-[4.5rem] border border-foreground/25 px-2 py-2 font-sans text-xs font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b77761] sm:min-w-[5.25rem] sm:px-4"
              >
                {copy.reject}
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="min-h-10 min-w-[4.5rem] bg-[#8f513b] px-2 py-2 font-sans text-xs font-semibold text-[#fffaf5] transition-colors hover:bg-[#784330] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f513b] focus-visible:ring-offset-2 sm:min-w-[5.25rem] sm:px-5"
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </section>
      ) : ready ? (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="analytics-consent-settings fixed bottom-3 left-3 z-[90] rounded-full border border-border bg-[#F9F8F6] px-3 py-2 font-sans text-xs text-foreground/75 shadow-md transition-[bottom,color] duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b77761]"
        >
          {copy.settings}
        </button>
      ) : null}
    </>
  );
}
