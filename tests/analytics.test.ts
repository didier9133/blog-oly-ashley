import { describe, expect, test } from "bun:test";
import {
  ANALYTICS_CONSENT_KEY,
  sanitizeAnalyticsProperties,
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
});
