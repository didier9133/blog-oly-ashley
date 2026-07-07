import { NextRequest, NextResponse } from "next/server";
import { recordPaymentEvent } from "@/lib/checkout-events";
import prisma from "@/lib/prisma";

type CheckoutEventBody = {
  eventType?: string;
  stripePaymentIntent?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  amount?: number | null;
  currency?: string | null;
  productName?: string | null;
  productType?: string | null;
  status?: string | null;
  failureCode?: string | null;
  failureMessage?: string | null;
};

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
    let body: CheckoutEventBody;
    try {
      body = (await req.json()) as CheckoutEventBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body.eventType) {
      return NextResponse.json(
        { error: "Missing eventType" },
        { status: 400 },
      );
    }

    await recordPaymentEvent({
      eventType: body.eventType,
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
