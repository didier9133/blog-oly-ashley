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
  locale,
  submittedAt = new Date().toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
}: {
  email: string;
  source?: string;
  locale?: string;
  submittedAt?: string;
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>📰 Nueva suscripción (pendiente)</Heading>
          <Text style={timestamp}>Recibido el {submittedAt}</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>
            Alguien se suscribió desde el sitio web. Agrégalo manualmente en
            Substack.
          </Text>

          <Section style={infoSection}>
            <Text style={sectionTitle}>Detalles</Text>
            <Text style={infoItem}>
              <strong>Email:</strong> {email}
            </Text>
            {source ? (
              <Text style={infoItem}>
                <strong>Origen:</strong> {source}
              </Text>
            ) : null}
            {locale ? (
              <Text style={infoItem}>
                <strong>Idioma:</strong> {locale}
              </Text>
            ) : null}
          </Section>

          <Hr style={divider} />

          <Section style={actionSection}>
            <Text style={sectionTitle}>Acciones</Text>
            <Text style={actionItem}>
              • Agregar este email como suscriptor/a en Substack
            </Text>
            <Text style={actionItem}>
              • Marcarlo como “handled” en el dashboard (si aplica)
            </Text>
            <Text style={actionItem}>• Si ya existe, ignorar este aviso</Text>
          </Section>

          <Text style={footerNote}>
            Esta notificación fue generada automáticamente por el formulario de
            suscripción del sitio.
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
