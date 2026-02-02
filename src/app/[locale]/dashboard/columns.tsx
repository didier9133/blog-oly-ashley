"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { deletePost } from "../actions/posts";
import { toast } from "sonner";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

type Post = {
  category: {
    id: number;
    name: string;
  };
  author: {
    id: string;
    email: string;
    name: string | null;
  };
  id: number;

  title_es: string;
  title_en: string;
  content_es: string | null;
  content_en: string | null;

  image: string;
  updatedAt: Date;
  slug_es: string;
  slug_en: string;
  subcategoryId: number;
  published: boolean;
  categoryId: number;
};

type TFn = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

const statusColors = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
};

export function createPostColumns(t: TFn): ColumnDef<Post>[] {
  const statusLabels = {
    published: t("status.published"),
    draft: t("status.draft"),
  };

  const labelsSonnerPosts = {
    success: t("toast.delete.success"),
    error: t("toast.delete.error"),
    loading: t("toast.delete.loading"),
  };

  async function handleDeletePost(id: number) {
    try {
      toast.loading(labelsSonnerPosts.loading);
      await deletePost(id);
      toast.dismiss();
      toast.success(labelsSonnerPosts.success);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(labelsSonnerPosts.error);
    }
  }

  const viewLabel = t("actions.view");
  const editLabel = t("actions.edit");
  const deleteLabel = t("actions.delete");
  const previewLabel = t("preview");

  const sanitizeContent = (content: string | null): ReactNode =>
    DOMPurify.sanitize(content || "", {
      ALLOWED_TAGS: [],
    });

  return [
    {
      accessorKey: "title",
      header: t("th.title"),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title_es}</div>
          <div className="text-sm text-gray-400 mt-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">
            {sanitizeContent(row.original.content_es)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "autor",
      header: t("th.author"),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.author.name}</div>
      ),
    },
    {
      accessorKey: "categoryId",
      header: t("th.category"),
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="capitalize">
            {row.original.category.name}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        if (typeof value !== "number") {
          value = parseInt(value, 10);
        }
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: "published",
      header: t("th.status"),
      cell: ({ row }) => {
        return (
          <Badge
            className={
              row.original.published
                ? statusColors.published
                : statusColors.draft
            }
          >
            {row.original.published
              ? statusLabels.published
              : statusLabels.draft}
          </Badge>
        );
      },
    },
    {
      accessorKey: "fecha",
      header: t("th.date"),
      cell: ({ row }) => (
        <>
          {row.original.updatedAt instanceof Date
            ? row.original.updatedAt.toLocaleDateString()
            : new Date(row.original.updatedAt).toLocaleDateString()}
        </>
      ),
    },
    {
      accessorKey: "acciones",
      header: t("th.actions"),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t("menuLabel")}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`/${row.original.category.name}/${row.original.slug_en}`}
              className="flex items-center"
              aria-label={previewLabel}
            >
              <DropdownMenuItem className="w-full cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                {viewLabel}
              </DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/edit/${row.original.id}`}>
              <DropdownMenuItem className="w-full cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                {editLabel}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-red-600 w-full cursor-pointer"
              onClick={() => handleDeletePost(row.original.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteLabel}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
