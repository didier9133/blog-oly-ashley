import { data } from "@/const/navbar-options";
import { ItemNavBar } from "./item-nav-bar";
import { currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";

type NavItem = {
  title: string;
  url: string;
  isActive: boolean;
  external?: boolean;
};

export async function ItemsNavBar() {
  const user = await currentUser();
  const items = (
    user && user.publicMetadata.isAdmin ? data.navAdmin : data.navMain
  ) as NavItem[];
  const t = await getTranslations("navigation");

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
    {} as Record<string, string>,
  );
  const itemsTraslated = items.map((item) => ({
    ...item,
    title: t(titleToPathMap[item.title]),
  }));

  return (
    <div className="hidden md:flex items-center gap-8">
      {itemsTraslated.map((item) => (
        <ItemNavBar key={item.title} {...item} />
      ))}
    </div>
  );
}
