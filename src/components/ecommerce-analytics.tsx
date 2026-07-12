"use client";

import { useEffect, useRef } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
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

  useEffect(() => {
    const send = () => {
      if (tracked.current) return;
      tracked.current = trackAnalyticsEvent("view_item", {
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
  }, [properties]);

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
