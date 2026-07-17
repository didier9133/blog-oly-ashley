"use server";

import { Resend } from "resend";
import ContactEmailTemplateProps from "@/components/email/response-contact";
import OwnerNotificationTemplate from "@/components/email/notify-contact";
import { getTranslations } from "next-intl/server";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/server/notification-emails";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailDomain = process.env.EMAIL_DOMAIN;
const NOTIFICATION_EMAIL = CONTACT_NOTIFICATION_EMAIL;

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const t = await getTranslations("Email");

  try {
    const { error } = await resend.emails.send({
      from: `Ashley Leon <no-reply@${emailDomain}>`,
      to: email,
      subject: t("subject"),
      react: ContactEmailTemplateProps({
        customerName: name,
        message: message,
      }),
    });

    if (error) {
      throw new Error(`Error al enviar el correo: ${error.message}`);
    }
    notifyContactFormSubmission({ name, email, message });
    return;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error(`Error al enviar el correo`);
  }
}

export async function notifyContactFormSubmission(params: {
  name: string;
  email: string;
  message: string;
}) {
  await resend.emails.send({
    from: `Ashley Leon <notify@${emailDomain}>`,
    to: NOTIFICATION_EMAIL,
    subject: `Nuevo mensaje de contacto de ${params.name}`,
    react: OwnerNotificationTemplate({
      customerEmail: params.email,
      customerName: params.name,
      message: params.message,
    }),
  });
  return {
    success: true,
    message: "Notificación enviada correctamente",
  };
}
