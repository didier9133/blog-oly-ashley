"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { DataTable } from "./data-table";
import { createPostColumns, type DashboardPost } from "./columns";

type PostsTableProps = {
  data: DashboardPost[];
};

export default function PostsTable({ data }: PostsTableProps) {
  const t = useTranslations("dashboard.postsColumns");
  const locale = useLocale();
  const columns = useMemo(() => createPostColumns(t, locale), [locale, t]);

  return <DataTable columns={columns} data={data} />;
}
