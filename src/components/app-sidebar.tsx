import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { data } from "@/const/navbar-options";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { SidebarNavMenu } from "@/components/sidebar-nav-menu";

type NavItem = {
  title: string;
  url: string;
  isActive: boolean;
  external?: boolean;
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): Promise<React.ReactElement> {
  const user = await currentUser();
  const t = await getTranslations("navigation");
  const items = (user && user.publicMetadata.isAdmin
    ? data.navAdmin
    : data.navMain) as NavItem[];

  const titleToPathMap = items.reduce(
    (acc, item) => {
      if (!item.external && item.url.includes("#newsletter")) {
        acc[item.title] = "subscribe";
        return acc;
      }
      // For internal links, remove the leading slash
      const path = item.external ? item.url : item.url.replace(/^\//, "");
      if (item.external) {
        acc[item.title] = "merch";
        return acc;
      }
      // Add the mapping to the accumulator object
      acc[item.title] = path;
      return acc;
    },
    {} as Record<string, string>
  );
  const itemsTraslated = items.map((item) => ({
    ...item,
    title: t(titleToPathMap[item.title]),
  }));

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-[64px]">
        <div className="flex justify-center items-center h-full">
          <div className="relative w-[160px] h-[64px]">
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-contain dark:[filter:brightness(0)_invert(1)]"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNavMenu items={itemsTraslated} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
