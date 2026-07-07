import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import prisma from "@/lib/prisma";
import {
  chargeEventData,
  paymentIntentEventData,
  recordPaymentEvent,
} from "@/lib/checkout-events";
import { finalizePaidPaymentIntent } from "@/lib/checkout-purchases";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 },
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SIGNING_SECRET) {
      throw new Error("Missing Stripe Webhook Signing Secret");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET,
    );

    if (event.type.startsWith("payment_intent.")) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await recordPaymentEvent(
        paymentIntentEventData(event.type, paymentIntent, event.id),
      );

      if (event.type === "payment_intent.succeeded") {
        const expandedPaymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntent.id,
          { expand: ["latest_charge"] },
        );
        await finalizePaidPaymentIntent(expandedPaymentIntent);
      }
    }

    if (event.type.startsWith("charge.")) {
      const charge = event.data.object as Stripe.Charge;

      await recordPaymentEvent(chargeEventData(event.type, charge, event.id));

      if (
        (event.type === "charge.updated" || event.type === "charge.succeeded") &&
        charge.paid &&
        charge.payment_intent
      ) {
        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId,
          { expand: ["latest_charge"] },
        );
        await finalizePaidPaymentIntent(paymentIntent);
      }

      if (event.type === "charge.refunded") {
        await prisma.purchase.updateMany({
          where: {
            stripePaymentIntent:
              typeof charge.payment_intent === "string"
                ? charge.payment_intent
                : charge.payment_intent?.id,
          },
          data: { is_paid: false },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
