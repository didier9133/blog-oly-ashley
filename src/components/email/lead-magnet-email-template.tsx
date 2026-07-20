import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type LeadMagnetEmailTemplateProps = {
  downloadLink: string;
  supportEmail: string;
};

const COPY = {
  preview:
    "Your free 9-page reflection guide is ready. Download it within 48 hours.",
  eyebrow: "A SHORT RETURN TO THE QUESTION UNDERNEATH THE QUESTION",
  heading: "Which Binary Are You Standing In?",
  greeting: "Hi there,",
  intro:
    "Thank you for being here. I made this short guide for the tensions that rarely fit into clean answers—the ones we are already standing inside.",
  prompt:
    "Inside, you’ll find five reflections. Start with the one that sounds most like your life right now. There is no score and nothing to get right.",
  cta: "Download your free guide",
  expiry:
    "Your private download link is valid for 48 hours. Save the PDF to your device before it expires.",
  fallback: "If the button does not open, use this backup link:",
  fallbackCta: "Open the secure download link →",
  newsletter:
    "You’ll also receive my occasional reflections on faith, identity, belonging, and what remains sacred—only when there is something worth saying.",
  support: "Questions? Reply to this email or write to",
  closing: "With love,",
} as const;

export default function LeadMagnetEmailTemplate({
  downloadLink,
  supportEmail,
}: LeadMagnetEmailTemplateProps) {
  const copy = COPY;

  return (
    <Html lang="en">
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={masthead}>
            <Text style={brand}>Ashley Leon</Text>
            <Text style={eyebrow}>{copy.eyebrow}</Text>
          </Section>

          <Section style={content}>
            <Heading style={heading}>{copy.heading}</Heading>
            <Text style={greeting}>{copy.greeting}</Text>
            <Text style={bodyText}>{copy.intro}</Text>
            <Text style={bodyText}>{copy.prompt}</Text>

            <Section style={buttonSection}>
              <Button href={downloadLink} style={button}>
                {copy.cta}
              </Button>
            </Section>

            <Section style={expiryBox}>
              <Text style={expiryText}>{copy.expiry}</Text>
            </Section>

            <Text style={fallbackText}>{copy.fallback}</Text>
            <Text style={linkText}>
              <a href={downloadLink} style={link}>
                {copy.fallbackCta}
              </a>
            </Text>

            <Hr style={divider} />
            <Text style={newsletterText}>{copy.newsletter}</Text>
            <Text style={supportText}>
              {copy.support}{" "}
              <a href={`mailto:${supportEmail}`} style={link}>
                {supportEmail}
              </a>
              .
            </Text>
            <Text style={signature}>
              {copy.closing}
              <br />
              Ashley
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const colors = {
  paper: "#f4efe7",
  card: "#fffdf9",
  ink: "#292622",
  clay: "#bd775c",
  olive: "#73785f",
  line: "#ddd4c8",
};

const main = {
  backgroundColor: colors.paper,
  color: colors.ink,
  fontFamily:
    'Georgia, "Times New Roman", -apple-system, BlinkMacSystemFont, serif',
  margin: 0,
  padding: "32px 12px",
};

const container = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.line}`,
  borderRadius: "4px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
};

const masthead = {
  backgroundColor: colors.olive,
  padding: "26px 40px 24px",
  textAlign: "center" as const,
};

const brand = {
  color: "#fffdf9",
  fontSize: "25px",
  fontStyle: "italic",
  margin: "0 0 14px",
};

const eyebrow = {
  color: "#ebe5d9",
  fontFamily: "Arial, sans-serif",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "1.7px",
  lineHeight: "16px",
  margin: 0,
};

const content = { padding: "38px 40px 42px" };

const heading = {
  color: colors.ink,
  fontSize: "34px",
  fontWeight: 600,
  letterSpacing: "-0.4px",
  lineHeight: "40px",
  margin: "0 0 28px",
  textAlign: "center" as const,
};

const greeting = {
  color: colors.ink,
  fontSize: "18px",
  lineHeight: "28px",
  margin: "0 0 14px",
};

const bodyText = {
  color: colors.ink,
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const buttonSection = {
  padding: "18px 0 24px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: colors.clay,
  borderRadius: "3px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: "Arial, sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.7px",
  padding: "15px 28px",
  textDecoration: "none",
};

const expiryBox = {
  backgroundColor: "#f0eee5",
  borderLeft: `3px solid ${colors.olive}`,
  margin: "0 0 22px",
  padding: "14px 18px",
};

const expiryText = {
  color: "#4c4a42",
  fontFamily: "Arial, sans-serif",
  fontSize: "13px",
  lineHeight: "20px",
  margin: 0,
};

const fallbackText = {
  color: "#6e675e",
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  lineHeight: "19px",
  margin: "0 0 6px",
};

const linkText = {
  fontFamily: "Arial, sans-serif",
  fontSize: "11px",
  lineHeight: "17px",
  margin: 0,
  overflowWrap: "anywhere" as const,
};

const link = { color: colors.clay, textDecoration: "underline" };

const divider = { borderColor: colors.line, margin: "30px 0 24px" };

const newsletterText = {
  color: "#5e584f",
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "23px",
  margin: "0 0 18px",
};

const supportText = {
  color: "#6e675e",
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  lineHeight: "19px",
  margin: "0 0 24px",
};

const signature = {
  color: colors.ink,
  fontSize: "17px",
  fontStyle: "italic",
  lineHeight: "26px",
  margin: 0,
};
