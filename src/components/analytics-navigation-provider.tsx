"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type AnalyticsNavigation = {
  currentPathname: string;
  previousPathname: string | null;
};

const AnalyticsNavigationContext =
  createContext<AnalyticsNavigation | null>(null);

function getInternalReferrerPathname(currentPathname: string) {
  try {
    if (!document.referrer) return null;

    const referrer = new URL(document.referrer);
    if (
      referrer.origin !== window.location.origin ||
      referrer.pathname === currentPathname
    ) {
      return null;
    }

    return referrer.pathname;
  } catch {
    return null;
  }
}

export function AnalyticsNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const currentPathname = useRef(pathname);
  const initialized = useRef(false);
  const [previousPathname, setPreviousPathname] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      currentPathname.current = pathname;
      setPreviousPathname(getInternalReferrerPathname(pathname));
      return;
    }

    if (currentPathname.current === pathname) return;

    setPreviousPathname(currentPathname.current);
    currentPathname.current = pathname;
  }, [pathname]);

  return (
    <AnalyticsNavigationContext.Provider
      value={{ currentPathname: pathname, previousPathname }}
    >
      {children}
    </AnalyticsNavigationContext.Provider>
  );
}

export function useAnalyticsNavigation() {
  const navigation = useContext(AnalyticsNavigationContext);
  if (!navigation) {
    throw new Error(
      "useAnalyticsNavigation must be used within AnalyticsNavigationProvider",
    );
  }

  return navigation;
}
