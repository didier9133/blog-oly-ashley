import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const CLOUDFRONT = process.env.CLOUDFRONT_DISTRIBUTION!;

export async function POST(req: NextRequest) {
  const { name, type } = (await req.json()) as { name: string; type: string };
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const fileExtension = name.substring(name.lastIndexOf(".")) || ".jpg";
  const key = `uploads/videos/${userId}/${Date.now()}${fileExtension}`;

  const uploadUrl = await getSignedUrl(
    s3 as any,
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: type,
    }),
    { expiresIn: 300 }
  );
  return Response.json({ uploadUrl, fileUrl: `https://${CLOUDFRONT}/${key}` });
}
