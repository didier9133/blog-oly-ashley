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
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { useState } from "react";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type FormSubscribe = z.infer<typeof subscribeSchema>;

export function FormSubscribeNewsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSubscribe = useForm<FormSubscribe>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormSubscribe) => {
    try {
      toast.loading("Submitting your subscription...");
      setIsSubmitting(true);
      await subscribeToNewsletter(data.email);
      toast.success("Successfully subscribed to the newsletter!");
    } catch (error) {
      let errorMessage = "An error occurred while subscribing.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      toast.dismiss();
      formSubscribe.reset();
      setIsSubmitting(false);
    }
  };

  return (
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
                  placeholder="Enter your email"
                  className=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Subscribe
        </Button>
      </form>
    </Form>
  );
}
