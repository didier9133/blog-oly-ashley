import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChurchHurtGuideForm } from "@/components/church-hurt-guide-form";
import { JsonLd } from "@/components/json-ld";
import {
  indexableRobots,
  localizedAlternates,
  localizedOpenGraph,
  type SupportedLocale,
} from "@/lib/seo";
import { personRef, websiteRef } from "@/lib/schema-entities";
import { fullUrl, localizedHref, ogImageUrl } from "@/lib/url";
import styles from "./church-hurt-guide.module.css";

const PATH = "/church-hurt-guide";
const PATHS = { en: PATH, es: PATH } as const;

const COPY = {
  en: {
    metadataTitle: "Healing From Church Hurt | Free Guide | Ashley Leon",
    metadataDescription:
      "A free reflection guide for naming the tension church hurt can leave between faith, identity, and belonging—without pressure or a prescribed conclusion.",
    keywords: [
      "church hurt",
      "church hurt reflection guide",
      "faith after church hurt",
      "religious deconstruction",
    ],
    ogAlt:
      "Which Binary Are You Standing In? — a free church hurt reflection guide by Ashley Diana Leon",
    eyebrow: "Free church hurt guide · Five short reflections",
    headline: "Healing from Church Hurt Without Abandoning Yourself",
    heroContext: "When Faith, Identity, and Belonging Stop Fitting Together",
    supporting:
      "Every next step can start to feel like choosing a side — stay or leave, believe or doubt, forgive or walk away. This free reflection guide helps you name the tension underneath it, without telling you what to believe or where your questions should lead.",
    bridge:
      "— five short reflections. Start with the one that sounds most like your life right now.",
    coverAlt: "Cover of Which Binary Are You Standing In? by Ashley Diana Leon",
    aboutName: "Church hurt",
    guideDescription:
      "A free five-reflection guide for naming the tension church hurt can leave between faith, identity, and belonging.",
  },
  es: {
    metadataTitle: "Sanar el daño vivido en la iglesia | Ashley Leon",
    metadataDescription:
      "Una guía gratuita para ponerle nombre a la tensión entre fe, identidad y pertenencia después de una experiencia dolorosa en la iglesia, sin respuestas impuestas.",
    keywords: [
      "dolor vivido en la iglesia",
      "heridas de la iglesia",
      "deconstrucción de la fe",
      "guía de reflexión sobre la fe",
    ],
    ogAlt:
      "Which Binary Are You Standing In? — guía gratuita para sanar el daño vivido en la iglesia",
    eyebrow: "Guía gratuita para sanar · Cinco reflexiones breves",
    headline: "Sanar el daño vivido en la iglesia sin abandonarte",
    heroContext: "Cuando la fe, la identidad y la pertenencia dejan de encajar",
    supporting:
      "Cada paso puede sentirse como si tuvieras que elegir un lado: quedarte o irte, creer o dudar, perdonar o alejarte. Esta guía de reflexión gratuita te ayuda a ponerle nombre a la tensión que hay debajo, sin decirte qué creer ni hacia dónde deberían llevarte tus preguntas.",
    bridge:
      "— cinco reflexiones breves. Empieza por la que más se parezca a lo que estás viviendo hoy.",
    coverAlt:
      "Portada de Which Binary Are You Standing In? de Ashley Diana Leon",
    aboutName: "Dolor causado por experiencias en la iglesia",
    guideDescription:
      "Una guía gratuita con cinco reflexiones para reconocer la tensión entre la fe, la identidad y el sentido de pertenencia después de una experiencia dolorosa en la iglesia.",
  },
} as const satisfies Record<SupportedLocale, Record<string, unknown>>;

const HEALING_COPY = {
  en: {
    eyebrow: "A grounded place to begin",
    heading: "Healing from church hurt",
    lead: "Healing does not require you to excuse what happened, return to an unsafe community, or decide immediately what you believe. It can begin with telling the truth about the hurt and listening to what you need now.",
    cta: "Get the free reflection guide",
    definition:
      "Church hurt is emotional, spiritual, or relational pain connected to a church community, its leaders, its teachings, or the way authority was used. It can come from an obvious rupture, such as exclusion or manipulation, or from years of being taught to distrust your identity, questions, body, or judgment.",
    precision:
      "Not every painful church experience is trauma, and you do not need a clinical label for your experience to matter. Precise language can help: perhaps you experienced a breach of trust, spiritual control, conditional belonging, discrimination, public shame, or pressure to remain silent. Naming what happened is not the same as letting it define your whole story.",
    pillarPrefix:
      "For some people, church hurt becomes part of a wider process of questioning inherited beliefs. Our guide to",
    pillarLink: "deconstructing Christianity",
    pillarSuffix:
      "explains that process without assuming that healing must lead you back to church—or away from faith entirely.",
    steps: [
      {
        title: "Tell the truth without minimizing it",
        body: "You may have been encouraged to call harm a misunderstanding, conflict, or test of faith. Begin with the most honest description available to you. What happened? What did it cost you? What part of you learned that belonging depended on silence, obedience, or self-abandonment? You do not have to make the story dramatic for it to deserve care.",
      },
      {
        title: "Let safety come before reconciliation",
        body: "Forgiveness, reconciliation, access, and trust are different things. Reconciliation requires accountability and changed behavior; trust can only be rebuilt through consistent evidence. A boundary is not revenge. It is information about what contact, conversation, or environment you can participate in without abandoning yourself again.",
      },
      {
        title: "Move at the pace your body can hold",
        body: "Church hurt is not only an intellectual disagreement. Certain songs, buildings, phrases, or authority figures may bring tension, numbness, grief, or fear. You do not have to force yourself into religious spaces to prove that you are healed. Rest, movement, journaling, time outdoors, and predictable routines can create room to notice what your body has been carrying.",
      },
      {
        title: "Separate your questions from someone else’s deadline",
        body: "You are allowed to reconsider faith without producing a new statement of belief on demand. Some people remain Christian, some rebuild a different spiritual life, some leave religion, and some live without a final label. Healing is not measured by how quickly you become certain again. It may look like choosing one honest question at a time.",
      },
      {
        title: "Choose support that protects your agency",
        body: "Look for people who can listen without defending an institution, prescribing an outcome, or using your vulnerability to recruit you. A trusted friend, affirming community, coach, spiritual director, or licensed mental-health professional may each offer a different kind of support. If your daily functioning or safety is affected, qualified professional care is the appropriate next step.",
      },
    ],
    signsEyebrow: "Signs of movement",
    signsHeading: "What healing can look like",
    signs: [
      "Remembering what happened without being pulled entirely out of the present.",
      "Trusting your discomfort instead of automatically explaining it away.",
      "Setting a boundary without needing everyone to agree that it is reasonable.",
      "Choosing spiritual language or practices because they feel honest—not compulsory.",
      "Experiencing curiosity, rest, connection, or joy without feeling that you have betrayed your past.",
    ],
    promptsEyebrow: "Reflection prompts",
    promptsHeading: "Start with what is true now",
    prompts: [
      "What happened that I keep trying to make smaller?",
      "What did belonging require me to hide or surrender?",
      "Which boundaries would create more safety right now?",
      "What do I miss—and what do I not want back?",
      "Who can support me without deciding the outcome for me?",
    ],
    supportHeading: "A note about professional support",
    supportBody:
      "Ashley is a writer, workshop facilitator, and certified holistic mind-body coach—not a licensed therapist. This guide supports reflection and cannot diagnose or treat trauma. If you are experiencing severe distress, feeling unsafe, or struggling to function day to day, seek support from a qualified mental-health professional or an appropriate local crisis service.",
    approachLink: "About Ashley’s approach",
  },
  es: {
    eyebrow: "Un lugar firme para empezar",
    heading: "Sanar después del daño vivido en la iglesia",
    lead: "Sanar no te obliga a justificar lo ocurrido, regresar a una comunidad que no es segura ni decidir de inmediato qué creer. Puede empezar por decir la verdad sobre lo vivido y escuchar lo que necesitas hoy.",
    cta: "Recibir la guía gratuita",
    definition:
      "El daño vivido en la iglesia puede ser emocional, espiritual o relacional. Puede estar relacionado con una comunidad de fe, sus líderes, sus enseñanzas o la manera en que se ejerció la autoridad. A veces nace de una ruptura evidente —como la exclusión o la manipulación— y otras veces de años aprendiendo a desconfiar de tu identidad, tus preguntas, tu cuerpo o tu propio criterio.",
    precision:
      "No toda experiencia dolorosa en una iglesia es trauma, y no necesitas una etiqueta clínica para que lo que viviste importe. Ponerle un nombre más preciso puede ayudar: quizá hubo una ruptura de confianza, control espiritual, pertenencia condicionada, discriminación, vergüenza pública o presión para guardar silencio. Reconocer lo ocurrido no significa permitir que defina toda tu historia.",
    pillarPrefix:
      "Para algunas personas, este daño abre un proceso más amplio de revisión de las creencias heredadas. Nuestra guía para",
    pillarLink: "deconstruir el cristianismo",
    pillarSuffix:
      "explica ese proceso sin asumir que sanar tenga que llevarte de vuelta a una iglesia o necesariamente lejos de la fe.",
    steps: [
      {
        title: "Nombra lo ocurrido sin hacerlo más pequeño",
        body: "Tal vez te enseñaron a llamar malentendido, conflicto o prueba de fe a algo que realmente te hizo daño. Empieza por la descripción más honesta que puedas sostener. ¿Qué pasó? ¿Qué costo tuvo para ti? ¿Qué parte de ti aprendió que pertenecer exigía callar, obedecer o abandonarte? No tienes que exagerar la historia para que merezca cuidado.",
      },
      {
        title: "Pon la seguridad antes que la reconciliación",
        body: "Perdonar, reconciliarse, permitir acceso y volver a confiar no son la misma cosa. La reconciliación requiere responsabilidad y cambios reales; la confianza solo puede reconstruirse con evidencia sostenida. Un límite no es una venganza. Es una forma de reconocer qué contacto, conversación o entorno puedes habitar sin volver a abandonarte.",
      },
      {
        title: "Avanza al ritmo que tu cuerpo puede sostener",
        body: "El daño vivido en una iglesia no es solamente un desacuerdo intelectual. Algunas canciones, edificios, frases o figuras de autoridad pueden despertar tensión, desconexión, tristeza o miedo. No tienes que obligarte a entrar en espacios religiosos para demostrar que ya sanaste. El descanso, el movimiento, la escritura, el contacto con la naturaleza y las rutinas predecibles pueden darte espacio para escuchar lo que tu cuerpo ha estado cargando.",
      },
      {
        title: "Separa tus preguntas del apuro de los demás",
        body: "Tienes derecho a revisar tu fe sin presentar de inmediato una nueva declaración de creencias. Algunas personas permanecen dentro del cristianismo, otras reconstruyen una espiritualidad diferente, otras se alejan de la religión y otras viven sin una etiqueta definitiva. Sanar no se mide por la rapidez con la que vuelves a sentir certeza. A veces consiste en elegir una pregunta honesta a la vez.",
      },
      {
        title: "Busca apoyo que respete tu capacidad de elegir",
        body: "Busca personas capaces de escuchar sin defender una institución, imponerte un destino ni aprovechar tu vulnerabilidad para reclutarte. Una amistad de confianza, una comunidad afirmativa, una persona que acompaña procesos, una dirección espiritual o un profesional de salud mental pueden ofrecer apoyos diferentes. Si tu seguridad o tu vida cotidiana están siendo afectadas, lo indicado es buscar atención profesional cualificada.",
      },
    ],
    signsEyebrow: "Señales de movimiento",
    signsHeading: "Cómo puede verse la sanación",
    signs: [
      "Recordar lo ocurrido sin sentir que pierdes por completo el contacto con el presente.",
      "Confiar en tu incomodidad en vez de explicarla automáticamente para que desaparezca.",
      "Poner un límite sin necesitar que todo el mundo lo considere razonable.",
      "Elegir palabras o prácticas espirituales porque son honestas para ti, no porque sean obligatorias.",
      "Sentir curiosidad, descanso, conexión o alegría sin creer que estás traicionando tu pasado.",
    ],
    promptsEyebrow: "Preguntas para reflexionar",
    promptsHeading: "Empieza por lo que es verdad hoy",
    prompts: [
      "¿Qué ocurrió que todavía intento hacer más pequeño?",
      "¿Qué me exigía esconder o entregar para poder pertenecer?",
      "¿Qué límites podrían darme más seguridad en este momento?",
      "¿Qué extraño y qué no quiero recuperar?",
      "¿Quién puede acompañarme sin decidir el resultado por mí?",
    ],
    supportHeading: "Una nota sobre el acompañamiento profesional",
    supportBody:
      "Ashley es escritora, facilitadora de talleres y coach holística certificada de cuerpo y mente; no es terapeuta licenciada. Esta guía acompaña la reflexión, pero no puede diagnosticar ni tratar trauma. Si estás atravesando un malestar intenso, no te sientes a salvo o te cuesta realizar tus actividades cotidianas, busca apoyo de un profesional de salud mental cualificado o de un servicio de crisis de tu localidad.",
    approachLink: "Conoce el enfoque de Ashley",
  },
} as const;

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: SupportedLocale = locale === "es" ? "es" : "en";
  const copy = COPY[currentLocale];
  const image = ogImageUrl(currentLocale);

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    keywords: [...copy.keywords],
    authors: [{ name: "Ashley Diana Leon" }],
    creator: "Ashley Diana Leon",
    publisher: "Ashley Diana Leon",
    robots: indexableRobots,
    alternates: localizedAlternates(currentLocale, PATHS),
    openGraph: {
      type: "website",
      ...localizedOpenGraph(currentLocale),
      url: fullUrl(currentLocale, PATH),
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: copy.ogAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      images: [
        {
          url: image,
          alt: copy.ogAlt,
        },
      ],
    },
  };
}

export default async function ChurchHurtGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: SupportedLocale = locale === "es" ? "es" : "en";
  const copy = COPY[currentLocale];
  const healing = HEALING_COPY[currentLocale];
  const pageUrl = fullUrl(currentLocale, PATH);
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: copy.headline,
    description: copy.metadataDescription,
    url: pageUrl,
    inLanguage: currentLocale,
    isPartOf: websiteRef,
    about: {
      "@type": "Thing",
      name: copy.aboutName,
    },
    mainEntity: {
      "@id": `${pageUrl}#guide`,
    },
  };
  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "@id": `${pageUrl}#guide`,
    name: "Which Binary Are You Standing In?",
    description: copy.guideDescription,
    url: pageUrl,
    inLanguage: "en",
    isAccessibleForFree: true,
    numberOfPages: 9,
    author: personRef,
  };

  return (
    <>
      <JsonLd data={pageSchema} />
      <JsonLd data={guideSchema} />

      <main data-page="church-hurt-guide" className={styles.page}>
        <section
          aria-labelledby="church-hurt-guide-title"
          className={styles.hero}
        >
          <div aria-hidden="true" className={styles.orbit} />

          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{copy.eyebrow}</p>

              <h1 id="church-hurt-guide-title" className={styles.title}>
                {copy.headline}
              </h1>

              {copy.heroContext ? (
                <p className={styles.heroContext}>{copy.heroContext}</p>
              ) : null}

              <p className={styles.supporting}>{copy.supporting}</p>

              <div id="church-hurt-guide-form" className={styles.formWrap}>
                <ChurchHurtGuideForm locale={currentLocale} />
              </div>

              <div className={styles.heroRule} />

              <p className={styles.bridge}>
                <em>Which Binary Are You Standing In?</em> {copy.bridge}
              </p>
            </div>

            <div className={styles.coverWrap}>
              <div aria-hidden="true" className={styles.coverBacking} />
              <div aria-hidden="true" className={styles.coverLine} />
              <figure className={styles.cover}>
                <Image
                  src="/which-binary-guide-cover.jpg"
                  alt={copy.coverAlt}
                  width={612}
                  height={792}
                  sizes="(max-width: 1023px) 400px, 25rem"
                  className={styles.coverImage}
                  priority
                />
              </figure>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="healing-from-church-hurt"
          className={styles.contentSection}
        >
          <div className={styles.editorialGrid}>
            <aside className={styles.editorialAside}>
              <p className={styles.sectionEyebrow}>{healing.eyebrow}</p>
              <h2
                id="healing-from-church-hurt"
                className={styles.sectionHeading}
              >
                {healing.heading}
              </h2>
              <p className={styles.sectionLead}>{healing.lead}</p>
              <Link
                href="#church-hurt-guide-form"
                className={styles.sectionCta}
              >
                {healing.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </aside>

            <div className={styles.contentColumn}>
              <div className={styles.introCopy}>
                <p>{healing.definition}</p>
                <p>{healing.precision}</p>
                <p>
                  {healing.pillarPrefix}{" "}
                  <Link
                    href={localizedHref(
                      currentLocale,
                      "/deconstructing-christianity",
                    )}
                    className={styles.inlineLink}
                  >
                    {healing.pillarLink}
                  </Link>{" "}
                  {healing.pillarSuffix}
                </p>
              </div>

              <div className={styles.steps}>
                {healing.steps.map((step, index) => (
                  <article key={step.title} className={styles.step}>
                    <p className={styles.stepNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div>
                      <h3 className={styles.stepHeading}>{step.title}</h3>
                      <p className={styles.stepBody}>{step.body}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.featureGrid}>
                <div>
                  <p className={styles.cardEyebrow}>{healing.signsEyebrow}</p>
                  <h2 className={styles.cardHeading}>{healing.signsHeading}</h2>
                  <ul className={styles.signsList}>
                    {healing.signs.map((item) => (
                      <li key={item} className={styles.signItem}>
                        <span aria-hidden="true" className={styles.signMark} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.promptCard}>
                  <p className={styles.cardEyebrow}>{healing.promptsEyebrow}</p>
                  <h2 className={styles.cardHeading}>
                    {healing.promptsHeading}
                  </h2>
                  <ol className={styles.promptList}>
                    {healing.prompts.map((item, index) => (
                      <li key={item} className={styles.promptItem}>
                        <span className={styles.promptNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className={styles.supportNote}>
                <h2 className={styles.supportHeading}>
                  {healing.supportHeading}
                </h2>
                <p className={styles.supportBody}>{healing.supportBody}</p>
                <Link
                  href={localizedHref(currentLocale, "/about")}
                  className={styles.approachLink}
                >
                  {healing.approachLink}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
