"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "node:crypto";

import {
  OG_IMAGE_MAX_INPUT_SIZE,
  OG_IMAGE_MAX_INPUT_SIZE_MB,
} from "@/lib/og-image-validation";
import { optimizeOgImage } from "@/lib/server/optimize-og-image";

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

async function uploadFileToS3(file: File): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autorizado");
  }

  if (!BUCKET_NAME || !CLOUDFRONT_DISTRIBUTION) {
    throw new Error("El almacenamiento de imágenes no está configurado");
  }

  if (file.size === 0 || file.size > OG_IMAGE_MAX_INPUT_SIZE) {
    throw new Error(
      `La imagen debe pesar entre 1 byte y ${OG_IMAGE_MAX_INPUT_SIZE_MB} MB`,
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const optimizedBuffer = await optimizeOgImage(Buffer.from(arrayBuffer));
    const key = `uploads/${userId}/${Date.now()}-${randomUUID()}.jpg`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: optimizedBuffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    });

    await s3Client.send(command);

    return getPublicImageUrl(key);
  } catch (error) {
    console.error("Error detallado en la subida a S3:", error);
    throw new Error("Error al subir el archivo: " + (error as Error).message);
  }
}

export async function uploadImageToS3(file: File): Promise<string> {
  return uploadFileToS3(file);
}

// export async function uploadVideoToS3(
//   file: File,
//   contentType: string,
//   folder: string = "uploads/videos"
// ): Promise<string> {
//   return uploadFileToS3(file, contentType, folder);
// }
