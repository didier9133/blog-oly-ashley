"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import OwnerNewsletterNotificationTemplate from "@/components/email/notify-newsletter";
import LeadMagnetEmailTemplate from "@/components/email/lead-magnet-email-template";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { headers } from "next/headers";
import {
  NEWSLETTER_NOTIFICATION_EMAIL,
  SUPPORT_EMAIL,
} from "@/lib/server/notification-emails";
import {
  LEAD_MAGNET_EMAIL_SUBJECT,
  type LeadMagnetLocale,
} from "@/lib/lead-magnet";
import { createLeadMagnetDownloadUrl } from "@/lib/server/lead-magnet-download";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const NOTIFICATION_EMAIL = NEWSLETTER_NOTIFICATION_EMAIL;

function isHttpUrl(value: string) {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const subscribeSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    locale: z.enum(["en", "es"]).default("en"),
    source: z.enum(["footer", "hero"]).optional(),
    sourceUrl: z
      .string()
      .trim()
      .url()
      .max(4096)
      .refine(isHttpUrl, "La URL de origen debe usar HTTP o HTTPS.")
      .optional(),
  })
  .strict();

export async function subscribeToNewsletter(
  email: string,
  options?: {
    locale?: LeadMagnetLocale;
    source?: "footer" | "hero";
    sourceUrl?: string;
  },
) {
  const requestHeaders = await headers();
  const sourceUrl =
    options?.sourceUrl ?? requestHeaders.get("referer") ?? undefined;
  const parsed = subscribeSchema.safeParse({
    email,
    locale: options?.locale,
    source: options?.source,
    sourceUrl,
  });

  if (!parsed.success) {
    throw new Error("El correo electrónico no es válido.");
  }

  const normalizedEmail = parsed.data.email;
  const locale = parsed.data.locale;

  // Guardar en DB (idempotente)
  const signup = await prisma.newsletterSignup.upsert({
    where: { email: normalizedEmail },
    update: {
      locale,
      source: parsed.data.source ?? undefined,
      sourceUrl: parsed.data.sourceUrl ?? undefined,
    },
    create: {
      email: normalizedEmail,
      locale,
      source: parsed.data.source,
      sourceUrl: parsed.data.sourceUrl,
    },
  });

  // La promesa del formulario incluye la entrega inmediata de la guía.
  if (!resend) {
    throw new Error("La entrega por correo no está configurada.");
  }

  const downloadLink = await createLeadMagnetDownloadUrl();
  const emailHtml = await render(LeadMagnetEmailTemplate({ downloadLink }));

  const [delivery, notification] = await Promise.all([
    resend.emails.send({
      from: `Ashley Leon <${SUPPORT_EMAIL}>`,
      to: [normalizedEmail],
      replyTo: SUPPORT_EMAIL,
      subject: LEAD_MAGNET_EMAIL_SUBJECT,
      html: emailHtml,
    }),
    resend.emails.send({
      from: `Ashley Leon <${SUPPORT_EMAIL}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: SUPPORT_EMAIL,
      subject: `New free guide signup: ${normalizedEmail}`,
      react: OwnerNewsletterNotificationTemplate({
        email: normalizedEmail,
        source: parsed.data.source,
        sourceUrl: parsed.data.sourceUrl,
        locale,
      }),
    }),
  ]);

  if (delivery.error) {
    throw new Error(`No se pudo entregar la guía: ${delivery.error.message}`);
  }

  if (notification.error) {
    console.error(
      "La guía se entregó, pero falló la notificación interna:",
      notification.error,
    );
  }

  return {
    success: true,
    saved: true,
    delivered: true,
    notified: !notification.error,
    signupId: signup.id,
  };
}

export async function markNewsletterSignupHandled(params: {
  email: string;
  notes?: string;
}) {
  const emailParsed = z.string().email().safeParse(params.email);
  if (!emailParsed.success)
    throw new Error("El correo electrónico no es válido.");

  const normalizedEmail = emailParsed.data.trim().toLowerCase();

  await prisma.newsletterSignup.update({
    where: { email: normalizedEmail },
    data: {
      handledAt: new Date(),
      notes: params.notes,
    },
  });

  return { success: true };
}
