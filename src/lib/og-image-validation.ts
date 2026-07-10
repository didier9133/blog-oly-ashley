export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_MAX_SIZE = 1024 * 1024;
export const OG_IMAGE_MAX_SIZE_MB = 1;

const ALLOWED_OG_IMAGE_TYPES = ["image/jpeg"];
const ALLOWED_OG_IMAGE_EXTENSIONS = [".jpg", ".jpeg"];

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
