"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getCategoriesPosts } from "@/app/[locale]/actions/posts";

export function SearchPost() {
  const t = useTranslations("search");
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
          placeholder={t("postsPlaceholder")}
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
          <SelectValue placeholder={t("statusPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("statusAll")}</SelectItem>
          <SelectItem value="published">{t("statusPublished")}</SelectItem>
          <SelectItem value="draft">{t("statusDraft")}</SelectItem>
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
          <SelectValue placeholder={t("categoryPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("categoryAll")}</SelectItem>
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
