import { describe, expect, test } from "bun:test";

import { prepareArticleHtml } from "../src/lib/article-semantics";

describe("article semantic HTML", () => {
  test("sanitizes CMS HTML and promotes visual subtitles to real headings", () => {
    const html = prepareArticleHtml(
      '<p><strong>A Conditional God Feels Familiar</strong></p><p>Body copy.</p><script>alert("x")</script>',
      {
        promote: [
          {
            sourceTag: "p",
            sourceText: "A Conditional God Feels Familiar",
          },
        ],
      },
    );

    expect(html).toContain("<h2>A Conditional God Feels Familiar</h2>");
    expect(html).toContain("<p>Body copy.</p>");
    expect(html.includes("script")).toBe(false);
  });

  test("removes duplicate titles and inserts section headings idempotently", () => {
    const rules = {
      removeParagraphs: ["What Does Belonging Really Mean?"],
      insertBefore: [
        {
          beforeText: "And yet—there’s another part of me.",
          headingText: "Rewriting What Belonging Means",
        },
      ],
    } as const;
    const source =
      "<p><strong>What Does Belonging Really Mean?</strong></p>" +
      "<p>And yet—there’s another part of me.</p>";

    const once = prepareArticleHtml(source, rules);
    const twice = prepareArticleHtml(once, rules);

    expect(once.includes("<strong>What Does Belonging Really Mean?")).toBe(
      false,
    );
    expect(once).toContain("<h2>Rewriting What Belonging Means</h2>");
    expect(twice.match(/Rewriting What Belonging Means/g)?.length).toBe(1);
  });
});
