import { describe, expect, test } from "bun:test";

import {
  POST_SLUG_REDIRECTS,
  postSlugCandidates,
  publicPostSlug,
} from "../src/lib/post-slugs";

describe("post slug migrations", () => {
  test("publishes the selected essays under the approved keyword-aligned slugs", () => {
    expect(publicPostSlug("seeking-first-again")).toBe(
      "finding-spiritual-balance-between-faith-and-material-life",
    );
    expect(publicPostSlug("buscando-primero-otra-vez")).toBe(
      "equilibrio-espiritual-entre-fe-y-vida-material",
    );
    expect(publicPostSlug("missing-what-never-was")).toBe(
      "grief-after-miscarriage-and-the-life-you-imagined",
    );
    expect(publicPostSlug("extra-ando-lo-que-nunca-fue")).toBe(
      "duelo-gestacional-por-la-vida-que-imaginaste",
    );
    expect(
      publicPostSlug("the-god-who-doesn-t-play-by-our-rules"),
    ).toBe("gay-christian-and-gods-unconditional-love");
    expect(
      publicPostSlug("el-dios-que-no-juega-seg-n-nuestras-reglas"),
    ).toBe("fe-lgbtq-y-amor-incondicional-de-dios");
  });

  test("keeps the approved belonging and advice slugs unchanged", () => {
    expect(publicPostSlug("what-does-belonging-really-mean")).toBe(
      "what-does-belonging-really-mean",
    );
    expect(publicPostSlug("qu-significa-realmente-pertenecer")).toBe(
      "que-significa-realmente-pertenecer",
    );
    expect(
      publicPostSlug(
        "don-t-take-advice-from-someone-whose-life-you-don-",
      ),
    ).toBe("dont-take-advice-from-someone-whose-life-you-dont-want");
    expect(
      publicPostSlug(
        "no-todo-consejo-viene-envuelto-en-la-vida-que-t-su",
      ),
    ).toBe(
      "no-todo-consejo-viene-envuelto-en-la-vida-que-tu-suenas",
    );
  });

  test("publishes the rebuilding article under keyword-aligned bilingual slugs", () => {
    expect(
      publicPostSlug(
        "deconstruction-and-beyond-a-story-of-loss-and-rebi",
      ),
    ).toBe("how-to-rebuild-faith-after-deconstruction");
    expect(
      publicPostSlug(
        "deconstrucci-n-y-m-s-all-una-historia-de-p-rdida-y",
      ),
    ).toBe("como-reconstruir-la-fe-despues-de-la-deconstruccion");
  });

  test("keeps every previously published article URL as a permanent redirect alias", () => {
    expect(
      POST_SLUG_REDIRECTS.some(
        ({ locale, from, to }) =>
          locale === "en" &&
          from === "deconstruction-and-beyond-a-story-of-loss-and-rebirth" &&
          to === "how-to-rebuild-faith-after-deconstruction",
      ),
    ).toBe(true);
    expect(
      POST_SLUG_REDIRECTS.some(
        ({ locale, from, to }) =>
          locale === "es" &&
          from ===
            "deconstruccion-y-mas-alla-una-historia-de-perdida-y-renacimiento" &&
          to === "como-reconstruir-la-fe-despues-de-la-deconstruccion",
      ),
    ).toBe(true);
  });

  test("resolves the canonical URL against all possible database slug states", () => {
    expect(
      JSON.stringify(
        postSlugCandidates("how-to-rebuild-faith-after-deconstruction"),
      ),
    ).toBe(
      JSON.stringify([
        "how-to-rebuild-faith-after-deconstruction",
        "deconstruction-and-beyond-a-story-of-loss-and-rebi",
        "deconstruction-and-beyond-a-story-of-loss-and-rebirth",
      ]),
    );
  });

  test("resolves every prior miscarriage and LGBTQ+ URL without redirect chains", () => {
    expect(
      JSON.stringify(
        postSlugCandidates(
          "duelo-gestacional-por-la-vida-que-imaginaste",
        ),
      ),
    ).toBe(
      JSON.stringify([
        "duelo-gestacional-por-la-vida-que-imaginaste",
        "extra-ando-lo-que-nunca-fue",
        "extranando-lo-que-nunca-fue",
      ]),
    );
    expect(
      JSON.stringify(
        postSlugCandidates(
          "gay-christian-and-gods-unconditional-love",
        ),
      ),
    ).toBe(
      JSON.stringify([
        "gay-christian-and-gods-unconditional-love",
        "the-god-who-doesn-t-play-by-our-rules",
        "the-god-who-doesnt-play-by-our-rules",
      ]),
    );
  });
});
