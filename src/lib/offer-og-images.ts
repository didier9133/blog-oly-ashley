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

export function getWorkbookOgImage(slug: string) {
  if (slug === "queer-and-called" || slug === "rebuilding-reverence") {
    return OFFER_OG_IMAGES[slug];
  }

  return undefined;
}
