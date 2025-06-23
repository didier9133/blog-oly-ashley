"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getCategoriesPosts } from "@/app/actions/posts";

export function SearchPost() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "",
    categoryFilter: "",
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategoriesPosts();
        setCategories(categoriesData);
        console.log("Fetched categories:", categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Buscar por título, autor o contenido..."
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              searchTerm: e.target.value,
            }))
          }
          className="w-full"
        />
      </div>
      <Select
        value={filters.statusFilter}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            statusFilter: value === "all" ? "" : value,
          }))
        }
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="published">Publicado</SelectItem>
          <SelectItem value="draft">Borrador</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.categoryFilter}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            categoryFilter: value === "all" ? "" : value,
          }))
        }
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.name}
              className="capitalize"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
