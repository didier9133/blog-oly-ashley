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
import Script from "next/script";

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

  return {
    metadataBase: new URL(BASE_URL),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    authors: [{ name: "Ashley León" }, { name: "Oly Contreras" }],
    creator: "Ashley León & Oly Contreras",
    publisher: "Raíces & Returnings",
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
      siteName: "Raíces & Returnings",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "https://www.raicesreturnings.com/og-image.jpeg",
          width: 1200,
          height: 630,
          alt: t("title"),
          type: "image/jpeg",
        },
        {
          url: "https://www.raicesreturnings.com/og-image-square.jpeg",
          width: 1080,
          height: 1080,
          alt: t("title"),
          type: "image/jpeg",
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
        <meta
          name="google-site-verification"
          content="google4ff5fb217dd7438f"
        />
        <link rel="icon" href="/new_logo.png" sizes="any" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
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
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=341835141552957&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
          <Script
            id="meta-pixel"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '341835141552957');
                fbq('track', 'PageView');
              `,
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
