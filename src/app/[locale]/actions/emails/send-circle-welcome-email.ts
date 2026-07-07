"use server";

import { render } from "@react-email/render";
import { Resend } from "resend";
import CircleWelcomeEmailTemplate from "@/components/email/circle-welcome-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailDomain = process.env.EMAIL_DOMAIN;

interface SendCircleWelcomeEmailParams {
  email: string;
  customerName: string;
  communityLink: string;
  journalLink: string;
}

export async function sendCircleWelcomeEmail({
  email,
  customerName,
  communityLink,
  journalLink,
}: SendCircleWelcomeEmailParams) {
  try {
    const emailHtml = await render(
      CircleWelcomeEmailTemplate({
        customerName,
        communityLink,
        journalLink,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: `Ashley Leon <noreply@${emailDomain}>`,
      to: [email],
      subject:
        "You're in. Here's everything you need for Rebuilding Reverence Circle",
      html: emailHtml,
    });

    if (error) {
      console.error("Error enviando email de bienvenida del Circle:", error);
      throw error;
    }

    console.log("✅ Email de bienvenida del Circle enviado:", data);
    return data;
  } catch (error) {
    console.error("Error en sendCircleWelcomeEmail:", error);
    throw error;
  }
}
