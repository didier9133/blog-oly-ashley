import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import spanishMessages from "../messages/es.json";

const footerSource = readFileSync(
  new URL("../src/components/footer.tsx", import.meta.url),
  "utf8",
);
const publicLayoutSource = readFileSync(
  new URL("../src/app/[locale]/(public)/layout.tsx", import.meta.url),
  "utf8",
);
const authLayoutSource = readFileSync(
  new URL("../src/app/[locale]/(auth)/layout.tsx", import.meta.url),
  "utf8",
);

describe("footer localization", () => {
  test("keeps the Spanish newsletter transcreation", () => {
    expect(spanishMessages.footer).toMatchObject({
      "newsletter-label": "Carta de Ashley",
      "subscribe-label": "Quiero recibirla",
      "stay-in-loop": "Una carta para cuando algo merece ser compartido.",
      "newsletter-desc":
        "Reflexiones sobre fe, identidad y lo sagrado. Llegan sin calendario: solo cuando hay algo honesto que pueda acompañarte.",
      "brand-desc":
        "Ensayos, guías y encuentros en vivo para reconstruir la fe, recuperar la reverencia y volver a lo sagrado sin dejarte atrás.",
      explore: "Explora",
      company: "Más sobre Ashley",
      "based-in": "Escribiendo desde la transición",
    });
  });

  test("renders server-side footer translations with the route locale", () => {
    expect(footerSource).toContain('getTranslations({ locale, namespace: "footer" })');
    expect(footerSource).toContain(
      'getTranslations({ locale, namespace: "navigation" })',
    );
    expect(publicLayoutSource).toContain("<Footer locale={locale} />");
    expect(authLayoutSource).toContain("<Footer locale={locale} />");
  });
});
