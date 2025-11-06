import { setRequestLocale } from "next-intl/server";
import { renderDownloadEmailMarkup } from "@/lib/emails/render-download-email";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DownloadEmailPreviewPage({
  searchParams,
}: PageProps) {
  const getParam = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const localeParam = getParam("locale");
  const locale = localeParam === "en" ? "en" : "es";
  const customerName = getParam("customerName") ?? "Oly";
  const productName = getParam("productName") ?? "Raíces Ebook";
  const downloadLink =
    getParam("downloadLink") ?? "https://example.com/download.pdf";

  setRequestLocale(locale);

  const emailMarkup = await renderDownloadEmailMarkup({
    customerName,
    productName,
    downloadLink,
    locale,
  });

  return (
    <div style={pageStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>Download Email Preview</h1>
        <p style={subtitleStyles}>
          Showing the {locale.toUpperCase()} version for {customerName}.
        </p>
      </header>
      <iframe
        title="Download Email Preview"
        srcDoc={emailMarkup}
        style={iframeStyles}
      />
    </div>
  );
}

const pageStyles = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "16px",
  padding: "24px",
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
  boxSizing: "border-box" as const,
};

const headerStyles = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px",
};

const titleStyles = {
  margin: 0,
  fontSize: "20px",
  color: "#1f2937",
  fontWeight: 600,
};

const subtitleStyles = {
  margin: 0,
  color: "#4b5563",
  fontSize: "14px",
};

const iframeStyles = {
  flex: 1,
  width: "100%",
  minHeight: "720px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  backgroundColor: "#fff",
};
