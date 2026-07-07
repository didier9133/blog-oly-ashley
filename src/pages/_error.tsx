import type { NextPage, NextPageContext } from "next";

const ErrorPage: NextPage<{ statusCode: number }> = ({ statusCode }) => {
  return (
    <p style={{ fontFamily: "Georgia, serif", color: "#44403c", padding: "2rem" }}>
      {statusCode
        ? `An error ${statusCode} occurred on the server.`
        : "An error occurred on the client."}
    </p>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;