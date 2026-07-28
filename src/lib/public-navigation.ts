import { data } from "@/const/navbar-options";

export type PublicNavItem = {
  title: string;
  url: string;
  isActive: boolean;
  external?: boolean;
};

export function getPublicNavigationItems(locale: string): PublicNavItem[] {
  const hasLocalizedPillar = locale === "en" || locale === "es";

  return (data.navMain as PublicNavItem[]).map((item) =>
    hasLocalizedPillar && item.url === "/"
      ? { ...item, url: "/deconstructing-christianity" }
      : item,
  );
}
