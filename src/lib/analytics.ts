import { sendGAEvent } from "@next/third-parties/google";

export const ANALYTICS_CONSENT_KEY = "adl_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "adl:analytics-consent-change";
export const VIEW_ITEM_SESSION_KEY_PREFIX = "adl_view_item:v1";
export const MEANINGFUL_ENGAGEMENT_SESSION_KEY =
  "adl_meaningful_engagement:v1";

const ANALYTICS_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

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
  | "pillar_workbook_cta_view"
  | "pillar_workbook_cta_click"
  | "pillar_community_cta_view"
  | "pillar_community_cta_click"
  | "related_post_click"
  | "community_cta_click"
  | "circle_cta_click"
  | "newsletter_cta_click"
  | "newsletter_signup"
  | "visible_30s"
  | "scroll_depth"
  | "internal_link_click"
  | "cta_click"
  | "form_interaction_start"
  | "meaningful_engagement"
  | "generate_lead"
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

export function getEffectiveAnalyticsConsent(
  storedConsent: AnalyticsConsent | null,
  consentUiEnabled: boolean,
): AnalyticsConsent | null {
  return consentUiEnabled ? storedConsent : "granted";
}

type AnalyticsSession = {
  lastActivityAt: number;
  meaningfulEngagementSent: boolean;
};

function readAnalyticsSession(now: number): AnalyticsSession {
  try {
    const stored = window.sessionStorage.getItem(
      MEANINGFUL_ENGAGEMENT_SESSION_KEY,
    );
    if (stored) {
      const session = JSON.parse(stored) as AnalyticsSession;
      if (
        Number.isFinite(session.lastActivityAt) &&
        now - session.lastActivityAt < ANALYTICS_SESSION_TIMEOUT_MS
      ) {
        return session;
      }
    }
  } catch {
    // Analytics must never interfere with the visitor's experience.
  }

  return { lastActivityAt: now, meaningfulEngagementSent: false };
}

function writeAnalyticsSession(session: AnalyticsSession) {
  try {
    window.sessionStorage.setItem(
      MEANINGFUL_ENGAGEMENT_SESSION_KEY,
      JSON.stringify(session),
    );
  } catch {
    // Some privacy modes block sessionStorage. The event can still be sent.
  }
}

export function pageType(pathname: string) {
  const pathWithoutLocale = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";

  if (pathWithoutLocale === "/") return "home";
  if (pathWithoutLocale === "/community") return "community";
  if (pathWithoutLocale === "/circle") return "circle";
  if (pathWithoutLocale.startsWith("/circle/")) return "circle_conversion";
  if (pathWithoutLocale === "/workbooks") return "workbooks_index";
  if (pathWithoutLocale.startsWith("/workbooks/")) return "workbook";
  if (pathWithoutLocale === "/writing") return "writing_index";
  if (pathWithoutLocale.startsWith("/writing/")) return "article";
  if (pathWithoutLocale === "/recipes") return "recipes_index";
  if (pathWithoutLocale.startsWith("/recipes/")) return "recipe";
  if (pathWithoutLocale === "/contact") return "contact";
  if (pathWithoutLocale === "/about") return "about";
  if (pathWithoutLocale === "/privacy" || pathWithoutLocale === "/terms") {
    return "legal";
  }
  return "other";
}

export function cleanAnalyticsText(value: string, maximumLength = 100) {
  return value.replace(/\s+/g, " ").trim().slice(0, maximumLength);
}

function currentPageProperties(): AnalyticsProperties {
  if (typeof window === "undefined") return {};
  const pathname = window.location.pathname;

  return {
    source_page: pathname,
    page_type: pageType(pathname),
    site_language:
      pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en",
  };
}

const MEANINGFUL_TRIGGER_EVENTS = new Set<SeoAnalyticsEvent>([
  "blog_product_cta_click",
  "pillar_workbook_cta_click",
  "pillar_community_cta_click",
  "related_post_click",
  "community_cta_click",
  "circle_cta_click",
  "newsletter_cta_click",
  "newsletter_signup",
  "begin_checkout",
  "purchase",
  "generate_lead",
]);

/** Sends only controlled, non-null parameters and only after explicit consent. */
export function trackAnalyticsEvent(
  event: SeoAnalyticsEvent,
  properties: AnalyticsProperties,
): boolean {
  if (getAnalyticsConsent() !== "granted") return false;

  const safeProperties = sanitizeAnalyticsProperties(properties);
  const now = Date.now();
  const session = readAnalyticsSession(now);
  writeAnalyticsSession({ ...session, lastActivityAt: now });

  sendGAEvent("event", event, {
    ...currentPageProperties(),
    ...safeProperties,
  });

  if (MEANINGFUL_TRIGGER_EVENTS.has(event)) {
    trackMeaningfulEngagement(event);
  }
  return true;
}

export function trackMeaningfulEngagement(
  reason: string,
  properties: AnalyticsProperties = {},
) {
  if (getAnalyticsConsent() !== "granted") return false;

  const now = Date.now();
  const session = readAnalyticsSession(now);
  if (session.meaningfulEngagementSent) {
    writeAnalyticsSession({ ...session, lastActivityAt: now });
    return false;
  }

  writeAnalyticsSession({
    lastActivityAt: now,
    meaningfulEngagementSent: true,
  });
  sendGAEvent("event", "meaningful_engagement", {
    ...currentPageProperties(),
    engagement_reason: reason,
    ...sanitizeAnalyticsProperties(properties),
  });
  return true;
}

export function sanitizeAnalyticsProperties(properties: AnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(
      (entry) => entry[1] !== null && entry[1] !== undefined,
    ),
  ) as Record<string, AnalyticsPropertyValue>;
}

export function isInternalPageNavigation(
  currentPathname: string,
  previousPathname: string | null,
) {
  return Boolean(
    previousPathname &&
      previousPathname.startsWith("/") &&
      previousPathname !== currentPathname,
  );
}

export function getViewItemSessionKey(itemId: string) {
  return `${VIEW_ITEM_SESSION_KEY_PREFIX}:${encodeURIComponent(itemId)}`;
}

/**
 * Keep localhost interactions out of the production GA4 property and avoid
 * loading the third-party tag while Next.js development tooling is active.
 */
export function shouldLoadGoogleAnalytics(
  consent: AnalyticsConsent | null,
  environment: string | undefined,
): boolean {
  return consent === "granted" && environment === "production";
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
