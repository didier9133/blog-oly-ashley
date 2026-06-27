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
    await prisma.user.create({
      data: {
        id,
        email: email_addresses[0]?.email_address,
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
