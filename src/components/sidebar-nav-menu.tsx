"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { scrollToNewsletter } from "@/lib/newsletter-scroll";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type SidebarNavItem = {
  title: string;
  url: string;
  external?: boolean;
};

function splitHash(url: string): { basePath: string; targetHash: string } {
  if (!url.includes("#")) return { basePath: url, targetHash: "" };
  const [pathPart, hashPart] = url.split("#");
  return { basePath: pathPart || "/", targetHash: `#${hashPart}` };
}

export function SidebarNavMenu({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentHash, setCurrentHash] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setCurrentHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const activeMap = useMemo(() => {
    const map = new Map<string, boolean>();

    for (const item of items) {
      if (item.external) {
        map.set(item.url, false);
        continue;
      }

      const { targetHash } = splitHash(item.url);

      if (!targetHash) {
        map.set(item.url, pathname.startsWith(item.url));
        continue;
      }
      const isHashMatch = currentHash === targetHash;
      map.set(item.url, targetHash === "#newsletter" ? false : isHashMatch);
    }

    return map;
  }, [currentHash, items, pathname]);

  const resolvedHref = useMemo(() => {
    return (item: SidebarNavItem) => {
      if (item.external) return item.url;
      if (!item.url.includes("#")) return item.url;

      const { targetHash } = splitHash(item.url);
      return `${pathname}${targetHash}`;
    };
  }, [pathname]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: SidebarNavItem,
  ) => {
    if (item.external) return;
    const { targetHash } = splitHash(item.url);
    if (targetHash !== "#newsletter") return;
    e.preventDefault();
    router.replace(`${pathname}#newsletter`, { scroll: false });
    scrollToNewsletter({ behavior: "smooth" });
  };

  return (
    <SidebarMenu className="gap-4 px-6">
      {items.map((item) => {
        const isActive = activeMap.get(item.url) ?? false;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={`h-auto py-3 px-6 text-2xl font-[family-name:var(--font-cormorant-garamond)] transition-all duration-300 rounded-sm ${
                isActive
                  ? "bg-[#de9e86]/10 text-[#c47456] font-medium italic"
                  : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Link
                href={resolvedHref(item)}
                onClick={(e) => handleClick(e, item)}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="w-full flex items-center"
              >
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
