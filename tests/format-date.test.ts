import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { formatDate } from "../src/lib/format-date";

const newsletterPageSource = readFileSync(
  new URL(
    "../src/app/[locale]/(auth)/dashboard/newsletter/page.tsx",
    import.meta.url,
  ),
  "utf8",
);
const newsletterTableSource = readFileSync(
  new URL(
    "../src/app/[locale]/(auth)/dashboard/newsletter/newsletter-table.tsx",
    import.meta.url,
  ),
  "utf8",
);
const newsletterActionSource = readFileSync(
  new URL(
    "../src/app/[locale]/(auth)/dashboard/newsletter/actions.ts",
    import.meta.url,
  ),
  "utf8",
);

describe("formatDate", () => {
  const date = new Date("2026-07-17T23:30:00-04:00");

  test("uses the requested locale", () => {
    expect(formatDate(date, "es")).toBe("18/7/2026");
    expect(formatDate(date, "en")).toBe("7/18/2026");
  });

  test("uses UTC so server and client time zones cannot change the day", () => {
    expect(formatDate(date, "es")).toBe(
      formatDate("2026-07-18T03:30:00.000Z", "es"),
    );
  });

  test("formats newsletter dates on the server before crossing into the client", () => {
    expect(newsletterPageSource).toContain(
      "createdAtLabel: formatDate(row.createdAt, locale)",
    );
    expect(newsletterTableSource).toContain("{r.createdAtLabel}");
    expect(newsletterTableSource.includes("formatDate(r.createdAt")).toBe(false);
  });

  test("keeps the dashboard mutation isolated from email delivery actions", () => {
    expect(newsletterActionSource).toContain("prisma.newsletterSignup.update");
    expect(
      newsletterActionSource.includes("@/app/[locale]/actions/newsletter"),
    ).toBe(false);
  });
});
