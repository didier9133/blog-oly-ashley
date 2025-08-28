import { ClerkProvider } from "@clerk/nextjs";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/nav-bar";
import { Footer } from "@/components/footer";

import { Lora, Cormorant_Garamond } from "next/font/google";

import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

// Internationalization
import { NextIntlClientProvider, hasLocale } from "next-intl";
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

export const metadata: Metadata = {
  title: "Raíces & Returnings - Ashley & Oly",
  description:
    "A space for the stories we carry, the ones we're still learning how to tell, and the ones we're finally ready to live. Reflections on identity, queerness, healing, spirituality, and home. Recipes passed down and reimagined.",
  keywords: [
    "Ashley & Oly",
    "Raíces & Returnings",
    "queerness",
    "identity",
    "healing",
    "spirituality",
    "recipes",
    "migration",
    "Venezuelan food",
    "LGBTQ+",
    "blog",
    "reflections",
    "culture",
    "home",
    "storytelling",
  ],

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
    locale: "en_US",
    alternateLocale: ["es_ES"],
    url: "https://www.raicesreturnings.com",
    siteName: "Raíces & Returnings",
    title: "Raíces & Returnings - Ashley & Oly",
    description:
      "A space for the stories we carry, the ones we're still learning how to tell, and the ones we're finally ready to live. Reflections on identity, queerness, healing, spirituality, and home. Recipes passed down and reimagined.",
    images: [
      {
        url: "https://www.raicesreturnings.com/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Raíces & Returnings - Ashley & Oly",
        type: "image/jpeg",
      },
      {
        url: "https://www.raicesreturnings.com/og-image-square.jpg",
        width: 1080,
        height: 1080,
        alt: "Raíces & Returnings - Ashley & Oly",
        type: "image/jpeg",
      },
    ],
  },
};

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
          <NextIntlClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
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
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
