/**
 * JsonLd — Server component for injecting JSON-LD structured data.
 * Usage: <JsonLd data={{ "@context": "https://schema.org", ... }} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
