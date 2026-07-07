import { request } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export async function fetchCheckoutState(paymentIntent: string) {
  const ctx = await request.newContext({ baseURL: BASE_URL });
  try {
    const res = await ctx.get(
      `/api/checkout/events?payment_intent=${encodeURIComponent(paymentIntent)}`,
      { timeout: 15_000 },
    );
    if (!res.ok()) {
      return { events: [], purchases: [] };
    }
    const body = (await res.json()) as {
      events: Array<{ eventType: string; failureCode?: string | null }>;
      purchases: Array<{ stripePaymentIntent: string; is_paid: boolean }>;
    };
    return body;
  } catch {
    return { events: [], purchases: [] };
  } finally {
    await ctx.dispose();
  }
}

export async function waitForEventsRecorded(
  paymentIntent: string,
  targetEventType: string,
  opts: { timeoutMs?: number; intervalMs?: number } = {},
) {
  const timeoutMs = opts.timeoutMs ?? 15_000;
  const intervalMs = opts.intervalMs ?? 1_000;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { events } = await fetchCheckoutState(paymentIntent);
    if (events.some((e) => e.eventType === targetEventType)) {
      return true;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}