"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

// async function createPresignedUploadUrl(
//   key: string,
//   contentType: string,
//   expiresIn = 3600
// ): Promise<string> {
//   if (!BUCKET_NAME) {
//     throw new Error("BUCKET_NAME no está definido en variables de entorno");
//   }
//   const command = new PutObjectCommand({
//     Bucket: BUCKET_NAME,
//     Key: key,
//     ContentType: contentType,
//   });

//   return getSignedUrl(s3Client, command, { expiresIn });
// }

/**
 * Obtiene la URL pública de una imagen
 * @param key - Ruta del archivo en S3
 */
function getPublicImageUrl(key: string): string {
  return `https://${CLOUDFRONT_DISTRIBUTION}/${key}`;
}

async function uploadFileToS3(
  file: File,
  contentType: string,
  folder: string
): Promise<string> {
  const { userId } = await auth();

  const fileExtension =
    file.name.substring(file.name.lastIndexOf(".")) || ".jpg";
  const key = `${folder}/${userId}/${Date.now()}${fileExtension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Subir directamente usando el SDK
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return getPublicImageUrl(key);
  } catch (error) {
    console.error("Error detallado en la subida a S3:", error);
    throw new Error("Error al subir el archivo: " + (error as Error).message);
  }
}

export async function uploadImageToS3(
  file: File,
  contentType: string,
  folder: string = "uploads"
): Promise<string> {
  return uploadFileToS3(file, contentType, folder);
}

export async function uploadVideoToS3(
  file: File,
  contentType: string,
  folder: string = "uploads/videos"
): Promise<string> {
  return uploadFileToS3(file, contentType, folder);
}
