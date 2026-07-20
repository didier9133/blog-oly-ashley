import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { render } from "@react-email/render";

import LeadMagnetEmailTemplate from "../src/components/email/lead-magnet-email-template";
import LeadMagnetFollowupEmailTemplate from "../src/components/email/lead-magnet-followup-email-template";
import {
  LEAD_MAGNET,
  LEAD_MAGNET_EMAIL_SUBJECT,
  LEAD_MAGNET_FOLLOWUP_DELAY_MS,
  LEAD_MAGNET_FOLLOWUP_SUBJECT,
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
const followupEmailSource = readFileSync(
  new URL(
    "../src/components/email/lead-magnet-followup-email-template.tsx",
    import.meta.url,
  ),
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

  test("keeps the first email download URL behind a short backup label", async () => {
    const downloadLink =
      "https://downloads.example.com/a-very-long-private-signed-guide-url";
    const html = await render(
      LeadMagnetEmailTemplate({
        downloadLink,
        supportEmail: "support@example.com",
      }),
    );

    expect(html).toContain(`href="${downloadLink}"`);
    expect(html).toContain("Open the secure download link →");
    expect(html.includes(`>${downloadLink}</a>`)).toBe(false);
  });

  test("schedules the next-step email exactly 24 hours later", () => {
    expect(LEAD_MAGNET_FOLLOWUP_DELAY_MS).toBe(86_400_000);
    expect(LEAD_MAGNET_FOLLOWUP_SUBJECT).toBe(
      "A gentle next step after your guide",
    );
    expect(newsletterActionSource).toContain(
      "scheduledAt: scheduledAt.toISOString()",
    );
  });

  test("protects the 24-hour follow-up from duplicate sends", () => {
    expect(newsletterActionSource).toContain(
      "idempotencyKey: `lead-magnet-followup/${signupId}`",
    );
  });

  test("keeps community primary and the workbook secondary", () => {
    expect(followupEmailSource).toContain(
      "Join The In-Between — free",
    );
    expect(followupEmailSource).toContain(
      "Explore Rebuilding Reverence →",
    );
  });

  test("renders the English-only follow-up with working destinations", async () => {
    const html = await render(
      LeadMagnetFollowupEmailTemplate({
        downloadLink: "https://downloads.example.com/guide",
        communityLink: "https://example.com/en/community/join",
        workbookLink: "https://example.com/en/workbooks/rebuilding-reverence",
        supportEmail: "support@example.com",
      }),
    );

    expect(html).toContain("Join The In-Between — free");
    expect(html).toContain("https://downloads.example.com/guide");
    expect(html).toContain("https://example.com/en/community/join");
    expect(html).toContain(
      "https://example.com/en/workbooks/rebuilding-reverence",
    );
    expect(html).toContain("Write to");
    expect(html.includes("Reply to this email or write to")).toBe(false);
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
