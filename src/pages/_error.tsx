import type { NextPage, NextPageContext } from "next";

type ErrorPageProps = { statusCode: number; locale: "en" | "es" };

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode, locale }) => {
  const message =
    locale === "es"
      ? statusCode
        ? `No pudimos cargar esta página (error ${statusCode}). Inténtalo de nuevo en unos minutos.`
        : "No pudimos cargar esta página. Inténtalo de nuevo."
      : statusCode
        ? `We could not load this page (error ${statusCode}). Please try again in a few minutes.`
        : "We could not load this page. Please try again.";

  return (
    <p style={{ fontFamily: "Georgia, serif", color: "#44403c", padding: "2rem" }}>
      {message}
    </p>
  );
};

ErrorPage.getInitialProps = ({ res, err, asPath }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  const locale = asPath?.startsWith("/es") ? "es" : "en";
  return { statusCode, locale };
};

export default ErrorPage;
