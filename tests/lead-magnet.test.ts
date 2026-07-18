import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import {
  LEAD_MAGNET,
  LEAD_MAGNET_EMAIL_SUBJECT,
} from "../src/lib/lead-magnet";

const newsletterActionSource = readFileSync(
  new URL("../src/app/[locale]/actions/newsletter/index.ts", import.meta.url),
  "utf8",
);
const footerFormSource = readFileSync(
  new URL("../src/components/subscribe-newsletter.tsx", import.meta.url),
  "utf8",
);
const heroFormSource = readFileSync(
  new URL("../src/components/substack-hero-subscribe.tsx", import.meta.url),
  "utf8",
);
const ownerEmailSource = readFileSync(
  new URL("../src/components/email/notify-newsletter.tsx", import.meta.url),
  "utf8",
);

describe("newsletter lead magnet", () => {
  test("keeps the private download lifetime at exactly 48 hours", () => {
    expect(LEAD_MAGNET.expiresInSeconds).toBe(172800);
  });

  test("pins the uploaded guide to matching SHA-256 encodings", () => {
    expect(Buffer.from(LEAD_MAGNET.sha256Hex, "hex").toString("base64")).toBe(
      LEAD_MAGNET.sha256Base64,
    );
  });

  test("uses one English delivery subject", () => {
    expect(LEAD_MAGNET_EMAIL_SUBJECT).toBe(
      "Your free guide is here: Which Binary Are You Standing In?",
    );
  });

  test("sends from and replies to the support address only", () => {
    expect(newsletterActionSource).toContain(
      "from: `Ashley Leon <${SUPPORT_EMAIL}>`",
    );
    expect(newsletterActionSource).toContain("replyTo: SUPPORT_EMAIL");
    expect(newsletterActionSource.includes("noreply@")).toBe(false);
  });

  test("captures the complete browser URL from every signup form", () => {
    expect(footerFormSource).toContain("sourceUrl: window.location.href");
    expect(heroFormSource).toContain("sourceUrl: window.location.href");
    expect(newsletterActionSource).toContain('requestHeaders.get("referer")');
  });

  test("keeps Ashley's notification entirely in English", () => {
    expect(ownerEmailSource).toContain("New free guide signup");
    expect(ownerEmailSource).toContain("Source URL:");
    expect(ownerEmailSource.includes("Nueva suscripción")).toBe(false);
  });
});
