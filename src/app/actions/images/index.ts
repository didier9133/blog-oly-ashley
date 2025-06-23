"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const CLOUDFRONT_DISTRIBUTION = process.env.CLOUDFRONT_DISTRIBUTION;

/**
 * Genera una URL prefirmada para subir una imagen
 * @param key - Ruta del archivo en S3 (ej: "usuario/123/perfil.jpg")
 * @param contentType - Tipo de contenido (ej: "image/jpeg")
 * @param expiresIn - Tiempo de expiración en segundos (default: 3600 = 1 hora)
 */

async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error("BUCKET_NAME no está definido en variables de entorno");
  }
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Obtiene la URL pública de una imagen
 * @param key - Ruta del archivo en S3
 */
function getPublicImageUrl(key: string): string {
  return `https://${CLOUDFRONT_DISTRIBUTION}/${key}`;
}

export async function uploadImageToS3(
  file: File,
  contentType: string,
  folder: string = "uploads"
): Promise<string> {
  const { userId } = await auth();
  const key = `${folder}/${userId}/${Date.now()}`;

  // Genera la URL prefirmada para subir la imagen
  const uploadUrl = await createPresignedUploadUrl(key, contentType);

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });
    console.log("Response from S3:", response);
    if (!response.ok) {
      throw new Error(`Error al subir la imagen: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw new Error(
      "Error al subir la imagen. Por favor, inténtalo de nuevo más tarde."
    );
  }

  return getPublicImageUrl(key);
}
