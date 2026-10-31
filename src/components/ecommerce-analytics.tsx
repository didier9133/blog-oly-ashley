"use client";

import { useEffect, useRef } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  getViewItemSessionKey,
  trackAnalyticsEvent,
} from "@/lib/analytics";

type ItemProperties = {
  itemId: string;
  itemName: string;
  itemCategory: string;
  locale: string;
  value?: number;
  currency?: string;
};

export function ViewItemAnalytics(properties: ItemProperties) {
  const tracked = useRef(false);
  const { itemId, itemName, itemCategory, locale, value, currency } =
    properties;

  useEffect(() => {
    const send = () => {
      if (tracked.current) return;

      const sessionKey = getViewItemSessionKey(itemId);
      try {
        if (window.sessionStorage.getItem(sessionKey)) {
          tracked.current = true;
          return;
        }
      } catch {
        // The in-memory guard still prevents duplicates during this mount.
      }

      const sent = trackAnalyticsEvent("view_item", {
        product_id: itemId,
        locale,
        value,
        currency: currency?.toUpperCase(),
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            item_category: itemCategory,
          },
        ],
      });
      if (!sent) return;

      tracked.current = true;
      try {
        window.sessionStorage.setItem(sessionKey, "1");
      } catch {
        // Some privacy modes disable sessionStorage; the mount guard remains.
      }
    };
    send();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, send);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, send);
  }, [currency, itemCategory, itemId, itemName, locale, value]);

  return null;
}

export function PurchaseAnalytics({
  transactionId,
  ...properties
}: ItemProperties & { transactionId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    const send = () => {
      if (tracked.current) return;
      const key = `adl_purchase:v1:${transactionId}`;
      try {
        if (window.sessionStorage.getItem(key)) {
          tracked.current = true;
          return;
        }
      } catch {
        /* The mount guard remains available. */
      }
      tracked.current = trackAnalyticsEvent("purchase", {
        product_id: properties.itemId,
        transaction_id: transactionId,
        locale: properties.locale,
        value: properties.value,
        currency: properties.currency?.toUpperCase(),
        items: [
          {
            item_id: properties.itemId,
            item_name: properties.itemName,
            item_category: properties.itemCategory,
          },
        ],
      });
      if (tracked.current) {
        try {
          window.sessionStorage.setItem(key, "1");
        } catch {
          /* Optional storage. */
        }
      }
    };
    send();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, send);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, send);
  }, [properties, transactionId]);

  return null;
}
