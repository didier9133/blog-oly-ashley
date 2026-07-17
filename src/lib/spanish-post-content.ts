import { publicPostSlug } from "@/lib/post-slugs";
import { SPANISH_POST_CONTENT_A } from "@/lib/spanish-post-content-a";
import { SPANISH_POST_CONTENT_B } from "@/lib/spanish-post-content-b";

const SPANISH_POST_CONTENT: Record<string, string> = {
  ...SPANISH_POST_CONTENT_A,
  ...SPANISH_POST_CONTENT_B,
};

export const SPANISH_POST_PENDING_HTML =
  "<p>Estamos preparando la versión en español de este ensayo.</p>";

/**
 * Returns the editorially reviewed Spanish body for a published article.
 *
 * The database remains the fallback so future articles can be published
 * without a deploy, while the current catalog uses versioned transcreation.
 */
export function getSpanishPostContent(
  ...slugs: (string | null | undefined)[]
): string | undefined {
  for (const slug of slugs) {
    if (!slug) continue;
    const content = SPANISH_POST_CONTENT[publicPostSlug(slug)];
    if (content) return content;
  }

  return undefined;
}

/** Never substitute English when a future Spanish article body is unfinished. */
export function resolveSpanishPostContent(
  englishSlug: string,
  databaseContent: string | null | undefined,
): string {
  const editorialContent = getSpanishPostContent(englishSlug);
  if (editorialContent) return editorialContent;

  const storedContent = databaseContent?.trim();
  return storedContent || SPANISH_POST_PENDING_HTML;
}
