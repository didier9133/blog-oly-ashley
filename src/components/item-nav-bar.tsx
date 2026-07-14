"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { scrollToNewsletter } from "@/lib/newsletter-scroll";

interface ItemProps {
  title: string;
  url: string;
  external?: boolean;
  compact?: boolean;
}

export function ItemNavBar({
  title,
  url,
  external = false,
  compact = false,
}: ItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const targetHash = useMemo(() => {
    if (!url.includes("#")) return "";
    const [, hashPart] = url.split("#");
    return `#${hashPart}`;
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
  const isHome = url === "/" || /^\/(en|es)\/?$/.test(url);
  const normalizedPathname = (pathname ?? "/").replace(/\/$/, "") || "/";
  const normalizedUrl = url.replace(/\/$/, "") || "/";
  const isActive = isSubscribeNewsletter
    ? false
    : targetHash
      ? isHashMatch
      : isHome
        ? normalizedPathname === normalizedUrl
        : (pathname ?? "/").startsWith(url);

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
      className={`relative font-[family-name:var(--font-lora)] font-semibold transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:bg-foreground/60 after:transition-all ${
        compact
          ? "whitespace-nowrap text-[0.82rem] tracking-[0.02em] xl:text-[1rem] xl:tracking-[0.035em]"
          : "text-[1rem] tracking-[0.035em]"
      } ${
        isActive
          ? "text-foreground after:w-full"
          : "text-foreground/75 hover:text-foreground after:w-0 hover:after:w-full"
      }`}
    >
      {title}
    </Link>
  );
}
