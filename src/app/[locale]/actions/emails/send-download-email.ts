"use server";

import { Resend } from "resend";
import DownloadEmailTemplate from "@/components/email/download-email-template";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailDomain = process.env.EMAIL_DOMAIN;

interface SendDownloadEmailParams {
  email: string;
  customerName: string;
  productName: string;
  downloadLink: string;
  communityLink: string;
  locale: "en" | "es";
}

export async function sendDownloadEmail({
  email,
  customerName,
  productName,
  downloadLink,
  communityLink,
  locale,
}: SendDownloadEmailParams) {
  try {
    const emailHtml = await render(
      await DownloadEmailTemplate({
        customerName,
        productName,
        downloadLink,
        communityLink,
        locale,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: `Ashley Leon <noreply@${emailDomain}>`, // Ajusta tu dominio
      to: [email],
      subject:
        locale === "es"
          ? `Ya puedes acceder a ${productName}`
          : `Your ${productName} PDF + Community Access is Ready`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error enviando email:", error);
      throw error;
    }

    console.log("✅ Email enviado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error en sendDownloadEmail:", error);
    throw error;
  }
}
