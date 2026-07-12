"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Elements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import { Skeleton } from "./ui/skeleton";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";
// import { useParams } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing STRIPE_PUBLISHABLE_KEY env var");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const CURRENCY = "usd";
const CHECKOUT_INIT_RETRIES = 3;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Checkout({
  ebook_price,
  ebook_s3key,
  productName: productNameOverride,
  productType = "ebook",
  successPath = "/workbooks/success",
}: {
  ebook_price: number;
  ebook_s3key: string;
  productName?: string;
  productType?: string;
  successPath?: string;
}) {
  const t = useTranslations("Checkout");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isActiveRef = useRef(true);
  const messagesRef = useRef({
    noConfirmation: "",
    error: "",
  });
  const language = useLocale();
  messagesRef.current = {
    noConfirmation: t("toast-no-confirmation"),
    error: t("toast-error"),
  };
  // const params = useParams<{ slug?: string }>();

  // const productSlug = useMemo(() => {
  //   const value = params?.slug;
  //   if (!value) return null;
  //   return Array.isArray(value) ? value[0] : value;
  // }, [params]);

  const productName = useMemo(() => {
    if (productNameOverride) return productNameOverride;
    // console.log({ productSlug });
    // if (productSlug) {
    //   return productSlug;
    // }
    const basename = ebook_s3key.split("/").pop() ?? ebook_s3key;
    if (!basename.includes("_")) {
      return basename;
    }
    const [, ...rest] = basename.split("_");
    return rest.length > 0 ? rest.join("_") : basename;
  }, [ebook_s3key, productNameOverride]);

  const initializePayment = useCallback(async () => {
    setIsLoading(true);
    setClientSecret(null);
    setPaymentIntentId(null);

    console.log({
      language,
      productName,
      productType,
      s3Key: ebook_s3key,
    });

    for (let attempt = 1; attempt <= CHECKOUT_INIT_RETRIES; attempt += 1) {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: ebook_price,
            currency: CURRENCY,
            metadata: {
              productName,
              productType,
              s3Key: ebook_s3key,
              language,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("No se pudo iniciar el pago.");
        }
        const data = (await response.json()) as {
          clientSecret?: string;
          paymentIntentId?: string;
        };
        if (!isActiveRef.current) {
          return;
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId ?? null);
          setIsLoading(false);
          return;
        }

        throw new Error("Missing client secret");
      } catch (error) {
        console.error(error);
        if (attempt < CHECKOUT_INIT_RETRIES) {
          await delay(750 * attempt);
          continue;
        }

        if (isActiveRef.current) {
          toast.error(messagesRef.current.error);
          setClientSecret(null);
          setIsLoading(false);
        }
      }
    }
  }, [ebook_price, ebook_s3key, productName, productType, language]);

  useEffect(() => {
    isActiveRef.current = true;
    initializePayment();
    return () => {
      isActiveRef.current = false;
    };
  }, [initializePayment]);

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("loading-status")}
            </span>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("loading-message")}
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Skeleton className="h-12 w-full bg-gray-200" />
            <Skeleton className="h-12 w-full bg-gray-200" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-full bg-gray-200" />
              <Skeleton className="h-10 w-28 bg-gray-200" />
            </div>
            <Skeleton className="h-12 w-full bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">{t("error-title")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("error-message")}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={initializePayment}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("retry-button")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
      options={{ clientSecret, appearance }}
      key={clientSecret}
    >
      <CheckoutForm
        paymentIntentId={paymentIntentId}
        successPath={successPath}
        productName={productName}
        productType={productType}
        value={ebook_price / 100}
        currency={CURRENCY}
      />
    </Elements>
  );
}
