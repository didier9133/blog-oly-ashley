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
  test("positions the English guide around faith, identity, and belonging", () => {
    expect(englishMessages.footer).toMatchObject({
      "lead-magnet-landing-eyebrow": "A free reflection guide",
      "lead-magnet-landing-title":
        "When Faith, Identity, and Belonging Stop Fitting Together",
      "lead-magnet-landing-desc":
        "Five short reflections. No score. No right conclusion. Naming the tension is the goal — not resolving it.",
      "lead-magnet-landing-cta": "Help Me Name What I Am Carrying",
    });
    expect("sidebar-cta-desc" in englishMessages.Home).toBe(false);
  });

  test("keeps the Spanish footer transcreation natural and specific", () => {
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
      "lead-magnet-landing-eyebrow":
        "Una guía gratuita para reconocer la herida",
      "lead-magnet-landing-title":
        "Cuando la fe, la identidad y la pertenencia dejan de encajar",
      "lead-magnet-landing-desc":
        "Cinco reflexiones breves para reconocer la herida que atraviesa tu fe, tu identidad y tu sentido de pertenencia. Sin respuestas correctas ni conclusiones impuestas: solo un punto de partida para nombrar lo que estás viviendo.",
      "lead-magnet-landing-cta":
        "Ayúdame a darle nombre a lo que estoy viviendo",
      "brand-desc":
        "Ensayos, guías y encuentros en vivo para reconstruir la fe, recuperar la reverencia y volver a lo sagrado sin renunciar a quien eres.",
      explore: "Para empezar",
      company: "Más sobre Ashley",
      "based-in": "Escribiendo desde lo que todavía está tomando forma",
    });
    expect("sidebar-cta-desc" in spanishMessages.Home).toBe(false);
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

  test("uses Ashley's current social profiles without tracking parameters", () => {
    expect(footerSource).toContain(
      'href="https://www.instagram.com/ashleydianaleon"',
    );
    expect(footerSource).toContain(
      'href="https://www.facebook.com/ashley.leon.684699"',
    );
    expect(footerSource).toContain(
      'href="https://www.youtube.com/@ashleydianaleon"',
    );
    expect(footerSource.includes("utm_source")).toBe(false);
    expect(footerSource.includes("mibextid")).toBe(false);
  });
});
