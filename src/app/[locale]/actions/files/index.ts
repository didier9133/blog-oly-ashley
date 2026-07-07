"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const PRIVATE_BUCKET_NAME = process.env.AWS_S3_PRIVATE_BUCKET_NAME;
const TWO_DAYS_IN_SECONDS = 60 * 60 * 24 * 2; // 2 días

const MAX_FILENAME_LENGTH = 255;

const ASCII_FILENAME_REGEX = /[^a-zA-Z0-9._-]+/g;

function sanitizeFileName(raw: string, fallback: string): string {
  if (!raw) {
    return fallback;
  }

  const withoutDiacritics = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const asciiOnly = withoutDiacritics.replace(ASCII_FILENAME_REGEX, "_");
  const collapsedUnderscores = asciiOnly.replace(/_+/g, "_");
  const trimmed = collapsedUnderscores.replace(/^_+|_+$/g, "");
  const result = trimmed.slice(0, MAX_FILENAME_LENGTH) || fallback;

  return result;
}

function resolveDownloadFileName(key: string, requestedName?: string): string {
  const fallbackBase = path.basename(key) || "download";
  const fallback = fallbackBase.slice(0, MAX_FILENAME_LENGTH) || "download";

  const extFromKey = path.extname(fallbackBase);
  const requestedExtMatch = requestedName?.match(/\.([^.]+)$/);
  const extToUse =
    extFromKey || (requestedExtMatch ? `.${requestedExtMatch[1]}` : "");

  const baseNameWithoutExt = requestedName
    ? requestedName.replace(/\.[^.]*$/, "")
    : fallback.replace(/\.[^.]*$/, "");
  const sanitizedBase = sanitizeFileName(
    baseNameWithoutExt,
    fallback.replace(/\.[^.]*$/, "")
  );

  const ensuresExtension = () => {
    if (!extToUse) {
      return sanitizedBase;
    }
    const hasExt = sanitizedBase.toLowerCase().endsWith(extToUse.toLowerCase());
    if (hasExt) {
      return sanitizedBase;
    }

    const maxBaseLength = Math.max(1, MAX_FILENAME_LENGTH - extToUse.length);
    const trimmedBase = sanitizedBase.slice(0, maxBaseLength);

    return `${trimmedBase}${extToUse}`;
  };

  return ensuresExtension();
}

/**
 * Sube un archivo privado a S3
 * @param file - Archivo a subir
 * @param folder - Carpeta dentro del bucket (ej: "ebooks", "documents")
 * @returns La clave (key) del archivo en S3
 */
export async function uploadPrivateFile(
  file: File,
  folder: string = "private"
): Promise<string> {
  // const { userId } = await auth();

  // if (!userId) {
  //   throw new Error("Usuario no autenticado");
  // }

  if (!PRIVATE_BUCKET_NAME) {
    throw new Error("AWS_S3_PRIVATE_BUCKET_NAME no configurado");
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const timestamp = Date.now();
  const key = `${folder}/${timestamp}_${sanitizedName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const command = new PutObjectCommand({
      Bucket: PRIVATE_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    console.log(`✅ Archivo privado subido: ${key}`);
    return key; // Devuelve la key para guardar en BD
  } catch (error) {
    console.error("Error al subir archivo privado:", error);
    throw new Error("Error al subir el archivo: " + (error as Error).message);
  }
}

/**
 * Genera una URL prefirmada de descarga con 2 días de validez
 * @param key - Clave del archivo en S3
 * @param downloadFileName - Nombre sugerido para la descarga
 * @param expiresInSeconds - Tiempo de expiración (default: 2 días)
 * @returns URL prefirmada temporal
 */
export async function createDownloadUrl(
  key: string,
  downloadFileName?: string,
  expiresInSeconds: number = TWO_DAYS_IN_SECONDS
): Promise<string> {
  if (!PRIVATE_BUCKET_NAME) {
    throw new Error("AWS_S3_PRIVATE_BUCKET_NAME no configurado");
  }

  if (expiresInSeconds <= 0) {
    throw new Error("expiresInSeconds debe ser mayor que cero");
  }

  if (expiresInSeconds > 60 * 60 * 24 * 7) {
    throw new Error("La expiración máxima es de 7 días (604800 segundos)");
  }

  const safeFileName = resolveDownloadFileName(key, downloadFileName);
  const encodedFileName = encodeURIComponent(safeFileName);
  const contentDisposition = `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`;

  const command = new GetObjectCommand({
    Bucket: PRIVATE_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: contentDisposition,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });

  console.log(
    `✅ URL de descarga generada para: ${key} (válida ${expiresInSeconds}s)`
  );
  return url;
}

/**
 * Genera URL de descarga verificando permisos del usuario
 * @param key - Clave del archivo en S3
 * @param downloadFileName - Nombre sugerido
 */
export async function createSecureDownloadUrl(
  key: string,
  downloadFileName?: string
): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  // Validar que el archivo pertenece al usuario o tiene permisos
  if (!key.includes(userId)) {
    // Aquí podrías verificar en BD si el usuario tiene acceso
    console.warn(
      `⚠️ Usuario ${userId} intentó acceder a archivo no autorizado: ${key}`
    );
    throw new Error("No tienes permisos para acceder a este archivo");
  }

  return createDownloadUrl(key, downloadFileName);
}
