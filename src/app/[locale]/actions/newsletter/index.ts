"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import OwnerNewsletterNotificationTemplate from "@/components/email/notify-newsletter";
import { Resend } from "resend";
import { NEWSLETTER_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";

const emailDomain = process.env.EMAIL_DOMAIN;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const NOTIFICATION_EMAIL = NEWSLETTER_NOTIFICATION_EMAIL;

const subscribeSchema = z.object({
  email: z.string().email(),
  locale: z.string().optional(),
  source: z.string().optional(),
});

export async function subscribeToNewsletter(
  email: string,
  options?: { locale?: string; source?: string }
) {
  const parsed = subscribeSchema.safeParse({
    email,
    locale: options?.locale,
    source: options?.source,
  });

  if (!parsed.success) {
    throw new Error("El correo electrónico no es válido.");
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();

  // Guardar en DB (idempotente)
  const signup = await prisma.newsletterSignup.upsert({
    where: { email: normalizedEmail },
    update: {
      locale: parsed.data.locale ?? undefined,
      source: parsed.data.source ?? undefined,
    },
    create: {
      email: normalizedEmail,
      locale: parsed.data.locale,
      source: parsed.data.source,
    },
  });

  // Notificar al dueño (si hay configuración)
  if (!resend || !emailDomain) {
    return { success: true, saved: true, notified: false, signupId: signup.id };
  }

  await resend.emails.send({
    from: `Raices & Returning <notify@${emailDomain}>`,
    to: NOTIFICATION_EMAIL,
    subject: `📰 Nueva suscripción pendiente: ${normalizedEmail}`,
    react: OwnerNewsletterNotificationTemplate({
      email: normalizedEmail,
      source: parsed.data.source,
      locale: parsed.data.locale,
    }),
  });

  return { success: true, saved: true, notified: true, signupId: signup.id };
}

export async function markNewsletterSignupHandled(params: {
  email: string;
  notes?: string;
}) {
  const emailParsed = z.string().email().safeParse(params.email);
  if (!emailParsed.success) throw new Error("El correo electrónico no es válido.");

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
