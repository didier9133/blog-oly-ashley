import sharp from "sharp";

import {
  canTransformToOgImage,
  hasWorkableOgImageAspectRatio,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_MAX_MEGAPIXELS,
  OG_IMAGE_MAX_OUTPUT_SIZE,
  OG_IMAGE_MAX_OUTPUT_SIZE_MB,
  OG_IMAGE_MAX_PIXELS,
  OG_IMAGE_MAX_UPSCALE_PERCENT,
  OG_IMAGE_WIDTH,
} from "@/lib/og-image-validation";

const ALLOWED_INPUT_FORMATS = new Set(["jpeg", "png", "webp"]);
const JPEG_QUALITIES = [85, 80, 75, 70, 65, 60];

export class OgImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OgImageValidationError";
  }
}

function getOrientedDimensions(metadata: sharp.Metadata) {
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const swapsDimensions =
    metadata.orientation !== undefined &&
    metadata.orientation >= 5 &&
    metadata.orientation <= 8;

  return swapsDimensions
    ? { width: height, height: width }
    : { width, height };
}

async function renderJpeg(input: Buffer, quality: number) {
  return sharp(input, {
    failOn: "error",
    limitInputPixels: OG_IMAGE_MAX_PIXELS,
  })
    .rotate()
    .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, {
      fit: "cover",
      position: "centre",
    })
    .flatten({ background: "#ffffff" })
    .jpeg({
      quality,
      chromaSubsampling: "4:2:0",
      mozjpeg: true,
      progressive: true,
    })
    .toBuffer();
}

export async function optimizeOgImage(input: Buffer): Promise<Buffer> {
  let metadata: sharp.Metadata;

  try {
    metadata = await sharp(input, {
      failOn: "error",
      limitInputPixels: OG_IMAGE_MAX_PIXELS,
    }).metadata();
  } catch {
    throw new OgImageValidationError(
      `La imagen no se pudo leer o excede el límite de ${OG_IMAGE_MAX_MEGAPIXELS} megapíxeles.`,
    );
  }

  if (!metadata.format || !ALLOWED_INPUT_FORMATS.has(metadata.format)) {
    throw new OgImageValidationError(
      "El formato real de la imagen debe ser JPG, PNG o WebP.",
    );
  }

  const { width, height } = getOrientedDimensions(metadata);

  if (!hasWorkableOgImageAspectRatio({ width, height })) {
    throw new OgImageValidationError(
      "La imagen debe ser horizontal o cuadrada; no se aceptan formatos verticales.",
    );
  }

  if (!canTransformToOgImage({ width, height })) {
    throw new OgImageValidationError(
      `La imagen debe poder recortarse a ${OG_IMAGE_WIDTH}x${OG_IMAGE_HEIGHT} px sin ampliarse más de ${OG_IMAGE_MAX_UPSCALE_PERCENT}%.`,
    );
  }

  for (const quality of JPEG_QUALITIES) {
    const output = await renderJpeg(input, quality);

    if (output.byteLength <= OG_IMAGE_MAX_OUTPUT_SIZE) {
      return output;
    }
  }

  throw new OgImageValidationError(
    `No fue posible optimizar la imagen por debajo de ${OG_IMAGE_MAX_OUTPUT_SIZE_MB} MB.`,
  );
}
