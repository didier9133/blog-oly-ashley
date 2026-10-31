"use client";

import { useCallback, useRef } from "react";
import {
  trackAnalyticsEvent,
  type AnalyticsProperties,
  type SeoAnalyticsEvent,
} from "@/lib/analytics";
import { getCheckoutSessionId } from "@/lib/checkout-session";

export function useCheckoutFunnel({
  productId,
  productName,
  productType,
  amount,
  currency,
  locale,
}: {
  productId: string;
  productName: string;
  productType: string;
  amount: number;
  currency: string;
  locale: string;
}) {
  const sent = useRef(new Set<string>());
  const productKey = `${productId}:${locale}:${amount}:${currency}`;
  const sessionId = useCallback(
    (renew = false) => getCheckoutSessionId(productKey, renew),
    [productKey],
  );
  const track = useCallback(
    (
      event: SeoAnalyticsEvent,
      step: string,
      extra: AnalyticsProperties = {},
      once = true,
    ) => {
      const checkoutId = sessionId();
      const key = `adl_checkout_event:v1:${checkoutId}:${event}`;
      if (once) {
        if (sent.current.has(key)) return;
        try {
          if (window.sessionStorage.getItem(key)) return;
        } catch {
          /* Optional storage. */
        }
      }
      if (
        !trackAnalyticsEvent(event, {
          checkout_id: checkoutId,
          product_id: productId,
          checkout_step: step,
          locale,
          value: amount / 100,
          currency: currency.toUpperCase(),
          items: [
            {
              item_id: productId,
              item_name: productName,
              item_category: productType,
            },
          ],
          ...extra,
        })
      )
        return;
      if (once) {
        sent.current.add(key);
        try {
          window.sessionStorage.setItem(key, "1");
        } catch {
          /* Optional storage. */
        }
      }
    },
    [amount, currency, locale, productId, productName, productType, sessionId],
  );
  const error = useCallback(
    (stage: string, code?: string, fields?: string) => {
      track(
        "checkout_error",
        stage,
        {
          error_stage: stage,
          error_code: (code ?? "unknown")
            .replace(/[^a-zA-Z0-9_]/g, "_")
            .slice(0, 80),
          invalid_fields: fields,
        },
        false,
      );
    },
    [track],
  );
  return { track, error, sessionId };
}
