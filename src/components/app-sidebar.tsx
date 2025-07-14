import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { data } from "@/const/navbar-options";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): Promise<React.ReactElement> {
  const user = await currentUser();
  const t = await getTranslations("navigation");
  const items =
    user && user.publicMetadata.isAdmin ? data.navAdmin : data.navMain;

  const titleToPathMap = items.reduce(
    (acc, item) => {
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
            <SidebarMenu>
              {itemsTraslated.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link className="px-4 py-3 pb-4" href={item.url}></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
