"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { subscribeToNewsletter } from "@/app/[locale]/actions/newsletter";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { scrollToNewsletter as scrollToNewsletterUtil } from "@/lib/newsletter-scroll";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type FormSubscribe = z.infer<typeof subscribeSchema>;

export function FormSubscribeNewsletter() {
  const t = useTranslations("footer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleNewsletterHash = () => {
      if (window.location.hash !== "#newsletter") return;

      scrollToNewsletterUtil({ behavior: "smooth" });
    };

    handleNewsletterHash();
    window.addEventListener("hashchange", handleNewsletterHash);
    return () => window.removeEventListener("hashchange", handleNewsletterHash);
  }, []);

  const formSubscribe = useForm<FormSubscribe>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormSubscribe) => {
    try {
      toast.loading(t("toast-loading"));
      setIsSubmitting(true);
      await subscribeToNewsletter(data.email);
      toast.success(t("toast-success"));
    } catch (error) {
      console.error("Subscription error:", error);
      const errorMessage = t("toast-error");
      toast.error(errorMessage);
    } finally {
      toast.dismiss();
      formSubscribe.reset();
      setIsSubmitting(false);
    }
  };

  return (
    <div id="newsletter">
      <Form {...formSubscribe}>
        <form
          onSubmit={formSubscribe.handleSubmit(onSubmit)}
          className="flex w-full items-start max-w-sm  space-x-2"
        >
          <FormField
            control={formSubscribe.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    ref={(node) => {
                      emailInputRef.current = node;
                      field.ref(node);
                    }}
                    placeholder={t("placeholder")}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {t("subscribe-label")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
