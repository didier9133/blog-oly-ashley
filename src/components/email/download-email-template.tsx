import {
  Body,
  Button,
  Container,
  Hr,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { getTranslations } from "next-intl/server";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";

interface DownloadEmailTemplateProps {
  customerName: string;
  productName: string;
  downloadLink: string;
  communityLink: string;
  locale: "en" | "es";
}

const SUPPORT_EMAIL = CONTACT_NOTIFICATION_EMAIL;

export default async function DownloadEmailTemplate({
  customerName,
  productName,
  downloadLink,
  communityLink,
  locale,
}: DownloadEmailTemplateProps) {
  const t = await getTranslations({ namespace: "EmailDownload", locale });

  return (
    <Html>
      <Head />
      <Preview>{t("preview")}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t("heading", { productName })}</Heading>
          <Text style={intro}>{t("greeting", { customerName })}</Text>
          <Text style={bodyText}>
            {t.rich("bodyThanks", {
              product: (chunks) => <strong>{chunks}</strong>,
              productName,
            })}
          </Text>
          <Section style={buttonSection}>
            <Button style={primaryButton} href={downloadLink}>
              {t("buttonCta")}
            </Button>
          </Section>
          <Text style={bodyTextSmall}>{t("linkInstruction")}</Text>
          <Text style={linkBlock}>
            <a href={downloadLink} style={linkAnchor}>
              {downloadLink}
            </a>
          </Text>
          <Text style={bodyText}>{t("downloadWarning")}</Text>
          <Text style={bodyText}>{t("communityInvite", { productName })}</Text>
          <Section style={ctaBox}>
            <Text style={ctaBoxText}>{t("ctaBoxIntro")}</Text>
            <Text style={ctaBoxLink}>
              🔗{" "}
              <a
                href={communityLink}
                target="_blank"
                rel="noopener noreferrer"
                style={linkAnchor}
              >
                {t("ctaBoxLink")}
              </a>
            </Text>
            <Text style={ctaBoxText}>{t("ctaBoxNote")}</Text>
            <Text style={ctaBoxText}>{t("ctaBoxGoogle")}</Text>
          </Section>
          <Text style={bodyText}>
            {t.rich("supportLine", {
              emailLink: (chunks) => (
                <a href={`mailto:${SUPPORT_EMAIL}`} style={linkAnchor}>
                  {chunks}
                </a>
              ),
              email: SUPPORT_EMAIL,
            })}
          </Text>
          <Hr style={divider} />
          <Text style={signature}>
            {t("closing")},
            <br />
            {t("signatureName")}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos
const colors = {
  background: "#f4efec", // Bone White
  card: "#f9f8f6", // light card
  text: "#2b2b2b", // Charcoal
  mutedText: "#6b6b6b",
  accent: "#a6a68c", // Sage Green
  accentLight: "#d1d1c2",
  primary: "#bd775c", // Clay
  secondary: "#b89e69", // Brass Gold
  destructive: "#d85c44",
};

const main = {
  fontFamily:
    '"Cormorant Garamond", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "32px 0",
  color: colors.text,
  backgroundColor: colors.background,
};

const container = {
  backgroundColor: colors.card,
  borderRadius: "16px",
  border: `1px solid ${colors.accentLight}`,
  margin: "0 auto",
  padding: "40px 0 48px",
  maxWidth: "600px",
  boxShadow: "0 20px 45px rgba(180, 160, 140, 0.15)",
};

const h1 = {
  color: colors.primary,
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: "28px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  margin: "0 40px 24px",
  textAlign: "center" as const,
};

const intro = {
  color: colors.text,
  fontSize: "18px",
  lineHeight: "28px",
  margin: "0 40px 16px",
};

const bodyText = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 40px 16px",
};

const bodyTextSmall = {
  color: colors.mutedText,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 40px 16px",
};

const buttonSection = {
  padding: "24px 40px",
  textAlign: "center" as const,
};

const primaryButton = {
  backgroundColor: colors.primary,
  borderRadius: "9999px",
  color: "#f9f8f6",
  fontSize: "16px",
  fontWeight: 600,
  letterSpacing: "0.3px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 36px",
  boxShadow: "0 12px 30px rgba(189, 119, 92, 0.25)",
};

const linkBlock = {
  margin: "0 40px 16px",
  fontSize: "14px",
  lineHeight: "22px",
  wordBreak: "break-all" as const,
};

const linkAnchor = {
  color: colors.secondary,
  textDecoration: "underline",
};

const ctaBox = {
  backgroundColor: "rgba(166, 166, 140, 0.08)",
  borderRadius: "12px",
  border: `1px solid rgba(166, 166, 140, 0.25)`,
  margin: "16px 40px 24px 40px",
  padding: "20px 24px",
  boxShadow: "0 2px 8px rgba(166, 166, 140, 0.06)",
  width: "calc(100% - 80px)",
  maxWidth: "calc(100% - 80px)",
  boxSizing: "border-box" as const,
};

const ctaBoxText = {
  color: colors.text,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 12px 0",
};

const ctaBoxLink = {
  fontSize: "14px",
  lineHeight: "22px",
  wordBreak: "break-all" as const,
  margin: "0 0 12px 0",
};

const divider = {
  borderColor: "rgba(166, 166, 140, 0.4)",
  margin: "32px 40px",
  width: "calc(100% - 80px)",
  maxWidth: "calc(100% - 80px)",
  boxSizing: "border-box" as const,
};

const signature = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "28px",
  margin: "24px 40px 0",
  fontFamily: '"Cormorant Garamond", serif',
  fontStyle: "normal",
  textAlign: "left" as const,
};
