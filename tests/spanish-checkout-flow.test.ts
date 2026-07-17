import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const checkoutSource = readFileSync(
  new URL("../src/components/checkout.tsx", import.meta.url),
  "utf8",
);
const workbookDetailSource = readFileSync(
  new URL(
    "../src/app/[locale]/(public)/workbooks/[slug]/page.tsx",
    import.meta.url,
  ),
  "utf8",
);
const purchaseSource = readFileSync(
  new URL("../src/lib/checkout-purchases.ts", import.meta.url),
  "utf8",
);

describe("Spanish checkout delivery", () => {
  test("renders Stripe and names the purchased guide in the active language", () => {
    expect(checkoutSource).toContain('locale: language === "es" ? "es" : "en"');
    expect(workbookDetailSource).toContain("productName={bookTitle}");
  });

  test("delivers the Spanish Rebuilding Reverence guide after a Circle purchase", () => {
    expect(purchaseSource).toContain(
      "ebooks/1761430437440_Reconstruyendo_la_Reverencia.pdf",
    );
    expect(purchaseSource).toContain(
      'fileName: "Guía de Rebuilding Reverence"',
    );
    expect(purchaseSource).toContain(
      "const circleGuide = CIRCLE_GUIDE_BY_LOCALE[language]",
    );
  });
});
