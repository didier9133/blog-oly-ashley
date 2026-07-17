export const OFFER_OG_IMAGES = {
  "queer-and-called": {
    path: "/og-queer-and-called.jpeg",
    width: 1200,
    height: 630,
    contentType: "image/jpeg",
    alt: "Queer & Called — a 30-day journey back to your divine self",
  },
  "rebuilding-reverence": {
    path: "/og-rebuilding-reverence.jpeg",
    width: 1200,
    height: 630,
    contentType: "image/jpeg",
    alt: "Rebuilding Reverence — a 30-day return to wonder after the ruins of religion",
  },
  community: {
    path: "/og-the-in-between.jpeg",
    width: 1200,
    height: 630,
    contentType: "image/jpeg",
    alt: "The In-Between — a private community for honest conversation and shared reflection",
  },
  circle: {
    path: "/og-rebuilding-reverence-circle.jpeg",
    width: 1200,
    height: 630,
    contentType: "image/jpeg",
    alt: "The Rebuilding Reverence Circle — a live four-week group experience",
  },
} as const;

const SPANISH_WORKBOOK_OG_IMAGES = {
  "queer-and-called": {
    path: "/og-queer-and-called-es-v2.png",
    width: 1734,
    height: 907,
    contentType: "image/png",
    alt: "Queer & Called, un recorrido de 30 días para volver a ti",
  },
  "rebuilding-reverence": {
    path: "/og-rebuilding-reverence-es-v2.png",
    width: 1731,
    height: 909,
    contentType: "image/png",
    alt: "Rebuilding Reverence, un recorrido de 30 días para volver a lo sagrado",
  },
} as const;

const SPANISH_CIRCLE_OG_IMAGE = {
  path: "/og-rebuilding-reverence-circle-es-v3.png",
  width: 1731,
  height: 909,
  contentType: "image/png",
  alt: "The Rebuilding Reverence Circle, un proceso grupal en vivo de cuatro semanas para reconstruir la fe en compañía",
} as const;

export function getWorkbookOgImage(slug: string, locale: "en" | "es" = "en") {
  if (slug === "queer-and-called" || slug === "rebuilding-reverence") {
    return locale === "es"
      ? SPANISH_WORKBOOK_OG_IMAGES[slug]
      : OFFER_OG_IMAGES[slug];
  }

  return undefined;
}

export function getCircleOgImage(locale: string) {
  return locale === "es" ? SPANISH_CIRCLE_OG_IMAGE : OFFER_OG_IMAGES.circle;
}
