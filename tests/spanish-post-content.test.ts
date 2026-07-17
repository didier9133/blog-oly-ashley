import { describe, expect, test } from "bun:test";

import {
  getSpanishPostContent,
  resolveSpanishPostContent,
} from "../src/lib/spanish-post-content";

const publishedLegacySlugs = [
  "don-t-take-advice-from-someone-whose-life-you-don-",
  "the-god-who-doesn-t-play-by-our-rules",
  "what-does-belonging-really-mean",
  "deconstruction-and-beyond-a-story-of-loss-and-rebi",
  "missing-what-never-was",
  "seeking-first-again",
] as const;

describe("Spanish article transcreation", () => {
  test("covers every published essay, including legacy database slugs", () => {
    for (const slug of publishedLegacySlugs) {
      const content = getSpanishPostContent(slug);
      expect(typeof content === "string").toBe(true);
      expect((content?.length ?? 0) > 700).toBe(true);
    }
  });

  test("uses clean semantic HTML without known literal translations", () => {
    const corpus = publishedLegacySlugs
      .map((slug) => getSpanishPostContent(slug) ?? "")
      .join("\n");

    expect(corpus.includes("<h2>")).toBe(true);
    expect(corpus.includes("<p></p>")).toBe(false);
    expect(corpus.includes("medio locxs")).toBe(false);
    expect(corpus.includes("sentada con la tensión")).toBe(false);
    expect(corpus.includes("las mesas se han volteado")).toBe(false);
    expect(corpus.includes("vida material apenas si era registrada")).toBe(
      false,
    );
    expect(corpus.includes("desde adentro hacia afuera")).toBe(false);
  });

  test("never falls back to English when a future Spanish body is empty", () => {
    expect(resolveSpanishPostContent("future-post", "")).toContain(
      "Estamos preparando la versión en español",
    );
  });
});
