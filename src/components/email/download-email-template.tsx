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

interface DownloadEmailTemplateProps {
  customerName: string;
  productName: string;
  downloadLink: string;
}

export default function DownloadEmailTemplate({
  customerName,
  productName,
  downloadLink,
}: DownloadEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu descarga de {productName} está lista</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Tu {productName} ya está disponible ✨</Heading>

          <Text style={intro}>Hola, {customerName}</Text>

          <Text style={bodyText}>
            Gracias por confiar en este proceso. <strong>{productName}</strong>{" "}
            ya es tuyo.
          </Text>

          <Section style={buttonSection}>
            <Button style={primaryButton} href={downloadLink}>
              👉 Descarga ahora
            </Button>
          </Section>

          <Text style={bodyTextSmall}>
            Si prefieres, copia y pega este enlace en tu navegador:
          </Text>
          <Text style={linkBlock}>
            <a href={downloadLink} style={linkAnchor}>
              {downloadLink}
            </a>
          </Text>

          <Text style={bodyText}>
            Por favor, asegúrate de descargar tu PDF dentro de las próximas 48
            horas, ya que el enlace estará activo por tiempo limitado.
          </Text>

          <Text style={bodyText}>
            Antes de comenzar, únete a la comunidad virtual de {productName} —
            un espacio seguro para compartir reflexiones, hacer preguntas y
            caminar junto a otros.
          </Text>

          <Section style={ctaBox}>
            <Text style={ctaBoxText}>
              Puedes hacerlo desde Safari o tu computadora, o descargar la app
              GoKollab para tener todo en un solo lugar.
            </Text>
            <Text style={ctaBoxLink}>
              🔗{" "}
              <a
                href="https://gokollab.com/reconstruyendolareverencia-trcsrr"
                style={linkAnchor}
              >
                https://gokollab.com/reconstruyendolareverencia-trcsrr
              </a>
            </Text>
            <Text style={ctaBoxText}>
              * Nota: Si el enlace no se abre, borra la caché de tu navegador o
              copia y pega el enlace en una nueva pestaña.
            </Text>
            <Text style={ctaBoxText}>
              Al registrarte, selecciona &quot;Continuar con Google&quot; para
              una mejor experiencia.
            </Text>
          </Section>

          <Text style={bodyText}>
            No caminas solo/a. Si necesitas ayuda, responde a este correo o
            escríbenos a{" "}
            <a href="mailto:RaicesReturning@gmail.com" style={linkAnchor}>
              RaicesReturning@gmail.com
            </a>
            .
          </Text>

          <Hr style={divider} />

          <Text style={signature}>
            Con gratitud y reverencia,
            <br />
            Ashley
            <br />
            Raíces &amp; Returning
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
  primary: "#c47456", // Clay
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
  boxShadow: "0 12px 30px rgba(196, 116, 86, 0.25)",
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
