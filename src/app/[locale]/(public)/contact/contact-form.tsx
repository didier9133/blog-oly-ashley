"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SendHorizontal } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/app/[locale]/actions/contact";
import { useTranslations } from "next-intl";

const createFormContactSchema = (t: { (key: string): string }) =>
  z.object({
    name: z.string().min(1, t("name-required")),
    email: z.string().email(t("email-invalid")),
    message: z
      .string()
      .min(1, t("message-required"))
      .max(5000, t("message-max")),
  });

export default function ContactForm() {
  const t_validation = useTranslations("Contact.validation");
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formContactSchema = createFormContactSchema(t_validation);
  type FormContact = z.infer<typeof formContactSchema>;

  const formContact = useForm<FormContact>({
    resolver: zodResolver(formContactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: FormContact) => {
    toast.loading(t("toast-loading"));
    try {
      setIsSubmitting(true);
      await sendContactEmail({
        name: values.name,
        email: values.email,
        message: values.message,
      });
      toast.dismiss();
      toast.success(t("toast-success"));
      formContact.reset();
    } catch (error) {
      console.error("Error sending contact email:", error);
      toast.dismiss();
      toast.error(t("toast-error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      <Form {...formContact}>
        <form
          onSubmit={formContact.handleSubmit(onSubmit)}
          className="space-y-6 font-sans"
        >
          <Card className="border-border/50 shadow-md rounded-sm bg-card">
            <CardHeader className="pb-4 pt-8 px-8">
              <CardTitle className="text-2xl font-light text-foreground italic font-[family-name:var(--font-cormorant-garamond)]">
                {t("title-form")}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={formContact.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">
                        {t("name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("placeholder-name")}
                          className="rounded-sm border-border/50 focus-visible:ring-[#d8a08b]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formContact.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">
                        {t("email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("placeholder-email")}
                          className="rounded-sm border-border/50 focus-visible:ring-[#d8a08b]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={formContact.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("message")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("placeholder-message")}
                        className="resize-none min-h-[150px] rounded-sm border-border/50 focus-visible:ring-[#d8a08b]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm text-foreground/50 italic font-[family-name:var(--font-lora)]">
                {t("disclaimer")}
              </p>
            </CardContent>

            <CardFooter className="flex justify-end border-t border-border/50 p-8 bg-[#f5f0eb]/30">
              <div className="flex space-x-4">
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-sm px-6 py-6 font-[family-name:var(--font-lora)] text-base border-foreground/20 text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-all duration-300"
                  >
                    {t("cancel")}
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-sm px-8 py-6 font-[family-name:var(--font-lora)] text-base bg-[#d8a08b] text-white hover:bg-[#c28c77] transition-all duration-300 shadow-sm"
                >
                  {isSubmitting ? t("submitting") : t("submit")}
                  <SendHorizontal className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}