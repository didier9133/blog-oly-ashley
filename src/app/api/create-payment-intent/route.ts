import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import {
  paymentIntentEventData,
  recordPaymentEvent,
} from "@/lib/checkout-events";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia" as Stripe.LatestApiVersion,
});

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata: Record<string, string>;
}

// const AMOUNT = 200; // $2.00 (Stripe uses amounts in cents)

export async function POST(req: NextRequest) {
  let body: CreatePaymentIntentParams;
  try {
    body = (await req.json()) as CreatePaymentIntentParams;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { amount, currency, metadata } = body;
  if (!amount || !currency || amount <= 0 || metadata === undefined) {
    return new Response("Missing amount, currency, or metadata", {
      status: 400,
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      metadata,
    });

    await recordPaymentEvent(
      paymentIntentEventData("payment_intent.created", paymentIntent),
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
