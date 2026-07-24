import { describe, expect, test } from "bun:test";

import { getPublicNavigationItems } from "../src/lib/public-navigation";
import { readFileSync } from "node:fs";

const desktopNavSource = readFileSync(
  new URL("../src/components/public-items-nav-bar.tsx", import.meta.url),
  "utf8",
);
const mobileNavSource = readFileSync(
  new URL("../src/components/public-sidebar.tsx", import.meta.url),
  "utf8",
);
const navItemSource = readFileSync(
  new URL("../src/components/item-nav-bar.tsx", import.meta.url),
  "utf8",
);

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

  test("promotes the free guide without overcrowding the desktop navigation", () => {
    const items = getPublicNavigationItems("en");

    expect(items.some((item) => item.url === "/church-hurt-guide")).toBe(true);
    expect(desktopNavSource).toContain('item.url !== "/contact"');
    expect(desktopNavSource).toContain(
      'item.url === "/church-hurt-guide") return "church-hurt"',
    );
    expect(desktopNavSource.includes("featured=")).toBe(false);
    expect(navItemSource.includes("featured")).toBe(false);
    expect(mobileNavSource.includes('item.url !== "/contact"')).toBe(false);
  });
});
