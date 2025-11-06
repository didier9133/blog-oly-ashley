import "server-only";

import DownloadEmailTemplate from "@/components/email/download-email-template";

type RenderDownloadEmailOptions = {
  customerName: string;
  productName: string;
  downloadLink: string;
  locale: "en" | "es";
};

export async function renderDownloadEmailMarkup(
  options: RenderDownloadEmailOptions
) {
  const { renderToStaticMarkup } = await import("react-dom/server");

  const emailElement = await DownloadEmailTemplate(options);

  const markup = renderToStaticMarkup(emailElement);

  return `<!DOCTYPE html>${markup}`;
}
