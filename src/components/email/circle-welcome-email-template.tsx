import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface CircleWelcomeEmailTemplateProps {
  customerName: string;
  communityLink: string;
  journalLink: string;
  locale?: "en" | "es";
}

function getFirstName(customerName: string) {
  const normalizedName = customerName.trim();

  if (
    !normalizedName ||
    normalizedName.toLowerCase() === "cliente" ||
    normalizedName.toLowerCase() === "there"
  ) {
    return "there";
  }

  return normalizedName.split(/\s+/)[0];
}

export default function CircleWelcomeEmailTemplate({
  customerName,
  communityLink,
  journalLink,
  locale = "en",
}: CircleWelcomeEmailTemplateProps) {
  const firstName = getFirstName(customerName);
  const isSpanish = locale === "es";

  return (
    <Html>
      <Head />
      <Preview>
        {isSpanish
          ? "Bienvenida a The Circle de Rebuilding Reverence. Aquí tienes el grupo y tu guía."
          : "Welcome to Rebuilding Reverence Circle. Here are your community and journal links."}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {isSpanish ? (
            <>
              <Heading style={h1}>Ya estás dentro.</Heading>
              <Text style={bodyText}>
                {firstName === "there" ? "Hola," : `Hola ${firstName},`}
              </Text>
              <Text style={bodyText}>
                Bienvenida a The Circle de Rebuilding Reverence. Me alegra mucho
                que estés aquí.
              </Text>
              <Text style={bodyText}>
                Durante las próximas cuatro semanas vamos a reconstruir nuestra
                relación con lo sagrado, juntas. No desde el miedo. No desde la
                exigencia. No desde esa versión de la fe que muchas aprendimos a
                sostener a costa de nosotras mismas.
              </Text>
              <Text style={bodyText}>
                Este es un espacio para volver con honestidad.
              </Text>
              <Text style={bodyText}>
                Para hacer preguntas reales. Para dejar de fingir certezas. Para
                mirar de frente esa tensión entre la fe que recibiste y la fe
                que estás aprendiendo a construir ahora.
              </Text>
              <Text style={bodyText}>
                Si alguna vez sentiste que estabas entre lo que te enseñaron y
                lo que tu alma ya no podía seguir repitiendo, llegaste al lugar
                correcto.
              </Text>
              <Text style={intro}>Esto es lo que puedes hacer ahora:</Text>
              <Section style={steps}>
                <Text style={stepText}>
                  <strong>1. Únete al grupo</strong>
                  <br />
                  Ahí nos encontraremos entre sesiones, compartiremos
                  reflexiones y seguiremos acompañándonos durante toda la
                  experiencia.
                </Text>
                <Button
                  style={primaryButton}
                  href={communityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Entrar al grupo
                </Button>
                <Text style={stepText}>
                  <strong>2. Accede a tu guía de Rebuilding Reverence</strong>
                  <br />
                  Está incluida con tu compra y será tu compañera durante estas
                  cuatro semanas.
                </Text>
                <Button style={secondaryButton} href={journalLink}>
                  Abrir mi guía
                </Button>
                <Text style={stepText}>
                  <strong>3. Preséntate dentro del grupo</strong>
                  <br />
                  No tiene que ser algo largo. Tu nombre y qué te trajo hasta
                  aquí es más que suficiente.
                </Text>
                <Text style={stepText}>
                  <strong>4. Mantente atenta a tu fecha de inicio</strong>
                  <br />
                  The Circle comenzará cuando lleguemos a 15 personas. Apenas el
                  grupo esté completo, recibirás un correo con la fecha oficial
                  de inicio y, al menos, dos semanas de aviso antes de nuestra
                  primera sesión.
                </Text>
              </Section>
              <Text style={bodyText}>
                Antes de empezar, quiero decirte algo con honestidad: este no es
                un espacio donde voy a entregarte respuestas cerradas.
              </Text>
              <Text style={bodyText}>
                Es un espacio para sentarnos juntas en lo real.
              </Text>
              <Text style={bodyText}>
                En la tensión entre fe y duda. Entre estructura y libertad.
                Entre pertenecer y convertirte en quien eres.
              </Text>
              <Text style={bodyText}>
                Y desde ahí, empezar a distinguir qué es verdad para ti, no solo
                qué te dijeron que tenía que serlo.
              </Text>
              <Text style={bodyText}>
                De verdad me honra acompañarte en este proceso.
              </Text>
              <Text style={signature}>
                Con amor,
                <br />
                Ashley
              </Text>
              <Text style={fallbackText}>
                Si alguno de los botones no abre, usa estos enlaces:
                <br />
                Grupo:{" "}
                <Link
                  href={communityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkAnchor}
                >
                  {communityLink}
                </Link>
                <br />
                Guía:{" "}
                <Link href={journalLink} style={linkAnchor}>
                  {journalLink}
                </Link>
              </Text>
            </>
          ) : (
            <>
              <Heading style={h1}>You&apos;re in.</Heading>
              <Text style={bodyText}>Hi {firstName},</Text>
              <Text style={bodyText}>
                Welcome to Rebuilding Reverence Circle. I&apos;m so glad
                you&apos;re here.
              </Text>
              <Text style={bodyText}>
                Over the next four weeks, we&apos;re going to reclaim reverence
                together - not the fear-based, performance-based version many of
                us were handed, but something rooted, honest, and yours. This is
                a space for asking real questions, not performing certainty. If
                you&apos;ve felt caught between the faith you were given and the
                faith you&apos;re still building, you&apos;re exactly who this
                is for.
              </Text>
              <Text style={intro}>Here&apos;s what to do next:</Text>
              <Section style={steps}>
                <Text style={stepText}>
                  <strong>1. Join the group</strong> - this is where we&apos;ll
                  connect between sessions, share reflections, and stay in
                  community throughout the experience.
                </Text>
                <Button
                  style={primaryButton}
                  href={communityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rebuilding Reverence Circle
                </Button>
                <Text style={stepText}>
                  <strong>2. Access your Rebuilding Reverence Journal</strong> -
                  included with your purchase, this is your companion for the
                  next four weeks.
                </Text>
                <Button style={secondaryButton} href={journalLink}>
                  Access Your Journal
                </Button>
                <Text style={stepText}>
                  <strong>
                    3. Introduce yourself in the group once you&apos;re in.
                  </strong>{" "}
                  Just a name and what brought you here is more than enough.
                </Text>
                <Text style={stepText}>
                  <strong>4. Watch for your start date</strong> - Rebuilding
                  Reverence Circle begins once we reach 15 members. As soon as
                  we hit that number, you&apos;ll receive an email with your
                  official start date, along with at least 2 weeks&apos; notice
                  before our first session.
                </Text>
              </Section>
              <Text style={bodyText}>
                A few honest words before we begin: this isn&apos;t a space
                where I hand you resolved answers. It&apos;s a space where we
                sit in the real tension together - faith and doubt, structure
                and freedom, belonging and becoming - and figure out what&apos;s
                actually true for you, not just what you were told was true.
              </Text>
              <Text style={bodyText}>
                I&apos;m genuinely honored to hold this with you.
              </Text>
              <Text style={signature}>
                With love,
                <br />
                Ashley
              </Text>
              <Text style={fallbackText}>
                If either button does not open, use these links:
                <br />
                Group:{" "}
                <Link
                  href={communityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkAnchor}
                >
                  {communityLink}
                </Link>
                <br />
                Journal:{" "}
                <Link href={journalLink} style={linkAnchor}>
                  {journalLink}
                </Link>
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

const colors = {
  background: "#f4efec",
  card: "#f9f8f6",
  text: "#2b2b2b",
  mutedText: "#6b6b6b",
  accentLight: "#d1d1c2",
  primary: "#bd775c",
  secondary: "#8f7652",
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
  fontSize: "32px",
  fontWeight: 600,
  margin: "0 40px 24px",
  textAlign: "center" as const,
};

const intro = {
  color: colors.text,
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "26px",
  margin: "24px 40px 12px",
};

const bodyText = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 40px 16px",
};

const steps = {
  backgroundColor: "rgba(166, 166, 140, 0.08)",
  borderRadius: "12px",
  border: "1px solid rgba(166, 166, 140, 0.25)",
  margin: "0 40px 24px",
  padding: "20px 24px",
  width: "calc(100% - 80px)",
  maxWidth: "calc(100% - 80px)",
  boxSizing: "border-box" as const,
};

const stepText = {
  color: colors.text,
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const primaryButton = {
  backgroundColor: colors.primary,
  borderRadius: "9999px",
  color: "#f9f8f6",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  margin: "0 0 20px",
  padding: "13px 24px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const secondaryButton = {
  ...primaryButton,
  backgroundColor: colors.secondary,
};

const signature = {
  color: colors.text,
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: "17px",
  lineHeight: "28px",
  margin: "24px 40px 0",
};

const fallbackText = {
  color: colors.mutedText,
  fontSize: "13px",
  lineHeight: "21px",
  margin: "32px 40px 0",
  wordBreak: "break-word" as const,
};

const linkAnchor = {
  color: colors.secondary,
  textDecoration: "underline",
};
