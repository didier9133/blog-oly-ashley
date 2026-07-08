import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fullUrl, ogImageUrl } from "@/lib/url";

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
      url: fullUrl(locale, "/contact"),
      images: [ogImageUrl(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImageUrl(locale)],
    },
    alternates: {
      canonical: fullUrl(locale, "/contact"),
      languages: {
        en: fullUrl("en", "/contact"),
        es: fullUrl("es", "/contact"),
        "x-default": fullUrl("en", "/contact"),
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
