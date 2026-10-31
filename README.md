This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Checkout and conversion measurement

The Payment Element uses Stripe's deferred-intent flow. Opening or reloading a
product page does not create a PaymentIntent. Creation starts only after the
visitor submits valid billing and payment details. Retries use one UUID per
product and browser tab, retained across reloads for 23 hours. The server checks
the product and price against the catalog, applies Stripe idempotency, and
retrieves the current status before returning an existing intent. Already paid
intents return to the confirmation page rather than starting another charge.

The live webhook is `https://ashleydianaleon.com/api/checkout/webhook`. It retains
its original signing secret and listens to `payment_intent.succeeded`,
`payment_intent.payment_failed`, `payment_intent.requires_action`,
`payment_intent.processing`, `payment_intent.canceled`, and the legacy
`charge.updated`. Fulfillment is idempotent by PaymentIntent and claims email
sending before delivery, so webhook retries do not send the same email again.

GA4 measures the following events only with analytics consent:

| Event | Meaning |
| --- | --- |
| `view_item` | Product viewed, including direct arrivals from advertisements. |
| `checkout_view` | Checkout form became visible. |
| `begin_checkout` | First interaction with billing or payment fields. |
| `checkout_details_complete` | Billing details passed validation. |
| `add_payment_info` | Stripe reports complete payment details. |
| `checkout_submit` | Visitor pressed pay, including invalid submissions. |
| `checkout_error` | Validation, loading, initialization, or confirmation failed. |
| `purchase` | The server verified a completed payment on the confirmation page. |

`checkout_step`, `error_stage`, `error_code`, `invalid_fields`, and `product_id` are event-scoped
reporting dimensions. `checkout_id` is an opaque purchase-session identifier;
it is not a customer identity. Names, email addresses, phone numbers, card data,
and raw error messages are never added to these GA4 events. Card details can be
completed before billing details, so use an open funnel or analyze those two
steps independently rather than requiring a fixed order. Funnel abandonment means a
recorded step was not followed by a recorded purchase; it is not inferred from a
browser-close event. GA4 excludes visitors who decline analytics, and a paid
visitor who closes the page before confirmation can be missing from GA4. Reconcile
sales totals with Stripe and the Purchase table. Reports can take 24–48 hours to
settle. Purchase IDs deduplicate confirmation reloads.

Run `bun test` and `bun run build` before publishing. The checkout idempotency
tests simulate concurrent requests, a lost HTTP response, and a retry after a
completed payment without sending real charges or emails.
