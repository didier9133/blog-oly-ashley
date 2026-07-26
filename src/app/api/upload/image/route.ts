import { randomUUID } from "node:crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

import {
  OG_IMAGE_MAX_INPUT_SIZE,
  OG_IMAGE_MAX_INPUT_SIZE_MB,
} from "@/lib/og-image-validation";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user || user.publicMetadata?.isAdmin !== true) {
    return new Response("Unauthorized", { status: 401 });
  }

  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    return new Response("Image storage is not configured", { status: 503 });
  }

  const { name, type, size } = (await req.json()) as {
    name?: string;
    type?: string;
    size?: number;
  };
  const normalizedName = name?.toLowerCase() ?? "";
  const extensionIndex = normalizedName.lastIndexOf(".");
  const extension =
    extensionIndex >= 0 ? normalizedName.slice(extensionIndex) : "";

  if (
    !type ||
    !ALLOWED_TYPES.has(type) ||
    !ALLOWED_EXTENSIONS.has(extension)
  ) {
    return new Response("Only JPG, PNG and WebP images are accepted", {
      status: 400,
    });
  }

  if (!size || size < 1 || size > OG_IMAGE_MAX_INPUT_SIZE) {
    return new Response(
      `The image must be between 1 byte and ${OG_IMAGE_MAX_INPUT_SIZE_MB} MB`,
      { status: 400 },
    );
  }

  const key = `uploads/temp-images/${user.id}/${Date.now()}-${randomUUID()}${extension}`;
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: type,
      Metadata: {
        "declared-size": String(size),
      },
    }),
    { expiresIn: 300 },
  );

  return Response.json({ uploadUrl, key });
}
