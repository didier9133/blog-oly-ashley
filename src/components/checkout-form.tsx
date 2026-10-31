"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { ButtonPay } from "./ui/btn-pay";
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
import { ANALYTICS_CONSENT_EVENT } from "@/lib/analytics";
import { useCheckoutFunnel } from "./checkout-funnel";
import {
  CheckoutInitializationError,
  requestCheckoutIntent,
} from "@/lib/checkout-client";

export default function CheckoutForm({
  productId,
  s3Key,
  amount,
  successPath = "/workbooks/success",
  productName,
  productType,
  currency,
}: {
  productId: string;
  s3Key: string;
  amount: number;
  successPath?: string;
  productName: string;
  productType: string;
  currency: string;
}) {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const paymentIntentId = useRef<string | null>(null);
  const submitting = useRef(false);
  const container = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);
  const interacted = useRef(false);
  const detailsComplete = useRef(false);
  const paymentComplete = useRef(false);
  const [paymentLoadError, setPaymentLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    track: trackFunnel,
    error: trackError,
    sessionId,
  } = useCheckoutFunnel({
    productId,
    productName,
    productType,
    amount,
    currency,
    locale,
  });

  useEffect(() => {
    const sendKnownSteps = () => {
      if (viewed.current) trackFunnel("checkout_view", "form_viewed");
      if (interacted.current) trackFunnel("begin_checkout", "form_started");
      if (detailsComplete.current)
        trackFunnel("checkout_details_complete", "details_complete");
      if (paymentComplete.current)
        trackFunnel("add_payment_info", "payment_details_complete");
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          viewed.current = true;
          sendKnownSteps();
        }
      },
      { threshold: 0.1 },
    );
    if (container.current) observer.observe(container.current);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sendKnownSteps);
    return () => {
      observer.disconnect();
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, sendKnownSteps);
    };
  }, [trackFunnel]);

  function beginCheckout() {
    interacted.current = true;
    trackFunnel("begin_checkout", "form_started");
  }

  useEffect(() => {
    if (isPaymentElementReady || paymentLoadError) return;
    let timeout: number | undefined;
    const watchVisibleLoad = () => {
      window.clearTimeout(timeout);
      // Browsers can suspend Stripe frames in background tabs.
      if (document.visibilityState !== "visible") return;
      timeout = window.setTimeout(() => {
        setPaymentLoadError(true);
        trackError("payment_element", "load_timeout");
      }, 20_000);
    };
    watchVisibleLoad();
    document.addEventListener("visibilitychange", watchVisibleLoad);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", watchVisibleLoad);
    };
  }, [isPaymentElementReady, paymentLoadError, trackError]);
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
      business: { name: "Ashley Diana Leon" },
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
          stripePaymentIntent: paymentIntent?.id ?? paymentIntentId.current,
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
        keepalive: true,
        signal: AbortSignal.timeout(5_000),
      });
    } catch (error) {
      console.error("Error recording checkout event:", error);
    }
  };

  const handleSubmit = async (values: BillingDetailsFormValues) => {
    if (!stripe || !elements || submitting.current) return;
    submitting.current = true;
    let phase = "payment_validation";

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const returnUrl = `${window.location.origin}${localizedHref(locale, successPath)}`;
      const { error: submitError } = await elements.submit();
      if (submitError) {
        void recordCheckoutEvent("checkout.submit_failed", values, undefined, {
          code: submitError.code,
          message: submitError.message,
        });
        trackError(phase, submitError.code);
        setErrorMessage(submitError.message ?? t("error-submit-fields"));
        toast.error(submitError.message ?? t("error-submit-fields"));
        return;
      }

      paymentComplete.current = true;
      trackFunnel("add_payment_info", "payment_details_complete");
      phase = "initialization";
      const initialize = (renew = false) =>
        requestCheckoutIntent({
          amount,
          currency,
          checkoutSessionId: sessionId(renew),
          metadata: { productName, productType, s3Key, language: locale },
        });
      let initialized;
      try {
        initialized = await initialize();
      } catch (error) {
        if (
          !(error instanceof CheckoutInitializationError) ||
          error.code !== "checkout_expired"
        )
          throw error;
        initialized = await initialize(true);
      }
      paymentIntentId.current = initialized.paymentIntentId;
      if (
        ["succeeded", "processing", "requires_capture"].includes(
          initialized.status,
        )
      ) {
        router.push(
          `${localizedHref(locale, successPath)}?payment_intent=${initialized.paymentIntentId}&redirect_status=${initialized.status}`,
        );
        return;
      }
      phase = "confirmation";
      void recordCheckoutEvent("checkout.confirm_started", values);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: initialized.clientSecret,
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
        void recordCheckoutEvent(
          "checkout.confirm_failed",
          values,
          "payment_intent" in error ? error.payment_intent : undefined,
          {
            code: error.code,
            message: error.message,
          },
        );
        trackError(phase, error.decline_code ?? error.code);
        setErrorMessage(error.message ?? t("error-payment-failed"));
        toast.error(error.message ?? t("error-payment-failed"));
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        void recordCheckoutEvent(
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
        void recordCheckoutEvent(
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
      void recordCheckoutEvent(
        "checkout.confirm_exception",
        values,
        undefined,
        {
          message: error instanceof Error ? error.message : String(error),
        },
      );
      trackError(
        phase,
        error instanceof CheckoutInitializationError
          ? error.code
          : "request_failed",
      );
      setErrorMessage(t("error-processing"));
      toast.error(t("error-processing"));
    } finally {
      setIsSubmitting(false);
      submitting.current = false;
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    beginCheckout();
    trackFunnel("checkout_submit", "payment_submitted", {}, false);

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
      trackError(
        "billing_validation",
        "invalid_fields",
        [...new Set(parsed.error.issues.map((issue) => issue.path[0]))].join(
          ",",
        ),
      );
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
    detailsComplete.current = true;
    trackFunnel("checkout_details_complete", "details_complete");
    form.reset(parsed.data, { keepValues: true });
    await handleSubmit(parsed.data);
  };

  return (
    <div ref={container}>
      <Form {...form}>
        <form
          onSubmit={handleFormSubmit}
          onFocusCapture={beginCheckout}
          onBlurCapture={() => {
            if (billingDetailsSchema.safeParse(form.getValues()).success) {
              detailsComplete.current = true;
              trackFunnel("checkout_details_complete", "details_complete");
            }
          }}
          data-analytics-form-name="checkout"
          noValidate
          aria-busy={!isCheckoutReady}
          className="space-y-4"
        >
          {/* <Separator /> */}

          <h3 className="font-semibold text-2xl mb-1 font-[family-name:var(--font-cormorant-garamond)] text-foreground">
            {t("form-shipping-title")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-[family-name:var(--font-lora)]">
            {t("form-shipping-description")}
          </p>
          <BillingDetailsForm form={form} disabled={isSubmitting} />

          <Separator className="my-8" />
          <h3 className="font-semibold text-2xl mb-1 font-[family-name:var(--font-cormorant-garamond)] text-foreground">
            {t("form-payment-title")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-[family-name:var(--font-lora)]">
            {t("form-payment-description")}
          </p>
          <PaymentElement
            options={paymentElementOptions}
            onReady={() => {
              setIsPaymentElementReady(true);
              setPaymentLoadError(false);
            }}
            onFocus={beginCheckout}
            onChange={(event) => {
              if (event.complete) {
                paymentComplete.current = true;
                trackFunnel("add_payment_info", "payment_details_complete");
              }
            }}
            onLoadError={() => {
              setPaymentLoadError(true);
              trackError("payment_element", "load_failed");
            }}
          />
          {!isPaymentElementReady && !paymentLoadError && (
            <p role="status" className="text-sm text-muted-foreground">
              {t("loading-status")}
            </p>
          )}
          {paymentLoadError && (
            <div role="alert" className="space-y-2 text-sm text-destructive">
              <p>{t("error-message")}</p>
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={() => window.location.reload()}
              >
                {t("retry-button")}
              </button>
            </div>
          )}
          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}
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
