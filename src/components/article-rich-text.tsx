import "server-only";

import {
  prepareArticleHtml,
  type ArticleSemanticRules,
} from "@/lib/article-semantics";

interface ArticleRichTextProps {
  content: string | null | undefined;
  semanticRules?: ArticleSemanticRules;
}

/**
 * Render article copy in the initial server response so search engines and
 * answer engines can read the complete essay without executing JavaScript.
 */
export function ArticleRichText({
  content,
  semanticRules,
}: ArticleRichTextProps) {
  const sanitizedContent = prepareArticleHtml(content, semanticRules);

  return (
    <div
      className="article-rich-text"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
