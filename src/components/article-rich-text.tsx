import "server-only";

import DOMPurify from "isomorphic-dompurify";

interface ArticleRichTextProps {
  content: string | null | undefined;
}

/**
 * Render article copy in the initial server response so search engines and
 * answer engines can read the complete essay without executing JavaScript.
 */
export function ArticleRichText({ content }: ArticleRichTextProps) {
  const sanitizedContent = DOMPurify.sanitize(content ?? "", {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["embed", "form", "iframe", "input", "object", "script", "style"],
    FORBID_ATTR: ["style"],
  });

  return (
    <div
      className="article-rich-text"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
