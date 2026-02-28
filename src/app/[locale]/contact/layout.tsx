import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://www.raicesreturnings.com";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/contact`,
      images: [`${BASE_URL}/og-image.jpeg`],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: {
        en: `${BASE_URL}/en/contact`,
        es: `${BASE_URL}/es/contact`,
        "x-default": `${BASE_URL}/en/contact`,
      },
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
