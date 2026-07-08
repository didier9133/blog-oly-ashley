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
    title_es: "Queer & Called",
    subtitle_en:
      "A sacred invitation to reclaim your voice, reimagine your faith, and return to yourself — whole and holy",
    subtitle_es:
      "Una invitación sagrada a recuperar tu voz, reimaginar tu fe y volver a ti — íntegre y sagrade",
    author: "Ashley Leon",
    price: 3300,
    coverImage_en: "/Queer_y_Called.jpeg",
    coverImage_es: "/Queer_y_Llamados.jpeg",
    description_en: `This journal was born from my own journey — one marked by exile and return, silence and rediscovery, unlearning lies and relearning the truth: that I was never too much, never too far, and was never supposed to choose between being queer and being called. I created this space for those who were told their faith and wholeness couldn't coexist. I no longer believe that, and I hope as you walk through these pages, you won't either.

This 30-day guided journal invites you into sacred reflection, honest questions, and gentle practices that honor both your identity and your spirituality. Each day offers prompts, affirmations, and space to process, reclaim, and reimagine what it means to be whole.`,
    description_es: `Esta guía es para quienes alguna vez sintieron que tenían que elegir entre su fe y su identidad. En 30 días, te acompaña a recuperar tu voz, mirar tu historia con honestidad y volver a lo sagrado sin esconder quien eres. Incluye reflexión, integración y acceso a una comunidad privada para acompañar tu proceso.

Este diario guiado de 30 días te invita a la reflexión sagrada, a preguntas honestas y a prácticas suaves que honran tanto tu identidad como tu espiritualidad. Cada día ofrece preguntas, afirmaciones y espacio para procesar, recuperar y reimaginar lo que significa vivir en plenitud.`,
    features_en: [
      "30 days of guided reflections and sacred prompts",
      "Daily affirmations for identity and faith integration",
      "Space for personal journaling and processing",
      "Spiritual practices rooted in affirmation",
      "Community connection guide included",
      "Beautifully designed with intentional layouts",
    ],
    features_es: [
      "30 días de reflexiones guiadas y preguntas sagradas",
      "Afirmaciones diarias para integrar identidad y fe",
      "Espacio para escribir, procesar y volver a ti",
      "Prácticas espirituales desde la honestidad y el acompañamiento",
      "Guía de conexión con comunidad privada incluida",
      "Diseño cuidado con espacios intencionales",
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
      "Este diario me dio permiso para reconciliar mi fe con quien soy, sin esconder mi identidad. Es tierno, honesto y profundamente necesario.",
    reviewerName: "María G.",
  },
  {
    id: "2",
    slug_en: "rebuilding-reverence",
    slug_es: "reconstruyendo-la-reverencia",
    s3Key_es: "ebooks/1761430437440_Reconstruyendo_la_Reverencia.pdf",
    s3Key_en: "ebooks/1761430103993_Rebuilding_Reverence.pdf",
    title_en: "Rebuilding Reverence",
    title_es: "Rebuilding Reverence",
    subtitle_en: "A 30-Day Journey to Reconnect with Your Inner Self",
    subtitle_es:
      "UN CAMINO DE 30 DÍAS PARA VOLVER A LO SAGRADO DESPUÉS DE UNA FE QUE SE QUEBRÓ",
    author: "Ashley Leon",
    price: 3300,
    coverImage_es: "/Reconstruyendo_la_Reverencia.jpeg",
    coverImage_en: "/Rebuilding_Reverence.jpeg",
    description_en: `Embark on a transformative 30-day journey designed to help you reconnect with your authentic self and rediscover the reverence you deserve. Through daily reflections, guided exercises, and sacred practices, this journal becomes your companion in the path toward self-love and inner peace.

In a world that constantly demands more from us, this book invites you to pause, breathe, and honor your own rhythm. Each day presents a new theme, a gentle reminder that your story matters, your feelings are valid, and your healing is sacred.`,
    description_es: `Un camino de 30 días para volver a lo sagrado después de una fe que se quebró. Ahora toca reconstruir, no desde las reglas, sino desde una fe más honesta. Este recorrido guiado condensa más de una década de proceso interior en 30 días transformadores para reconciliarte con tu historia, con Dios y con lo sagrado.

En un mundo que constantemente nos exige más, este libro te invita a pausar, respirar y honrar tu propio ritmo. Cada día trae un nuevo tema y un recordatorio amable: tu historia importa, lo que sientes es válido y tu sanación es sagrada.`,
    features_en: [
      "30 days of guided reflections and exercises",
      "Sacred practices for self-care and healing",
      "Journal prompts for deep introspection",
      "Affirmations and mantras for daily use",
      "Beautifully designed pages with space for notes",
      "Access to exclusive community support",
    ],
    features_es: [
      "Un camino claro para atravesar la confusión espiritual y volver a descansar",
      "Prácticas diarias, simples y honestas, para volver a lo sagrado sin exigirte sentir nada.",
      "Preguntas guiadas para volver a confiar en tu brújula interna",
      "Rituales de sanación para el cansancio religioso y lo que tu cuerpo ha cargado",
      "Acceso a comunidad privada para las primeras 100 personas, porque no tienes que sanar en soledad",
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
      "Este diario cambió mi vida. Las prácticas diarias me ayudaron a encontrar una paz que no sabía que necesitaba. Gracias por crear un espacio tan honesto para sanar.",
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
