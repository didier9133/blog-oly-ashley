import { ClerkProvider } from "@clerk/nextjs";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthHeader } from "@/components/auth-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";
import { fullUrl } from "@/lib/url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    robots: { index: false, follow: false },
    alternates: { canonical: fullUrl(locale, "/dashboard") },
    openGraph: null,
    twitter: null,
  };
}

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <ClerkProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar
          side="right"
          className="font-[family-name:var(--font-cormorant-garamond)]"
        />
        <SidebarInset>
          <AuthHeader locale={locale} />
          {children}
          <Footer locale={locale} />
        </SidebarInset>
      </SidebarProvider>
    </ClerkProvider>
  );
}
