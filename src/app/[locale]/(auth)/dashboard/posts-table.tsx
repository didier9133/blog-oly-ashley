"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { DataTable } from "./data-table";
import { createPostColumns, type DashboardPost } from "./columns";

type PostsTableProps = {
  data: DashboardPost[];
};

export default function PostsTable({ data }: PostsTableProps) {
  const t = useTranslations("dashboard.postsColumns");
  const columns = useMemo(() => createPostColumns(t), [t]);

  return <DataTable columns={columns} data={data} />;
}
