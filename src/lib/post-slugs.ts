export type PostSlugRedirect = {
  locale: "en" | "es";
  from: string;
  to: string;
};

/**
 * Public replacements for stored or previously published slugs.
 *
 * Keep these aliases indefinitely so existing links retain their value.
 */
export const POST_SLUG_REDIRECTS: readonly PostSlugRedirect[] = [
  {
    locale: "en",
    from: "seeking-first-again",
    to: "finding-spiritual-balance-between-faith-and-material-life",
  },
  {
    locale: "es",
    from: "buscando-primero-otra-vez",
    to: "equilibrio-espiritual-entre-fe-y-vida-material",
  },
  {
    locale: "en",
    from: "missing-what-never-was",
    to: "grief-after-miscarriage-and-the-life-you-imagined",
  },
  {
    locale: "es",
    from: "extra-ando-lo-que-nunca-fue",
    to: "duelo-gestacional-por-la-vida-que-imaginaste",
  },
  {
    locale: "es",
    from: "extranando-lo-que-nunca-fue",
    to: "duelo-gestacional-por-la-vida-que-imaginaste",
  },
  {
    locale: "en",
    from: "the-god-who-doesn-t-play-by-our-rules",
    to: "gay-christian-and-gods-unconditional-love",
  },
  {
    locale: "en",
    from: "the-god-who-doesnt-play-by-our-rules",
    to: "gay-christian-and-gods-unconditional-love",
  },
  {
    locale: "es",
    from: "el-dios-que-no-juega-seg-n-nuestras-reglas",
    to: "fe-lgbtq-y-amor-incondicional-de-dios",
  },
  {
    locale: "es",
    from: "el-dios-que-no-juega-segun-nuestras-reglas",
    to: "fe-lgbtq-y-amor-incondicional-de-dios",
  },
  {
    locale: "en",
    from: "don-t-take-advice-from-someone-whose-life-you-don-",
    to: "dont-take-advice-from-someone-whose-life-you-dont-want",
  },
  {
    locale: "es",
    from: "no-todo-consejo-viene-envuelto-en-la-vida-que-t-su",
    to: "no-todo-consejo-viene-envuelto-en-la-vida-que-tu-suenas",
  },
  {
    locale: "es",
    from: "qu-significa-realmente-pertenecer",
    to: "que-significa-realmente-pertenecer",
  },
  {
    locale: "en",
    from: "deconstruction-and-beyond-a-story-of-loss-and-rebi",
    to: "how-to-rebuild-faith-after-deconstruction",
  },
  {
    locale: "en",
    from: "deconstruction-and-beyond-a-story-of-loss-and-rebirth",
    to: "how-to-rebuild-faith-after-deconstruction",
  },
  {
    locale: "es",
    from: "deconstrucci-n-y-m-s-all-una-historia-de-p-rdida-y",
    to: "como-reconstruir-la-fe-despues-de-la-deconstruccion",
  },
  {
    locale: "es",
    from: "deconstruccion-y-mas-alla-una-historia-de-perdida-y-renacimiento",
    to: "como-reconstruir-la-fe-despues-de-la-deconstruccion",
  },
] as const;

const publicSlugByLegacySlug = new Map(
  POST_SLUG_REDIRECTS.map(({ from, to }) => [from, to]),
);
const legacySlugsByPublicSlug = new Map<string, string[]>();

for (const { from, to } of POST_SLUG_REDIRECTS) {
  const legacySlugs = legacySlugsByPublicSlug.get(to) ?? [];
  legacySlugs.push(from);
  legacySlugsByPublicSlug.set(to, legacySlugs);
}

export function publicPostSlug(storedSlug: string): string {
  return publicSlugByLegacySlug.get(storedSlug) ?? storedSlug;
}

/** Supports the canonical URL, every legacy alias, and future database cleanup. */
export function postSlugCandidates(publicOrStoredSlug: string): string[] {
  const publicSlug =
    publicSlugByLegacySlug.get(publicOrStoredSlug) ?? publicOrStoredSlug;
  return [
    publicSlug,
    ...(legacySlugsByPublicSlug.get(publicSlug) ?? []),
  ];
}

/** Generate readable, ASCII-only slugs without cutting the final word. */
export function slugifyPostTitle(title: string, maxLength = 72): string {
  const slug = title
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[‘’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (slug.length <= maxLength) return slug;

  const truncated = slug.slice(0, maxLength + 1);
  const lastSeparator = truncated.lastIndexOf("-");
  return (lastSeparator > 0 ? truncated.slice(0, lastSeparator) : truncated)
    .replace(/-+$/g, "");
}
