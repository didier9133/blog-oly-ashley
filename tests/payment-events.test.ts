import { describe, expect, test } from "bun:test";
import type Stripe from "stripe";
import { checkoutEventInputSchema } from "@/lib/checkout-event-input";
import {
  chargeEventData,
  paymentIntentEventData,
} from "@/lib/checkout-events";
import { getStripeLivemodeFromSecretKey } from "@/lib/stripe-mode";

describe("payment event environment", () => {
  test("recognizes Stripe test and live server keys without exposing them", () => {
    expect(getStripeLivemodeFromSecretKey("sk_test_example")).toBe(false);
    expect(getStripeLivemodeFromSecretKey("rk_test_example")).toBe(false);
    expect(getStripeLivemodeFromSecretKey("sk_live_example")).toBe(true);
    expect(getStripeLivemodeFromSecretKey("rk_live_example")).toBe(true);
    expect(getStripeLivemodeFromSecretKey("unknown_key")).toBe(null);
  });

  test("copies livemode from Stripe PaymentIntents and Charges", () => {
    const paymentIntent = {
      id: "pi_test",
      object: "payment_intent",
      livemode: false,
      status: "requires_payment_method",
      amount: 200,
      currency: "usd",
      metadata: {},
      receipt_email: null,
      last_payment_error: null,
    } as unknown as Stripe.PaymentIntent;
    const charge = {
      id: "ch_live",
      object: "charge",
      livemode: true,
      status: "succeeded",
      paid: true,
      amount: 200,
      amount_captured: 200,
      currency: "usd",
      metadata: {},
      payment_intent: "pi_live",
      billing_details: { email: null, name: null },
      failure_code: null,
      failure_message: null,
    } as unknown as Stripe.Charge;

    expect(
      paymentIntentEventData("payment_intent.created", paymentIntent)
        .stripeLivemode,
    ).toBe(false);
    expect(
      chargeEventData("charge.succeeded", charge).stripeLivemode,
    ).toBe(true);
  });
});

describe("checkout telemetry validation", () => {
  test("accepts a known, bounded checkout event", () => {
    const result = checkoutEventInputSchema.safeParse({
      eventType: "checkout.confirm_failed",
      stripePaymentIntent: "pi_123ABC",
      customerEmail: "person@example.com",
      customerName: "Person",
      amount: 200,
      currency: "usd",
      productName: "Rebuilding Reverence",
      productType: "ebook",
      status: "requires_payment_method",
      failureCode: "card_declined",
      failureMessage: "The card was declined.",
    });

    expect(result.success).toBe(true);
  });

  test("rejects unknown event types and additional payload fields", () => {
    expect(
      checkoutEventInputSchema.safeParse({ eventType: "checkout.fabricated" })
        .success,
    ).toBe(false);
    expect(
      checkoutEventInputSchema.safeParse({
        eventType: "checkout.confirm_started",
        arbitraryPayload: { unexpected: true },
      }).success,
    ).toBe(false);
  });
});
