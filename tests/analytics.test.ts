import { describe, expect, test } from "bun:test";
import {
  ANALYTICS_CONSENT_KEY,
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
});
