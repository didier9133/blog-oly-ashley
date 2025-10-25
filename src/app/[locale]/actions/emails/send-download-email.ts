"use server";

import { Resend } from "resend";
import DownloadEmailTemplate from "@/components/email/download-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailDomain = process.env.EMAIL_DOMAIN;

interface SendDownloadEmailParams {
  email: string;
  customerName: string;
  productName: string;
  downloadLink: string;
}

export async function sendDownloadEmail({
  email,
  customerName,
  productName,
  downloadLink,
}: SendDownloadEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Raíces & Returnings <noreply@${emailDomain}>`, // Ajusta tu dominio
      to: [email],
      subject: `✅ Tu compra de "${productName}" está lista`,
      react: DownloadEmailTemplate({
        customerName,
        productName,
        downloadLink,
      }),
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
