"use client";

import { data } from "@/const/navbar-options";
import { ItemNavBar } from "./item-nav-bar";
import { useUser } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";

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

export function ItemsNavBar() {
  const { user, isLoaded } = useUser();
  const t = useTranslations("navigation");
  const locale = useLocale();

  // Mientras Clerk carga el user, asumimos no-admin para evitar CLS:
  // el nav se monta con el set base (navMain) y solo cambia si es admin.
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
    <div className="hidden md:flex items-center gap-8">
      {itemsTranslated.map((item) => (
        <ItemNavBar key={item.title} {...item} />
      ))}
    </div>
  );
}
