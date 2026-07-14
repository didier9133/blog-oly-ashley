import { ItemNavBar } from "./item-nav-bar";
import { getLocale, getTranslations } from "next-intl/server";
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

export async function PublicItemsNavBar() {
  const locale = await getLocale();
  const t = await getTranslations("navigation");
  const items = getPublicNavigationItems(locale);

  const itemsTranslated = items.map((item) => ({
    ...item,
    title: t(titleToPath(item)),
    url: item.external ? item.url : localizedHref(locale, item.url),
  }));

  return (
    <div className="hidden items-center gap-4 lg:flex xl:gap-8">
      {itemsTranslated.map((item) => (
        <ItemNavBar key={item.title} {...item} compact />
      ))}
    </div>
  );
}
