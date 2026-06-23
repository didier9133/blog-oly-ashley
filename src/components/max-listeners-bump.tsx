"use client";

import { useEffect } from "react";

export function MaxListenersBump() {
  useEffect(() => {
    const target = 50;
    const eE = (EventTarget.prototype as unknown as {
      setMaxListeners?: (n: number) => void;
    }).setMaxListeners;
    if (typeof eE === "function") {
      eE(target);
    }
  }, []);

  return null;
}
