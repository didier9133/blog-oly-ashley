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

const OwnerNotificationTemplate = ({
  customerName,
  customerEmail,
  message,
  submittedAt = new Date().toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
}: {
  customerName: string;
  customerEmail: string;
  message: string;
  submittedAt?: string;
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>📩 Nuevo mensaje de contacto</Heading>
          <Text style={timestamp}>Recibido el {submittedAt}</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>
            Hola, Ashley. Acaba de llegar un mensaje desde el formulario de
            contacto.
          </Text>

          <Section style={contactInfoSection}>
            <Text style={sectionTitle}>Información de contacto</Text>
            <div style={contactDetails}>
              <Text style={contactItem}>
                <strong>Nombre:</strong> {customerName}
              </Text>
              <Text style={contactItem}>
                <strong>Correo:</strong> {customerEmail}
              </Text>
            </div>
          </Section>

          <Section style={messageSection}>
            <Text style={sectionTitle}>Mensaje</Text>
            <Text style={customerMessage}>{`"${message}"`}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={actionSection}>
            <Text style={actionTitle}>Siguientes pasos</Text>
            <div style={actionList}>
              <Text style={actionItem}>
                • Responder durante las próximas 24–48 horas
              </Text>
              <Text style={actionItem}>
                • Comprobar si la consulta se refiere a un producto
              </Text>
              <Text style={actionItem}>
                • Valorar si necesita seguimiento personalizado
              </Text>
            </div>
          </Section>

          <Text style={reminder}>
            Ya se envió una respuesta automática a {customerName} para confirmar
            la recepción del mensaje.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Esta notificación se generó automáticamente desde el formulario de
            contacto de tu sitio web.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OwnerNotificationTemplate;

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

const messageSection = {
  margin: "32px 0",
  padding: "20px",
  backgroundColor: "#f7fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
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

const timestamp = {
  color: "#718096",
  fontSize: "14px",
  margin: "8px 0 0 0",
  textAlign: "center" as const,
};

const contactInfoSection = {
  margin: "24px 0",
  padding: "20px",
  backgroundColor: "#f0fff4",
  borderRadius: "8px",
  border: "1px solid #9ae6b4",
};

const sectionTitle = {
  color: "#2d3748",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const contactDetails = {
  margin: "0",
};

const contactItem = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "4px 0",
};

const actionSection = {
  margin: "24px 0",
  padding: "20px",
  backgroundColor: "#fffaf0",
  borderRadius: "8px",
  border: "1px solid #fbd38d",
};

const actionTitle = {
  color: "#2d3748",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const actionList = {
  margin: "0",
};

const actionItem = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "6px 0",
};

const reminder = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "24px 0 0 0",
  padding: "16px",
  backgroundColor: "#edf2f7",
  borderRadius: "8px",
};
