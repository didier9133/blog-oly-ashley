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

type LeadMagnetFollowupEmailTemplateProps = {
  downloadLink: string;
  communityLink: string;
  workbookLink: string;
  supportEmail: string;
};

const COPY = {
  preview:
    "You do not have to hold what the guide surfaced on your own. Here is a gentle next step.",
  eyebrow: "A GENTLE NEXT STEP",
  heading: "What did the guide bring into focus?",
  greeting: "Hi there,",
  reminder:
    "Yesterday I sent you Which Binary Are You Standing In? If you have not saved it yet, your private link is still available for about 24 more hours.",
  download: "Download or save the guide",
  bridge:
    "If one of the tensions felt familiar, you do not have to carry it alone or decide what it all means right away.",
  communityEyebrow: "CONTINUE IN COMMUNITY",
  communityTitle: "The In-Between",
  communityBody:
    "A free private community for honest reflection, real conversation, and belonging without being pushed toward a required conclusion.",
  communityCta: "Join The In-Between — free",
  workbookTitle: "Prefer a guided path?",
  workbookBody:
    "Rebuilding Reverence is a 30-day workbook for examining inherited beliefs and rebuilding spiritual trust at your own pace.",
  workbookCta: "Explore Rebuilding Reverence →",
  support: "Write to",
  unsubscribe:
    'Do not want to receive these reflections? Reply with “unsubscribe” and I will remove you.',
  closing: "With love,",
} as const;

export default function LeadMagnetFollowupEmailTemplate({
  downloadLink,
  communityLink,
  workbookLink,
  supportEmail,
}: LeadMagnetFollowupEmailTemplateProps) {
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
            <Text style={bodyText}>{copy.reminder}</Text>
            <Text style={downloadText}>
              <a href={downloadLink} style={downloadLinkStyle}>
                {copy.download} →
              </a>
            </Text>
            <Text style={bodyText}>{copy.bridge}</Text>

            <Section style={communityBox}>
              <Text style={communityEyebrow}>{copy.communityEyebrow}</Text>
              <Heading as="h2" style={communityHeading}>
                {copy.communityTitle}
              </Heading>
              <Text style={communityBody}>{copy.communityBody}</Text>
              <Section style={buttonSection}>
                <Button href={communityLink} style={primaryButton}>
                  {copy.communityCta}
                </Button>
              </Section>
            </Section>

            <Section style={workbookSection}>
              <Heading as="h3" style={workbookHeading}>
                {copy.workbookTitle}
              </Heading>
              <Text style={workbookBody}>{copy.workbookBody}</Text>
              <Text style={workbookLinkText}>
                <a href={workbookLink} style={secondaryLink}>
                  {copy.workbookCta}
                </a>
              </Text>
            </Section>

            <Hr style={divider} />
            <Text style={supportText}>
              {copy.support}{" "}
              <a href={`mailto:${supportEmail}`} style={secondaryLink}>
                {supportEmail}
              </a>
              .
            </Text>
            <Text style={unsubscribeText}>{copy.unsubscribe}</Text>
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
  fontSize: "32px",
  fontWeight: 600,
  letterSpacing: "-0.4px",
  lineHeight: "39px",
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
  margin: "0 0 18px",
};

const downloadText = {
  fontFamily: "Arial, sans-serif",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "-4px 0 24px",
};

const downloadLinkStyle = {
  color: colors.clay,
  fontWeight: 700,
  textDecoration: "underline",
};

const communityBox = {
  backgroundColor: "#f0eee5",
  borderLeft: `3px solid ${colors.olive}`,
  margin: "30px 0 26px",
  padding: "24px 24px 22px",
};

const communityEyebrow = {
  color: colors.olive,
  fontFamily: "Arial, sans-serif",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "1.4px",
  lineHeight: "16px",
  margin: "0 0 8px",
};

const communityHeading = {
  color: colors.ink,
  fontSize: "25px",
  fontWeight: 600,
  lineHeight: "32px",
  margin: "0 0 10px",
};

const communityBody = {
  color: "#4c4a42",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 18px",
};

const buttonSection = { textAlign: "left" as const };

const primaryButton = {
  backgroundColor: colors.clay,
  borderRadius: "3px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: "Arial, sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.3px",
  padding: "14px 22px",
  textDecoration: "none",
};

const workbookSection = { padding: "4px 0 0" };

const workbookHeading = {
  color: colors.ink,
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "28px",
  margin: "0 0 8px",
};

const workbookBody = {
  color: "#5e584f",
  fontSize: "14px",
  lineHeight: "23px",
  margin: "0 0 10px",
};

const workbookLinkText = {
  fontFamily: "Arial, sans-serif",
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: "20px",
  margin: 0,
};

const secondaryLink = { color: colors.clay, textDecoration: "underline" };

const divider = { borderColor: colors.line, margin: "30px 0 24px" };

const supportText = {
  color: "#6e675e",
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  lineHeight: "19px",
  margin: "0 0 10px",
};

const unsubscribeText = {
  color: "#827a70",
  fontFamily: "Arial, sans-serif",
  fontSize: "11px",
  lineHeight: "18px",
  margin: "0 0 24px",
};

const signature = {
  color: colors.ink,
  fontSize: "17px",
  fontStyle: "italic",
  lineHeight: "26px",
  margin: 0,
};
