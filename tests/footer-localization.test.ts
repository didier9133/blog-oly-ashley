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
      "subscribe-label": "Envíame la guía",
      "stay-in-loop": "Which Binary Are You Standing In?",
      "newsletter-desc":
        "Una breve guía en inglés para reconocer la tensión que ya estás habitando. Encuentra la pregunta que más se parece a tu vida hoy y empieza por ahí.",
      "lead-magnet-details":
        "PDF de 9 páginas · enlace privado válido por 48 horas",
      "lead-magnet-consent":
        "Recibe la guía gratuita y las reflexiones ocasionales de Ashley. Sin spam; cancela cuando quieras.",
      "brand-desc":
        "Ensayos, guías y encuentros en vivo para reconstruir la fe, recuperar la reverencia y volver a lo sagrado sin renunciar a quien eres.",
      explore: "Para empezar",
      company: "Más sobre Ashley",
      "based-in": "Escribiendo desde lo que todavía está tomando forma",
    });
  });

  test("renders server-side footer translations with the route locale", () => {
    expect(footerSource).toContain(
      'getTranslations({ locale, namespace: "footer" })',
    );
    expect(footerSource).toContain(
      'getTranslations({ locale, namespace: "navigation" })',
    );
    expect(publicLayoutSource).toContain("<Footer locale={locale} />");
    expect(authLayoutSource).toContain("<Footer locale={locale} />");
  });
});
