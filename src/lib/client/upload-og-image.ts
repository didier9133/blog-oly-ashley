type PresignedImageUpload = {
  uploadUrl: string;
  key: string;
};

export async function uploadOgImageToTemporaryStorage(
  file: File,
): Promise<string> {
  const presignResponse = await fetch("/api/upload/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
    }),
  });

  if (!presignResponse.ok) {
    throw new Error("Could not prepare the image upload");
  }

  const { uploadUrl, key } =
    (await presignResponse.json()) as PresignedImageUpload;

  if (!uploadUrl || !key) {
    throw new Error("The image upload response was invalid");
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Could not upload the image");
  }

  return key;
}
