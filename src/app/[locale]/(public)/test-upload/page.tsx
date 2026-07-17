import type { Metadata } from "next";
import { fullUrl } from "@/lib/url";
import TestUploadClient from "./test-upload-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "es" ? "Prueba de carga | Ashley Leon" : "Test Upload",
    robots: { index: false, follow: false },
    alternates: { canonical: fullUrl(locale, "/test-upload") },
    openGraph: null,
    twitter: null,
  };
}

export default function TestUploadPage() {
  return <TestUploadClient />;
}
