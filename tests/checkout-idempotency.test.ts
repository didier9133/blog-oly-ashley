import { describe, expect, test } from "bun:test";
import type Stripe from "stripe";
import {
  checkoutIntentInputSchema,
  createCheckoutIntent,
  type CheckoutProduct,
} from "@/lib/checkout-intent";
import {
  requestCheckoutIntent,
  CheckoutInitializationError,
} from "@/lib/checkout-client";
import { getCheckoutSessionId } from "@/lib/checkout-session";

const product: CheckoutProduct = {
  amount: 3300,
  currency: "usd",
  metadata: {
    productName: "Rebuilding Reverence",
    productType: "ebook",
    s3Key: "ebooks/guide.pdf",
    language: "en",
  },
};
const sessionId = "07b6df26-1cc8-424b-b750-2f199b72e376";

function fakeStripe() {
  const intents = new Map<string, Stripe.PaymentIntent>();
  let created = 0;
  return {
    intents,
    get created() {
      return created;
    },
    gateway: {
      async create(
        parameters: Stripe.PaymentIntentCreateParams,
        options: Stripe.RequestOptions,
      ) {
        const key = options.idempotencyKey!;
        if (!intents.has(key)) {
          created++;
          intents.set(key, {
            id: `pi_${created}`,
            status: "requires_payment_method",
            client_secret: "test_secret",
            amount: parameters.amount,
          } as Stripe.PaymentIntent);
        }
        return { ...intents.get(key)! };
      },
      async retrieve(id: string) {
        return [...intents.values()].find((intent) => intent.id === id)!;
      },
    },
  };
}

describe("checkout idempotency", () => {
  test("concurrent requests for the same purchase create one PaymentIntent", async () => {
    const stripe = fakeStripe();
    const results = await Promise.all(
      Array.from({ length: 18 }, () =>
        createCheckoutIntent(stripe.gateway, product, sessionId),
      ),
    );
    expect(stripe.created).toBe(1);
    expect(new Set(results.map((result) => result.id)).size).toBe(1);
  });

  test("a lost HTTP response retries the same session and retrieves the current paid state", async () => {
    const stripe = fakeStripe();
    const sessions: string[] = [];
    const fetcher = (async (_url, options) => {
      const input = JSON.parse(String(options?.body));
      sessions.push(input.checkoutSessionId);
      const intent = await createCheckoutIntent(
        stripe.gateway,
        product,
        input.checkoutSessionId,
      );
      if (sessions.length === 1) {
        intent.status = "succeeded";
        throw new TypeError("Connection lost after creation");
      }
      return Response.json({
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        status: intent.status,
      });
    }) as typeof fetch;
    const result = await requestCheckoutIntent(
      { ...product, checkoutSessionId: sessionId },
      fetcher,
    );
    expect(stripe.created).toBe(1);
    expect(sessions).toEqual([sessionId, sessionId]);
    expect(result.status).toBe("succeeded");
  });

  test("does not retry invalid products or silently replace a canceled session", async () => {
    let calls = 0;
    const fetcher = (async () => {
      calls++;
      return Response.json({ code: "checkout_expired" }, { status: 409 });
    }) as typeof fetch;
    await expect(
      requestCheckoutIntent(
        { ...product, checkoutSessionId: sessionId },
        fetcher,
      ),
    ).rejects.toBeInstanceOf(CheckoutInitializationError);
    expect(calls).toBe(1);
  });

  test("rejects malformed or unbounded checkout requests before creating a payment", () => {
    expect(
      checkoutIntentInputSchema.safeParse({
        ...product,
        checkoutSessionId: sessionId,
      }).success,
    ).toBe(true);
    for (const changes of [
      { amount: -1 },
      { amount: 33.1 },
      { currency: "eur" },
      { checkoutSessionId: "shared" },
      { unexpected: true },
    ]) {
      expect(
        checkoutIntentInputSchema.safeParse({
          ...product,
          checkoutSessionId: sessionId,
          ...changes,
        }).success,
      ).toBe(false);
    }
  });

  test("preserves the purchase ID across reloads and separates different products", () => {
    const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        sessionStorage: {
          getItem: (key: string) => storage.get(key) ?? null,
          setItem: (key: string, value: string) => storage.set(key, value),
        },
      },
    });
    try {
      const first = getCheckoutSessionId("test-product:en:3300");
      expect(getCheckoutSessionId("test-product:en:3300")).toBe(first);
      expect(getCheckoutSessionId("other-product:en:3300")).not.toBe(first);
      expect(getCheckoutSessionId("test-product:en:3300", true)).not.toBe(
        first,
      );
    } finally {
      if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow);
      else Reflect.deleteProperty(globalThis, "window");
    }
  });
});
