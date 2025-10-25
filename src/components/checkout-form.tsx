"use client";

import React, { useMemo, useState } from "react";
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
import { useTranslations } from "next-intl";

export default function CheckoutForm() {
  const t = useTranslations("Checkout");
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const billingDetailsSchema = useMemo(
    () => createBillingDetailsSchema(t),
    [t]
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
      business: { name: "Raíces & Returnings" },
      fields: {
        billingDetails: {
          name: "never",
          email: "never",
          phone: "never",
          address: "auto",
        },
      },
    }),
    []
  );

  const handleSubmit = async (values: BillingDetailsFormValues) => {
    if (!stripe || !elements) return;

    try {
      setIsSubmitting(true);

      const localeSegment = window.location.pathname.split("/")[1];
      const successPath = localeSegment
        ? `/${localeSegment}/ebook/success`
        : "/ebook/success";
      const returnUrl = `${window.location.origin}${successPath}`;
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message ?? t("error-submit-fields"));
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
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
        toast.error(error.message ?? t("error-payment-failed"));
      }
    } catch (error) {
      console.error("Error al confirmar el pago:", error);
      toast.error(t("error-processing"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          aria-busy={!isCheckoutReady}
          className={cn(
            "space-y-4 transition-opacity duration-300",
            !isCheckoutReady ? "opacity-0" : "opacity-100"
          )}
        >
          <Separator />

          <h3 className="font-semibold mb-3">{t("form-shipping-title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("form-shipping-description")}
          </p>
          <BillingDetailsForm
            form={form}
            disabled={isSubmitting || !isCheckoutReady}
          />

          <Separator />
          <div className="rounded-2xl  bg-card/80 p-0 shadow-sm md:p-6 md:border md:border-border/60 ">
            <div className="mb-4 space-y-1">
              <h3 className="font-semibold text-foreground ">
                {t("form-payment-title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("form-payment-description")}
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/90 p-4">
              <PaymentElement
                options={paymentElementOptions}
                onReady={() => setIsPaymentElementReady(true)}
              />
            </div>
          </div>
          <ButtonPay
            isSubmitting={isSubmitting}
            isDisabled={!isCheckoutReady || isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
}
