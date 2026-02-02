"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { markHandledAction } from "./actions";

export type NewsletterSignupRow = {
  id: string;
  email: string;
  source: string | null;
  locale: string | null;
  createdAt: Date;
  handledAt: Date | null;
};

export function NewsletterTable({ rows }: { rows: NewsletterSignupRow[] }) {
  const t = useTranslations("dashboard.newsletter");
  const [isPending, startTransition] = useTransition();

  const onMarkHandled = (email: string) => {
    const toastId = toast.loading(t("toast-mark-loading"));

    startTransition(async () => {
      try {
        await markHandledAction({ email });
        toast.success(t("toast-mark-success"), { id: toastId });
      } catch (err) {
        console.error(err);
        toast.error(t("toast-mark-error"), { id: toastId });
      }
    });
  };

  const onCopy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success(t("toast-copy-success"));
    } catch {
      toast.error(t("toast-copy-error"));
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("th-email")}</TableHead>
            <TableHead>{t("th-status")}</TableHead>
            <TableHead>{t("th-source")}</TableHead>
            <TableHead>{t("th-locale")}</TableHead>
            <TableHead>{t("th-date")}</TableHead>
            <TableHead className="text-right">{t("th-actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.email}</TableCell>
                <TableCell>
                  {r.handledAt ? (
                    <Badge className="bg-green-100 text-green-800">
                      {t("status-handled")}
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {t("status-pending")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.source || t("empty")}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.locale || t("empty")}
                </TableCell>
                <TableCell>
                  {r.createdAt instanceof Date
                    ? r.createdAt.toLocaleDateString()
                    : new Date(r.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(r.email)}
                    disabled={isPending}
                  >
                    {t("copy")}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onMarkHandled(r.email)}
                    disabled={isPending || !!r.handledAt}
                  >
                    {t("mark")}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {t("empty-state")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isPending ? (
        <p className="text-sm text-muted-foreground mt-3">{t("updating")}</p>
      ) : null}
    </div>
  );
}
