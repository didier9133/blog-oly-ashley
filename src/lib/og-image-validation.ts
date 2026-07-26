export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_MAX_INPUT_SIZE = 10 * 1024 * 1024;
export const OG_IMAGE_MAX_INPUT_SIZE_MB = 10;
export const OG_IMAGE_MAX_OUTPUT_SIZE = 1024 * 1024;
export const OG_IMAGE_MAX_OUTPUT_SIZE_MB = 1;
export const OG_IMAGE_MAX_PIXELS = 40_000_000;
export const OG_IMAGE_MAX_MEGAPIXELS = 40;
export const OG_IMAGE_MAX_UPSCALE_FACTOR = 1.2;
export const OG_IMAGE_MAX_UPSCALE_PERCENT = 20;
export const OG_IMAGE_MIN_ASPECT_RATIO = 1;

const ALLOWED_OG_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const ALLOWED_OG_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export function isAllowedOgImageFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  return (
    ALLOWED_OG_IMAGE_TYPES.includes(file.type) ||
    ALLOWED_OG_IMAGE_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension),
    )
  );
}

export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Unable to read image dimensions"));
    };

    image.src = imageUrl;
  });
}

export function canTransformToOgImage({
  width,
  height,
}: {
  width: number;
  height: number;
}): boolean {
  if (width <= 0 || height <= 0) {
    return false;
  }

  const requiredScale = Math.max(
    OG_IMAGE_WIDTH / width,
    OG_IMAGE_HEIGHT / height,
  );

  return requiredScale <= OG_IMAGE_MAX_UPSCALE_FACTOR;
}

export function hasWorkableOgImageAspectRatio({
  width,
  height,
}: {
  width: number;
  height: number;
}): boolean {
  if (width <= 0 || height <= 0) {
    return false;
  }

  return width / height >= OG_IMAGE_MIN_ASPECT_RATIO;
}

export function exceedsOgImagePixelLimit({
  width,
  height,
}: {
  width: number;
  height: number;
}): boolean {
  return width * height > OG_IMAGE_MAX_PIXELS;
}
