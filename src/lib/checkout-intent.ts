import type Stripe from "stripe";
import { z } from "zod";

export const checkoutIntentInputSchema = z
  .object({
    amount: z.number().int().positive().max(99_999_999),
    currency: z.literal("usd"),
    checkoutSessionId: z.string().uuid().optional(),
    metadata: z
      .object({
        productName: z.string().trim().min(1).max(200),
        productType: z.enum(["ebook", "live_session"]),
        s3Key: z.string().min(1).max(500),
        language: z.enum(["en", "es"]),
      })
      .strict(),
  })
  .strict();

export type CheckoutProduct = {
  amount: number;
  currency: "usd";
  metadata: z.infer<typeof checkoutIntentInputSchema>["metadata"] & {
    productId?: string;
  };
};

type IntentGateway = {
  create: (
    parameters: Stripe.PaymentIntentCreateParams,
    options: Stripe.RequestOptions,
  ) => Promise<Stripe.PaymentIntent>;
  retrieve: (id: string) => Promise<Stripe.PaymentIntent>;
};

export async function createCheckoutIntent(
  gateway: IntentGateway,
  product: CheckoutProduct,
  checkoutSessionId: string,
) {
  const created = await gateway.create(
    {
      amount: product.amount,
      currency: product.currency,
      payment_method_types: ["card"],
      metadata: { ...product.metadata, checkoutSessionId },
    },
    { idempotencyKey: `adl-checkout:${checkoutSessionId}` },
  );

  // An idempotent replay contains the original response. Fetch the current
  // state so a paid purchase cannot accidentally be confirmed again.
  return gateway.retrieve(created.id);
}
