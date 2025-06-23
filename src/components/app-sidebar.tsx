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

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): Promise<React.ReactElement> {
  const user = await currentUser();

  const items =
    user && user.publicMetadata.isAdmin ? data.navAdmin : data.navMain;

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
              className="object-contain"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url}>{item.title}</a>
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
