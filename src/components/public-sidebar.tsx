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
import { getLocale, getTranslations } from "next-intl/server";
import { SidebarNavMenu } from "@/components/sidebar-nav-menu";
import { localizedHref } from "@/lib/url";

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

export async function PublicSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): Promise<React.ReactElement> {
  const locale = await getLocale();
  const t = await getTranslations("navigation");
  const items = data.navMain as NavItem[];

  const itemsTranslated = items.map((item) => ({
    ...item,
    title: t(titleToPath(item)),
    url: item.external ? item.url : localizedHref(locale, item.url),
  }));

  return (
    <Sidebar {...props} className="border-l border-foreground/10 shadow-2xl">
      <SidebarHeader className="h-24 border-b border-foreground/10 bg-[#F9F8F6] px-7">
        <div className="flex h-full w-full items-center justify-start">
          <Link href={localizedHref(locale, "/")} className="flex-shrink-0">
            <span className="font-[family-name:var(--font-great-vibes)] text-[2rem] font-medium tracking-tight text-foreground">
              Ashley Leon
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="relative overflow-hidden bg-[#F9F8F6] pt-8">
        <SidebarGroup className="relative">
          <div className="px-7 pb-5 font-[family-name:var(--font-lora)] text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-foreground/45">
            Menu
          </div>
          <SidebarGroupContent>
            <SidebarNavMenu items={itemsTranslated} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
