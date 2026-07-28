import { describe, expect, test } from "bun:test";

import { LEGACY_UNPREFIXED_LOCALE_REDIRECTS } from "../src/lib/legacy-locale-redirects";

const redirects = new Map(
  LEGACY_UNPREFIXED_LOCALE_REDIRECTS.map(({ source, destination }) => [
    source,
    destination,
  ]),
);

describe("legacy locale redirects", () => {
  test("permanently consolidates every indexable static English route", () => {
    const expectedRoutes = [
      ["", "/en"],
      ["/about", "/en/about"],
      ["/writing", "/en/writing"],
      ["/workbooks", "/en/workbooks"],
      ["/circle", "/en/circle"],
      ["/community", "/en/community"],
      ["/contact", "/en/contact"],
      ["/privacy", "/en/privacy"],
      ["/terms", "/en/terms"],
      [
        "/deconstructing-christianity",
        "/en/deconstructing-christianity",
      ],
      ["/church-hurt-guide", "/en/church-hurt-guide"],
    ] as const;

    for (const [path, destination] of expectedRoutes) {
      expect(redirects.get(path || "/")).toBe(destination);
    }
  });

  test("preserves nested public paths under the canonical English prefix", () => {
    expect(redirects.get("/writing/:slug*")).toBe(
      "/en/writing/:slug*",
    );
    expect(redirects.get("/workbooks/:path*")).toBe(
      "/en/workbooks/:path*",
    );
    expect(redirects.get("/circle/:path*")).toBe(
      "/en/circle/:path*",
    );
    expect(redirects.get("/community/:path*")).toBe(
      "/en/community/:path*",
    );
  });

  test("does not intercept localized, API, or private routes", () => {
    for (const source of redirects.keys()) {
      expect(source.startsWith("/en/")).toBe(false);
      expect(source.startsWith("/es/")).toBe(false);
      expect(source.startsWith("/api/")).toBe(false);
      expect(source.startsWith("/dashboard")).toBe(false);
    }
  });
});
