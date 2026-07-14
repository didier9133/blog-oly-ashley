import { describe, expect, test } from "bun:test";

import { getPublicNavigationItems } from "../src/lib/public-navigation";

describe("public navigation", () => {
  test("uses the English pillar in place of Home", () => {
    const items = getPublicNavigationItems("en");

    expect(items[0]?.url).toBe("/deconstructing-christianity");
    expect(items.some((item) => item.url === "/")).toBe(false);
  });

  test("keeps the Spanish navigation on Home", () => {
    const items = getPublicNavigationItems("es");

    expect(items[0]?.url).toBe("/");
    expect(
      items.some((item) => item.url === "/deconstructing-christianity"),
    ).toBe(false);
  });
});
