import { BASE_URL, fullUrl } from "@/lib/url";

export const SCHEMA_ENTITY_IDS = {
  organization: `${BASE_URL}/#organization`,
  person: `${BASE_URL}/#ashley-diana-leon`,
  website: `${BASE_URL}/#website`,
} as const;

export const ASHLEY_SAME_AS = [
  "https://www.instagram.com/ashleyleon",
  "https://www.youtube.com/@ashleyleon",
  "https://ashleyleon.substack.com",
] as const;

export const organizationRef = {
  "@type": "Organization",
  "@id": SCHEMA_ENTITY_IDS.organization,
  name: "Ashley Leon",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/apple-touch-icon-adl.png`,
    width: 180,
    height: 180,
  },
} as const;

export const personRef = {
  "@type": "Person",
  "@id": SCHEMA_ENTITY_IDS.person,
  name: "Ashley Diana Leon",
  url: fullUrl("en", "/about"),
  image: `${BASE_URL}/profile4.jpeg`,
} as const;

export const websiteRef = {
  "@type": "WebSite",
  "@id": SCHEMA_ENTITY_IDS.website,
  name: "Ashley Leon",
  url: BASE_URL,
} as const;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": SCHEMA_ENTITY_IDS.organization,
  name: "Ashley Leon",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/apple-touch-icon-adl.png`,
    width: 180,
    height: 180,
  },
  founder: personRef,
  sameAs: [...ASHLEY_SAME_AS],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@ashleydianaleon.com",
    contactType: "customer support",
    availableLanguage: ["English", "Spanish"],
  },
} as const;

export function getOrganizationSchema(locale: string) {
  if (locale !== "es") return organizationSchema;

  return {
    ...organizationSchema,
    contactPoint: {
      ...organizationSchema.contactPoint,
      contactType: "atención al cliente",
      availableLanguage: ["español", "inglés"],
    },
  } as const;
}

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": SCHEMA_ENTITY_IDS.person,
  name: "Ashley Diana Leon",
  alternateName: "Ashley Leon",
  url: fullUrl("en", "/about"),
  jobTitle:
    "Writer, Workshop Facilitator, and Certified Holistic Mind-Body Coach",
  description:
    "Cuban-Colombian writer, former missionary, workshop facilitator, and certified holistic mind-body coach exploring faith deconstruction, queer spirituality, identity, and emotional healing.",
  image: `${BASE_URL}/profile4.jpeg`,
  worksFor: organizationRef,
  sameAs: [...ASHLEY_SAME_AS],
  knowsAbout: [
    "Faith deconstruction",
    "Queer spirituality",
    "Emotional healing",
    "Spiritual integration",
    "Guided reflective practice",
  ],
} as const;

export function getPersonSchema(locale: string) {
  if (locale !== "es") return personSchema;

  return {
    ...personSchema,
    url: fullUrl("es", "/about"),
    jobTitle:
      "Escritora, facilitadora de talleres y acompañante holística certificada en bienestar integral",
    description:
      "Escritora cubano-colombiana, exmisionera y facilitadora de talleres que explora la deconstrucción de la fe, la espiritualidad queer, la identidad y la sanación emocional.",
    knowsAbout: [
      "Deconstrucción de la fe",
      "Espiritualidad queer",
      "Sanación emocional",
      "Integración espiritual",
      "Prácticas guiadas de reflexión",
    ],
  } as const;
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SCHEMA_ENTITY_IDS.website,
  name: "Ashley Leon",
  url: BASE_URL,
  inLanguage: ["en", "es"],
  publisher: organizationRef,
} as const;
