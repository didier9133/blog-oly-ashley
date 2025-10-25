import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { CheckCircle, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    payment_intent?: string;
    payment_intent_client_secret?: string;
    redirect_status?: string;
  }>;
}

async function SuccessContent({
  sessionId,
  paymentIntentId,
}: {
  sessionId?: string;
  paymentIntentId?: string;
}) {
  if (!sessionId && !paymentIntentId) {
    redirect("/ebook");
  }

  try {
    const checkoutSession: Stripe.Checkout.Session | null = sessionId
      ? await stripe.checkout.sessions
          .retrieve(sessionId, { expand: ["payment_intent"] })
          .then((session) => session as Stripe.Checkout.Session)
          .catch((error): Stripe.Checkout.Session | null => {
            console.error("Error retrieving checkout session:", error);
            return null;
          })
      : null;

    if (checkoutSession) {
      console.log("Stripe session:", checkoutSession);
    }

    const resolvedPaymentIntentId =
      paymentIntentId ??
      (typeof checkoutSession?.payment_intent === "string"
        ? checkoutSession.payment_intent
        : checkoutSession?.payment_intent?.id) ??
      undefined;

    const paymentIntent: Stripe.PaymentIntent | null = resolvedPaymentIntentId
      ? await stripe.paymentIntents
          .retrieve(resolvedPaymentIntentId, { expand: ["latest_charge"] })
          .then((intent) => intent as Stripe.PaymentIntent)
          .catch((error): Stripe.PaymentIntent | null => {
            console.error("Error retrieving payment intent:", error);
            return null;
          })
      : null;

    const isPaid =
      checkoutSession?.payment_status === "paid" ||
      paymentIntent?.status === "succeeded";

    const purchaseFromSession = sessionId
      ? await prisma.purchase.findUnique({
          where: { stripeSessionId: sessionId },
        })
      : null;

    let purchase = purchaseFromSession;

    if (!purchase && resolvedPaymentIntentId) {
      purchase = await prisma.purchase.findUnique({
        where: { stripePaymentIntent: resolvedPaymentIntentId },
      });
    }

    if (!purchase && paymentIntent && paymentIntent.latest_charge) {
      const latestChargeId =
        typeof paymentIntent.latest_charge === "string"
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge?.id;

      if (latestChargeId) {
        purchase = await prisma.purchase.findUnique({
          where: { stripeSessionId: latestChargeId },
        });
      }
    }

    const latestChargeEmail =
      typeof paymentIntent?.latest_charge !== "string"
        ? (paymentIntent?.latest_charge?.billing_details?.email ?? undefined)
        : undefined;

    const customerEmail =
      purchase?.customerEmail ??
      checkoutSession?.customer_details?.email ??
      paymentIntent?.receipt_email ??
      latestChargeEmail ??
      undefined;

    if (!isPaid) {
      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto border border-border/60 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-secondary">Pago en proceso</CardTitle>
              <CardDescription className="text-muted-foreground">
                El pago aún no se ha completado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Por favor, espera unos momentos mientras procesamos tu pago.
              </p>
              {customerEmail ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Notificaremos al correo <strong>{customerEmail}</strong>{" "}
                  cuando el pago se confirme.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!purchase) {
      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto border border-border/60 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-secondary">
                Procesando tu compra...
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Tu pago se ha recibido correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Estamos procesando tu compra. Recibirás un email con el enlace
                de descarga en los próximos minutos.
              </p>
              <p className="text-sm text-muted-foreground">
                Email de confirmación enviado a:{" "}
                <strong>{customerEmail ?? "tu correo electrónico"}</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Compra encontrada y completada
    return (
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-accent/10"
          aria-hidden
        />
        <div className="container mx-auto flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-20 lg:py-28">
          <Card className="max-w-3xl border border-border/50 bg-card/95 shadow-lg backdrop-blur-sm">
            <CardHeader className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-semibold text-primary">
                  ¡Compra completada exitosamente!
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Gracias por tu compra de{" "}
                  <strong>{purchase.productName}</strong>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Información del email */}
              <section className="rounded-xl border border-secondary/30 bg-secondary/15 p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex size-12 items-center justify-center rounded-full border border-secondary/40 bg-secondary/20">
                    <Mail className="size-5 text-secondary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-secondary">
                      Revisa tu correo electrónico
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hemos enviado un enlace de descarga a{" "}
                      <strong>{purchase.customerEmail}</strong>
                    </p>
                    <p className="text-xs text-secondary/90">
                      Si no lo encuentras en tu bandeja principal, revisa la
                      carpeta de spam.
                    </p>
                  </div>
                </div>
              </section>

              {/* Información importante */}
              <section className="rounded-xl border border-accent/25 bg-accent/10 p-5">
                <h4 className="font-semibold text-sm text-accent">
                  ℹ️ Información importante
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-2 rounded-full bg-primary" />
                    Tu enlace de descarga es válido por{" "}
                    <strong>48 horas</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-2 rounded-full bg-primary" />
                    El enlace es único y personal
                  </li>
                </ul>
              </section>

              {/* Detalle de compra */}
              <section className="rounded-xl border border-border/50 bg-background/80 p-5 shadow-inner">
                <h4 className="mb-4 font-semibold text-sm text-muted-foreground">
                  Detalle de compra
                </h4>
                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Producto</dt>
                    <dd className="font-medium text-foreground">
                      {purchase.productName}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-muted-foreground">Monto</dt>
                    <dd className="font-medium text-foreground">
                      ${(purchase.amount / 100).toFixed(2)}{" "}
                      {purchase.currency.toUpperCase()}
                    </dd>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <dt className="text-muted-foreground">Fecha</dt>
                    <dd className="font-medium text-foreground">
                      {new Date(purchase.createdAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* CTA */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  ¿Problemas con la descarga?{" "}
                  <Link
                    href="/contact"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Contáctanos
                  </Link>
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
                  >
                    Ir al inicio
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error en success page:", error);
    redirect("/ebook");
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-20 lg:py-28">
          <div className="w-full max-w-3xl animate-pulse space-y-6 rounded-2xl border border-border/60 bg-card/60 p-10 shadow-sm">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-20 w-20 rounded-full border border-primary/20 bg-primary/10" />
              <div className="space-y-2">
                <div className="mx-auto h-6 w-48 rounded bg-muted" />
                <div className="mx-auto h-4 w-64 rounded bg-muted/80" />
              </div>
            </div>
            <div className="space-y-4 rounded-xl border border-secondary/20 bg-secondary/10 p-6">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted/70" />
              <div className="h-3 w-5/6 rounded bg-muted/50" />
            </div>
            <div className="grid gap-3 rounded-xl border border-border/40 bg-background/70 p-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-muted/70" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-muted/70" />
                <div className="h-4 w-28 rounded bg-muted" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="h-3 w-24 rounded bg-muted/70" />
                <div className="h-4 w-40 rounded bg-muted" />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-4 w-48 rounded bg-muted" />
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <div className="h-10 w-full rounded bg-muted sm:w-40" />
                <div className="h-10 w-full rounded bg-muted/80 sm:w-40" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent
        sessionId={params.session_id}
        paymentIntentId={params.payment_intent}
      />
    </Suspense>
  );
}
