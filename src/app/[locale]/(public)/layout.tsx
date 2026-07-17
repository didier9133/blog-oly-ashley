import { PublicSidebar } from "@/components/public-sidebar";
import { PublicHeader } from "@/components/public-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <SidebarProvider defaultOpen={false}>
      <PublicSidebar
        locale={locale}
        side="right"
        className="font-[family-name:var(--font-cormorant-garamond)]"
      />
      <SidebarInset>
        <PublicHeader locale={locale} />
        {children}
        <ScrollToTop />
        <Footer locale={locale} />
      </SidebarInset>
    </SidebarProvider>
  );
}
