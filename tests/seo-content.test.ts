import { describe, expect, test } from "bun:test";
import {
  localizedAlternates,
  localizedOpenGraph,
  transactionalRobots,
} from "../src/lib/seo";
import { configuredNumber } from "../src/lib/circle-config";
import {
  DECONSTRUCTING_CHRISTIANITY_CONTENT,
  DECONSTRUCTING_CHRISTIANITY_FAQS,
  DECONSTRUCTING_CHRISTIANITY_FAQS_ES,
  DECONSTRUCTING_CHRISTIANITY_PATH,
  DECONSTRUCTING_CHRISTIANITY_TITLE,
} from "../src/lib/deconstructing-christianity";
import {
  getPostSeoDecision,
  getPostModifiedAt,
  getWorkbookSeo,
  POST_SEO_DECISIONS,
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

    expect(
      String(alternates.canonical).endsWith(
        "/es/workbooks/reconstruyendo-la-reverencia",
      ),
    ).toBe(true);
    const languages = alternates.languages as Record<string, string>;
    expect(languages.en.endsWith("/en/workbooks/rebuilding-reverence")).toBe(
      true,
    );
    expect(
      languages.es.endsWith("/es/workbooks/reconstruyendo-la-reverencia"),
    ).toBe(true);
    expect(
      languages["x-default"].endsWith("/en/workbooks/rebuilding-reverence"),
    ).toBe(true);
  });

  test("keeps social locale metadata and zero-capacity Circle settings exact", () => {
    expect(localizedOpenGraph("es")).toMatchObject({
      locale: "es_ES",
      alternateLocale: ["en_US"],
      siteName: "Ashley Leon",
    });
    expect(configuredNumber("0", 10)).toBe(0);
    expect(configuredNumber("", 10)).toBe(10);
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
      "Una guía para comprender el daño religioso con reflexión y cuidado",
    );
    expect(
      spanish?.intentSection?.title.toLowerCase().includes("libro de trabajo"),
    ).toBe(false);
  });

  test("publishes reciprocal English and Spanish alternates for the pillar", () => {
    const alternates = localizedAlternates("en", {
      en: DECONSTRUCTING_CHRISTIANITY_PATH,
      es: DECONSTRUCTING_CHRISTIANITY_PATH,
    });
    const languages = alternates.languages as Record<string, string>;

    expect(
      String(alternates.canonical).endsWith("/en/deconstructing-christianity"),
    ).toBe(true);
    expect(languages.en.endsWith("/en/deconstructing-christianity")).toBe(true);
    expect(languages.es.endsWith("/es/deconstructing-christianity")).toBe(true);
    expect(languages["x-default"]).toBe(languages.en);
  });

  test("keeps pillar FAQ schema source content visible and answer-first", () => {
    expect(DECONSTRUCTING_CHRISTIANITY_TITLE).toContain(
      "Deconstructing Christianity",
    );
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS.length).toBe(8);
    expect(
      DECONSTRUCTING_CHRISTIANITY_FAQS.every(
        (faq) => faq.question.endsWith("?") && faq.answer.length > 80,
      ),
    ).toBe(true);
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS[0]?.answer).toContain(
      "taking your own beliefs seriously",
    );
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS.at(-1)).toMatchObject({
      question: "What is The In-Between?",
    });
  });

  test("keeps the Spanish pillar FAQ idiomatic and complete", () => {
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS_ES.length).toBe(8);
    expect(
      DECONSTRUCTING_CHRISTIANITY_FAQS_ES.every(
        (faq) =>
          faq.question.startsWith("¿") &&
          faq.question.endsWith("?") &&
          faq.answer.length > 80,
      ),
    ).toBe(true);
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS_ES[0]?.answer).toContain(
      "mirar con honestidad",
    );
    expect(DECONSTRUCTING_CHRISTIANITY_FAQS_ES.at(-1)).toMatchObject({
      question: "¿Qué es The In-Between?",
    });
    expect(
      DECONSTRUCTING_CHRISTIANITY_FAQS_ES.some((faq) =>
        faq.answer.includes("el falso binario es la herida"),
      ),
    ).toBe(false);
    expect(DECONSTRUCTING_CHRISTIANITY_CONTENT.es.workbookCta.href).toBe(
      "/workbooks/reconstruyendo-la-reverencia",
    );
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
    expect(decision?.relatedGuide?.es).toMatchObject({
      href: "/deconstructing-christianity",
      title: "¿Qué significa deconstruir el cristianismo?",
    });
    expect(decision?.displayTitle?.en).toContain(
      "How to Rebuild Faith After Deconstruction",
    );
    expect(decision?.semanticRules?.en?.promote?.length).toBe(8);
    expect(decision?.semanticRules?.es?.promote?.length).toBe(8);
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
    expect(decision?.displayTitle?.en).toContain("Spiritual Balance");
    expect(decision?.semanticRules?.en?.insertBefore?.length).toBe(3);
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
    expect(decision?.semanticRules?.en?.promote?.length).toBe(5);
    expect(decision?.semanticRules?.es?.promote?.length).toBe(5);
  });

  test("gives grief, belonging, and advice handcrafted bilingual metadata", () => {
    const grief = getPostSeoDecision(
      "grief-after-miscarriage-and-the-life-you-imagined",
    );
    const belonging = getPostSeoDecision("que-significa-realmente-pertenecer");
    const advice = getPostSeoDecision(
      "dont-take-advice-from-someone-whose-life-you-dont-want",
    );

    expect(grief?.displayTitle?.es).toContain("duelo gestacional");
    expect(grief?.description?.en).toContain("grief after miscarriage");
    expect(grief?.semanticRules?.en?.insertBefore?.length).toBe(3);
    expect(grief?.semanticRules?.es?.insertBefore?.length).toBe(3);
    expect(belonging?.displayTitle?.es?.startsWith("¿")).toBe(true);
    expect(belonging?.semanticRules?.en?.removeParagraphs).toContain(
      "What Does Belonging Really Mean?",
    );
    expect(advice?.seoTitle?.en).toBe(
      "Don’t Take Advice From Someone Whose Life You Don’t Want",
    );
    expect(advice?.description?.es).toContain("discernimiento");
  });

  test("keeps curated titles and descriptions concise", () => {
    const decisions = new Set(Object.values(POST_SEO_DECISIONS));

    for (const decision of decisions) {
      for (const title of Object.values(decision.seoTitle ?? {})) {
        expect(title.length <= 65).toBe(true);
      }
      for (const description of Object.values(decision.description ?? {})) {
        expect(description.length <= 160).toBe(true);
      }
    }
  });

  test("uses the editorial revision date for updated essay metadata", () => {
    expect(
      getPostModifiedAt(
        new Date("2025-01-01T00:00:00.000Z"),
        "what-does-belonging-really-mean",
      ).toISOString(),
    ).toBe("2026-07-17T12:00:00.000Z");
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
