"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ItemProps {
  title: string;
  url: string;
  external?: boolean;
}

export function ItemNavBar({ title, url, external = false }: ItemProps) {
  console.log({
    external,
    title,
  });
  const pathname = usePathname();
  const isActive = pathname.startsWith(url);

  return (
    <Link
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`text-base font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all ${
        isActive
          ? "text-primary after:w-full"
          : "text-foreground hover:text-primary after:w-0 hover:after:w-full"
      }`}
    >
      {title}
    </Link>
  );
}
