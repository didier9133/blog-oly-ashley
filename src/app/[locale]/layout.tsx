import { Lora, Cormorant_Garamond, Great_Vibes } from "next/font/google";

import "./globals.css";

// Internationalization
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { BASE_URL } from "@/lib/url";

// Analytics
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// UI providers
import { Toaster } from "@/components/ui/sonner";
import { MaxListenersBump } from "@/components/max-listeners-bump";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  adjustFontFallback: true,
  fallback: ["Georgia", "serif"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  adjustFontFallback: true,
  fallback: ["Georgia", "serif"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  preload: false,
  adjustFontFallback: true,
  fallback: ["cursive"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");
  const ogImageAlt = t("ogImageAlt");

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: t("keywords").split(", "),
    authors: [{ name: "Ashley Leon" }],
    creator: "Ashley Leon",
    publisher: "Ashley Leon",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: locale === "es" ? `${BASE_URL}/es` : BASE_URL,
      languages: {
        en: BASE_URL,
        es: `${BASE_URL}/es`,
        "x-default": BASE_URL,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_ES"],
      url: locale === "es" ? `${BASE_URL}/es` : BASE_URL,
      siteName: "Ashley Leon",
      title,
      description,
      images: [
        {
          url: `${BASE_URL}/og-image.jpeg`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: "image/jpeg",
        },
        {
          url: `${BASE_URL}/og-image-square.jpeg`,
          width: 1080,
          height: 1080,
          alt: ogImageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${BASE_URL}/og-image.jpeg`,
          alt: ogImageAlt,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function s(i){var u=typeof i==='string'?i:(i&&i.url)||'';return String(u).indexOf('r.stripe.com')!==-1}var o=window.fetch;if(o){window.fetch=function(i,n){if(s(i)){return Promise.resolve(new Response(null,{status:200}))}return o.apply(this,arguments)}}if(navigator.sendBeacon){var b=navigator.sendBeacon;navigator.sendBeacon=function(u,d){if(s(u))return true;return b.call(this,u,d)}}})();",
          }}
        />
        <meta
          name="google-site-verification"
          content="google4ff5fb217dd7438f"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link rel="manifest" href="/site.webmanifest" />

        <link
          rel="preconnect"
          href="https://dgw9atod1ju2x.cloudfront.net"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://dgw9atod1ju2x.cloudfront.net" />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${lora.variable} ${greatVibes.variable} antialiased overflow-x-hidden`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MaxListenersBump />
          <Toaster position="top-right" richColors />
          {children}
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
