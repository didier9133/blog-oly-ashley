"use client";

import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getCategoriesPosts } from "../actions/posts";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("dashboard.postsTable");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategoriesPosts();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div>
      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t("search-title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("search-placeholder")}
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) => {
                  return table
                    .getColumn("title")
                    ?.setFilterValue(event.target.value);
                }}
                className="w-full"
              />
            </div>

            <Select
              value={
                table.getColumn("published")?.getFilterValue() === undefined
                  ? "all"
                  : table.getColumn("published")?.getFilterValue() === true
                    ? "published"
                    : "draft"
              }
              onValueChange={(value) => {
                return table
                  .getColumn("published")
                  ?.setFilterValue(
                    value === "all"
                      ? undefined
                      : value === "published"
                        ? true
                        : false
                  );
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("status-placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("status-all")}</SelectItem>
                <SelectItem value="published">{t("status-published")}</SelectItem>
                <SelectItem value="draft">{t("status-draft")}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                table.getColumn("categoryId")?.getFilterValue() !== undefined
                  ? String(table.getColumn("categoryId")?.getFilterValue())
                  : "all"
              }
              onValueChange={(value) => {
                table
                  .getColumn("categoryId")
                  ?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("category-placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("category-all")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                    className="capitalize"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("posts-title", {
              count: data.length,
              resultsLabel:
                data.length === 1 ? t("result-singular") : t("result-plural"),
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("no-results")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("next")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
