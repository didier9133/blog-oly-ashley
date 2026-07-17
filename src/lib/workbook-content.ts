import type { Book } from "@prisma/client";

export type WorkbookContentLocale = "en" | "es";

export type WorkbookCoverSource = Pick<
  Book,
  "slug_en" | "coverImage_en" | "coverImage_es"
>;

export type WorkbookContentSource = Pick<
  Book,
  | "slug_en"
  | "title_en"
  | "title_es"
  | "subtitle_en"
  | "subtitle_es"
  | "description_en"
  | "description_es"
  | "features_en"
  | "features_es"
  | "format_en"
  | "format_es"
  | "language_en"
  | "language_es"
  | "featured_review_en"
  | "featured_review_es"
>;

export interface WorkbookContent {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  format: string;
  language: string;
  featuredReview: string | null;
}

type ActiveWorkbookSlug = "rebuilding-reverence" | "queer-and-called";

const SPANISH_WORKBOOK_COVERS = {
  "rebuilding-reverence": "/rebuilding-reverence-es-v2.png",
  "queer-and-called": "/queer-and-called-es-v2.png",
} satisfies Record<ActiveWorkbookSlug, string>;

const SPANISH_WORKBOOK_EDITORIAL_MODIFIED_AT = {
  "rebuilding-reverence": "2026-07-17",
  "queer-and-called": "2026-07-17",
} satisfies Record<ActiveWorkbookSlug, string>;

const SPANISH_WORKBOOK_CONTENT = {
  "rebuilding-reverence": {
    title: "Rebuilding Reverence",
    subtitle:
      "Un recorrido de 30 días para volver a lo sagrado después de cuestionar la fe que recibiste",
    description:
      "¿Y si deconstruir tu fe no fuera solo alejarte de la religión, sino también volver a acercarte al asombro? Esta guía de 76 páginas te acompaña durante 30 días entre preguntas e incertidumbre para que reconstruyas tu relación con lo sagrado a tu manera. Reúne más de una década de búsqueda y práctica espiritual en una propuesta compasiva para explorar lo vivido, procesarlo y volver a confiar.",
    features: [
      "Claridad para atravesar la confusión espiritual y volver a conectar con lo que sí te sostiene",
      "Prácticas sencillas para acercarte al asombro sin obligarte a sentir nada",
      "Preguntas guiadas para escuchar y afinar tu brújula interior",
      "Rituales de cuidado para el agotamiento y las heridas que dejó la religión",
      "Acceso a una comunidad privada para recorrer este camino en compañía",
    ],
    format: "PDF digital",
    language: "Español",
    featuredReview:
      "Esta guía cambió mi manera de relacionarme con lo sagrado. Las prácticas diarias me ayudaron a encontrar una paz que no sabía que necesitaba. Gracias por crear un espacio tan honesto y cuidadoso para sanar.",
  },
  "queer-and-called": {
    title: "Queer & Called",
    subtitle:
      "Una invitación a recuperar tu voz, reimaginar tu fe y volver a ti sin tener que dividirte",
    description:
      "Esta guía es para quienes alguna vez sintieron que debían elegir entre su fe y su identidad. Durante 30 días te acompaña a recuperar tu voz, mirar tu historia con honestidad y volver a lo sagrado sin esconderte. Sus 76 páginas reúnen reflexiones y prácticas de integración. También incluye acceso permanente a una comunidad privada.",
    features: [
      "Un espacio para dejar de sentir que tienes que elegir entre tu fe y tu identidad",
      "Afirmaciones que te ayudan a recordar tu dignidad y tu valor",
      "Preguntas y ejercicios de escritura para nombrar con libertad todo lo que sientes",
      "Prácticas espirituales que honran todo lo que eres",
      "Acceso a una comunidad privada donde podrás compartir tu proceso con personas que te comprenden y valoran tal como eres",
    ],
    format: "PDF digital",
    language: "Español",
    featuredReview:
      "Esta guía me ayudó a entender que no tengo que esconder quién soy para acercarme a la fe. Es cálida, afirmativa y profundamente necesaria.",
  },
} satisfies Record<ActiveWorkbookSlug, WorkbookContent>;

function databaseContent(
  book: WorkbookContentSource,
  locale: WorkbookContentLocale,
): WorkbookContent {
  if (locale === "en") {
    return {
      title: book.title_en,
      subtitle: book.subtitle_en,
      description: book.description_en,
      features: book.features_en,
      format: book.format_en,
      language: book.language_en,
      featuredReview: book.featured_review_en,
    };
  }

  const localizedText = (
    spanish: string,
    english: string,
    fallback: string,
  ) => {
    const value = spanish.trim();
    if (!value || value.toLocaleLowerCase() === english.trim().toLocaleLowerCase()) {
      return fallback;
    }
    return value;
  };
  const spanishFeatures = book.features_es
    .map((feature) => feature.trim())
    .filter(Boolean);
  const featuresMatchEnglish =
    JSON.stringify(spanishFeatures.map((feature) => feature.toLocaleLowerCase())) ===
    JSON.stringify(
      book.features_en
        .map((feature) => feature.trim().toLocaleLowerCase())
        .filter(Boolean),
    );

  return {
    title: book.title_es.trim() || book.title_en,
    subtitle: localizedText(
      book.subtitle_es,
      book.subtitle_en,
      "Una guía digital para acompañar tu proceso.",
    ),
    description: localizedText(
      book.description_es,
      book.description_en,
      "Pronto compartiremos todos los detalles de esta guía en español.",
    ),
    features: featuresMatchEnglish ? [] : spanishFeatures,
    format: localizedText(book.format_es, book.format_en, "Formato digital"),
    language: localizedText(book.language_es, book.language_en, "Español"),
    featuredReview:
      book.featured_review_es &&
      book.featured_review_es.trim().toLocaleLowerCase() !==
        book.featured_review_en?.trim().toLocaleLowerCase()
        ? book.featured_review_es.trim()
        : null,
  };
}

function isActiveWorkbookSlug(slug: string): slug is ActiveWorkbookSlug {
  return Object.prototype.hasOwnProperty.call(SPANISH_WORKBOOK_CONTENT, slug);
}

/**
 * Returns editorially approved Spanish copy for active guides while keeping
 * English and any future, uncurated Spanish guides backed by the database.
 */
export function getWorkbookContent(
  book: WorkbookContentSource,
  locale: WorkbookContentLocale,
): WorkbookContent {
  if (locale === "es" && isActiveWorkbookSlug(book.slug_en)) {
    const content = SPANISH_WORKBOOK_CONTENT[book.slug_en];

    return { ...content, features: [...content.features] };
  }

  return databaseContent(book, locale);
}

/**
 * Keeps the approved Spanish cover artwork versioned alongside the site while
 * preserving the database-backed artwork for English and future guides.
 */
export function getWorkbookCoverImage(
  book: WorkbookCoverSource,
  locale: WorkbookContentLocale,
): string {
  if (locale === "es" && isActiveWorkbookSlug(book.slug_en)) {
    return SPANISH_WORKBOOK_COVERS[book.slug_en];
  }

  return locale === "en" ? book.coverImage_en : book.coverImage_es;
}

/** Reflect code-owned Spanish editorial revisions in sitemap last-modified dates. */
export function getWorkbookModifiedAt(
  fallback: Date,
  englishSlug: string,
  locale: WorkbookContentLocale,
): Date {
  if (locale !== "es" || !isActiveWorkbookSlug(englishSlug)) {
    return fallback;
  }

  const editorialDate = new Date(
    `${SPANISH_WORKBOOK_EDITORIAL_MODIFIED_AT[englishSlug]}T12:00:00.000Z`,
  );

  return fallback > editorialDate ? fallback : editorialDate;
}
