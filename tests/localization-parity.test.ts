import { describe, expect, test } from "bun:test";

import englishMessages from "../messages/en.json";
import spanishMessages from "../messages/es.json";

function flatten(
  value: unknown,
  prefix = "",
  output: Record<string, string> = {},
) {
  if (typeof value === "string") {
    output[prefix] = value;
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}.${index}`, output));
    return output;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) =>
      flatten(item, prefix ? `${prefix}.${key}` : key, output),
    );
  }

  return output;
}

function interpolationTokens(message: string) {
  return (
    message.match(/<\/?[a-z][^>]*>|\$\{[^}]+\}|\{[a-z][^}]*\}/gi) ?? []
  ).sort();
}

describe("message catalog parity", () => {
  const english = flatten(englishMessages);
  const spanish = flatten(spanishMessages);

  test("keeps the same translated message paths", () => {
    expect(JSON.stringify(Object.keys(spanish).sort())).toBe(
      JSON.stringify(Object.keys(english).sort()),
    );
  });

  test("preserves variables and rich-text tags in every translation", () => {
    for (const [key, englishMessage] of Object.entries(english)) {
      expect(JSON.stringify(interpolationTokens(spanish[key] ?? ""))).toBe(
        JSON.stringify(interpolationTokens(englishMessage)),
      );
    }
  });
});
