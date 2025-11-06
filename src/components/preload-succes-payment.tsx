"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import AutoReload from "./auto-reload";

export default function PreloadSuccessPayment({
  customerEmail,
}: {
  customerEmail?: string;
}) {
  const t = useTranslations("EbookSuccess");

  return (
    <>
      <AutoReload />
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto border border-border/60 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-secondary">
              {t("processing-title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("processing-description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("processing-body")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t.rich("processing-email", {
                highlight: (chunks) => <strong>{chunks}</strong>,
                email: customerEmail ?? t("processing-emailFallback"),
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
