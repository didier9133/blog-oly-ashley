"use client";

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
  title: string;
  content: string | null;
  image: string;
  updatedAt: Date;
  slug: string;
  subcategoryId: number;
  published: boolean;
  categoryId: number;
};

const statusLabels = {
  published: "Publicado",
  draft: "Borrador",
};
const statusColors = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
};

export const labelsSonnerPosts = {
  success: "Post eliminado correctamente",
  error: "Error al eliminar el post",
  loading: "Eliminando post...",
};

export async function handleDeletePost(id: number) {
  try {
    toast.loading(labelsSonnerPosts.loading);
    await deletePost(id);
    toast.dismiss();
    toast.success(labelsSonnerPosts.success);
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    toast.error(labelsSonnerPosts.error);
  }
}

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.title}</div>
        <div className="text-sm text-gray-400 mt-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">
          {/* Sanitizing content to prevent XSS attacks */}
          {DOMPurify.sanitize(row.original.content || "", {
            ALLOWED_TAGS: [],
          })}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "autor",
    header: "Autor",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.author.name}</div>
    ),
  },
  {
    accessorKey: "categoryId",
    header: "Categoría",
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
    header: "Estado",
    cell: ({ row }) => {
      return (
        <Badge
          className={
            row.original.published ? statusColors.published : statusColors.draft
          }
        >
          {row.original.published ? statusLabels.published : statusLabels.draft}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
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
    header: "Acciones",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link
            href={`/${row.original.category.name}/${row.original.slug}`}
            className="flex items-center"
          >
            <DropdownMenuItem className="w-full cursor-pointer">
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/edit/${row.original.id}`}>
            <DropdownMenuItem className="w-full cursor-pointer">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="text-red-600 w-full cursor-pointer"
            onClick={() => handleDeletePost(row.original.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
