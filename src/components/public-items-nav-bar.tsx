import { data } from "@/const/navbar-options";
import { ItemNavBar } from "./item-nav-bar";
import { getLocale, getTranslations } from "next-intl/server";
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

export async function PublicItemsNavBar() {
  const locale = await getLocale();
  const t = await getTranslations("navigation");
  const items = data.navMain as NavItem[];

  const itemsTranslated = items.map((item) => ({
    ...item,
    title: t(titleToPath(item)),
    url: item.external ? item.url : localizedHref(locale, item.url),
  }));

  return (
    <div className="hidden md:flex items-center gap-8">
      {itemsTranslated.map((item) => (
        <ItemNavBar key={item.title} {...item} />
      ))}
    </div>
  );
}
