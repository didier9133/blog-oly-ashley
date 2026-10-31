import { describe, expect, test } from "bun:test";
import {
  ANALYTICS_CONSENT_KEY,
  cleanAnalyticsText,
  getEffectiveAnalyticsConsent,
  getViewItemSessionKey,
  pageType,
  sanitizeAnalyticsProperties,
  shouldLoadGoogleAnalytics,
  trackAnalyticsEvent,
} from "../src/lib/analytics";

describe("GA4 analytics safeguards", () => {
  test("queues config before the first funnel event without waiting for the Google script", () => {
    const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const storage = new Map<string, string>([
      [ANALYTICS_CONSENT_KEY, "granted"],
    ]);
    const fakeWindow = {
      localStorage: { getItem: (key: string) => storage.get(key) ?? null },
      sessionStorage: { getItem: () => null, setItem: () => {} },
      location: { pathname: "/en/workbooks/rebuilding-reverence" },
      dataLayer: [] as unknown[][],
    };
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: fakeWindow,
    });
    try {
      expect(
        trackAnalyticsEvent("begin_checkout", {
          checkout_step: "form_started",
        }),
      ).toBe(true);
      const commands = fakeWindow.dataLayer.map((command) => command[0]);
      expect(commands.slice(0, 4)).toEqual([
        "consent",
        "js",
        "config",
        "event",
      ]);
      expect(fakeWindow.dataLayer[3][1]).toBe("begin_checkout");
      storage.set(ANALYTICS_CONSENT_KEY, "denied");
      const count = fakeWindow.dataLayer.length;
      expect(
        trackAnalyticsEvent("checkout_error", { error_stage: "confirmation" }),
      ).toBe(false);
      expect(fakeWindow.dataLayer.length).toBe(count);
    } finally {
      if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow);
      else Reflect.deleteProperty(globalThis, "window");
    }
  });
  test("uses a site-specific consent preference key", () => {
    expect(ANALYTICS_CONSENT_KEY).toBe("adl_analytics_consent");
  });

  test("omits absent optional values from event payloads", () => {
    const payload = sanitizeAnalyticsProperties({
      article_slug: "example",
      primary_keyword: undefined,
      email: null,
      locale: "es",
    });
    expect(payload).toMatchObject({ article_slug: "example", locale: "es" });
    expect(Object.keys(payload).sort().join(",")).toBe("article_slug,locale");
  });

  test("loads the GA4 tag only after consent and only in production", () => {
    expect(shouldLoadGoogleAnalytics("granted", "production")).toBe(true);
    expect(shouldLoadGoogleAnalytics("granted", "development")).toBe(false);
    expect(shouldLoadGoogleAnalytics("denied", "production")).toBe(false);
    expect(shouldLoadGoogleAnalytics(null, "production")).toBe(false);
  });

  test("temporarily enables analytics when the consent UI is hidden", () => {
    expect(getEffectiveAnalyticsConsent(null, false)).toBe("granted");
    expect(getEffectiveAnalyticsConsent("denied", false)).toBe("granted");
    expect(getEffectiveAnalyticsConsent(null, true)).toBe(null);
    expect(getEffectiveAnalyticsConsent("denied", true)).toBe("denied");
  });

  test("classifies the main English and Spanish content paths", () => {
    expect(pageType("/en")).toBe("home");
    expect(pageType("/es/community")).toBe("community");
    expect(pageType("/en/workbooks/rebuilding-reverence")).toBe("workbook");
    expect(pageType("/es/writing/example")).toBe("article");
    expect(pageType("/en/contact")).toBe("contact");
  });

  test("normalizes labels before sending them to GA4", () => {
    expect(cleanAnalyticsText("  Read   more \n today  ")).toBe(
      "Read more today",
    );
    expect(cleanAnalyticsText("abcdefgh", 5)).toBe("abcde");
  });

  test("uses a versioned per-item key to deduplicate view_item per session", () => {
    expect(getViewItemSessionKey("rebuilding-reverence")).toBe(
      "adl_view_item:v1:rebuilding-reverence",
    );
  });
});
