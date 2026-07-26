"use server";

import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";

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

function isOwnedTemporaryImageKey(key: string, userId: string) {
  return key.startsWith(`uploads/temp-images/${userId}/`);
}

export async function finalizeOgImageUpload(
  temporaryKey: string,
): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autorizado");
  }

  if (!BUCKET_NAME || !CLOUDFRONT_DISTRIBUTION) {
    throw new Error("El almacenamiento de imágenes no está configurado");
  }

  if (!isOwnedTemporaryImageKey(temporaryKey, userId)) {
    throw new Error("La imagen temporal no pertenece a la cuenta actual");
  }

  try {
    const source = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: temporaryKey,
      }),
    );

    if (!source.Body) {
      throw new Error("La imagen temporal está vacía");
    }

    if (
      source.ContentLength !== undefined &&
      (source.ContentLength < 1 ||
        source.ContentLength > OG_IMAGE_MAX_INPUT_SIZE)
    ) {
      throw new Error(
        `La imagen debe pesar entre 1 byte y ${OG_IMAGE_MAX_INPUT_SIZE_MB} MB`,
      );
    }

    const sourceBytes = await source.Body.transformToByteArray();

    if (
      sourceBytes.byteLength < 1 ||
      sourceBytes.byteLength > OG_IMAGE_MAX_INPUT_SIZE
    ) {
      throw new Error(
        `La imagen debe pesar entre 1 byte y ${OG_IMAGE_MAX_INPUT_SIZE_MB} MB`,
      );
    }

    const optimizedBuffer = await optimizeOgImage(Buffer.from(sourceBytes));
    const finalKey = `uploads/${userId}/${Date.now()}-${randomUUID()}.jpg`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: finalKey,
        Body: optimizedBuffer,
        ContentType: "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return `https://${CLOUDFRONT_DISTRIBUTION}/${finalKey}`;
  } catch (error) {
    console.error("Error detallado al optimizar la imagen en S3:", error);
    throw new Error(
      "Error al procesar la imagen: " + (error as Error).message,
    );
  } finally {
    await s3Client
      .send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: temporaryKey,
        }),
      )
      .catch((error) => {
        console.error("No se pudo limpiar la imagen temporal:", error);
      });
  }
}
