import prisma from "@/lib/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });
    const eventType = evt.type;

    if (eventType !== "user.created") {
      return new Response("Event type not supported", { status: 400 });
    }
    console.log("Webhook payload:", evt.data);
    const user = evt.data;

    const { image_url, id, email_addresses, first_name, last_name } = user;

    const primaryEmail =
      email_addresses?.find((e) => e.id === user.primary_email_address_id)
        ?.email_address ?? email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      console.warn(
        `Skipping user.created for ${id}: no email_address on payload`
      );
      return new Response("Skipped: no email on user payload", { status: 200 });
    }

    await prisma.user.upsert({
      where: { id },
      create: {
        id,
        email: primaryEmail,
        firstName: first_name || "",
        lastName: last_name || "",
        image: image_url || "",
      },
      update: {
        email: primaryEmail,
        firstName: first_name || "",
        lastName: last_name || "",
        image: image_url || "",
      },
    });
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
