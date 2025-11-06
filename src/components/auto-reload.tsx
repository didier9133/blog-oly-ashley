"use client";

import { useEffect } from "react";

interface AutoReloadProps {
  delayMs?: number;
}

/**
 * Triggers a full page reload after the given delay. Useful when a server-side
 * rendered page depends on asynchronous processing that may complete shortly.
 */
export default function AutoReload({ delayMs = 10000 }: AutoReloadProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.reload();
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return <></>;
}
