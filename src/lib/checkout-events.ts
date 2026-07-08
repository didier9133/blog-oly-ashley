import type Stripe from "stripe";
import prisma from "@/lib/prisma";

export const PRODUCT_NAME_DICTIONARY: Record<string, string> = {
  Rebuilding_Reverence: "Rebuilding Reverence",
  "Rebuilding_Reverence.pdf": "Rebuilding Reverence",
  Reconstruyendo_Reverencia: "Rebuilding Reverence",
  "Reconstruyendo_Reverencia.pdf": "Rebuilding Reverence",
  Queer_y_Llamados: "Queer & Called",
  "Queer_y_Llamados.pdf": "Queer & Called",
  Queer_Called: "Queer and Called",
  "Queer_Called.pdf": "Queer and Called",
};

type RecordPaymentEventInput = {
  stripeEventId?: string;
  eventType: string;
  stripePaymentIntent?: string | null;
  stripeChargeId?: string | null;
  stripeSessionId?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  amount?: number | null;
  currency?: string | null;
  productName?: string | null;
  productType?: string | null;
  status?: string | null;
  failureCode?: string | null;
  failureMessage?: string | null;
  rawPayload?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeProductName(value: unknown) {
  const raw = cleanString(value);
  return raw ? PRODUCT_NAME_DICTIONARY[raw] ?? raw : undefined;
}

export async function recordPaymentEvent(input: RecordPaymentEventInput) {
  const data = {
    stripeEventId: input.stripeEventId ?? undefined,
    eventType: input.eventType,
    stripePaymentIntent: input.stripePaymentIntent ?? undefined,
    stripeChargeId: input.stripeChargeId ?? undefined,
    stripeSessionId: input.stripeSessionId ?? undefined,
    customerEmail: cleanString(input.customerEmail),
    customerName: cleanString(input.customerName),
    amount: input.amount ?? undefined,
    currency: cleanString(input.currency),
    productName: normalizeProductName(input.productName),
    productType: cleanString(input.productType),
    status: cleanString(input.status),
    failureCode: cleanString(input.failureCode),
    failureMessage: cleanString(input.failureMessage),
    rawPayload:
      input.rawPayload === undefined
        ? undefined
        : JSON.parse(JSON.stringify(input.rawPayload)),
  };

  try {
    if (data.stripeEventId) {
      return await prisma.paymentEvent.upsert({
        where: { stripeEventId: data.stripeEventId },
        update: data,
        create: data,
      });
    }

    return await prisma.paymentEvent.create({ data });
  } catch (error) {
    console.error("Unable to record payment event:", error);
    return null;
  }
}

export function paymentIntentEventData(
  eventType: string,
  paymentIntent: Stripe.PaymentIntent,
  stripeEventId?: string,
  failure?: {
    code?: string | null;
    message?: string | null;
  },
) {
  const metadata = paymentIntent.metadata ?? {};

  return {
    stripeEventId,
    eventType,
    stripePaymentIntent: paymentIntent.id,
    customerEmail: metadata.customerEmail ?? paymentIntent.receipt_email,
    customerName: metadata.customerName,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    productName: metadata.productName,
    productType: metadata.productType,
    status: paymentIntent.status,
    failureCode:
      failure?.code ??
      paymentIntent.last_payment_error?.code ??
      paymentIntent.last_payment_error?.decline_code,
    failureMessage:
      failure?.message ?? paymentIntent.last_payment_error?.message,
    rawPayload: {
      id: paymentIntent.id,
      object: paymentIntent.object,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata,
      last_payment_error: paymentIntent.last_payment_error,
    },
  };
}

export function chargeEventData(
  eventType: string,
  charge: Stripe.Charge,
  stripeEventId?: string,
) {
  const metadata = charge.metadata ?? {};

  return {
    stripeEventId,
    eventType,
    stripePaymentIntent:
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id,
    stripeChargeId: charge.id,
    stripeSessionId:
      metadata.checkoutSessionId ?? metadata.sessionId ?? charge.id,
    customerEmail: charge.billing_details.email,
    customerName: charge.billing_details.name,
    amount: charge.amount_captured || charge.amount,
    currency: charge.currency,
    productName: metadata.productName,
    productType: metadata.productType,
    status: charge.status,
    failureCode: charge.failure_code,
    failureMessage: charge.failure_message,
    rawPayload: {
      id: charge.id,
      object: charge.object,
      status: charge.status,
      paid: charge.paid,
      amount: charge.amount,
      amount_captured: charge.amount_captured,
      currency: charge.currency,
      metadata,
      failure_code: charge.failure_code,
      failure_message: charge.failure_message,
    },
  };
}
