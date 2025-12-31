"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { scrollToNewsletter } from "@/lib/newsletter-scroll";

interface ItemProps {
  title: string;
  url: string;
  external?: boolean;
}

export function ItemNavBar({ title, url, external = false }: ItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { basePath, targetHash } = useMemo(() => {
    if (!url.includes("#")) return { basePath: url, targetHash: "" };
    const [pathPart, hashPart] = url.split("#");
    return { basePath: pathPart || "/", targetHash: `#${hashPart}` };
  }, [url]);

  const [currentHash, setCurrentHash] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setCurrentHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const isHashMatch = !!targetHash && currentHash === targetHash;

  const isSubscribeNewsletter = targetHash === "#newsletter";
  const isActive = isSubscribeNewsletter
    ? false
    : targetHash
      ? isHashMatch
      : pathname.startsWith(url);

  const resolvedHref = useMemo(() => {
    if (external) return url;
    if (!targetHash) return url;

    // Stay on the current route and only change the hash.
    return `${pathname}${targetHash}`;
  }, [external, pathname, targetHash, url]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (external) return;
    if (targetHash !== "#newsletter") return;
    e.preventDefault();
    router.replace(`${pathname}#newsletter`, { scroll: false });
    scrollToNewsletter({ behavior: "smooth" });
  };

  return (
    <Link
      href={resolvedHref}
      onClick={handleClick}
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
