import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import { SidebarNavMenu } from "@/components/sidebar-nav-menu";
import { localizedHref } from "@/lib/url";
import {
  getPublicNavigationItems,
  type PublicNavItem,
} from "@/lib/public-navigation";

const titleToPath = (item: PublicNavItem): string => {
  if (item.external) return "merch";
  if (item.url === "/") return "home";
  if (item.url.includes("#newsletter")) return "subscribe";
  return item.url.replace(/^\//, "");
};

export async function PublicSidebar({
  locale,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  locale: string;
}): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: "navigation" });
  const items = getPublicNavigationItems(locale);
  const isSpanish = locale === "es";
  const sidebarTitle = isSpanish ? "Menú de navegación" : "Navigation menu";
  const sidebarDescription = isSpanish
    ? "Muestra el menú de navegación en dispositivos móviles."
    : "Displays the navigation menu on mobile devices.";
  const toggleLabel = isSpanish
    ? "Mostrar u ocultar el menú de navegación"
    : "Show or hide the navigation menu";

  const itemsTranslated = items.map((item) => ({
    ...item,
    title: t(titleToPath(item)),
    url: item.external ? item.url : localizedHref(locale, item.url),
  }));

  return (
    <Sidebar
      {...props}
      mobileTitle={sidebarTitle}
      mobileDescription={sidebarDescription}
      className="border-l border-foreground/10 shadow-2xl"
    >
      <SidebarContent className="relative overflow-hidden bg-[#F9F8F6] pt-8">
        <SidebarGroup className="relative">
          <div className="px-7 pb-5 font-[family-name:var(--font-lora)] text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-foreground/45">
            {isSpanish ? "Menú" : "Menu"}
          </div>
          <SidebarGroupContent>
            <SidebarNavMenu items={itemsTranslated} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail aria-label={toggleLabel} title={toggleLabel} />
    </Sidebar>
  );
}
