import { z } from "zod";

export const MAX_CHECKOUT_EVENT_BODY_BYTES = 16 * 1024;

export const checkoutEventInputSchema = z
  .object({
    eventType: z.enum([
      "checkout.submit_failed",
      "checkout.confirm_started",
      "checkout.confirm_failed",
      "checkout.confirm_succeeded",
      "checkout.confirm_requires_payment_method",
      "checkout.confirm_requires_confirmation",
      "checkout.confirm_requires_action",
      "checkout.confirm_processing",
      "checkout.confirm_requires_capture",
      "checkout.confirm_canceled",
      "checkout.confirm_exception",
    ]),
    stripePaymentIntent: z
      .string()
      .regex(/^pi_[A-Za-z0-9]+$/)
      .max(255)
      .nullable()
      .optional(),
    customerEmail: z.string().email().max(320).nullable().optional(),
    customerName: z.string().trim().min(1).max(200).nullable().optional(),
    amount: z.number().int().nonnegative().nullable().optional(),
    currency: z
      .string()
      .regex(/^[a-z]{3}$/)
      .nullable()
      .optional(),
    productName: z.string().trim().min(1).max(200).nullable().optional(),
    productType: z.string().trim().min(1).max(100).nullable().optional(),
    status: z
      .enum([
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
        "processing",
        "requires_capture",
        "canceled",
        "succeeded",
      ])
      .nullable()
      .optional(),
    failureCode: z.string().trim().max(200).nullable().optional(),
    failureMessage: z.string().trim().max(2000).nullable().optional(),
  })
  .strict();

export type CheckoutEventInput = z.infer<typeof checkoutEventInputSchema>;
