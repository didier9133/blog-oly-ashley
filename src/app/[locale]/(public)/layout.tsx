import { PublicSidebar } from "@/components/public-sidebar";
import { PublicHeader } from "@/components/public-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ScrollToTop />
      <PublicSidebar
        side="right"
        className="font-[family-name:var(--font-cormorant-garamond)]"
      />
      <SidebarInset>
        <PublicHeader />
        {children}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
