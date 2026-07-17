import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

import spanishMessages from "../messages/es.json";

const publicMetadata = [
  spanishMessages.metadata,
  spanishMessages.About.metadata,
  spanishMessages.Contact.metadata,
  spanishMessages.Community.metadata,
  spanishMessages.Writing.metadata,
  {
    title: spanishMessages.Workbooks["metadata-title"],
    description: spanishMessages.Workbooks["metadata-description"],
  },
  {
    title: spanishMessages.Circle["metadata-title"],
    description: spanishMessages.Circle["metadata-description"],
  },
];

describe("Spanish SEO transcreation", () => {
  test("keeps public titles and descriptions concise and meaningful", () => {
    for (const metadata of publicMetadata) {
      expect(metadata.title.length >= 30).toBe(true);
      expect(metadata.title.length <= 65).toBe(true);
      expect(metadata.description.length >= 120).toBe(true);
      expect(metadata.description.length <= 160).toBe(true);
    }
  });

  test("uses natural Spanish in discovery metadata", () => {
    expect(spanishMessages.metadata.keywords).toContain(
      "deconstrucción de la fe",
    );
    expect(
      spanishMessages.metadata.keywords.includes("deconstrucción de fe,"),
    ).toBe(false);
    expect(spanishMessages.metadata.ogImageAlt).toBe(
      "Ashley Leon junto al mensaje «Volver a ti es volver a lo sagrado»",
    );
  });

  test("publishes a dedicated Spanish guide card and bilingual AI summary", () => {
    expect(
      existsSync(
        new URL(
          "../public/og-deconstructing-christianity-es-v1.png",
          import.meta.url,
        ),
      ),
    ).toBe(true);

    const llms = readFileSync(new URL("../public/llms.txt", import.meta.url), {
      encoding: "utf8",
    });
    expect(llms).toContain("## Versión en español");
    expect(llms).toContain(
      "https://ashleydianaleon.com/es/workbooks/reconstruyendo-la-reverencia",
    );
  });
});
