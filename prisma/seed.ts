import prisma from "@/lib/prisma";
import {
  CategoryEnum,
  SubBlogCategoryEnum,
  SubRecipesCategoryEnum,
} from "@/enums";

const categories = [
  { name: CategoryEnum.Blog },
  { name: CategoryEnum.Recipes },
];

const subCategoriesOfBlog = [
  {
    name: SubBlogCategoryEnum.Reflections,
  },
  {
    name: SubBlogCategoryEnum.Letters,
  },
  {
    name: SubBlogCategoryEnum.Rituals,
  },
];

const subCategoriesOfRecipes = [
  {
    name: SubRecipesCategoryEnum.ComfortFood,
  },
  {
    name: SubRecipesCategoryEnum.Healthy,
  },
  {
    name: SubRecipesCategoryEnum.QuickAndEasy,
  },
  {
    name: SubRecipesCategoryEnum.Vegan,
  },
  {
    name: SubRecipesCategoryEnum.Venezuelan,
  },
];

const users = [
  {
    email: "didier9133@hotmail.com",
  },
  {
    email: "didier9133@gmail.com",
  },
];

const commonContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fermentum vel mauris quis viverra. Pellentesque metus arcu, lobortis ac sem sit amet, scelerisque ornare nisi. Etiam ac enim et velit tincidunt fermentum vel eu enim. Duis nec tellus hendrerit, tristique turpis at, interdum ipsum. Vestibulum nec mi consequat, imperdiet ante non, pretium justo. In sagittis quis ex quis molestie. Nunc pretium fringilla est, eu fermentum arcu pellentesque eget. Proin quis interdum nisl. Donec in porttitor erat. Nulla vehicula enim eget venenatis euismod. Vestibulum cursus et velit vitae euismod. Integer odio risus, mollis eu viverra et, malesuada quis lectus. Quisque id pharetra ex, vel venenatis tortor. Vivamus purus diam, venenatis posuere lacus at, rutrum sagittis magna. Cras est leo, aliquet nec porta et, egestas vel enim. Suspendisse malesuada sagittis porta. Maecenas velit massa, ullamcorper vel metus id, lobortis scelerisque purus. Duis mattis ante eu efficitur bibendum. Etiam rutrum, libero in lobortis auctor, dolor purus ullamcorper metus, ut dignissim odio sem id est. Integer augue dolor, lacinia eu rhoncus a, bibendum a orci. Nunc quis libero accumsan, iaculis felis sit amet, gravida justo. Phasellus aliquet elit justo, non porta libero ultricies vitae. Aliquam vel elit id eros commodo mattis. Fusce tincidunt turpis ac nibh vehicula venenatis. Morbi malesuada vulputate libero, vitae gravida augue blandit vitae. Vestibulum erat eros, semper venenatis purus in, vulputate elementum mi. Nam quis velit non risus suscipit facilisis. Mauris sed ligula ex. Fusce vel urna eu dui euismod imperdiet at in mi. Nullam eu tellus quis massa ullamcorper imperdiet vel vel ex. Suspendisse auctor lacus in eros ultricies, eget aliquam orci mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas commodo neque sed justo mattis pulvinar. Morbi eu congue tellus, a sodales enim. Suspendisse vel odio in libero varius aliquet sed nec metus. Morbi et facilisis nibh, sodales ornare felis.";

// Utilidad para obtener un subcategory aleatorio según la categoría
function getRandomSubcategory(category: CategoryEnum) {
  if (category === CategoryEnum.Blog) {
    const subcats = Object.values(SubBlogCategoryEnum);
    return subcats[Math.floor(Math.random() * subcats.length)];
  } else if (category === CategoryEnum.Recipes) {
    const subcats = Object.values(SubRecipesCategoryEnum);
    return subcats[Math.floor(Math.random() * subcats.length)];
  }

  return undefined;
}

const posts = [
  {
    title: "Cocina con Orgullo",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-22",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "cocina-con-orgullo",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  {
    title: "Sabores del Orgullo",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-20",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "sabores-del-orgullo",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  {
    title: "Cocina sin Fronteras",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-18",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "cocina-sin-fronteras",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  {
    title: "Recetas para el Alma",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-15",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "recetas-para-el-alma",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: true,
  },
  {
    title: "Dulces Diversos",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-10",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "dulces-diversos",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: true,
  },
  {
    title: "Sabores Urbanos",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-08",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "sabores-urbanos",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: true,
  },
  {
    title: "Historias entre Platos",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-05",
    category: CategoryEnum.Blog,
    authorEmail: users[1].email,
    slug: "historias-entre-platos",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  {
    title: "Aromas del Pasado",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-05-01",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "aromas-del-pasado",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  {
    title: "Rituales de Sabor",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-28",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "rituales-de-sabor",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: true,
  },
  {
    title: "Cartas a la Mesa",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-25",
    category: CategoryEnum.Blog,
    authorEmail: users[1].email,
    slug: "cartas-a-la-mesa",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  {
    title: "Reflejos de Cocina",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-22",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "reflejos-de-cocina",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: true,
  },
  {
    title: "Sabores de la Infancia",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-20",
    category: CategoryEnum.Blog,
    authorEmail: users[1].email,
    slug: "sabores-de-la-infancia",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  {
    title: "Cenas de Medianoche",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-18",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "cenas-de-medianoche",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: true,
  },
  {
    title: "Días de Pan",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-15",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "dias-de-pan",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: true,
  },
  {
    title: "Cartas con Sazón",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-13",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "cartas-con-sazon",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: true,
  },
  // El resto sin published o published: false
  {
    title: "Ritual de los Sabores",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-10",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "ritual-de-los-sabores",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Reflexiones al Fuego",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-08",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "reflexiones-al-fuego",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Cocina de Encuentros",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-05",
    category: CategoryEnum.Blog,
    authorEmail: users[1].email,
    slug: "cocina-de-encuentros",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: false,
  },
  {
    title: "Rituales Familiares",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-03",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "rituales-familiares",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Sabores Compartidos",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-04-01",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "sabores-compartidos",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Cartas de Otoño",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-29",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "cartas-de-otono",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: false,
  },
  {
    title: "Ritual de la Mañana",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-27",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "ritual-de-la-manana",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Reflejos en la Mesa",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-25",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "reflejos-en-la-mesa",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Cocina de Recuerdos",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-22",
    category: CategoryEnum.Blog,
    authorEmail: users[1].email,
    slug: "cocina-de-recuerdos",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: false,
  },
  {
    title: "Rituales de Domingo",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-20",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "rituales-de-domingo",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Reflexiones Dulces",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-18",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "reflexiones-dulces",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Cartas de Sabor",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-15",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "cartas-de-sabor",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: false,
  },
  {
    title: "Ritual de la Tarde",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-13",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "ritual-de-la-tarde",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Reflejos de la Abuela",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-10",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "reflejos-de-la-abuela",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Cocina de Primavera",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-08",
    category: CategoryEnum.Blog,
    authorEmail: users[1].email,
    slug: "cocina-de-primavera",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: false,
  },
  {
    title: "Rituales de Café",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-05",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "rituales-de-cafe",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Reflexiones Saladas",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-03",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "reflexiones-saladas",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Cartas de Invierno",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-03-01",
    category: CategoryEnum.Blog,
    authorEmail: users[0].email,
    slug: "cartas-de-invierno",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: false,
  },
  {
    title: "Ritual de la Cena",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-02-27",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "ritual-de-la-cena",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Reflejos de la Tarde",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-02-25",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "reflejos-de-la-tarde",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Cocina de Verano",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-02-22",
    category: CategoryEnum.Blog,
    authorEmail: users[1].email,
    slug: "cocina-de-verano",
    subcategory: getRandomSubcategory(CategoryEnum.Blog),
    published: false,
  },
  {
    title: "Rituales de la Abuela",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-02-20",
    category: CategoryEnum.Recipes,
    authorEmail: users[0].email,
    slug: "rituales-de-la-abuela",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
  {
    title: "Reflexiones Urbanas",
    content: commonContent,
    image:
      "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    updatedAt: "2024-02-18",
    category: CategoryEnum.Recipes,
    authorEmail: users[1].email,
    slug: "reflexiones-urbanas",
    subcategory: getRandomSubcategory(CategoryEnum.Recipes),
    published: false,
  },
];

const books = [
  {
    s3Key_es: "ebooks/1762465492874_Queer_y_Llamados.pdf",
    s3Key_en: "ebooks/1762465264669_Queer_Called.pdf",
    slug_es: "queer-y-llamados",
    slug_en: "queer-and-called",
    title_en: "QUEER AND CALLED",
    title_es: "QUEER Y LLAMADOS",
    subtitle_en:
      "A sacred invitation to reclaim your voice, reimagine your faith, and return to yourself — whole and holy",
    subtitle_es:
      "Una invitación sagrada a reclamar tu voz, reimaginar tu fe y regresar a ti mismo — íntegro y sagrado",
    author: "Ashley Diana Leon - Raíces & Returning",
    price: 2800,
    originalPrice: 3500,
    discount: 20,
    coverImage_en: "/Queer_y_Called.jpeg",
    coverImage_es: "/Queer_y_Llamados.jpeg",
    description_en: `A 30-Day Journey of Reclaiming Voice, Faith, and Worth
For the one who thought they had to choose between being queer and being called — this is your return home. In 30 guided days, you’ll reimagine your faith, re-embody your truth, and reclaim the sacredness of who you are. Includes 76 pages of reflection and integration, plus lifetime community access (for the first 100) where you’ll never walk alone again.`,
    description_es: `Para quien pensó que debía elegir entre ser queer y ser llamado: este es tu regreso a casa. En 30 días guiados, reimaginarás tu fe, encarnarás tu verdad y recuperarás lo sagrado que siempre ha vivido en ti. Incluye 76 páginas de reflexión e integración, y acceso vitalicio gratuito (para los primeros 100) a una comunidad virtual donde nunca caminarás solo`,
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
    pages: 76,
    format_en: "Digital PDF",
    format_es: "PDF Digital",
    language_en: "English",
    language_es: "Español",
    isbn: "978-0-987654-32-1",
    rating: 4.8,
    reviewCount: 32,
    featured_review_en:
      "This journal gave me permission to be both queer and faithful without apology. It's tender, affirming, and deeply needed.",
    featured_review_es:
      "Este diario me dio permiso para ser tanto queer como fiel sin disculpas. Es tierno, afirmativo y profundamente necesario.",
    reviewerName: "María G.",
  },
  {
    slug_en: "rebuilding-reverence",
    slug_es: "reconstruyendo-la-reverencia",
    s3Key_es: "ebooks/1762468945355_Reconstruyendo_Reverencia.pdf",
    s3Key_en: "ebooks/1762468919064_Rebuilding_Reverence.pdf",
    title_en: "Rebuilding Reverence",
    title_es: "Reconstruyendo la Reverencia",
    subtitle_en: "A 30 DAY RETURN TO WONDER AFTER THE RUINS OF RELIGION",
    subtitle_es:
      "UN REGRESO DE 30 DÍAS A LA MARAVILLA TRAS LAS RUINAS DE LA RELIGIÓN",
    author: "Ashley Diana Leon - Raíces & Returning",
    price: 2800,
    originalPrice: 3500,
    discount: 20,
    coverImage_es: "/Reconstruyendo_la_Reverencia.jpeg",
    coverImage_en: "/Rebuilding_Reverence.jpeg",
    description_en: `A 30-Day Return to Wonder After the Ruins of Religion
You’ve deconstructed. Now it’s time to rebuild — not the rules, but the reverence. This 76-page guided journey distills over a decade of inner work into 30 transformative days that help you reconnect with God, yourself, and your sacred wonder. The first 100 buyers also receive lifetime access to a private online community for continued support and reflection.`,
    description_es: `Un retorno de 30 días a la maravilla después de las ruinas de la religión
Has deconstruido. Ahora toca reconstruir — no las reglas, sino la reverencia. Este recorrido guiado de 76 páginas condensa más de una década de trabajo interior en 30 días transformadores para reconectarte con Dios, contigo mismo y con lo sagrado. Los primeros 100 recibirán acceso vitalicio gratuito a una comunidad virtual privada para acompañar su proceso.`,
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
    pages: 76,
    format_en: "Digital PDF",
    format_es: "PDF Digital",
    language_en: "English",
    language_es: "Español",
    isbn: "978-0-987654-33-8",
    rating: 4.8,
    reviewCount: 32,
    featured_review_en:
      "This journal changed my life. The daily practices helped me find peace I didn't know I needed. Thank you for creating such a beautiful space for healing.",
    featured_review_es:
      "Este diario cambió mi vida. Las prácticas diarias me ayudaron a encontrar la paz que no sabía que necesitaba. Gracias por crear un espacio tan hermoso para sanar.",
    reviewerName: "Charlotte G.",
  },
];

export async function main() {
  // await prisma.subcategory.create({
  //   data: {
  //     name: "Thoughts", // Replace with your actual subcategory name
  //     category: {
  //       connect: { id: 36 },
  //     },
  //   },
  // });
  // await prisma.post.deleteMany({});
  // await prisma.user.deleteMany({});
  // await prisma.subcategory.deleteMany({});
  // await prisma.category.deleteMany({});

  //Crea categorías y guarda sus IDs
  // const createdCategories = {} as Record<string, { id: number }>;
  // const createdCategoriesOfBlog = {} as Record<string, { id: number }>;
  // const createdCategoriesOfRecipes = {} as Record<string, { id: number }>;

  // for (const cat of categories) {
  //   const created = await prisma.category.create({ data: cat });
  //   createdCategories[cat.name] = created;
  // }

  // for (const subCat of subCategoriesOfBlog) {
  //   const created = await prisma.subcategory.create({
  //     data: {
  //       name: subCat.name,
  //       category: { connect: { id: createdCategories[CategoryEnum.Blog].id } },
  //     },
  //   });
  //   createdCategoriesOfBlog[subCat.name] = created;
  // }

  // for (const subCat of subCategoriesOfRecipes) {
  //   const created = await prisma.subcategory.create({
  //     data: {
  //       name: subCat.name,
  //       category: {
  //         connect: { id: createdCategories[CategoryEnum.Recipes].id },
  //       },
  //     },
  //   });
  //   createdCategoriesOfRecipes[subCat.name] = created;
  // }

  // Crea posts conectando user y category
  // for (const post of posts) {
  //   await prisma.post.create({
  //     data: {
  //       title: post.title,
  //       content: post.content,
  //       image: post.image,
  //       slug: post.slug,
  //       category: { connect: { id: createdCategories[post.category].id } },
  //       subcategory: {
  //         connect:
  //           post.category === CategoryEnum.Blog
  //             ? { id: createdCategoriesOfBlog[post.subcategory!].id }
  //             : { id: createdCategoriesOfRecipes[post.subcategory!].id },
  //       },
  //       author: { connect: { email: post.authorEmail } },
  //       published: post.published,
  //     },
  //   });
  // }

  await prisma.purchase.deleteMany({});
  await prisma.book.deleteMany({});

  for (const book of books) {
    await prisma.book.create({
      data: book,
    });
  }
  //crear ebooks
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
