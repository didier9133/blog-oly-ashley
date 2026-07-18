import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
  Hr,
  Section,
} from "@react-email/components";

const OwnerNewsletterNotificationTemplate = ({
  email,
  source,
  sourceUrl,
  locale,
  submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }),
}: {
  email: string;
  source?: string;
  sourceUrl?: string;
  locale?: string;
  submittedAt?: string;
}) => (
  <Html lang="en">
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>New free guide signup</Heading>
          <Text style={timestamp}>Received {submittedAt}</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>
            Someone requested the free guide from the website. Add this address
            to Substack if it is not already on the list.
          </Text>

          <Section style={infoSection}>
            <Text style={sectionTitle}>Signup details</Text>
            <Text style={infoItem}>
              <strong>Email:</strong> {email}
            </Text>
            {source ? (
              <Text style={infoItem}>
                <strong>Form:</strong> {source}
              </Text>
            ) : null}
            {sourceUrl ? (
              <Text style={infoItem}>
                <strong>Source URL:</strong>{" "}
                <a href={sourceUrl} style={sourceLink}>
                  {sourceUrl}
                </a>
              </Text>
            ) : null}
            {locale ? (
              <Text style={infoItem}>
                <strong>Site locale:</strong> {locale}
              </Text>
            ) : null}
          </Section>

          <Hr style={divider} />

          <Section style={actionSection}>
            <Text style={sectionTitle}>Next steps</Text>
            <Text style={actionItem}>• Add the address to Substack</Text>
            <Text style={actionItem}>• Mark it as handled in the dashboard</Text>
            <Text style={actionItem}>• Ignore this notice if it already exists</Text>
          </Section>

          <Text style={footerNote}>
            This notification was generated automatically by the free guide
            form on the website.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OwnerNewsletterNotificationTemplate;

const main = {
  backgroundColor: "#fefefe",
  fontFamily: "--font-cormorant-garamond, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "28px",
};

const h1 = {
  color: "#2d3748",
  fontSize: "26px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0",
};

const timestamp = {
  color: "#718096",
  fontSize: "13px",
  margin: "10px 0 0 0",
};

const content = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "32px",
};

const greeting = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 18px 0",
};

const infoSection = {
  margin: "18px 0",
  padding: "16px",
  backgroundColor: "#f7fafc",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
};

const sectionTitle = {
  color: "#2d3748",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "0.6px",
  margin: "0 0 10px 0",
};

const infoItem = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "6px 0",
};

const sourceLink = {
  color: "#9c5f49",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const divider = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "22px 0",
};

const actionSection = {
  margin: "0",
  padding: "16px",
  backgroundColor: "#fffaf0",
  borderRadius: "10px",
  border: "1px solid #fbd38d",
};

const actionItem = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "6px 0",
};

const footerNote = {
  color: "#718096",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "18px 0 0 0",
};
