import { NextRequest, NextResponse } from "next/server";
import { recordPaymentEvent } from "@/lib/checkout-events";
import prisma from "@/lib/prisma";
import {
  checkoutEventInputSchema,
  MAX_CHECKOUT_EVENT_BODY_BYTES,
} from "@/lib/checkout-event-input";
import { getStripeLivemodeFromSecretKey } from "@/lib/stripe-mode";

export async function GET(req: NextRequest) {
  const isE2EStateEnabled = process.env.E2E_ENABLE_CHECKOUT_STATE === "1";
  if (
    !isE2EStateEnabled &&
    (process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production")
  ) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  const url = new URL(req.url);
  const paymentIntent = url.searchParams.get("payment_intent");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "10"), 50);

  try {
    const [events, purchases] = await Promise.all([
      prisma.paymentEvent.findMany({
        where: paymentIntent
          ? { stripePaymentIntent: paymentIntent }
          : undefined,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.purchase.findMany({
        where: paymentIntent
          ? { stripePaymentIntent: paymentIntent }
          : undefined,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    ]);

    return NextResponse.json({ events, purchases });
  } catch (error) {
    console.error("Error querying checkout events:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_CHECKOUT_EVENT_BODY_BYTES
    ) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_CHECKOUT_EVENT_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let input: unknown;
    try {
      input = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = checkoutEventInputSchema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout event" },
        { status: 400 },
      );
    }
    const body = parsed.data;

    await recordPaymentEvent({
      eventType: body.eventType,
      stripeLivemode: getStripeLivemodeFromSecretKey(),
      stripePaymentIntent: body.stripePaymentIntent,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      amount: body.amount,
      currency: body.currency,
      productName: body.productName,
      productType: body.productType,
      status: body.status,
      failureCode: body.failureCode,
      failureMessage: body.failureMessage,
      rawPayload: body,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error recording checkout event:", error);
    return NextResponse.json(
      { error: "Unable to record checkout event" },
      { status: 500 },
    );
  }
}
