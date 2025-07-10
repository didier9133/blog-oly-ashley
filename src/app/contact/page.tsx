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

const formContactSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("El correo electrónico no es válido"),
  content: z
    .string()
    .min(1, "El contenido es obligatorio")
    .max(5000, "El contenido no puede exceder los 5000 caracteres"),
  subject: z
    .string()
    .min(1, "El asunto es obligatorio")
    .max(100, "El asunto no puede exceder los 100 caracteres"),
});

type FormContact = z.infer<typeof formContactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    toast.loading("Guardando post...");
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
      toast.success("Post guardado exitosamente");
      formContact.reset();
    } catch (error) {
      let errorMessage = "Lo sentimos, ocurrió un error al enviar el mensaje.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
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
            Contact Us
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Do you have questions or feedback? We would love to hear from you!
            Fill out the form below and we will get back to you as soon as
            possible.
          </p>
        </div>

        <Form {...formContact}>
          <form
            onSubmit={formContact.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Card className=" shadow-sm">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={formContact.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
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
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your subject"
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
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
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
                  <Link href="/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary hover:border-primary  hover:bg-transparent hover:text-slate-800"
                    >
                      Back
                    </Button>
                  </Link>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send"}
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
