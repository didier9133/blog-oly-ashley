import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import {
  getWorkbookContent,
  getWorkbookCoverImage,
  getWorkbookModifiedAt,
  type WorkbookContentSource,
} from "../src/lib/workbook-content";
import {
  getCircleOgImage,
  getWorkbookOgImage,
} from "../src/lib/offer-og-images";

const databaseBook = {
  slug_en: "rebuilding-reverence",
  title_en: "English database title",
  title_es: "Título antiguo",
  subtitle_en: "English database subtitle",
  subtitle_es: "Subtítulo antiguo",
  description_en: "English database description",
  description_es: "Descripción antigua",
  features_en: ["English database feature"],
  features_es: ["Función antigua"],
  format_en: "English database format",
  format_es: "Formato antiguo",
  language_en: "English database language",
  language_es: "Idioma antiguo",
  featured_review_en: "English database review",
  featured_review_es: "Reseña antigua",
} satisfies WorkbookContentSource;

describe("workbook editorial content", () => {
  test("keeps every English field backed by the database", () => {
    expect(getWorkbookContent(databaseBook, "en")).toMatchObject({
      title: databaseBook.title_en,
      subtitle: databaseBook.subtitle_en,
      description: databaseBook.description_en,
      features: databaseBook.features_en,
      format: databaseBook.format_en,
      language: databaseBook.language_en,
      featuredReview: databaseBook.featured_review_en,
    });
  });

  test("overrides Rebuilding Reverence with approved Spanish copy", () => {
    const content = getWorkbookContent(databaseBook, "es");

    expect(content.title).toBe("Rebuilding Reverence");
    expect(content.subtitle).toBe(
      "Un recorrido de 30 días para volver a lo sagrado después de cuestionar la fe que recibiste",
    );
    expect(
      content.description.startsWith(
        "¿Y si deconstruir tu fe no fuera solo alejarte de la religión",
      ),
    ).toBe(true);
    expect(content.features.length).toBe(5);
    expect(content.format).toBe("PDF digital");
    expect(content.language).toBe("Español");
    expect(content.featuredReview === databaseBook.featured_review_es).toBe(
      false,
    );
  });

  test("selects the approved Spanish covers without changing English artwork", () => {
    const rebuildingCover = {
      slug_en: "rebuilding-reverence",
      coverImage_en: "/rebuilding-en.jpeg",
      coverImage_es: "/old-rebuilding-es.jpeg",
    };
    const queerCover = {
      ...rebuildingCover,
      slug_en: "queer-and-called",
    };

    expect(getWorkbookCoverImage(rebuildingCover, "es")).toBe(
      "/rebuilding-reverence-es-v2.png",
    );
    expect(getWorkbookCoverImage(queerCover, "es")).toBe(
      "/queer-and-called-es-v2.png",
    );
    expect(getWorkbookCoverImage(rebuildingCover, "en")).toBe(
      rebuildingCover.coverImage_en,
    );
  });

  test("selects localized social images and keeps every approved asset on disk", () => {
    const spanishImages = [
      getWorkbookOgImage("rebuilding-reverence", "es"),
      getWorkbookOgImage("queer-and-called", "es"),
    ];
    const assetPaths = [
      "/rebuilding-reverence-es-v2.png",
      "/queer-and-called-es-v2.png",
      "/circle-checkout-es-v3.png",
      getCircleOgImage("es").path,
      ...spanishImages.map((image) => image?.path),
    ];

    expect(spanishImages[0]?.contentType).toBe("image/png");
    expect(spanishImages[1]?.alt).toContain("volver a ti");

    for (const assetPath of assetPaths) {
      expect(Boolean(assetPath)).toBe(true);
      expect(
        existsSync(new URL(`../public${assetPath}`, import.meta.url)),
      ).toBe(true);
    }
  });

  test("overrides Queer and Called while retaining Spanish DB copy for future guides", () => {
    const queerContent = getWorkbookContent(
      { ...databaseBook, slug_en: "queer-and-called" },
      "es",
    );
    const futureBook = {
      ...databaseBook,
      slug_en: "a-future-workbook",
    };

    expect(queerContent.title).toBe("Queer & Called");
    expect(queerContent.subtitle).toContain("sin tener que dividirte");
    expect(getWorkbookContent(futureBook, "es")).toMatchObject({
      title: futureBook.title_es,
      subtitle: futureBook.subtitle_es,
      description: futureBook.description_es,
      features: futureBook.features_es,
      format: futureBook.format_es,
      language: futureBook.language_es,
      featuredReview: futureBook.featured_review_es,
    });
  });

  test("uses safe Spanish fallbacks and an editorial last-modified date", () => {
    const futureBook = {
      ...databaseBook,
      slug_en: "a-future-workbook",
      subtitle_es: databaseBook.subtitle_en,
      description_es: "",
      features_es: databaseBook.features_en,
      format_es: databaseBook.format_en,
      language_es: databaseBook.language_en,
      featured_review_es: databaseBook.featured_review_en,
    };

    expect(getWorkbookContent(futureBook, "es")).toMatchObject({
      subtitle: "Una guía digital para acompañar tu proceso.",
      description:
        "Pronto compartiremos todos los detalles de esta guía en español.",
      features: [],
      format: "Formato digital",
      language: "Español",
      featuredReview: null,
    });
    expect(
      getWorkbookModifiedAt(
        new Date("2026-07-08T00:00:00.000Z"),
        "rebuilding-reverence",
        "es",
      ).toISOString(),
    ).toBe("2026-07-17T12:00:00.000Z");
  });
});
