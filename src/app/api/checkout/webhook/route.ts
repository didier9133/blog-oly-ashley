import { stripe } from "@/lib/stripe";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sendDownloadEmail } from "@/app/[locale]/actions/emails/send-download-email";
import prisma from "@/lib/prisma";
import { createDownloadUrl } from "@/app/[locale]/actions/files";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get("stripe-signature")!;

    if (!process.env.STRIPE_WEBHOOK_SIGNING_SECRET) {
      throw new Error("Missing Stripe Webhook Signing Secret");
    }
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET
    );
    // Procesar pago completado exitosamente
    if (event.type === "charge.updated") {
      const session = event.data.object;
      // Obtener información del producto desde metadata
      const productName = session.metadata.productName;
      const productType = session.metadata.productType;
      const s3Key = session.metadata.s3Key;

      if (!s3Key || !productName || !productType) {
        console.error("❌ Faltan datos en metadata");
        return NextResponse.json(
          { error: "Missing data in metadata" },
          { status: 400 }
        );
      }

      if (
        !session.billing_details.email ||
        !session.billing_details.name ||
        !session.billing_details.address
      ) {
        console.error("❌ Faltan datos en el billing details");
        return NextResponse.json(
          { error: "Missing billing details email" },
          { status: 400 }
        );
      }

      // Crear registro de compra con token único
      const purchase = await prisma.purchase.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentIntent: session.payment_intent as string,
          customerEmail: session.billing_details.email,
          customerName: session.billing_details.name,
          amount: session.amount_captured || 0,
          currency: session.currency || "usd",
          productName,
          productType,
          s3Key,
          is_paid: session.paid || false,
        },
      });

      console.log("✅ Registro de compra creado:", purchase.id);

      const downloadLink = await createDownloadUrl(
        purchase.s3Key,
        purchase.productName
      );

      // Enviar email con link de descarga
      try {
        await sendDownloadEmail({
          email: purchase.customerEmail,
          customerName: purchase.customerName || "Cliente",
          productName: purchase.productName,
          downloadLink,
        });

        // Marcar email como enviado
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { emailSent: true },
        });

        console.log("✅ Email de descarga enviado a:", purchase.customerEmail);
      } catch (emailError) {
        console.error("❌ Error enviando email:", emailError);
        // No fallar el webhook por error de email
      }
    }

    // Manejar reembolsos
    if (event.type === "charge.refunded") {
      const charge = event.data.object;

      await prisma.purchase.updateMany({
        where: { stripePaymentIntent: charge.payment_intent as string },
        data: { is_paid: false },
      });

      console.log("✅ Compra marcada como reembolsada");
    }

    return NextResponse.json(
      { received: true },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook Error" },
      {
        status: 400,
      }
    );
  }
}
