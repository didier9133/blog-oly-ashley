"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { DataTable } from "./data-table";
import { createPostColumns } from "./columns";

type PostsTableProps = {
  // Keeping this broad because Next serializes Dates as strings.
  // The DataTable/columns already handle that case.
  data: any[];
};

export default function PostsTable({ data }: PostsTableProps) {
  const t = useTranslations("dashboard.postsColumns");
  const columns = useMemo(() => createPostColumns(t), [t]);

  return <DataTable columns={columns} data={data} />;
}
