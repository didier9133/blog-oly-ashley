export interface BookV2 {
  id: string;

  s3Key_es: string;
  s3Key_en: string;
  slug_en: string;
  slug_es: string;
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
  author: string;
  price: number;
  coverImage_en: string;
  coverImage_es: string;
  description_en: string;
  description_es: string;
  features_en: string[];
  features_es: string[];
  pages: number;
  format_en: string;
  format_es: string;
  language_en: string;
  language_es: string;
  isbn: string;
  rating: number;
  reviewCount: number;
  featured_review_en: string;
  featured_review_es: string;
  reviewerName: string;
}

export const books: BookV2[] = [
  {
    id: "1",
    s3Key_es: "ebooks/1761429904905_Queer_y_Llamados.pdf",
    s3Key_en: "ebooks/1761429451534_Queer___Called.pdf",
    slug_es: "queer-y-llamados",
    slug_en: "queer-and-called",
    title_en: "QUEER AND CALLED",
    title_es: "QUEER Y LLAMADOS",
    subtitle_en:
      "A sacred invitation to reclaim your voice, reimagine your faith, and return to yourself — whole and holy",
    subtitle_es:
      "Una invitación sagrada a reclamar tu voz, reimaginar tu fe y regresar a ti mismo — íntegro y sagrado",
    author: "Ashley Leon",
    price: 3300,
    coverImage_en: "/Queer_y_Called.jpeg",
    coverImage_es: "/Queer_y_Llamados.jpeg",
    description_en: `This journal was born from my own journey — one marked by exile and return, silence and rediscovery, unlearning lies and relearning the truth: that I was never too much, never too far, and was never supposed to choose between being queer and being called. I created this space for those who were told their faith and wholeness couldn't coexist. I no longer believe that, and I hope as you walk through these pages, you won't either.

This 30-day guided journal invites you into sacred reflection, honest questions, and gentle practices that honor both your identity and your spirituality. Each day offers prompts, affirmations, and space to process, reclaim, and reimagine what it means to be whole.`,
    description_es: `Este diario nació de mi propio viaje — uno marcado por el exilio y el regreso, por el silencio y el redescubrimiento, por desaprender las mentiras y volver a aprender la verdad: que nunca fui demasiado, nunca estuve muy lejos, y nunca se supuso que debía elegir entre ser queer y ser llamado. Creé este espacio para aquellos a quienes les dijeron que su fe y su plenitud no podían coexistir. Ya no creo eso, y espero que, a medida que recorras estas páginas, tú tampoco lo creas.

Este diario guiado de 30 días te invita a una reflexión sagrada, preguntas honestas y prácticas gentiles que honran tanto tu identidad como tu espiritualidad. Cada día ofrece prompts, afirmaciones y espacio para procesar, reclamar y reimaginar lo que significa ser íntegro.`,
    features_en: [
      "30 days of guided reflections and sacred prompts",
      "Daily affirmations for identity and faith integration",
      "Space for personal journaling and processing",
      "Spiritual practices rooted in affirmation",
      "Community connection guide included",
      "Beautifully designed with intentional layouts",
    ],
    features_es: [
      "30 días de reflexiones guiadas y prompts sagrados",
      "Afirmaciones diarias para integración de identidad y fe",
      "Espacio para escribir y procesar personalmente",
      "Prácticas espirituales enraizadas en afirmación",
      "Guía de conexión comunitaria incluida",
      "Bellamente diseñado con layouts intencionales",
    ],
    pages: 75,
    format_en: "Digital PDF",
    format_es: "PDF Digital",
    language_en: "English",
    language_es: "Español",
    isbn: "978-0-987654-32-1",
    rating: 4.9,
    reviewCount: 34,
    featured_review_en:
      "This journal gave me permission to be both queer and faithful without apology. It's tender, affirming, and deeply needed.",
    featured_review_es:
      "Este diario me dio permiso para ser tanto queer como fiel sin disculpas. Es tierno, afirmativo y profundamente necesario.",
    reviewerName: "María G.",
  },
  {
    id: "2",
    slug_en: "rebuilding-reverence",
    slug_es: "reconstruyendo-la-reverencia",
    s3Key_es: "ebooks/1761430437440_Reconstruyendo_la_Reverencia.pdf",
    s3Key_en: "ebooks/1761430103993_Rebuilding_Reverence.pdf",
    title_en: "Rebuilding Reverence",
    title_es: "Reconstruyendo la Reverencia",
    subtitle_en: "A 30-Day Journey to Reconnect with Your Inner Self",
    subtitle_es: "Un Viaje de 30 Días para Reconectar con Tu Ser Interior",
    author: "Ashley Leon",
    price: 3300,
    coverImage_es: "/Reconstruyendo_la_Reverencia.jpeg",
    coverImage_en: "/Rebuilding_Reverence.jpeg",
    description_en: `Embark on a transformative 30-day journey designed to help you reconnect with your authentic self and rediscover the reverence you deserve. Through daily reflections, guided exercises, and sacred practices, this journal becomes your companion in the path toward self-love and inner peace.

In a world that constantly demands more from us, this book invites you to pause, breathe, and honor your own rhythm. Each day presents a new theme, a gentle reminder that your story matters, your feelings are valid, and your healing is sacred.`,
    description_es: `Embárcate en un viaje transformador de 30 días diseñado para ayudarte a reconectar con tu ser auténtico y redescubrir la reverencia que mereces. A través de reflexiones diarias, ejercicios guiados y prácticas sagradas, este diario se convierte en tu compañero en el camino hacia el amor propio y la paz interior.

En un mundo que constantemente nos exige más, este libro te invita a pausar, respirar y honrar tu propio ritmo. Cada día presenta un nuevo tema, un recordatorio gentil de que tu historia importa, tus sentimientos son válidos y tu sanación es sagrada.`,
    features_en: [
      "30 days of guided reflections and exercises",
      "Sacred practices for self-care and healing",
      "Journal prompts for deep introspection",
      "Affirmations and mantras for daily use",
      "Beautifully designed pages with space for notes",
      "Access to exclusive community support",
    ],
    features_es: [
      "30 días de reflexiones y ejercicios guiados",
      "Prácticas sagradas para el autocuidado y la sanación",
      "Prompts de diario para introspección profunda",
      "Afirmaciones y mantras para uso diario",
      "Páginas bellamente diseñadas con espacio para notas",
      "Acceso a comunidad de apoyo exclusiva",
    ],
    pages: 120,
    format_en: "Digital PDF",
    format_es: "PDF Digital",
    language_en: "English",
    language_es: "Español",
    isbn: "978-0-987654-33-8",
    rating: 4.9,
    reviewCount: 234,
    featured_review_en:
      "This journal changed my life. The daily practices helped me find peace I didn't know I needed. Thank you for creating such a beautiful space for healing.",
    featured_review_es:
      "Este diario cambió mi vida. Las prácticas diarias me ayudaron a encontrar la paz que no sabía que necesitaba. Gracias por crear un espacio tan hermoso para sanar.",
    reviewerName: "Ana S.",
  },
];

export function getBookV2BySlug(slug: string): BookV2 | undefined {
  return books.find((book) => book.slug_en === slug || book.slug_es === slug);
}

export function getBookById(id: string): BookV2 | undefined {
  return books.find((book) => book.id === id);
}

export function getAllBooks(): BookV2[] {
  return books;
}
