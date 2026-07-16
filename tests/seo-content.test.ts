import { describe, expect, test } from "bun:test";
import {
  localizedAlternates,
  singleLocaleAlternates,
  transactionalRobots,
} from "../src/lib/seo";
import {
  DECONSTRUCTING_CHRISTIANITY_FAQS,
  DECONSTRUCTING_CHRISTIANITY_PATH,
  DECONSTRUCTING_CHRISTIANITY_TITLE,
} from "../src/lib/deconstructing-christianity";
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

  test("keeps the English-only pillar canonical free of a false Spanish hreflang", () => {
    const alternates = singleLocaleAlternates(
      "en",
      DECONSTRUCTING_CHRISTIANITY_PATH,
    );
    const languages = alternates.languages as Record<string, string>;

    expect(String(alternates.canonical).endsWith(
      "/en/deconstructing-christianity",
    )).toBe(true);
    expect(languages.en.endsWith("/en/deconstructing-christianity")).toBe(true);
    expect(languages.es).toBe(undefined);
    expect(languages["x-default"]).toBe(languages.en);
  });

  test("keeps pillar FAQ schema source content visible and answer-first", () => {
    expect(DECONSTRUCTING_CHRISTIANITY_TITLE).toContain(
      "Deconstructing Christianity",
    );
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS.length).toBe(8);
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS.every(
      (faq) => faq.question.endsWith("?") && faq.answer.length > 80,
    )).toBe(true);
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS[0]?.answer).toContain(
      "taking your own beliefs seriously",
    );
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS.at(-1)).toMatchObject({
      question: "What is The In-Between?",
    });
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
      "how-to-rebuild-faith-after-deconstruction",
    );
    expect(decision?.productCta).toBe("rebuilding-reverence");
    expect(decision?.primaryKeyword?.es).toBe(
      "cómo reconstruir la fe después de la deconstrucción",
    );
    expect(decision?.relatedGuide?.en?.href).toBe(
      "/deconstructing-christianity",
    );
    expect(decision?.relatedGuide?.es).toBe(undefined);
  });

  test("uses the approved keyword intent for the spiritual balance essay", () => {
    const decision = getPostSeoDecision(
      "finding-spiritual-balance-between-faith-and-material-life",
    );

    expect(decision?.productCta).toBe("rebuilding-reverence");
    expect(decision?.primaryKeyword?.en).toBe(
      "spiritual balance between faith and material life",
    );
    expect(decision?.seoTitle?.es).toContain(
      "Equilibrio espiritual entre fe y vida material",
    );
  });

  test("gives the LGBTQ+ faith essay an explicit bilingual H1 and SEO title", () => {
    const decision = getPostSeoDecision(
      "gay-christian-and-gods-unconditional-love",
    );

    expect(decision?.productCta).toBe("queer-and-called");
    expect(decision?.displayTitle).toMatchObject({
      en: "Gay, Christian, and Held by God’s Unconditional Love",
      es: "Fe LGBTQ+ y el amor incondicional de Dios",
    });
    expect(decision?.seoTitle?.en).toBe(
      "Gay Christian and God’s Unconditional Love | Ashley Leon",
    );
    expect(decision?.seoTitle?.es).toBe(
      "Fe LGBTQ+ y amor incondicional de Dios | Ashley Leon",
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
