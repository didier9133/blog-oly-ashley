"use client";

import React, { useMemo, useRef, useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { ButtonPay } from "./ui/btn-pay";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BillingDetailsForm,
  createBillingDetailsSchema,
  type BillingDetailsFormValues,
} from "./checkout-billing-details-form";
import { Separator } from "./ui/separator";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { localizedHref } from "@/lib/url";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function CheckoutForm({
  paymentIntentId,
  successPath = "/workbooks/success",
  productName,
  productType,
  value,
  currency,
}: {
  paymentIntentId?: string | null;
  successPath?: string;
  productName: string;
  productType: string;
  value: number;
  currency: string;
}) {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const hasTrackedBeginCheckout = useRef(false);
  const billingDetailsSchema = useMemo(
    () => createBillingDetailsSchema(t),
    [t],
  );
  const form = useForm<BillingDetailsFormValues>({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const isCheckoutReady = Boolean(stripe && elements && isPaymentElementReady);

  const paymentElementOptions = useMemo<StripePaymentElementOptions>(
    () => ({
      layout: "tabs",
      business: { name: "Ashley Leon" },
      fields: {
        billingDetails: {
          name: "never",
          email: "never",
          phone: "never",
          address: "auto",
        },
      },
      wallets: {
        link: "never",
        applePay: "auto",
        googlePay: "auto",
      },
    }),
    [],
  );

  const recordCheckoutEvent = async (
    eventType: string,
    values: BillingDetailsFormValues,
    paymentIntent?: {
      id?: string | null;
      status?: string | null;
      amount?: number | null;
      currency?: string | null;
    },
    failure?: {
      code?: string | null;
      message?: string | null;
    },
  ) => {
    try {
      await fetch("/api/checkout/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          stripePaymentIntent: paymentIntent?.id ?? paymentIntentId,
          customerEmail: values.email.trim(),
          customerName: values.name.trim(),
          amount: paymentIntent?.amount,
          currency: paymentIntent?.currency,
          productName,
          productType,
          status: paymentIntent?.status,
          failureCode: failure?.code,
          failureMessage: failure?.message,
        }),
      });
    } catch (error) {
      console.error("Error recording checkout event:", error);
    }
  };

  const handleSubmit = async (values: BillingDetailsFormValues) => {
    if (!stripe || !elements) return;

    if (!hasTrackedBeginCheckout.current) {
      hasTrackedBeginCheckout.current = trackAnalyticsEvent("begin_checkout", {
        value,
        currency: currency.toUpperCase(),
        locale,
        items: [
          {
            item_id: productName,
            item_name: productName,
            item_category: productType,
          },
        ],
      });
    }

    try {
      setIsSubmitting(true);

      const returnUrl = `${window.location.origin}${localizedHref(locale, successPath)}`;
      const { error: submitError } = await elements.submit();
      if (submitError) {
        await recordCheckoutEvent("checkout.submit_failed", values, undefined, {
          code: submitError.code,
          message: submitError.message,
        });
        toast.error(submitError.message ?? t("error-submit-fields"));
        return;
      }

      await recordCheckoutEvent("checkout.confirm_started", values);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: {
            billing_details: {
              name: values.name.trim(),
              email: values.email.trim(),
              phone: values.phone.trim(),
            },
          },
        },
      });

      if (error) {
        await recordCheckoutEvent(
          "checkout.confirm_failed",
          values,
          "payment_intent" in error ? error.payment_intent : undefined,
          {
            code: error.code,
            message: error.message,
          },
        );
        toast.error(error.message ?? t("error-payment-failed"));
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await recordCheckoutEvent(
          "checkout.confirm_succeeded",
          values,
          paymentIntent,
        );
        router.push(
          `${localizedHref(locale, successPath)}?payment_intent=${paymentIntent.id}&redirect_status=succeeded`,
        );
        return;
      }

      if (paymentIntent) {
        await recordCheckoutEvent(
          `checkout.confirm_${paymentIntent.status}`,
          values,
          paymentIntent,
        );
        router.push(
          `${localizedHref(locale, successPath)}?payment_intent=${paymentIntent.id}&redirect_status=${paymentIntent.status}`,
        );
        return;
      }
    } catch (error) {
      console.error("Error al confirmar el pago:", error);
      await recordCheckoutEvent("checkout.confirm_exception", values, undefined, {
        message: error instanceof Error ? error.message : String(error),
      });
      toast.error(t("error-processing"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const getInputValue = (name: string) =>
      (
        formElement.querySelector<HTMLInputElement>(`input[name="${name}"]`)
          ?.value ?? ""
      ).trim();

    const parsed = billingDetailsSchema.safeParse({
      name: getInputValue("name"),
      email: getInputValue("email"),
      phone: getInputValue("phone"),
    });

    if (!parsed.success) {
      form.clearErrors();
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "email" || field === "phone") {
          form.setError(field, {
            type: "manual",
            message: issue.message,
          });
        }
      }
      return;
    }

    form.clearErrors();
    form.reset(parsed.data, { keepValues: true });
    await handleSubmit(parsed.data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={handleFormSubmit}
          noValidate
          aria-busy={!isCheckoutReady}
          className={cn(
            "space-y-4 transition-opacity duration-300",
            !isCheckoutReady ? "opacity-0" : "opacity-100",
          )}
        >
          {/* <Separator /> */}

          <h3 className="font-semibold text-2xl mb-1 font-[family-name:var(--font-cormorant-garamond)] text-foreground">
            {t("form-shipping-title")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-[family-name:var(--font-lora)]">
            {t("form-shipping-description")}
          </p>
          <BillingDetailsForm
            form={form}
            disabled={isSubmitting || !isCheckoutReady}
          />

          <Separator className="my-8" />
          <h3 className="font-semibold text-2xl mb-1 font-[family-name:var(--font-cormorant-garamond)] text-foreground">
            {t("form-payment-title")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-[family-name:var(--font-lora)]">
            {t("form-payment-description")}
          </p>
          <PaymentElement
            options={paymentElementOptions}
            onReady={() => setIsPaymentElementReady(true)}
          />
          <div className="mt-8">
            <ButtonPay
              isSubmitting={isSubmitting}
              isDisabled={!isCheckoutReady || isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
