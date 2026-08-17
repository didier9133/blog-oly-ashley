"use client";

import { useEffect, useRef } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  getViewItemSessionKey,
  isInternalPageNavigation,
  trackAnalyticsEvent,
} from "@/lib/analytics";
import { useAnalyticsNavigation } from "@/components/analytics-navigation-provider";

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
  const { currentPathname, previousPathname } = useAnalyticsNavigation();
  const {
    itemId,
    itemName,
    itemCategory,
    locale,
    value,
    currency,
  } = properties;

  useEffect(() => {
    const send = () => {
      if (tracked.current) return;
      if (!isInternalPageNavigation(currentPathname, previousPathname)) return;

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
  }, [
    currency,
    currentPathname,
    itemCategory,
    itemId,
    itemName,
    locale,
    previousPathname,
    value,
  ]);

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
      tracked.current = trackAnalyticsEvent("purchase", {
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
    };
    send();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, send);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, send);
  }, [properties, transactionId]);

  return null;
}
