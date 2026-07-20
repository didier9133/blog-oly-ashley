import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterTable } from "./newsletter-table";
import { formatDate } from "@/lib/format-date";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Page() {
  const [t, locale] = await Promise.all([
    getTranslations("dashboard.newsletterPage"),
    getLocale(),
  ]);
  const { userId } = await auth();

  // Middleware debería proteger /dashboard, pero igual evitamos un crash.
  if (!userId) {
    return (
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t("restricted-title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("restricted-body")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rows = await prisma.newsletterSignup.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const pendingCount = rows.filter((r) => !r.handledAt).length;
  const tableRows = rows.map((row) => ({
    id: row.id,
    email: row.email,
    source: row.source,
    sourceUrl: row.sourceUrl,
    locale: row.locale,
    createdAtLabel: formatDate(row.createdAt, locale),
    handled: Boolean(row.handledAt),
  }));

  return (
    <div className="min-h-screen font-[family-name:var(--font-lora)]">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cormorant-garamond)]">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {t("summary", { pending: pendingCount, total: rows.length })}
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">{t("back")}</Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("latest")}</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsletterTable rows={tableRows} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
