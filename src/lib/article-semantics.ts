import DOMPurify from "isomorphic-dompurify";

export type ArticleHeadingLevel = 2 | 3;

export type ArticleHeadingPromotion = {
  sourceTag: "p" | "h2" | "h3" | "h4";
  sourceText: string;
  headingText?: string;
  level?: ArticleHeadingLevel;
};

export type ArticleHeadingInsertion = {
  beforeText: string;
  headingText: string;
  level?: ArticleHeadingLevel;
  match?: "exact" | "startsWith";
};

export type ArticleSemanticRules = {
  removeParagraphs?: readonly string[];
  promote?: readonly ArticleHeadingPromotion[];
  insertBefore?: readonly ArticleHeadingInsertion[];
};

const normalizeText = (value: string | null | undefined) =>
  value?.replace(/\s+/g, " ").trim() ?? "";

function createHeading(
  root: HTMLElement,
  level: ArticleHeadingLevel,
  text: string,
) {
  const heading = root.ownerDocument.createElement(`h${level}`);
  heading.textContent = text;
  return heading;
}

/**
 * Sanitize CMS-authored HTML and apply narrowly scoped semantic corrections.
 * The rules only promote or insert headings around existing copy; the essay
 * itself remains unchanged.
 */
export function prepareArticleHtml(
  content: string | null | undefined,
  rules?: ArticleSemanticRules,
): string {
  const sanitized = DOMPurify.sanitize(content ?? "", {
    USE_PROFILES: { html: true },
    FORBID_TAGS: [
      "embed",
      "form",
      "iframe",
      "input",
      "object",
      "script",
      "style",
    ],
    FORBID_ATTR: ["style"],
    RETURN_DOM: true,
  }) as HTMLElement;

  if (!rules) return sanitized.innerHTML;

  for (const paragraphText of rules.removeParagraphs ?? []) {
    const paragraph = Array.from(sanitized.querySelectorAll("p")).find(
      (candidate) =>
        normalizeText(candidate.textContent) === normalizeText(paragraphText),
    );
    paragraph?.remove();
  }

  for (const rule of rules.promote ?? []) {
    const source = Array.from(
      sanitized.querySelectorAll(rule.sourceTag),
    ).find(
      (candidate) =>
        normalizeText(candidate.textContent) === normalizeText(rule.sourceText),
    );
    if (!source) continue;

    const heading = createHeading(
      sanitized,
      rule.level ?? 2,
      rule.headingText ?? normalizeText(source.textContent),
    );
    source.replaceWith(heading);
  }

  for (const rule of rules.insertBefore ?? []) {
    const anchor = Array.from(sanitized.querySelectorAll("p")).find(
      (candidate) => {
        const candidateText = normalizeText(candidate.textContent);
        const targetText = normalizeText(rule.beforeText);
        return rule.match === "startsWith"
          ? candidateText.startsWith(targetText)
          : candidateText === targetText;
      },
    );
    if (!anchor) continue;

    const previous = anchor.previousElementSibling;
    if (
      previous &&
      normalizeText(previous.textContent) === normalizeText(rule.headingText) &&
      previous.tagName === `H${rule.level ?? 2}`
    ) {
      continue;
    }

    const heading = createHeading(
      sanitized,
      rule.level ?? 2,
      rule.headingText,
    );
    anchor.parentNode?.insertBefore(heading, anchor);
  }

  return sanitized.innerHTML;
}
