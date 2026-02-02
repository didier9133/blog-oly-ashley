import { ClerkProvider } from "@clerk/nextjs";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/nav-bar";
import { Footer } from "@/components/footer";

import { Lora, Cormorant_Garamond } from "next/font/google";

import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

// Internationalization
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

//Analytics
import { Analytics } from "@vercel/analytics/next";

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
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_ES"],
      url: "https://www.raicesreturnings.com",
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
        </head>
        <body
          className={`${cormorantGaramond.variable} ${lora.variable} antialiased `}
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
                <Footer />
              </SidebarInset>
            </SidebarProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
