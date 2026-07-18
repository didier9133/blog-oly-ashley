import "server-only";

import { timingSafeEqual } from "node:crypto";
import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { LEAD_MAGNET } from "@/lib/lead-magnet";

function getPrivateBucketName() {
  const bucketName = process.env.AWS_S3_PRIVATE_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("AWS_S3_PRIVATE_BUCKET_NAME no configurado");
  }

  return bucketName;
}

function getS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

function checksumsMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function createLeadMagnetDownloadUrl() {
  const s3Client = getS3Client();
  const bucketName = getPrivateBucketName();
  const object = await s3Client.send(
    new HeadObjectCommand({
      Bucket: bucketName,
      Key: LEAD_MAGNET.s3Key,
      ChecksumMode: "ENABLED",
    }),
  );

  const checksumMatches = object.ChecksumSHA256
    ? checksumsMatch(object.ChecksumSHA256, LEAD_MAGNET.sha256Base64)
    : object.Metadata?.sha256
      ? checksumsMatch(
          object.Metadata.sha256.toLowerCase(),
          LEAD_MAGNET.sha256Hex,
        )
      : false;

  if (!checksumMatches) {
    throw new Error(
      "La guía almacenada no coincide con el checksum SHA-256 esperado.",
    );
  }

  const encodedFileName = encodeURIComponent(LEAD_MAGNET.downloadFileName);
  const contentDisposition =
    `attachment; filename="${LEAD_MAGNET.downloadFileName}"; ` +
    `filename*=UTF-8''${encodedFileName}`;

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: LEAD_MAGNET.s3Key,
      ResponseContentDisposition: contentDisposition,
      ResponseContentType: "application/pdf",
    }),
    { expiresIn: LEAD_MAGNET.expiresInSeconds },
  );
}
