import { sendGAEvent } from "@next/third-parties/google";

export const ANALYTICS_CONSENT_KEY = "adl_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "adl:analytics-consent-change";

export type AnalyticsConsent = "granted" | "denied";
export type AnalyticsValue = string | number | boolean;
export type AnalyticsItem = Record<string, string | number>;
export type AnalyticsPropertyValue = AnalyticsValue | readonly AnalyticsItem[];
export type AnalyticsProperties = Record<
  string,
  AnalyticsPropertyValue | null | undefined
>;

export type SeoAnalyticsEvent =
  | "blog_product_cta_view"
  | "blog_product_cta_click"
  | "related_post_click"
  | "community_cta_click"
  | "circle_cta_click"
  | "newsletter_cta_click"
  | "newsletter_signup"
  | "view_item"
  | "begin_checkout"
  | "purchase";

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  const dataLayer = window.dataLayer ?? (window.dataLayer = []);
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      dataLayer.push(args);
    });
  window.gtag(
    "consent",
    "update",
    {
      analytics_storage: consent,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  );
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }),
  );
}

/** Sends only controlled, non-null parameters and only after explicit consent. */
export function trackAnalyticsEvent(
  event: SeoAnalyticsEvent,
  properties: AnalyticsProperties,
): boolean {
  if (getAnalyticsConsent() !== "granted") return false;

  const safeProperties = sanitizeAnalyticsProperties(properties);
  sendGAEvent("event", event, safeProperties);
  return true;
}

export function sanitizeAnalyticsProperties(properties: AnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(
      (entry) => entry[1] !== null && entry[1] !== undefined,
    ),
  ) as Record<string, AnalyticsPropertyValue>;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
