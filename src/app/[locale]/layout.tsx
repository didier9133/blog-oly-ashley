import { ClerkProvider } from "@clerk/nextjs";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

import { Lora, Cormorant_Garamond, Great_Vibes } from "next/font/google";

import "./globals.css";

// Internationalization
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

//Analytics
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
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
      canonical: `https://www.raicesreturnings.com/${locale}`,
      languages: {
        en: "https://www.raicesreturnings.com/en",
        es: "https://www.raicesreturnings.com/es",
        "x-default": "https://www.raicesreturnings.com/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_ES"],
      url: `https://www.raicesreturnings.com/${locale}`,
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
          url: "https://www.raicesreturnings.com/og-image-square.jpg",
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
    <ClerkProvider>
      <html lang={locale}>
        <head>
          <meta
            name="google-site-verification"
            content="google4ff5fb217dd7438f"
          />
          <link
            rel="icon"
            href="/favicon.svg"
            sizes="any"
            type="image/svg+xml"
          />
          <link rel="icon" href="/favicon.ico" sizes="48x48" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />

          <link rel="manifest" href="/site.webmanifest" />
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
            <Toaster position="top-right" richColors />
            <SidebarProvider defaultOpen={false}>
              <AppSidebar
                side="right"
                className="font-[family-name:var(--font-cormorant-garamond)]"
              />
              <SidebarInset>
                <Header />
                {children}
                <Analytics />
                <SpeedInsights />
                <Script
                  id="meta-pixel"
                  strategy="afterInteractive"
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
                <Footer />
              </SidebarInset>
            </SidebarProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
