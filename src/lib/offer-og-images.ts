export const OFFER_OG_IMAGES = {
  "queer-and-called": {
    path: "/og-queer-and-called.png",
    width: 1731,
    height: 909,
    alt: "Queer & Called — a 30-day journey back to your divine self",
  },
  "rebuilding-reverence": {
    path: "/og-rebuilding-reverence.png",
    width: 1731,
    height: 909,
    alt: "Rebuilding Reverence — a 30-day return to wonder after the ruins of religion",
  },
  community: {
    path: "/og-the-in-between.png",
    width: 1731,
    height: 909,
    alt: "The In-Between — a private community for honest conversation and shared reflection",
  },
  circle: {
    path: "/og-rebuilding-reverence-circle.png",
    width: 1200,
    height: 630,
    alt: "The Rebuilding Reverence Circle — a live four-week group experience",
  },
} as const;

export function getWorkbookOgImage(slug: string) {
  if (slug === "queer-and-called" || slug === "rebuilding-reverence") {
    return OFFER_OG_IMAGES[slug];
  }

  return undefined;
}
