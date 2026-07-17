"use client";

import * as React from "react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { data } from "@/const/navbar-options";
import { useUser } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { SidebarNavMenu } from "@/components/sidebar-nav-menu";

type NavItem = {
  title: string;
  url: string;
  isActive: boolean;
  external?: boolean;
};

const titleToPath = (item: NavItem): string => {
  if (item.external) return "merch";
  if (item.url === "/") return "home";
  if (item.url.includes("#newsletter")) return "subscribe";
  return item.url.replace(/^\//, "");
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): React.ReactElement {
  const { user, isLoaded } = useUser();
  const t = useTranslations("navigation");
  const locale = useLocale();
  const isSpanish = locale === "es";
  const sidebarTitle = isSpanish ? "Menú de administración" : "Admin menu";
  const sidebarDescription = isSpanish
    ? "Muestra el menú de administración en dispositivos móviles."
    : "Displays the admin menu on mobile devices.";
  const toggleLabel = isSpanish
    ? "Mostrar u ocultar el menú de administración"
    : "Show or hide the admin menu";

  const isAdmin = isLoaded && Boolean(user?.publicMetadata?.isAdmin);
  const items = (isAdmin ? data.navAdmin : data.navMain) as NavItem[];

  const itemsTranslated = items.map((item) => ({
    ...item,
    title: t(titleToPath(item)),
    url: item.external
      ? item.url
      : item.url === "/"
        ? `/${locale}`
        : `/${locale}${item.url}`,
  }));

  return (
    <Sidebar
      {...props}
      mobileTitle={sidebarTitle}
      mobileDescription={sidebarDescription}
      className="border-l-0 shadow-2xl"
    >
      <SidebarHeader className="h-20 border-b border-border/50 bg-[#F9F8F6] px-6">
        <div className="flex justify-start items-center h-full w-full">
          <Link href={`/${locale}`} className="flex-shrink-0">
            <span className="font-[family-name:var(--font-great-vibes)] text-3xl font-medium text-foreground tracking-tight">
              Ashley Leon
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#F9F8F6] pt-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#d8a08b]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 -left-20 w-48 h-48 bg-[#b5c4a6]/10 rounded-full blur-3xl pointer-events-none"></div>

        <SidebarGroup className="relative z-10">
          <SidebarGroupContent>
            <SidebarNavMenu items={itemsTranslated} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail aria-label={toggleLabel} title={toggleLabel} />
    </Sidebar>
  );
}
