import { data } from "@/const/navbar-options";

export type PublicNavItem = {
  title: string;
  url: string;
  isActive: boolean;
  external?: boolean;
};

export function getPublicNavigationItems(locale: string): PublicNavItem[] {
  return (data.navMain as PublicNavItem[]).map((item) =>
    locale === "en" && item.url === "/"
      ? { ...item, url: "/deconstructing-christianity" }
      : item,
  );
}
