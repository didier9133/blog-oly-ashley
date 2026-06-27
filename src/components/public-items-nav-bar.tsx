import { data } from "@/const/navbar-options";
import { ItemNavBar } from "./item-nav-bar";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("navigation");
  const items = data.navMain as NavItem[];

  const itemsTranslated = items.map((item) => ({
    ...item,
    title: t(titleToPath(item)),
  }));

  return (
    <div className="hidden md:flex items-center gap-8">
      {itemsTranslated.map((item) => (
        <ItemNavBar key={item.title} {...item} />
      ))}
    </div>
  );
}
