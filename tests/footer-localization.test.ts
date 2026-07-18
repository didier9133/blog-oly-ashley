import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import englishMessages from "../messages/en.json";
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
  test("positions the English guide around church hurt without overpromising", () => {
    expect(englishMessages.footer).toMatchObject({
      "lead-magnet-eyebrow":
        "A free reflection guide for what church hurt leaves behind",
      "newsletter-desc":
        "Whether you’re questioning your faith, navigating deconstruction, or trying to understand what church hurt left behind, this free 9-page guide will help you name the inner conflict that feels most like your life right now.",
    });
    expect(englishMessages.Home["sidebar-cta-desc"]).toContain("church hurt");
  });

  test("keeps the Spanish newsletter transcreation", () => {
    expect(spanishMessages.footer).toMatchObject({
      "newsletter-label": "Carta de Ashley",
      "subscribe-label": "Envíame la guía",
      "stay-in-loop": "¿Qué conflicto interno estás viviendo?",
      "newsletter-desc":
        "Si estás cuestionando tu fe, atravesando un proceso de deconstrucción o intentando comprender las heridas que dejó tu experiencia en la iglesia, esta guía gratuita de 9 páginas te ayudará a ponerle nombre al conflicto interno que más se parece a lo que estás viviendo hoy.",
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
    expect(spanishMessages.Home["sidebar-cta-desc"]).toContain(
      "las heridas que dejó tu experiencia en la iglesia",
    );
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
