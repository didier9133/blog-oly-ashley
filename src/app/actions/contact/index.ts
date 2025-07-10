"use server";

import { Resend } from "resend";
import ContactEmailTemplateProps from "@/components/email/response-contact";
import OwnerNotificationTemplate from "@/components/email/notify-contact";

const resend = new Resend(process.env.RESEND_API_KEY);
const DOMAIN = "decs.lat";
const NOTIFICATION_EMAIL = "raicesreturnings@gmail.com";

export async function sendContactEmail({
  firstName,
  lastName,
  email,
  content,
  subject,
}: {
  firstName: string;
  lastName: string;
  email: string;
  content: string;
  subject: string;
}) {
  try {
    const { error } = await resend.emails.send({
      from: `Raices & Returning <no-reply@${DOMAIN}>`,
      to: email,
      subject: "Ohh! Estamos felices de que nos contactes 🤗🤗",
      react: ContactEmailTemplateProps({
        customerName: `${firstName} ${lastName}`.trim(),
        message: content,
      }),
    });

    if (error) {
      throw new Error(`Error al enviar el correo: ${error.message}`);
    }
    notifyContactFormSubmission({
      firstName,
      lastName,
      email,
      content,
      subject,
    });
    return;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error(`Error al enviar el correo`);
  }
}

export async function notifyContactFormSubmission(params: {
  firstName: string;
  lastName: string;
  email: string;
  content: string;
  subject: string;
}) {
  await resend.emails.send({
    from: `Raices & Returning <notify@${DOMAIN}>`,
    to: NOTIFICATION_EMAIL,
    subject: params.subject,
    react: OwnerNotificationTemplate({
      customerEmail: params.email,
      customerName: `${params.firstName} ${params.lastName}`.trim(),
      message: params.content,
    }),
  });
  return {
    success: true,
    message: "Notificación enviada correctamente",
  };
}
