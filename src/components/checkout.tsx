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
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import { Skeleton } from "./ui/skeleton";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing STRIPE_PUBLISHABLE_KEY env var");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CURRENCY = "usd";
const productType = "ebook";

export default function Checkout({
  ebook_price,
  ebook_s3key,
}: {
  ebook_price: number;
  ebook_s3key: string;
}) {
  const t = useTranslations("Checkout");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isActiveRef = useRef(true);

  const productName = useMemo(() => {
    const basename = ebook_s3key.split("/").pop() ?? ebook_s3key;
    if (!basename.includes("_")) {
      return basename;
    }
    const [, ...rest] = basename.split("_");
    return rest.length > 0 ? rest.join("_") : basename;
  }, [ebook_s3key]);

  const initializePayment = useCallback(async () => {
    setIsLoading(true);
    setClientSecret(null);

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
          },
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo iniciar el pago.");
      }
      const data = (await response.json()) as { clientSecret?: string };
      if (!isActiveRef.current) {
        return;
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        toast.error(t("toast-no-confirmation"));
      }
    } catch (error) {
      console.error(error);
      if (isActiveRef.current) {
        toast.error(t("toast-error"));
      }
    } finally {
      if (isActiveRef.current) {
        setIsLoading(false);
      }
    }
  }, [ebook_price, ebook_s3key, productName, t]);

  useEffect(() => {
    initializePayment();
    isActiveRef.current = true;
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

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret }}
      key={clientSecret}
    >
      <CheckoutForm />
    </Elements>
  );
}
