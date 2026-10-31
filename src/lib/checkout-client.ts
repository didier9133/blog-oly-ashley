type IntentResult = {
  clientSecret: string;
  paymentIntentId: string;
  status: string;
};

export class CheckoutInitializationError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

/** Retrying a lost response always retains the original idempotency key. */
export async function requestCheckoutIntent(
  payload: {
    amount: number;
    currency: string;
    checkoutSessionId: string;
    metadata: Record<string, string>;
  },
  fetcher: typeof fetch = fetch,
): Promise<IntentResult> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetcher("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12_000),
      });
      const result = await response.json();
      if (!response.ok) {
        // Stripe may return 409 while the same idempotent request is in flight.
        if (
          response.status >= 500 ||
          (response.status === 409 && result.code !== "checkout_expired")
        ) {
          throw new Error("Temporary checkout failure");
        }
        throw new CheckoutInitializationError(
          result.code ?? "initialization_failed",
        );
      }
      if (!result.clientSecret || !result.paymentIntentId)
        throw new Error("Invalid checkout response");
      return result;
    } catch (error) {
      if (error instanceof CheckoutInitializationError || attempt === 2)
        throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw new CheckoutInitializationError("initialization_failed");
}
