"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

const phoneWithCountryCode = /^\+\d{1,3}(\s?\d+)+$/;
type Translator = (key: string) => string;

export const createBillingDetailsSchema = (t: Translator) =>
  z.object({
    name: z
      .string({ required_error: t("billing-name-required") })
      .min(1, t("billing-name-required")),
    email: z
      .string({ required_error: t("billing-email-required") })
      .min(1, t("billing-email-required"))
      .email(t("billing-email-invalid")),
    phone: z
      .string({ required_error: t("billing-phone-required") })
      .min(1, t("billing-phone-required"))
      .trim()
      .regex(phoneWithCountryCode, t("billing-phone-invalid")),
  });

export type BillingDetailsFormValues = z.infer<
  ReturnType<typeof createBillingDetailsSchema>
>;

interface BillingDetailsFormProps {
  form: UseFormReturn<BillingDetailsFormValues>;
  disabled?: boolean;
}

export function BillingDetailsForm({
  form,
  disabled,
}: BillingDetailsFormProps) {
  const t = useTranslations("Checkout");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-[family-name:var(--font-lora)] text-sm font-medium">
              {t("billing-name-label")}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t("billing-name-placeholder")}
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-[family-name:var(--font-lora)] text-sm font-medium">
              {t("billing-email-label")}
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder={t("billing-email-placeholder")}
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel className="font-[family-name:var(--font-lora)] text-sm font-medium">
              {t("billing-phone-label")}
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder={t("billing-phone-placeholder")}
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
