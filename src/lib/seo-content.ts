import type { SupportedLocale } from "@/lib/seo";
import type { ArticleSemanticRules } from "@/lib/article-semantics";

export type ProductCtaKey =
  | "rebuilding-reverence"
  | "queer-and-called"
  | "circle"
  | "community"
  | "newsletter"
  | "none";

export type BlogCategory =
  | "Faith Deconstruction"
  | "Rebuilding Faith"
  | "Religious Trauma & Church Hurt"
  | "Queer Faith & Identity"
  | "Community & Belonging";

export const BLOG_CATEGORIES = [
  "Faith Deconstruction",
  "Rebuilding Faith",
  "Religious Trauma & Church Hurt",
  "Queer Faith & Identity",
  "Community & Belonging",
] as const satisfies readonly BlogCategory[];

export const BLOG_CATEGORIES_ES = [
  "Deconstrucción de la fe",
  "Reconstrucción de la fe",
  "Trauma religioso y heridas de iglesia",
  "Fe e identidad LGBTQ+",
  "Comunidad y pertenencia",
] as const;

export const SPANISH_INFORMATIONAL_ACQUISITION = [
  {
    topic: "definition",
    primary: "qué es la deconstrucción de la fe",
    productCta: "rebuilding-reverence",
  },
  {
    topic: "reconstruction",
    primary: "cómo reconstruir la fe después de la deconstrucción",
    productCta: "rebuilding-reverence",
  },
  {
    topic: "religious-harm",
    primary: "qué es el trauma religioso",
    productCta: "rebuilding-reverence",
  },
  {
    topic: "community",
    primary: "cómo encontrar comunidad después de dejar la iglesia",
    productCta: "community",
  },
  {
    topic: "lgbtq-faith",
    primary: "cómo reconciliar la fe y la sexualidad",
    productCta: "queer-and-called",
  },
] as const satisfies readonly {
  topic: string;
  primary: string;
  productCta: Exclude<ProductCtaKey, "none" | "newsletter">;
}[];

export type SpanishCommercialCluster = {
  status: "hypothesis";
  role: "product-description-and-conversion";
  phrases: readonly [string, ...string[]];
};

/**
 * These phrases describe the Spanish offers naturally. They are intentionally
 * marked as hypotheses and must not be reported as validated equivalents of
 * the English transactional keywords without market-specific evidence.
 */
export const SPANISH_COMMERCIAL_CLUSTERS = {
  "rebuilding-reverence": {
    status: "hypothesis",
    role: "product-description-and-conversion",
    phrases: [
      "guía para reconstruir la fe",
      "diario guiado de deconstrucción",
      "guía sobre trauma religioso",
    ],
  },
  circle: {
    status: "hypothesis",
    role: "product-description-and-conversion",
    phrases: [
      "experiencia grupal para reconstruir la fe",
      "grupo en vivo después de la deconstrucción",
    ],
  },
  community: {
    status: "hypothesis",
    role: "product-description-and-conversion",
    phrases: [
      "comunidad para reconstruir la fe",
      "comunidad después de dejar la iglesia",
    ],
  },
  "queer-and-called": {
    status: "hypothesis",
    role: "product-description-and-conversion",
    phrases: [
      "guía de fe e identidad LGBTQ+",
      "guía para reconciliar la fe y la identidad",
    ],
  },
} as const satisfies Record<
  "rebuilding-reverence" | "queer-and-called" | "circle" | "community",
  SpanishCommercialCluster
>;

type CtaCopy = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
};

export const PRODUCT_CTAS: Record<
  SupportedLocale,
  Record<Exclude<ProductCtaKey, "none">, CtaCopy>
> = {
  en: {
    "rebuilding-reverence": {
      href: "/workbooks/rebuilding-reverence",
      eyebrow: "Continue the work",
      title: "Ready to explore what comes after deconstruction?",
      description:
        "Rebuilding Reverence is a guided 30-day workbook for examining inherited beliefs, rebuilding spiritual trust, and creating a faith that does not require abandoning yourself.",
      label: "Explore Rebuilding Reverence",
    },
    "queer-and-called": {
      href: "/workbooks/queer-and-called",
      eyebrow: "A next step for queer faith",
      title: "You do not have to choose between faith and identity.",
      description:
        "Queer & Called is an affirming guided workbook for exploring voice, faith, queerness, belonging, and spiritual wholeness.",
      label: "Explore Queer & Called",
    },
    circle: {
      href: "/circle",
      eyebrow: "Do the work in community",
      title: "You do not have to rebuild alone.",
      description:
        "The Rebuilding Reverence Circle is a live four-week guided group experience for people moving through faith deconstruction together.",
      label: "Explore the Circle",
    },
    community: {
      href: "/community",
      eyebrow: "Keep returning",
      title: "Find company for the in-between.",
      description:
        "The In-Between is a grounded, affirming online community for honest reflection, conversation, and belonging after deconstruction.",
      label: "Join The In-Between",
    },
    newsletter: {
      href: "/writing#newsletter",
      eyebrow: "Stay connected",
      title: "Receive new reflections from the in-between.",
      description:
        "Stories, affirmations, and reflections sent when there is something worth saying.",
      label: "Subscribe",
    },
  },
  es: {
    "rebuilding-reverence": {
      href: "/workbooks/reconstruyendo-la-reverencia",
      eyebrow: "Continúa el proceso",
      title: "Un siguiente paso para reconstruir después de la deconstrucción.",
      description:
        "Rebuilding Reverence es una guía práctica de 30 días para cuestionar creencias heredadas, reconstruir la confianza espiritual y volver a lo sagrado sin abandonarte.",
      label: "Explorar Rebuilding Reverence",
    },
    "queer-and-called": {
      href: "/workbooks/queer-y-llamados",
      eyebrow: "Un siguiente paso para tu fe y tu identidad",
      title: "No tienes que elegir entre tu fe y quien eres.",
      description:
        "Queer & Called es una guía afirmativa para explorar tu voz, tu fe, tu identidad LGBTQ+ y tu sentido de pertenencia.",
      label: "Explorar Queer & Called",
    },
    circle: {
      href: "/circle",
      eyebrow: "Atravesar el proceso en compañía",
      title: "No tienes que reconstruir tu fe en soledad.",
      description:
        "The Rebuilding Reverence Circle es una experiencia grupal en vivo de cuatro semanas para personas que están atravesando la deconstrucción de la fe.",
      label: "Explorar The Circle",
    },
    community: {
      href: "/community",
      eyebrow: "Un lugar al que seguir volviendo",
      title: "Encuentra compañía para este momento de transición.",
      description:
        "The In-Between es una comunidad privada para reflexionar, conversar con honestidad y reconstruir en compañía.",
      label: "Unirme a The In-Between",
    },
    newsletter: {
      href: "/writing#newsletter",
      eyebrow: "Sigamos en contacto",
      title: "Recibe nuevas reflexiones desde la transición.",
      description:
        "Historias, afirmaciones y reflexiones enviadas cuando hay algo que de verdad merece ser dicho.",
      label: "Suscribirme",
    },
  },
};

export type PostSeoDecision = {
  category: BlogCategory;
  categoryEs: (typeof BLOG_CATEGORIES_ES)[number];
  productCta: ProductCtaKey;
  modifiedAt?: string;
  displayTitle?: Partial<Record<SupportedLocale, string>>;
  lead?: Partial<Record<SupportedLocale, string>>;
  primaryKeyword?: Partial<Record<SupportedLocale, string>>;
  seoTitle?: Partial<Record<SupportedLocale, string>>;
  description?: Partial<Record<SupportedLocale, string>>;
  semanticRules?: Partial<Record<SupportedLocale, ArticleSemanticRules>>;
  relatedReading?: Partial<
    Record<
      SupportedLocale,
      readonly {
        href: string;
        label: string;
      }[]
    >
  >;
  relatedGuide?: Partial<
    Record<
      SupportedLocale,
      {
        href: string;
        eyebrow: string;
        title: string;
        description: string;
        label: string;
      }
    >
  >;
};

const BELONGING_SEO_DECISION: PostSeoDecision = {
  category: "Community & Belonging",
  categoryEs: "Comunidad y pertenencia",
  productCta: "community",
  modifiedAt: "2026-07-17",
  displayTitle: {
    en: "What Does Belonging Really Mean?",
    es: "¿Qué significa realmente pertenecer?",
  },
  lead: {
    en: "Belonging is not the absence of discomfort. It is being able to remain present, honest, and connected without having to disappear in order to be accepted.",
    es: "Pertenecer no significa vivir sin incomodidad. Es poder permanecer presente y en conexión, con honestidad, sin tener que desaparecer para que te acepten.",
  },
  primaryKeyword: {
    en: "what does belonging mean",
    es: "qué significa pertenecer",
  },
  seoTitle: {
    en: "What Does Belonging Really Mean? | Ashley Leon",
    es: "¿Qué significa realmente pertenecer? | Ashley Leon",
  },
  description: {
    en: "A personal reflection on belonging, shame, discomfort, and learning to remain connected without disappearing to be accepted.",
    es: "Una reflexión sobre pertenencia, vergüenza e incomodidad, y sobre cómo permanecer en conexión sin desaparecer para que te acepten.",
  },
  semanticRules: {
    en: {
      removeParagraphs: ["What Does Belonging Really Mean?"],
      insertBefore: [
        {
          beforeText: "And here’s the wild part:",
          headingText: "When Belonging Feels Unsafe",
        },
        {
          beforeText: "And yet—there’s another part of me.",
          headingText: "Rewriting What Belonging Means",
        },
      ],
    },
    es: {
      removeParagraphs: ["Qué Significa Realmente Pertenecer?"],
      insertBefore: [
        {
          beforeText: "Y lo curioso es esto:",
          headingText: "Cuando pertenecer se siente inseguro",
        },
        {
          beforeText: "Y sin embargo—hay otra parte de mí.",
          headingText: "Reescribir lo que significa pertenecer",
        },
      ],
    },
  },
};

export const POST_SEO_DECISIONS: Record<string, PostSeoDecision> = {
  "how-to-rebuild-faith-after-deconstruction": {
    category: "Rebuilding Faith",
    categoryEs: "Reconstrucción de la fe",
    productCta: "rebuilding-reverence",
    modifiedAt: "2026-07-17",
    displayTitle: {
      en: "How to Rebuild Faith After Deconstruction: A Story of Loss and Rebirth",
      es: "Cómo reconstruir la fe después de la deconstrucción: una historia de pérdida y renacimiento",
    },
    lead: {
      en: "Rebuilding faith after deconstruction is not about returning to the version of you who never questioned. It can be the slower work of keeping what is honest, releasing what required self-abandonment, and learning to trust the sacred again.",
      es: "Reconstruir la fe después de la deconstrucción no consiste en volver a ser quien eras antes de cuestionarlo todo. Puede ser el trabajo lento de conservar lo verdadero, soltar lo que exigía abandonarte y aprender a confiar de nuevo en lo sagrado.",
    },
    primaryKeyword: {
      en: "how to rebuild faith after deconstruction",
      es: "cómo reconstruir la fe después de la deconstrucción",
    },
    seoTitle: {
      en: "How to Rebuild Faith After Deconstruction | Ashley Leon",
      es: "Reconstruir la fe después de la deconstrucción | Ashley Leon",
    },
    description: {
      en: "A personal reflection on rebuilding faith after deconstruction, releasing self-abandonment, and learning to trust the sacred again.",
      es: "Una reflexión personal sobre reconstruir la fe después de la deconstrucción, soltar el autoabandono y volver a confiar en lo sagrado.",
    },
    semanticRules: {
      en: {
        promote: [
          { sourceTag: "p", sourceText: "Life After Deconstruction: Where Do We Go Next?" },
          { sourceTag: "p", sourceText: "Life Before Deconstruction" },
          { sourceTag: "p", sourceText: "When It Started Cracking" },
          { sourceTag: "p", sourceText: "What Deconstruction Cost Me" },
          { sourceTag: "p", sourceText: "The “What Now?”" },
          { sourceTag: "p", sourceText: "A New Way" },
          { sourceTag: "p", sourceText: "Still Searching" },
          { sourceTag: "p", sourceText: "The Question I Can’t Shake" },
        ],
      },
      es: {
        promote: [
          { sourceTag: "h3", sourceText: "Vida Después de la Deconstrucción: ¿A Dónde Vamos Ahora?" },
          { sourceTag: "h3", sourceText: "La Vida Antes de la Deconstrucción" },
          { sourceTag: "h3", sourceText: "Cuando Empezó a Quebrarse" },
          { sourceTag: "h3", sourceText: "Lo Que Me Costó la Deconstrucción" },
          { sourceTag: "h3", sourceText: "El “¿Y Ahora Qué?”" },
          { sourceTag: "h3", sourceText: "Un Nuevo Camino" },
          { sourceTag: "h3", sourceText: "Aún Buscando" },
          { sourceTag: "h3", sourceText: "La Pregunta Que No Puedo Soltar" },
        ],
      },
    },
    relatedGuide: {
      en: {
        href: "/deconstructing-christianity",
        eyebrow: "Start with the foundation",
        title: "What does deconstructing Christianity mean?",
        description:
          "Read the complete guide to faith deconstruction, why it happens, what it can feel like, and the different directions it may take.",
        label: "Read the deconstruction guide",
      },
    },
  },
  "finding-spiritual-balance-between-faith-and-material-life": {
    category: "Rebuilding Faith",
    categoryEs: "Reconstrucción de la fe",
    productCta: "rebuilding-reverence",
    modifiedAt: "2026-07-17",
    displayTitle: {
      en: "Seeking First Again: Spiritual Balance Between Faith and Material Life",
      es: "Volver a buscar primero: equilibrio espiritual entre fe y vida material",
    },
    lead: {
      en: "This is a reflection on holding spiritual devotion, ambition, money, and ordinary responsibility together—without treating any part of a human life as less sacred.",
      es: "Esta es una reflexión sobre cómo sostener la devoción espiritual, la ambición, el dinero y las responsabilidades cotidianas sin tratar ninguna parte de la vida como menos sagrada.",
    },
    primaryKeyword: {
      en: "spiritual balance between faith and material life",
      es: "equilibrio espiritual entre fe y vida material",
    },
    seoTitle: {
      en: "Spiritual Balance Between Faith and Material Life | Ashley Leon",
      es: "Equilibrio espiritual entre fe y vida material | Ashley Leon",
    },
    description: {
      en: "A personal reflection on seeking God first while finding a healthier spiritual balance between faith, ambition, material life, and everyday responsibility.",
      es: "Una reflexión sobre buscar a Dios primero sin abandonar la ambición, la estabilidad material ni las responsabilidades de la vida cotidiana.",
    },
    semanticRules: {
      en: {
        insertBefore: [
          {
            beforeText: "What I’ve been noticing lately is how healing often works like a pendulum.",
            headingText: "When Healing Swings Like a Pendulum",
            match: "startsWith",
          },
          {
            beforeText: "Today, it feels like the tables have completely turned.",
            headingText: "When Material Security Takes Over",
            match: "startsWith",
          },
          {
            beforeText: "And lately, I’ve been wondering… what if I have it backwards?",
            headingText: "Finding Spiritual Balance Again",
          },
        ],
      },
      es: {
        insertBefore: [
          {
            beforeText: "Lo que he estado notando últimamente es cómo la sanación a menudo funciona como un péndulo.",
            headingText: "Cuando la sanación se mueve como un péndulo",
            match: "startsWith",
          },
          {
            beforeText: "Hoy, parece que las mesas se han volteado por completo.",
            headingText: "Cuando la seguridad material ocupa el centro",
            match: "startsWith",
          },
          {
            beforeText: "Y últimamente, me he estado preguntando… ¿y si lo tengo al revés?",
            headingText: "Volver a encontrar equilibrio espiritual",
          },
        ],
      },
    },
    relatedReading: {
      en: [
        {
          href: "/writing/how-to-rebuild-faith-after-deconstruction",
          label: "Continue with how faith can be rebuilt after deconstruction",
        },
      ],
      es: [
        {
          href: "/writing/como-reconstruir-la-fe-despues-de-la-deconstruccion",
          label: "Continúa con una reflexión sobre reconstruir la fe después de la deconstrucción",
        },
      ],
    },
  },
  "grief-after-miscarriage-and-the-life-you-imagined": {
    category: "Community & Belonging",
    categoryEs: "Comunidad y pertenencia",
    productCta: "newsletter",
    modifiedAt: "2026-07-17",
    displayTitle: {
      en: "Missing What Never Was: Grief After Miscarriage",
      es: "Extrañar lo que nunca fue: duelo gestacional",
    },
    lead: {
      en: "Grief after miscarriage does not only belong to the life that was lost. Sometimes it also lives in the future you imagined, the relationship you expected, and the body that still remembers.",
      es: "El duelo gestacional no vive únicamente en la vida que se perdió. A veces también habita el futuro que imaginaste, la relación que esperabas y el cuerpo que todavía recuerda.",
    },
    primaryKeyword: {
      en: "grief after miscarriage",
      es: "duelo gestacional",
    },
    seoTitle: {
      en: "Grief After Miscarriage: The Life You Imagined | Ashley Leon",
      es: "Duelo gestacional por la vida que imaginaste | Ashley Leon",
    },
    description: {
      en: "A personal reflection on grief after miscarriage, the future you imagined, and giving your body permission to mourn what never came to be.",
      es: "Una reflexión íntima sobre el duelo gestacional, la vida que imaginaste y el permiso de llorar lo que no llegó a suceder.",
    },
    semanticRules: {
      en: {
        insertBefore: [
          {
            beforeText:
              "There are days I go back to the imagination I had of what my baby was going to be like.",
            headingText: "Grieving the Life I Imagined",
            match: "startsWith",
          },
          {
            beforeText: "And yet I still hold the tension.",
            headingText: "Holding Two Truths at Once",
            match: "startsWith",
          },
          {
            beforeText: "What I do know is this:",
            headingText: "Giving Grief Permission to Exist",
            match: "startsWith",
          },
        ],
      },
      es: {
        insertBefore: [
          {
            beforeText:
              "Hay días en los que regreso a la imaginación que tenía de cómo iba a ser mi bebé.",
            headingText: "Llorar la vida que imaginé",
            match: "startsWith",
          },
          {
            beforeText: "Y aun así sigo sosteniendo la tensión.",
            headingText: "Sostener dos verdades a la vez",
            match: "startsWith",
          },
          {
            beforeText: "Lo que sí sé es esto:",
            headingText: "Darle permiso al duelo para existir",
            match: "startsWith",
          },
        ],
      },
    },
    relatedReading: {
      en: [
        {
          href: "/writing/what-does-belonging-really-mean",
          label: "Read a reflection on what belonging can mean",
        },
      ],
      es: [
        {
          href: "/writing/que-significa-realmente-pertenecer",
          label: "Lee una reflexión sobre lo que significa pertenecer",
        },
      ],
    },
  },
  "gay-christian-and-gods-unconditional-love": {
    category: "Queer Faith & Identity",
    categoryEs: "Fe e identidad LGBTQ+",
    productCta: "queer-and-called",
    modifiedAt: "2026-07-17",
    displayTitle: {
      en: "Gay, Christian, and Held by God’s Unconditional Love",
      es: "Fe LGBTQ+ y el amor incondicional de Dios",
    },
    lead: {
      en: "Being gay and Christian is not a contradiction that must be solved. This is a reflection on conditional religion, coming out, and receiving God’s love without abandoning yourself.",
      es: "Ser LGBTQ+ y vivir la fe no es una contradicción que tengas que resolver. Esta es una reflexión sobre la religión condicional, salir del clóset y recibir el amor de Dios sin abandonarte.",
    },
    primaryKeyword: {
      en: "gay Christian and God's unconditional love",
      es: "fe LGBTQ+ y amor incondicional de Dios",
    },
    seoTitle: {
      en: "Gay Christian and God’s Unconditional Love | Ashley Leon",
      es: "Fe LGBTQ+ y amor incondicional de Dios | Ashley Leon",
    },
    description: {
      en: "A queer Christian reflection on coming out, conditional religion, and learning to trust God’s unconditional love without abandoning your identity.",
      es: "Una reflexión cristiana LGBTQ+ sobre salir del clóset, cuestionar la religión condicional y confiar en el amor incondicional de Dios sin abandonar tu identidad.",
    },
    semanticRules: {
      en: {
        promote: [
          { sourceTag: "p", sourceText: "What Kind of God Do You Believe In?" },
          { sourceTag: "p", sourceText: "A Conditional God Feels Familiar" },
          { sourceTag: "p", sourceText: "The First Blueprint for Love" },
          { sourceTag: "p", sourceText: "The Unconditional God" },
          { sourceTag: "p", sourceText: "A Question for You" },
        ],
      },
      es: {
        promote: [
          { sourceTag: "p", sourceText: "¿En qué tipo de Dios crees?" },
          { sourceTag: "p", sourceText: "Un Dios condicional se siente familiar" },
          { sourceTag: "p", sourceText: "El primer molde de amor" },
          { sourceTag: "p", sourceText: "El Dios incondicional" },
          { sourceTag: "p", sourceText: "Una pregunta para ti" },
        ],
      },
    },
  },
  "what-does-belonging-really-mean": BELONGING_SEO_DECISION,
  "que-significa-realmente-pertenecer": BELONGING_SEO_DECISION,
  "dont-take-advice-from-someone-whose-life-you-dont-want": {
    category: "Community & Belonging",
    categoryEs: "Comunidad y pertenencia",
    productCta: "newsletter",
    modifiedAt: "2026-07-17",
    lead: {
      en: "Advice deserves discernment, not automatic obedience or automatic dismissal. The question is not only whether you want someone’s life, but whether the truth they offer bears good fruit in yours.",
      es: "Los consejos merecen discernimiento, no obediencia automática ni rechazo inmediato. La pregunta no es solo si deseas la vida de alguien, sino si la verdad que ofrece da buen fruto en la tuya.",
    },
    primaryKeyword: {
      en: "don't take advice from someone whose life you don't want",
      es: "de quién aceptar consejos",
    },
    seoTitle: {
      en: "Don’t Take Advice From Someone Whose Life You Don’t Want",
      es: "¿De quién deberías aceptar consejos? | Ashley Leon",
    },
    description: {
      en: "A reflection on whose advice to trust, how inherited beliefs shape us, and staying open to wisdom without surrendering discernment.",
      es: "Una reflexión sobre qué consejos escuchar, cómo nos forman las creencias heredadas y cómo abrirnos a la sabiduría sin renunciar al discernimiento.",
    },
    semanticRules: {
      en: {
        insertBefore: [
          {
            beforeText: "But here’s the tension I’ve been sitting with lately:",
            headingText: "When a Helpful Filter Becomes a Wall",
            match: "startsWith",
          },
          {
            beforeText: "So then the question becomes:",
            headingText: "Discernment Without Dismissing People",
          },
        ],
      },
      es: {
        insertBefore: [
          {
            beforeText: "Pero aquí está la tensión con la que he estado sentada últimamente:",
            headingText: "Cuando un filtro útil se convierte en un muro",
          },
          {
            beforeText: "Entonces la pregunta se vuelve:",
            headingText: "Discernir sin descartar a las personas",
          },
        ],
      },
    },
    relatedReading: {
      en: [
        {
          href: "/writing/what-does-belonging-really-mean",
          label: "Continue with a reflection on belonging and discomfort",
        },
      ],
      es: [
        {
          href: "/writing/que-significa-realmente-pertenecer",
          label: "Continúa con una reflexión sobre pertenencia e incomodidad",
        },
      ],
    },
  },
};

export function getPostSeoDecision(...slugs: (string | null | undefined)[]) {
  for (const slug of slugs) {
    if (slug && POST_SEO_DECISIONS[slug]) return POST_SEO_DECISIONS[slug];
  }
}

export function getPostModifiedAt(
  fallback: Date,
  ...slugs: (string | null | undefined)[]
) {
  const modifiedAt = getPostSeoDecision(...slugs)?.modifiedAt;
  return modifiedAt
    ? new Date(`${modifiedAt}T12:00:00.000Z`)
    : fallback;
}

type WorkbookIntentSection = {
  title: string;
  body: string;
  disclaimer: string;
};

type CommercialSeo = {
  title: string;
  description: string;
  supportingLine: string;
  intentSection?: WorkbookIntentSection;
};

export function getWorkbookSeo(
  locale: SupportedLocale,
  englishSlug: string,
): CommercialSeo | undefined {
  const content: Record<string, Record<SupportedLocale, CommercialSeo>> = {
    "rebuilding-reverence": {
      en: {
        title: "Religious Trauma Workbook | Rebuilding Reverence",
        description: "A guided 30-day religious trauma workbook for reflecting on religious harm, inherited beliefs, spiritual burnout, and rebuilding trust without abandoning yourself.",
        supportingLine: "A guided 30-day religious trauma workbook for reflection after religious harm.",
        intentSection: {
          title: "A Religious Trauma Workbook for Gentle Reflection",
          body: "Rebuilding Reverence is a guided 30-day religious trauma workbook for people examining inherited beliefs, spiritual burnout, church hurt, and the ways religious experiences may still shape the body, identity, and sense of trust. Through reflective prompts and gentle practices, it offers space to name what happened, listen to your inner wisdom, and explore what a more honest relationship with faith or the sacred could look like.",
          disclaimer: "This workbook is an educational and reflective resource. It does not diagnose or treat trauma and is not a substitute for therapy or other professional care.",
        },
      },
      es: {
        title: "Guía para reconstruir la fe | Rebuilding Reverence",
        description: "Una guía práctica de 30 días para cuestionar creencias heredadas, procesar el daño religioso y reconstruir una fe más honesta sin abandonarte.",
        supportingLine: "Una guía práctica de 30 días para acompañar el daño religioso y reconstruir una fe más honesta.",
        intentSection: {
          title: "Una guía para acompañar el daño religioso con reflexión y cuidado",
          body: "Rebuilding Reverence es una guía práctica de 30 días para quienes desean comprender cómo las creencias heredadas, el cansancio espiritual, las heridas de iglesia o las experiencias religiosas difíciles siguen influyendo en su cuerpo, su identidad y su capacidad de confiar. Con preguntas guiadas y prácticas amables, ofrece un espacio para nombrar lo vivido, volver a escuchar tu brújula interna y explorar cómo sería una relación más honesta con la fe o lo sagrado.",
          disclaimer: "Es un recurso educativo y de reflexión. No diagnostica ni trata el trauma, ni sustituye la terapia u otra atención profesional.",
        },
      },
    },
    "queer-and-called": {
      en: {
        title: "LGBTQ Christian Workbook | Queer & Called by Ashley Leon",
        description: "A guided 30-day workbook for exploring LGBTQ identity, faith, spiritual belonging, voice, and wholeness without having to choose between them.",
        supportingLine: "An affirming LGBTQ faith and identity workbook.",
      },
      es: {
        title: "Guía de fe e identidad LGBTQ+ | Queer & Called",
        description: "Una guía afirmativa de 30 días para explorar tu fe, tu identidad LGBTQ+, tu voz y tu sentido de pertenencia sin tener que elegir entre ellos.",
        supportingLine: "Una guía afirmativa para reconciliar tu fe, tu identidad y tu voz.",
      },
    },
  };
  return content[englishSlug]?.[locale];
}
