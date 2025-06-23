import { data } from "@/const/navbar-options";
import { ItemNavBar } from "./item-nav-bar";
import { currentUser } from "@clerk/nextjs/server";

export async function ItemsNavBar() {
  const user = await currentUser();
  const items =
    user && user.publicMetadata.isAdmin ? data.navAdmin : data.navMain;

  return (
    <div className="hidden md:flex items-center gap-4">
      {items.map((item) => (
        <ItemNavBar key={item.title} {...item} />
      ))}
    </div>
  );
}
