import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata: Record<string, string>;
}

// const AMOUNT = 200; // $2.00 (Stripe uses amounts in cents)

export async function POST(req: NextRequest) {
  const { amount, currency, metadata } =
    (await req.json()) as CreatePaymentIntentParams;

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

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
