import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const landingSource = readFileSync(
  new URL(
    "../src/app/[locale]/(public)/church-hurt-guide/page.tsx",
    import.meta.url,
  ),
  "utf8",
);
const homeSource = readFileSync(
  new URL("../src/app/[locale]/(public)/page.tsx", import.meta.url),
  "utf8",
);
const footerCtaSource = readFileSync(
  new URL(
    "../src/components/footer-church-hurt-guide-cta.tsx",
    import.meta.url,
  ),
  "utf8",
);
const globalStylesSource = readFileSync(
  new URL("../src/app/[locale]/globals.css", import.meta.url),
  "utf8",
);
const footerSource = readFileSync(
  new URL("../src/components/footer.tsx", import.meta.url),
  "utf8",
);
const sidebarSource = readFileSync(
  new URL("../src/components/home-sidebar.tsx", import.meta.url),
  "utf8",
);
const sitemapSource = readFileSync(
  new URL("../src/app/sitemap.ts", import.meta.url),
  "utf8",
);

describe("Church Hurt guide landing", () => {
  test("preserves Ashley's approved core copy and CTA", () => {
    expect(landingSource).toContain(
      "Church Hurt Can Leave You Caught Between Two Answers",
    );
    expect(landingSource).toContain(
      "This free reflection guide helps you name the",
    );
    expect(landingSource).toContain("There’s no score, no right");
    expect(landingSource).toContain(
      "<ChurchHurtGuideForm locale={currentLocale} />",
    );
  });

  test("publishes indexable English and Spanish versions under the approved slug", () => {
    expect(landingSource).toContain('const PATH = "/church-hurt-guide"');
    expect(landingSource).toContain(
      "localizedAlternates(currentLocale, PATHS)",
    );
    expect(landingSource).toContain(
      "El dolor vivido en la iglesia puede dejarte entre dos respuestas",
    );
    expect(landingSource.includes("permanentRedirect")).toBe(false);
    expect(sitemapSource).toContain(
      '{ path: "/church-hurt-guide", lastModified: "2026-07-24" }',
    );
    expect(sitemapSource.includes("ENGLISH_ONLY_STATIC_ROUTES")).toBe(false);
  });

  test("uses the complete public website layout", () => {
    const publicLayoutSource = readFileSync(
      new URL("../src/app/[locale]/(public)/layout.tsx", import.meta.url),
      "utf8",
    );

    expect(publicLayoutSource).toContain("<PublicHeader");
    expect(publicLayoutSource).toContain("<Footer");
    expect(landingSource.includes("<header")).toBe(false);
    expect(landingSource.includes("<footer")).toBe(false);
  });

  test("moves the sitewide guide invitation into the footer without duplicating it on the landing", () => {
    expect(homeSource.includes("HomeChurchHurtGuideCta")).toBe(false);
    expect(footerSource).toContain("<FooterChurchHurtGuideCta");
    expect(footerSource).toContain(
      'localizedHref(locale, "/church-hurt-guide")',
    );
    expect(footerCtaSource).toContain(
      'className="relative w-full overflow-hidden bg-[#62684f]',
    );
    expect(landingSource).toContain('data-page="church-hurt-guide"');
    expect(globalStylesSource).toContain(
      'body:has([data-page="church-hurt-guide"]) [data-footer-guide-cta]',
    );
    expect(sidebarSource.includes("sidebar-cta")).toBe(false);
    expect(sidebarSource.includes("#newsletter")).toBe(false);
  });
});
