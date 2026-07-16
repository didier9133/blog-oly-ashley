const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

function decodeHtmlEntity(entity: string) {
  if (entity.startsWith("#x") || entity.startsWith("#X")) {
    const codePoint = Number.parseInt(entity.slice(2), 16);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
  }

  if (entity.startsWith("#")) {
    const codePoint = Number.parseInt(entity.slice(1), 10);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
  }

  return ENTITY_MAP[entity] ?? "";
}

export function htmlToPlainText(html: string | null | undefined) {
  return (html ?? "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&([a-zA-Z][\w-]+|#[0-9]+|#x[0-9a-fA-F]+);/g, (_, entity) =>
      decodeHtmlEntity(entity),
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function htmlExcerpt(
  html: string | null | undefined,
  maxLength = 240,
) {
  const plainText = htmlToPlainText(html);

  if (plainText.length <= maxLength) return plainText;

  const truncated = plainText.slice(0, maxLength + 1);
  const lastWordBoundary = truncated.lastIndexOf(" ");
  const excerpt = truncated.slice(
    0,
    lastWordBoundary > maxLength * 0.75 ? lastWordBoundary : maxLength,
  );

  return `${excerpt.trimEnd()}…`;
}
