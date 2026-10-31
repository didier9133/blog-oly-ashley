import { NextRequest, NextResponse } from "next/server";
import {
  paymentIntentEventData,
  recordPaymentEvent,
} from "@/lib/checkout-events";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import {
  checkoutIntentInputSchema,
  createCheckoutIntent,
  type CheckoutProduct,
} from "@/lib/checkout-intent";
import { workbookPriceCents } from "@/lib/workbook-pricing";
import { CIRCLE_EARLY_PRICE, CIRCLE_IS_AVAILABLE } from "@/lib/circle-config";
import { getWorkbookContent } from "@/lib/workbook-content";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  if (new TextEncoder().encode(rawBody).byteLength > 12_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }
  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = checkoutIntentInputSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout" }, { status: 400 });
  }
  const { amount, metadata } = parsed.data;

  try {
    let product: CheckoutProduct | null = null;
    if (metadata.productType === "ebook") {
      const book = await prisma.book.findFirst({
        where: {
          OR: [{ s3Key_en: metadata.s3Key }, { s3Key_es: metadata.s3Key }],
        },
      });
      if (book)
        product = {
          amount: workbookPriceCents(book.price),
          currency: "usd",
          metadata: {
            ...metadata,
            productName: getWorkbookContent(book, metadata.language).title,
            productId: book.slug_en,
            s3Key: metadata.language === "es" ? book.s3Key_es : book.s3Key_en,
          },
        };
    } else if (
      metadata.s3Key === "live-sessions/rebuilding-reverence-circle" &&
      CIRCLE_IS_AVAILABLE
    ) {
      product = {
        amount: Math.round(CIRCLE_EARLY_PRICE * 100),
        currency: "usd",
        metadata: {
          ...metadata,
          productName: "Rebuilding Reverence Circle",
          productId: "rebuilding-reverence-circle",
        },
      };
    }
    if (!product || product.amount !== amount) {
      return NextResponse.json(
        {
          error: "Product or price changed. Please reload.",
          code: "invalid_product",
        },
        { status: 422 },
      );
    }

    // Older pages can still finish checkout during a rolling deployment.
    const checkoutSessionId =
      parsed.data.checkoutSessionId ?? crypto.randomUUID();
    const paymentIntent = await createCheckoutIntent(
      stripe.paymentIntents,
      product,
      checkoutSessionId,
    );
    if (paymentIntent.status === "canceled") {
      return NextResponse.json(
        { error: "Checkout expired", code: "checkout_expired" },
        { status: 409 },
      );
    }

    await recordPaymentEvent({
      ...paymentIntentEventData("payment_intent.created", paymentIntent),
      dedupeKey: `intent-created:${paymentIntent.id}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
