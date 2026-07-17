import { ClerkProvider } from "@clerk/nextjs";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthHeader } from "@/components/auth-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "@/components/footer";

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
          <AuthHeader />
          {children}
          <Footer locale={locale} />
        </SidebarInset>
      </SidebarProvider>
    </ClerkProvider>
  );
}
