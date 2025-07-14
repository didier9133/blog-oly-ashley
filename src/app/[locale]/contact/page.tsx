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
import { sendContactEmail } from "../actions/contact";
import { useTranslations } from "next-intl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFormContactSchema = (t: any) =>
  z.object({
    firstName: z.string().min(1, t("firstName-required")),
    lastName: z.string().min(1, t("lastName-required")),
    email: z.string().email(t("email-invalid")),
    content: z
      .string()
      .min(1, t("content-required"))
      .max(5000, t("content-max")),
    subject: z
      .string()
      .min(1, t("subject-required"))
      .max(100, t("subject-max")),
  });

export default function ContactPage() {
  const t_validation = useTranslations("Contact.validation");
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create the schema with the translation function
  const formContactSchema = createFormContactSchema(t_validation);
  type FormContact = z.infer<typeof formContactSchema>;

  const formContact = useForm<FormContact>({
    resolver: zodResolver(formContactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      content: "",
      subject: "",
    },
  });

  const onSubmit = async (values: FormContact) => {
    toast.loading(t("toast-loading"));
    try {
      setIsSubmitting(true);
      await sendContactEmail({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        content: values.content,
        subject: values.subject,
      });
      toast.dismiss();
      toast.success(t("toast-success"));
      formContact.reset();
    } catch (error) {
      console.error("Error sending contact email:", error);
      const errorMessage = t("toast-error");
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-8">
      <div className="conatainer  max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cormorant-garamond)]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-gray-400">{t("paragraph")}</p>
        </div>

        <Form {...formContact}>
          <form
            onSubmit={formContact.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Card className=" shadow-sm">
              <CardHeader>
                <CardTitle>{t("title-form")}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={formContact.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("firstName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholder-firstName")}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={formContact.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("lastName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholder-lastName")}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={formContact.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholder-email")}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={formContact.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("subject")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholder-subject")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={formContact.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("content")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("placeholder-content")}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex justify-end border-t border-border pt-6">
                <div className="flex space-x-2">
                  <Link href="/">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary hover:border-primary hover:bg-transparent hover:text-slate-800 dark:hover:text-slate-200 dark:border-primary/70 dark:hover:bg-primary/20"
                    >
                      {t("cancel")}
                    </Button>
                  </Link>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("submitting") : t("submit")}
                    <SendHorizontal className="h-2 w-2 mr-2" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
