"use client";

import { useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { useLocale } from "next-intl";
import CheckoutForm from "./checkout-form";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing STRIPE_PUBLISHABLE_KEY env var");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);
const CURRENCY = "usd";

export default function Checkout({
  ebook_price,
  ebook_s3key,
  productName: productNameOverride,
  productType = "ebook",
  productId,
  successPath = "/workbooks/success",
}: {
  ebook_price: number;
  ebook_s3key: string;
  productName?: string;
  productType?: string;
  productId?: string;
  successPath?: string;
}) {
  const language = useLocale();
  const productName = useMemo(() => {
    if (productNameOverride) return productNameOverride;
    const basename = ebook_s3key.split("/").pop() ?? ebook_s3key;
    const [, ...rest] = basename.split("_");
    return rest.length ? rest.join("_") : basename;
  }, [ebook_s3key, productNameOverride]);

  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#bd775c",
      colorBackground: "transparent",
      colorText: "#2b2b2b",
      colorDanger: "#d85c44",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "6px",
      colorTextPlaceholder: "#6b6b6b",
      colorIcon: "#6b6b6b",
    },
    rules: {
      ".Input": {
        border: "1px solid #c6c6b6",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        padding: "0.5rem 0.75rem",
        fontSize: "1rem",
        lineHeight: "1.5rem",
        backgroundColor: "transparent",
      },
      ".Input:focus": {
        border: "1px solid #bd775c",
        boxShadow: "0 0 0 3px rgba(189, 119, 92, 0.5)",
        outline: "none",
      },
      ".Label": {
        fontSize: "0.875rem",
        fontWeight: "500",
        color: "#2b2b2b",
        marginBottom: "0.5rem",
        fontFamily: "var(--font-lora), system-ui, sans-serif",
      },
      ".Tab": {
        border: "1px solid #c6c6b6",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        backgroundColor: "transparent",
      },
      ".Tab--selected": {
        border: "1px solid #bd775c",
        boxShadow: "0 0 0 3px rgba(189, 119, 92, 0.5)",
      },
      ".Block": {
        border: "1px solid #c6c6b6",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        backgroundColor: "transparent",
      },
      ".BlockDivider": {
        backgroundColor: "#c6c6b6",
      },
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: ebook_price,
        currency: CURRENCY,
        paymentMethodTypes: ["card"],
        appearance,
        locale: language === "es" ? "es" : "en",
      }}
      key={`${productId ?? ebook_s3key}:${language}:${ebook_price}`}
    >
      <CheckoutForm
        successPath={successPath}
        productId={productId ?? ebook_s3key}
        productName={productName}
        productType={productType}
        s3Key={ebook_s3key}
        amount={ebook_price}
        currency={CURRENCY}
      />
    </Elements>
  );
}
