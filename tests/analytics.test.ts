import { describe, expect, test } from "bun:test";
import {
  ANALYTICS_CONSENT_KEY,
  cleanAnalyticsText,
  getEffectiveAnalyticsConsent,
  getViewItemSessionKey,
  isInternalPageNavigation,
  pageType,
  sanitizeAnalyticsProperties,
  shouldLoadGoogleAnalytics,
} from "../src/lib/analytics";

describe("GA4 analytics safeguards", () => {
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
    expect(Object.keys(payload).sort().join(",")).toBe(
      "article_slug,locale",
    );
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

  test("only qualifies view_item after navigation from another internal page", () => {
    expect(
      isInternalPageNavigation(
        "/en/workbooks/rebuilding-reverence",
        "/en",
      ),
    ).toBe(true);
    expect(
      isInternalPageNavigation(
        "/en/workbooks/rebuilding-reverence",
        null,
      ),
    ).toBe(false);
    expect(
      isInternalPageNavigation(
        "/en/workbooks/rebuilding-reverence",
        "/en/workbooks/rebuilding-reverence",
      ),
    ).toBe(false);
  });

  test("uses a versioned per-item key to deduplicate view_item per session", () => {
    expect(getViewItemSessionKey("rebuilding-reverence")).toBe(
      "adl_view_item:v1:rebuilding-reverence",
    );
  });
});
