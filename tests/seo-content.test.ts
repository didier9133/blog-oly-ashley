import { describe, expect, test } from "bun:test";
import { localizedAlternates, transactionalRobots } from "../src/lib/seo";
import {
  getPostSeoDecision,
  getWorkbookSeo,
  PRODUCT_CTAS,
  SPANISH_COMMERCIAL_CLUSTERS,
  SPANISH_INFORMATIONAL_ACQUISITION,
} from "../src/lib/seo-content";

describe("bilingual SEO configuration", () => {
  test("creates self-referencing canonicals and reciprocal hreflang", () => {
    const alternates = localizedAlternates("es", {
      en: "/workbooks/rebuilding-reverence",
      es: "/workbooks/reconstruyendo-la-reverencia",
    });

    expect(String(alternates.canonical).endsWith(
      "/es/workbooks/reconstruyendo-la-reverencia",
    )).toBe(true);
    const languages = alternates.languages as Record<string, string>;
    expect(languages.en.endsWith("/en/workbooks/rebuilding-reverence")).toBe(true);
    expect(languages.es.endsWith(
      "/es/workbooks/reconstruyendo-la-reverencia",
    )).toBe(true);
    expect(languages["x-default"].endsWith(
      "/en/workbooks/rebuilding-reverence",
    )).toBe(true);
  });

  test("uses distinct English and Spanish commercial metadata", () => {
    const english = getWorkbookSeo("en", "rebuilding-reverence");
    const spanish = getWorkbookSeo("es", "rebuilding-reverence");

    expect(english?.title).toContain("Religious Trauma Workbook");
    expect(english?.description.toLowerCase()).toContain(
      "religious trauma workbook",
    );
    expect(english?.intentSection?.body.toLowerCase()).toContain(
      "religious trauma workbook",
    );
    expect(spanish?.title).toContain("Guía para reconstruir la fe");
    expect(spanish?.intentSection?.title).toBe(
      "Una guía para acompañar el daño religioso con reflexión y cuidado",
    );
    expect(
      spanish?.intentSection?.title.toLowerCase().includes("libro de trabajo"),
    ).toBe(false);
  });

  test("keeps Spanish acquisition informational and commercial language hypothetical", () => {
    expect(SPANISH_INFORMATIONAL_ACQUISITION[0].primary).toBe(
      "qué es la deconstrucción de la fe",
    );
    expect(SPANISH_COMMERCIAL_CLUSTERS["rebuilding-reverence"]).toMatchObject({
      status: "hypothesis",
      role: "product-description-and-conversion",
    });
  });

  test("maps the priority article to one deterministic CTA", () => {
    const decision = getPostSeoDecision(
      "deconstruction-and-beyond-a-story-of-loss-and-rebirth",
    );
    expect(decision?.productCta).toBe("rebuilding-reverence");
    expect(decision?.primaryKeyword?.es).toBe(
      "cómo reconstruir la fe después de la deconstrucción",
    );
  });

  test("never leaks English CTA destinations into Spanish articles", () => {
    expect(PRODUCT_CTAS.es["rebuilding-reverence"].href).toBe(
      "/workbooks/reconstruyendo-la-reverencia",
    );
    expect(PRODUCT_CTAS.es["queer-and-called"].href).toBe(
      "/workbooks/queer-y-llamados",
    );
  });

  test("keeps non-indexable utility pages followable", () => {
    expect(transactionalRobots).toMatchObject({ index: false, follow: true });
  });
});
