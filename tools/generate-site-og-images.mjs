import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const width = 1200;
const height = 630;

const palette = {
  paper: "#f5efe8",
  ink: "#25231f",
  muted: "#695f56",
  terracotta: "#ad654d",
  wine: "#6e2933",
};

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function svgText({
  eyebrow,
  titleLines,
  subtitleLines,
  textWidth = 530,
  titleSize = 60,
  titleY = 235,
  subtitleY = 470,
  dark = false,
}) {
  const ink = dark ? "#fffaf4" : palette.ink;
  const muted = dark ? "#f5e8dc" : palette.muted;
  const accent = dark ? "#e4a186" : palette.terracotta;

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .eyebrow {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
        }
        .title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: ${titleSize}px;
          font-weight: 400;
          letter-spacing: -1.5px;
        }
        .subtitle {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 24px;
          font-weight: 400;
          letter-spacing: .1px;
        }
        .brand {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
          font-style: italic;
          letter-spacing: .4px;
        }
      </style>
      <text x="72" y="78" class="brand" fill="${muted}">Ashley Diana Leon</text>
      <line x1="72" y1="112" x2="118" y2="112" stroke="${accent}" stroke-width="3"/>
      <text x="72" y="154" class="eyebrow" fill="${accent}">${escapeXml(eyebrow)}</text>
      ${titleLines
        .map(
          (line, index) =>
            `<text x="72" y="${titleY + index * (titleSize * 1.02)}" class="title" fill="${ink}">${escapeXml(line)}</text>`,
        )
        .join("")}
      ${subtitleLines
        .map(
          (line, index) =>
            `<text x="72" y="${subtitleY + index * 34}" class="subtitle" fill="${muted}">${escapeXml(line)}</text>`,
        )
        .join("")}
      <rect x="72" y="570" width="${textWidth}" height="2" fill="${accent}" opacity=".65"/>
    </svg>
  `);
}

async function portraitPanel(source, panelWidth, options = {}) {
  return sharp(path.join(publicDir, source))
    .resize(panelWidth, height, {
      fit: "cover",
      position: options.position ?? sharp.strategy.attention,
    })
    .modulate({
      brightness: options.brightness ?? 1,
      saturation: options.saturation ?? 0.92,
    })
    .toBuffer();
}

async function createSplitCard({
  source,
  output,
  panelWidth,
  panelX,
  text,
  photoOptions,
  dividerColor = palette.terracotta,
}) {
  const photo = await portraitPanel(source, panelWidth, photoOptions);
  const base = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: palette.paper,
    },
  });

  await base
    .composite([
      { input: photo, left: panelX, top: 0 },
      {
        input: Buffer.from(`
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fade" x1="0" x2="1">
                <stop offset="0" stop-color="${palette.paper}" stop-opacity="1"/>
                <stop offset="1" stop-color="${palette.paper}" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <rect x="${panelX - 44}" y="0" width="112" height="${height}" fill="url(#fade)"/>
            <rect x="${panelX}" y="0" width="3" height="${height}" fill="${dividerColor}" opacity=".72"/>
          </svg>
        `),
        left: 0,
        top: 0,
      },
      { input: svgText(text), left: 0, top: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(publicDir, output));
}

async function createCircleCard({ output, eyebrow, subtitleLines }) {
  const photo = await sharp(path.join(publicDir, "ashley-leon-circle.jpg"))
    .resize(width, height, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.78, saturation: 0.78 })
    .toBuffer();

  const overlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stop-color="#2d241f" stop-opacity=".96"/>
          <stop offset=".48" stop-color="#2d241f" stop-opacity=".84"/>
          <stop offset=".72" stop-color="#2d241f" stop-opacity=".28"/>
          <stop offset="1" stop-color="#2d241f" stop-opacity=".06"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#shade)"/>
      <rect x="0" y="0" width="14" height="${height}" fill="${palette.terracotta}"/>
    </svg>
  `);

  await sharp(photo)
    .composite([
      { input: overlay, left: 0, top: 0 },
      {
        input: svgText({
          eyebrow,
          titleLines: ["The Rebuilding", "Reverence Circle"],
          subtitleLines,
          titleSize: 59,
          titleY: 242,
          subtitleY: 468,
          textWidth: 520,
          dark: true,
        }),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(publicDir, output));
}

await Promise.all([
  createSplitCard({
    source: "ashley-leon-hero.jpg",
    output: "og-home-en-v3.jpeg",
    panelWidth: 610,
    panelX: 590,
    photoOptions: { brightness: 0.98, saturation: 0.9 },
    text: {
      eyebrow: "Faith after deconstruction",
      titleLines: ["Returning to yourself", "is returning to the", "sacred."],
      subtitleLines: ["Writing, workbooks, and live workshops", "for the honest work of return."],
      titleSize: 54,
      titleY: 230,
      subtitleY: 464,
      textWidth: 474,
    },
  }),
  createSplitCard({
    source: "ashley-leon-hero.jpg",
    output: "og-home-es-v3.jpeg",
    panelWidth: 610,
    panelX: 590,
    photoOptions: { brightness: 0.98, saturation: 0.9 },
    text: {
      eyebrow: "Fe después de la deconstrucción",
      titleLines: ["Volver a ti es volver", "a lo sagrado."],
      subtitleLines: ["Ensayos, guías y encuentros en vivo", "para el proceso honesto de volver."],
      titleSize: 57,
      titleY: 250,
      subtitleY: 455,
      textWidth: 474,
    },
  }),
  createSplitCard({
    source: "ashley-about-portrait.jpeg",
    output: "og-about-en-v1.jpeg",
    panelWidth: 560,
    panelX: 640,
    photoOptions: { brightness: 1.12, saturation: 0.82 },
    dividerColor: palette.wine,
    text: {
      eyebrow: "About",
      titleLines: ["I'm Ashley."],
      subtitleLines: ["Writer · Workshop facilitator", "Holistic mind-body coach"],
      titleSize: 78,
      titleY: 310,
      subtitleY: 416,
      textWidth: 500,
    },
  }),
  createSplitCard({
    source: "ashley-about-portrait.jpeg",
    output: "og-about-es-v1.jpeg",
    panelWidth: 560,
    panelX: 640,
    photoOptions: { brightness: 1.12, saturation: 0.82 },
    dividerColor: palette.wine,
    text: {
      eyebrow: "Sobre mí",
      titleLines: ["Soy Ashley."],
      subtitleLines: ["Escritora · Facilitadora de talleres", "Acompañante holística"],
      titleSize: 76,
      titleY: 310,
      subtitleY: 416,
      textWidth: 500,
    },
  }),
  createCircleCard({
    output: "og-circle-en-v4.jpeg",
    eyebrow: "Live online · Four weeks",
    subtitleLines: ["For those done rebuilding faith alone."],
  }),
  createCircleCard({
    output: "og-circle-es-v4.jpeg",
    eyebrow: "En vivo · Cuatro semanas",
    subtitleLines: ["Para reconstruir la fe en compañía."],
  }),
]);

console.log("Generated six localized Open Graph images in public/.");
