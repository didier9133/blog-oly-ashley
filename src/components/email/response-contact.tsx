import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Section,
} from "@react-email/components";

interface ContactEmailTemplateProps {
  customerName: string;
  message: string;
}

const ContactEmailTemplate = ({
  customerName,
  message,
}: ContactEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Gracias por escribirnos - Pronto estaremos en contacto</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>¡Hola {customerName}!</Heading>
        </Section>

        <Section style={content}>
          <Text style={greeting}>
            Gracias por tomarte el tiempo de escribirnos. Nos emociona mucho
            saber de ti.
          </Text>

          <Text style={brandMessage}>
            Somos una pareja que decidió compartir nuestra historia y pasión a
            través de nuestra línea de ropa. Cada pieza que creamos lleva un
            pedacito de nuestra experiencia, amor y autenticidad. Creemos en la
            importancia de ser genuinas y crear conexiones reales con personas
            como tú.
          </Text>

          <Section style={messageSection}>
            <Text style={messageLabel}>Tu mensaje:</Text>
            <Text style={customerMessage}>{`"${message}"`}</Text>
          </Section>

          <Hr style={divider} />

          <Text style={responseMessage}>
            Hemos recibido tu mensaje y lo leeremos con mucho cariño. Te
            responderemos personalmente en las próximas 24-48 horas.
          </Text>

          <Text style={closing}>
            Con amor y gratitud,
            <br />
            <strong>El equipo de Raíces & Returning</strong>
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Este email fue enviado porque te pusiste en contacto con nosotras a
            través de nuestro sitio web.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ContactEmailTemplate;

// Estilos
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
  marginBottom: "32px",
};

const h1 = {
  color: "#2d3748",
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0",
};

const content = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "40px 32px",
};

const greeting = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const brandMessage = {
  color: "#2d3748",
  fontSize: "16px",
  lineHeight: "1.7",
  margin: "0 0 32px 0",
  fontStyle: "italic",
  borderLeft: "3px solid #e53e3e",
  paddingLeft: "16px",
  backgroundColor: "#fef5e7",
  padding: "20px 20px 20px 36px",
  borderRadius: "8px",
};

const messageSection = {
  margin: "32px 0",
  padding: "20px",
  backgroundColor: "#f7fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const messageLabel = {
  color: "#718096",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const customerMessage = {
  color: "#2d3748",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  fontStyle: "italic",
};

const divider = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "32px 0",
};

const responseMessage = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 32px 0",
  textAlign: "center" as const,
  padding: "20px",
  backgroundColor: "#edf2f7",
  borderRadius: "8px",
};

const closing = {
  color: "#2d3748",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
  textAlign: "right" as const,
};

const footer = {
  marginTop: "40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#a0aec0",
  fontSize: "12px",
  lineHeight: "1.4",
  margin: "0",
};
