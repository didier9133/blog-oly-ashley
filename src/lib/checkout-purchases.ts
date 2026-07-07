import type Stripe from "stripe";
import prisma from "@/lib/prisma";
import { createDownloadUrl } from "@/app/[locale]/actions/files";
import { sendDownloadEmail } from "@/app/[locale]/actions/emails/send-download-email";
import { sendCircleWelcomeEmail } from "@/app/[locale]/actions/emails/send-circle-welcome-email";
import { PRODUCT_NAME_DICTIONARY } from "@/lib/checkout-events";

const CIRCLE_PRODUCT_TYPE = "live_session";
const CIRCLE_S3_KEY = "live-sessions/rebuilding-reverence-circle";
const CIRCLE_COMMUNITY_LINK =
  "https://www.gokollab.com/rebuilding-reverence-circle-tbxqud/home";
const REBUILDING_REVERENCE_JOURNAL_S3_KEY =
  "ebooks/1761430103993_Rebuilding_Reverence.pdf";
const REBUILDING_REVERENCE_JOURNAL_FILE_NAME = "Rebuilding Reverence Journal";
const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

function normalizeProductName(value: string | undefined) {
  if (!value) return undefined;
  return PRODUCT_NAME_DICTIONARY[value] ?? value;
}

function getLatestCharge(paymentIntent: Stripe.PaymentIntent) {
  return typeof paymentIntent.latest_charge === "string"
    ? null
    : paymentIntent.latest_charge;
}

function isCirclePurchase(productType: string, s3Key: string) {
  return productType === CIRCLE_PRODUCT_TYPE && s3Key === CIRCLE_S3_KEY;
}

export async function finalizePaidPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
) {
  if (paymentIntent.status !== "succeeded") return null;

  const latestCharge = getLatestCharge(paymentIntent);
  const metadata = paymentIntent.metadata ?? {};
  const productName = normalizeProductName(metadata.productName);
  const productType = metadata.productType;
  const s3Key = metadata.s3Key;
  const language = metadata.language === "en" ? "en" : "es";
  const customerEmail =
    latestCharge?.billing_details.email ??
    paymentIntent.receipt_email ??
    metadata.customerEmail;
  const customerName =
    latestCharge?.billing_details.name ?? metadata.customerName ?? "Cliente";

  if (!productName || !productType || !s3Key || !customerEmail) {
    return null;
  }

  const purchase = await prisma.purchase.upsert({
    where: { stripePaymentIntent: paymentIntent.id },
    update: {
      stripeSessionId: latestCharge?.id ?? paymentIntent.id,
      customerEmail,
      customerName,
      amount:
        latestCharge?.amount_captured ??
        paymentIntent.amount_received ??
        paymentIntent.amount,
      currency: latestCharge?.currency ?? paymentIntent.currency ?? "usd",
      productName,
      productType,
      s3Key,
      is_paid: true,
    },
    create: {
      stripeSessionId: latestCharge?.id ?? paymentIntent.id,
      stripePaymentIntent: paymentIntent.id,
      customerEmail,
      customerName,
      amount:
        latestCharge?.amount_captured ??
        paymentIntent.amount_received ??
        paymentIntent.amount,
      currency: latestCharge?.currency ?? paymentIntent.currency ?? "usd",
      productName,
      productType,
      s3Key,
      is_paid: true,
    },
  });

  if (!purchase.emailSent) {
    try {
      if (isCirclePurchase(purchase.productType, purchase.s3Key)) {
        const journalLink = await createDownloadUrl(
          REBUILDING_REVERENCE_JOURNAL_S3_KEY,
          REBUILDING_REVERENCE_JOURNAL_FILE_NAME,
          SEVEN_DAYS_IN_SECONDS,
        );

        await sendCircleWelcomeEmail({
          email: purchase.customerEmail,
          customerName: purchase.customerName || "there",
          communityLink: CIRCLE_COMMUNITY_LINK,
          journalLink,
        });
      } else {
        const downloadLink = await createDownloadUrl(
          purchase.s3Key,
          purchase.productName,
        );

        await sendDownloadEmail({
          email: purchase.customerEmail,
          customerName: purchase.customerName || "Cliente",
          productName: purchase.productName,
          downloadLink,
          locale: language,
        });
      }

      return prisma.purchase.update({
        where: { id: purchase.id },
        data: { emailSent: true },
      });
    } catch (error) {
      console.error("Error sending checkout email:", error);
    }
  }

  return purchase;
}
