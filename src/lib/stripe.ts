import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing Stripe Secret Key");
  }

  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {});
  return stripeClient;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, property) {
    const client = getStripeClient();
    return Reflect.get(client, property, client);
  },
});
