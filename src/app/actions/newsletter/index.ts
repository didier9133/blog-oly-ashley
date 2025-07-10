"use server";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mailchimp = require("@mailchimp/mailchimp_marketing");

const apiKey = process.env.MAILCHIMP_API_KEY;
const server = process.env.MAILCHIMP_SERVER_PREFIX;

if (!apiKey || !server) {
  throw new Error(
    "Configuración de Mailchimp incompleta. Verifica las variables de entorno."
  );
}

mailchimp.setConfig({
  apiKey,
  server,
});

export async function run() {
  const response = await mailchimp.ping.get();
  return response;
}

export async function subscribeToNewsletter(email: string) {
  if (!email) {
    throw new Error(
      "El correo electrónico es obligatorio para la suscripción."
    );
  }

  const list_id = process.env.MAILCHIMP_LIST_ID;
  if (!list_id) {
    throw new Error("El ID de lista de Mailchimp no está configurado.");
  }
  try {
    const response = await mailchimp.lists.addListMember(list_id, {
      email_address: email,
      status: "subscribed",
    });
    return response;
  } catch (error: unknown) {
    // Manejo de errores específico de Mailchimp
    const mailchimpError = error as { response: { body: { title: string } } };
    if (mailchimpError.response && mailchimpError.response.body) {
      if (mailchimpError.response.body.title === "Member Exists") {
        throw new Error("This email is already subscribed to the newsletter.");
      }
    }
    console.error("Error al suscribirse al boletín:", error);
    throw new Error("Failed to subscribe to the newsletter. Please try again.");
  }
}
