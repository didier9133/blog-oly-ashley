"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import ImageRecentBlog from "@/components/image-recent-post";

export interface RecentPostItem {
  id: number;
  title_en: string;
  title_es: string;
  image: string | null;
  slug_en: string;
  updatedAt: Date | string;
  subcategoryId: number | null;
}

interface RecentPostsListProps {
  posts: RecentPostItem[];
  currentSubcategoryId: number | null;
  currentLanguage: string;
  pathPrefix: "writing" | "recipes";
  recentPostsLabel: string;
  noPostsLabel: string;
  limit?: number;
}

export function RecentPostsList({
  posts,
  currentSubcategoryId,
  currentLanguage,
  pathPrefix,
  recentPostsLabel,
  noPostsLabel,
  limit = 5,
}: RecentPostsListProps) {
  const searchParams = useSearchParams();
  const filterCategory = searchParams?.get("category");
  const filterId = filterCategory
    ? Number(filterCategory)
    : currentSubcategoryId;

  const filtered = useMemo(
    () =>
      posts
        .filter((p) => p.subcategoryId === filterId)
        .slice(0, limit),
    [posts, filterId, limit],
  );

  return (
    <>
      <h3 className="text-base font-semibold mb-2 transition-colors duration-700">
        {recentPostsLabel}
      </h3>
      <ul className="space-y-4">
        {filtered.map((recent) => {
          const title =
            currentLanguage === "en" ? recent.title_en : recent.title_es;
          const updatedAt =
            recent.updatedAt instanceof Date
              ? recent.updatedAt
              : new Date(recent.updatedAt);
          return (
            <li key={recent.id}>
              <Link
                href={`/${pathPrefix}/${recent.slug_en}`}
                className="flex items-center gap-2"
              >
                <ImageRecentBlog
                  post={{
                    title,
                    image: recent.image ?? "",
                  }}
                />
                <div>
                  <div className="font-medium text-xs text-primary line-clamp-2">
                    {title}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {updatedAt.toLocaleDateString(currentLanguage, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">{noPostsLabel}</p>
      )}
    </>
  );
}
