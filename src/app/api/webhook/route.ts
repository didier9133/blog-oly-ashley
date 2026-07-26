import prisma from "@/lib/prisma";
import { syncClerkUser } from "@/lib/server/sync-clerk-user";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const signingSecret =
      process.env.CLERK_WEBHOOK_SECRET ??
      process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!signingSecret) {
      throw new Error("Missing Clerk webhook signing secret");
    }

    const evt = await verifyWebhook(req, {
      signingSecret,
    });
    const eventType = evt.type;

    if (eventType === "user.deleted") {
      const userId = evt.data.id;

      if (userId) {
        const authoredPosts = await prisma.post.count({
          where: { authorId: userId },
        });

        if (authoredPosts === 0) {
          await prisma.user.deleteMany({ where: { id: userId } });
        }
      }

      return new Response("Webhook received", { status: 200 });
    }

    if (eventType !== "user.created" && eventType !== "user.updated") {
      return new Response("Webhook ignored", { status: 200 });
    }

    const user = evt.data;

    const { image_url, id, email_addresses, first_name, last_name } = user;

    const primaryEmail =
      email_addresses?.find((e) => e.id === user.primary_email_address_id)
        ?.email_address ?? email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      console.warn(
        `Skipping ${eventType} for ${id}: no email_address on payload`,
      );
      return new Response("Skipped: no email on user payload", { status: 200 });
    }

    await syncClerkUser({
      id,
      email: primaryEmail,
      firstName: first_name,
      lastName: last_name,
      image: image_url,
    });

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
