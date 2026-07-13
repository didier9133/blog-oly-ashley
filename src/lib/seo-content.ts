import type { SupportedLocale } from "@/lib/seo";

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

type PostSeoDecision = {
  category: BlogCategory;
  categoryEs: (typeof BLOG_CATEGORIES_ES)[number];
  productCta: ProductCtaKey;
  primaryKeyword?: Partial<Record<SupportedLocale, string>>;
  seoTitle?: Partial<Record<SupportedLocale, string>>;
  description?: Partial<Record<SupportedLocale, string>>;
};

export const POST_SEO_DECISIONS: Record<string, PostSeoDecision> = {
  "deconstruction-and-beyond-a-story-of-loss-and-rebirth": {
    category: "Rebuilding Faith",
    categoryEs: "Reconstrucción de la fe",
    productCta: "rebuilding-reverence",
    primaryKeyword: {
      en: "how to rebuild faith after deconstruction",
      es: "cómo reconstruir la fe después de la deconstrucción",
    },
    seoTitle: {
      en: "How to Rebuild Faith After Deconstruction | Ashley Leon",
      es: "Cómo reconstruir la fe después de la deconstrucción | Ashley Leon",
    },
    description: {
      en: "A personal and practical reflection on life after faith deconstruction, rebuilding spiritual trust, and creating a sacred life without returning to self-abandonment.",
      es: "Una reflexión personal sobre la vida después de la deconstrucción, la reconstrucción de la confianza espiritual y la búsqueda de una fe más honesta.",
    },
  },
  "seeking-first-again": {
    category: "Rebuilding Faith",
    categoryEs: "Reconstrucción de la fe",
    productCta: "rebuilding-reverence",
  },
  "the-god-who-doesnt-play-by-our-rules": {
    category: "Queer Faith & Identity",
    categoryEs: "Fe e identidad LGBTQ+",
    productCta: "queer-and-called",
  },
  "what-does-belonging-really-mean": {
    category: "Community & Belonging",
    categoryEs: "Comunidad y pertenencia",
    productCta: "community",
  },
  "que-significa-realmente-pertenecer": {
    category: "Community & Belonging",
    categoryEs: "Comunidad y pertenencia",
    productCta: "community",
  },
};

export function getPostSeoDecision(...slugs: (string | null | undefined)[]) {
  for (const slug of slugs) {
    if (slug && POST_SEO_DECISIONS[slug]) return POST_SEO_DECISIONS[slug];
  }
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
